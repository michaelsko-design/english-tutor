/**
 * POST /api/subscription  {action, subscriptionId, childUid?}: the paying parent manages their Pro
 * plan (docs/feature-pro-tier.md, "Pricing and seats").
 * - `cancel`: stops a monthly plan's recurring charge; Pro stays on until periodEnd.
 * - `addChild` / `removeChild`: changes the seats under `proBilling.ts`'s rules; a monthly plan's
 *   new price applies from its next charge. A removed child keeps Pro until periodEnd, at most a month.
 * The gateway is changed first and the records after, so a refused gateway call changes nothing.
 */
import { ConflictError, createFirestoreAdmin, type DocumentWrite, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import {
  authenticateParent,
  errorResponse,
  isParentLinked,
  jsonResponse,
  readJsonBody,
  type ParentCaller,
  type ParentRequestDeps,
} from './_lib/parentRequest.js';
import { createPaymentProvider } from './_lib/payments/index.js';
import { PaymentError, type PaymentProvider } from './_lib/payments/provider.js';
import {
  addChildToSubscription,
  addPeriods,
  CHECKOUT_ID_PATTERN,
  entitlementFields,
  holdsLiveSeat,
  readSubscription,
  removeChildFromSubscription,
  subscriptionFields,
  UID_PATTERN,
  type SeatChange,
  type Subscription,
} from './_lib/proBilling.js';

const MAX_BODY_BYTES = 512;
const ACTIONS = ['cancel', 'addChild', 'removeChild'] as const;
type Action = (typeof ACTIONS)[number];

export interface SubscriptionDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  createProvider?: typeof createPaymentProvider;
}

interface SubscriptionBody {
  action: Action;
  subscriptionId: string;
  childUid: string;
}

async function readBody(request: Request): Promise<SubscriptionBody | null> {
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  if (!body || !ACTIONS.includes(body.action as Action)) return null;
  if (typeof body.subscriptionId !== 'string' || !CHECKOUT_ID_PATTERN.test(body.subscriptionId)) return null;
  const action = body.action as Action;
  const childUid = typeof body.childUid === 'string' ? body.childUid : '';
  if (action !== 'cancel' && !UID_PATTERN.test(childUid)) return null;
  return { action, subscriptionId: body.subscriptionId, childUid };
}

function saveWrites(sub: Subscription, nowMs: number, extra: DocumentWrite[] = []): DocumentWrite[] {
  return [
    {
      collection: 'subscriptions',
      id: sub.id,
      fields: subscriptionFields(sub, nowMs),
      ...(sub.updateTime ? { precondition: { updateTime: sub.updateTime } } : {}),
    },
    ...sub.childUids.map((childUid) => ({ collection: 'entitlements', id: childUid, fields: entitlementFields(sub, nowMs) })),
    ...extra,
  ];
}

interface ActionContext {
  sub: Subscription;
  body: SubscriptionBody;
  admin: FirestoreAdmin;
  provider: PaymentProvider;
  caller: ParentCaller;
  fetchImpl: typeof fetch;
  nowMs: number;
}

async function cancel({ sub, admin, provider, nowMs }: ActionContext): Promise<Response> {
  if (sub.status === 'canceled') return jsonResponse(200, { ok: true });
  if (sub.period === 'yearly') return errorResponse(409, 'A yearly plan does not renew, so there is nothing to cancel');
  await provider.updateRecurring(sub.billing, { cancel: true });
  await admin.commit(saveWrites({ ...sub, status: 'canceled' }, nowMs));
  return jsonResponse(200, { ok: true });
}

/** Changes the gateway's amount, then saves; if the save loses a race, the gateway amount goes back. */
async function applySeatChange(context: ActionContext, change: SeatChange, extra: DocumentWrite[]): Promise<Response> {
  if (!change.ok) return errorResponse(change.status, change.error);
  const { sub, admin, provider, nowMs } = context;
  const changesAmount = change.amountChanged && sub.period === 'monthly';
  if (changesAmount) await provider.updateRecurring(sub.billing, { amountAgorot: change.sub.amountAgorot });
  try {
    await admin.commit(saveWrites(change.sub, nowMs, extra));
  } catch (error) {
    if (changesAmount) await provider.updateRecurring(sub.billing, { amountAgorot: sub.amountAgorot }).catch(() => undefined);
    if (error instanceof ConflictError) return errorResponse(409, 'The plan changed, try again');
    throw error;
  }
  return jsonResponse(200, { ok: true, amountAgorot: change.sub.amountAgorot, seatLimit: change.sub.seatLimit });
}

async function addChild(context: ActionContext): Promise<Response> {
  const { sub, body, admin, caller, fetchImpl, nowMs } = context;
  if (body.childUid === caller.parentUid) return errorResponse(403, 'Not allowed');
  if (!(await isParentLinked(caller, body.childUid, fetchImpl))) return errorResponse(403, 'This parent is not linked to that learner');
  if (holdsLiveSeat(await admin.getDocument('entitlements', body.childUid), nowMs, sub.id)) {
    return errorResponse(409, 'This child already has Pro');
  }
  return applySeatChange(context, addChildToSubscription(sub, body.childUid, nowMs), []);
}

async function removeChild(context: ActionContext): Promise<Response> {
  const { sub, body, nowMs } = context;
  const change = removeChildFromSubscription(sub, body.childUid, nowMs);
  // The removed child keeps Pro, with no seat, until periodEnd but at most a month: swapping
  // children must not hand a yearly plan's remaining months to every child who passes through it
  const leavingPeriodEnd = Math.min(sub.periodEnd, addPeriods(nowMs, 'monthly'));
  const leaving: DocumentWrite[] = change.ok
    ? [{
        collection: 'entitlements',
        id: body.childUid,
        fields: { ...entitlementFields(change.sub, nowMs, 'canceled'), periodEnd: leavingPeriodEnd },
      }]
    : [];
  return applySeatChange(context, change, leaving);
}

const HANDLERS: Record<Action, (context: ActionContext) => Promise<Response>> = { cancel, addChild, removeChild };

export async function handleSubscriptionRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: SubscriptionDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, createProvider = createPaymentProvider } = deps;
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;
  const body = await readBody(request);
  if (!body) return errorResponse(400, 'Invalid request');

  const provider = createProvider(env, fetchImpl);
  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!provider || !account) return errorResponse(503, 'Payments are not configured');

  try {
    const admin = createAdmin(account, caller.projectId, { fetchImpl });
    const sub = readSubscription(await admin.getDocument('subscriptions', body.subscriptionId));
    // Someone else's plan looks the same as a missing one
    if (!sub || sub.payerParentUid !== caller.parentUid) return errorResponse(404, 'Plan not found');
    return await HANDLERS[body.action]({ sub, body, admin, provider, caller, fetchImpl, nowMs: nowMs() });
  } catch (error) {
    const detail = error instanceof AdminError ? error.status : error instanceof PaymentError ? `gateway ${error.code}` : 'unexpected';
    console.error(`subscription: failed (${detail})`);
    return errorResponse(502, 'The plan could not be changed');
  }
}

export function POST(request: Request): Promise<Response> {
  return handleSubscriptionRequest(request, process.env);
}
