import { describe, expect, it, vi } from 'vitest';
import { AdminError, createAuthAdmin, parseServiceAccount, signServiceAccountJwt } from './googleAdmin';

async function makeAccount() {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  const pkcs8 = Buffer.from(await crypto.subtle.exportKey('pkcs8', pair.privateKey)).toString('base64');
  const pem = `-----BEGIN PRIVATE KEY-----\n${pkcs8.match(/.{1,64}/g)!.join('\n')}\n-----END PRIVATE KEY-----\n`;
  return { account: { client_email: 'svc@project.iam.gserviceaccount.com', private_key: pem }, publicKey: pair.publicKey };
}

const NOW_MS = Date.UTC(2026, 2, 4, 10, 0, 0);

function tokenFetch(extra: (url: string, init?: RequestInit) => Response | undefined = () => undefined) {
  return vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({ access_token: 'access-1', expires_in: 3600 }), { status: 200 });
    }
    return extra(url, init) ?? new Response('{}', { status: 200 });
  });
}

describe('parseServiceAccount', () => {
  it('reads the email and key, and rejects anything else', () => {
    expect(parseServiceAccount(JSON.stringify({ client_email: 'a@b', private_key: 'k', other: 1 }))).toEqual({
      client_email: 'a@b',
      private_key: 'k',
    });
    expect(parseServiceAccount(undefined)).toBeNull();
    expect(parseServiceAccount('not json')).toBeNull();
    expect(parseServiceAccount(JSON.stringify({ client_email: 'a@b' }))).toBeNull();
  });
});

describe('signServiceAccountJwt', () => {
  it('signs a one-hour JWT for the cloud-platform scope that the public key verifies', async () => {
    const { account, publicKey } = await makeAccount();
    const jwt = await signServiceAccountJwt(account, 1000);
    const [header, claims, signature] = jwt.split('.');

    expect(JSON.parse(Buffer.from(header, 'base64url').toString())).toEqual({ alg: 'RS256', typ: 'JWT' });
    expect(JSON.parse(Buffer.from(claims, 'base64url').toString())).toEqual({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: 1000,
      exp: 4600,
    });
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      Buffer.from(signature, 'base64url'),
      new TextEncoder().encode(`${header}.${claims}`)
    );
    expect(isValid).toBe(true);
  });
});

describe('createAuthAdmin', () => {
  it('looks up a user with a bearer token and reads the providers', async () => {
    const { account } = await makeAccount();
    const fetchImpl = tokenFetch((url) =>
      url.endsWith('accounts:lookup')
        ? new Response(JSON.stringify({ users: [{ localId: 'child1', providerUserInfo: [{ providerId: 'password' }] }] }), { status: 200 })
        : undefined
    );

    const admin = createAuthAdmin(account, 'proj', { fetchImpl: fetchImpl as typeof fetch, nowMs: () => NOW_MS });
    const user = await admin.lookupUser('child1');

    expect(user).toEqual({ uid: 'child1', providerIds: ['password'] });
    const lookupCall = fetchImpl.mock.calls.find(([url]) => String(url).endsWith('accounts:lookup'))!;
    expect(String(lookupCall[0])).toBe('https://identitytoolkit.googleapis.com/v1/projects/proj/accounts:lookup');
    expect((lookupCall[1]!.headers as Record<string, string>).Authorization).toBe('Bearer access-1');
    expect(JSON.parse(lookupCall[1]!.body as string)).toEqual({ localId: ['child1'] });
  });

  it('returns null for an unknown user', async () => {
    const { account } = await makeAccount();
    const admin = createAuthAdmin(account, 'proj', { fetchImpl: tokenFetch() as typeof fetch, nowMs: () => NOW_MS });

    expect(await admin.lookupUser('nobody')).toBeNull();
  });

  it('sets the password and reuses the access token until it nearly expires', async () => {
    const { account } = await makeAccount();
    let now = NOW_MS;
    const fetchImpl = tokenFetch();
    const admin = createAuthAdmin(account, 'proj', { fetchImpl: fetchImpl as typeof fetch, nowMs: () => now });

    await admin.setPassword('child1', 'new-pin-1');
    await admin.setPassword('child1', 'new-pin-2');
    const tokenCalls = () => fetchImpl.mock.calls.filter(([url]) => String(url).includes('oauth2')).length;
    expect(tokenCalls()).toBe(1);

    const updateCall = fetchImpl.mock.calls.find(([url]) => String(url).endsWith('accounts:update'))!;
    expect(JSON.parse(updateCall[1]!.body as string)).toEqual({ localId: 'child1', password: 'new-pin-1' });

    now += 3600 * 1000;
    await admin.setPassword('child1', 'new-pin-3');
    expect(tokenCalls()).toBe(2);
  });

  it('throws an AdminError with the status when Google refuses', async () => {
    const { account } = await makeAccount();
    const fetchImpl = tokenFetch((url) => (url.endsWith('accounts:update') ? new Response('{}', { status: 403 }) : undefined));
    const admin = createAuthAdmin(account, 'proj', { fetchImpl: fetchImpl as typeof fetch, nowMs: () => NOW_MS });

    await expect(admin.setPassword('child1', 'new-pin-1')).rejects.toMatchObject({ status: 403 });
    await expect(admin.setPassword('child1', 'new-pin-1')).rejects.toBeInstanceOf(AdminError);
  });

  it('fails when the service account token cannot be obtained', async () => {
    const { account } = await makeAccount();
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 401 }));
    const admin = createAuthAdmin(account, 'proj', { fetchImpl: fetchImpl as typeof fetch, nowMs: () => NOW_MS });

    await expect(admin.lookupUser('child1')).rejects.toMatchObject({ status: 401 });
  });
});
