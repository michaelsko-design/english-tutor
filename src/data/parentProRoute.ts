import { PRO_INTENT_PARAM } from './proAsk';

/**
 * The parent portal's Pro addresses (docs/feature-pro-tier.md, "Phase 2"):
 * - `/?parent&paid=<checkoutId>`: back from the payment page; `&status=cancel` when it was cancelled
 * - `/?parent&mockpay=<checkoutId>`: the stand-in gateway's page (emulator runs only)
 * - `/?parent&pro=1`: a learner asked for Pro, so the plans are opened
 */
export const PAID_PARAM = 'paid';
export const MOCK_PAY_PARAM = 'mockpay';
const STATUS_PARAM = 'status';
const CHECKOUT_ID_PATTERN = /^[a-f0-9]{32}$/;

export interface ParentProRoute {
  paidCheckoutId: string | null;
  isPaymentCancelled: boolean;
  mockPayCheckoutId: string | null;
  hasProIntent: boolean;
}

const checkoutId = (value: string | null) => (value && CHECKOUT_ID_PATTERN.test(value) ? value : null);

export function parseParentProRoute(search: string): ParentProRoute {
  const params = new URLSearchParams(search);
  const paidCheckoutId = checkoutId(params.get(PAID_PARAM));
  return {
    paidCheckoutId,
    isPaymentCancelled: paidCheckoutId !== null && params.get(STATUS_PARAM) === 'cancel',
    mockPayCheckoutId: checkoutId(params.get(MOCK_PAY_PARAM)),
    hasProIntent: params.get(PRO_INTENT_PARAM) === '1',
  };
}

export const paymentReturnUrl = (id: string, isCancelled = false) =>
  `/?parent&${PAID_PARAM}=${id}${isCancelled ? `&${STATUS_PARAM}=cancel` : ''}`;
