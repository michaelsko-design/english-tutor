import { describe, expect, it, vi } from 'vitest';
import { handleRedeemInviteRequest } from './redeem-invite';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON, idToken } from './_lib/testing/parentRequestFixtures';

const NOW = Date.UTC(2026, 10, 8, 10);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON };
const CODE = 'ABCDEFGH23';
const KID = 'KidUidAaaaaaaaaaaaaaaa';
const OTHER = 'OtherUidBbbbbbbbbbbbbb';

function setup(invite: Record<string, string | number | null> | null = { label: 'noa', cohort: 'tester-nov26', expiresAt: NOW + 1000, usedByUid: null }) {
  const fake = createFakeFirestore();
  if (invite) fake.seed('invites', CODE, invite);
  const deps = { nowMs: () => NOW, verifyToken: vi.fn(async () => true), createAdmin: vi.fn(() => fake.admin) as never };
  return { fake, deps };
}

const call = (body: unknown, uid: string | null = KID, provider = 'password', method = 'POST') =>
  new Request('https://app.test/api/redeem-invite', {
    method,
    headers: uid ? { 'X-Firebase-Token': idToken(uid, provider) } : {},
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });

describe('redeem-invite', () => {
  it('allows the learner, grants comp Pro and uses up the code', async () => {
    const { fake, deps } = setup();
    const response = await handleRedeemInviteRequest(call({ code: CODE }), ENV, deps);
    expect(response.status).toBe(200);
    expect(fake.get('allowed', KID)).toMatchObject({ cohort: 'tester-nov26', label: 'noa' });
    expect(fake.get('entitlements', KID)).toMatchObject({ plan: 'pro', source: 'comp' });
    expect(fake.get('invites', CODE)).toMatchObject({ usedByUid: KID });
  });

  it('accepts a lower-case code with spaces', async () => {
    const { deps } = setup();
    expect((await handleRedeemInviteRequest(call({ code: ` ${CODE.toLowerCase()} ` }), ENV, deps)).status).toBe(200);
  });

  it('is idempotent for the same learner', async () => {
    const { deps } = setup();
    await handleRedeemInviteRequest(call({ code: CODE }), ENV, deps);
    expect((await handleRedeemInviteRequest(call({ code: CODE }), ENV, deps)).status).toBe(200);
  });

  it('refuses a code another learner already used, and allows nothing', async () => {
    const { fake, deps } = setup();
    await handleRedeemInviteRequest(call({ code: CODE }), ENV, deps);
    const response = await handleRedeemInviteRequest(call({ code: CODE }, OTHER), ENV, deps);
    expect(response.status).toBe(409);
    expect(fake.get('allowed', OTHER)).toBeUndefined();
  });

  it('refuses an expired, unknown or malformed code', async () => {
    const expired = setup({ label: 'x', cohort: 'c', expiresAt: NOW - 1, usedByUid: null });
    expect((await handleRedeemInviteRequest(call({ code: CODE }), ENV, expired.deps)).status).toBe(410);
    const unknown = setup(null);
    expect((await handleRedeemInviteRequest(call({ code: CODE }), ENV, unknown.deps)).status).toBe(404);
    expect((await handleRedeemInviteRequest(call({ code: 'short' }), ENV, unknown.deps)).status).toBe(400);
    expect(unknown.fake.commits).toHaveLength(0);
  });

  it('refuses guests, missing tokens and other methods', async () => {
    const { deps, fake } = setup();
    expect((await handleRedeemInviteRequest(call({ code: CODE }, null), ENV, deps)).status).toBe(401);
    expect((await handleRedeemInviteRequest(call({ code: CODE }, KID, 'anonymous'), ENV, deps)).status).toBe(401);
    expect((await handleRedeemInviteRequest(call(undefined, KID, 'password', 'GET'), ENV, deps)).status).toBe(405);
    expect(fake.commits).toHaveLength(0);
  });

  it('keeps a paid subscription entitlement', async () => {
    const { fake, deps } = setup();
    fake.seed('entitlements', KID, { plan: 'pro', source: 'subscription', status: 'active' });
    await handleRedeemInviteRequest(call({ code: CODE }), ENV, deps);
    expect(fake.get('entitlements', KID)).toMatchObject({ source: 'subscription' });
    expect(fake.get('allowed', KID)).toBeDefined();
  });
});
