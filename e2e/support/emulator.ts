/**
 * The Firebase emulators the E2E tests run against (started by `npm run test:e2e`), reached
 * through their REST APIs: reset, create a learner, read the learner's documents.
 * Every helper refuses to talk to anything but 127.0.0.1.
 */
export const EMULATOR_PROJECT_ID = 'demo-english-vibe';
const AUTH_ORIGIN = 'http://127.0.0.1:9099';
const FIRESTORE_ORIGIN = 'http://127.0.0.1:8080';
const API_KEY = 'demo-api-key';
const DOCUMENTS = `${FIRESTORE_ORIGIN}/v1/projects/${EMULATOR_PROJECT_ID}/databases/(default)/documents`;
/** The Firestore emulator's admin token: reads and writes past the security rules */
const OWNER_HEADERS = { Authorization: 'Bearer owner', 'Content-Type': 'application/json' };
/** Username sign-ins use this internal e-mail domain (src/utils/username.ts) */
const USERNAME_EMAIL_DOMAIN = 'peachnote.tutor.local';

/** Stops the run unless the emulators were started for it (firebase emulators:exec sets these). */
export function assertEmulatorEnvironment(): void {
  const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST ?? '';
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '';
  const isLocal = (host: string) => /^(127\.0\.0\.1|localhost):\d+$/.test(host);
  if (!isLocal(firestoreHost) || !isLocal(authHost)) {
    throw new Error(
      'E2E tests run only against the Firebase emulators. Use `npm run test:e2e` ' +
        `(FIRESTORE_EMULATOR_HOST="${firestoreHost}", FIREBASE_AUTH_EMULATOR_HOST="${authHost}").`
    );
  }
}

async function request(url: string, init: RequestInit = {}): Promise<Response> {
  if (!url.startsWith('http://127.0.0.1:')) throw new Error(`refusing a non-emulator request: ${url}`);
  const response = await fetch(url, init);
  if (!response.ok && response.status !== 404) {
    throw new Error(`${init.method ?? 'GET'} ${url} failed: ${response.status} ${await response.text()}`);
  }
  return response;
}

/** Deletes every account and document in the emulators. */
export async function resetEmulators(): Promise<void> {
  await request(`${AUTH_ORIGIN}/emulator/v1/projects/${EMULATOR_PROJECT_ID}/accounts`, { method: 'DELETE' });
  await request(`${FIRESTORE_ORIGIN}/emulator/v1/projects/${EMULATOR_PROJECT_ID}/databases/(default)/documents`, {
    method: 'DELETE',
  });
}

export interface TestLearner {
  username: string;
  pin: string;
}

/** A new username and PIN for one test (test values, used only against the emulators) */
export function newTestLearner(): TestLearner {
  const suffix = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
  return { username: `e2e${suffix}`, pin: `${100000 + Math.floor(Math.random() * 900000)}` };
}

/** Creates the learner's account in the Auth emulator and returns its uid. */
export async function createAccount(learner: TestLearner): Promise<string> {
  const response = await request(`${AUTH_ORIGIN}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `${learner.username}@${USERNAME_EMAIL_DOMAIN}`,
      password: learner.pin,
      returnSecureToken: true,
    }),
  });
  return ((await response.json()) as { localId: string }).localId;
}

/** The uid of the account with this username, or null when there is none. */
export async function findUid(username: string): Promise<string | null> {
  const response = await request(
    `${AUTH_ORIGIN}/identitytoolkit.googleapis.com/v1/projects/${EMULATOR_PROJECT_ID}/accounts:lookup`,
    {
      method: 'POST',
      headers: OWNER_HEADERS,
      body: JSON.stringify({ email: [`${username}@${USERNAME_EMAIL_DOMAIN}`] }),
    }
  );
  const body = (await response.json()) as { users?: { localId: string }[] };
  return body.users?.[0]?.localId ?? null;
}

type FirestoreValue = Record<string, unknown>;

/** A Firestore REST value as plain JSON */
function fromFirestore(value: FirestoreValue): unknown {
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('stringValue' in value) return value.stringValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) {
    const values = (value.arrayValue as { values?: FirestoreValue[] }).values ?? [];
    return values.map(fromFirestore);
  }
  if ('mapValue' in value) {
    const fields = (value.mapValue as { fields?: Record<string, FirestoreValue> }).fields ?? {};
    return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromFirestore(v)]));
  }
  throw new Error(`unknown Firestore value ${JSON.stringify(value)}`);
}

/** A document as plain JSON, or null when it doesn't exist. */
export async function readDocument(path: string): Promise<Record<string, unknown> | null> {
  const response = await request(`${DOCUMENTS}/${path}`, { headers: OWNER_HEADERS });
  if (response.status === 404) return null;
  const body = (await response.json()) as { fields?: Record<string, FirestoreValue> };
  return fromFirestore({ mapValue: { fields: body.fields ?? {} } }) as Record<string, unknown>;
}

/** The ids of a collection's documents (empty when there are none). */
export async function listDocumentIds(path: string): Promise<string[]> {
  const response = await request(`${DOCUMENTS}/${path}`, { headers: OWNER_HEADERS });
  if (response.status === 404) return [];
  const body = (await response.json()) as { documents?: { name: string }[] };
  return (body.documents ?? []).map((d) => d.name.split('/').pop() ?? '');
}
