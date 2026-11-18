import { describe, expect, it, vi } from 'vitest';
import { createGrowMakeProvider, readGrowMakeConfig, type GrowMakeConfig } from './growMake';
import { PaymentError } from './provider';

const CONFIG: GrowMakeConfig = { webhookUrl: 'https://hook.eu2.make.com/abc123', apiKey: 'make-key', maxCharges: 36 };

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function makeWith(...responses: Response[]) {
  const fetchImpl = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
  for (const response of responses) fetchImpl.mockResolvedValueOnce(response);
  const provider = createGrowMakeProvider(CONFIG, fetchImpl as unknown as typeof fetch);
  const sent = (call: number) => JSON.parse(String(fetchImpl.mock.calls[call][1].body)) as Record<string, unknown>;
  const headers = (call: number) => fetchImpl.mock.calls[call][1].headers as Record<string, string>;
  return { provider, fetchImpl, sent, headers };
}

const PAGE_INPUT = {
  checkoutId: 'c'.repeat(32),
  amountAgorot: 6400,
  period: 'monthly' as const,
  description: 'EnglishVibe Pro monthly 2 children',
  payerName: 'ישראל ישראלי',
  payerPhone: '0501234567',
  payerEmail: 'parent@example.com',
  successUrl: 'https://app.example/?parent&paid=x',
  cancelUrl: 'https://app.example/?parent&paid=x&status=cancel',
  notifyUrl: 'https://app.example/api/payment-webhook?source=process&key=s&checkout=x',
};

const PAGE = { processId: '23481', processToken: 'link-token' };

/** Grow's payment-link notification, flattened (docs: "Regular Payment Webhook Format via PaymentLinks") */
const NOTICE = {
  statusCode: '2', transactionId: '33123456', transactionToken: 'tok', asmachta: '30012345', sum: '64',
  paymentLinkProcessId: '23481', paymentLinkProcessToken: 'link-token', fullName: 'ישראל ישראלי', payerPhone: '0501234567',
};

describe('readGrowMakeConfig', () => {
  it('needs an https Make webhook address and its API key', () => {
    expect(readGrowMakeConfig({})).toBeNull();
    expect(readGrowMakeConfig({ GROW_MAKE_WEBHOOK_URL: CONFIG.webhookUrl })).toBeNull();
    expect(readGrowMakeConfig({ GROW_MAKE_WEBHOOK_URL: 'http://hook.eu2.make.com/abc', GROW_MAKE_API_KEY: 'k' })).toBeNull();
    expect(readGrowMakeConfig({ GROW_MAKE_WEBHOOK_URL: 'https://evil.example/make.com', GROW_MAKE_API_KEY: 'k' })).toBeNull();
    expect(readGrowMakeConfig({ GROW_MAKE_WEBHOOK_URL: CONFIG.webhookUrl, GROW_MAKE_API_KEY: 'make-key' })).toEqual(CONFIG);
  });

  it('takes the standing order length from GROW_MAKE_MAX_CHARGES (3 to 36, default 36)', () => {
    const base = { GROW_MAKE_WEBHOOK_URL: CONFIG.webhookUrl, GROW_MAKE_API_KEY: 'make-key' };
    expect(readGrowMakeConfig(base)?.maxCharges).toBe(36);
    expect(readGrowMakeConfig({ ...base, GROW_MAKE_MAX_CHARGES: '12' })?.maxCharges).toBe(12);
    for (const bad of ['2', '37', '12.5', 'x']) expect(readGrowMakeConfig({ ...base, GROW_MAKE_MAX_CHARGES: bad })).toBeNull();
  });
});

describe('createGrowMakeProvider', () => {
  it('says how many charges a standing order makes before the owner extends it', () => {
    expect(createGrowMakeProvider(CONFIG).recurringChargeLimit).toBe(36);
  });

  it('cannot change or cancel a recurring charge (done by hand in Grow)', async () => {
    const { provider } = makeWith();
    expect(provider.id).toBe('grow');
    expect(provider.canChangeRecurring).toBe(false);
    await expect(provider.updateRecurring('{}', { cancel: true })).rejects.toBeInstanceOf(PaymentError);
  });

  it('opens a monthly standing-order link, card only, through the Make scenario', async () => {
    const { provider, fetchImpl, sent, headers } = makeWith(json({ url: 'https://sandbox.grow.link/x', processId: '23481', processToken: 'link-token' }));

    const page = await provider.createPaymentPage(PAGE_INPUT);

    expect(page).toEqual({ url: 'https://sandbox.grow.link/x', processId: '23481', processToken: 'link-token' });
    expect(fetchImpl.mock.calls[0][0]).toBe(CONFIG.webhookUrl);
    expect(headers(0)).toMatchObject({ 'x-make-apikey': 'make-key', 'Content-Type': 'application/json' });
    expect(sent(0)).toEqual({
      action: 'create',
      recurring: true,
      transactionTypes: [1],
      checkoutId: PAGE_INPUT.checkoutId,
      productName: PAGE_INPUT.description,
      price: 64,
      payerName: PAGE_INPUT.payerName,
      payerPhone: PAGE_INPUT.payerPhone,
      payerEmail: PAGE_INPUT.payerEmail,
      successUrl: PAGE_INPUT.successUrl,
      notifyUrl: PAGE_INPUT.notifyUrl,
      maxCharges: 36,
    });
  });

  it('offers card, Bit, Apple Pay and Google Pay on a yearly one-time link', async () => {
    const { provider, sent } = makeWith(json({ url: 'https://sandbox.grow.link/y', processId: '1', processToken: 't' }));
    await provider.createPaymentPage({ ...PAGE_INPUT, period: 'yearly', amountAgorot: 56900 });
    expect(sent(0)).toMatchObject({ recurring: false, transactionTypes: [6, 13, 14, 1], price: 569 });
  });

  it('refuses a price in agorot that Grow cannot take (whole shekels only)', async () => {
    const { provider, fetchImpl } = makeWith();
    await expect(provider.createPaymentPage({ ...PAGE_INPUT, amountAgorot: 6450 })).rejects.toBeInstanceOf(PaymentError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fails when the scenario answers an error or an incomplete link', async () => {
    await expect(makeWith(json({ error: 'x' }, 500)).provider.createPaymentPage(PAGE_INPUT)).rejects.toBeInstanceOf(PaymentError);
    await expect(makeWith(new Response('Accepted', { status: 200 })).provider.createPaymentPage(PAGE_INPUT)).rejects.toBeInstanceOf(PaymentError);
    await expect(makeWith(json({ url: 'https://x', processId: '' })).provider.createPaymentPage(PAGE_INPUT)).rejects.toBeInstanceOf(PaymentError);
    const unreachable = vi.fn(async () => {
      throw new TypeError('network');
    });
    await expect(createGrowMakeProvider(CONFIG, unreachable as never).createPaymentPage(PAGE_INPUT)).rejects.toBeInstanceOf(PaymentError);
  });

  it('confirms a paid notice only when it carries the link\'s own secret token', async () => {
    const { provider, fetchImpl } = makeWith();

    const payment = await provider.confirmPayment('yearly', PAGE, NOTICE);

    expect(payment).toMatchObject({ transactionId: '33123456', amountAgorot: 6400, recurringRef: null });
    expect(JSON.parse(payment!.billing)).toEqual({ transactionId: '33123456', transactionToken: 'tok', asmachta: '30012345' });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(await provider.confirmPayment('yearly', PAGE, { ...NOTICE, paymentLinkProcessToken: 'forged' })).toBeNull();
    expect(await provider.confirmPayment('yearly', PAGE, { ...NOTICE, paymentLinkProcessId: '999' })).toBeNull();
    expect(await provider.confirmPayment('yearly', PAGE)).toBeNull();
  });

  it('ignores a notice that is not a paid transaction', async () => {
    const { provider } = makeWith();
    expect(await provider.confirmPayment('yearly', PAGE, { ...NOTICE, statusCode: '0' })).toBeNull();
    expect(await provider.confirmPayment('yearly', PAGE, { ...NOTICE, transactionId: 'bad id!' })).toBeNull();
    expect(await provider.confirmPayment('yearly', PAGE, { ...NOTICE, transactionToken: '' })).toBeNull();
  });

  it('takes the standing order id from the notice, or asks the scenario for it', async () => {
    expect((await makeWith().provider.confirmPayment('monthly', PAGE, { ...NOTICE, directDebitId: 'DD77' }))?.recurringRef).toBe('DD77');

    const { provider, sent } = makeWith(json({ data: { transactions: [{ transactionId: '33123456', directDebitId: 'DD88' }] } }));
    expect((await provider.confirmPayment('monthly', PAGE, NOTICE))?.recurringRef).toBe('DD88');
    expect(sent(0)).toEqual({ action: 'info', processId: '23481', processToken: 'link-token' });
  });

  it('confirms a monthly payment without the standing order id when the scenario has none', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await makeWith(json({ data: {} })).provider.confirmPayment('monthly', PAGE, NOTICE))?.recurringRef).toBeNull();
    expect((await makeWith(json({}, 500)).provider.confirmPayment('monthly', PAGE, NOTICE))?.recurringRef).toBeNull();
    logged.mockRestore();
  });

  it('approves the transaction through the scenario with Grow\'s own fields', async () => {
    const { provider, sent } = makeWith(json({ ok: true }));
    const payment = await makeWith().provider.confirmPayment('yearly', PAGE, NOTICE);
    await provider.acknowledge('yearly', payment!);
    expect(sent(0)).toMatchObject({ action: 'approve', transactionId: '33123456', transactionToken: 'tok', asmachta: '30012345' });
  });

  it('sends Approve only the fields it takes, not the card or business details', async () => {
    const { provider, sent } = makeWith(json({ ok: true }));
    const notice = { ...NOTICE, cardSuffix: '4580', cardExp: '1132', invoice_license_number: '000000000' };
    const payment = await makeWith().provider.confirmPayment('yearly', PAGE, notice);
    await provider.acknowledge('yearly', payment!);
    expect(Object.keys(sent(0) as object).sort()).toEqual(['action', 'asmachta', 'fullName', 'payerPhone', 'transactionId', 'transactionToken']);
  });
});
