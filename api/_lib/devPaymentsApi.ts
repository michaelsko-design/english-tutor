/**
 * The payment functions on the dev server in emulator mode (`npm run dev:emu`, the e2e run), with the
 * stand-in gateway (docs/feature-pro-tier.md, "Phase 2"). Never deployed: only vite.config.ts loads it.
 * - Firestore calls go to the local emulator as its admin (`Bearer owner`); any other host is refused.
 * - Emulator sign-ins are unsigned, so a parent's token is read for its claims, not its signature.
 * - `/api/mock-pay {checkoutId}` stands in for the gateway's "paid" call to /api/payment-webhook.
 */
import { handleCheckoutRequest } from '../checkout.js';
import { handlePaymentWebhook } from '../payment-webhook.js';
import { handleSubscriptionRequest } from '../subscription.js';
import { errorResponse, readJsonBody } from './parentRequest.js';
import { CHECKOUT_ID_PATTERN } from './proBilling.js';

const FIRESTORE_HOST = 'https://firestore.googleapis.com';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/;
const MAX_BODY_BYTES = 256;

interface TokenPayload {
  aud?: string;
  iss?: string;
  exp?: number;
  sub?: string;
}

export interface DevPaymentsConfig {
  /** e.g. http://127.0.0.1:8080 */
  firestoreOrigin: string;
  /** The emulators' project, always a `demo-` one */
  projectId: string;
}

/** fetch for the emulators: Firestore goes local, the service account gets the emulator's admin token. */
export function createEmulatorFetch(firestoreOrigin: string): typeof fetch {
  return async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url === TOKEN_URL) return Response.json({ access_token: 'owner', expires_in: 3600 });
    if (url.startsWith(`${FIRESTORE_HOST}/`)) return fetch(firestoreOrigin + url.slice(FIRESTORE_HOST.length), init);
    throw new Error(`dev payments: refusing a request outside the emulators (${new URL(url).host})`);
  };
}

/** An Auth emulator ID token for this project, still valid. Only its claims are checked. */
export async function verifyEmulatorToken(token: string, projectId: string): Promise<boolean> {
  const part = token.split('.')[1] ?? '';
  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as TokenPayload;
  } catch {
    return false;
  }
  return (
    payload.aud === projectId &&
    payload.iss === `https://securetoken.google.com/${projectId}` &&
    typeof payload.sub === 'string' &&
    typeof payload.exp === 'number' &&
    payload.exp * 1000 > Date.now()
  );
}

let accountJson: Promise<string> | null = null;

/** A throwaway service account: its key only signs the token request the emulator fetch answers itself. */
function throwawayServiceAccount(): Promise<string> {
  accountJson ??= crypto.subtle
    .generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, [
      'sign',
      'verify',
    ])
    .then((pair) => crypto.subtle.exportKey('pkcs8', pair.privateKey))
    .then((der) =>
      JSON.stringify({
        client_email: 'dev-payments@demo.local',
        private_key: `-----BEGIN PRIVATE KEY-----\n${Buffer.from(der).toString('base64')}\n-----END PRIVATE KEY-----\n`,
      })
    );
  return accountJson;
}

async function payMockCheckout(request: Request, env: Record<string, string | undefined>, fetchImpl: typeof fetch): Promise<Response> {
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  const checkoutId = typeof body?.checkoutId === 'string' ? body.checkoutId : '';
  if (!CHECKOUT_ID_PATTERN.test(checkoutId)) return errorResponse(400, 'Invalid request');
  const key = encodeURIComponent(env.PAYMENT_WEBHOOK_SECRET ?? '');
  const notification = new Request(`http://localhost/api/payment-webhook?source=process&key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cField1: checkoutId }),
  });
  return handlePaymentWebhook(notification, env, { fetchImpl });
}

/**
 * Answers /api/checkout, /api/subscription and /api/mock-pay against the emulators, or null for any
 * other path. Refuses to run unless Firestore is local and the project is a `demo-` one.
 */
export async function handleDevPaymentsRequest(path: string, request: Request, config: DevPaymentsConfig): Promise<Response | null> {
  if (!LOCAL_ORIGIN_PATTERN.test(config.firestoreOrigin) || !config.projectId.startsWith('demo-')) {
    return errorResponse(503, 'Payments run locally against the emulators only');
  }
  const fetchImpl = createEmulatorFetch(config.firestoreOrigin);
  const env: Record<string, string | undefined> = {
    PAYMENT_PROVIDER: 'mock',
    FIREBASE_PROJECT_ID: config.projectId,
    FIREBASE_SERVICE_ACCOUNT_JSON: await throwawayServiceAccount(),
    PAYMENT_WEBHOOK_SECRET: 'dev-payments-webhook-secret',
  };
  const deps = { fetchImpl, verifyToken: verifyEmulatorToken };
  if (path === '/api/checkout') return handleCheckoutRequest(request, env, deps);
  if (path === '/api/subscription') return handleSubscriptionRequest(request, env, deps);
  if (path === '/api/mock-pay' && request.method === 'POST') return payMockCheckout(request, env, fetchImpl);
  return null;
}
