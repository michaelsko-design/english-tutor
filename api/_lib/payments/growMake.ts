/**
 * Grow through Grow's free Make.com app (PAYMENT_PROVIDER=grow-make; docs/grow-make-setup.md).
 * Grow's API costs a monthly fee; its Make app doesn't. Our server calls one Make scenario (a custom
 * webhook with an API key) that runs Grow's own modules and answers in the same request:
 * - `create`: Create Payment Link. Monthly is a standing order ("הוראת קבע"), card only; yearly is
 *   one payment by card, Bit, Apple Pay or Google Pay. Answers `{url, processId, processToken}`.
 * - `info`: Get Payment Link Info, only to find a monthly plan's standing order id.
 * - `approve`: Approve Transaction.
 * Grow sends the payment notice straight to our `notifyUrl`. It is trusted only when it carries the
 * link's secret process token, which Grow gave our server alone (it never reaches the browser).
 * Make can't change or cancel a standing order, so `canChangeRecurring` is false: the owner does it
 * in Grow by hand, from a task on the owner dashboard.
 */
import type { BillingPeriod } from '../../../src/config/proTier.js';
import {
  GATEWAY_ID_PATTERN,
  PaymentError,
  safeEqual,
  sumToAgorot,
  type ConfirmedPayment,
  type PaymentPage,
  type PaymentPageInput,
  type PaymentProvider,
} from './provider.js';

/** Grow's payment methods (createPaymentLink `transactionType`) */
const CARD = 1;
const BIT = 6;
const APPLE_PAY = 13;
const GOOGLE_PAY = 14;
/** Grow's standing orders are card only (terms §13.2.2, §13.4.2, §13.5.2) */
const METHODS: Record<BillingPeriod, number[]> = { monthly: [CARD], yearly: [CARD, BIT, APPLE_PAY, GOOGLE_PAY] };
/** Grow's status code for a paid transaction ("שולם") */
const PAID_STATUS_CODE = '2';
const AGOROT_PER_SHEKEL = 100;
const TIMEOUT_MS = 10_000;
const MAKE_HOST = /(^|\.)make\.com$/;

export interface GrowMakeConfig {
  /** The scenario's custom webhook address (secret) */
  webhookUrl: string;
  /** The webhook's API key, sent as `x-make-apikey` */
  apiKey: string;
}

export function readGrowMakeConfig(env: Record<string, string | undefined>): GrowMakeConfig | null {
  const webhookUrl = env.GROW_MAKE_WEBHOOK_URL ?? '';
  const apiKey = env.GROW_MAKE_API_KEY ?? '';
  if (!webhookUrl || !apiKey) return null;
  try {
    const url = new URL(webhookUrl);
    if (url.protocol !== 'https:' || !MAKE_HOST.test(url.hostname)) return null;
  } catch {
    return null;
  }
  return { webhookUrl, apiKey };
}

/** Every string or number leaf of a JSON value, by its last key (the first one found wins) */
function leaves(value: unknown, into: Record<string, string> = {}): Record<string, string> {
  if (!value || typeof value !== 'object') return into;
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === 'object') leaves(child, into);
    else if ((typeof child === 'string' || typeof child === 'number') && !(key in into)) into[key] = String(child).trim();
  }
  return into;
}

export function createGrowMakeProvider(config: GrowMakeConfig, fetchImpl: typeof fetch = fetch): PaymentProvider {
  async function run(action: string, params: Record<string, unknown>): Promise<unknown> {
    let response: Response;
    try {
      response = await fetchImpl(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-make-apikey': config.apiKey },
        body: JSON.stringify({ action, ...params }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      throw new PaymentError(`Make ${action} unreachable`);
    }
    if (!response.ok) throw new PaymentError(`Make ${action} failed`, String(response.status));
    // Without its Webhook response module a scenario answers a plain "Accepted"
    const body = (await response.json().catch(() => null)) as unknown;
    if (!body || typeof body !== 'object') throw new PaymentError(`Make ${action} gave no answer`);
    return body;
  }

  /** The standing order id, from the scenario's Get Payment Link Info; null when it has none */
  async function findRecurringRef(page: Pick<PaymentPage, 'processId' | 'processToken'>): Promise<string | null> {
    try {
      const info = leaves(await run('info', { processId: page.processId, processToken: page.processToken }));
      return GATEWAY_ID_PATTERN.test(info.directDebitId ?? '') ? info.directDebitId : null;
    } catch (error) {
      // The payment stands; the first renewal links the plan instead (payment-webhook)
      console.error(`grow-make: info failed (${error instanceof PaymentError ? error.code || error.message : 'unexpected'})`);
      return null;
    }
  }

  return {
    id: 'grow',
    canChangeRecurring: false,

    async createPaymentPage(input: PaymentPageInput): Promise<PaymentPage> {
      // Grow takes product prices in whole shekels
      if (input.amountAgorot % AGOROT_PER_SHEKEL !== 0) throw new PaymentError('Price must be whole shekels');
      const page = leaves(
        await run('create', {
          recurring: input.period === 'monthly',
          transactionTypes: METHODS[input.period],
          checkoutId: input.checkoutId,
          productName: input.description,
          price: input.amountAgorot / AGOROT_PER_SHEKEL,
          payerName: input.payerName,
          payerPhone: input.payerPhone,
          payerEmail: input.payerEmail,
          successUrl: input.successUrl,
          notifyUrl: input.notifyUrl,
        })
      );
      if (!page.url?.startsWith('https://') || !page.processId || !page.processToken) throw new PaymentError('Grow payment link is incomplete');
      return { url: page.url, processId: page.processId, processToken: page.processToken };
    },

    async confirmPayment(period, page, notice): Promise<ConfirmedPayment | null> {
      if (!notice) return null;
      // Only Grow and our server know the link's token: a forged notice can't carry it
      const isThisLink =
        safeEqual(notice.paymentLinkProcessId ?? '', page.processId) && safeEqual(notice.paymentLinkProcessToken ?? '', page.processToken);
      if (!isThisLink || notice.statusCode !== PAID_STATUS_CODE) return null;
      if (!GATEWAY_ID_PATTERN.test(notice.transactionId ?? '') || !notice.transactionToken) return null;
      const amountAgorot = sumToAgorot(notice.sum);
      if (amountAgorot === null) throw new PaymentError('Grow notice has no sum');
      const fromNotice = GATEWAY_ID_PATTERN.test(notice.directDebitId ?? '') ? notice.directDebitId : null;
      const recurringRef = period === 'monthly' ? (fromNotice ?? (await findRecurringRef(page))) : null;
      return {
        transactionId: notice.transactionId,
        amountAgorot,
        recurringRef,
        billing: JSON.stringify({ transactionId: notice.transactionId, transactionToken: notice.transactionToken, asmachta: notice.asmachta ?? '' }),
        details: { ...notice },
      };
    },

    async acknowledge(_period, payment): Promise<void> {
      await run('approve', payment.details);
    },

    async updateRecurring(): Promise<void> {
      throw new PaymentError('Grow through Make cannot change a standing order', 'manual');
    },
  };
}
