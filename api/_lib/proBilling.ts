/**
 * EnglishVibe Pro billing records (docs/feature-pro-tier.md). All server-only collections:
 * - `checkouts/{id}`: one payment page a parent opened (pending until the gateway confirms it)
 * - `subscriptions/{id}` (id = the checkout that started it): the parent's plan and its seats
 * - `entitlements/{childUid}`: what the learner's app reads (one per child, mirrors its subscription)
 * - `payments/{provider}_{transactionId}`: one per charge, created once (makes notifications idempotent)
 * - `recurringRefs/{provider}_{ref}`: the gateway's recurring-charge id -> subscription id
 * Pure functions only; the handlers do the reading and writing.
 */
import {
  isBillingPeriod,
  PRO_GRACE_DAYS,
  proPriceAgorot,
  SEAT_SWAP_COOLDOWN_DAYS,
  type BillingPeriod,
} from '../../src/config/proTier.js';
import type { PlainDocument, PlainValue } from './firestoreAdmin.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS_PER_PERIOD: Record<BillingPeriod, number> = { monthly: 1, yearly: 12 };

export const UID_PATTERN = /^[A-Za-z0-9]{1,128}$/;
export const CHECKOUT_ID_PATTERN = /^[a-f0-9]{32}$/;

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled';

export interface Checkout {
  id: string;
  parentUid: string;
  childUids: string[];
  period: BillingPeriod;
  seatLimit: number;
  amountAgorot: number;
  status: 'pending' | 'paid';
  provider: string;
  processId: string;
  processToken: string;
}

export interface Subscription {
  id: string;
  payerParentUid: string;
  childUids: string[];
  seatLimit: number;
  period: BillingPeriod;
  status: SubscriptionStatus;
  periodEnd: number;
  amountAgorot: number;
  provider: string;
  recurringRef: string | null;
  billing: string;
  lastRemovalAt: number;
  lastSwapAt: number;
  createdAt: number;
  /** Firestore's version, for optimistic writes */
  updateTime?: string;
}

const str = (value: PlainValue | undefined) => (typeof value === 'string' ? value : '');
const num = (value: PlainValue | undefined) => (typeof value === 'number' ? value : 0);
const strings = (value: PlainValue | undefined) => (Array.isArray(value) ? value : []);

export function readCheckout(doc: PlainDocument | null): Checkout | null {
  if (!doc) return null;
  const f = doc.fields;
  if (!isBillingPeriod(f.period) || (f.status !== 'pending' && f.status !== 'paid')) return null;
  return {
    id: doc.id,
    parentUid: str(f.parentUid),
    childUids: strings(f.childUids),
    period: f.period,
    seatLimit: num(f.seatLimit),
    amountAgorot: num(f.amountAgorot),
    status: f.status,
    provider: str(f.provider),
    processId: str(f.processId),
    processToken: str(f.processToken),
  };
}

export function readSubscription(doc: PlainDocument | null): Subscription | null {
  if (!doc) return null;
  const f = doc.fields;
  const status = f.status;
  if (!isBillingPeriod(f.period) || (status !== 'active' && status !== 'past_due' && status !== 'canceled')) return null;
  return {
    id: doc.id,
    payerParentUid: str(f.payerParentUid),
    childUids: strings(f.childUids),
    seatLimit: num(f.seatLimit),
    period: f.period,
    status,
    periodEnd: num(f.periodEnd),
    amountAgorot: num(f.amountAgorot),
    provider: str(f.provider),
    recurringRef: str(f.recurringRef) || null,
    billing: str(f.billing),
    lastRemovalAt: num(f.lastRemovalAt),
    lastSwapAt: num(f.lastSwapAt),
    createdAt: num(f.createdAt),
    ...(doc.updateTime ? { updateTime: doc.updateTime } : {}),
  };
}

export function subscriptionFields(sub: Subscription, nowMs: number): Record<string, PlainValue> {
  return {
    payerParentUid: sub.payerParentUid,
    childUids: sub.childUids,
    seatLimit: sub.seatLimit,
    period: sub.period,
    status: sub.status,
    periodEnd: sub.periodEnd,
    amountAgorot: sub.amountAgorot,
    provider: sub.provider,
    recurringRef: sub.recurringRef,
    billing: sub.billing,
    lastRemovalAt: sub.lastRemovalAt,
    lastSwapAt: sub.lastSwapAt,
    createdAt: sub.createdAt,
    updatedAt: nowMs,
  };
}

/** The learner's entitlement while they hold a seat (or `canceled` after they left it, Pro until periodEnd). */
export function entitlementFields(sub: Subscription, nowMs: number, status: SubscriptionStatus = sub.status): Record<string, PlainValue> {
  return {
    plan: 'pro',
    status,
    source: 'subscription',
    billingPeriod: sub.period,
    periodEnd: sub.periodEnd,
    payerParentUid: sub.payerParentUid,
    subscriptionId: sub.id,
    provider: sub.provider,
    updatedAt: nowMs,
  };
}

/** `ms` plus whole calendar months (UTC), clamped to the month's last day (Jan 31 + 1 month = Feb 28/29). */
export function addPeriods(ms: number, period: BillingPeriod, count = 1): number {
  const date = new Date(ms);
  const months = MONTHS_PER_PERIOD[period] * count;
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  target.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
  return target.getTime();
}

/** Whether a child's entitlement is a live subscription seat (so a second plan for them is refused). */
export function holdsLiveSeat(doc: PlainDocument | null, nowMs: number, exceptSubscriptionId = ''): boolean {
  if (!doc) return false;
  const f = doc.fields;
  if (f.status !== 'active' && f.status !== 'past_due') return false;
  if (exceptSubscriptionId && f.subscriptionId === exceptSubscriptionId) return false;
  return num(f.periodEnd) + PRO_GRACE_DAYS * DAY_MS > nowMs;
}

export type SeatChange =
  | { ok: true; sub: Subscription; amountChanged: boolean }
  | { ok: false; status: number; error: string };

const refuse = (status: number, error: string): SeatChange => ({ ok: false, status, error });

const isLive = (sub: Subscription) => sub.status === 'active' || sub.status === 'past_due';

/**
 * Puts a child into a seat. Monthly plans move to the price for the new count (from the next
 * charge); yearly plans only fill seats already paid for. A child added within the swap
 * cooldown after another child left counts as a swap: at most one per SEAT_SWAP_COOLDOWN_DAYS.
 */
export function addChildToSubscription(sub: Subscription, childUid: string, nowMs: number): SeatChange {
  if (!isLive(sub)) return refuse(409, 'This plan is not active');
  if (sub.childUids.includes(childUid)) return refuse(409, 'This child already has a seat');
  const children = sub.childUids.length + 1;
  const cooldownMs = SEAT_SWAP_COOLDOWN_DAYS * DAY_MS;
  const isSwap = sub.lastRemovalAt > 0 && nowMs - sub.lastRemovalAt < cooldownMs;
  if (isSwap && sub.lastSwapAt > 0 && nowMs - sub.lastSwapAt < cooldownMs) {
    return refuse(429, 'A child can be swapped once every 30 days');
  }
  let seatLimit = sub.seatLimit;
  let amountAgorot = sub.amountAgorot;
  if (sub.period === 'monthly') {
    const price = proPriceAgorot(children, 'monthly');
    if (price === null) return refuse(409, 'The plan is full');
    seatLimit = children;
    amountAgorot = price;
  } else if (children > sub.seatLimit) {
    return refuse(409, 'A yearly plan needs a new payment for more children');
  }
  const next: Subscription = {
    ...sub,
    childUids: [...sub.childUids, childUid],
    seatLimit,
    amountAgorot,
    lastSwapAt: isSwap ? nowMs : sub.lastSwapAt,
  };
  return { ok: true, sub: next, amountChanged: amountAgorot !== sub.amountAgorot };
}

/** Frees a child's seat (they keep Pro for a while). Monthly plans get the lower price from the next charge. */
export function removeChildFromSubscription(sub: Subscription, childUid: string, nowMs: number): SeatChange {
  if (!isLive(sub)) return refuse(409, 'This plan is not active');
  if (!sub.childUids.includes(childUid)) return refuse(404, 'This child has no seat on the plan');
  const childUids = sub.childUids.filter((uid) => uid !== childUid);
  if (childUids.length === 0) return refuse(409, 'Cancel the plan instead');
  let seatLimit = sub.seatLimit;
  let amountAgorot = sub.amountAgorot;
  if (sub.period === 'monthly') {
    seatLimit = childUids.length;
    amountAgorot = proPriceAgorot(childUids.length, 'monthly') ?? sub.amountAgorot;
  }
  const next: Subscription = { ...sub, childUids, seatLimit, amountAgorot, lastRemovalAt: nowMs };
  return { ok: true, sub: next, amountChanged: amountAgorot !== sub.amountAgorot };
}
