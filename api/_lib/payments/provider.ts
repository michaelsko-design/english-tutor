/**
 * The payment gateway behind EnglishVibe Pro (docs/feature-pro-tier.md, "Server"). The functions
 * only talk to this interface; `grow.ts` is the real gateway and `mock.ts` stands in for it on the
 * emulators and in tests.
 */
import type { BillingPeriod } from '../../../src/config/proTier.js';

export interface PaymentPageInput {
  checkoutId: string;
  amountAgorot: number;
  period: BillingPeriod;
  /** Plain ASCII: the gateway refuses special characters */
  description: string;
  payerName: string;
  payerPhone: string;
  payerEmail: string;
  successUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

/** The hosted payment page; processId/processToken are secret (never sent to the browser) */
export interface PaymentPage {
  url: string;
  processId: string;
  processToken: string;
}

/** A payment the gateway itself confirmed (never taken from a notification body) */
export interface ConfirmedPayment {
  transactionId: string;
  amountAgorot: number;
  /** The gateway's id of the recurring charge (monthly plans), used to match later renewals */
  recurringRef: string | null;
  /** Opaque gateway data needed later to change or cancel the recurring charge */
  billing: string;
  /** The gateway's own fields, for `acknowledge` */
  details: Record<string, string>;
}

export interface RecurringChange {
  amountAgorot?: number;
  cancel?: boolean;
}

export interface PaymentProvider {
  readonly id: 'grow' | 'mock';
  createPaymentPage(input: PaymentPageInput): Promise<PaymentPage>;
  /** Asks the gateway about the payment page; null while nothing has been paid on it. */
  confirmPayment(period: BillingPeriod, page: Pick<PaymentPage, 'processId' | 'processToken'>): Promise<ConfirmedPayment | null>;
  /** Tells the gateway the payment was received (Grow: approveTransaction). */
  acknowledge(period: BillingPeriod, payment: ConfirmedPayment): Promise<void>;
  /** Changes the amount of a recurring charge from its next charge, or cancels it. */
  updateRecurring(billing: string, change: RecurringChange): Promise<void>;
}

/** The gateway refused a call or could not be reached; `code` is the gateway's error id when it gave one */
export class PaymentError extends Error {
  constructor(
    message: string,
    readonly code: string = ''
  ) {
    super(message);
  }
}

/** A gateway id that is safe inside a Firestore document id */
export const GATEWAY_ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;

/** Agorot from a gateway sum such as "39" or "39.00" */
export function sumToAgorot(sum: unknown): number | null {
  const value = typeof sum === 'number' ? sum : Number.parseFloat(String(sum ?? '').trim());
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : null;
}

/** "39.00" from 3900 agorot */
export function agorotToSum(agorot: number): string {
  return (agorot / 100).toFixed(2);
}

/** Compares secrets without leaking where they differ */
export function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
