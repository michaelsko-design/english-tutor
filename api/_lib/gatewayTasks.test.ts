import { describe, expect, it } from 'vitest';
import { gatewayTaskWrite, openGatewayTasks, readGatewayTask, readPayer, recurringChangeTask } from './gatewayTasks';
import { createFakeFirestore } from './testing/fakeFirestoreAdmin';
import type { Subscription } from './proBilling';

const SUB: Subscription = {
  id: 's'.repeat(32), payerParentUid: 'parent1', childUids: ['kid1'], seatLimit: 1, period: 'monthly', status: 'active',
  periodEnd: 5000, amountAgorot: 3900, provider: 'grow', recurringRef: null, billing: '{}', lastRemovalAt: 0, lastSwapAt: 0, createdAt: 1,
};
const PAYER = { payerName: 'ישראל ישראלי', payerPhone: '0501234567', payerEmail: 'p@example.com' };

describe('recurringChangeTask', () => {
  it('asks to cancel the standing order before the next charge', () => {
    expect(recurringChangeTask(SUB, { cancel: true }, PAYER)).toMatchObject({
      id: `${SUB.id}_cancel`, kind: 'cancel', subscriptionId: SUB.id, dueAt: 5000, ...PAYER,
    });
  });

  it('asks to change the amount, one open task per plan', () => {
    expect(recurringChangeTask(SUB, { amountAgorot: 6400 }, PAYER)).toMatchObject({ id: `${SUB.id}_amount`, kind: 'amount', amountAgorot: 6400 });
  });
});

describe('gateway task records', () => {
  it('round-trips a task and lists open ones by deadline', () => {
    const write = gatewayTaskWrite({ ...recurringChangeTask(SUB, { cancel: true }, PAYER) }, 100);
    expect(write).toMatchObject({ collection: 'gatewayTasks', fields: { kind: 'cancel', createdAt: 100, doneAt: 0 } });
    const doc = { id: write.id, fields: write.fields };
    expect(readGatewayTask(doc)).toMatchObject({ kind: 'cancel', dueAt: 5000, payerPhone: '0501234567' });
    expect(readGatewayTask({ id: 'x', fields: { kind: 'other' } })).toBeNull();

    const later = { id: 'b', fields: { ...write.fields, dueAt: 9000 } };
    const noDeadline = { id: 'c', fields: { ...write.fields, dueAt: 0 } };
    const done = { id: 'd', fields: { ...write.fields, doneAt: 50 } };
    expect(openGatewayTasks([noDeadline, later, done, doc]).map((task) => task.id)).toEqual([doc.id, 'b', 'c']);
  });

  it('reads the payer from the checkout that started the plan', async () => {
    const fake = createFakeFirestore();
    fake.seed('checkouts', SUB.id, { parentUid: 'parent1', ...PAYER });
    expect(await readPayer(fake.admin, SUB.id)).toEqual(PAYER);
    expect(await readPayer(fake.admin, 'missing')).toEqual({ payerName: '', payerPhone: '', payerEmail: '' });
  });
});
