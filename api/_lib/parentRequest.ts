/**
 * Shared by the functions a parent calls (PIN reset, Pro checkout and plan changes): JSON
 * responses, the parent's sign-in check, and the pairing check made *as that parent* so Firestore's
 * own rules decide (nothing about the pairing is read with the service account).
 */
import { verifyAppCheckToken } from './appCheckToken.js';
import { readFirebaseClaims, verifyFirebaseIdToken } from './firebaseToken.js';
import { APP_CHECK_HEADER, TTS_TOKEN_HEADER } from '../../src/services/tts/ttsText.js';

const DEFAULT_FIREBASE_PROJECT_ID = 'english-tutor-il-7';
/** App Check tokens name the project by number (the first part of the web appId) */
const DEFAULT_FIREBASE_PROJECT_NUMBER = '1003230297590';

export interface ParentRequestDeps {
  fetchImpl?: typeof fetch;
  verifyToken?: (token: string, projectId: string) => Promise<boolean>;
  verifyAppCheck?: (token: string, projectNumber: string) => Promise<boolean>;
}

export function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export const errorResponse = (status: number, message: string) => jsonResponse(status, { error: message });

export function firebaseProjectId(env: Record<string, string | undefined>): string {
  return env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;
}

export interface ParentCaller {
  parentUid: string;
  idToken: string;
  appCheckToken: string;
  projectId: string;
}

/** The signed-in parent (a Google account) and their tokens, or the error response to send. */
export async function authenticateParent(
  request: Request,
  env: Record<string, string | undefined>,
  { verifyToken = verifyFirebaseIdToken, verifyAppCheck = verifyAppCheckToken }: ParentRequestDeps = {}
): Promise<ParentCaller | Response> {
  const projectId = firebaseProjectId(env);
  const idToken = request.headers.get(TTS_TOKEN_HEADER) ?? '';
  if (!idToken || !(await verifyToken(idToken, projectId))) return errorResponse(401, 'Sign in as a parent');
  const claims = readFirebaseClaims(idToken);
  if (!claims || claims.signInProvider !== 'google.com') return errorResponse(403, 'Only a parent account can do this');

  const appCheckToken = request.headers.get(APP_CHECK_HEADER) ?? '';
  if (env.APPCHECK_ENFORCE === 'on') {
    const projectNumber = env.FIREBASE_PROJECT_NUMBER || DEFAULT_FIREBASE_PROJECT_NUMBER;
    if (!appCheckToken || !(await verifyAppCheck(appCheckToken, projectNumber))) return errorResponse(401, 'App check failed');
  }
  return { parentUid: claims.uid, idToken, appCheckToken, projectId };
}

function linkUrl(caller: ParentCaller, childUid: string): string {
  return `https://firestore.googleapis.com/v1/projects/${caller.projectId}/databases/(default)/documents/parentLinks/${caller.parentUid}_${childUid}`;
}

function callerHeaders(caller: ParentCaller): Record<string, string> {
  return { Authorization: `Bearer ${caller.idToken}`, ...(caller.appCheckToken ? { [APP_CHECK_HEADER]: caller.appCheckToken } : {}) };
}

/** Whether the parent can read their link to this learner (the rules only allow the two of them). */
export async function isParentLinked(caller: ParentCaller, childUid: string, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  const response = await fetchImpl(linkUrl(caller, childUid), { headers: callerHeaders(caller) });
  return response.status === 200;
}

/** Leaves one field on the link, as the parent (the rules allow only `pinResetAt`). */
export async function patchParentLink(
  caller: ParentCaller,
  childUid: string,
  field: string,
  isoTime: string,
  fetchImpl: typeof fetch = fetch
): Promise<boolean> {
  const url = `${linkUrl(caller, childUid)}?updateMask.fieldPaths=${field}&currentDocument.exists=true`;
  const response = await fetchImpl(url, {
    method: 'PATCH',
    headers: { ...callerHeaders(caller), 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { [field]: { stringValue: isoTime } } }),
  });
  return response.status === 200;
}

/** The JSON body, or null when it is too big or not JSON. */
export async function readJsonBody(request: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    const body: unknown = JSON.parse(text);
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
