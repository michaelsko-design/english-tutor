import { describe, expect, it, vi } from 'vitest';
import { handlePaymentWebhook } from './payment-webhook';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON } from './_lib/testing/parentRequestFixtures';
import type { ConfirmedPayment, PaymentProvider } from './_lib/payments/provider';

const NOW = Date.UTC(2026, 9, 28, 12);
const DAY = 24 * 60 * 60 * 1000;
const CHECKOUT_ID = 'c'.repeat(32);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON, PAYMENT_WEBHOOK_SECRET: 'hook-secret', GROW_WEBHOOK_KEY: 'GROWKEY' };

const PAID: ConfirmedPayment = {
  transactionId: 'T100', amountAgorot: 6400, recurringRef: 'DD7', billing: '{"transactionId":"T100"}', details: {},
};

function setup(payment: ConfirmedPayment | null = PAID) {
  const fake = createFakeFirestore();
  const gateway = {
    id: 'grow',
    createPaymentPage: vi.fn(),
    confirmPayment: vi.fn(async () => payment),
    acknowledge: vi.fn(async () => {}),
    updateRecurring: vi.fn(),
  } satisfies PaymentProvider;
  const clock = { now: NOW };
  const deps = { nowMs: () => clock.now, createAdmin: vi.fn(() => fake.admin) as never, createProvider: vi.fn(() => gateway) as never };
  fake.seed('checkouts', CHECKOUT_ID, {
    parentUid: 'parent1', childUids: ['kid1', 'kid2'], period: 'monthly', seatLimit: 2, amountAgorot: 6400,
    status: 'pending', provider: 'grow', processId: 'P-REAL', processToken: 'TOK-REAL', createdAt: NOW - 60000,
  });
  return { fake, gateway, deps, clock };
}

function processCallback(fields: Record<string, string>, key = 'hook-secret') {
  return new Request(`https://app.test/api/payment-webhook?source=process&key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
}

function accountWebhook(body: Record<string, unknown>) {
  return new Request('https://app.test/api/payment-webhook?source=account&key=hook-secret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const GROW_CALLBACK = {
  status: '1',
  'data[processId]': 'P-FORGED',
  'data[processToken]': 'TOK-FORGED',
  'data[sum]': '1',
  'data[customFields][cField1]': CHECKOUT_ID,
};

describe('handlePaymentWebhook: payment page notifications', () => {
  it('confirms with the checkout\'s own process ids and activates every seat', async () => {
    const { fake, gateway, deps } = setup();

    const response = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);

    expect(response.status).toBe(200);
    expect(gateway.confirmPayment).toHaveBeenCalledWith('monthly', { processId: 'P-REAL', processToken: 'TOK-REAL' });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({
      payerParentUid: 'parent1', childUids: ['kid1', 'kid2'], status: 'active', periodEnd: Date.UTC(2026, 10, 28, 12),
      amountAgorot: 6400, recurringRef: 'DD7',
    });
    for (const kid of ['kid1', 'kid2']) {
      expect(fake.get('entitlements', kid)).toMatchObject({ plan: 'pro', status: 'active', subscriptionId: CHECKOUT_ID, payerParentUid: 'parent1' });
    }
    expect(fake.get('payments', 'grow_T100')).toMatchObject({ kind: 'initial', amountAgorot: 6400 });
    expect(fake.get('recurringRefs', 'grow_DD7')).toEqual({ subscriptionId: CHECKOUT_ID });
    expect(fake.get('checkouts', CHECKOUT_ID)).toMatchObject({ status: 'paid', processToken: 'TOK-REAL' });
    expect(gateway.acknowledge).toHaveBeenCalledWith('monthly', PAID);
  });

  it('records a repeated notification once', async () => {
    const { fake, gateway, deps } = setup();
    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    const again = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    expect(await again.json()).toMatchObject({ ignored: 'already paid' });
    expect(fake.commits).toHaveLength(1);
    expect(gateway.acknowledge).toHaveBeenCalledTimes(1);
  });

  it('activates nothing when the gateway reports no payment or another amount', async () => {
    const unpaid = setup(null);
    expect(await (await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, unpaid.deps)).json()).toMatchObject({ ignored: 'not paid' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const short = setup({ ...PAID, amountAgorot: 100 });
    expect(await (await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, short.deps)).json()).toMatchObject({ ignored: 'amount mismatch' });
    errors.mockRestore();
    expect(unpaid.fake.get('entitlements', 'kid1')).toBeUndefined();
    expect(short.fake.get('entitlements', 'kid1')).toBeUndefined();
  });

  it('ignores an unknown checkout and refuses a wrong secret', async () => {
    const { gateway, deps } = setup();
    const unknown = await handlePaymentWebhook(processCallback({ ...GROW_CALLBACK, 'data[customFields][cField1]': 'd'.repeat(32) }), ENV, deps);
    expect(await unknown.json()).toMatchObject({ ignored: 'unknown checkout' });
    expect((await handlePaymentWebhook(processCallback(GROW_CALLBACK, 'guess'), ENV, deps)).status).toBe(401);
    expect(gateway.confirmPayment).not.toHaveBeenCalled();
  });

  it('keeps the payment when only the acknowledgement fails', async () => {
    const { fake, gateway, deps } = setup();
    gateway.acknowledge.mockRejectedValueOnce(new Error('down'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps)).status).toBe(200);
    errors.mockRestore();
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'active' });
  });
});

describe('handlePaymentWebhook: Grow account webhooks', () => {
  async function activated() {
    const context = setup();
    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, context.deps);
    // Grow charges the next month around periodEnd (Nov 28)
    context.clock.now = Date.UTC(2026, 10, 27, 12);
    return context;
  }

  it('extends the plan by a month on a renewal, once', async () => {
    const { fake, deps } = await activated();
    const renewal = { webhookKey: 'GROWKEY', transactionCode: 'R1', paymentSum: 64, directDebitId: 'DD7', paymentType: 'הוראת קבע' };

    expect((await handlePaymentWebhook(accountWebhook(renewal), ENV, deps)).status).toBe(200);
    const repeat = await handlePaymentWebhook(accountWebhook(renewal), ENV, deps);

    expect(await repeat.json()).toMatchObject({ ignored: 'already recorded' });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ periodEnd: Date.UTC(2026, 11, 28, 12), status: 'active' });
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ periodEnd: Date.UTC(2026, 11, 28, 12) });
    expect(fake.get('payments', 'grow_R1')).toMatchObject({ kind: 'renewal', amountAgorot: 6400 });
  });

  it('marks the plan past due when a charge fails, keeping its period', async () => {
    const { fake, deps } = await activated();
    await handlePaymentWebhook(accountWebhook({ webhook_key: 'GROWKEY', regular_payment_id: 'DD7', error_message: 'פג תוקף' }), ENV, deps);
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'past_due', periodEnd: Date.UTC(2026, 10, 28, 12) });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'past_due' });
  });

  it('ignores a webhook with the wrong Grow key or an unknown recurring charge', async () => {
    const { fake, deps } = await activated();
    const forged = { webhookKey: 'WRONG', transactionCode: 'R9', paymentSum: 64, directDebitId: 'DD7' };
    expect(await (await handlePaymentWebhook(accountWebhook(forged), ENV, deps)).json()).toMatchObject({ ignored: 'not a known event' });
    const stranger = { webhookKey: 'GROWKEY', transactionCode: 'R9', paymentSum: 64, directDebitId: 'DD999' };
    expect(await (await handlePaymentWebhook(accountWebhook(stranger), ENV, deps)).json()).toMatchObject({ ignored: 'unknown recurring charge' });
    expect(fake.get('payments', 'grow_R9')).toBeUndefined();
  });

  it('keeps a renewal on a canceled plan canceled, extending what was paid', async () => {
    const { fake, deps } = await activated();
    const sub = fake.get('subscriptions', CHECKOUT_ID)!;
    fake.seed('subscriptions', CHECKOUT_ID, { ...sub, status: 'canceled' });
    await handlePaymentWebhook(accountWebhook({ webhookKey: 'GROWKEY', transactionCode: 'R2', paymentSum: 64, directDebitId: 'DD7' }), ENV, deps);
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'canceled', periodEnd: NOW + 61 * DAY });
  });

  it('ignores a charge long before the plan is due, such as the first charge sent again', async () => {
    const { fake, deps, clock } = await activated();
    clock.now = NOW + DAY;
    const early = { webhookKey: 'GROWKEY', transactionCode: 'R3', paymentSum: 64, directDebitId: 'DD7' };
    expect(await (await handlePaymentWebhook(accountWebhook(early), ENV, deps)).json()).toMatchObject({ ignored: 'renewal not due' });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ periodEnd: Date.UTC(2026, 10, 28, 12) });
  });

  it('ignores gateway ids that are not plain', async () => {
    const { deps } = await activated();
    const odd = { webhookKey: 'GROWKEY', transactionCode: '../x', paymentSum: 64, directDebitId: 'DD7' };
    expect(await (await handlePaymentWebhook(accountWebhook(odd), ENV, deps)).json()).toMatchObject({ ignored: 'not a known event' });
  });
});

describe('handlePaymentWebhook: races', () => {
  it('never takes the seat of a child who got Pro on another plan meanwhile', async () => {
    const { fake, deps } = setup();
    fake.seed('entitlements', 'kid2', { status: 'active', periodEnd: NOW + 9 * DAY, subscriptionId: 'other' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);

    errors.mockRestore();
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ subscriptionId: 'other' });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ subscriptionId: CHECKOUT_ID });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ childUids: ['kid1'] });
    expect(fake.get('payments', 'grow_T100')).toMatchObject({ seatedElsewhere: ['kid2'] });
  });

  it('asks the gateway to retry when the activation is blocked but no payment was recorded', async () => {
    const { fake, deps } = setup();
    fake.seed('subscriptions', CHECKOUT_ID, { payerParentUid: 'someone' });
    const response = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    expect(response.status).toBe(503);
  });
});
