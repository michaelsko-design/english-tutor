import { describe, expect, it } from 'vitest';
import {
  addChildToSubscription,
  addPeriods,
  holdsLiveSeat,
  readSubscription,
  renewableSeatEnd,
  removeChildFromSubscription,
  subscriptionFields,
  type Subscription,
} from './proBilling';
import { proPriceAgorot, quoteProPrice } from '../../src/config/proTier';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 28, 12);

function subscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 'a'.repeat(32),
    payerParentUid: 'parent1',
    childUids: ['kid1', 'kid2'],
    seatLimit: 2,
    period: 'monthly',
    status: 'active',
    periodEnd: NOW + 20 * DAY,
    amountAgorot: 6400,
    provider: 'grow',
    recurringRef: 'dd1',
    billing: '{}',
    lastRemovalAt: 0,
    lastSwapAt: 0,
    createdAt: NOW - 10 * DAY,
    ...overrides,
  };
}

describe('pro prices', () => {
  it('prices 1 to 4 children in agorot, VAT included: ₪39 and ₪25 for each more child a month', () => {
    expect([1, 2, 3, 4].map((n) => proPriceAgorot(n, 'monthly'))).toEqual([3900, 6400, 8900, 11400]);
    expect([1, 2, 3, 4].map((n) => proPriceAgorot(n, 'yearly'))).toEqual([34900, 56900, 79900, 99900]);
    expect(proPriceAgorot(5, 'monthly')).toBeNull();
    expect(proPriceAgorot(0, 'yearly')).toBeNull();
    expect(proPriceAgorot(1.5, 'yearly')).toBeNull();
  });

  it('keeps every yearly price at about 3 months free, ending in 9', () => {
    for (const n of [1, 2, 3, 4]) {
      const monthly = proPriceAgorot(n, 'monthly')!;
      const yearly = proPriceAgorot(n, 'yearly')!;
      expect(yearly).toBeLessThanOrEqual(9 * monthly);
      expect(yearly).toBeGreaterThan(8.5 * monthly);
      expect((yearly / 100) % 10).toBe(9);
    }
  });

  it('quotes the per-month, per-child and yearly savings figures', () => {
    expect(quoteProPrice(2, 'yearly')).toEqual({
      chargeAgorot: 56900, perMonthAgorot: 56900 / 12, perChildMonthAgorot: 56900 / 24, yearlySavingsAgorot: 19900,
    });
    expect(quoteProPrice(4, 'monthly')).toMatchObject({ chargeAgorot: 11400, perMonthAgorot: 11400, perChildMonthAgorot: 2850, yearlySavingsAgorot: 36900 });
    expect(quoteProPrice(5, 'monthly')).toBeNull();
  });
});

describe('addPeriods', () => {
  it('adds calendar months in UTC', () => {
    expect(addPeriods(Date.UTC(2026, 0, 15, 9), 'monthly')).toBe(Date.UTC(2026, 1, 15, 9));
    expect(addPeriods(Date.UTC(2026, 0, 15), 'yearly')).toBe(Date.UTC(2027, 0, 15));
  });

  it('clamps to the last day of a shorter month', () => {
    expect(addPeriods(Date.UTC(2026, 0, 31), 'monthly')).toBe(Date.UTC(2026, 1, 28));
    expect(addPeriods(Date.UTC(2028, 0, 31), 'monthly')).toBe(Date.UTC(2028, 1, 29));
  });
});

describe('holdsLiveSeat', () => {
  const doc = (fields: Record<string, string | number>) => ({ id: 'kid1', fields });

  it('counts an active or past-due seat until the grace days are over', () => {
    expect(holdsLiveSeat(doc({ status: 'active', periodEnd: NOW + DAY }), NOW)).toBe(true);
    expect(holdsLiveSeat(doc({ status: 'past_due', periodEnd: NOW - DAY }), NOW)).toBe(true);
    expect(holdsLiveSeat(doc({ status: 'active', periodEnd: NOW - 4 * DAY }), NOW)).toBe(false);
  });

  it('ignores a left seat, no entitlement, and the plan being changed', () => {
    expect(holdsLiveSeat(doc({ status: 'canceled', periodEnd: NOW + DAY }), NOW)).toBe(false);
    expect(holdsLiveSeat(null, NOW)).toBe(false);
    expect(holdsLiveSeat(doc({ status: 'active', periodEnd: NOW + DAY, subscriptionId: 's1' }), NOW, 's1')).toBe(false);
  });
});

describe('renewableSeatEnd', () => {
  const yearly = (fields: Record<string, string | number> = {}) => ({
    id: 'kid1',
    fields: { status: 'active', billingPeriod: 'yearly', payerParentUid: 'p1', periodEnd: NOW + 10 * DAY, ...fields },
  });

  it("gives the end of the payer's yearly seat in its last 14 days and grace days", () => {
    expect(renewableSeatEnd(yearly(), 'p1', NOW)).toBe(NOW + 10 * DAY);
    expect(renewableSeatEnd(yearly({ periodEnd: NOW - DAY }), 'p1', NOW)).toBe(NOW - DAY);
  });

  it('refuses earlier, another payer, a monthly plan or an ended seat', () => {
    expect(renewableSeatEnd(yearly({ periodEnd: NOW + 20 * DAY }), 'p1', NOW)).toBeNull();
    expect(renewableSeatEnd(yearly(), 'p2', NOW)).toBeNull();
    expect(renewableSeatEnd(yearly({ billingPeriod: 'monthly' }), 'p1', NOW)).toBeNull();
    expect(renewableSeatEnd(yearly({ status: 'canceled' }), 'p1', NOW)).toBeNull();
    expect(renewableSeatEnd(null, 'p1', NOW)).toBeNull();
  });
});

describe('seat changes', () => {
  it('moves a monthly plan up a band when a child is added', () => {
    const change = addChildToSubscription(subscription(), 'kid3', NOW);
    expect(change).toMatchObject({ ok: true, amountChanged: true, sub: { childUids: ['kid1', 'kid2', 'kid3'], seatLimit: 3, amountAgorot: 8900 } });
  });

  it('prices a 4th child and refuses a 5th', () => {
    const three = subscription({ childUids: ['a', 'b', 'c'], seatLimit: 3, amountAgorot: 8900 });
    expect(addChildToSubscription(three, 'd', NOW)).toMatchObject({ ok: true, sub: { seatLimit: 4, amountAgorot: 11400 } });
    const four = subscription({ childUids: ['a', 'b', 'c', 'd'], seatLimit: 4, amountAgorot: 11400 });
    expect(addChildToSubscription(four, 'e', NOW)).toMatchObject({ ok: false, status: 409 });
  });

  it('fills only paid seats on a yearly plan', () => {
    const yearly = subscription({ period: 'yearly', childUids: ['kid1'], seatLimit: 2, amountAgorot: 56900 });
    expect(addChildToSubscription(yearly, 'kid2', NOW)).toMatchObject({ ok: true, amountChanged: false });
    const full = subscription({ period: 'yearly', seatLimit: 2, amountAgorot: 56900 });
    expect(addChildToSubscription(full, 'kid3', NOW)).toMatchObject({ ok: false, status: 409 });
  });

  it('allows one swap every 30 days', () => {
    const afterRemoval = subscription({ childUids: ['kid1'], lastRemovalAt: NOW - DAY });
    const first = addChildToSubscription(afterRemoval, 'kid3', NOW);
    expect(first).toMatchObject({ ok: true, sub: { lastSwapAt: NOW } });
    const recentSwap = subscription({ childUids: ['kid1'], lastRemovalAt: NOW - DAY, lastSwapAt: NOW - 10 * DAY });
    expect(addChildToSubscription(recentSwap, 'kid3', NOW)).toMatchObject({ ok: false, status: 429 });
    const oldRemoval = subscription({ childUids: ['kid1'], lastRemovalAt: NOW - 31 * DAY, lastSwapAt: NOW - 10 * DAY });
    expect(addChildToSubscription(oldRemoval, 'kid3', NOW)).toMatchObject({ ok: true, sub: { lastSwapAt: NOW - 10 * DAY } });
  });

  it('refuses changes to a canceled plan or a child already seated', () => {
    expect(addChildToSubscription(subscription({ status: 'canceled' }), 'kid3', NOW)).toMatchObject({ ok: false, status: 409 });
    expect(addChildToSubscription(subscription(), 'kid1', NOW)).toMatchObject({ ok: false, status: 409 });
  });

  it('moves a monthly plan down a band and records the removal', () => {
    const change = removeChildFromSubscription(subscription(), 'kid2', NOW);
    expect(change).toMatchObject({ ok: true, amountChanged: true, sub: { childUids: ['kid1'], seatLimit: 1, amountAgorot: 3900, lastRemovalAt: NOW } });
  });

  it('keeps the paid seats of a yearly plan and refuses removing the last child', () => {
    const yearly = subscription({ period: 'yearly', amountAgorot: 56900 });
    expect(removeChildFromSubscription(yearly, 'kid2', NOW)).toMatchObject({ ok: true, amountChanged: false, sub: { seatLimit: 2 } });
    expect(removeChildFromSubscription(subscription({ childUids: ['kid1'] }), 'kid1', NOW)).toMatchObject({ ok: false, status: 409 });
    expect(removeChildFromSubscription(subscription(), 'stranger', NOW)).toMatchObject({ ok: false, status: 404 });
  });
});

describe('subscription records', () => {
  it('reads back what it writes', () => {
    const sub = subscription();
    expect(readSubscription({ id: sub.id, fields: subscriptionFields(sub, NOW), updateTime: 'v1' })).toEqual({ ...sub, updateTime: 'v1' });
  });

  it('refuses a record with an unknown status or period', () => {
    expect(readSubscription({ id: 'x', fields: { ...subscriptionFields(subscription(), NOW), status: 'weird' } })).toBeNull();
    expect(readSubscription({ id: 'x', fields: { ...subscriptionFields(subscription(), NOW), period: 'weekly' } })).toBeNull();
  });
});
