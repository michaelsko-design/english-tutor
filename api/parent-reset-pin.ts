/**
 * POST /api/parent-reset-pin  {childUid, newPin}: a parent who is paired with a learner sets that
 * learner's sign-in PIN (a forgotten PIN no longer loses the account). The caller proves who they
 * are with their Firebase ID token (a Google account, in X-Firebase-Token); the pairing is checked
 * by reading `parentLinks/{parentUid}_{childUid}` as that parent, so Firestore's own rules decide
 * (nothing is read with the service account); only the password change uses the service account.
 */
// Explicit .js extensions: the package is ESM ("type": "module"), so Node needs them at runtime.
import { AdminError, createAuthAdmin, parseServiceAccount, type AuthUserInfo } from './_lib/googleAdmin.js';
import {
  authenticateParent,
  errorResponse,
  isParentLinked,
  jsonResponse,
  patchParentLink,
  readJsonBody,
  type ParentRequestDeps,
} from './_lib/parentRequest.js';

const MIN_PIN_LENGTH = 6;
const MAX_PIN_LENGTH = 64;
const MAX_BODY_BYTES = 1024;
const UID_PATTERN = /^[A-Za-z0-9]{1,128}$/;

export interface ResetPinDeps extends ParentRequestDeps {
  createAdmin?: typeof createAuthAdmin;
}

interface ResetBody {
  childUid: string;
  newPin: string;
}

async function readBody(request: Request): Promise<ResetBody | null> {
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  if (!body || typeof body.childUid !== 'string' || !UID_PATTERN.test(body.childUid)) return null;
  if (typeof body.newPin !== 'string') return null;
  const pin = body.newPin.trim();
  if (pin.length < MIN_PIN_LENGTH || pin.length > MAX_PIN_LENGTH) return null;
  return { childUid: body.childUid, newPin: pin };
}

export async function handleResetPinRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: ResetPinDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  const { fetchImpl = fetch, createAdmin = createAuthAdmin } = deps;
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;

  const body = await readBody(request);
  if (!body) return errorResponse(400, 'Invalid request');
  if (body.childUid === caller.parentUid) return errorResponse(403, 'Not allowed');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'PIN reset is not configured');

  try {
    if (!(await isParentLinked(caller, body.childUid, fetchImpl))) {
      return errorResponse(403, 'This parent is not linked to that learner');
    }
    const admin = createAdmin(account, caller.projectId, { fetchImpl });
    const child: AuthUserInfo | null = await admin.lookupUser(body.childUid);
    if (!child) return errorResponse(404, 'Learner not found');
    if (!child.providerIds.includes('password')) return errorResponse(409, 'This learner signs in with Google, not a PIN');
    // The reset time goes on the link before the change, so a reset is never made without a notice
    if (!(await patchParentLink(caller, body.childUid, 'pinResetAt', new Date().toISOString(), fetchImpl))) {
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
