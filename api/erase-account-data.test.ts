import { describe, expect, it, vi } from 'vitest';
import { handleEraseAccountDataRequest } from './erase-account-data';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON, idToken } from './_lib/testing/parentRequestFixtures';

const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON };
const KID = 'KidUidAaaaaaaaaaaaaaaa';
const OTHER = 'OtherUidBbbbbbbbbbbbbb';

const call = (uid: string | null = KID, method = 'POST') =>
  new Request('https://app.test/api/erase-account-data', { method, headers: uid ? { 'X-Firebase-Token': idToken(uid, 'password') } : {} });

function setup(entitlement: Record<string, string | number>) {
  const fake = createFakeFirestore();
  fake.seed('analyticsDaily', `2026-11-08_${KID}`, { uid: KID, day: '2026-11-08' });
  fake.seed('analyticsDaily', `2026-11-08_${OTHER}`, { uid: OTHER, day: '2026-11-08' });
  fake.seed('missionStruggle', `2026-11-08_${KID}_m1_explorer`, { uid: KID, day: '2026-11-08' });
  fake.seed('missionStruggle', `2026-11-08_${OTHER}_m1_explorer`, { uid: OTHER, day: '2026-11-08' });
  fake.seed('feedback', 'n1', { uid: KID, text: 'hi' });
  fake.seed('allowed', KID, { cohort: 'tester', label: 'noa' });
  fake.seed('signups', KID, { uid: KID, day: '2026-11-08', src: 'landing' });
  fake.seed('entitlements', KID, entitlement);
  return { fake, deps: { verifyToken: vi.fn(async () => true), createAdmin: vi.fn(() => fake.admin) as never } };
}

describe('erase-account-data', () => {
  it('removes the counters, access record and comp entitlement, and keeps the notes without the account link', async () => {
    const { fake, deps } = setup({ plan: 'pro', source: 'comp' });
    expect((await handleEraseAccountDataRequest(call(), ENV, deps)).status).toBe(200);
    expect(fake.get('analyticsDaily', `2026-11-08_${KID}`)).toBeUndefined();
    expect(fake.get('missionStruggle', `2026-11-08_${KID}_m1_explorer`)).toBeUndefined();
    expect(fake.get('missionStruggle', `2026-11-08_${OTHER}_m1_explorer`)).toBeDefined();
    expect(fake.get('feedback', 'n1')).toMatchObject({ uid: '', testerLabel: 'noa', text: 'hi' });
    expect(fake.get('allowed', KID)).toBeUndefined();
    expect(fake.get('signups', KID)).toBeUndefined();
    expect(fake.get('entitlements', KID)).toBeUndefined();
    expect(fake.get('analyticsDaily', `2026-11-08_${OTHER}`)).toBeDefined();
  });

  it('keeps a paid subscription entitlement', async () => {
    const { fake, deps } = setup({ plan: 'pro', source: 'subscription' });
    await handleEraseAccountDataRequest(call(), ENV, deps);
    expect(fake.get('entitlements', KID)).toBeDefined();
  });

  it('rejects no token and the wrong method', async () => {
    const { deps } = setup({ source: 'comp' });
    expect((await handleEraseAccountDataRequest(call(null), ENV, deps)).status).toBe(401);
    expect((await handleEraseAccountDataRequest(new Request('https://app.test/x', { method: 'GET' }), ENV, deps)).status).toBe(405);
  });
});
