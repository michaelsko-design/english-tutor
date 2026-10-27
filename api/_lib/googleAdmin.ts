/**
 * Server-side access to Firebase Auth with a service account, using Web Crypto and fetch only (no
 * Firebase Admin SDK, like the token checks next to it). It signs a short-lived OAuth token with the
 * service account's key and calls the Identity Toolkit admin endpoints. The key comes from the
 * `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable and is never logged or sent anywhere else.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const JWT_LIFETIME_S = 3600;
/** A cached access token is renewed this long before it expires */
const RENEW_MARGIN_S = 60;

export interface ServiceAccount {
  client_email: string;
  private_key: string;
}

export interface AdminDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
}

export class AdminError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export function parseServiceAccount(json: string | undefined): ServiceAccount | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as Partial<ServiceAccount>;
    if (typeof parsed.client_email !== 'string' || typeof parsed.private_key !== 'string') return null;
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch {
    return null;
  }
}

function base64url(input: string | ArrayBuffer): string {
  const bytes = typeof input === 'string' ? Buffer.from(input, 'utf8') : Buffer.from(new Uint8Array(input));
  return bytes.toString('base64url');
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const body = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  return crypto.subtle.importKey(
    'pkcs8',
    Buffer.from(body, 'base64'),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

/** The signed JWT the service account exchanges for an access token. */
export async function signServiceAccountJwt(account: ServiceAccount, nowS: number): Promise<string> {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({ iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, iat: nowS, exp: nowS + JWT_LIFETIME_S })
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    await importPrivateKey(account.private_key),
    new TextEncoder().encode(`${header}.${claims}`)
  );
  return `${header}.${claims}.${base64url(signature)}`;
}

export interface AuthUserInfo {
  uid: string;
  /** Provider ids such as `password` or `google.com` */
  providerIds: string[];
}

/** Returns a function that gives the service account's OAuth access token, renewed shortly before it expires. */
export function createAccessTokenProvider(account: ServiceAccount, { fetchImpl = fetch, nowMs = Date.now }: AdminDeps = {}) {
  let cached: { token: string; expiresAtMs: number } | null = null;

  return async function getAccessToken(): Promise<string> {
    if (cached && nowMs() < cached.expiresAtMs) return cached.token;
    const assertion = await signServiceAccountJwt(account, Math.floor(nowMs() / 1000));
    const response = await fetchImpl(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    });
    if (!response.ok) throw new AdminError('Service account token request failed', response.status);
    const body = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!body.access_token) throw new AdminError('Service account token missing', 502);
    cached = { token: body.access_token, expiresAtMs: nowMs() + ((body.expires_in ?? JWT_LIFETIME_S) - RENEW_MARGIN_S) * 1000 };
    return body.access_token;
  };
}

/** The Firebase Auth operations the PIN reset needs. */
export function createAuthAdmin(account: ServiceAccount, projectId: string, { fetchImpl = fetch, nowMs = Date.now }: AdminDeps = {}) {
  const getAccessToken = createAccessTokenProvider(account, { fetchImpl, nowMs });

  async function call(path: string, body: unknown): Promise<Response> {
    const token = await getAccessToken();
    return fetchImpl(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  }

  return {
    /** The account's providers, or null when no such account exists. */
    async lookupUser(uid: string): Promise<AuthUserInfo | null> {
      const response = await call('accounts:lookup', { localId: [uid] });
      if (!response.ok) throw new AdminError('Auth lookup failed', response.status);
      const body = (await response.json()) as { users?: { localId: string; providerUserInfo?: { providerId: string }[] }[] };
      const user = body.users?.[0];
      if (!user) return null;
      return { uid: user.localId, providerIds: (user.providerUserInfo ?? []).map((p) => p.providerId) };
    },

    async setPassword(uid: string, password: string): Promise<void> {
      const response = await call('accounts:update', { localId: uid, password });
      if (!response.ok) throw new AdminError('Auth update failed', response.status);
    },
  };
}
