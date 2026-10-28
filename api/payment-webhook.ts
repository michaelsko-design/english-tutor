/**
 * POST /api/payment-webhook?source=process|account&key=<PAYMENT_WEBHOOK_SECRET>: the gateway tells
 * us about payments (docs/feature-pro-tier.md, "Server").
 * - `process`: a payment page was paid. The body is never trusted: the checkout id (cField1) only
 *   says which checkout to look at, and the payment is confirmed by asking the gateway about that
 *   checkout's own process ids. Then one atomic write creates the payment record (once), the
 *   subscription and every child's entitlement, and the gateway is acknowledged.
 * - `account`: Grow's account webhooks: a monthly charge after the first (extends the plan by a
 *   month) or a failed one (marks it past due). They carry Grow's `webhookKey`.
 * Answers 200 for anything it will never act on, so the gateway stops retrying it.
 */
import { ConflictError, createFirestoreAdmin, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import { errorResponse, firebaseProjectId, jsonResponse } from './_lib/parentRequest.js';
import { parseGrowAccountWebhook, type GrowAccountEvent } from './_lib/payments/grow.js';
import { createPaymentProvider } from './_lib/payments/index.js';
import { PaymentError, safeEqual, type PaymentProvider } from './_lib/payments/provider.js';
import {
  addPeriods,
  CHECKOUT_ID_PATTERN,
  entitlementFields,
  holdsLiveSeat,
  readCheckout,
  readSubscription,
  subscriptionFields,
  type Checkout,
  type Subscription,
} from './_lib/proBilling.js';
import type { DocumentWrite } from './_lib/firestoreAdmin.js';

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

function activationWrites(
  checkout: Checkout,
  sub: Subscription,
  provider: PaymentProvider,
  transactionId: string,
  seatedElsewhere: string[],
  nowMs: number
): DocumentWrite[] {
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
    ...sub.childUids.map((childUid) => ({ collection: 'entitlements', id: childUid, fields: entitlementFields(sub, nowMs) })),
  ];
  if (sub.recurringRef) {
    writes.push({ collection: 'recurringRefs', id: `${provider.id}_${sub.recurringRef}`, fields: { subscriptionId: sub.id } });
  }
  return writes;
}

async function handleProcessNotification(fields: Record<string, string>, admin: FirestoreAdmin, provider: PaymentProvider, nowMs: number): Promise<Response> {
  const checkoutId = fields.cField1 ?? '';
  if (!CHECKOUT_ID_PATTERN.test(checkoutId)) return ignored('no checkout');
  const checkout = readCheckout(await admin.getDocument('checkouts', checkoutId));
  if (!checkout || !checkout.processId) return ignored('unknown checkout');
  if (checkout.status === 'paid') return ignored('already paid');

  const payment = await provider.confirmPayment(checkout.period, { processId: checkout.processId, processToken: checkout.processToken });
  if (!payment) return ignored('not paid');
  if (payment.amountAgorot !== checkout.amountAgorot) {
    console.error('payment-webhook: amount does not match the checkout');
    return ignored('amount mismatch');
  }
  // A child can get Pro on another plan between this checkout and its payment: never take their seat
  const seatedElsewhere: string[] = [];
  for (const childUid of checkout.childUids) {
    if (holdsLiveSeat(await admin.getDocument('entitlements', childUid), nowMs)) seatedElsewhere.push(childUid);
  }
  if (seatedElsewhere.length > 0) console.error('payment-webhook: a child already has Pro, refund needed');
  const sub: Subscription = {
    id: checkout.id,
    payerParentUid: checkout.parentUid,
    childUids: checkout.childUids.filter((uid) => !seatedElsewhere.includes(uid)),
    seatLimit: checkout.seatLimit,
    period: checkout.period,
    status: 'active',
    periodEnd: addPeriods(nowMs, checkout.period),
    amountAgorot: checkout.amountAgorot,
    provider: provider.id,
    recurringRef: payment.recurringRef,
    billing: payment.billing,
    lastRemovalAt: 0,
    lastSwapAt: 0,
    createdAt: nowMs,
  };
  try {
    await admin.commit(activationWrites(checkout, sub, provider, payment.transactionId, seatedElsewhere, nowMs));
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

async function handleAccountEvent(event: GrowAccountEvent, admin: FirestoreAdmin, nowMs: number): Promise<Response> {
  const sub = await findSubscriptionByRef(admin, 'grow', event.recurringRef);
  if (!sub) return ignored('unknown recurring charge');
  if (event.kind === 'failed') {
    if (sub.status !== 'active') return ignored('not active');
    await admin.commit(updatedSubscriptionWrites({ ...sub, status: 'past_due' }, nowMs));
    return jsonResponse(200, { ok: true });
  }
  const paymentId = `grow_${event.paymentId}`;
  if (await admin.getDocument('payments', paymentId)) return ignored('already recorded');
  if (nowMs < sub.periodEnd - RENEWAL_WINDOW_DAYS * DAY_MS) return ignored('renewal not due');
  if (event.amountAgorot !== sub.amountAgorot) console.error('payment-webhook: renewal amount differs from the plan');
  const renewed: Subscription = {
    ...sub,
    status: sub.status === 'canceled' ? 'canceled' : 'active',
    periodEnd: addPeriods(Math.max(sub.periodEnd, nowMs), 'monthly'),
  };
  try {
    await admin.commit([
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
    if (source === 'process') return await handleProcessNotification(fields, admin, provider, nowMs());
    if (source === 'account' && provider.id === 'grow') {
      const event = parseGrowAccountWebhook(fields, env.GROW_WEBHOOK_KEY ?? '');
      return event ? await handleAccountEvent(event, admin, nowMs()) : ignored('not a known event');
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
