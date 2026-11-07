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
  const deps = {
    nowMs: () => NOW,
    verifyToken: vi.fn(async () => true),
    createAdmin: vi.fn(() => fake.admin) as never,
    // Distinct codes per call: the index walks through the alphabet
    randomIndex: (limit: number) => counter++ % limit,
  };
  return { fake, deps };
}

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
