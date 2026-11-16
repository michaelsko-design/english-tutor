/**
 * POST /api/payment-webhook?source=process|account&key=<PAYMENT_WEBHOOK_SECRET>: the gateway tells
 * us about payments (docs/feature-pro-tier.md, "Server").
 * - `process`: a payment page was paid. The body is never trusted: the checkout id (`&checkout=` in
 *   the address, else cField1) only says which checkout to look at, and the payment is confirmed
 *   against that checkout's own process ids: by asking the gateway (Grow's API), or by the link's
 *   secret token in the notice (Grow through Make). Then one atomic write creates the payment record
 *   (once), the subscription and every child's entitlement, and the gateway is acknowledged.
 * - `account`: Grow's account webhooks: a monthly charge after the first (extends the plan by a
 *   month) or a failed one (marks it past due). A charge for a standing order we don't know yet is
 *   linked to the one monthly plan that fits its payer and amount, or left as an owner task.
 * Work only the owner can do in Grow (a refund, a cancel or price change through Make) becomes a
 * `gatewayTasks` record. Answers 200 for anything it will never act on, so the gateway stops retrying.
 */
import { ConflictError, createFirestoreAdmin, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import { errorResponse, firebaseProjectId, jsonResponse } from './_lib/parentRequest.js';
import { chargesLeft, extendTask, gatewayTaskWrite, readPayer, recurringChangeTask, type NewGatewayTask } from './_lib/gatewayTasks.js';
import { parseGrowAccountWebhook, type GrowAccountEvent } from './_lib/payments/grow.js';
import { createPaymentProvider } from './_lib/payments/index.js';
import { changesRecurringByApi, PaymentError, safeEqual, type PaymentProvider } from './_lib/payments/provider.js';
import {
  addPeriods,
  CHECKOUT_ID_PATTERN,
  entitlementFields,
  holdsLiveSeat,
  readCheckout,
  readSubscription,
  renewableSeatEnd,
  subscriptionFields,
  type Checkout,
  type Subscription,
} from './_lib/proBilling.js';
import type { DocumentWrite } from './_lib/firestoreAdmin.js';
import { proPriceAgorot } from '../src/config/proTier.js';

const MAX_BODY_BYTES = 16 * 1024;
const DAY_MS = 24 * 60 * 60 * 1000;
/** A monthly renewal earlier than this before periodEnd is not a renewal (e.g. the first charge again) */
const RENEWAL_WINDOW_DAYS = 10;

export interface WebhookDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  createProvider?: typeof createPaymentProvider;
}

const ignored = (reason: string) => jsonResponse(200, { ok: true, ignored: reason });

/** Every leaf of a JSON body or form fields such as `data[customFields][cField1]`, by its last key */
function flattenLeaves(value: unknown, into: Record<string, string> = {}): Record<string, string> {
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === 'object') flattenLeaves(child, into);
      else if (typeof child === 'string' || typeof child === 'number') into[key] = String(child).trim();
    }
  }
  return into;
}

async function readFields(request: Request): Promise<Record<string, string> | null> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  const type = request.headers.get('Content-Type') ?? '';
  if (type.includes('application/json')) {
    try {
      return flattenLeaves(JSON.parse(text));
    } catch {
      return null;
    }
  }
  if (type.includes('multipart/form-data')) {
    const form = await new Response(text, { headers: { 'Content-Type': type } }).formData().catch(() => null);
    if (!form) return null;
    return Object.fromEntries([...form.entries()].map(([key, value]) => [key.replace(/^.*\[([^\]]*)\]$/, '$1'), String(value).trim()]));
  }
  const params = new URLSearchParams(text);
  return Object.fromEntries([...params.entries()].map(([key, value]) => [key.replace(/^.*\[([^\]]*)\]$/, '$1'), value.trim()]));
}

/** Each seat's entitlement as it was read: a write over it must find it unchanged */
type SeatVersions = Map<string, string | null>;

function activationWrites(
  checkout: Checkout,
  sub: Subscription,
  provider: PaymentProvider,
  payment: { transactionId: string; seatedElsewhere: string[]; seatVersions: SeatVersions },
  nowMs: number
): DocumentWrite[] {
  const { transactionId, seatedElsewhere, seatVersions } = payment;
  const writes: DocumentWrite[] = [
    {
      collection: 'payments',
      id: `${provider.id}_${transactionId}`,
      precondition: { exists: false },
      // Children who got Pro on another plan meanwhile are listed for a manual refund
      fields: { subscriptionId: sub.id, kind: 'initial', amountAgorot: checkout.amountAgorot, at: nowMs, seatedElsewhere },
    },
    { collection: 'subscriptions', id: sub.id, precondition: { exists: false }, fields: subscriptionFields(sub, nowMs) },
    { collection: 'checkouts', id: checkout.id, mergeFields: ['status', 'paidAt'], fields: { status: 'paid', paidAt: nowMs } },
    // Another plan paid at the same moment can't take the same child: one of the two commits fails
    ...sub.childUids.map((childUid): DocumentWrite => {
      const version = seatVersions.get(childUid) ?? null;
      return {
        collection: 'entitlements',
        id: childUid,
        fields: entitlementFields(sub, nowMs),
        precondition: version ? { updateTime: version } : { exists: false },
      };
    }),
  ];
  if (sub.recurringRef) {
    writes.push({ collection: 'recurringRefs', id: `${provider.id}_${sub.recurringRef}`, fields: { subscriptionId: sub.id } });
  }
  return writes;
}

interface PlanTerms {
  seatLimit: number;
  amountAgorot: number;
  status: Subscription['status'];
  /** The recurring charge was opened for more children than got a seat */
  gatewayFix: { cancel: true } | { amountAgorot: number } | null;
}

/**
 * A plan's seats and price when some children got Pro on another plan before the payment: their
 * seats are not kept (they are refunded by hand), and a monthly charge drops to the price for the
 * children seated, or stops when none is.
 */
function planTerms(checkout: Checkout, seatedCount: number, isRecurring: boolean): PlanTerms {
  const paid: PlanTerms = { seatLimit: checkout.seatLimit, amountAgorot: checkout.amountAgorot, status: 'active', gatewayFix: null };
  if (seatedCount === checkout.childUids.length) return paid;
  if (checkout.period === 'yearly') return { ...paid, seatLimit: seatedCount };
  if (seatedCount === 0) {
    return { ...paid, seatLimit: 0, status: 'canceled', gatewayFix: isRecurring ? { cancel: true } : null };
  }
  const amountAgorot = proPriceAgorot(seatedCount, 'monthly') ?? checkout.amountAgorot;
  return { seatLimit: seatedCount, amountAgorot, status: 'active', gatewayFix: isRecurring ? { amountAgorot } : null };
}

/** Owner tasks for an activation: refunds for children seated elsewhere, and a standing-order change Make can't make */
async function activationTasks(
  admin: FirestoreAdmin,
  provider: PaymentProvider,
  sub: Subscription,
  terms: PlanTerms,
  payment: { transactionId: string; seatedElsewhere: string[] },
  nowMs: number
): Promise<DocumentWrite[]> {
  if (payment.seatedElsewhere.length === 0) return [];
  const payer = await readPayer(admin, sub.id);
  const tasks: NewGatewayTask[] = [{
    id: `refund_${provider.id}_${payment.transactionId}`,
    kind: 'refund',
    subscriptionId: sub.id,
    amountAgorot: 0,
    dueAt: 0,
    note: `${payment.seatedElsewhere.length} child(ren) already had Pro on another plan: refund their share of this payment`,
    ...payer,
  }];
  if (terms.gatewayFix && !changesRecurringByApi(provider)) tasks.push(recurringChangeTask(sub, terms.gatewayFix, payer));
  return tasks.map((task) => gatewayTaskWrite(task, nowMs));
}

async function handleProcessNotification(
  fields: Record<string, string>,
  checkoutIdInUrl: string,
  admin: FirestoreAdmin,
  provider: PaymentProvider,
  nowMs: number
): Promise<Response> {
  const checkoutId = checkoutIdInUrl || fields.cField1 || '';
  if (!CHECKOUT_ID_PATTERN.test(checkoutId)) return ignored('no checkout');
  const checkout = readCheckout(await admin.getDocument('checkouts', checkoutId));
  if (!checkout || !checkout.processId) return ignored('unknown checkout');
  // A page opened on one gateway is only ever confirmed by that gateway
  if (checkout.provider !== provider.id) return ignored('other gateway');
  if (checkout.status === 'paid') {
    // A repeat of the same notification is normal; a second charge for a paid checkout needs a look
    console.error('payment-webhook: duplicate payment on an already paid checkout');
    return ignored('already paid');
  }

  const payment = await provider.confirmPayment(checkout.period, { processId: checkout.processId, processToken: checkout.processToken }, fields);
  if (!payment) return ignored('not paid');
  if (payment.amountAgorot !== checkout.amountAgorot) {
    console.error('payment-webhook: amount does not match the checkout');
    return ignored('amount mismatch');
  }
  // A child can get Pro on another plan between this checkout and its payment: never take their seat
  const seatedElsewhere: string[] = [];
  // A renewed yearly plan starts where the old one ends, so no paid day is lost
  // Only a yearly checkout renews: a monthly one would push its first charge a year ahead of the plan
  let startsAt = nowMs;
  const renewedPlans = new Map<string, string[]>();
  const seatVersions: SeatVersions = new Map();
  for (const childUid of checkout.childUids) {
    const entitlement = await admin.getDocument('entitlements', childUid);
    seatVersions.set(childUid, entitlement?.updateTime ?? null);
    const renewedEnd = checkout.period === 'yearly' ? renewableSeatEnd(entitlement, checkout.parentUid, nowMs) : null;
    const oldPlanId = entitlement?.fields.subscriptionId;
    if (renewedEnd !== null && typeof oldPlanId === 'string') {
      startsAt = Math.max(startsAt, renewedEnd);
      renewedPlans.set(oldPlanId, [...(renewedPlans.get(oldPlanId) ?? []), childUid]);
    } else if (holdsLiveSeat(entitlement, nowMs)) {
      seatedElsewhere.push(childUid);
    }
  }
  if (seatedElsewhere.length > 0) console.error('payment-webhook: a child already has Pro, refund needed');
  const seated = checkout.childUids.filter((uid) => !seatedElsewhere.includes(uid));
  // Through Make a monthly plan is a standing order even before we learn its id
  const isRecurring = payment.recurringRef !== null || (checkout.period === 'monthly' && !changesRecurringByApi(provider));
  const terms = planTerms(checkout, seated.length, isRecurring);
  const sub: Subscription = {
    id: checkout.id,
    payerParentUid: checkout.parentUid,
    childUids: seated,
    seatLimit: terms.seatLimit,
    period: checkout.period,
    status: terms.status,
    periodEnd: addPeriods(startsAt, checkout.period),
    amountAgorot: terms.amountAgorot,
    provider: provider.id,
    recurringRef: payment.recurringRef,
    billing: payment.billing,
    lastRemovalAt: 0,
    lastSwapAt: 0,
    createdAt: nowMs,
  };
  // The renewed children leave their old plan, or a later change to it would rewrite their entitlement
  const oldPlanWrites: DocumentWrite[] = [];
  for (const [oldPlanId, renewed] of renewedPlans) {
    const old = readSubscription(await admin.getDocument('subscriptions', oldPlanId));
    if (!old) continue;
    oldPlanWrites.push({
      collection: 'subscriptions',
      id: old.id,
      fields: subscriptionFields({ ...old, childUids: old.childUids.filter((uid) => !renewed.includes(uid)) }, nowMs),
      ...(old.updateTime ? { precondition: { updateTime: old.updateTime } } : {}),
    });
  }
  const tasks = await activationTasks(admin, provider, sub, terms, { transactionId: payment.transactionId, seatedElsewhere }, nowMs);
  try {
    await admin.commit([
      ...activationWrites(checkout, sub, provider, { transactionId: payment.transactionId, seatedElsewhere, seatVersions }, nowMs),
      ...oldPlanWrites,
      ...tasks,
    ]);
  } catch (error) {
    if (!(error instanceof ConflictError)) throw error;
    // Recorded by a parallel notification, or something else blocked it: a 503 makes the gateway retry
    const recorded = await admin.getDocument('payments', `${provider.id}_${payment.transactionId}`);
    return recorded ? ignored('already recorded') : errorResponse(503, 'Try again');
  }
  try {
    await provider.acknowledge(checkout.period, payment);
  } catch (error) {
    // The gateway keeps the payment either way; only the acknowledgement is missing
    console.error(`payment-webhook: acknowledge failed (${error instanceof PaymentError ? error.code : 'unexpected'})`);
  }
  if (terms.gatewayFix && changesRecurringByApi(provider)) {
    try {
      await provider.updateRecurring(payment.billing, terms.gatewayFix);
    } catch (error) {
      // Recorded already; the next charge would be for the children who were seated elsewhere
      console.error(`payment-webhook: recurring charge not reduced, fix it by hand (${error instanceof PaymentError ? error.code : 'unexpected'})`);
    }
  }
  return jsonResponse(200, { ok: true });
}

async function findSubscriptionByRef(admin: FirestoreAdmin, provider: string, ref: string): Promise<Subscription | null> {
  const link = await admin.getDocument('recurringRefs', `${provider}_${ref}`);
  const subscriptionId = link?.fields.subscriptionId;
  return typeof subscriptionId === 'string' ? readSubscription(await admin.getDocument('subscriptions', subscriptionId)) : null;
}

function updatedSubscriptionWrites(sub: Subscription, nowMs: number): DocumentWrite[] {
  return [
    {
      collection: 'subscriptions',
      id: sub.id,
      fields: subscriptionFields(sub, nowMs),
      ...(sub.updateTime ? { precondition: { updateTime: sub.updateTime } } : {}),
    },
    ...sub.childUids.map((childUid) => ({ collection: 'entitlements', id: childUid, fields: entitlementFields(sub, nowMs) })),
  ];
}

async function childrenStillFree(admin: FirestoreAdmin, sub: Subscription, nowMs: number): Promise<string[]> {
  const free: string[] = [];
  for (const childUid of sub.childUids) {
    if (!holdsLiveSeat(await admin.getDocument('entitlements', childUid), nowMs, sub.id)) free.push(childUid);
  }
  return free;
}

/** An Israeli mobile as the checkout stores it (05XXXXXXXX), or '' */
function israeliMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('972') ? `0${digits.slice(3)}` : digits;
  return /^05\d{8}$/.test(local) ? local : '';
}

/**
 * Grow through Make never tells us a new standing order's id: its first renewal or failure links it
 * to the one monthly plan with no id yet whose payer's phone (and email, when both have one) and,
 * for a renewal, amount match. Null when none or several fit.
 */
async function linkUnmatchedPlan(admin: FirestoreAdmin, event: GrowAccountEvent, nowMs: number): Promise<Subscription | null> {
  const phone = israeliMobile(event.payerPhone);
  if (!phone) return null;
  const email = event.payerEmail.trim().toLowerCase();
  const fits: Subscription[] = [];
  for (const doc of await admin.queryDocuments('checkouts', 'payerPhone', phone)) {
    const checkout = readCheckout(doc);
    if (!checkout || checkout.status !== 'paid' || checkout.period !== 'monthly' || checkout.provider !== 'grow') continue;
    const checkoutEmail = typeof doc.fields.payerEmail === 'string' ? doc.fields.payerEmail.trim().toLowerCase() : '';
    if (email && checkoutEmail && email !== checkoutEmail) continue;
    const sub = readSubscription(await admin.getDocument('subscriptions', checkout.id));
    if (!sub || sub.recurringRef || sub.period !== 'monthly') continue;
    if (event.kind === 'renewal' && event.amountAgorot !== sub.amountAgorot) continue;
    fits.push(sub);
  }
  if (fits.length !== 1) return null;
  const sub = fits[0];
  try {
    await admin.commit([
      { collection: 'recurringRefs', id: `grow_${event.recurringRef}`, precondition: { exists: false }, fields: { subscriptionId: sub.id } },
      {
        collection: 'subscriptions',
        id: sub.id,
        mergeFields: ['recurringRef', 'updatedAt'],
        fields: { recurringRef: event.recurringRef, updatedAt: nowMs },
        ...(sub.updateTime ? { precondition: { updateTime: sub.updateTime } } : {}),
      },
    ]);
  } catch (error) {
    // Linked by a parallel notification, or the plan changed: read whatever is there now
    if (!(error instanceof ConflictError)) throw error;
  }
  return findSubscriptionByRef(admin, 'grow', event.recurringRef);
}

/** A charge or failure we couldn't tie to a plan: the owner looks it up in Grow */
function unmatchedTask(event: GrowAccountEvent, nowMs: number): DocumentWrite {
  const ref = event.kind === 'renewal' ? event.paymentId : event.recurringRef;
  return gatewayTaskWrite({
    id: `unmatched_${event.kind}_${ref}`,
    kind: 'match_renewal',
    subscriptionId: '',
    amountAgorot: event.amountAgorot ?? 0,
    dueAt: 0,
    note: event.kind === 'renewal'
      ? `A standing-order charge (Grow ${event.recurringRef}) matched no plan: find the parent, or refund it`
      : `A failed standing-order charge (Grow ${event.recurringRef}) matched no plan: check it in Grow`,
    payerName: event.payerName,
    payerPhone: event.payerPhone,
    payerEmail: event.payerEmail,
  }, nowMs);
}

/**
 * A standing order opened through Make stops after `chargeLimit` charges: one charge before, the owner
 * gets a task to extend it. `renewed` is the plan after this renewal, whose payment isn't saved yet.
 */
async function extendWrites(admin: FirestoreAdmin, renewed: Subscription, chargeLimit: number | undefined, nowMs: number): Promise<DocumentWrite[]> {
  if (!chargeLimit || renewed.status !== 'active') return [];
  const chargesMade = (await admin.queryDocuments('payments', 'subscriptionId', renewed.id)).length + 1;
  if (chargesLeft(chargesMade, chargeLimit) !== 1) return [];
  return [gatewayTaskWrite(extendTask(renewed, chargesMade, chargeLimit, await readPayer(admin, renewed.id)), nowMs)];
}

async function handleAccountEvent(
  event: GrowAccountEvent,
  admin: FirestoreAdmin,
  nowMs: number,
  chargeLimit: number | undefined
): Promise<Response> {
  const sub = (await findSubscriptionByRef(admin, 'grow', event.recurringRef)) ?? (await linkUnmatchedPlan(admin, event, nowMs));
  if (!sub) {
    await admin.commit([unmatchedTask(event, nowMs)]);
    return ignored('unknown recurring charge');
  }
  if (event.kind === 'failed') {
    if (sub.status !== 'active') return ignored('not active');
    await admin.commit(updatedSubscriptionWrites({ ...sub, status: 'past_due' }, nowMs));
    return jsonResponse(200, { ok: true });
  }
  const paymentId = `grow_${event.paymentId}`;
  if (await admin.getDocument('payments', paymentId)) return ignored('already recorded');
  if (nowMs < sub.periodEnd - RENEWAL_WINDOW_DAYS * DAY_MS) return ignored('renewal not due');
  if (event.amountAgorot < sub.amountAgorot) {
    // A 503 makes Grow retry: a seat upgrade can land here just before the gateway's own price update
    console.error('payment-webhook: renewal amount is below the plan, not extending');
    return errorResponse(503, 'Renewal amount is below the plan');
  }
  if (event.amountAgorot !== sub.amountAgorot) console.error('payment-webhook: renewal amount differs from the plan');
  // A late charge on a plan the reconcile expired brings it back, but not over a seat on a newer plan
  const childUids = sub.status === 'expired' ? await childrenStillFree(admin, sub, nowMs) : sub.childUids;
  if (childUids.length < sub.childUids.length) console.error('payment-webhook: a child moved to another plan, refund needed');
  const renewed: Subscription = {
    ...sub,
    childUids,
    status: sub.status === 'canceled' ? 'canceled' : 'active',
    periodEnd: addPeriods(Math.max(sub.periodEnd, nowMs), 'monthly'),
  };
  // Charged after the parent cancelled: the standing order is still running in Grow
  const refund = sub.status === 'canceled'
    ? [gatewayTaskWrite({
      id: `refund_${paymentId}`,
      kind: 'refund',
      subscriptionId: sub.id,
      amountAgorot: event.amountAgorot,
      dueAt: 0,
      note: 'Charged after the plan was cancelled: refund this charge and cancel the standing order in Grow',
      ...(await readPayer(admin, sub.id)),
    }, nowMs)]
    : [];
  if (refund.length > 0) console.error('payment-webhook: a canceled plan was charged, refund needed');
  const extend = await extendWrites(admin, renewed, chargeLimit, nowMs);
  try {
    await admin.commit([
      ...refund,
      ...extend,
      {
        collection: 'payments',
        id: paymentId,
        precondition: { exists: false },
        fields: { subscriptionId: sub.id, kind: 'renewal', amountAgorot: event.amountAgorot, at: nowMs },
      },
      ...updatedSubscriptionWrites(renewed, nowMs),
    ]);
  } catch (error) {
    if (!(error instanceof ConflictError)) throw error;
    // Recorded meanwhile, or the plan changed under us: a 503 makes Grow retry the latter
    return (await admin.getDocument('payments', paymentId)) ? ignored('already recorded') : errorResponse(503, 'Try again');
  }
  return jsonResponse(200, { ok: true });
}

export async function handlePaymentWebhook(
  request: Request,
  env: Record<string, string | undefined>,
  { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, createProvider = createPaymentProvider }: WebhookDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  const url = new URL(request.url);
  if (!safeEqual(url.searchParams.get('key') ?? '', env.PAYMENT_WEBHOOK_SECRET ?? '')) return errorResponse(401, 'Unauthorized');

  const provider = createProvider(env, fetchImpl);
  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!provider || !account) return errorResponse(503, 'Payments are not configured');
  const fields = await readFields(request);
  if (!fields) return errorResponse(400, 'Invalid request');

  try {
    const admin = createAdmin(account, firebaseProjectId(env), { fetchImpl });
    const source = url.searchParams.get('source');
    if (source === 'process') return await handleProcessNotification(fields, url.searchParams.get('checkout') ?? '', admin, provider, nowMs());
    if (source === 'account' && provider.id === 'grow') {
      const event = parseGrowAccountWebhook(fields, env.GROW_WEBHOOK_KEY ?? '');
      return event ? await handleAccountEvent(event, admin, nowMs(), provider.recurringChargeLimit) : ignored('not a known event');
    }
    return errorResponse(400, 'Invalid request');
  } catch (error) {
    // A non-200 makes the gateway retry later
    const detail = error instanceof AdminError ? error.status : error instanceof PaymentError ? `gateway ${error.code}` : 'unexpected';
    console.error(`payment-webhook: failed (${detail})`);
    return errorResponse(502, 'Webhook failed');
  }
}

export function POST(request: Request): Promise<Response> {
  return handlePaymentWebhook(request, process.env);
}
