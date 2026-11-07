/**
 * /api/erase-account-data: the server-only part of "delete my account". The app deletes the
 * learner's own documents itself; the usage counters, access record and comp entitlement can only
 * be removed with the service account. Feedback notes are KEPT (valuable to the owner) but cut loose
 * from the account: the uid is blanked and the tester's invite alias stays. The app calls this just before the
 * sign-in itself is deleted. A paid subscription's entitlement is kept (billing records).
 *   POST → 200 { ok: true } | 401 | 503
 */
import { eraseServerRecords } from './_lib/eraseAccount.js';
import { createFirestoreAdmin, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import { readFirebaseClaims, verifyFirebaseIdToken } from './_lib/firebaseToken.js';
import { errorResponse, firebaseProjectId, jsonResponse } from './_lib/parentRequest.js';
import { TTS_TOKEN_HEADER } from '../src/services/tts/ttsText.js';

export interface EraseAccountDataDeps {
  fetchImpl?: typeof fetch;
  verifyToken?: (token: string, projectId: string) => Promise<boolean>;
  createAdmin?: (...args: Parameters<typeof createFirestoreAdmin>) => FirestoreAdmin;
}

export async function handleEraseAccountDataRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: EraseAccountDataDeps = {}
): Promise<Response> {
  const { fetchImpl = fetch, verifyToken = verifyFirebaseIdToken, createAdmin = createFirestoreAdmin } = deps;
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');

  const projectId = firebaseProjectId(env);
  const idToken = request.headers.get(TTS_TOKEN_HEADER) ?? '';
  if (!idToken || !(await verifyToken(idToken, projectId))) return errorResponse(401, 'Sign in first');
  const claims = readFirebaseClaims(idToken);
  if (!claims) return errorResponse(401, 'Sign in first');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'Not configured');

  try {
    await eraseServerRecords(createAdmin(account, projectId, { fetchImpl }), claims.uid);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    // Only a status is logged: never ids, tokens or keys
    console.error(`erase-account-data: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not erase');
  }
}

export function POST(request: Request): Promise<Response> {
  return handleEraseAccountDataRequest(request, process.env);
}
