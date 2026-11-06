import { describe, expect, it, vi } from 'vitest';
import { handleOwnerTestUsersRequest, resolveTestUserUid, type AccountLookup } from './owner-test-users';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON, idToken } from './_lib/testing/parentRequestFixtures';

const NOW = Date.UTC(2026, 10, 6, 10);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON, OWNER_UID: 'owner1' };
const NOA_UID = 'AbCdEfGhIjKlMnOpQrSt12';
const MOM_UID = 'ZyXwVuTsRqPoNmLkJiHg34';
const UID_ONLY = 'UidOnlyAccount1234567890';

/** Accounts that exist: noa12@peachnote.tutor.local and mom@gmail.com, plus one that can only be found by uid. */
function lookup() {
  const emails: Record<string, string> = { 'noa12@peachnote.tutor.local': NOA_UID, 'mom@gmail.com': MOM_UID };
  const byEmail = vi.fn(async (email: string) => emails[email] ?? null);
  const accounts: AccountLookup = { lookupUidByEmail: byEmail, uidExists: async (uid) => uid === UID_ONLY };
  return { accounts, byEmail };
}

function setup() {
  const fake = createFakeFirestore();
  const { accounts, byEmail } = lookup();
  const deps = {
    nowMs: () => NOW,
    verifyToken: vi.fn(async () => true),
    createAdmin: vi.fn(() => fake.admin) as never,
    createLookup: vi.fn(() => accounts),
  };
  return { fake, deps, byEmail };
}

const call = (method: string, body?: unknown, uid: string | null = 'owner1', provider = 'google.com') =>
  new Request('https://app.test/api/owner-test-users', {
    method,
    headers: uid ? { 'X-Firebase-Token': idToken(uid, provider) } : {},
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

describe('owner-test-users access', () => {
  it('refuses a call without a token, a non-owner and a non-Google sign-in', async () => {
    const { deps } = setup();
    expect((await handleOwnerTestUsersRequest(call('GET', undefined, null), ENV, deps)).status).toBe(401);
    expect((await handleOwnerTestUsersRequest(call('GET', undefined, 'someone-else'), ENV, deps)).status).toBe(403);
    expect((await handleOwnerTestUsersRequest(call('GET', undefined, 'owner1', 'password'), ENV, deps)).status).toBe(403);
  });

  it('never changes the list for a non-owner', async () => {
    const { deps, fake } = setup();
    const response = await handleOwnerTestUsersRequest(call('POST', { identifier: 'noa12' }, 'someone-else'), ENV, deps);
    expect(response.status).toBe(403);
    expect(fake.commits).toHaveLength(0);
  });
});

describe('owner-test-users list', () => {
  it('lists the saved accounts, newest first', async () => {
    const { deps, fake } = setup();
    fake.seed('testUsers', NOA_UID, { label: 'noa12', addedAt: 1 });
    fake.seed('testUsers', MOM_UID, { label: 'mom@gmail.com', addedAt: 2 });
    const body = await (await handleOwnerTestUsersRequest(call('GET'), ENV, deps)).json();
    expect(body.users.map((u: { label: string }) => u.label)).toEqual(['mom@gmail.com', 'noa12']);
  });

  it('adds a learner by username through the sign-in email', async () => {
    const { deps, fake, byEmail } = setup();
    const response = await handleOwnerTestUsersRequest(call('POST', { identifier: '  Noa12 ' }), ENV, deps);
    expect(response.status).toBe(200);
    expect(byEmail).toHaveBeenCalledWith('noa12@peachnote.tutor.local');
    expect(fake.get('testUsers', NOA_UID)).toEqual({ label: 'Noa12', addedAt: NOW });
    expect((await response.json()).users).toEqual([{ uid: NOA_UID, label: 'Noa12', addedAt: NOW }]);
  });

  it('adds a Google account by email and an account by uid', async () => {
    const { deps, fake } = setup();
    await handleOwnerTestUsersRequest(call('POST', { identifier: 'Mom@Gmail.com' }), ENV, deps);
    await handleOwnerTestUsersRequest(call('POST', { identifier: UID_ONLY }), ENV, deps);
    expect(fake.get('testUsers', MOM_UID)).toBeDefined();
    expect(fake.get('testUsers', UID_ONLY)).toBeDefined();
  });

  it('keeps one entry when the same account is added twice', async () => {
    const { deps } = setup();
    await handleOwnerTestUsersRequest(call('POST', { identifier: 'noa12' }), ENV, deps);
    const body = await (await handleOwnerTestUsersRequest(call('POST', { identifier: 'noa12' }), ENV, deps)).json();
    expect(body.users).toHaveLength(1);
  });

  it('answers 404 for an account that does not exist and saves nothing', async () => {
    const { deps, fake } = setup();
    const response = await handleOwnerTestUsersRequest(call('POST', { identifier: 'ghost' }), ENV, deps);
    expect(response.status).toBe(404);
    expect(fake.commits).toHaveLength(0);
  });

  it('rejects an empty, oversized or missing identifier', async () => {
    const { deps } = setup();
    expect((await handleOwnerTestUsersRequest(call('POST', { identifier: '   ' }), ENV, deps)).status).toBe(400);
    expect((await handleOwnerTestUsersRequest(call('POST', { identifier: 'x'.repeat(121) }), ENV, deps)).status).toBe(400);
    expect((await handleOwnerTestUsersRequest(call('POST', {}), ENV, deps)).status).toBe(400);
    expect((await handleOwnerTestUsersRequest(call('POST', [1]), ENV, deps)).status).toBe(400);
  });

  it('removes an account from the list', async () => {
    const { deps, fake } = setup();
    fake.seed('testUsers', NOA_UID, { label: 'noa12', addedAt: 1 });
    const response = await handleOwnerTestUsersRequest(call('DELETE', { uid: NOA_UID }), ENV, deps);
    expect(response.status).toBe(200);
    expect((await response.json()).users).toEqual([]);
    expect(fake.get('testUsers', NOA_UID)).toBeUndefined();
  });

  it('rejects a removal that is not a uid, so a path cannot be injected', async () => {
    const { deps } = setup();
    expect((await handleOwnerTestUsersRequest(call('DELETE', { uid: '../learners/x' }), ENV, deps)).status).toBe(400);
  });

  it('stops growing at the cap', async () => {
    const { deps, fake } = setup();
    for (let i = 0; i < 200; i += 1) fake.seed('testUsers', `uid${String(i).padStart(20, '0')}`, { label: `t${i}`, addedAt: i });
    expect((await handleOwnerTestUsersRequest(call('POST', { identifier: 'noa12' }), ENV, deps)).status).toBe(400);
  });

  it('hides the failure details', async () => {
    const { deps } = setup();
    deps.createLookup.mockImplementation(() => {
      throw new Error('secret detail');
    });
    const response = await handleOwnerTestUsersRequest(call('POST', { identifier: 'noa12' }), ENV, deps);
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret detail');
  });
});

describe('resolveTestUserUid', () => {
  it('prefers the email match and only treats uid-shaped text as a uid', async () => {
    const { accounts } = lookup();
    expect(await resolveTestUserUid(accounts, 'noa12')).toBe(NOA_UID);
    expect(await resolveTestUserUid(accounts, UID_ONLY)).toBe(UID_ONLY);
    expect(await resolveTestUserUid(accounts, 'short')).toBeNull();
  });
});
