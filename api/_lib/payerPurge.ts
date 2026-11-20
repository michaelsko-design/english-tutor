/**
 * The payer's name, phone and email are kept only to handle cancellations, standing-order changes
 * and refunds. The privacy notice promises to delete them within 90 days of the plan's end and its
 * handling, so the daily reconcile blanks them on `checkouts` and `gatewayTasks` once:
 *  - the plan ended (canceled or expired) more than 90 days ago, or, for a checkout never paid, it
 *    was opened more than 90 days ago, and
 *  - no owner task for that plan is still open (a refund still needs the contact details).
 * Payment records (`payments`) hold no contact details and stay for tax law. Legal audit PRIV-13.
 */
import type { DocumentWrite, PlainDocument } from './firestoreAdmin.js';
import type { GatewayTask } from './gatewayTasks.js';
import type { Subscription } from './proBilling.js';

export const PAYER_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const PAYER_FIELDS = ['payerName', 'payerPhone', 'payerEmail'] as const;

const hasPayerDetails = (fields: Record<string, unknown>): boolean =>
  PAYER_FIELDS.some((name) => typeof fields[name] === 'string' && fields[name] !== '');

const blankPayer = (collection: string, id: string): DocumentWrite => ({
  collection,
  id,
  mergeFields: [...PAYER_FIELDS],
  fields: { payerName: '', payerPhone: '', payerEmail: '' },
});

/** The plan ended long enough ago (a plan still running, or past due, never is) */
function isPlanPastRetention(sub: Subscription, nowMs: number): boolean {
  const hasEnded = sub.status === 'canceled' || sub.status === 'expired';
  return hasEnded && nowMs - sub.periodEnd > PAYER_RETENTION_MS;
}

function isCheckoutPastRetention(doc: PlainDocument, sub: Subscription | undefined, nowMs: number): boolean {
  if (sub) return isPlanPastRetention(sub, nowMs);
  // No plan: never paid (or the plan record is gone), counted from when the checkout was opened
  const openedAt = typeof doc.fields.createdAt === 'number' ? doc.fields.createdAt : 0;
  return openedAt > 0 && nowMs - openedAt > PAYER_RETENTION_MS;
}

function isTaskPastRetention(task: GatewayTask, sub: Subscription | undefined, nowMs: number): boolean {
  if (task.doneAt <= 0) return false;
  if (sub) return isPlanPastRetention(sub, nowMs);
  // A charge matched to no plan: counted from when the owner handled it
  return nowMs - task.doneAt > PAYER_RETENTION_MS;
}

export function payerPurgeWrites(
  checkouts: readonly PlainDocument[],
  tasks: readonly GatewayTask[],
  subscriptions: readonly Subscription[],
  nowMs: number
): DocumentWrite[] {
  const plans = new Map(subscriptions.map((sub) => [sub.id, sub]));
  const plansInHand = new Set(tasks.filter((task) => task.doneAt <= 0 && task.subscriptionId).map((task) => task.subscriptionId));
  const checkoutWrites = checkouts
    .filter((doc) => hasPayerDetails(doc.fields) && !plansInHand.has(doc.id))
    .filter((doc) => isCheckoutPastRetention(doc, plans.get(doc.id), nowMs))
    .map((doc) => blankPayer('checkouts', doc.id));
  const taskWrites = tasks
    .filter((task) => hasPayerDetails({ ...task }) && !plansInHand.has(task.subscriptionId))
    .filter((task) => isTaskPastRetention(task, plans.get(task.subscriptionId), nowMs))
    .map((task) => blankPayer('gatewayTasks', task.id));
  return [...checkoutWrites, ...taskWrites];
}
