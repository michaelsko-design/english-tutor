/**
 * A stand-in gateway for the emulators and tests (PAYMENT_PROVIDER=mock): every payment page is
 * "paid" in full as soon as it is asked about. Only local runs get it (`createPaymentProvider`).
 * Stateless (serverless functions keep nothing), so the amount travels inside the process id.
 */
import type { ConfirmedPayment, PaymentPage, PaymentPageInput, PaymentProvider } from './provider.js';

const PREFIX = 'mock';

export function createMockProvider(): PaymentProvider {
  return {
    id: 'mock',

    async createPaymentPage(input: PaymentPageInput): Promise<PaymentPage> {
      const origin = new URL(input.successUrl).origin;
      return {
        url: `${origin}/?parent&mockpay=${encodeURIComponent(input.checkoutId)}`,
        processId: `${PREFIX}_${input.checkoutId}_${input.amountAgorot}`,
        processToken: crypto.randomUUID(),
      };
    },

    async confirmPayment(period, page): Promise<ConfirmedPayment | null> {
      const [prefix, checkoutId, amount] = page.processId.split('_');
      const amountAgorot = Number(amount);
      if (prefix !== PREFIX || !checkoutId || !Number.isInteger(amountAgorot)) return null;
      return {
        transactionId: `${PREFIX}-${checkoutId}`,
        amountAgorot,
        recurringRef: period === 'monthly' ? `${PREFIX}-dd-${checkoutId}` : null,
        billing: JSON.stringify({ checkoutId }),
        details: {},
      };
    },

    async acknowledge(): Promise<void> {},

    async updateRecurring(): Promise<void> {},
  };
}
