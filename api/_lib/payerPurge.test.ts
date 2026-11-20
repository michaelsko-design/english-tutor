import { describe, expect, it } from 'vitest';
import { PAYER_RETENTION_MS, payerPurgeWrites } from './payerPurge';
import type { GatewayTask } from './gatewayTasks';
import type { Subscription } from './proBilling';
import type { PlainDocument } from './firestoreAdmin';

const NOW = Date.UTC(2027, 5, 1);
const DAY = 24 * 60 * 60 * 1000;
const LONG_AGO = NOW - PAYER_RETENTION_MS - DAY;
const RECENTLY = NOW - PAYER_RETENTION_MS + DAY;
const PAYER = { payerName: 'Dana Cohen', payerPhone: '0521234567', payerEmail: 'dana@example.com' };

const checkout = (id: string, fields: Record<string, unknown> = {}): PlainDocument =>
  ({ id, fields: { status: 'paid', createdAt: LONG_AGO, ...PAYER, ...fields } }) as PlainDocument;

const plan = (id: string, overrides: Partial<Subscription> = {}): Subscription =>
  ({ id, status: 'expired', periodEnd: LONG_AGO, ...overrides }) as Subscription;

const task = (id: string, overrides: Partial<GatewayTask> = {}): GatewayTask => ({
  id, kind: 'cancel', subscriptionId: 's1', amountAgorot: 0, dueAt: 0, note: '', createdAt: LONG_AGO, doneAt: LONG_AGO, ...PAYER, ...overrides,
});

const targets = (writes: ReturnType<typeof payerPurgeWrites>) => writes.map((w) => `${w.collection}/${w.id}`);

describe('payerPurgeWrites', () => {
  it('blanks only the payer fields of a plan that ended more than 90 days ago, and of its done tasks', () => {
    const writes = payerPurgeWrites([checkout('s1')], [task('s1_cancel')], [plan('s1')], NOW);

    expect(targets(writes)).toEqual(['checkouts/s1', 'gatewayTasks/s1_cancel']);
    expect(writes[0]).toMatchObject({ mergeFields: ['payerName', 'payerPhone', 'payerEmail'], fields: { payerName: '', payerPhone: '', payerEmail: '' } });
  });

  it.each([
    ['still running', plan('s1', { status: 'active', periodEnd: LONG_AGO })],
    ['past due', plan('s1', { status: 'past_due', periodEnd: LONG_AGO })],
    ['ended less than 90 days ago', plan('s1', { status: 'canceled', periodEnd: RECENTLY })],
  ])('keeps the details of a plan %s', (_label, sub) => {
    expect(payerPurgeWrites([checkout('s1')], [task('s1_cancel')], [sub], NOW)).toEqual([]);
  });

  it('keeps the details while an owner task for the plan is open (a refund needs them)', () => {
    const open = task('s1_refund_cancel', { kind: 'refund', doneAt: 0 });
    expect(payerPurgeWrites([checkout('s1')], [open, task('s1_cancel')], [plan('s1')], NOW)).toEqual([]);
  });

  it('blanks a checkout never paid once it is 90 days old', () => {
    const old = checkout('c-old', { status: 'pending' });
    const fresh = checkout('c-new', { status: 'pending', createdAt: RECENTLY });
    expect(targets(payerPurgeWrites([old, fresh], [], [], NOW))).toEqual(['checkouts/c-old']);
  });

  it('blanks an unmatched charge task 90 days after the owner handled it, never while open', () => {
    const handled = task('unmatched_renewal_p1', { kind: 'match_renewal', subscriptionId: '', doneAt: LONG_AGO });
    const recent = task('unmatched_renewal_p2', { kind: 'match_renewal', subscriptionId: '', doneAt: RECENTLY });
    const open = task('unmatched_renewal_p3', { kind: 'match_renewal', subscriptionId: '', doneAt: 0 });
    expect(targets(payerPurgeWrites([], [handled, recent, open], [], NOW))).toEqual(['gatewayTasks/unmatched_renewal_p1']);
  });

  it('writes nothing for records already blanked', () => {
    const blank = { payerName: '', payerPhone: '', payerEmail: '' };
    expect(payerPurgeWrites([checkout('s1', blank)], [task('s1_cancel', blank)], [plan('s1')], NOW)).toEqual([]);
  });
});
