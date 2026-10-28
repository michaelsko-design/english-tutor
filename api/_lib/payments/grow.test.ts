import { describe, expect, it, vi } from 'vitest';
import { createGrowProvider, GROW_BASE_URLS, parseGrowAccountWebhook, readGrowConfig, type GrowConfig } from './grow';
import { PaymentError } from './provider';

const CONFIG: GrowConfig = {
  baseUrl: GROW_BASE_URLS.sandbox,
  userId: 'user1',
  apiKey: '',
  recurringPageCode: 'rec-page',
  regularPageCode: 'reg-page',
};

const ok = (data: unknown) => new Response(JSON.stringify({ status: 1, err: '', data }), { status: 200 });

function growWith(...responses: Response[]) {
  const fetchImpl = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
  for (const response of responses) fetchImpl.mockResolvedValueOnce(response);
  const provider = createGrowProvider(CONFIG, fetchImpl as unknown as typeof fetch);
  const form = (call: number) => Object.fromEntries((fetchImpl.mock.calls[call][1].body as FormData).entries());
  const url = (call: number) => fetchImpl.mock.calls[call][0];
  return { provider, fetchImpl, form, url };
}

const PAGE_INPUT = {
  checkoutId: 'c'.repeat(32),
  amountAgorot: 6400,
  period: 'monthly' as const,
  description: 'EnglishVibe Pro monthly 2 children',
  payerName: 'ישראל ישראלי',
  payerPhone: '0501234567',
  payerEmail: '',
  successUrl: 'https://app.example/?parent&paid=x',
  cancelUrl: 'https://app.example/?parent&paid=x&status=cancel',
  notifyUrl: 'https://app.example/api/payment-webhook?source=process&key=s',
};

const PAID_TRANSACTION = {
  statusCode: '2', status: 'שולם', transactionId: '33123456', transactionToken: 'tok', asmachta: '30012345',
  sum: '64', paymentType: '1', transactionTypeId: '1', cardSuffix: '1234',
};

describe('readGrowConfig', () => {
  it('needs the user id and both page codes, and defaults to the sandbox', () => {
    expect(readGrowConfig({ GROW_USER_ID: 'u' })).toBeNull();
    expect(readGrowConfig({ GROW_USER_ID: 'u', GROW_RECURRING_PAGE_CODE: 'r', GROW_REGULAR_PAGE_CODE: 'g' })).toMatchObject({
      baseUrl: GROW_BASE_URLS.sandbox,
    });
    expect(
      readGrowConfig({ GROW_USER_ID: 'u', GROW_RECURRING_PAGE_CODE: 'r', GROW_REGULAR_PAGE_CODE: 'g', GROW_ENV: 'production' })?.baseUrl
    ).toBe(GROW_BASE_URLS.production);
  });
});

describe('createGrowProvider', () => {
  it('opens a monthly plan on the recurring page with the sum in shekels and the checkout in cField1', async () => {
    const { provider, form, url } = growWith(ok({ url: 'https://pay.example/x', processId: 123, processToken: 'ptok' }));

    const page = await provider.createPaymentPage(PAGE_INPUT);

    expect(page).toEqual({ url: 'https://pay.example/x', processId: '123', processToken: 'ptok' });
    expect(url(0)).toBe(`${GROW_BASE_URLS.sandbox}createPaymentProcess`);
    expect(form(0)).toMatchObject({
      pageCode: 'rec-page', userId: 'user1', sum: '64.00', cField1: 'c'.repeat(32),
      'pageField[fullName]': 'ישראל ישראלי', 'pageField[phone]': '0501234567', notifyUrl: PAGE_INPUT.notifyUrl,
    });
    expect(form(0)).not.toHaveProperty('pageField[email]');
    expect(form(0)).not.toHaveProperty('apiKey');
  });

  it('opens a yearly plan on the regular page', async () => {
    const { provider, form } = growWith(ok({ url: 'u', processId: '1', processToken: 't' }));
    await provider.createPaymentPage({ ...PAGE_INPUT, period: 'yearly', amountAgorot: 56900 });
    expect(form(0)).toMatchObject({ pageCode: 'reg-page', sum: '569.00' });
  });

  it('turns a refusal into a PaymentError with Grow\'s error id', async () => {
    const refused = new Response(JSON.stringify({ status: 0, err: { id: 54, message: 'missing' }, data: '' }));
    const { provider } = growWith(refused);
    await expect(provider.createPaymentPage(PAGE_INPUT)).rejects.toMatchObject({ code: '54' });
    await expect(growWith(new Response('', { status: 500 })).provider.createPaymentPage(PAGE_INPUT)).rejects.toBeInstanceOf(PaymentError);
  });

  it('confirms a monthly payment from Grow itself and reads the recurring charge id', async () => {
    const { provider, form, url } = growWith(
      ok({ processId: '123', transactions: [{ statusCode: '1', transactionId: '1' }, PAID_TRANSACTION] }),
      ok({ ...PAID_TRANSACTION, directDebitId: '19123456' })
    );

    const payment = await provider.confirmPayment('monthly', { processId: '123', processToken: 'ptok' });

    expect(url(0)).toContain('getPaymentProcessInfo');
    expect(form(0)).toEqual({ pageCode: 'rec-page', processId: '123', processToken: 'ptok' });
    expect(url(1)).toContain('getTransactionInfo');
    expect(payment).toMatchObject({ transactionId: '33123456', amountAgorot: 6400, recurringRef: '19123456' });
    expect(JSON.parse(payment!.billing)).toEqual({ transactionId: '33123456', transactionToken: 'tok', asmachta: '30012345' });
  });

  it('confirms a yearly payment without a recurring charge, and nothing while unpaid', async () => {
    const yearly = growWith(ok({ transactions: [{ ...PAID_TRANSACTION, sum: '569' }] }));
    expect(await yearly.provider.confirmPayment('yearly', { processId: '1', processToken: 't' })).toMatchObject({
      amountAgorot: 56900, recurringRef: null,
    });
    expect(yearly.fetchImpl).toHaveBeenCalledTimes(1);
    const unpaid = growWith(ok({ transactions: [{ statusCode: '1', transactionId: '9', transactionToken: 'x' }] }));
    expect(await unpaid.provider.confirmPayment('monthly', { processId: '1', processToken: 't' })).toBeNull();
  });

  it('approves with the fields Grow returned', async () => {
    const { provider, form } = growWith(ok(''));
    await provider.acknowledge('monthly', {
      transactionId: '33123456', amountAgorot: 6400, recurringRef: 'dd', billing: '{}',
      details: { ...PAID_TRANSACTION, processId: '123', processToken: 'ptok' },
    });
    expect(form(0)).toMatchObject({ pageCode: 'rec-page', transactionId: '33123456', transactionToken: 'tok', sum: '64', processToken: 'ptok' });
  });

  it('cancels and re-prices a recurring charge through updateDirectDebit', async () => {
    const billing = JSON.stringify({ transactionId: '1', transactionToken: 't', asmachta: 'a' });
    const { provider, form, url } = growWith(ok(''), ok(''));

    await provider.updateRecurring(billing, { cancel: true });
    await provider.updateRecurring(billing, { amountAgorot: 8900 });

    expect(url(0)).toContain('updateDirectDebit');
    expect(form(0)).toEqual({ userId: 'user1', transactionId: '1', transactionToken: 't', asmachta: 'a', changeStatus: '2' });
    expect(form(1)).toMatchObject({ sum: '89.00' });
    expect(form(1)).not.toHaveProperty('changeStatus');
    await expect(provider.updateRecurring('{}', { cancel: true })).rejects.toBeInstanceOf(PaymentError);
  });
});

describe('parseGrowAccountWebhook', () => {
  it('reads a monthly renewal and a failed charge', () => {
    expect(
      parseGrowAccountWebhook({ webhookKey: 'KEY', transactionCode: 'T1', paymentSum: 64, directDebitId: '55', paymentType: 'הוראת קבע' }, 'KEY')
    ).toEqual({ kind: 'renewal', recurringRef: '55', paymentId: 'T1', amountAgorot: 6400 });
    expect(parseGrowAccountWebhook({ webhook_key: 'KEY', regular_payment_id: '55', error_message: 'פג תוקף' }, 'KEY')).toEqual({
      kind: 'failed', recurringRef: '55', message: 'פג תוקף',
    });
  });

  it('refuses a wrong key, a missing configured key and unknown events', () => {
    expect(parseGrowAccountWebhook({ webhookKey: 'NOPE', transactionCode: 'T1', paymentSum: 64, directDebitId: '55' }, 'KEY')).toBeNull();
    expect(parseGrowAccountWebhook({ webhookKey: '', regular_payment_id: '55' }, '')).toBeNull();
    expect(parseGrowAccountWebhook({ webhookKey: 'KEY', transactionCode: 'T1', paymentSum: 5 }, 'KEY')).toBeNull();
  });
});
