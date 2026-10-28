import { describe, expect, it } from 'vitest';
import { parseParentProRoute, paymentReturnUrl } from './parentProRoute';

const ID = 'a'.repeat(32);

describe('parseParentProRoute', () => {
  it('reads the return from the payment page, paid or cancelled', () => {
    expect(parseParentProRoute(`?parent&paid=${ID}`)).toMatchObject({ paidCheckoutId: ID, isPaymentCancelled: false });
    expect(parseParentProRoute(`?parent&paid=${ID}&status=cancel`)).toMatchObject({ paidCheckoutId: ID, isPaymentCancelled: true });
  });

  it('ignores a malformed checkout id', () => {
    expect(parseParentProRoute('?parent&paid=../x&mockpay=ZZ')).toMatchObject({ paidCheckoutId: null, mockPayCheckoutId: null, isPaymentCancelled: false });
  });

  it('reads the stand-in page and a learner asking for Pro', () => {
    expect(parseParentProRoute(`?parent&mockpay=${ID}&pro=1`)).toMatchObject({ mockPayCheckoutId: ID, hasProIntent: true });
  });

  it('builds the return addresses the gateway uses', () => {
    expect(paymentReturnUrl(ID)).toBe(`/?parent&paid=${ID}`);
    expect(paymentReturnUrl(ID, true)).toBe(`/?parent&paid=${ID}&status=cancel`);
  });
});
