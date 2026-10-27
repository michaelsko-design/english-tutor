/**
 * POST /api/parent-reset-pin  {childUid, newPin}: a parent who is paired with a learner sets that
 * learner's sign-in PIN (a forgotten PIN no longer loses the account). The caller proves who they
 * are with their Firebase ID token (a Google account, in X-Firebase-Token); the pairing is checked
 * by reading `parentLinks/{parentUid}_{childUid}` as that parent, so Firestore's own rules decide
 * (nothing is read with the service account); only the password change uses the service account.
 */
// Explicit .js extensions: the package is ESM ("type": "module"), so Node needs them at runtime.
import { verifyAppCheckToken } from './_lib/appCheckToken.js';
import { readFirebaseClaims, verifyFirebaseIdToken } from './_lib/firebaseToken.js';
import { AdminError, createAuthAdmin, parseServiceAccount, type AuthUserInfo } from './_lib/googleAdmin.js';
import { APP_CHECK_HEADER, TTS_TOKEN_HEADER } from '../src/services/tts/ttsText.js';

const DEFAULT_FIREBASE_PROJECT_ID = 'english-tutor-il-7';
/** App Check tokens name the project by number (the first part of the web appId) */
const DEFAULT_FIREBASE_PROJECT_NUMBER = '1003230297590';
const MIN_PIN_LENGTH = 6;
const MAX_PIN_LENGTH = 64;
const MAX_BODY_BYTES = 1024;
const UID_PATTERN = /^[A-Za-z0-9]{1,128}$/;

export interface ResetPinDeps {
  fetchImpl?: typeof fetch;
  verifyToken?: (token: string, projectId: string) => Promise<boolean>;
  verifyAppCheck?: (token: string, projectNumber: string) => Promise<boolean>;
  createAdmin?: typeof createAuthAdmin;
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

const errorResponse = (status: number, message: string) => jsonResponse(status, { error: message });

interface ResetBody {
  childUid: string;
  newPin: string;
}

async function readBody(request: Request): Promise<ResetBody | null> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    const body = JSON.parse(text) as Partial<ResetBody>;
    if (typeof body.childUid !== 'string' || !UID_PATTERN.test(body.childUid)) return null;
    if (typeof body.newPin !== 'string') return null;
    const pin = body.newPin.trim();
    if (pin.length < MIN_PIN_LENGTH || pin.length > MAX_PIN_LENGTH) return null;
    return { childUid: body.childUid, newPin: pin };
  } catch {
    return null;
  }
}

/** Whether the parent can read their link to this learner (the rules only allow the two of them). */
async function isParentLinked(
  parentUid: string,
  childUid: string,
  idToken: string,
  appCheckToken: string,
  projectId: string,
  fetchImpl: typeof fetch
): Promise<boolean> {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/parentLinks/${parentUid}_${childUid}`;
  const response = await fetchImpl(url, {
    headers: { Authorization: `Bearer ${idToken}`, ...(appCheckToken ? { [APP_CHECK_HEADER]: appCheckToken } : {}) },
  });
  return response.status === 200;
}

/**
 * Leaves the reset time on the link, as the parent (the rules allow only that field), so the
 * learner's app can tell them. Done before the change: a reset is never made without a notice.
 */
async function recordPinReset(
  parentUid: string,
  childUid: string,
  idToken: string,
  appCheckToken: string,
  projectId: string,
  fetchImpl: typeof fetch
): Promise<boolean> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/parentLinks/${parentUid}_${childUid}` +
    '?updateMask.fieldPaths=pinResetAt&currentDocument.exists=true';
  const response = await fetchImpl(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
      ...(appCheckToken ? { [APP_CHECK_HEADER]: appCheckToken } : {}),
    },
    body: JSON.stringify({ fields: { pinResetAt: { stringValue: new Date().toISOString() } } }),
  });
  return response.status === 200;
}

export async function handleResetPinRequest(
  request: Request,
  env: Record<string, string | undefined>,
  {
    fetchImpl = fetch,
    verifyToken = verifyFirebaseIdToken,
    verifyAppCheck = verifyAppCheckToken,
    createAdmin = createAuthAdmin,
  }: ResetPinDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;

  const idToken = request.headers.get(TTS_TOKEN_HEADER) ?? '';
  if (!idToken || !(await verifyToken(idToken, projectId))) return errorResponse(401, 'Sign in as a parent');
  const claims = readFirebaseClaims(idToken);
  if (!claims || claims.signInProvider !== 'google.com') return errorResponse(403, 'Only a parent account can do this');

  const appCheckToken = request.headers.get(APP_CHECK_HEADER) ?? '';
  if (env.APPCHECK_ENFORCE === 'on') {
    const projectNumber = env.FIREBASE_PROJECT_NUMBER || DEFAULT_FIREBASE_PROJECT_NUMBER;
    if (!appCheckToken || !(await verifyAppCheck(appCheckToken, projectNumber))) return errorResponse(401, 'App check failed');
  }

  const body = await readBody(request);
  if (!body) return errorResponse(400, 'Invalid request');
  if (body.childUid === claims.uid) return errorResponse(403, 'Not allowed');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'PIN reset is not configured');

  try {
    if (!(await isParentLinked(claims.uid, body.childUid, idToken, appCheckToken, projectId, fetchImpl))) {
      return errorResponse(403, 'This parent is not linked to that learner');
    }
    const admin = createAdmin(account, projectId, { fetchImpl });
    const child: AuthUserInfo | null = await admin.lookupUser(body.childUid);
    if (!child) return errorResponse(404, 'Learner not found');
    if (!child.providerIds.includes('password')) return errorResponse(409, 'This learner signs in with Google, not a PIN');
    if (!(await recordPinReset(claims.uid, body.childUid, idToken, appCheckToken, projectId, fetchImpl))) {
      return errorResponse(502, 'PIN reset failed');
    }
    await admin.setPassword(body.childUid, body.newPin);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    // Only the status is logged: never the PIN, the token or the key.
    console.error(`parent-reset-pin: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'PIN reset failed');
  }
}

export function POST(request: Request): Promise<Response> {
  return handleResetPinRequest(request, process.env);
}
