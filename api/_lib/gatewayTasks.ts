/**
 * `gatewayTasks/{id}` (server only): work the owner does by hand in Grow's dashboard when the gateway
 * can't do it for us (Grow through Make can't change or cancel a standing order). The owner dashboard
 * lists the open ones (`api/owner-stats.ts`) and marks them done.
 * Ids are fixed per plan and kind, so a newer amount change replaces an older open one.
 */
import type { DocumentWrite, FirestoreAdmin, PlainDocument, PlainValue } from './firestoreAdmin.js';
import type { RecurringChange } from './payments/provider.js';
import type { Subscription } from './proBilling.js';

export type GatewayTaskKind = 'cancel' | 'amount' | 'refund' | 'match_renewal';

const KINDS: readonly GatewayTaskKind[] = ['cancel', 'amount', 'refund', 'match_renewal'];
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

/** Open tasks first by deadline; done ones are left out */
export function openGatewayTasks(docs: PlainDocument[]): GatewayTask[] {
  return docs
    .map(readGatewayTask)
    .filter((task): task is GatewayTask => task !== null && task.doneAt === 0)
    .sort((a, b) => (a.dueAt || Number.MAX_SAFE_INTEGER) - (b.dueAt || Number.MAX_SAFE_INTEGER) || a.createdAt - b.createdAt);
}
