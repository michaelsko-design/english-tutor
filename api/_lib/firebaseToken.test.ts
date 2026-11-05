import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createFirebaseTokenVerifier } from './firebaseToken.js';

const PROJECT_ID = 'demo-project';
const NOW_S = 1_800_000_000;

let privateKey: CryptoKey;
let jwks: { keys: JsonWebKey[] };

const encode = (value: object | Uint8Array): string =>
  Buffer.from(value instanceof Uint8Array ? value : JSON.stringify(value)).toString('base64url');

async function signToken(payload: Record<string, unknown>, header: Record<string, unknown> = {}): Promise<string> {
  const head = encode({ alg: 'RS256', kid: 'key-1', typ: 'JWT', ...header });
  const body = encode(payload);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(`${head}.${body}`));
  return `${head}.${body}.${encode(new Uint8Array(signature))}`;
}

const validPayload = () => ({
  iss: `https://securetoken.google.com/${PROJECT_ID}`,
  aud: PROJECT_ID,
  sub: 'learner-uid',
  iat: NOW_S - 60,
  exp: NOW_S + 3000,
});

beforeAll(async () => {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  privateKey = pair.privateKey;
  const publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  jwks = { keys: [{ ...publicJwk, kid: 'key-1', alg: 'RS256', use: 'sig' } as JsonWebKey] };
});

function verifier() {
  const fetchJwks = vi.fn(async () => new Response(JSON.stringify(jwks), { headers: { 'Cache-Control': 'max-age=3600' } }));
  const verify = createFirebaseTokenVerifier({ fetchImpl: fetchJwks as typeof fetch, nowMs: () => NOW_S * 1000 });
  return { verify, fetchJwks };
}

describe('createFirebaseTokenVerifier', () => {
  it('accepts a token signed by a current key for the project', async () => {
    const { verify } = verifier();
    expect(await verify(await signToken(validPayload()), PROJECT_ID)).toBe(true);
  });

  it('fetches the public keys once and reuses them', async () => {
    const { verify, fetchJwks } = verifier();
    await verify(await signToken(validPayload()), PROJECT_ID);
    await verify(await signToken(validPayload()), PROJECT_ID);
    expect(fetchJwks).toHaveBeenCalledTimes(1);
  });

  it('rejects a token for another project', async () => {
    const { verify } = verifier();
    expect(await verify(await signToken({ ...validPayload(), aud: 'other' }), PROJECT_ID)).toBe(false);
    expect(await verify(await signToken({ ...validPayload(), iss: 'https://securetoken.google.com/other' }), PROJECT_ID)).toBe(false);
  });

  it('rejects an expired token', async () => {
    const { verify } = verifier();
    expect(await verify(await signToken({ ...validPayload(), exp: NOW_S - 1 }), PROJECT_ID)).toBe(false);
  });

  it('rejects a changed payload (bad signature)', async () => {
    const { verify } = verifier();
    const [head, , signature] = (await signToken(validPayload())).split('.');
    const forged = `${head}.${encode({ ...validPayload(), sub: 'someone-else' })}.${signature}`;
    expect(await verify(forged, PROJECT_ID)).toBe(false);
  });

  it('rejects unsigned tokens, unknown keys and garbage', async () => {
    const { verify } = verifier();
    expect(await verify(await signToken(validPayload(), { alg: 'none' }), PROJECT_ID)).toBe(false);
    expect(await verify(await signToken(validPayload(), { kid: 'unknown' }), PROJECT_ID)).toBe(false);
    expect(await verify('not-a-token', PROJECT_ID)).toBe(false);
    expect(await verify('', PROJECT_ID)).toBe(false);
  });

  describe('after Google rotates its keys', () => {
    const MIN_REFETCH_S = 60;

    function rotating() {
      let served: { keys: JsonWebKey[] } = { keys: [] };
      let clockS = NOW_S;
      const fetchJwks = vi.fn(async () => new Response(JSON.stringify(served), { headers: { 'Cache-Control': 'max-age=3600' } }));
      const verify = createFirebaseTokenVerifier({ fetchImpl: fetchJwks as typeof fetch, nowMs: () => clockS * 1000 });
      return {
        verify,
        fetchJwks,
        publish: () => { served = jwks; },
        advance: (seconds: number) => { clockS += seconds; },
      };
    }

    // The payload's own iat/exp are fixed, so keep the clock inside the token's validity
    const token = async () => signToken({ ...validPayload(), exp: NOW_S + 3000 });

    it('fetches again for a key id it has not seen, then accepts the token', async () => {
      const { verify, fetchJwks, publish, advance } = rotating();
      expect(await verify(await token(), PROJECT_ID)).toBe(false); // cache holds only old keys
      publish();
      advance(MIN_REFETCH_S + 1);
      expect(await verify(await token(), PROJECT_ID)).toBe(true);
      expect(fetchJwks).toHaveBeenCalledTimes(2);
    });

    it('does not refetch more than once a minute for unknown key ids', async () => {
      const { verify, fetchJwks, advance } = rotating();
      const stranger = await signToken(validPayload(), { kid: 'unknown' });
      await verify(stranger, PROJECT_ID);
      await verify(stranger, PROJECT_ID);
      await verify(stranger, PROJECT_ID);
      expect(fetchJwks).toHaveBeenCalledTimes(1);
      advance(MIN_REFETCH_S + 1);
      await verify(stranger, PROJECT_ID);
      expect(fetchJwks).toHaveBeenCalledTimes(2);
    });
  });
});
