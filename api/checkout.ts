/**
 * POST /api/checkout  {childUids, period, payerName, payerPhone, payerEmail?, dryRun?}: a paired
 * parent starts EnglishVibe Pro for 1–4 of their children (docs/feature-pro-tier.md). Every child's
 * pairing is checked as the parent; the price comes from `config/proTier.ts`, never from the client.
 * `dryRun` only returns the price. Otherwise it records `checkouts/{id}`, opens the gateway's payment
 * page and returns its URL; the payment itself is confirmed later by /api/payment-webhook.
 */
import { createFirestoreAdmin } from './_lib/firestoreAdmin.js';
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
import { holdsLiveSeat, UID_PATTERN } from './_lib/proBilling.js';
import { isBillingPeriod, MAX_PRO_SEATS, proPriceAgorot, type BillingPeriod } from '../src/config/proTier.js';

const MAX_BODY_BYTES = 2048;
const MAX_NAME_LENGTH = 60;
const MAX_EMAIL_LENGTH = 100;
/** Grow needs a first and last name, letters only (it refuses special characters) */
const PAYER_NAME_PATTERN = /^\p{L}+(?:['-]\p{L}+)*(?: \p{L}+(?:['-]\p{L}+)*)+$/u;
/** An Israeli mobile number, as Grow requires */
const PAYER_PHONE_PATTERN = /^05\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    for (const childUid of body.childUids) {
      if (holdsLiveSeat(await admin.getDocument('entitlements', childUid), now)) {
        return errorResponse(409, 'A child already has Pro');
      }
    }
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
