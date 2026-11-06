/**
 * /api/owner-test-users: the owner's list of test accounts, which `/api/owner-stats` leaves out of
 * every number so the dashboard describes real users only. Owner only (`OWNER_UID`).
 *   GET     → { users: [{ uid, label, addedAt }] }
 *   POST    { identifier }  adds an account by username, email or uid; answers with the list
 *   DELETE  { uid }         takes one off the list; answers with the list
 * The list is `testUsers/{uid}` (admin only, never read or written by the app).
 */
import { createFirestoreAdmin, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, createAuthAdmin } from './_lib/googleAdmin.js';
import { authenticateOwner } from './_lib/ownerRequest.js';
import { errorResponse, jsonResponse, readJsonBody, type ParentRequestDeps } from './_lib/parentRequest.js';
import { normalizeIdentifierToEmail } from '../src/utils/username.js';

const COLLECTION = 'testUsers';
const MAX_BODY_BYTES = 1024;
const MAX_LABEL_LENGTH = 120;
const MAX_TEST_USERS = 200;
/** Firebase uids are 20–40 letters and digits */
const UID_PATTERN = /^[A-Za-z0-9]{20,40}$/;

export interface TestUserEntry {
  uid: string;
  label: string;
  addedAt: number;
}

/** The two Auth lookups the add needs (the real ones talk to Firebase Auth). */
export interface AccountLookup {
  lookupUidByEmail(email: string): Promise<string | null>;
  uidExists(uid: string): Promise<boolean>;
}

export interface OwnerTestUsersDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: (...args: Parameters<typeof createFirestoreAdmin>) => FirestoreAdmin;
  createLookup?: (...args: Parameters<typeof createAuthAdmin>) => AccountLookup;
}

function authLookup(...args: Parameters<typeof createAuthAdmin>): AccountLookup {
  const auth = createAuthAdmin(...args);
  return {
    lookupUidByEmail: (email) => auth.lookupUidByEmail(email),
    uidExists: async (uid) => (await auth.lookupUser(uid)) !== null,
  };
}

/** The uid a username, email or uid names, or null when no such account exists. */
export async function resolveTestUserUid(lookup: AccountLookup, identifier: string): Promise<string | null> {
  const byEmail = await lookup.lookupUidByEmail(normalizeIdentifierToEmail(identifier));
  if (byEmail) return byEmail;
  if (UID_PATTERN.test(identifier) && (await lookup.uidExists(identifier))) return identifier;
  return null;
}

async function listEntries(admin: FirestoreAdmin): Promise<TestUserEntry[]> {
  const rows = await admin.listFieldsOf(COLLECTION, ['label', 'addedAt']);
  return rows
    .map(({ id, fields }) => ({
      uid: id,
      label: typeof fields.label === 'string' ? fields.label : id,
      addedAt: typeof fields.addedAt === 'number' ? fields.addedAt : 0,
    }))
    .sort((a, b) => b.addedAt - a.addedAt);
}

const listResponse = async (admin: FirestoreAdmin) => jsonResponse(200, { users: await listEntries(admin) });

export async function handleOwnerTestUsersRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: OwnerTestUsersDeps = {}
): Promise<Response> {
  const owner = await authenticateOwner(request, env, deps);
  if (owner instanceof Response) return owner;
  const { account, projectId } = owner;
  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, createLookup = authLookup } = deps;

  try {
    const admin = createAdmin(account, projectId, { fetchImpl });
    if (request.method === 'GET') return await listResponse(admin);

    const body = await readJsonBody(request, MAX_BODY_BYTES);
    if (!body) return errorResponse(400, 'Bad request');

    if (request.method === 'DELETE') {
      if (typeof body.uid !== 'string' || !UID_PATTERN.test(body.uid)) return errorResponse(400, 'Bad request');
      await admin.deleteDocument(COLLECTION, body.uid);
      return await listResponse(admin);
    }

    if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
    const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';
    if (!identifier || identifier.length > MAX_LABEL_LENGTH) return errorResponse(400, 'Enter a username, email or uid');

    const uid = await resolveTestUserUid(createLookup(account, projectId, { fetchImpl }), identifier);
    if (!uid) return errorResponse(404, 'No account found with that username, email or uid');
    if ((await listEntries(admin)).length >= MAX_TEST_USERS) return errorResponse(400, 'The list is full');
    await admin.commit([{ collection: COLLECTION, id: uid, fields: { label: identifier, addedAt: nowMs() } }]);
    return await listResponse(admin);
  } catch (error) {
    // Only a status is logged: never ids, labels, tokens or keys
    console.error(`owner-test-users: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not update the list');
  }
}

export const GET = (request: Request): Promise<Response> => handleOwnerTestUsersRequest(request, process.env);
export const POST = GET;
export const DELETE = GET;
