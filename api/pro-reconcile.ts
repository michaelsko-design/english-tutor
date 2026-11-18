/**
 * GET /api/pro-reconcile: the daily Pro reconcile, a Vercel Cron job (vercel.json) authenticated with
 * `Authorization: Bearer $CRON_SECRET` (docs/feature-pro-tier.md, "Phase 3a"). It frees the seats of
 * deleted accounts, deletes their entitlements, and marks ended plans and seats `expired`. A monthly
 * plan still `active` past its end is only reported (`missedRenewals`): its renewal webhook went
 * missing, and only the gateway can say whether it was charged. A gateway that can't change a
 * standing order (Grow through Make) gets an owner task instead; open tasks older than two days are
 * counted (`overdueTasks`), logged, and sent to the owner again as a reminder (`_lib/ownerAlerts.ts`).
 */
import { ConflictError, createFirestoreAdmin, type DocumentWrite, type FirestoreAdmin, type PlainDocument } from './_lib/firestoreAdmin.js';
import { AdminError, createAuthAdmin, parseServiceAccount } from './_lib/googleAdmin.js';
import { firebaseProjectId, jsonResponse } from './_lib/parentRequest.js';
import { createPaymentProvider } from './_lib/payments/index.js';
import { changesRecurringByApi, PaymentError, safeEqual, type PaymentProvider } from './_lib/payments/provider.js';
import { manualRecurringWrites, openGatewayTasks } from './_lib/gatewayTasks.js';
import { createOwnerAlerter, withOwnerAlerts } from './_lib/ownerAlerts.js';
import { entitlementFields, readSubscription, subscriptionFields, type Subscription } from './_lib/proBilling.js';
import { checkLapse, entitlementAction, repairForDeletedAccounts, type PlanRepair } from './_lib/proReconcile.js';

export interface ReconcileDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  findExistingUids?: (uids: string[]) => Promise<Set<string>>;
  createProvider?: typeof createPaymentProvider;
}

interface Tally {
  released: number;
  expired: number;
  deleted: number;
  missedRenewals: number;
  overdueTasks: number;
  failed: number;
}

/** An owner task still open after this long is reported */
const TASK_OVERDUE_MS = 2 * 24 * 60 * 60 * 1000;

const subscriptionWrite = (sub: Subscription, nowMs: number): DocumentWrite => ({
  collection: 'subscriptions',
  id: sub.id,
  fields: subscriptionFields(sub, nowMs),
  ...(sub.updateTime ? { precondition: { updateTime: sub.updateTime } } : {}),
});

/** Gateway first (as the parent's own changes do), then the plan and its remaining seats in one write. */
async function applyRepair(admin: FirestoreAdmin, provider: PaymentProvider | null, sub: Subscription, repair: PlanRepair, nowMs: number): Promise<boolean> {
  if (repair.gateway && !provider) return false;
  const isManual = Boolean(repair.gateway && provider && !changesRecurringByApi(provider));
  const tasks = isManual && repair.gateway ? await manualRecurringWrites(admin, sub, repair.next, repair.gateway, nowMs) : [];
  if (repair.gateway && !isManual) await provider!.updateRecurring(sub.billing, repair.gateway);
  try {
    await admin.commit([
      ...tasks,
      subscriptionWrite(repair.next, nowMs),
      ...repair.next.childUids.map((childUid) => ({ collection: 'entitlements', id: childUid, fields: entitlementFields(repair.next, nowMs) })),
    ]);
    return true;
  } catch (error) {
    // A price change goes back; a cancel can't, and the next run finds the plan canceled at the gateway only
    if (!isManual && repair.gateway && 'amountAgorot' in repair.gateway) {
      await provider!.updateRecurring(sub.billing, { amountAgorot: sub.amountAgorot }).catch(() => undefined);
    }
    if (error instanceof ConflictError) return false;
    throw error;
  }
}

async function reconcileSubscription(
  admin: FirestoreAdmin,
  provider: PaymentProvider | null,
  sub: Subscription,
  missingUids: ReadonlySet<string>,
  tally: Tally,
  nowMs: number
): Promise<void> {
  const repair = repairForDeletedAccounts(sub, missingUids);
  if (repair) {
    if (!(await applyRepair(admin, provider, sub, repair, nowMs))) {
      tally.failed += 1;
      return;
    }
    tally.released += 1;
    // Its version changed: the lapse check waits for the next run
    return;
  }
  const lapse = checkLapse(sub, nowMs);
  if (lapse === 'missed_renewal') tally.missedRenewals += 1;
  if (lapse !== 'expire') return;
  try {
    await admin.commit([subscriptionWrite({ ...sub, status: 'expired' }, nowMs)]);
    tally.expired += 1;
  } catch (error) {
    if (!(error instanceof ConflictError)) throw error;
    tally.failed += 1;
  }
}

async function reconcileEntitlement(admin: FirestoreAdmin, doc: PlainDocument, missingUids: ReadonlySet<string>, tally: Tally, nowMs: number): Promise<void> {
  const action = entitlementAction(doc, missingUids, nowMs);
  if (action === 'delete') {
    await admin.deleteDocument('entitlements', doc.id);
    tally.deleted += 1;
  } else if (action === 'expire') {
    try {
      await admin.commit([{
        collection: 'entitlements',
        id: doc.id,
        mergeFields: ['status', 'updatedAt'],
        fields: { status: 'expired', updatedAt: nowMs },
        ...(doc.updateTime ? { precondition: { updateTime: doc.updateTime } } : {}),
      }]);
      tally.expired += 1;
    } catch (error) {
      if (!(error instanceof ConflictError)) throw error;
      tally.failed += 1;
    }
  }
}

export async function handleProReconcileRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: ReconcileDeps = {}
): Promise<Response> {
  const secret = env.CRON_SECRET;
  if (!secret || !safeEqual(request.headers.get('authorization') ?? '', `Bearer ${secret}`)) return jsonResponse(401, { error: 'Unauthorized' });
  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return jsonResponse(503, { error: 'Reconcile is not configured' });

  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, createProvider = createPaymentProvider } = deps;
  const projectId = firebaseProjectId(env);
  const findExistingUids = deps.findExistingUids ?? ((uids: string[]) => createAuthAdmin(account, projectId, { fetchImpl }).findExistingUids(uids));
  const tally: Tally = { released: 0, expired: 0, deleted: 0, missedRenewals: 0, overdueTasks: 0, failed: 0 };

  try {
    const alert = createOwnerAlerter(env, fetchImpl);
    const admin = withOwnerAlerts(createAdmin(account, projectId, { fetchImpl }), alert);
    const now = nowMs();
    const subscriptions = (await admin.listDocuments('subscriptions')).map(readSubscription).filter((s): s is Subscription => s !== null);
    const entitlements = await admin.listDocuments('entitlements');
    const uids = [...new Set([
      ...entitlements.map((doc) => doc.id),
      ...subscriptions.filter((s) => s.status !== 'expired').flatMap((s) => [s.payerParentUid, ...s.childUids]),
    ])].filter(Boolean);
    const existing = await findExistingUids(uids);
    // No account found at all means a wrong project or a broken lookup: never delete on that
    if (uids.length > 0 && existing.size === 0) {
      console.error('pro-reconcile: no account found, nothing changed');
      return jsonResponse(502, { error: 'Reconcile failed' });
    }
    const missingUids = new Set(uids.filter((uid) => !existing.has(uid)));
    const provider = createProvider(env, fetchImpl);

    for (const sub of subscriptions) await reconcileSubscription(admin, provider, sub, missingUids, tally, now);
    for (const doc of entitlements) await reconcileEntitlement(admin, doc, missingUids, tally, now);
    const overdue = openGatewayTasks(await admin.listDocuments('gatewayTasks')).filter((task) => now - task.createdAt > TASK_OVERDUE_MS);
    tally.overdueTasks = overdue.length;
    // A daily reminder by email and WhatsApp until the owner marks it done
    await alert(overdue, { reminder: true });
  } catch (error) {
    // Only a status or gateway code is logged: never ids, tokens or keys
    const detail = error instanceof AdminError ? error.status : error instanceof PaymentError ? `gateway ${error.code}` : 'unexpected';
    console.error(`pro-reconcile: failed (${detail})`);
    return jsonResponse(502, { error: 'Reconcile failed', ...tally });
  }
  if (tally.missedRenewals > 0) console.error(`pro-reconcile: ${tally.missedRenewals} monthly plan(s) past their end with no renewal`);
  if (tally.overdueTasks > 0) console.error(`pro-reconcile: ${tally.overdueTasks} Grow task(s) open for more than 2 days (owner dashboard)`);
  return jsonResponse(200, { ...tally });
}

export function GET(request: Request): Promise<Response> {
  return handleProReconcileRequest(request, process.env);
}
