import { describe, expect, it } from 'vitest';
import { checkLapse, entitlementAction, repairForDeletedAccounts } from './proReconcile';
import type { Subscription } from './proBilling';

const NOW = Date.UTC(2026, 9, 29);
const DAY = 24 * 60 * 60 * 1000;

function plan(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 's1', payerParentUid: 'parent1', childUids: ['kid1', 'kid2'], seatLimit: 2, period: 'monthly', status: 'active',
    periodEnd: NOW + 10 * DAY, amountAgorot: 6400, provider: 'grow', recurringRef: 'DD7', billing: 'B',
    lastRemovalAt: 0, lastSwapAt: 0, createdAt: 0, ...overrides,
  };
}

describe('repairForDeletedAccounts', () => {
  it('changes nothing when every account still exists', () => {
    expect(repairForDeletedAccounts(plan(), new Set())).toBeNull();
  });

  it("frees a deleted learner's monthly seat at the lower price", () => {
    const repair = repairForDeletedAccounts(plan(), new Set(['kid2']));
    expect(repair).toEqual({
      next: expect.objectContaining({ childUids: ['kid1'], seatLimit: 1, amountAgorot: 3900, status: 'active' }),
      gateway: { amountAgorot: 3900 },
    });
  });

  it('cancels a monthly plan whose last child or payer is gone', () => {
    expect(repairForDeletedAccounts(plan(), new Set(['kid1', 'kid2']))).toEqual({
      next: expect.objectContaining({ childUids: [], status: 'canceled' }),
      gateway: { cancel: true },
    });
    expect(repairForDeletedAccounts(plan(), new Set(['parent1']))).toEqual({
      next: expect.objectContaining({ childUids: ['kid1', 'kid2'], status: 'canceled' }),
      gateway: { cancel: true },
    });
  });

  it('only empties the seat on a paid yearly or canceled plan, and leaves a canceled plan of a gone payer', () => {
    expect(repairForDeletedAccounts(plan({ period: 'yearly', seatLimit: 3 }), new Set(['kid2']))).toEqual({
      next: expect.objectContaining({ childUids: ['kid1'], seatLimit: 3 }),
      gateway: null,
    });
    expect(repairForDeletedAccounts(plan({ status: 'canceled' }), new Set(['kid2']))?.gateway).toBeNull();
    expect(repairForDeletedAccounts(plan({ status: 'canceled' }), new Set(['parent1']))).toBeNull();
    expect(repairForDeletedAccounts(plan({ status: 'expired' }), new Set(['kid1']))).toBeNull();
  });
});

describe('checkLapse', () => {
  it('waits out the grace days, then expires all but an active monthly plan, which is reported', () => {
    const ended = NOW - 4 * DAY;
    expect(checkLapse(plan({ periodEnd: NOW - 2 * DAY, status: 'canceled' }), NOW)).toBeNull();
    expect(checkLapse(plan({ periodEnd: ended, status: 'canceled' }), NOW)).toBe('expire');
    expect(checkLapse(plan({ periodEnd: ended, status: 'past_due' }), NOW)).toBe('expire');
    expect(checkLapse(plan({ periodEnd: ended, period: 'yearly' }), NOW)).toBe('expire');
    expect(checkLapse(plan({ periodEnd: ended }), NOW)).toBe('missed_renewal');
    expect(checkLapse(plan({ periodEnd: ended, status: 'expired' }), NOW)).toBeNull();
  });
});

describe('entitlementAction', () => {
  const doc = (id: string, fields: Record<string, string | number>) => ({ id, fields });

  it("deletes a gone learner's entitlement and expires an ended one", () => {
    expect(entitlementAction(doc('kid1', { status: 'active', periodEnd: NOW + DAY }), new Set(['kid1']), NOW)).toBe('delete');
    expect(entitlementAction(doc('kid1', { status: 'canceled', periodEnd: NOW - 4 * DAY }), new Set(), NOW)).toBe('expire');
    expect(entitlementAction(doc('kid1', { status: 'active', periodEnd: NOW - DAY }), new Set(), NOW)).toBeNull();
    expect(entitlementAction(doc('kid1', { status: 'expired', periodEnd: NOW - 40 * DAY }), new Set(), NOW)).toBeNull();
  });
});
