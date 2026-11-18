/**
 * `gatewayTasks/{id}` (server only): work the owner does by hand in Grow's dashboard when the gateway
 * can't do it for us (Grow through Make can't change or cancel a standing order). The owner dashboard
 * lists the open ones (`api/owner-stats.ts`) and marks them done.
 * Ids are fixed per plan and kind, so a newer amount change replaces an older open one.
 */
import type { DocumentWrite, FirestoreAdmin, PlainDocument, PlainValue } from './firestoreAdmin.js';
import type { RecurringChange } from './payments/provider.js';
import type { Subscription } from './proBilling.js';

export type GatewayTaskKind = 'cancel' | 'amount' | 'refund' | 'match_renewal' | 'extend';

const KINDS: readonly GatewayTaskKind[] = ['cancel', 'amount', 'refund', 'match_renewal', 'extend'];
export const GATEWAY_TASK_ID_PATTERN = /^[A-Za-z0-9_-]{1,140}$/;

export interface Payer {
  payerName: string;
  payerPhone: string;
  payerEmail: string;
}

export interface GatewayTask extends Payer {
  id: string;
  kind: GatewayTaskKind;
  subscriptionId: string;
  /** The new monthly amount (`amount`), or the charge to refund (`refund`, `match_renewal`) */
  amountAgorot: number;
  /** `amount` only: what Grow still charges (the price before the first change not yet made); 0 = unknown */
  chargedAgorot?: number;
  /** What to do before this time (the plan's next charge); 0 when there's no deadline */
  dueAt: number;
  note: string;
  createdAt: number;
  doneAt: number;
}

export type NewGatewayTask = Omit<GatewayTask, 'createdAt' | 'doneAt'>;

const EMPTY_PAYER: Payer = { payerName: '', payerPhone: '', payerEmail: '' };

const str = (value: PlainValue | undefined) => (typeof value === 'string' ? value : '');
const num = (value: PlainValue | undefined) => (typeof value === 'number' ? value : 0);

export function gatewayTaskWrite(task: NewGatewayTask, nowMs: number): DocumentWrite {
  return {
    collection: 'gatewayTasks',
    id: task.id,
    fields: {
      kind: task.kind,
      subscriptionId: task.subscriptionId,
      amountAgorot: task.amountAgorot,
      chargedAgorot: task.chargedAgorot ?? 0,
      dueAt: task.dueAt,
      note: task.note,
      payerName: task.payerName,
      payerPhone: task.payerPhone,
      payerEmail: task.payerEmail,
      createdAt: nowMs,
      doneAt: 0,
    },
  };
}

export function readGatewayTask(doc: PlainDocument): GatewayTask | null {
  const f = doc.fields;
  const kind = KINDS.find((value) => value === f.kind);
  if (!kind) return null;
  return {
    id: doc.id,
    kind,
    subscriptionId: str(f.subscriptionId),
    amountAgorot: num(f.amountAgorot),
    chargedAgorot: num(f.chargedAgorot),
    dueAt: num(f.dueAt),
    note: str(f.note),
    payerName: str(f.payerName),
    payerPhone: str(f.payerPhone),
    payerEmail: str(f.payerEmail),
    createdAt: num(f.createdAt),
    doneAt: num(f.doneAt),
  };
}

/** The payer's details from the checkout that started the plan (subscription id = checkout id) */
export async function readPayer(admin: FirestoreAdmin, subscriptionId: string): Promise<Payer> {
  const checkout = await admin.getDocument('checkouts', subscriptionId);
  if (!checkout) return EMPTY_PAYER;
  return { payerName: str(checkout.fields.payerName), payerPhone: str(checkout.fields.payerPhone), payerEmail: str(checkout.fields.payerEmail) };
}

/** The task for a standing-order change the gateway can't make: cancel it, or charge a new amount */
export function recurringChangeTask(sub: Subscription, change: RecurringChange, payer: Payer): NewGatewayTask {
  const base = { subscriptionId: sub.id, dueAt: sub.periodEnd, ...payer };
  if (change.cancel) {
    return { ...base, id: `${sub.id}_cancel`, kind: 'cancel', amountAgorot: 0, note: 'Cancel the standing order in Grow' };
  }
  const amountAgorot = change.amountAgorot ?? sub.amountAgorot;
  return { ...base, id: `${sub.id}_amount`, kind: 'amount', amountAgorot, note: 'Change the standing order amount from the next charge' };
}

const amountTaskId = (subscriptionId: string) => `${subscriptionId}_amount`;

/** Marks a task done without the owner (nothing is left to do in Grow); merge-only, so no alert is sent */
const closeTaskWrite = (id: string, nowMs: number): DocumentWrite => ({
  collection: 'gatewayTasks',
  id,
  mergeFields: ['doneAt'],
  fields: { doneAt: nowMs },
});

async function openAmountTask(admin: FirestoreAdmin, subscriptionId: string): Promise<GatewayTask | null> {
  const doc = await admin.getDocument('gatewayTasks', amountTaskId(subscriptionId));
  const task = doc ? readGatewayTask(doc) : null;
  return task && task.doneAt === 0 ? task : null;
}

/**
 * The owner's tasks when a standing order must change and the gateway can't change it (Make):
 * - cancel: the cancel task, and any open amount task is closed (there is nothing left to re-price);
 * - a new amount: Grow still charges what it charged before the first change not yet made in Grow
 *   (kept on the open task). A price back at that amount closes the open task instead of asking the
 *   owner to "change" the standing order to what it already charges.
 * `before` is the plan as Grow last saw it changed; `after` the plan with the new seats.
 */
export async function manualRecurringWrites(
  admin: FirestoreAdmin,
  before: Subscription,
  after: Subscription,
  change: RecurringChange,
  nowMs: number
): Promise<DocumentWrite[]> {
  const open = await openAmountTask(admin, before.id);
  if (change.cancel) {
    const task = recurringChangeTask(after, change, await readPayer(admin, before.id));
    return [gatewayTaskWrite(task, nowMs), ...(open ? [closeTaskWrite(open.id, nowMs)] : [])];
  }
  const amountAgorot = change.amountAgorot ?? after.amountAgorot;
  const chargedAgorot = open ? open.chargedAgorot ?? 0 : before.amountAgorot;
  if (chargedAgorot === amountAgorot) return open ? [closeTaskWrite(open.id, nowMs)] : [];
  const task = recurringChangeTask(after, { amountAgorot }, await readPayer(admin, before.id));
  return [gatewayTaskWrite({ ...task, chargedAgorot }, nowMs)];
}

/**
 * Charges left in the current standing order, after `chargesMade` (the first payment included), when
 * each one makes `limit` charges and the owner extends it by another `limit` each time.
 */
export function chargesLeft(chargesMade: number, limit: number): number {
  return limit - (chargesMade % limit);
}

/**
 * The task to extend a standing order that has one charge left. One per round (`_extend_<n>`), so a
 * done task never comes back. Due by the last charge (`sub.periodEnd`, after this renewal).
 */
export function extendTask(sub: Subscription, chargesMade: number, limit: number, payer: Payer): NewGatewayTask {
  const round = Math.floor(chargesMade / limit) + 1;
  return {
    id: `${sub.id}_extend_${round}`,
    kind: 'extend',
    subscriptionId: sub.id,
    amountAgorot: sub.amountAgorot,
    dueAt: sub.periodEnd,
    note: `The standing order has one charge left: add ${limit} more charges to it in Grow`,
    ...payer,
  };
}

/** Open tasks first by deadline; done ones are left out */
export function openGatewayTasks(docs: PlainDocument[]): GatewayTask[] {
  return docs
    .map(readGatewayTask)
    .filter((task): task is GatewayTask => task !== null && task.doneAt === 0)
    .sort((a, b) => (a.dueAt || Number.MAX_SAFE_INTEGER) - (b.dueAt || Number.MAX_SAFE_INTEGER) || a.createdAt - b.createdAt);
}
