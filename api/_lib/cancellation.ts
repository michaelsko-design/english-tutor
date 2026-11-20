/**
 * What cancelling a Pro plan gives back (docs/legal/pro-legal-drafts.md, terms §9; legal audit
 * TOS-17/18/19, REF-02/04). Pure functions; api/subscription.ts reads, quotes and writes.
 * - Within FULL_REFUND_DAYS of the payment, once per family: the whole payment back, Pro closes now.
 * - A yearly plan after that: paid − (months started, this one included × the regular monthly price),
 *   never below 0; with a refund, Pro closes at the end of the current plan month.
 * - A monthly plan after that: no more charges, Pro until the end of the paid month.
 * `refundRequests/{subscriptionId}` (server only) records each request, so one plan is refunded once
 * and a family's full refund can be found.
 */
import { proPriceAgorot } from '../../src/config/proTier.js';
import type { PlainDocument } from './firestoreAdmin.js';
import { addPeriods, type Subscription } from './proBilling.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** The cancellation window with a full refund (Consumer Protection Law §14ג) */
export const FULL_REFUND_DAYS = 14;

export type CancelMode = 'full_refund' | 'yearly_prorata' | 'monthly_end' | 'none';

export interface CancelQuote {
  mode: CancelMode;
  /** What is refunded, in agorot (0 when nothing) */
  refundAgorot: number;
  /** Pro stays on until this time (ms) */
  accessUntil: number;
  /** Why nothing can be done here (`none` only) */
  reason?: 'not_live' | 'already_requested';
}

/** The first moment of the year a yearly plan covers (a renewal's year starts at the old end) */
export function yearlyPlanStart(sub: Pick<Subscription, 'periodEnd'>): number {
  return addPeriods(sub.periodEnd, 'yearly', -1);
}

/** Plan months begun by `nowMs`, the current one included; 0 before the plan starts */
export function monthsStarted(startMs: number, nowMs: number): number {
  if (nowMs < startMs) return 0;
  let months = 1;
  while (addPeriods(startMs, 'monthly', months) <= nowMs) months += 1;
  return months;
}

/** The yearly refund after the full-refund window: paid − months started × the regular monthly price */
export function yearlyProrataRefund(paidAgorot: number, seats: number, months: number): number {
  const monthly = proPriceAgorot(seats, 'monthly') ?? 0;
  return Math.max(0, paidAgorot - months * monthly);
}

export interface QuoteInput {
  sub: Subscription;
  /** What this plan's payment was (the checkout that started it) */
  paidAgorot: number;
  nowMs: number;
  /** A refund request already exists for this plan */
  hasRequest: boolean;
  /** This family already had a full refund on another plan */
  hasUsedFullRefund: boolean;
}

export function quoteCancellation({ sub, paidAgorot, nowMs, hasRequest, hasUsedFullRefund }: QuoteInput): CancelQuote {
  const isOver = sub.status === 'expired' || sub.periodEnd <= nowMs;
  if (isOver) return { mode: 'none', refundAgorot: 0, accessUntil: sub.periodEnd, reason: 'not_live' };
  if (hasRequest) return { mode: 'none', refundAgorot: 0, accessUntil: sub.periodEnd, reason: 'already_requested' };
  const isInWindow = nowMs - sub.createdAt <= FULL_REFUND_DAYS * DAY_MS;
  // A yearly renewal starts at the old end: refunding it must not take the year already paid before it
  const yearStart = sub.period === 'yearly' ? yearlyPlanStart(sub) : sub.createdAt;
  if (isInWindow && !hasUsedFullRefund) {
    return { mode: 'full_refund', refundAgorot: paidAgorot, accessUntil: Math.max(nowMs, Math.min(yearStart, sub.periodEnd)) };
  }
  if (sub.period === 'monthly') {
    // A monthly plan already cancelled has nothing more to stop
    if (sub.status === 'canceled') return { mode: 'none', refundAgorot: 0, accessUntil: sub.periodEnd, reason: 'not_live' };
    return { mode: 'monthly_end', refundAgorot: 0, accessUntil: sub.periodEnd };
  }
  const months = monthsStarted(yearStart, nowMs);
  const refundAgorot = yearlyProrataRefund(paidAgorot, sub.seatLimit, months);
  // Before the renewed year begins (0 months), Pro runs to its start: the year before it was paid separately
  const accessUntil = refundAgorot > 0 ? Math.min(sub.periodEnd, addPeriods(yearStart, 'monthly', months)) : sub.periodEnd;
  return { mode: 'yearly_prorata', refundAgorot, accessUntil };
}

/** The document that holds a family's one full refund: its create-once precondition stops two at the same time */
export const familyRefundId = (parentUid: string): string => `family_${parentUid}`;

/** Whether one of this parent's refund requests was a full refund (the once-per-family rule) */
export function hasFullRefund(requests: readonly PlainDocument[]): boolean {
  return requests.some((doc) => doc.fields.mode === 'full_refund');
}
