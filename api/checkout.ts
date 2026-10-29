/**
 * POST /api/checkout  {childUids, period, payerName, payerPhone, payerEmail?, dryRun?}: a paired
 * parent starts EnglishVibe Pro for 1–4 of their children (docs/feature-pro-tier.md). Every child's
 * pairing is checked as the parent; the price comes from `config/proTier.ts`, never from the client.
 * `dryRun` only returns the price. Otherwise it records `checkouts/{id}`, opens the gateway's payment
 * page and returns its URL; the payment itself is confirmed later by /api/payment-webhook.
 */
import { createFirestoreAdmin, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
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
import { holdsLiveSeat, renewableSeatEnd, UID_PATTERN } from './_lib/proBilling.js';
import { isBillingPeriod, MAX_LINKED_CHILDREN, MAX_PRO_SEATS, proPriceAgorot, type BillingPeriod } from '../src/config/proTier.js';

const MAX_BODY_BYTES = 2048;
const MAX_NAME_LENGTH = 60;
const MAX_EMAIL_LENGTH = 100;
/** Grow needs a first and last name, letters only (it refuses special characters) */
const PAYER_NAME_PATTERN = /^\p{L}+(?:['-]\p{L}+)*(?: \p{L}+(?:['-]\p{L}+)*)+$/u;
/** An Israeli mobile number, as Grow requires */
const PAYER_PHONE_PATTERN = /^05\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Unpaid payment pages one parent can open a day (each one opens a process at the gateway) */
export const MAX_PENDING_CHECKOUTS_PER_DAY = 5;

/** A refusal the parent portal explains in its own words (`code`), beyond what the status says */
const refusal = (status: number, error: string, code: string) => jsonResponse(status, { error, code });

export interface CheckoutDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  createProvider?: typeof createPaymentProvider;
  newId?: () => string;
}

interface CheckoutBody {
  childUids: string[];
  period: BillingPeriod;
  dryRun: boolean;
  payerName: string;
  payerPhone: string;
  payerEmail: string;
}

function readChildUids(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_PRO_SEATS) return null;
  if (!value.every((uid) => typeof uid === 'string' && UID_PATTERN.test(uid))) return null;
  const uids = value as string[];
  return new Set(uids).size === uids.length ? uids : null;
}

function readPayer(body: Record<string, unknown>): Pick<CheckoutBody, 'payerName' | 'payerPhone' | 'payerEmail'> | null {
  const payerName = typeof body.payerName === 'string' ? body.payerName.trim().replace(/\s+/g, ' ') : '';
  const payerPhone = typeof body.payerPhone === 'string' ? body.payerPhone.replace(/[\s-]/g, '') : '';
  const payerEmail = typeof body.payerEmail === 'string' ? body.payerEmail.trim() : '';
  if (payerName.length > MAX_NAME_LENGTH || !PAYER_NAME_PATTERN.test(payerName)) return null;
  if (!PAYER_PHONE_PATTERN.test(payerPhone)) return null;
  if (payerEmail && (payerEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(payerEmail))) return null;
  return { payerName, payerPhone, payerEmail };
}

async function readBody(request: Request): Promise<CheckoutBody | null> {
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  if (!body) return null;
  const childUids = readChildUids(body.childUids);
  if (!childUids || !isBillingPeriod(body.period)) return null;
  const dryRun = body.dryRun === true;
  if (dryRun) return { childUids, period: body.period, dryRun, payerName: '', payerPhone: '', payerEmail: '' };
  const payer = readPayer(body);
  return payer ? { childUids, period: body.period, dryRun, ...payer } : null;
}

/** Whether the parent is linked to more children than one family's plan is meant for */
async function hasTooManyLinks(admin: FirestoreAdmin, parentUid: string): Promise<boolean> {
  const links = await admin.queryDocuments('parentLinks', 'parentUid', parentUid);
  return links.length > MAX_LINKED_CHILDREN;
}

async function countRecentPendingCheckouts(admin: FirestoreAdmin, parentUid: string, nowMs: number): Promise<number> {
  const checkouts = await admin.queryDocuments('checkouts', 'parentUid', parentUid);
  return checkouts.filter((doc) => doc.fields.status === 'pending' && Number(doc.fields.createdAt) > nowMs - DAY_MS).length;
}

type SeatCheck = { ok: true } | { ok: false; response: Response };

/**
 * No child may hold a live seat, except on the parent's own yearly plan in its renew window. A
 * renewal starts at the old plan's end, so it renews one plan's children only: a new child or a
 * second plan in the same checkout would get the days until then for free.
 */
async function checkSeats(admin: FirestoreAdmin, body: CheckoutBody, parentUid: string, nowMs: number): Promise<SeatCheck> {
  const renewedPlans = new Set<string>();
  let renewals = 0;
  for (const childUid of body.childUids) {
    const entitlement = await admin.getDocument('entitlements', childUid);
    const isRenewal = body.period === 'yearly' && renewableSeatEnd(entitlement, parentUid, nowMs) !== null;
    if (isRenewal) {
      renewals += 1;
      renewedPlans.add(String(entitlement?.fields.subscriptionId));
    } else if (holdsLiveSeat(entitlement, nowMs)) {
      return { ok: false, response: refusal(409, 'A child already has Pro', 'has_pro') };
    }
  }
  if (renewals > 0 && (renewals < body.childUids.length || renewedPlans.size > 1)) {
    return { ok: false, response: refusal(409, 'Renew one plan on its own', 'renewal_separate') };
  }
  return { ok: true };
}

function describePlan(period: BillingPeriod, children: number): string {
  return `EnglishVibe Pro ${period} ${children} ${children === 1 ? 'child' : 'children'}`;
}

function appOrigin(request: Request, env: Record<string, string | undefined>): string {
  return (env.APP_ORIGIN || new URL(request.url).origin).replace(/\/+$/, '');
}

async function openPaymentPage(
  provider: PaymentProvider,
  admin: ReturnType<typeof createFirestoreAdmin>,
  input: { checkoutId: string; body: CheckoutBody; amountAgorot: number; origin: string; webhookSecret: string; nowMs: number },
  caller: ParentCaller
): Promise<string> {
  const { checkoutId, body, amountAgorot, origin } = input;
  await admin.commit([{
    collection: 'checkouts',
    id: checkoutId,
    precondition: { exists: false },
    fields: {
      parentUid: caller.parentUid,
      childUids: body.childUids,
      period: body.period,
      seatLimit: body.childUids.length,
      amountAgorot,
      status: 'pending',
      provider: provider.id,
      processId: '',
      processToken: '',
      createdAt: input.nowMs,
    },
  }]);
  const page = await provider.createPaymentPage({
    checkoutId,
    amountAgorot,
    period: body.period,
    description: describePlan(body.period, body.childUids.length),
    payerName: body.payerName,
    payerPhone: body.payerPhone,
    payerEmail: body.payerEmail,
    successUrl: `${origin}/?parent&paid=${checkoutId}`,
    cancelUrl: `${origin}/?parent&paid=${checkoutId}&status=cancel`,
    notifyUrl: `${origin}/api/payment-webhook?source=process&key=${encodeURIComponent(input.webhookSecret)}`,
  });
  // The page only works once the checkout knows it: the webhook confirms payments against these ids
  await admin.commit([{
    collection: 'checkouts',
    id: checkoutId,
    mergeFields: ['processId', 'processToken'],
    fields: { processId: page.processId, processToken: page.processToken },
  }]);
  return page.url;
}

export async function handleCheckoutRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: CheckoutDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  const {
    fetchImpl = fetch,
    nowMs = Date.now,
    createAdmin = createFirestoreAdmin,
    createProvider = createPaymentProvider,
    newId = () => crypto.randomUUID().replace(/-/g, ''),
  } = deps;
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;

  const body = await readBody(request);
  if (!body) return errorResponse(400, 'Invalid request');
  if (body.childUids.includes(caller.parentUid)) return errorResponse(403, 'Not allowed');
  const amountAgorot = proPriceAgorot(body.childUids.length, body.period);
  if (amountAgorot === null) return errorResponse(400, 'Invalid request');
  if (body.dryRun) return jsonResponse(200, { amountAgorot });

  const provider = createProvider(env, fetchImpl);
  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const webhookSecret = env.PAYMENT_WEBHOOK_SECRET ?? '';
  const hasOrigin = Boolean(env.APP_ORIGIN) || !env.VERCEL_ENV;
  if (!provider || !account || !webhookSecret || !hasOrigin) return errorResponse(503, 'Payments are not configured');

  try {
    for (const childUid of body.childUids) {
      if (!(await isParentLinked(caller, childUid, fetchImpl))) return errorResponse(403, 'This parent is not linked to that learner');
    }
    const admin = createAdmin(account, caller.projectId, { fetchImpl });
    const now = nowMs();
    if (await hasTooManyLinks(admin, caller.parentUid)) return refusal(409, 'Too many linked children', 'too_many_children');
    if ((await countRecentPendingCheckouts(admin, caller.parentUid, now)) >= MAX_PENDING_CHECKOUTS_PER_DAY) {
      return refusal(429, 'Too many payment pages today', 'too_many_checkouts');
    }
    const seats = await checkSeats(admin, body, caller.parentUid, now);
    if (!seats.ok) return seats.response;
    const url = await openPaymentPage(
      provider,
      admin,
      { checkoutId: newId(), body, amountAgorot, origin: appOrigin(request, env), webhookSecret, nowMs: now },
      caller
    );
    return jsonResponse(200, { url });
  } catch (error) {
    // Only a status or gateway code is logged: never tokens, payer details or keys.
    const detail = error instanceof AdminError ? error.status : error instanceof PaymentError ? `gateway ${error.code}` : 'unexpected';
    console.error(`checkout: failed (${detail})`);
    return errorResponse(502, 'Checkout failed');
  }
}

export function POST(request: Request): Promise<Response> {
  return handleCheckoutRequest(request, process.env);
}
