import { describe, expect, it, vi } from 'vitest';
import { handleResetPinRequest } from './parent-reset-pin';

const SERVICE_ACCOUNT = JSON.stringify({ client_email: 'svc@p.iam', private_key: 'unused-in-these-tests' });
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT };

function idToken(uid: string, provider = 'google.com'): string {
  const payload = Buffer.from(JSON.stringify({ sub: uid, firebase: { sign_in_provider: provider } })).toString('base64url');
  return `header.${payload}.signature`;
}

function makeRequest(body: unknown, headers: Record<string, string> = { 'X-Firebase-Token': idToken('parent1') }, method = 'POST') {
  return new Request('https://app.test/api/parent-reset-pin', {
    method,
    headers,
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
}

function setup(overrides: { linkStatus?: number; user?: { uid: string; providerIds: string[] } | null; verify?: boolean } = {}) {
  const fetchImpl = vi.fn(async () => new Response('{}', { status: overrides.linkStatus ?? 200 }));
  const admin = {
    lookupUser: vi.fn(async () => (overrides.user === undefined ? { uid: 'child1', providerIds: ['password'] } : overrides.user)),
    setPassword: vi.fn(async () => {}),
  };
  const deps = {
    fetchImpl: fetchImpl as typeof fetch,
    verifyToken: vi.fn(async () => overrides.verify ?? true),
    verifyAppCheck: vi.fn(async () => true),
    createAdmin: vi.fn(() => admin) as never,
  };
  return { fetchImpl, admin, deps };
}

const VALID = { childUid: 'child1', newPin: '246810' };

describe('handleResetPinRequest', () => {
  it('sets the PIN for a linked parent, checking the link as that parent', async () => {
    const { fetchImpl, admin, deps } = setup();

    const response = await handleResetPinRequest(makeRequest(VALID, { 'X-Firebase-Token': idToken('parent1'), 'X-Firebase-AppCheck': 'ac' }), ENV, deps);

    expect(response.status).toBe(200);
    expect(admin.setPassword).toHaveBeenCalledWith('child1', '246810');
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain('/documents/parentLinks/parent1_child1');
    expect(init.headers).toMatchObject({ Authorization: `Bearer ${idToken('parent1')}`, 'X-Firebase-AppCheck': 'ac' });
  });

  it('refuses anything but POST', async () => {
    const { deps } = setup();
    expect((await handleResetPinRequest(makeRequest(null, {}, 'GET'), ENV, deps)).status).toBe(405);
  });

  it('refuses a missing or unverified token without touching anything', async () => {
    const { admin, fetchImpl, deps } = setup({ verify: false });

    expect((await handleResetPinRequest(makeRequest(VALID, {}), ENV, deps)).status).toBe(401);
    expect((await handleResetPinRequest(makeRequest(VALID), ENV, deps)).status).toBe(401);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(admin.setPassword).not.toHaveBeenCalled();
  });

  it('refuses a caller that is not signed in with Google', async () => {
    const { admin, deps } = setup();

    const response = await handleResetPinRequest(makeRequest(VALID, { 'X-Firebase-Token': idToken('child2', 'password') }), ENV, deps);

    expect(response.status).toBe(403);
    expect(admin.setPassword).not.toHaveBeenCalled();
  });

  it('checks App Check when it is enforced', async () => {
    const { deps } = setup();
    const enforced = { ...ENV, APPCHECK_ENFORCE: 'on' };

    expect((await handleResetPinRequest(makeRequest(VALID), enforced, deps)).status).toBe(401);
    deps.verifyAppCheck.mockResolvedValueOnce(false);
    const withBadToken = makeRequest(VALID, { 'X-Firebase-Token': idToken('parent1'), 'X-Firebase-AppCheck': 'bad' });
    expect((await handleResetPinRequest(withBadToken, enforced, deps)).status).toBe(401);
  });

  it('rejects a short PIN, a bad uid and a body that is not JSON', async () => {
    const { admin, deps } = setup();

    for (const body of [{ ...VALID, newPin: '12345' }, { ...VALID, childUid: 'a/b' }, { childUid: 'child1' }, 'not json']) {
      expect((await handleResetPinRequest(makeRequest(body), ENV, deps)).status).toBe(400);
    }
    expect(admin.setPassword).not.toHaveBeenCalled();
  });

  it('does not let a parent account change its own PIN through this route', async () => {
    const { admin, deps } = setup();

    const response = await handleResetPinRequest(makeRequest({ childUid: 'parent1', newPin: '246810' }), ENV, deps);

    expect(response.status).toBe(403);
    expect(admin.setPassword).not.toHaveBeenCalled();
  });

  it('refuses when the parent is not linked to that learner', async () => {
    const { admin, deps } = setup({ linkStatus: 403 });

    const response = await handleResetPinRequest(makeRequest(VALID), ENV, deps);

    expect(response.status).toBe(403);
    expect(admin.lookupUser).not.toHaveBeenCalled();
    expect(admin.setPassword).not.toHaveBeenCalled();
  });

  it('refuses a learner who signs in with Google, and one that does not exist', async () => {
    const google = setup({ user: { uid: 'child1', providerIds: ['google.com'] } });
    expect((await handleResetPinRequest(makeRequest(VALID), ENV, google.deps)).status).toBe(409);
    expect(google.admin.setPassword).not.toHaveBeenCalled();

    const missing = setup({ user: null });
    expect((await handleResetPinRequest(makeRequest(VALID), ENV, missing.deps)).status).toBe(404);
  });

  it('says so when the service account is not configured', async () => {
    const { deps } = setup();
    expect((await handleResetPinRequest(makeRequest(VALID), {}, deps)).status).toBe(503);
  });

  it('answers 502 without leaking details when Google fails', async () => {
    const { admin, deps } = setup();
    admin.setPassword.mockRejectedValue(new Error('secret detail'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await handleResetPinRequest(makeRequest(VALID), ENV, deps);

    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret detail');
    expect(spy.mock.calls.flat().join(' ')).not.toContain('246810');
    spy.mockRestore();
  });
});
