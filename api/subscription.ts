/**
 * POST /api/subscription  {action, subscriptionId, childUid?}: the paying parent manages their Pro
 * plan (docs/feature-pro-tier.md, "Pricing and seats").
 * - `cancel`: stops a monthly plan's recurring charge; Pro stays on until periodEnd.
 * - `quoteCancel`: what cancelling with a refund would give back (`_lib/cancellation.ts`), changing nothing.
 * - `cancelWithRefund`: within 14 days of the payment (once per family) the whole payment back and Pro
 *   closes now; a yearly plan after that, paid − months started × the monthly price. It records the
 *   request (`refundRequests`), stops a monthly charge, and leaves the owner the refund task.
 * - `addChild` / `removeChild`: changes the seats under `proBilling.ts`'s rules; a monthly plan's
 *   new price applies from its next charge. A removed child keeps Pro until periodEnd, at most a month.
 *   A child who raises a monthly charge needs the parent's confirmation of the new amount
 *   (`confirmedAmountAgorot`), saved in `planConsents` (legal audit TOS-16).
 * - `startTrial` {childUid}: a linked parent starts a child's free Pro week (`_lib/proTrial.ts`).
 * The gateway is changed first and the records after, so a refused gateway call changes nothing.
 * A gateway that can't change a standing order (Grow through Make) gets an owner task instead, saved
 * in the same write as the plan.
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
import { handleProTrialRequest } from './_lib/proTrial.js';
import { changesRecurringByApi, PaymentError, type PaymentProvider } from './_lib/payments/provider.js';
import { gatewayTaskWrite, manualRecurringWrites, readPayer } from './_lib/gatewayTasks.js';
import { familyRefundId, FULL_REFUND_DAYS, hasFullRefund, quoteCancellation, type CancelQuote } from './_lib/cancellation.js';
import { TERMS_VERSION } from '../src/config/appInfo.js';
import { createOwnerAlerter, withOwnerAlerts } from './_lib/ownerAlerts.js';
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
  type SubscriptionStatus,
} from './_lib/proBilling.js';

const MAX_BODY_BYTES = 512;
const ACTIONS = ['cancel', 'quoteCancel', 'cancelWithRefund', 'addChild', 'removeChild'] as const;
type Action = (typeof ACTIONS)[number];
/** The actions about one child; the others are about the whole plan */
const CHILD_ACTIONS: readonly Action[] = ['addChild', 'removeChild'];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Far more than any plan costs: a confirmed amount above it is not a price */
const MAX_CONFIRMED_AGOROT = 1_000_000;

export interface SubscriptionDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  createProvider?: typeof createPaymentProvider;
}

interface SubscriptionBody {
  action: Action;
  subscriptionId: string;
  childUid: string;
  /** `addChild`: the new monthly amount the parent confirmed (0 when none was sent) */
  confirmedAmountAgorot: number;
}

/** A refusal the parent portal explains in its own words (`code`) */
const refusal = (status: number, error: string, code: string, extra: Record<string, unknown> = {}) =>
  jsonResponse(status, { error, code, ...extra });

async function readBody(request: Request): Promise<SubscriptionBody | null> {
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  if (!body || !ACTIONS.includes(body.action as Action)) return null;
  if (typeof body.subscriptionId !== 'string' || !CHECKOUT_ID_PATTERN.test(body.subscriptionId)) return null;
  const action = body.action as Action;
  const childUid = typeof body.childUid === 'string' ? body.childUid : '';
  if (CHILD_ACTIONS.includes(action) && !UID_PATTERN.test(childUid)) return null;
  const confirmed = body.confirmedAmountAgorot;
  const confirmedAmountAgorot =
    typeof confirmed === 'number' && Number.isInteger(confirmed) && confirmed > 0 && confirmed <= MAX_CONFIRMED_AGOROT ? confirmed : 0;
  return { action, subscriptionId: body.subscriptionId, childUid, confirmedAmountAgorot };
}

/** A child taking a seat, and their entitlement's version when it was read (null: none) */
interface NewSeat {
  childUid: string;
  version: string | null;
}

function saveWrites(
  sub: Subscription,
  nowMs: number,
  extra: DocumentWrite[] = [],
  newSeat?: NewSeat,
  seatStatus: SubscriptionStatus = sub.status
): DocumentWrite[] {
  // The new seat's entitlement must be unchanged since it was checked, or another plan took the child
  const seatPrecondition = (childUid: string) =>
    newSeat?.childUid === childUid ? { precondition: newSeat.version ? { updateTime: newSeat.version } : { exists: false as const } } : {};
  return [
    {
      collection: 'subscriptions',
      id: sub.id,
      fields: subscriptionFields(sub, nowMs),
      ...(sub.updateTime ? { precondition: { updateTime: sub.updateTime } } : {}),
    },
    ...sub.childUids.map((childUid) => ({
      collection: 'entitlements',
      id: childUid,
      fields: entitlementFields(sub, nowMs, seatStatus),
      ...seatPrecondition(childUid),
    })),
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
  if (sub.status === 'canceled' || sub.status === 'expired') return jsonResponse(200, { ok: true });
  if (sub.period === 'yearly') return errorResponse(409, 'A yearly plan does not renew, so there is nothing to cancel');
  if (!changesRecurringByApi(provider)) {
    const canceled: Subscription = { ...sub, status: 'canceled' };
    const tasks = await manualRecurringWrites(admin, sub, canceled, { cancel: true }, nowMs);
    await admin.commit(saveWrites(canceled, nowMs, tasks));
    return jsonResponse(200, { ok: true });
  }
  await provider.updateRecurring(sub.billing, { cancel: true });
  await admin.commit(saveWrites({ ...sub, status: 'canceled' }, nowMs));
  return jsonResponse(200, { ok: true });
}

/** The cancellation quote for this plan: its payment, its own request, and the family's earlier full refund */
async function loadQuote({ sub, admin, caller, nowMs }: ActionContext): Promise<CancelQuote> {
  const [checkout, request, familyRequests] = await Promise.all([
    admin.getDocument('checkouts', sub.id),
    admin.getDocument('refundRequests', sub.id),
    admin.queryDocuments('refundRequests', 'parentUid', caller.parentUid),
  ]);
  const paid = checkout?.fields.amountAgorot;
  // The checkout that started the plan is what was paid; without it, nothing is refunded here
  if (typeof paid !== 'number' || paid <= 0) return { mode: 'none', refundAgorot: 0, accessUntil: sub.periodEnd, reason: 'not_live' };
  return quoteCancellation({
    sub,
    paidAgorot: paid,
    nowMs,
    hasRequest: request !== null,
    hasUsedFullRefund: hasFullRefund(familyRequests),
  });
}

async function quoteCancel(context: ActionContext): Promise<Response> {
  return jsonResponse(200, { ok: true, ...(await loadQuote(context)) });
}

/**
 * Cancels with a refund (the quote's `full_refund`, or `yearly_prorata` with money back). The request
 * record is created once (a second call is refused), so a plan is refunded once.
 */
async function cancelWithRefund(context: ActionContext): Promise<Response> {
  const quote = await loadQuote(context);
  const isRefund = (quote.mode === 'full_refund' || quote.mode === 'yearly_prorata') && quote.refundAgorot > 0;
  if (!isRefund) return refusal(409, 'Nothing to refund on this plan', 'no_refund');
  const { sub, admin, provider, caller, nowMs } = context;
  const closed: Subscription = { ...sub, status: 'canceled', periodEnd: quote.accessUntil };
  // Pro that ends now closes at once (no grace days); otherwise it runs to accessUntil
  const seatStatus: SubscriptionStatus = quote.accessUntil <= nowMs ? 'expired' : 'canceled';
  const stopsCharges = sub.period === 'monthly' && sub.status !== 'canceled';
  const isManual = !changesRecurringByApi(provider);
  const cancelTasks = stopsCharges && isManual ? await manualRecurringWrites(admin, sub, closed, { cancel: true }, nowMs) : [];
  const refundTask = gatewayTaskWrite(
    {
      id: `${sub.id}_refund_cancel`,
      kind: 'refund',
      subscriptionId: sub.id,
      amountAgorot: quote.refundAgorot,
      dueAt: nowMs + FULL_REFUND_DAYS * DAY_MS,
      note: quote.mode === 'full_refund'
        ? 'Cancelled within 14 days: refund the whole payment (to the card, or by bank transfer if the wallet cannot)'
        : 'Yearly plan cancelled: refund paid minus months started at the monthly price (to the card, or by bank transfer)',
      ...(await readPayer(admin, sub.id)),
    },
    nowMs
  );
  const request: DocumentWrite = {
    collection: 'refundRequests',
    id: sub.id,
    precondition: { exists: false },
    fields: {
      parentUid: caller.parentUid,
      subscriptionId: sub.id,
      mode: quote.mode,
      amountAgorot: quote.refundAgorot,
      accessUntil: quote.accessUntil,
      requestedAt: nowMs,
    },
  };
  // The family's one full refund: created once, so two plans cancelled at the same moment can't both get it
  const familyGuard: DocumentWrite[] = quote.mode === 'full_refund'
    ? [{
        collection: 'refundRequests',
        id: familyRefundId(caller.parentUid),
        precondition: { exists: false },
        fields: { parentUid: caller.parentUid, subscriptionId: sub.id, mode: 'full_refund', requestedAt: nowMs },
      }]
    : [];
  try {
    await admin.commit(saveWrites(closed, nowMs, [...cancelTasks, refundTask, request, ...familyGuard], undefined, seatStatus));
  } catch (error) {
    if (!(error instanceof ConflictError)) throw error;
    const isRequested = (await admin.getDocument('refundRequests', sub.id)) !== null;
    return isRequested
      ? refusal(409, 'A refund was already requested', 'already_requested')
      : errorResponse(409, 'The plan changed, try again');
  }
  // The records are saved first, so a refused save never leaves the gateway cancelled; a refused
  // gateway call leaves the owner the cancel task instead
  if (stopsCharges && !isManual) {
    await provider.updateRecurring(sub.billing, { cancel: true }).catch(async () => {
      console.error('subscription: gateway cancel failed after a refund, owner task left');
      const tasks = await manualRecurringWrites(admin, sub, closed, { cancel: true }, nowMs);
      await admin.commit(tasks);
    });
  }
  return jsonResponse(200, { ok: true, mode: quote.mode, refundAgorot: quote.refundAgorot, accessUntil: quote.accessUntil });
}

/** Changes the gateway's amount, then saves; if the save loses a race, the gateway amount goes back. */
async function applySeatChange(context: ActionContext, change: SeatChange, extra: DocumentWrite[], newSeat?: NewSeat): Promise<Response> {
  if (!change.ok) return errorResponse(change.status, change.error);
  const { sub, admin, provider, nowMs } = context;
  const isManual = !changesRecurringByApi(provider);
  const changesAmount = change.amountChanged && sub.period === 'monthly' && !isManual;
  const tasks = change.amountChanged && sub.period === 'monthly' && isManual
    ? await manualRecurringWrites(admin, sub, change.sub, { amountAgorot: change.sub.amountAgorot }, nowMs)
    : [];
  if (changesAmount) await provider.updateRecurring(sub.billing, { amountAgorot: change.sub.amountAgorot });
  try {
    await admin.commit(saveWrites(change.sub, nowMs, [...extra, ...tasks], newSeat));
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
  const entitlement = await admin.getDocument('entitlements', body.childUid);
  if (holdsLiveSeat(entitlement, nowMs, sub.id)) return errorResponse(409, 'This child already has Pro');
  const newSeat = { childUid: body.childUid, version: entitlement?.updateTime ?? null };
  const change = addChildToSubscription(sub, body.childUid, nowMs);
  const raisesCharge = change.ok && sub.period === 'monthly' && change.sub.amountAgorot > sub.amountAgorot;
  if (!change.ok || !raisesCharge) return applySeatChange(context, change, [], newSeat);
  // A higher standing-order charge needs the parent's confirmation of the exact new amount
  if (body.confirmedAmountAgorot !== change.sub.amountAgorot) {
    return refusal(409, 'Confirm the new monthly price', 'confirm_price', { amountAgorot: change.sub.amountAgorot });
  }
  const consent: DocumentWrite = {
    collection: 'planConsents',
    id: `${sub.id}_add_${nowMs}`,
    fields: {
      parentUid: caller.parentUid,
      subscriptionId: sub.id,
      kind: 'add_child',
      childUid: body.childUid,
      fromAgorot: sub.amountAgorot,
      toAgorot: change.sub.amountAgorot,
      termsVersion: TERMS_VERSION,
      acceptedAt: nowMs,
    },
  };
  return applySeatChange(context, change, [consent], newSeat);
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

const HANDLERS: Record<Action, (context: ActionContext) => Promise<Response>> = {
  cancel,
  quoteCancel,
  cancelWithRefund,
  addChild,
  removeChild,
};

export async function handleSubscriptionRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: SubscriptionDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  // The free Pro week shares this function (Vercel's limit on functions): it has no plan yet
  const peek = (await request.clone().json().catch(() => null)) as { action?: unknown } | null;
  if (peek?.action === 'startTrial') return handleProTrialRequest(request, env, deps);
  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, createProvider = createPaymentProvider } = deps;
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;
  const body = await readBody(request);
  if (!body) return errorResponse(400, 'Invalid request');

  const provider = createProvider(env, fetchImpl);
  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!provider || !account) return errorResponse(503, 'Payments are not configured');

  try {
    const admin = withOwnerAlerts(createAdmin(account, caller.projectId, { fetchImpl }), createOwnerAlerter(env, fetchImpl));
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
