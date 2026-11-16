import { describe, expect, it, vi } from 'vitest';
import { createOwnerAlerter, withOwnerAlerts } from './ownerAlerts';
import { gatewayTaskWrite, type NewGatewayTask } from './gatewayTasks';
import type { DocumentWrite } from './firestoreAdmin';

const ENV = {
  GROW_MAKE_WEBHOOK_URL: 'https://hook.eu1.make.com/abc123',
  GROW_MAKE_API_KEY: 'make-key',
  APP_ORIGIN: 'https://app.example',
};
const NOW = Date.UTC(2026, 10, 16, 20, 0);
/** 16 December 2026, 10:00 in Israel */
const DUE = Date.UTC(2026, 11, 16, 8, 0);

const TASK: NewGatewayTask = {
  id: 'sub1_cancel',
  kind: 'cancel',
  subscriptionId: 'sub1',
  amountAgorot: 0,
  dueAt: DUE,
  note: 'Cancel the standing order in Grow',
  payerName: 'ישראל ישראלי',
  payerPhone: '0501234567',
  payerEmail: 'parent@example.com',
};

const ok = () => new Response('{"ok":true}', { status: 200, headers: { 'Content-Type': 'application/json' } });

function setup(env: Record<string, string | undefined> = ENV) {
  const fetchImpl = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(async () => ok());
  const committed: DocumentWrite[][] = [];
  const admin = { commit: vi.fn(async (writes: DocumentWrite[]) => void committed.push(writes)), other: 'kept' };
  const alerter = createOwnerAlerter(env, fetchImpl as unknown as typeof fetch);
  const sent = (call = 0) => JSON.parse(String(fetchImpl.mock.calls[call][1].body)) as Record<string, string>;
  return { fetchImpl, admin, alerter, committed, sent, wrapped: withOwnerAlerts(admin, alerter) };
}

describe('withOwnerAlerts', () => {
  it('tells the owner through the Make scenario when a Grow task is saved', async () => {
    const { wrapped, fetchImpl, committed, sent } = setup();

    await wrapped.commit([gatewayTaskWrite(TASK, NOW)]);

    expect(committed).toHaveLength(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0][0]).toBe(ENV.GROW_MAKE_WEBHOOK_URL);
    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({ 'x-make-apikey': 'make-key' });
    expect(sent()).toMatchObject({ action: 'notify', kind: 'cancel', dueDate: '16.12.2026', dashboardUrl: 'https://app.example/?owner' });
    expect(sent().subject).toContain('לבטל הוראת קבע');
    expect(sent().text).toContain('16.12.2026');
    expect(sent().text).toContain('https://app.example/?owner');
  });

  it("never sends the payer's details out", async () => {
    const { wrapped, fetchImpl } = setup();
    await wrapped.commit([gatewayTaskWrite(TASK, NOW)]);
    const body = String(fetchImpl.mock.calls[0][1].body);
    for (const detail of [TASK.payerName, TASK.payerPhone, TASK.payerEmail]) expect(body).not.toContain(detail);
  });

  it('shows the amount of an amount change', async () => {
    const { wrapped, sent } = setup();
    await wrapped.commit([gatewayTaskWrite({ ...TASK, id: 'sub1_amount', kind: 'amount', amountAgorot: 6400 }, NOW)]);
    expect(sent().text).toContain('₪64');
  });

  it('stays quiet for other writes and for a task marked done', async () => {
    const { wrapped, fetchImpl } = setup();
    await wrapped.commit([
      { collection: 'subscriptions', id: 'sub1', fields: { status: 'canceled' } },
      { collection: 'gatewayTasks', id: 'sub1_cancel', mergeFields: ['doneAt'], fields: { doneAt: NOW } },
    ]);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('sends nothing when the commit fails', async () => {
    const { admin, alerter, fetchImpl } = setup();
    admin.commit.mockRejectedValueOnce(new Error('conflict'));
    await expect(withOwnerAlerts(admin, alerter).commit([gatewayTaskWrite(TASK, NOW)])).rejects.toThrow('conflict');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('never fails the request when the alert cannot be sent', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { wrapped, fetchImpl } = setup();
    fetchImpl.mockResolvedValueOnce(new Response('down', { status: 500 }));
    await expect(wrapped.commit([gatewayTaskWrite(TASK, NOW)])).resolves.toBeUndefined();
    fetchImpl.mockRejectedValueOnce(new TypeError('network'));
    await expect(wrapped.commit([gatewayTaskWrite(TASK, NOW)])).resolves.toBeUndefined();
    expect(logged).toHaveBeenCalled();
    logged.mockRestore();
  });

  it('keeps the rest of the admin as it is', () => {
    expect(setup().wrapped.other).toBe('kept');
  });

  it('does nothing without the Make scenario (another gateway)', async () => {
    const { wrapped, fetchImpl, committed } = setup({ APP_ORIGIN: 'https://app.example' });
    await wrapped.commit([gatewayTaskWrite(TASK, NOW)]);
    expect(committed).toHaveLength(1);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('createOwnerAlerter', () => {
  it('marks a reminder for a task still open, and says when there is no deadline', async () => {
    const { alerter, sent } = setup();
    await alerter([{ ...TASK, dueAt: 0, createdAt: NOW, doneAt: 0 }], { reminder: true });
    expect(sent().subject).toMatch(/^תזכורת/);
    expect(sent().dueDate).toBe('');
  });
});
