import { describe, expect, it, vi } from 'vitest';
import { handleSubscriptionRequest } from './subscription';
import { subscriptionFields, type Subscription } from './_lib/proBilling';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { linksFetch, parentRequest, SERVICE_ACCOUNT_JSON } from './_lib/testing/parentRequestFixtures';
import type { PaymentProvider } from './_lib/payments/provider';

const NOW = Date.UTC(2026, 9, 28);
const DAY = 24 * 60 * 60 * 1000;
const SUB_ID = 'a'.repeat(32);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON };

function plan(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: SUB_ID, payerParentUid: 'parent1', childUids: ['kid1', 'kid2'], seatLimit: 2, period: 'monthly', status: 'active',
    periodEnd: NOW + 20 * DAY, amountAgorot: 6400, provider: 'grow', recurringRef: 'DD7', billing: 'BILLING',
    lastRemovalAt: 0, lastSwapAt: 0, createdAt: NOW - 10 * DAY, ...overrides,
  };
}

function setup(sub: Subscription = plan(), linked = ['parent1_kid1', 'parent1_kid2', 'parent1_kid3']) {
  const fake = createFakeFirestore();
  fake.seed('subscriptions', SUB_ID, subscriptionFields(sub, NOW));
  const gateway = {
    id: 'grow',
    createPaymentPage: vi.fn(),
    confirmPayment: vi.fn(),
    acknowledge: vi.fn(),
    updateRecurring: vi.fn(async () => {}),
  } satisfies PaymentProvider;
  const deps = {
    fetchImpl: linksFetch(linked) as unknown as typeof fetch,
    verifyToken: vi.fn(async () => true),
    nowMs: () => NOW,
    createAdmin: vi.fn(() => fake.admin) as never,
    createProvider: vi.fn(() => gateway) as never,
  };
  return { fake, gateway, deps };
}

const call = (body: Record<string, unknown>, uid = 'parent1') =>
  parentRequest('/api/subscription', { subscriptionId: SUB_ID, ...body }, uid);

describe('handleSubscriptionRequest', () => {
  it('cancels a monthly plan at the gateway and keeps Pro until periodEnd', async () => {
    const { fake, gateway, deps } = setup();

    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), ENV, deps)).status).toBe(200);

    expect(gateway.updateRecurring).toHaveBeenCalledWith('BILLING', { cancel: true });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ status: 'canceled', periodEnd: NOW + 20 * DAY });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'canceled', periodEnd: NOW + 20 * DAY });
  });

  it('has nothing to cancel on a yearly plan', async () => {
    const { gateway, deps } = setup(plan({ period: 'yearly', amountAgorot: 56900 }));
    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), ENV, deps)).status).toBe(409);
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
  });

  it('hides another parent\'s plan', async () => {
    const { gateway, deps } = setup();
    expect((await handleSubscriptionRequest(call({ action: 'cancel' }, 'parent2'), ENV, deps)).status).toBe(404);
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
  });

  it('adds a linked child, re-pricing the next monthly charge', async () => {
    const { fake, gateway, deps } = setup();

    const response = await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps);

    expect(await response.json()).toEqual({ ok: true, amountAgorot: 8900, seatLimit: 3 });
    expect(gateway.updateRecurring).toHaveBeenCalledWith('BILLING', { amountAgorot: 8900 });
    expect(fake.get('entitlements', 'kid3')).toMatchObject({ status: 'active', subscriptionId: SUB_ID });
  });

  it('refuses an unlinked child or one who holds a seat on another plan', async () => {
    const unlinked = setup(plan(), ['parent1_kid1', 'parent1_kid2']);
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, unlinked.deps)).status).toBe(403);
    const taken = setup();
    taken.fake.seed('entitlements', 'kid3', { status: 'active', periodEnd: NOW + DAY, subscriptionId: 'other' });
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, taken.deps)).status).toBe(409);
    expect(taken.gateway.updateRecurring).not.toHaveBeenCalled();
  });

  it('enforces the swap cooldown', async () => {
    const { deps } = setup(plan({ childUids: ['kid1'], lastRemovalAt: NOW - DAY, lastSwapAt: NOW - 5 * DAY }));
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps)).status).toBe(429);
  });

  it('removes a child, who keeps Pro until periodEnd without a seat', async () => {
    const { fake, gateway, deps } = setup();

    expect((await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid2' }), ENV, deps)).status).toBe(200);

    expect(gateway.updateRecurring).toHaveBeenCalledWith('BILLING', { amountAgorot: 3900 });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ childUids: ['kid1'], lastRemovalAt: NOW });
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ status: 'canceled', periodEnd: NOW + 20 * DAY });    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'active' });
  });

  it('lets a child who leaves a yearly plan keep Pro for at most a month', async () => {
    const { fake, deps } = setup(plan({ period: 'yearly', amountAgorot: 56900, periodEnd: NOW + 300 * DAY }));
    expect((await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid2' }), ENV, deps)).status).toBe(200);
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ status: 'canceled', periodEnd: Date.UTC(2026, 10, 28) });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ periodEnd: NOW + 300 * DAY });
  });

  it('puts the gateway amount back when the plan changed meanwhile', async () => {
    const { fake, gateway, deps } = setup();
    const commit = fake.admin.commit;
    fake.admin.commit = async (writes) => {
      fake.seed('subscriptions', SUB_ID, subscriptionFields(plan(), NOW));
      return commit(writes);
    };

    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps)).status).toBe(409);
    expect(gateway.updateRecurring).toHaveBeenNthCalledWith(2, 'BILLING', { amountAgorot: 6400 });
  });

  it("refuses the seat when another plan took the child meanwhile, and puts the amount back", async () => {
    const { fake, gateway, deps } = setup();
    const commit = fake.admin.commit;
    fake.admin.commit = async (writes) => {
      fake.seed('entitlements', 'kid3', { status: 'active', periodEnd: NOW + 30 * DAY, subscriptionId: 'other' });
      return commit(writes);
    };

    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps)).status).toBe(409);
    expect(fake.get('entitlements', 'kid3')).toMatchObject({ subscriptionId: 'other' });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ childUids: ['kid1', 'kid2'] });
    expect(gateway.updateRecurring).toHaveBeenNthCalledWith(2, 'BILLING', { amountAgorot: 6400 });
  });

  it('changes nothing when the gateway refuses', async () => {
    const { fake, gateway, deps } = setup();
    gateway.updateRecurring.mockRejectedValueOnce(new Error('down'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps)).status).toBe(502);
    errors.mockRestore();
    expect(fake.get('entitlements', 'kid3')).toBeUndefined();
  });

  it('rejects malformed requests', async () => {
    const { deps } = setup();
    expect((await handleSubscriptionRequest(call({ action: 'delete' }), ENV, deps)).status).toBe(400);
    expect((await handleSubscriptionRequest(call({ action: 'addChild' }), ENV, deps)).status).toBe(400);
    expect((await handleSubscriptionRequest(parentRequest('/api/subscription', { action: 'cancel', subscriptionId: '../x' }), ENV, deps)).status).toBe(400);
  });
});
