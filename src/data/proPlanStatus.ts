import { MAX_PRO_SEATS, YEARLY_RENEW_NOTICE_DAYS, proPriceAgorot, type BillingPeriod } from '../config/proTier';
import { isPro, type Entitlement } from './proGate';

/**
 * What the parent portal shows on each child's Pro card (docs/feature-pro-tier.md, "Phase 2"),
 * from the children's entitlements. Only the paying parent gets the plan's controls; any other
 * linked parent sees the status alone.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type ChildProStatus =
  | { kind: 'free' }
  | { kind: 'comp' }
  | {
      kind: 'plan';
      subscriptionId: string;
      period: BillingPeriod;
      /** Pro until this time (ms) */
      periodEnd: number;
      /** A monthly plan that will charge again (not cancelled) */
      isRenewing: boolean;
      isPastDue: boolean;
      /** Holds a seat (not a child who left the plan and keeps Pro for a while) */
      hasSeat: boolean;
      /** Taken off a plan that goes on for the other children */
      hasLeftPlan: boolean;
      /** This parent pays for it, so the controls are theirs */
      isPayer: boolean;
      /** Paying parent, yearly plan, in its last days: offer a renewal checkout */
      shouldOfferRenewal: boolean;
      /** The child can leave the plan (another child stays on it) */
      canRemove: boolean;
    };

/** Seats a paying parent can still fill on a live plan, and the monthly price once one more child joins */
export interface OpenPlan {
  subscriptionId: string;
  period: BillingPeriod;
  /** Monthly: the new monthly price with one more child; yearly: null (the seat is paid for) */
  nextMonthlyAgorot: number | null;
}

type Entitlements = Readonly<Record<string, Entitlement | null | undefined>>;

const isLiveSeat = (entitlement: Entitlement, nowMs: number) =>
  (entitlement.status === 'active' || entitlement.status === 'past_due') && isPro(entitlement, nowMs);

/** The children seated on a plan (live seats only), e.g. for a renewal checkout of all of them */
export function childrenOnSamePlan(subscriptionId: string, entitlements: Entitlements, nowMs: number): string[] {
  return Object.entries(entitlements)
    .filter(([, e]) => e && e.source === 'subscription' && e.subscriptionId === subscriptionId && isLiveSeat(e, nowMs))
    .map(([uid]) => uid);
}

const childrenOnPlan = (subscriptionId: string, entitlements: Entitlements, nowMs: number) =>
  childrenOnSamePlan(subscriptionId, entitlements, nowMs).length;

export function getChildProStatus(
  entitlement: Entitlement | null | undefined,
  parentUid: string,
  entitlements: Entitlements,
  nowMs: number
): ChildProStatus {
  if (!entitlement || !isPro(entitlement, nowMs)) return { kind: 'free' };
  if (entitlement.source !== 'subscription' || !entitlement.subscriptionId || !entitlement.billingPeriod) return { kind: 'comp' };
  const period = entitlement.billingPeriod;
  const isPayer = entitlement.payerParentUid === parentUid;
  // A child who left a plan keeps Pro for a while as `canceled`, with no seat to manage
  const hasSeat = isLiveSeat(entitlement, nowMs);
  const isNearEnd = entitlement.periodEnd - nowMs <= YEARLY_RENEW_NOTICE_DAYS * DAY_MS;
  return {
    kind: 'plan',
    subscriptionId: entitlement.subscriptionId,
    period,
    periodEnd: entitlement.periodEnd,
    isRenewing: period === 'monthly' && hasSeat,
    isPastDue: entitlement.status === 'past_due',
    hasSeat,
    hasLeftPlan: !hasSeat && childrenOnPlan(entitlement.subscriptionId, entitlements, nowMs) > 0,
    isPayer,
    shouldOfferRenewal: isPayer && hasSeat && period === 'yearly' && isNearEnd,
    canRemove: isPayer && hasSeat && childrenOnPlan(entitlement.subscriptionId, entitlements, nowMs) > 1,
  };
}

/**
 * The paying parent's live plan that a free child can join, if any: a monthly plan under the most
 * seats (its price goes up a band), or a yearly plan with a paid seat left.
 */
export function findOpenPlan(parentUid: string, entitlements: Entitlements, nowMs: number): OpenPlan | null {
  for (const entitlement of Object.values(entitlements)) {
    if (!entitlement || entitlement.source !== 'subscription' || entitlement.payerParentUid !== parentUid) continue;
    if (!entitlement.subscriptionId || !entitlement.billingPeriod || entitlement.status !== 'active') continue;
    if (!isLiveSeat(entitlement, nowMs)) continue;
    const seated = childrenOnPlan(entitlement.subscriptionId, entitlements, nowMs);
    if (entitlement.billingPeriod === 'monthly' && seated < MAX_PRO_SEATS) {
      return { subscriptionId: entitlement.subscriptionId, period: 'monthly', nextMonthlyAgorot: proPriceAgorot(seated + 1, 'monthly') };
    }
    if (entitlement.billingPeriod === 'yearly' && seated < (entitlement.seatLimit ?? seated)) {
      return { subscriptionId: entitlement.subscriptionId, period: 'yearly', nextMonthlyAgorot: null };
    }
  }
  return null;
}

/** A child a new checkout can include: free, left a plan, or on this parent's yearly plan near its end */
export const canJoinCheckout = (status: ChildProStatus | undefined): boolean =>
  status?.kind === 'free' || (status?.kind === 'plan' && (!status.hasSeat || status.shouldOfferRenewal));
