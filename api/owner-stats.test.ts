import { describe, expect, it, vi } from 'vitest';
import { handleOwnerStatsRequest } from './owner-stats';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON, idToken } from './_lib/testing/parentRequestFixtures';

const NOW = Date.UTC(2026, 9, 29, 10);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON, OWNER_UID: 'owner1' };

function setup() {
  const fake = createFakeFirestore();
  fake.seed('learners', 'kid1', { gradeId: 'grade-4', isOnboarded: true });
  fake.seed('learners', 'guest1', { gradeId: 'grade-1', isOnboarded: false });
  fake.seed('entitlements', 'kid1', { status: 'active', periodEnd: NOW + 1000 });
  fake.seed('parentLinks', 'mom1_kid1', { parentUid: 'mom1', childUid: 'kid1' });
  fake.seed('pushSubscriptions', 'kid1', { streakDays: 3 });
  fake.seed('reminderSends', '2026-10-29_kid1', { uid: 'kid1', dateStr: '2026-10-29', kind: 'streak' });
  const deps = {
    nowMs: () => NOW,
    verifyToken: vi.fn(async () => true),
    createAdmin: vi.fn(() => fake.admin) as never,
    findAnonymousUids: vi.fn(async () => new Set(['guest1'])),
  };
  return { deps };
}

const call = (uid: string | null, provider = 'google.com') =>
  new Request('https://app.test/api/owner-stats', { headers: uid ? { 'X-Firebase-Token': idToken(uid, provider) } : {} });

describe('handleOwnerStatsRequest', () => {
  it('refuses a call without a token', async () => {
    const { deps } = setup();
    expect((await handleOwnerStatsRequest(call(null), ENV, deps)).status).toBe(401);
  });

  it('refuses a signed-in account that is not the owner', async () => {
    const { deps } = setup();
    expect((await handleOwnerStatsRequest(call('someone-else'), ENV, deps)).status).toBe(403);
  });

  it('refuses a non-Google sign-in even with the owner uid', async () => {
    const { deps } = setup();
    expect((await handleOwnerStatsRequest(call('owner1', 'password'), ENV, deps)).status).toBe(403);
  });

  it('is off when no owner is configured', async () => {
    const { deps } = setup();
    expect((await handleOwnerStatsRequest(call('owner1'), { ...ENV, OWNER_UID: undefined }, deps)).status).toBe(503);
  });

  it('answers the owner with aggregates only', async () => {
    const { deps } = setup();
    const response = await handleOwnerStatsRequest(call('owner1'), ENV, deps);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.totals).toMatchObject({ registered: 1, guests: 1, pro: 1 });
    expect(body.byGrade).toEqual([expect.objectContaining({ gradeId: 'grade-4', users: 1, proUsers: 1 })]);
    expect(body.parents).toEqual({ withChildren: 1, links: 1, avgKidsPerParent: 1 });
    expect(body.reminders).toMatchObject({ subscribers: 1, sent: 1, practised: 0 });
    expect(JSON.stringify(body)).not.toContain('kid1');
    expect(JSON.stringify(body)).not.toContain('mom1');
  });

  it('hides the failure details', async () => {
    const { deps } = setup();
    deps.findAnonymousUids.mockRejectedValueOnce(new Error('secret detail'));
    const response = await handleOwnerStatsRequest(call('owner1'), ENV, deps);
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret detail');
  });
});
