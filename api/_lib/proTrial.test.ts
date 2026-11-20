import { describe, expect, it, vi } from 'vitest';
import { handleSubscriptionRequest as handleProTrialRequest } from '../subscription';
import { createFakeFirestore } from './testing/fakeFirestoreAdmin';
import { linksFetch, parentRequest, SERVICE_ACCOUNT_JSON } from './testing/parentRequestFixtures';

const NOW = Date.UTC(2026, 10, 20);
const DAY = 24 * 60 * 60 * 1000;
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON };

function setup({ linked = ['parent1_kid1'], hasProvider = true } = {}) {
  const fake = createFakeFirestore();
  const deps = {
    fetchImpl: linksFetch(linked) as unknown as typeof fetch,
    verifyToken: vi.fn(async () => true),
    nowMs: () => NOW,
    createAdmin: vi.fn(() => fake.admin) as never,
    createProvider: vi.fn(() => (hasProvider ? {} : null)) as never,
  };
  return { fake, deps };
}

const call = (body: Record<string, unknown> = { childUid: 'kid1' }, uid = 'parent1') =>
  parentRequest('/api/subscription', { action: 'startTrial', ...body }, uid);

describe('starting a free Pro week (api/subscription, action startTrial)', () => {
  it('starts a 7-day Pro week for a linked child, with no grace and a record of the week', async () => {
    const { fake, deps } = setup();

    const response = await handleProTrialRequest(call(), ENV, deps);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, endsAt: NOW + 7 * DAY });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({
      plan: 'pro',
      status: 'active',
      source: 'trial',
      billingPeriod: null,
      periodEnd: NOW + 7 * DAY,
      payerParentUid: 'parent1',
    });
    expect(fake.get('proTrials', 'kid1')).toMatchObject({ parentUid: 'parent1', startedAt: NOW, endsAt: NOW + 7 * DAY });
  });

  it('gives each child one week only', async () => {
    const { deps } = setup();
    expect((await handleProTrialRequest(call(), ENV, deps)).status).toBe(200);

    const second = await handleProTrialRequest(call(), ENV, deps);
    expect(second.status).toBe(409);
    expect(await second.json()).toMatchObject({ reason: 'trial_used' });
  });

  it('gives no week to a child who has or had Pro', async () => {
    const { fake, deps } = setup();
    fake.seed('entitlements', 'kid1', { plan: 'pro', status: 'expired', source: 'subscription', periodEnd: NOW - 30 * DAY });

    const response = await handleProTrialRequest(call(), ENV, deps);

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ reason: 'had_pro' });
    expect(fake.get('proTrials', 'kid1')).toBeUndefined();
  });

  it('refuses a parent who is not linked to the child, and a parent asking for themself', async () => {
    const { fake, deps } = setup({ linked: [] });
    expect((await handleProTrialRequest(call(), ENV, deps)).status).toBe(403);
    expect((await handleProTrialRequest(call({ childUid: 'parent1' }), ENV, deps)).status).toBe(403);
    expect(fake.get('entitlements', 'kid1')).toBeUndefined();
  });

  it('refuses a bad request and works only where Pro is sold', async () => {
    expect((await handleProTrialRequest(call({ childUid: '../x' }), ENV, setup().deps)).status).toBe(400);
    expect((await handleProTrialRequest(call(), ENV, setup({ hasProvider: false }).deps)).status).toBe(503);
  });

  it('needs a signed-in parent', async () => {
    const { deps } = setup();
    const response = await handleProTrialRequest(call(), ENV, { ...deps, verifyToken: vi.fn(async () => false) });
    expect(response.status).toBe(401);
  });
});
