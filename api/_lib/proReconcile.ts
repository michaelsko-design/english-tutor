/**
 * The daily Pro reconcile (docs/feature-pro-tier.md, "Phase 3a"): what each plan and entitlement
 * needs once a day. Pure functions only; `api/pro-reconcile.ts` does the reading and writing.
 * - A plan or seat whose Pro ended (grace days included) becomes `expired`. A monthly plan still
 *   `active` after its end means a renewal webhook went missing: it is reported, never expired.
 * - A deleted learner's seat is freed (a monthly plan's price drops, or the plan is canceled when no
 *   child is left), and a deleted payer's monthly plan stops renewing.
 */
import { proPriceAgorot } from '../../src/config/proTier.js';
import type { PlainDocument } from './firestoreAdmin.js';
import { isLapsed, type Subscription } from './proBilling.js';

export interface PlanRepair {
  next: Subscription;
  /** What the gateway must change first (monthly plans that still renew only) */
  gateway: { cancel: true } | { amountAgorot: number } | null;
}

const renews = (sub: Subscription) => sub.period === 'monthly' && (sub.status === 'active' || sub.status === 'past_due');

/** Frees the seats of deleted learners and stops a deleted payer's renewals; null when nothing changes. */
export function repairForDeletedAccounts(sub: Subscription, missingUids: ReadonlySet<string>): PlanRepair | null {
  if (sub.status === 'expired') return null;
  const childUids = sub.childUids.filter((uid) => !missingUids.has(uid));
  const isPayerGone = missingUids.has(sub.payerParentUid);
  const hasLostSeats = childUids.length < sub.childUids.length;
  if (!hasLostSeats && !(isPayerGone && renews(sub))) return null;

  if (!renews(sub)) {
    // A yearly or canceled plan was paid already: the seats only empty
    return { next: { ...sub, childUids }, gateway: null };
  }
  if (isPayerGone || childUids.length === 0) {
    return { next: { ...sub, childUids, status: 'canceled' }, gateway: { cancel: true } };
  }
  const amountAgorot = proPriceAgorot(childUids.length, 'monthly') ?? sub.amountAgorot;
  const next = { ...sub, childUids, seatLimit: childUids.length, amountAgorot };
  return { next, gateway: amountAgorot === sub.amountAgorot ? null : { amountAgorot } };
}

export type LapseCheck = 'expire' | 'missed_renewal' | null;

/** A plan past its end and grace days: expire it, or report a monthly plan that should have renewed. */
export function checkLapse(sub: Subscription, nowMs: number): LapseCheck {
  if (sub.status === 'expired' || !isLapsed(sub.periodEnd, nowMs)) return null;
  return sub.period === 'monthly' && sub.status === 'active' ? 'missed_renewal' : 'expire';
}

export type EntitlementAction = 'delete' | 'expire' | null;

/** A deleted learner's entitlement goes; one whose Pro ended is marked expired. */
export function entitlementAction(doc: PlainDocument, missingUids: ReadonlySet<string>, nowMs: number): EntitlementAction {
  if (missingUids.has(doc.id)) return 'delete';
  const { status, periodEnd } = doc.fields;
  if (status === 'expired' || typeof periodEnd !== 'number') return null;
  return isLapsed(periodEnd, nowMs) ? 'expire' : null;
}
