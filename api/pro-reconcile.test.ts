import { describe, expect, it, vi } from 'vitest';
import { handleProReconcileRequest } from './pro-reconcile';
import { subscriptionFields, type Subscription } from './_lib/proBilling';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON } from './_lib/testing/parentRequestFixtures';
import type { PaymentProvider } from './_lib/payments/provider';

const NOW = Date.UTC(2026, 9, 29);
const DAY = 24 * 60 * 60 * 1000;
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON, CRON_SECRET: 'cron' };

function plan(id: string, overrides: Partial<Subscription> = {}): Subscription {
  return {
    id, payerParentUid: 'parent1', childUids: ['kid1', 'kid2'], seatLimit: 2, period: 'monthly', status: 'active',
    periodEnd: NOW + 10 * DAY, amountAgorot: 6400, provider: 'grow', recurringRef: 'DD7', billing: `B-${id}`,
    lastRemovalAt: 0, lastSwapAt: 0, createdAt: 0, ...overrides,
  };
}

function setup(existing: string[], { provider = true } = {}) {
  const fake = createFakeFirestore();
  const gateway = {
    id: 'grow',
    createPaymentPage: vi.fn(),
    confirmPayment: vi.fn(),
    acknowledge: vi.fn(),
    updateRecurring: vi.fn(async () => {}),
  } satisfies PaymentProvider;
  const deps = {
    nowMs: () => NOW,
    createAdmin: vi.fn(() => fake.admin) as never,
    createProvider: vi.fn(() => (provider ? gateway : null)) as never,
    findExistingUids: vi.fn(async (uids: string[]) => new Set(uids.filter((uid) => existing.includes(uid)))),
  };
  const seedPlan = (sub: Subscription) => {
    fake.seed('subscriptions', sub.id, subscriptionFields(sub, 0));
    for (const kid of sub.childUids) {
      fake.seed('entitlements', kid, { status: sub.status, periodEnd: sub.periodEnd, subscriptionId: sub.id });
    }
  };
  return { fake, gateway, deps, seedPlan };
}

const cron = (secret = 'cron') => new Request('https://app.test/api/pro-reconcile', { headers: { authorization: `Bearer ${secret}` } });

describe('handleProReconcileRequest', () => {
  it('refuses a call without the cron secret', async () => {
    const { deps } = setup([]);
    expect((await handleProReconcileRequest(cron('wrong'), ENV, deps)).status).toBe(401);
  });

  it("frees a deleted learner's seat: lower price at the gateway, entitlement deleted", async () => {
    const { fake, gateway, deps, seedPlan } = setup(['parent1', 'kid1']);
    seedPlan(plan('s1'));

    const response = await handleProReconcileRequest(cron(), ENV, deps);

    expect(await response.json()).toMatchObject({ released: 1, deleted: 1, failed: 0 });
    expect(gateway.updateRecurring).toHaveBeenCalledWith('B-s1', { amountAgorot: 3900 });
    expect(fake.get('subscriptions', 's1')).toMatchObject({ childUids: ['kid1'], amountAgorot: 3900, seatLimit: 1 });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ seatLimit: 1, subscriptionId: 's1' });
    expect(fake.get('entitlements', 'kid2')).toBeUndefined();
  });

  it("stops a deleted payer's renewals", async () => {
    const { fake, gateway, deps, seedPlan } = setup(['kid1', 'kid2']);
    seedPlan(plan('s1'));

    await handleProReconcileRequest(cron(), ENV, deps);

    expect(gateway.updateRecurring).toHaveBeenCalledWith('B-s1', { cancel: true });
    expect(fake.get('subscriptions', 's1')).toMatchObject({ status: 'canceled' });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'canceled' });
  });

  it('expires ended plans and seats, and only reports a monthly plan that missed its renewal', async () => {
    const { fake, deps, seedPlan } = setup(['parent1', 'kid1', 'kid2', 'kid3']);
    seedPlan(plan('ended', { status: 'canceled', periodEnd: NOW - 5 * DAY, childUids: ['kid1'] }));
    seedPlan(plan('missed', { periodEnd: NOW - 5 * DAY, childUids: ['kid2'] }));
    seedPlan(plan('live', { childUids: ['kid3'] }));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await handleProReconcileRequest(cron(), ENV, deps);

    errors.mockRestore();
    expect(await response.json()).toMatchObject({ expired: 3, missedRenewals: 1, released: 0, deleted: 0 });
    expect(fake.get('subscriptions', 'ended')).toMatchObject({ status: 'expired' });
    expect(fake.get('subscriptions', 'missed')).toMatchObject({ status: 'active' });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'expired' });
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ status: 'expired' });
    expect(fake.get('entitlements', 'kid3')).toMatchObject({ status: 'active' });
  });

  it('leaves a seat that needs the gateway when no gateway is configured', async () => {
    const { fake, deps, seedPlan } = setup(['parent1', 'kid1'], { provider: false });
    seedPlan(plan('s1'));

    expect(await (await handleProReconcileRequest(cron(), ENV, deps)).json()).toMatchObject({ released: 0, failed: 1 });
    expect(fake.get('subscriptions', 's1')).toMatchObject({ childUids: ['kid1', 'kid2'] });
  });

  it('deletes nothing when the lookup finds no account at all', async () => {
    const { fake, deps, seedPlan } = setup([]);
    seedPlan(plan('s1'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await handleProReconcileRequest(cron(), ENV, deps);

    errors.mockRestore();
    expect(response.status).toBe(502);
    expect(fake.get('entitlements', 'kid1')).toBeDefined();
  });
});
