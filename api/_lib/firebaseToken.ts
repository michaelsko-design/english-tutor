/**
 * Verifies a Firebase Auth ID token (any signed-in learner, guests included) with Web Crypto, so
 * the function needs no Firebase Admin SDK. The checks are the ones Firebase documents: an RS256
 * signature by one of Google's current securetoken keys, this project as audience and issuer, not
 * expired, issued in the past and with a user id.
 */

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const DEFAULT_KEYS_MAX_AGE_S = 3600;
/** Clock difference allowed between the learner's token and this server */
const CLOCK_SKEW_S = 300;

interface TokenHeader {
  alg?: string;
  kid?: string;
}

interface TokenPayload {
  iss?: string;
  aud?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

interface VerifierDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
}

function decodePart<T>(part: string): T | null {
  try {
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function maxAgeSeconds(cacheControl: string | null): number {
  const match = /max-age=(\d+)/.exec(cacheControl ?? '');
  return match ? Number(match[1]) : DEFAULT_KEYS_MAX_AGE_S;
}

export function createFirebaseTokenVerifier({ fetchImpl = fetch, nowMs = Date.now }: VerifierDeps = {}) {
  let keys: Map<string, CryptoKey> | null = null;
  let keysExpireAtMs = 0;

  const loadKeys = async (): Promise<Map<string, CryptoKey>> => {
    if (keys && nowMs() < keysExpireAtMs) return keys;
    const response = await fetchImpl(JWKS_URL);
    if (!response.ok) throw new Error(`JWKS ${response.status}`);
    const body = (await response.json()) as { keys?: (JsonWebKey & { kid?: string })[] };
    const imported = new Map<string, CryptoKey>();
    for (const jwk of body.keys ?? []) {
      if (!jwk.kid) continue;
      imported.set(
        jwk.kid,
        await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
      );
    }
    keys = imported;
    keysExpireAtMs = nowMs() + maxAgeSeconds(response.headers.get('Cache-Control')) * 1000;
    return imported;
  };

  return async function verifyFirebaseIdToken(token: string, projectId: string): Promise<boolean> {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const header = decodePart<TokenHeader>(parts[0]);
    const payload = decodePart<TokenPayload>(parts[1]);
    if (!header || !payload || header.alg !== 'RS256' || !header.kid) return false;

    const nowS = nowMs() / 1000;
    const isValidClaims =
      payload.aud === projectId &&
      payload.iss === `https://securetoken.google.com/${projectId}` &&
      typeof payload.sub === 'string' &&
      payload.sub.length > 0 &&
      typeof payload.exp === 'number' &&
      payload.exp > nowS &&
      typeof payload.iat === 'number' &&
      payload.iat <= nowS + CLOCK_SKEW_S;
    if (!isValidClaims) return false;

    try {
      const key = (await loadKeys()).get(header.kid);
      if (!key) return false;
      return await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        key,
        Buffer.from(parts[2], 'base64url'),
        new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
      );
    } catch {
      return false;
    }
  };
}

export const verifyFirebaseIdToken = createFirebaseTokenVerifier();
