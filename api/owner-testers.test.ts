import { describe, expect, it, vi } from 'vitest';
import { handleOwnerTestersRequest, newInviteCode, type OwnerTestersView } from './owner-testers';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON, idToken } from './_lib/testing/parentRequestFixtures';

const NOW = Date.UTC(2026, 10, 8, 10);
const DAY = 24 * 60 * 60 * 1000;
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON, OWNER_UID: 'owner1' };
const KID = 'KidUidAaaaaaaaaaaaaaaa';
const USED_CODE = 'BCDEFGHJ23';

function setup() {
  const fake = createFakeFirestore();
  let counter = 0;
  const auth = {
    deleteUser: vi.fn(async () => undefined),
    lookupUidByEmail: vi.fn(async (email: string) => (email === 'noa12@peachnote.tutor.local' ? KID : null)),
  };
  const deps = {
    createAuth: vi.fn(() => auth) as never,
    nowMs: () => NOW,
    verifyToken: vi.fn(async () => true),
    createAdmin: vi.fn(() => fake.admin) as never,
    // Distinct codes per call: the index walks through the alphabet
    randomIndex: (limit: number) => counter++ % limit,
  };
  return { fake, deps, auth };
}

/** A tester with data in every place the removal has to reach */
function seedFullTester(fake: ReturnType<typeof createFakeFirestore>) {
  fake.seed('allowed', KID, { label: 'noa', cohort: 'x', invitedAt: NOW });
  fake.seed('entitlements', KID, { source: 'comp' });
  fake.seed('learners', KID, { displayName: 'Noa' });
  fake.seed(`learners/${KID}/stickers`, 's1', { imageDataUrl: 'x' });
  fake.seed('publicProfiles', KID, { displayName: 'Noa' });
  fake.seed('friendCodeOwners', KID, { code: 'ABCDEFGH' });
  fake.seed('friendCodes', 'ABCDEFGH', { uid: KID });
  fake.seed('usernames', 'noa12', { uid: KID });
  fake.seed('friendships', 'f1', { uids: [KID, 'otherKid'] });
  fake.seed('friendships', 'f2', { uids: ['x', 'otherKid'] });
  fake.seed('contests', 'c1', { uids: [KID, 'otherKid'] });
  fake.seed('parentLinks', 'p1', { childUid: KID, parentUid: 'parent1' });
  fake.seed('parentInvites', 'PCODE1', { childUid: KID });
  fake.seed('reportSnapshots', KID, { week: 1 });
  fake.seed('pushSubscriptions', KID, { endpoint: 'e' });
  fake.seed('analyticsDaily', 'a1', { uid: KID });
  fake.seed('feedback', 'n1', { uid: KID, text: 'fun' });
}

const REMOVED: Array<[string, string]> = [
  ['allowed', KID], ['entitlements', KID], ['learners', KID], [`learners/${KID}/stickers`, 's1'],
  ['publicProfiles', KID], ['friendCodeOwners', KID], ['friendCodes', 'ABCDEFGH'], ['usernames', 'noa12'],
  ['friendships', 'f1'], ['contests', 'c1'], ['parentLinks', 'p1'], ['parentInvites', 'PCODE1'],
  ['reportSnapshots', KID], ['pushSubscriptions', KID], ['analyticsDaily', 'a1'],
];

const call = (method: string, body?: unknown, uid: string | null = 'owner1', provider = 'google.com') =>
  new Request('https://app.test/api/owner-testers', {
    method,
    headers: uid ? { 'X-Firebase-Token': idToken(uid, provider) } : {},
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

const viewOf = async (response: Response) => (await response.json()) as OwnerTestersView;

describe('owner-testers', () => {
  it('refuses a missing token, a non-owner and a non-Google sign-in', async () => {
    const { deps } = setup();
    expect((await handleOwnerTestersRequest(call('GET', undefined, null), ENV, deps)).status).toBe(401);
    expect((await handleOwnerTestersRequest(call('GET', undefined, 'someoneElse'), ENV, deps)).status).toBe(403);
    expect((await handleOwnerTestersRequest(call('GET', undefined, 'owner1', 'password'), ENV, deps)).status).toBe(403);
  });

  it('creates one invite per alias with the cohort and expiry', async () => {
    const { fake, deps } = setup();
    const view = await viewOf(await handleOwnerTestersRequest(call('POST', { labels: [' noa ', 'dana'], cohort: 'nov26', days: 7 }), ENV, deps));
    expect(view.invites).toHaveLength(2);
    expect(view.invites.map((i) => i.label).sort()).toEqual(['dana', 'noa']);
    expect(view.invites[0]).toMatchObject({ cohort: 'nov26', status: 'open', expiresAt: NOW + 7 * DAY });
    expect(fake.get('invites', view.invites[0].code)).toMatchObject({ usedByUid: null });
  });

  it('rejects empty, too many and over-long aliases', async () => {
    const { deps } = setup();
    for (const labels of [[], [' '], ['x'.repeat(41)], Array.from({ length: 21 }, (_, i) => `k${i}`), 'noa']) {
      expect((await handleOwnerTestersRequest(call('POST', { labels }), ENV, deps)).status).toBe(400);
    }
  });

  it('lists testers, the access switch and invite status (open, used, expired)', async () => {
    const { fake, deps } = setup();
    fake.seed('allowed', KID, { label: 'noa', cohort: 'nov26', invitedAt: NOW - DAY });
    fake.seed('config', 'access', { open: false });
    fake.seed('invites', 'ABCDEFGH23', { label: 'a', cohort: 'x', createdAt: NOW, expiresAt: NOW + DAY, usedByUid: null });
    fake.seed('invites', USED_CODE, { label: 'b', cohort: 'x', createdAt: NOW - 1, expiresAt: NOW + DAY, usedByUid: KID });
    fake.seed('invites', 'OLDCODE234', { label: 'c', cohort: 'x', createdAt: NOW - 2, expiresAt: NOW - 1, usedByUid: null });
    const view = await viewOf(await handleOwnerTestersRequest(call('GET'), ENV, deps));
    expect(view.accessOpen).toBe(false);
    expect(view.testers).toEqual([{ uid: KID, label: 'noa', cohort: 'nov26', invitedAt: NOW - DAY, isGrandfathered: false }]);
    expect(view.invites.map((i) => i.status)).toEqual(['open', 'used', 'expired']);
  });

  it('withdraws an unused invite but not a used one', async () => {
    const { fake, deps } = setup();
    fake.seed('invites', 'ABCDEFGH23', { label: 'a', cohort: 'x', createdAt: NOW, expiresAt: NOW + DAY, usedByUid: null });
    fake.seed('invites', USED_CODE, { label: 'b', cohort: 'x', createdAt: NOW, expiresAt: NOW + DAY, usedByUid: KID });
    expect((await handleOwnerTestersRequest(call('DELETE', { code: 'ABCDEFGH23' }), ENV, deps)).status).toBe(200);
    expect(fake.get('invites', 'ABCDEFGH23')).toBeUndefined();
    expect((await handleOwnerTestersRequest(call('DELETE', { code: USED_CODE }), ENV, deps)).status).toBe(409);
    expect(fake.get('invites', USED_CODE)).toBeDefined();
  });

  it('locks a tester out and removes a comp entitlement, but keeps a paid one', async () => {
    const { fake, deps } = setup();
    fake.seed('allowed', KID, { label: 'noa', cohort: 'x', invitedAt: NOW });
    fake.seed('entitlements', KID, { source: 'comp' });
    await handleOwnerTestersRequest(call('DELETE', { uid: KID }), ENV, deps);
    expect(fake.get('allowed', KID)).toBeUndefined();
    expect(fake.get('entitlements', KID)).toBeUndefined();

    fake.seed('allowed', KID, { label: 'noa' });
    fake.seed('entitlements', KID, { source: 'subscription' });
    await handleOwnerTestersRequest(call('DELETE', { uid: KID }), ENV, deps);
    expect(fake.get('allowed', KID)).toBeUndefined();
    expect(fake.get('entitlements', KID)).toBeDefined();
  });

  describe('removing a tester completely', () => {
    it('deletes every record and the sign-in, keeps the friend\'s data and an uid-less note', async () => {
      const { fake, deps, auth } = setup();
      seedFullTester(fake);
      const response = await handleOwnerTestersRequest(call('DELETE', { uid: KID, erase: true, confirm: 'noa' }), ENV, deps);
      expect(response.status).toBe(200);
      for (const [collection, id] of REMOVED) expect(fake.get(collection, id), `${collection}/${id}`).toBeUndefined();
      expect(fake.get('friendships', 'f2')).toBeDefined();
      expect(fake.get('feedback', 'n1')).toEqual({ uid: '', text: 'fun', testerLabel: 'noa' });
      expect(auth.deleteUser).toHaveBeenCalledWith(KID);
    });

    it('keeps a paid entitlement', async () => {
      const { fake, deps } = setup();
      seedFullTester(fake);
      fake.seed('entitlements', KID, { source: 'subscription' });
      await handleOwnerTestersRequest(call('DELETE', { uid: KID, erase: true, confirm: 'noa' }), ENV, deps);
      expect(fake.get('entitlements', KID)).toBeDefined();
    });

    it('deletes the sign-in only after the data, so a failed run can be repeated', async () => {
      const { fake, deps, auth } = setup();
      seedFullTester(fake);
      let dataGoneWhenAuthDeleted = false;
      auth.deleteUser.mockImplementation(async () => {
        dataGoneWhenAuthDeleted = fake.get('learners', KID) === undefined && fake.get('allowed', KID) === undefined;
      });
      await handleOwnerTestersRequest(call('DELETE', { uid: KID, erase: true, confirm: 'noa' }), ENV, deps);
      expect(dataGoneWhenAuthDeleted).toBe(true);
    });

    it('answers 502 and leaves the sign-in when the Auth delete fails', async () => {
      const { fake, deps, auth } = setup();
      seedFullTester(fake);
      auth.deleteUser.mockRejectedValue(new Error('boom'));
      expect((await handleOwnerTestersRequest(call('DELETE', { uid: KID, erase: true, confirm: 'noa' }), ENV, deps)).status).toBe(502);
    });

    it('deletes nothing without a confirmation that matches the alias', async () => {
      const { fake, deps, auth } = setup();
      seedFullTester(fake);
      for (const body of [{ uid: KID, erase: true }, { uid: KID, erase: true, confirm: '' }, { uid: KID, erase: true, confirm: 'dana' }]) {
        expect((await handleOwnerTestersRequest(call('DELETE', body), ENV, deps)).status).toBe(400);
      }
      for (const [collection, id] of REMOVED) expect(fake.get(collection, id), `${collection}/${id}`).toBeDefined();
      expect(auth.deleteUser).not.toHaveBeenCalled();
    });

    it('refuses an unknown tester and the owner\'s own account', async () => {
      const { fake, deps, auth } = setup();
      expect((await handleOwnerTestersRequest(call('DELETE', { uid: KID, erase: true, confirm: 'noa' }), ENV, deps)).status).toBe(404);
      const ownerUid = { ...ENV, OWNER_UID: KID };
      fake.seed('allowed', KID, { label: 'noa' });
      expect((await handleOwnerTestersRequest(call('DELETE', { uid: KID, erase: true, confirm: 'noa' }, KID), ownerUid, deps)).status).toBe(400);
      expect(auth.deleteUser).not.toHaveBeenCalled();
    });

    it('removes a locked-out account by its username, which must be typed exactly', async () => {
      const { fake, deps, auth } = setup();
      seedFullTester(fake);
      fake.docs.delete(`allowed/${KID}`);
      expect((await handleOwnerTestersRequest(call('DELETE', { username: 'noa12', erase: true, confirm: 'noa1' }), ENV, deps)).status).toBe(400);
      expect((await handleOwnerTestersRequest(call('DELETE', { username: 'ghost', erase: true, confirm: 'ghost' }), ENV, deps)).status).toBe(404);
      expect(auth.deleteUser).not.toHaveBeenCalled();

      expect((await handleOwnerTestersRequest(call('DELETE', { username: 'Noa12', erase: true, confirm: 'noa12' }), ENV, deps)).status).toBe(200);
      expect(fake.get('learners', KID)).toBeUndefined();
      expect(auth.deleteUser).toHaveBeenCalledWith(KID);
    });
  });

  it('archives used and expired invites, keeps open ones visible and counts the archived', async () => {
    const { fake, deps } = setup();
    fake.seed('invites', 'ABCDEFGH23', { label: 'a', cohort: 'x', createdAt: NOW, expiresAt: NOW + DAY, usedByUid: null });
    fake.seed('invites', 'BCDEFGHJ23', { label: 'b', cohort: 'x', createdAt: NOW, expiresAt: NOW + DAY, usedByUid: KID });
    fake.seed('invites', 'OLDCODE234', { label: 'c', cohort: 'x', createdAt: NOW, expiresAt: NOW - 1, usedByUid: null });
    fake.seed('invites', 'CDEFGHJK23', { label: 'd', cohort: 'x', createdAt: NOW, expiresAt: NOW + DAY, usedByUid: KID, archived: true });
    const before = await viewOf(await handleOwnerTestersRequest(call('GET'), ENV, deps));
    expect(before.invites).toHaveLength(3);
    expect(before.archivedInvites).toBe(1);

    const after = await viewOf(await handleOwnerTestersRequest(call('POST', { archiveFinished: true }), ENV, deps));
    expect(after.invites.map((i) => i.code)).toEqual(['ABCDEFGH23']);
    expect(after.archivedInvites).toBe(3);
    // Archived, not deleted: the record of who redeemed it stays
    expect(fake.get('invites', 'BCDEFGHJ23')).toMatchObject({ usedByUid: KID, archived: true });
  });

  it('rejects a malformed code or uid on delete', async () => {
    const { deps } = setup();
    expect((await handleOwnerTestersRequest(call('DELETE', { code: 'nope' }), ENV, deps)).status).toBe(400);
    expect((await handleOwnerTestersRequest(call('DELETE', { uid: '../x' }), ENV, deps)).status).toBe(400);
  });
});

describe('newInviteCode', () => {
  it('uses 10 characters without look-alikes', () => {
    expect(newInviteCode((limit) => limit - 1)).toMatch(/^[A-HJKMNP-Z2-9]{10}$/);
  });
});
