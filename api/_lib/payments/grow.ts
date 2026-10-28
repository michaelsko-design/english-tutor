/**
 * Grow (Meshulam) Light API adapter (https://developers.grow.business/reference).
 * - Monthly plans: a recurring payment ("הוראת קבע", Grow Billing) on the recurring pageCode. Grow
 *   charges it every month; charges after the first arrive as account webhooks (`parseGrowAccountWebhook`).
 * - Yearly plans: one regular payment on the regular pageCode (Grow Billing only charges monthly),
 *   so a yearly plan does not renew by itself.
 * Every call is a server-side FormData POST answering `{status: 1|0, err, data}`.
 */
import type { BillingPeriod } from '../../../src/config/proTier.js';
import {
  agorotToSum,
  GATEWAY_ID_PATTERN,
  PaymentError,
  safeEqual,
  sumToAgorot,
  type ConfirmedPayment,
  type PaymentPage,
  type PaymentPageInput,
  type PaymentProvider,
  type RecurringChange,
} from './provider.js';

export const GROW_BASE_URLS = {
  sandbox: 'https://sandbox.meshulam.co.il/api/light/server/1.0/',
  production: 'https://secure.meshulam.co.il/api/light/server/1.0/',
} as const;

/** Grow's status code for a paid transaction ("שולם") */
const PAID_STATUS_CODE = '2';
const REGULAR_CHARGE = '1';
const CANCEL_RECURRING = '2';

/** The fields approveTransaction needs, all copied from Grow's own transaction record */
const APPROVE_FIELDS = [
  'transactionId', 'transactionToken', 'transactionTypeId', 'paymentType', 'sum', 'firstPaymentSum',
  'periodicalPaymentSum', 'paymentsNum', 'allPaymentsNum', 'paymentDate', 'asmachta', 'description',
  'fullName', 'payerPhone', 'payerEmail', 'cardSuffix', 'cardType', 'cardTypeCode', 'cardBrand',
  'cardBrandCode', 'cardExp', 'processId', 'processToken',
] as const;

export interface GrowConfig {
  baseUrl: string;
  userId: string;
  /** Only for platforms that bill on behalf of other businesses */
  apiKey: string;
  recurringPageCode: string;
  regularPageCode: string;
}

/** Grow settings from the environment, or null when any required one is missing. */
export function readGrowConfig(env: Record<string, string | undefined>): GrowConfig | null {
  const userId = env.GROW_USER_ID ?? '';
  const recurringPageCode = env.GROW_RECURRING_PAGE_CODE ?? '';
  const regularPageCode = env.GROW_REGULAR_PAGE_CODE ?? '';
  if (!userId || !recurringPageCode || !regularPageCode) return null;
  const baseUrl = env.GROW_ENV === 'production' ? GROW_BASE_URLS.production : GROW_BASE_URLS.sandbox;
  return { baseUrl, userId, apiKey: env.GROW_API_KEY ?? '', recurringPageCode, regularPageCode };
}

type GrowData = Record<string, unknown>;

/** Every value as a string (Grow mixes numbers and strings for the same field) */
function toStrings(record: GrowData): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
      .map(([key, value]) => [key, String(value).trim()])
  );
}

interface GrowBilling {
  transactionId: string;
  transactionToken: string;
  asmachta: string;
}

function parseBilling(billing: string): GrowBilling {
  try {
    const parsed = JSON.parse(billing) as Partial<GrowBilling>;
    if (parsed.transactionId && parsed.transactionToken && parsed.asmachta) {
      return { transactionId: parsed.transactionId, transactionToken: parsed.transactionToken, asmachta: parsed.asmachta };
    }
  } catch {
    // fall through to the error below
  }
  throw new PaymentError('Grow billing reference is missing');
}

export function createGrowProvider(config: GrowConfig, fetchImpl: typeof fetch = fetch): PaymentProvider {
  const pageCodeFor = (period: BillingPeriod) => (period === 'monthly' ? config.recurringPageCode : config.regularPageCode);

  async function call(method: string, params: Record<string, string>): Promise<GrowData> {
    const form = new FormData();
    for (const [key, value] of Object.entries(params)) if (value !== '') form.append(key, value);
    let response: Response;
    try {
      response = await fetchImpl(`${config.baseUrl}${method}`, { method: 'POST', body: form });
    } catch {
      throw new PaymentError(`Grow ${method} unreachable`);
    }
    if (!response.ok) throw new PaymentError(`Grow ${method} failed`, String(response.status));
    const body = (await response.json().catch(() => null)) as { status?: unknown; err?: { id?: unknown }; data?: unknown } | null;
    if (!body || Number(body.status) !== 1) {
      throw new PaymentError(`Grow ${method} refused`, String(body?.err?.id ?? ''));
    }
    return body.data && typeof body.data === 'object' ? (body.data as GrowData) : {};
  }

  /** The recurring charge id lives on the transaction record, not on the payment page record */
  async function readRecurringRef(period: BillingPeriod, transaction: Record<string, string>): Promise<string | null> {
    if (period !== 'monthly') return null;
    if (GATEWAY_ID_PATTERN.test(transaction.directDebitId ?? '')) return transaction.directDebitId;
    const info = toStrings(
      await call('getTransactionInfo', {
        pageCode: pageCodeFor(period),
        transactionId: transaction.transactionId,
        transactionToken: transaction.transactionToken,
      })
    );
    return GATEWAY_ID_PATTERN.test(info.directDebitId ?? '') ? info.directDebitId : null;
  }

  return {
    id: 'grow',

    async createPaymentPage(input: PaymentPageInput): Promise<PaymentPage> {
      const data = await call('createPaymentProcess', {
        pageCode: pageCodeFor(input.period),
        userId: config.userId,
        apiKey: config.apiKey,
        chargeType: REGULAR_CHARGE,
        sum: agorotToSum(input.amountAgorot),
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        notifyUrl: input.notifyUrl,
        description: input.description,
        'pageField[fullName]': input.payerName,
        'pageField[phone]': input.payerPhone,
        'pageField[email]': input.payerEmail,
        cField1: input.checkoutId,
      });
      const page = toStrings(data);
      if (!page.url || !page.processId || !page.processToken) throw new PaymentError('Grow payment page is incomplete');
      return { url: page.url, processId: page.processId, processToken: page.processToken };
    },

    async confirmPayment(period, page): Promise<ConfirmedPayment | null> {
      const data = await call('getPaymentProcessInfo', {
        pageCode: pageCodeFor(period),
        processId: page.processId,
        processToken: page.processToken,
      });
      const transactions = Array.isArray(data.transactions) ? (data.transactions as GrowData[]).map(toStrings) : [];
      const paid = transactions.find((transaction) => transaction.statusCode === PAID_STATUS_CODE);
      if (!paid?.transactionToken || !GATEWAY_ID_PATTERN.test(paid.transactionId ?? '')) return null;
      const amountAgorot = sumToAgorot(paid.sum);
      if (amountAgorot === null) throw new PaymentError('Grow transaction has no sum');
      const details = { ...paid, processId: page.processId, processToken: page.processToken };
      const billing: GrowBilling = { transactionId: paid.transactionId, transactionToken: paid.transactionToken, asmachta: paid.asmachta ?? '' };
      return {
        transactionId: paid.transactionId,
        amountAgorot,
        recurringRef: await readRecurringRef(period, paid),
        billing: JSON.stringify(billing),
        details,
      };
    },

    async acknowledge(period, payment): Promise<void> {
      const params: Record<string, string> = { pageCode: pageCodeFor(period) };
      for (const field of APPROVE_FIELDS) params[field] = payment.details[field] ?? '';
      await call('approveTransaction', params);
    },

    async updateRecurring(billing: string, change: RecurringChange): Promise<void> {
      const ref = parseBilling(billing);
      await call('updateDirectDebit', {
        userId: config.userId,
        apiKey: config.apiKey,
        transactionId: ref.transactionId,
        transactionToken: ref.transactionToken,
        asmachta: ref.asmachta,
        ...(change.amountAgorot !== undefined ? { sum: agorotToSum(change.amountAgorot) } : {}),
        ...(change.cancel ? { changeStatus: CANCEL_RECURRING } : {}),
      });
    },
  };
}

export type GrowAccountEvent =
  | { kind: 'renewal'; recurringRef: string; paymentId: string; amountAgorot: number }
  | { kind: 'failed'; recurringRef: string; message: string };

/**
 * An account webhook from Grow (enabled by Grow support): a monthly charge after the first, or a
 * failed one. Null when it isn't one of those or its `webhookKey` doesn't match ours.
 */
export function parseGrowAccountWebhook(body: GrowData, webhookKey: string): GrowAccountEvent | null {
  const fields = toStrings(body);
  const key = fields.webhookKey || fields.webhook_key || '';
  if (!safeEqual(key, webhookKey)) return null;
  if (GATEWAY_ID_PATTERN.test(fields.regular_payment_id ?? '')) {
    return { kind: 'failed', recurringRef: fields.regular_payment_id, message: fields.error_message ?? '' };
  }
  const amountAgorot = sumToAgorot(fields.paymentSum);
  if (GATEWAY_ID_PATTERN.test(fields.directDebitId ?? '') && GATEWAY_ID_PATTERN.test(fields.transactionCode ?? '') && amountAgorot !== null) {
    return { kind: 'renewal', recurringRef: fields.directDebitId, paymentId: fields.transactionCode, amountAgorot };
  }
  return null;
}
