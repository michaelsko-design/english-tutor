import { describe, expect, it } from 'vitest';
import type { Entitlement } from './proGate';
import { canJoinCheckout, childrenOnSamePlan, findOpenPlan, getChildProStatus } from './proPlanStatus';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 28, 12);

const plan = (overrides: Partial<Entitlement> = {}): Entitlement => ({
  plan: 'pro',
  status: 'active',
  source: 'subscription',
  periodEnd: NOW + 20 * DAY,
  billingPeriod: 'monthly',
  payerParentUid: 'me',
  subscriptionId: 'sub1',
  seatLimit: 2,
  ...overrides,
});

describe('getChildProStatus', () => {
  it('is free with no entitlement or an ended one, and a gift for a comp grant', () => {
    expect(getChildProStatus(null, 'me', {}, NOW)).toEqual({ kind: 'free' });
    expect(getChildProStatus(plan({ periodEnd: NOW - 10 * DAY }), 'me', {}, NOW)).toEqual({ kind: 'free' });
    expect(getChildProStatus(plan({ source: 'comp', billingPeriod: null }), 'me', {}, NOW)).toEqual({ kind: 'comp' });
  });

  it('gives the paying parent the controls of a monthly plan', () => {
    const all = { a: plan(), b: plan() };
    expect(getChildProStatus(all.a, 'me', all, NOW)).toMatchObject({
      kind: 'plan', isPayer: true, isRenewing: true, hasSeat: true, canRemove: true, shouldOfferRenewal: false,
    });
  });

  it('shows another parent the status only', () => {
    const all = { a: plan(), b: plan() };
    expect(getChildProStatus(all.a, 'other', all, NOW)).toMatchObject({ isPayer: false, canRemove: false, shouldOfferRenewal: false });
  });

  it('offers to renew a yearly plan only in its last 14 days', () => {
    const near = plan({ billingPeriod: 'yearly', periodEnd: NOW + 10 * DAY });
    const far = plan({ billingPeriod: 'yearly', periodEnd: NOW + 100 * DAY });
    expect(getChildProStatus(near, 'me', { a: near }, NOW)).toMatchObject({ shouldOfferRenewal: true, isRenewing: false });
    expect(getChildProStatus(far, 'me', { a: far }, NOW)).toMatchObject({ shouldOfferRenewal: false });
  });

  it('never removes the last child (that is a cancel) or a child who already left', () => {
    const alone = plan();
    expect(getChildProStatus(alone, 'me', { a: alone }, NOW)).toMatchObject({ canRemove: false });
    const left = plan({ status: 'canceled' });
    expect(getChildProStatus(left, 'me', { a: left, b: plan() }, NOW)).toMatchObject({
      hasSeat: false, hasLeftPlan: true, isRenewing: false, canRemove: false,
    });
    expect(getChildProStatus(left, 'me', { a: left }, NOW)).toMatchObject({ hasLeftPlan: false });
  });
});

describe('findOpenPlan', () => {
  it('finds a monthly plan with room, priced one band up', () => {
    expect(findOpenPlan('me', { a: plan(), b: null }, NOW)).toEqual({ subscriptionId: 'sub1', period: 'monthly', nextMonthlyAgorot: 6400 });
  });

  it('finds a yearly plan only with a paid seat left', () => {
    const yearly = plan({ billingPeriod: 'yearly' });
    expect(findOpenPlan('me', { a: yearly, b: null }, NOW)).toMatchObject({ period: 'yearly', nextMonthlyAgorot: null });
    expect(findOpenPlan('me', { a: yearly, b: plan({ billingPeriod: 'yearly' }) }, NOW)).toBeNull();
  });

  it("ignores another parent's plan and a cancelled one", () => {
    expect(findOpenPlan('me', { a: plan({ payerParentUid: 'other' }) }, NOW)).toBeNull();
    expect(findOpenPlan('me', { a: plan({ status: 'canceled' }) }, NOW)).toBeNull();
  });
});

describe('children on a plan and checkout', () => {
  it('lists the seated children of a plan', () => {
    expect(childrenOnSamePlan('sub1', { a: plan(), b: plan({ status: 'canceled' }), c: plan({ subscriptionId: 'x' }) }, NOW)).toEqual(['a']);
  });

  it('lets free children, children who left, and a renewal into a checkout', () => {
    expect(canJoinCheckout({ kind: 'free' })).toBe(true);
    expect(canJoinCheckout({ kind: 'comp' })).toBe(false);
    expect(canJoinCheckout(undefined)).toBe(false);
    const status = getChildProStatus(plan(), 'me', { a: plan() }, NOW);
    expect(canJoinCheckout(status)).toBe(false);
    expect(canJoinCheckout({ ...status, hasSeat: false } as typeof status)).toBe(true);
  });
});
