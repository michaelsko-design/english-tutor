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

function setup(payment: ConfirmedPayment | null = PAID, canChangeRecurring = true, recurringChargeLimit?: number) {
  const fake = createFakeFirestore();
  const gateway = {
    id: 'grow',
    canChangeRecurring,
    recurringChargeLimit,
    createPaymentPage: vi.fn(),
    confirmPayment: vi.fn(async () => payment),
    acknowledge: vi.fn(async () => {}),
    updateRecurring: vi.fn(async (): Promise<void> => {}),
  } satisfies PaymentProvider;
  const clock = { now: NOW };
  const deps = { nowMs: () => clock.now, createAdmin: vi.fn(() => fake.admin) as never, createProvider: vi.fn(() => gateway) as never };
  fake.seed('checkouts', CHECKOUT_ID, {
    parentUid: 'parent1', childUids: ['kid1', 'kid2'], period: 'monthly', seatLimit: 2, amountAgorot: 6400,
    status: 'pending', provider: 'grow', processId: 'P-REAL', processToken: 'TOK-REAL', createdAt: NOW - 60000,
    payerName: 'ישראל ישראלי', payerPhone: '0501234567', payerEmail: 'parent@example.com',
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
    expect(gateway.confirmPayment).toHaveBeenCalledWith('monthly', { processId: 'P-REAL', processToken: 'TOK-REAL' }, expect.objectContaining({ processId: 'P-FORGED' }));
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
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    const again =await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    expect(await again.json()).toMatchObject({ ignored: 'already paid' });
    expect(logged).toHaveBeenCalledWith(expect.stringContaining('duplicate payment'));
    logged.mockRestore();
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

  it('never confirms a checkout opened on another gateway', async () => {
    const { fake, gateway, deps } = setup();
    fake.seed('checkouts', CHECKOUT_ID, { ...fake.get('checkouts', CHECKOUT_ID)!, provider: 'mock' });
    const response = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    expect(await response.json()).toMatchObject({ ignored: 'other gateway' });
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
    expect(fake.get('gatewayTasks', `${CHECKOUT_ID}_extend_1`)).toBeUndefined();
  });

  it('refuses a renewal charged for less than the plan, and logs it', async () => {
    const { fake, deps } = await activated();
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const short = { webhookKey: 'GROWKEY', transactionCode: 'R2', paymentSum: 10, directDebitId: 'DD7', paymentType: 'הוראת קבע' };

    const response = await handlePaymentWebhook(accountWebhook(short), ENV, deps);

    expect(response.status).toBe(503);
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ periodEnd: Date.UTC(2026, 10, 28, 12) });
    expect(fake.get('payments', 'grow_R2')).toBeUndefined();
    expect(logged).toHaveBeenCalledWith(expect.stringContaining('renewal amount is below the plan'));
    logged.mockRestore();
  });

  it('marks the plan past due when a charge fails, keeping its period', async () => {
    const { fake, deps } = await activated();
    await handlePaymentWebhook(accountWebhook({ webhook_key: 'GROWKEY', regular_payment_id: 'DD7', error_message: 'פג תוקף' }), ENV, deps);
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'past_due', periodEnd: Date.UTC(2026, 10, 28, 12) });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'past_due' });
  });

  it("keeps an unmatched failure's task done when Grow's retries report it again", async () => {
    const { fake, deps } = await activated();
    const failed = accountWebhook({ webhook_key: 'GROWKEY', regular_payment_id: 'DD999', sum: '64', charges_attempts: '1' });
    await handlePaymentWebhook(failed, ENV, deps);
    const taskId = 'unmatched_failed_DD999';
    fake.seed('gatewayTasks', taskId, { ...fake.get('gatewayTasks', taskId), doneAt: Date.UTC(2026, 10, 29) });
    const commits = fake.commits.length;

    const retry = accountWebhook({ webhook_key: 'GROWKEY', regular_payment_id: 'DD999', sum: '64', charges_attempts: '2' });
    expect((await handlePaymentWebhook(retry, ENV, deps)).status).toBe(200);

    expect(fake.get('gatewayTasks', taskId)).toMatchObject({ doneAt: Date.UTC(2026, 10, 29) });
    expect(fake.commits).toHaveLength(commits);
  });

  it('ignores a webhook with the wrong Grow key or an unknown recurring charge', async () => {
    const { fake, deps } = await activated();
    const forged = { webhookKey: 'WRONG', transactionCode: 'R9', paymentSum: 64, directDebitId: 'DD7' };
    expect(await (await handlePaymentWebhook(accountWebhook(forged), ENV, deps)).json()).toMatchObject({ ignored: 'not a known event' });
    const stranger = { webhookKey: 'GROWKEY', transactionCode: 'R9', paymentSum: 64, directDebitId: 'DD999' };
    expect(await (await handlePaymentWebhook(accountWebhook(stranger), ENV, deps)).json()).toMatchObject({ ignored: 'unknown recurring charge' });
    expect(fake.get('payments', 'grow_R9')).toBeUndefined();
    expect(fake.get('gatewayTasks', 'unmatched_renewal_R9')).toMatchObject({ kind: 'match_renewal', amountAgorot: 6400 });
  });

  it('keeps a renewal on a canceled plan canceled, extending what was paid, and asks the owner to refund it', async () => {
    const { fake, deps } = await activated();
    const sub = fake.get('subscriptions', CHECKOUT_ID)!;
    fake.seed('subscriptions', CHECKOUT_ID, { ...sub, status: 'canceled' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handlePaymentWebhook(accountWebhook({ webhookKey: 'GROWKEY', transactionCode: 'R2', paymentSum: 64, directDebitId: 'DD7' }), ENV, deps);
    errors.mockRestore();
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'canceled', periodEnd: NOW + 61 * DAY });
    expect(fake.get('gatewayTasks', 'refund_grow_R2')).toMatchObject({
      kind: 'refund', subscriptionId: CHECKOUT_ID, amountAgorot: 6400, payerPhone: '0501234567', doneAt: 0,
    });
  });

  it('brings back an expired plan on a late charge, but not over a seat on a newer plan', async () => {
    const { fake, deps, clock } = await activated();
    clock.now = Date.UTC(2026, 11, 3, 12);
    const sub = fake.get('subscriptions', CHECKOUT_ID)!;
    fake.seed('subscriptions', CHECKOUT_ID, { ...sub, status: 'expired' });
    fake.seed('entitlements', 'kid2', { status: 'active', periodEnd: clock.now + 300 * DAY, subscriptionId: 'newer' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await handlePaymentWebhook(accountWebhook({ webhookKey: 'GROWKEY', transactionCode: 'R4', paymentSum: 64, directDebitId: 'DD7' }), ENV, deps);

    errors.mockRestore();
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'active', childUids: ['kid1'], periodEnd: Date.UTC(2027, 0, 3, 12) });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'active', subscriptionId: CHECKOUT_ID });
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ subscriptionId: 'newer' });
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

describe('handlePaymentWebhook: Grow through Make', () => {
  const PAID_NO_REF: ConfirmedPayment = { ...PAID, recurringRef: null };

  /** Grow's payment-link notice: JSON, the checkout id in our notify address */
  function linkNotice(checkoutId = CHECKOUT_ID) {
    return new Request(`https://app.test/api/payment-webhook?source=process&key=hook-secret&checkout=${checkoutId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ err: '', status: '1', data: { statusCode: '2', transactionId: 'T100', paymentLinkProcessToken: 'TOK-REAL' } }),
    });
  }

  /** The shape of a real sandbox notice (2026-11-16): form-encoded, personal details replaced */
  function formLinkNotice(productSums: string[]) {
    const fields: Record<string, string> = {
      err: '', status: '1',
      'data[status]': 'שולם', 'data[statusCode]': '2', 'data[sum]': '64', 'data[paymentsNum]': '0', 'data[allPaymentsNum]': '1',
      'data[fullName]': 'ישראל ישראלי', 'data[payerPhone]': '0501234567', 'data[payerEmail]': '',
      'data[transactionId]': '570910', 'data[transactionToken]': 'TT1', 'data[directDebitId]': '252509',
      'data[paymentLinkProcessId]': 'P-REAL', 'data[paymentLinkProcessToken]': 'TOK-REAL', 'data[recurringDebitId]': '10089',
      'data[asmachta]': '133707572', 'data[processId]': '817814', 'data[processToken]': 'PT1', 'data[customFields][cField1]': CHECKOUT_ID,
    };
    productSums.forEach((sum, index) => {
      fields[`data[productData][${index}][sum]`] = sum;
      fields[`data[productData][${index}][price]`] = sum;
    });
    // As checkout.ts builds it: the checkout id comes only from cField1
    return new Request('https://app.test/api/payment-webhook?source=process&key=hook-secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields).toString(),
    });
  }

  it('reads a form-encoded notice, keeping the total over a product line with the same name', async () => {
    const { gateway, deps } = setup(PAID_NO_REF, false);

    expect((await handlePaymentWebhook(formLinkNotice(['39.00', '25.00']), ENV, deps)).status).toBe(200);

    expect(gateway.confirmPayment).toHaveBeenCalledWith(
      'monthly',
      { processId: 'P-REAL', processToken: 'TOK-REAL' },
      expect.objectContaining({ sum: '64', statusCode: '2', directDebitId: '252509', transactionId: '570910', processId: '817814' })
    );
  });

  async function activatedWithoutRef() {
    const context = setup(PAID_NO_REF, false);
    await handlePaymentWebhook(linkNotice(), ENV, context.deps);
    context.clock.now = Date.UTC(2026, 10, 27, 12);
    return context;
  }

  it('takes the checkout from the notify address and hands the notice to the gateway to check', async () => {
    const { fake, gateway, deps } = setup(PAID_NO_REF, false);

    expect((await handlePaymentWebhook(linkNotice(), ENV, deps)).status).toBe(200);

    expect(gateway.confirmPayment).toHaveBeenCalledWith(
      'monthly',
      { processId: 'P-REAL', processToken: 'TOK-REAL' },
      expect.objectContaining({ paymentLinkProcessToken: 'TOK-REAL', statusCode: '2' })
    );
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'active', recurringRef: null });
  });

  it('links the plan to its standing order on the first renewal, by payer and amount', async () => {
    const { fake, deps } = await activatedWithoutRef();
    const renewal = { transactionCode: 'R1', paymentSum: 64, directDebitId: 'DD55', payerPhone: '+972-50-123-4567', payerEmail: 'Parent@example.com' };

    expect((await handlePaymentWebhook(accountWebhook(renewal), { ...ENV, GROW_WEBHOOK_KEY: '' }, deps)).status).toBe(200);

    expect(fake.get('recurringRefs', 'grow_DD55')).toEqual({ subscriptionId: CHECKOUT_ID });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ recurringRef: 'DD55', periodEnd: Date.UTC(2026, 11, 28, 12) });
    expect(fake.get('payments', 'grow_R1')).toMatchObject({ kind: 'renewal' });
  });

  it('leaves the owner a task when the renewal fits no plan or another email', async () => {
    const { fake, deps } = await activatedWithoutRef();
    const otherAmount = { transactionCode: 'R1', paymentSum: 39, directDebitId: 'DD55', payerPhone: '0501234567' };
    const otherEmail = { transactionCode: 'R2', paymentSum: 64, directDebitId: 'DD56', payerPhone: '0501234567', payerEmail: 'x@y.z' };

    await handlePaymentWebhook(accountWebhook(otherAmount), { ...ENV, GROW_WEBHOOK_KEY: '' }, deps);
    await handlePaymentWebhook(accountWebhook(otherEmail), { ...ENV, GROW_WEBHOOK_KEY: '' }, deps);

    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ recurringRef: null, periodEnd: Date.UTC(2026, 10, 28, 12) });
    expect(fake.get('gatewayTasks', 'unmatched_renewal_R1')).toMatchObject({ kind: 'match_renewal', payerPhone: '0501234567', amountAgorot: 3900 });
    expect(fake.get('gatewayTasks', 'unmatched_renewal_R2')).toMatchObject({ kind: 'match_renewal' });
  });

  it('marks a plan past due on its first failed charge, linking it by phone', async () => {
    const { fake, deps } = await activatedWithoutRef();
    const failed = { regular_payment_id: 'DD55', error_message: 'סירוב', sum: '64', phone: '0501234567', email: 'parent@example.com' };

    await handlePaymentWebhook(accountWebhook(failed), { ...ENV, GROW_WEBHOOK_KEY: '' }, deps);

    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ status: 'past_due', recurringRef: 'DD55' });
  });

  it('asks the owner to extend a standing order one charge before it ends, once per round', async () => {
    // Activation is charge 1; with 3 charges per standing order, charge 2 leaves one
    const { fake, deps, clock } = setup(PAID, false, 3);
    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    const renewal = (code: string) => accountWebhook({ webhookKey: 'GROWKEY', transactionCode: code, paymentSum: 64, directDebitId: 'DD7' });

    clock.now = Date.UTC(2026, 10, 27, 12);
    await handlePaymentWebhook(renewal('R1'), ENV, deps);

    expect(fake.get('gatewayTasks', `${CHECKOUT_ID}_extend_1`)).toMatchObject({
      kind: 'extend', subscriptionId: CHECKOUT_ID, dueAt: Date.UTC(2026, 11, 28, 12), payerPhone: '0501234567', doneAt: 0,
    });

    fake.seed('gatewayTasks', `${CHECKOUT_ID}_extend_1`, { ...fake.get('gatewayTasks', `${CHECKOUT_ID}_extend_1`), doneAt: clock.now });
    clock.now = Date.UTC(2026, 11, 27, 12);
    await handlePaymentWebhook(renewal('R2'), ENV, deps);

    expect(fake.get('gatewayTasks', `${CHECKOUT_ID}_extend_1`)).toMatchObject({ doneAt: Date.UTC(2026, 10, 27, 12) });
    expect(fake.get('gatewayTasks', `${CHECKOUT_ID}_extend_2`)).toBeUndefined();
  });

  it('asks the owner to refund children seated elsewhere and to lower the standing order by hand', async () => {
    const { fake, gateway, deps } = setup(PAID_NO_REF, false);
    fake.seed('entitlements', 'kid2', { status: 'active', periodEnd: NOW + 9 * DAY, subscriptionId: 'other' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await handlePaymentWebhook(linkNotice(), ENV, deps);

    errors.mockRestore();
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
    expect(fake.get('gatewayTasks', 'refund_grow_T100')).toMatchObject({ kind: 'refund', subscriptionId: CHECKOUT_ID });
    expect(fake.get('gatewayTasks', `${CHECKOUT_ID}_amount`)).toMatchObject({ kind: 'amount', amountAgorot: 3900 });
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
    expect(fake.get('payments', 'grow_T100')).toMatchObject({ seatedElsewhere: ['kid2'], amountAgorot: 6400 });
  });

  it('bills a monthly plan only for the children it seated, and stops it when none is', async () => {
    const oneLeft = setup();
    oneLeft.fake.seed('entitlements', 'kid2', { status: 'active', periodEnd: NOW + 9 * DAY, subscriptionId: 'other' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, oneLeft.deps);

    expect(oneLeft.fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ seatLimit: 1, amountAgorot: 3900, status: 'active' });
    expect(oneLeft.fake.get('entitlements', 'kid1')).toMatchObject({ seatLimit: 1 });
    expect(oneLeft.gateway.updateRecurring).toHaveBeenCalledWith(PAID.billing, { amountAgorot: 3900 });

    const noneLeft = setup();
    for (const kid of ['kid1', 'kid2']) {
      noneLeft.fake.seed('entitlements', kid, { status: 'active', periodEnd: NOW + 9 * DAY, subscriptionId: 'other' });
    }
    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, noneLeft.deps);

    errors.mockRestore();
    expect(noneLeft.fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ childUids: [], status: 'canceled' });
    expect(noneLeft.gateway.updateRecurring).toHaveBeenCalledWith(PAID.billing, { cancel: true });
    expect(noneLeft.fake.get('entitlements', 'kid1')).toMatchObject({ subscriptionId: 'other' });
  });

  it('keeps the plan recorded when the gateway refuses to lower the charge', async () => {
    const { fake, gateway, deps } = setup();
    fake.seed('entitlements', 'kid2', { status: 'active', periodEnd: NOW + 9 * DAY, subscriptionId: 'other' });
    gateway.updateRecurring = vi.fn(async () => { throw new Error('down'); });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);

    expect(errors).toHaveBeenCalledWith('payment-webhook: recurring charge not reduced, fix it by hand (unexpected)');
    errors.mockRestore();
    expect(response.status).toBe(200);
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ amountAgorot: 3900 });
  });

  it("renews the parent's yearly plan from its end, and takes the children off the old plan", async () => {
    const { fake, deps } = setup();
    fake.seed('checkouts', CHECKOUT_ID, {
      parentUid: 'parent1', childUids: ['kid1', 'kid2'], period: 'yearly', seatLimit: 2, amountAgorot: 6400,
      status: 'pending', provider: 'grow', processId: 'P-REAL', processToken: 'TOK-REAL', createdAt: NOW - 60000,
    });
    fake.seed('subscriptions', 'old', {
      payerParentUid: 'parent1', childUids: ['kid1', 'kid2', 'kid3'], seatLimit: 3, period: 'yearly', status: 'active',
      periodEnd: NOW + 10 * DAY, amountAgorot: 79900, provider: 'grow', recurringRef: null, billing: '', lastRemovalAt: 0, lastSwapAt: 0, createdAt: 0,
    });
    const oldEnd = NOW + 10 * DAY;
    for (const kid of ['kid1', 'kid2']) {
      fake.seed('entitlements', kid, { status: 'active', billingPeriod: 'yearly', payerParentUid: 'parent1', periodEnd: oldEnd, subscriptionId: 'old' });
    }

    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);

    expect(fake.get('payments', 'grow_T100')).toMatchObject({ seatedElsewhere: [] });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ childUids: ['kid1', 'kid2'], periodEnd: Date.UTC(2027, 10, 7, 12) });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ subscriptionId: CHECKOUT_ID, seatLimit: 2 });
    expect(fake.get('subscriptions', 'old')).toMatchObject({ childUids: ['kid3'] });
  });

  it('never lets a monthly payment renew a yearly plan', async () => {
    const { fake, deps } = setup();
    fake.seed('entitlements', 'kid1', { status: 'active', billingPeriod: 'yearly', payerParentUid: 'parent1', periodEnd: NOW + 10 * DAY, subscriptionId: 'old' });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);

    errors.mockRestore();
    expect(fake.get('payments', 'grow_T100')).toMatchObject({ seatedElsewhere: ['kid1'] });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ subscriptionId: 'old' });
  });

  it('never seats a child on two plans paid at the same moment: the later one retries and finds the seat taken', async () => {
    const { fake, deps } = setup();
    const commit = fake.admin.commit;
    let isRaced = false;
    // Another plan's payment takes kid1 between this notification's read and its write
    fake.admin.commit = async (writes) => {
      if (!isRaced) {
        isRaced = true;
        fake.seed('entitlements', 'kid1', { status: 'active', periodEnd: NOW + 30 * DAY, subscriptionId: 'other' });
      }
      return commit(writes);
    };
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    const first = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    const retry = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);

    errors.mockRestore();
    expect(first.status).toBe(503);
    expect(retry.status).toBe(200);
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ subscriptionId: 'other' });
    expect(fake.get('subscriptions', CHECKOUT_ID)).toMatchObject({ childUids: ['kid2'] });
    expect(fake.get('payments', 'grow_T100')).toMatchObject({ seatedElsewhere: ['kid1'] });
  });

  it('asks the gateway to retry when the activation is blocked but no payment was recorded', async () => {
    const { fake, deps } = setup();
    fake.seed('subscriptions', CHECKOUT_ID, { payerParentUid: 'someone' });
    const response = await handlePaymentWebhook(processCallback(GROW_CALLBACK), ENV, deps);
    expect(response.status).toBe(503);
  });
});
