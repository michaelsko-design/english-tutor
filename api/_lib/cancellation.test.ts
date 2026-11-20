import { describe, expect, it } from 'vitest';
import { addPeriods, type Subscription } from './proBilling';
import { hasFullRefund, monthsStarted, quoteCancellation, yearlyPlanStart, yearlyProrataRefund } from './cancellation';

const DAY_MS = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 0, 10, 12);

function plan(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 'a'.repeat(32),
    payerParentUid: 'parent1',
    childUids: ['kid1'],
    seatLimit: 1,
    period: 'yearly',
    status: 'active',
    periodEnd: addPeriods(START, 'yearly'),
    amountAgorot: 34900,
    provider: 'grow',
    recurringRef: null,
    billing: '',
    lastRemovalAt: 0,
    lastSwapAt: 0,
    createdAt: START,
    ...overrides,
  };
}

const quote = (sub: Subscription, nowMs: number, extra: { hasRequest?: boolean; hasUsedFullRefund?: boolean } = {}) =>
  quoteCancellation({ sub, paidAgorot: sub.amountAgorot, nowMs, hasRequest: false, hasUsedFullRefund: false, ...extra });

describe('monthsStarted', () => {
  it('counts the current month as started', () => {
    expect(monthsStarted(START, START)).toBe(1);
    expect(monthsStarted(START, addPeriods(START, 'monthly') - 1)).toBe(1);
    expect(monthsStarted(START, addPeriods(START, 'monthly'))).toBe(2);
    expect(monthsStarted(START, START - 1)).toBe(0);
  });
});

describe('yearlyProrataRefund', () => {
  it('takes the regular monthly price for each month started, never below 0', () => {
    expect(yearlyProrataRefund(34900, 1, 4)).toBe(34900 - 4 * 3900); // ₪193, the example in the terms
    expect(yearlyProrataRefund(34900, 1, 9)).toBe(0); // 9 × ₪39 = ₪351 > ₪349
    expect(yearlyProrataRefund(99900, 4, 3)).toBe(99900 - 3 * 11400);
  });
});

describe('quoteCancellation', () => {
  it('gives the whole payment back within 14 days, and Pro closes now', () => {
    const now = START + 13 * DAY_MS;
    expect(quote(plan(), now)).toEqual({ mode: 'full_refund', refundAgorot: 34900, accessUntil: now });
    expect(quote(plan({ period: 'monthly', amountAgorot: 3900, periodEnd: addPeriods(START, 'monthly') }), now).mode).toBe('full_refund');
  });

  it('gives the full refund once per family', () => {
    const now = START + 2 * DAY_MS;
    expect(quote(plan(), now, { hasUsedFullRefund: true }).mode).toBe('yearly_prorata');
  });

  it('refunds a yearly plan by the formula after 14 days, closing Pro at the end of the plan month', () => {
    const now = addPeriods(START, 'monthly', 3) + DAY_MS; // in the 4th month
    expect(quote(plan(), now)).toEqual({
      mode: 'yearly_prorata',
      refundAgorot: 19300,
      accessUntil: addPeriods(START, 'monthly', 4),
    });
  });

  it('keeps Pro to the year end when the formula leaves nothing (from the 9th month)', () => {
    const now = addPeriods(START, 'monthly', 8) + DAY_MS;
    const sub = plan();
    expect(quote(sub, now)).toEqual({ mode: 'yearly_prorata', refundAgorot: 0, accessUntil: sub.periodEnd });
  });

  it('counts a renewed year from the old end date', () => {
    const oldEnd = addPeriods(START, 'yearly');
    const renewal = plan({ createdAt: oldEnd - 10 * DAY_MS, periodEnd: addPeriods(oldEnd, 'yearly') });
    expect(yearlyPlanStart(renewal)).toBe(oldEnd);
    // Past the 14 days, but the renewed year has not begun: nothing used yet
    expect(quote(renewal, oldEnd - DAY_MS, { hasUsedFullRefund: true })).toEqual({
      mode: 'yearly_prorata',
      refundAgorot: 34900,
      accessUntil: oldEnd,
    });
  });

  it('keeps the year paid before a renewal when the renewal gets the full refund', () => {
    const oldEnd = addPeriods(START, 'yearly');
    const renewal = plan({ createdAt: oldEnd - 10 * DAY_MS, periodEnd: addPeriods(oldEnd, 'yearly') });
    expect(quote(renewal, oldEnd - 9 * DAY_MS)).toEqual({ mode: 'full_refund', refundAgorot: 34900, accessUntil: oldEnd });
  });

  it('stops a monthly plan at the end of the paid month after 14 days', () => {
    const sub = plan({ period: 'monthly', amountAgorot: 3900, periodEnd: addPeriods(START, 'monthly', 2) });
    const now = addPeriods(START, 'monthly') + DAY_MS;
    expect(quote(sub, now)).toEqual({ mode: 'monthly_end', refundAgorot: 0, accessUntil: sub.periodEnd });
    expect(quote({ ...sub, status: 'canceled' }, now).mode).toBe('none');
  });

  it('still gives a full refund within 14 days to a monthly plan whose renewal was already cancelled', () => {
    const sub = plan({ period: 'monthly', status: 'canceled', amountAgorot: 3900, periodEnd: addPeriods(START, 'monthly') });
    expect(quote(sub, START + DAY_MS).mode).toBe('full_refund');
  });

  it('does nothing for an ended plan or a plan already refunded', () => {
    expect(quote(plan({ status: 'expired' }), START + DAY_MS)).toMatchObject({ mode: 'none', reason: 'not_live' });
    expect(quote(plan(), START + DAY_MS, { hasRequest: true })).toMatchObject({ mode: 'none', reason: 'already_requested' });
  });
});

describe('hasFullRefund', () => {
  it('finds a full refund among the family requests', () => {
    const doc = (mode: string) => ({ id: 'x', fields: { mode } });
    expect(hasFullRefund([doc('yearly_prorata')])).toBe(false);
    expect(hasFullRefund([doc('yearly_prorata'), doc('full_refund')])).toBe(true);
  });
});
