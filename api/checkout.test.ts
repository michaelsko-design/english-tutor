import { describe, expect, it, vi } from 'vitest';
import { handleCheckoutRequest, MAX_PENDING_CHECKOUTS_PER_DAY } from './checkout';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { linksFetch, parentRequest, SERVICE_ACCOUNT_JSON } from './_lib/testing/parentRequestFixtures';
import type { PaymentProvider } from './_lib/payments/provider';

const NOW = Date.UTC(2026, 9, 28);
const CHECKOUT_ID = 'c'.repeat(32);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON, PAYMENT_WEBHOOK_SECRET: 'hook-secret', APP_ORIGIN: 'https://app.example' };
const PAYER = { payerName: 'ישראל ישראלי', payerPhone: '050-123-4567' };

function setup({ linked = ['parent1_kid1', 'parent1_kid2'], provider = true } = {}) {
  const fake = createFakeFirestore();
  const gateway = {
    id: 'grow',
    createPaymentPage: vi.fn(async () => ({ url: 'https://pay.example/page', processId: 'p1', processToken: 'secret-token' })),
    confirmPayment: vi.fn(),
    acknowledge: vi.fn(),
    updateRecurring: vi.fn(),
  } satisfies PaymentProvider;
  const deps = {
    fetchImpl: linksFetch(linked) as unknown as typeof fetch,
    verifyToken: vi.fn(async () => true),
    nowMs: () => NOW,
    newId: () => CHECKOUT_ID,
    createAdmin: vi.fn(() => fake.admin) as never,
    createProvider: vi.fn(() => (provider ? gateway : null)) as never,
  };
  return { fake, gateway, deps };
}

const checkout = (body: Record<string, unknown>, uid = 'parent1') => parentRequest('/api/checkout', body, uid);

describe('handleCheckoutRequest', () => {
  it('prices a dry run without opening a payment page', async () => {
    const { gateway, deps } = setup();

    const response = await handleCheckoutRequest(checkout({ childUids: ['kid1', 'kid2'], period: 'yearly', dryRun: true }), ENV, deps);

    expect(await response.json()).toEqual({ amountAgorot: 56900 });
    expect(gateway.createPaymentPage).not.toHaveBeenCalled();
  });

  it('records the checkout, opens the page with the server price and keeps the process ids', async () => {
    const { fake, gateway, deps } = setup();

    const response = await handleCheckoutRequest(checkout({ childUids: ['kid1', 'kid2'], period: 'monthly', ...PAYER }), ENV, deps);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: 'https://pay.example/page' });
    expect(gateway.createPaymentPage).toHaveBeenCalledWith(expect.objectContaining({
      checkoutId: CHECKOUT_ID,
      amountAgorot: 6400,
      payerPhone: '0501234567',
      description: 'EnglishVibe Pro monthly 2 children',
      successUrl: `https://app.example/?parent&paid=${CHECKOUT_ID}`,
      notifyUrl: 'https://app.example/api/payment-webhook?source=process&key=hook-secret',
    }));
    expect(fake.get('checkouts', CHECKOUT_ID)).toMatchObject({
      parentUid: 'parent1', childUids: ['kid1', 'kid2'], period: 'monthly', seatLimit: 2, amountAgorot: 6400,
      status: 'pending', provider: 'grow', processId: 'p1', processToken: 'secret-token',
    });
  });

  it('refuses a child the parent is not linked to', async () => {
    const { fake, deps } = setup({ linked: ['parent1_kid1'] });
    const response = await handleCheckoutRequest(checkout({ childUids: ['kid1', 'kid2'], period: 'monthly', ...PAYER }), ENV, deps);
    expect(response.status).toBe(403);
    expect(fake.docs.size).toBe(0);
  });

  it('refuses a child who already holds a live seat', async () => {
    const { fake, deps } = setup();
    fake.seed('entitlements', 'kid2', { status: 'active', periodEnd: NOW + 86400000 });
    const response = await handleCheckoutRequest(checkout({ childUids: ['kid1', 'kid2'], period: 'monthly', ...PAYER }), ENV, deps);
    expect(response.status).toBe(409);
  });

  it("renews the parent's own yearly plan in its last days, but not earlier or someone else's", async () => {
    const yearly = (periodEnd: number, payerParentUid = 'parent1') =>
      ({ status: 'active', billingPeriod: 'yearly', payerParentUid, periodEnd, subscriptionId: 'old' });
    const renew = () => checkout({ childUids: ['kid1'], period: 'yearly', ...PAYER });

    const inWindow = setup();
    inWindow.fake.seed('entitlements', 'kid1', yearly(NOW + 10 * 86400000));
    expect((await handleCheckoutRequest(renew(), ENV, inWindow.deps)).status).toBe(200);

    const early = setup();
    early.fake.seed('entitlements', 'kid1', yearly(NOW + 60 * 86400000));
    expect((await handleCheckoutRequest(renew(), ENV, early.deps)).status).toBe(409);

    const monthlyRenewal = setup();
    monthlyRenewal.fake.seed('entitlements', 'kid1', yearly(NOW + 10 * 86400000));
    const monthly = checkout({ childUids: ['kid1'], period: 'monthly', ...PAYER });
    expect((await handleCheckoutRequest(monthly, ENV, monthlyRenewal.deps)).status).toBe(409);

    const otherPayer = setup();
    otherPayer.fake.seed('entitlements', 'kid1', yearly(NOW + 10 * 86400000, 'parent2'));
    expect((await handleCheckoutRequest(renew(), ENV, otherPayer.deps)).status).toBe(409);
  });

  it('renews one plan at a time: no new child or second plan in a renewal checkout', async () => {
    const yearly = (subscriptionId: string) =>
      ({ status: 'active', billingPeriod: 'yearly', payerParentUid: 'parent1', periodEnd: NOW + 10 * 86400000, subscriptionId });
    const both = () => checkout({ childUids: ['kid1', 'kid2'], period: 'yearly', ...PAYER });

    const withNewChild = setup();
    withNewChild.fake.seed('entitlements', 'kid1', yearly('old'));
    const mixed = await handleCheckoutRequest(both(), ENV, withNewChild.deps);
    expect(mixed.status).toBe(409);
    expect(await mixed.json()).toMatchObject({ code: 'renewal_separate' });

    const twoPlans = setup();
    twoPlans.fake.seed('entitlements', 'kid1', yearly('old'));
    twoPlans.fake.seed('entitlements', 'kid2', yearly('other'));
    expect((await handleCheckoutRequest(both(), ENV, twoPlans.deps)).status).toBe(409);

    const onePlan = setup();
    onePlan.fake.seed('entitlements', 'kid1', yearly('old'));
    onePlan.fake.seed('entitlements', 'kid2', yearly('old'));
    expect((await handleCheckoutRequest(both(), ENV, onePlan.deps)).status).toBe(200);
  });

  it('refuses a parent linked to more than six children', async () => {
    const { fake, gateway, deps } = setup();
    for (let i = 1; i <= 7; i += 1) fake.seed('parentLinks', `parent1_kid${i}`, { parentUid: 'parent1', childUid: `kid${i}` });

    const response = await handleCheckoutRequest(checkout({ childUids: ['kid1'], period: 'monthly', ...PAYER }), ENV, deps);

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'too_many_children' });
    expect(gateway.createPaymentPage).not.toHaveBeenCalled();
  });

  it('caps the unpaid payment pages a parent opens in a day', async () => {
    const { fake, gateway, deps } = setup();
    const seedCheckout = (id: string, fields: Record<string, string | number>) =>
      fake.seed('checkouts', id, { parentUid: 'parent1', status: 'pending', createdAt: NOW - 3600000, ...fields });
    for (let i = 1; i < MAX_PENDING_CHECKOUTS_PER_DAY; i += 1) seedCheckout(`pending${i}`, {});
    seedCheckout('paid', { status: 'paid' });
    seedCheckout('yesterday', { createdAt: NOW - 2 * 86400000 });
    seedCheckout('otherParent', { parentUid: 'parent2' });
    const body = { childUids: ['kid1'], period: 'monthly', ...PAYER };

    expect((await handleCheckoutRequest(checkout(body), ENV, deps)).status).toBe(200);
    // The one just opened is the fifth today
    const capped = await handleCheckoutRequest(checkout(body), ENV, { ...deps, newId: () => 'd'.repeat(32) });
    expect(capped.status).toBe(429);
    expect(await capped.json()).toMatchObject({ code: 'too_many_checkouts' });
    expect(gateway.createPaymentPage).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['five children', { childUids: ['a', 'b', 'c', 'd', 'e'], period: 'monthly', ...PAYER }],
    ['a repeated child', { childUids: ['kid1', 'kid1'], period: 'monthly', ...PAYER }],
    ['an unknown period', { childUids: ['kid1'], period: 'weekly', ...PAYER }],
    ['a one-word name', { childUids: ['kid1'], period: 'monthly', payerName: 'ישראל', payerPhone: '0501234567' }],
    ['a name with symbols', { childUids: ['kid1'], period: 'monthly', payerName: 'Dan <b>Cohen</b>', payerPhone: '0501234567' }],
    ['a landline', { childUids: ['kid1'], period: 'monthly', payerName: 'Dan Cohen', payerPhone: '031234567' }],
  ])('rejects %s', async (_label, body) => {
    const { deps } = setup();
    expect((await handleCheckoutRequest(checkout(body), ENV, deps)).status).toBe(400);
  });

  it('refuses the parent paying for themself, and a non-Google caller', async () => {
    const { deps } = setup();
    expect((await handleCheckoutRequest(checkout({ childUids: ['parent1'], period: 'monthly', ...PAYER }), ENV, deps)).status).toBe(403);
    const pinUser = parentRequest('/api/checkout', { childUids: ['kid1'], period: 'monthly', ...PAYER }, 'kid9', 'password');
    expect((await handleCheckoutRequest(pinUser, ENV, deps)).status).toBe(403);
  });

  it('answers 503 when payments are not configured', async () => {
    const { deps } = setup({ provider: false });
    expect((await handleCheckoutRequest(checkout({ childUids: ['kid1'], period: 'monthly', ...PAYER }), ENV, deps)).status).toBe(503);
    const { deps: deps2 } = setup();
    const noSecret = { ...ENV, PAYMENT_WEBHOOK_SECRET: '' };
    expect((await handleCheckoutRequest(checkout({ childUids: ['kid1'], period: 'monthly', ...PAYER }), noSecret, deps2)).status).toBe(503);
    const deployedWithoutOrigin = { ...ENV, APP_ORIGIN: '', VERCEL_ENV: 'production' };
    expect((await handleCheckoutRequest(checkout({ childUids: ['kid1'], period: 'monthly', ...PAYER }), deployedWithoutOrigin, deps2)).status).toBe(503);
  });

  it('answers 502 and returns no page when the gateway refuses', async () => {
    const { gateway, deps } = setup();
    gateway.createPaymentPage.mockRejectedValueOnce(new Error('down'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await handleCheckoutRequest(checkout({ childUids: ['kid1'], period: 'monthly', ...PAYER }), ENV, deps);
    expect(response.status).toBe(502);
    expect(errors).toHaveBeenCalledWith('checkout: failed (unexpected)');
    errors.mockRestore();
  });
});
