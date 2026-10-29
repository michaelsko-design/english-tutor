import { describe, expect, it, vi } from 'vitest';
import { handleStreakReminderRequest } from './streak-reminder';
import type { FirestoreAdmin, PlainDocument } from './_lib/firestoreAdmin';

const ENV = {
  CRON_SECRET: 'cron-secret',
  FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'a@b.c', private_key: 'k' }),
  VITE_VAPID_PUBLIC_KEY: 'pub',
  VAPID_PRIVATE_KEY: 'priv',
};
// Tuesday 2026-10-27, 14:00 Israel time (UTC+2 after the clocks went back)
const NOW_MS = Date.UTC(2026, 9, 27, 12, 0);

function subscription(id: string, overrides: Record<string, string | number | boolean> = {}): PlainDocument {
  return {
    id,
    fields: {
      endpoint: `https://fcm.googleapis.com/fcm/send/${id}`,
      p256dh: 'p',
      auth: 'a',
      streakDays: 4,
      streakLastDateStr: '2026-10-26',
      isShabbatObserver: false,
      gender: 'girl',
      ...overrides,
    },
  };
}

function setup(docs: PlainDocument[], sendPush = vi.fn().mockResolvedValue(undefined)) {
  const deleteDocument = vi.fn().mockResolvedValue(undefined);
  const commit = vi.fn().mockResolvedValue(undefined);
  const admin = { listDocuments: vi.fn().mockResolvedValue(docs), deleteDocument, commit } as unknown as FirestoreAdmin;
  const run = (headers: Record<string, string> = { authorization: 'Bearer cron-secret' }) =>
    handleStreakReminderRequest(new Request('https://x/api/streak-reminder', { headers }), ENV, {
      nowMs: () => NOW_MS,
      createAdmin: () => admin,
      sendPush,
    });
  return { run, sendPush, deleteDocument, commit };
}

describe('streak-reminder cron', () => {
  it('rejects a request without the cron secret', async () => {
    const { run, sendPush } = setup([subscription('u1')]);
    expect((await run({})).status).toBe(401);
    expect(sendPush).not.toHaveBeenCalled();
  });

  it('pushes to everyone who has not practised today, with the right message', async () => {
    const { run, sendPush } = setup([
      subscription('due'),
      subscription('broken', { streakLastDateStr: '2026-10-20' }),
      subscription('practised', { streakLastDateStr: '2026-10-27' }),
    ]);
    const response = await run();
    expect(await response.json()).toEqual({ sent: 2, removed: 0, failed: 0 });
    const bodyOf = (id: string) =>
      JSON.parse(sendPush.mock.calls.find(([target]) => target.endpoint.endsWith(id))![1]).body as string;
    expect(sendPush.mock.calls.map(([target]) => target.endpoint)).not.toContain('https://fcm.googleapis.com/fcm/send/practised');
    expect(bodyOf('/due')).toContain('המשיכי');
    expect(bodyOf('/broken')).toContain('5 דקות');
  });

  it('logs each send for the owner dashboard and survives a logging failure', async () => {
    const { run, commit } = setup([subscription('due'), subscription('broken', { streakLastDateStr: '2026-10-20' })]);
    commit.mockRejectedValueOnce(new Error('down'));
    expect(await (await run()).json()).toEqual({ sent: 2, removed: 0, failed: 0 });
    expect(commit).toHaveBeenCalledWith([
      { collection: 'reminderSends', id: '2026-10-27_broken', fields: { uid: 'broken', dateStr: '2026-10-27', kind: 'comeback' } },
    ]);
  });

  it('deletes a subscription the push service says is gone', async () => {
    const sendPush = vi.fn().mockRejectedValue({ statusCode: 410 });
    const { run, deleteDocument } = setup([subscription('gone')], sendPush);
    expect(await (await run()).json()).toEqual({ sent: 0, removed: 1, failed: 0 });
    expect(deleteDocument).toHaveBeenCalledWith('pushSubscriptions', 'gone');
  });

  it('counts other push failures without deleting', async () => {
    const sendPush = vi.fn().mockRejectedValue({ statusCode: 500 });
    const { run, deleteDocument } = setup([subscription('flaky')], sendPush);
    expect(await (await run()).json()).toEqual({ sent: 0, removed: 0, failed: 1 });
    expect(deleteDocument).not.toHaveBeenCalled();
  });

  it('never sends to an endpoint that is not a known push service', async () => {
    const { run, sendPush } = setup([
      subscription('ok'),
      subscription('tarpit', { endpoint: 'https://tarpit.example/hang' }),
      subscription('lookalike', { endpoint: 'https://fcm.googleapis.com.evil.example/x' }),
    ]);
    expect(await (await run()).json()).toEqual({ sent: 1, removed: 0, failed: 0 });
    expect(sendPush.mock.calls.map(([target]) => target.endpoint)).toEqual(['https://fcm.googleapis.com/fcm/send/ok']);
  });
});
