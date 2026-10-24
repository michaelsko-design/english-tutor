/**
 * Verifies Firebase-issued JWTs (Auth ID tokens, App Check tokens) with Web Crypto, so the function
 * needs no Firebase Admin SDK. The signature check is the same for both: RS256 by one of the
 * issuer's current public keys. Each token type supplies its own claim rules.
 */

const AUTH_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const DEFAULT_KEYS_MAX_AGE_S = 3600;
/** Clock difference allowed between the learner's token and this server */
const CLOCK_SKEW_S = 300;

interface TokenHeader {
  alg?: string;
  kid?: string;
}

export interface TokenPayload {
  iss?: string;
  aud?: string | string[];
  sub?: string;
  iat?: number;
  exp?: number;
  firebase?: { sign_in_provider?: string };
}

export interface VerifierDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
}

interface Rs256VerifierConfig extends VerifierDeps {
  jwksUrl: string;
  /** Claim checks beyond the common ones (sub present, not expired, issued in the past). */
  hasValidClaims: (payload: TokenPayload) => boolean;
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

export function createRs256Verifier({
  jwksUrl,
  hasValidClaims,
  fetchImpl = fetch,
  nowMs = Date.now,
}: Rs256VerifierConfig): (token: string) => Promise<boolean> {
  let keys: Map<string, CryptoKey> | null = null;
  let keysExpireAtMs = 0;

  const loadKeys = async (): Promise<Map<string, CryptoKey>> => {
    if (keys && nowMs() < keysExpireAtMs) return keys;
    const response = await fetchImpl(jwksUrl);
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

  return async function verifyToken(token: string): Promise<boolean> {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const header = decodePart<TokenHeader>(parts[0]);
    const payload = decodePart<TokenPayload>(parts[1]);
    if (!header || !payload || header.alg !== 'RS256' || !header.kid) return false;

    const nowS = nowMs() / 1000;
    const isValidCommonClaims =
      typeof payload.sub === 'string' &&
      payload.sub.length > 0 &&
      typeof payload.exp === 'number' &&
      payload.exp > nowS &&
      typeof payload.iat === 'number' &&
      payload.iat <= nowS + CLOCK_SKEW_S;
    if (!isValidCommonClaims || !hasValidClaims(payload)) return false;

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

/** Any signed-in learner, guests included: this project as audience and issuer. */
export function createFirebaseTokenVerifier(deps: VerifierDeps = {}) {
  const verifyWith = (projectId: string) =>
    createRs256Verifier({
      ...deps,
      jwksUrl: AUTH_JWKS_URL,
      hasValidClaims: (payload) => payload.aud === projectId && payload.iss === `https://securetoken.google.com/${projectId}`,
    });
  // The verifier caches the public keys, so keep one per project instead of one per call
  const verifiers = new Map<string, (token: string) => Promise<boolean>>();
  return async function verifyFirebaseIdToken(token: string, projectId: string): Promise<boolean> {
    let verify = verifiers.get(projectId);
    if (!verify) {
      verify = verifyWith(projectId);
      verifiers.set(projectId, verify);
    }
    return verify(token);
  };
}

export const verifyFirebaseIdToken = createFirebaseTokenVerifier();

export interface FirebaseClaims {
  uid: string;
  /** `google.com`, `password`, `anonymous`, ... */
  signInProvider: string;
}

/**
 * The uid and sign-in provider of an ID token. Only for a token `verifyFirebaseIdToken` already
 * accepted: this reads the payload without checking the signature again.
 */
export function readFirebaseClaims(token: string): FirebaseClaims | null {
  const payload = decodePart<TokenPayload>(token.split('.')[1] ?? '');
  if (!payload || typeof payload.sub !== 'string' || !payload.sub) return null;
  return { uid: payload.sub, signInProvider: payload.firebase?.sign_in_provider ?? '' };
}
