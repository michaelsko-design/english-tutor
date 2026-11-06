import { beforeEach, describe, expect, it, vi } from 'vitest';

const setDocMock = vi.fn().mockResolvedValue(undefined);
vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, collection: string, id: string) => `${collection}/${id}`,
  increment: (n: number) => ({ inc: n }),
  serverTimestamp: () => 'ts',
  setDoc: (...args: unknown[]) => setDocMock(...args),
}));

import { createAnalytics } from './analyticsService';
import { createErrorReporter, errorKey, scrubErrorText } from './errorReporter';

const fakeDb = {} as never;

function makeAnalytics(day = '2026-11-06') {
  const timers: Array<() => void> = [];
  const analytics = createAnalytics({
    getDb: () => fakeDb,
    today: () => day,
    setTimer: (fn) => timers.push(fn),
    clearTimer: () => undefined,
  });
  return { analytics, timers };
}

describe('analytics service', () => {
  beforeEach(() => setDocMock.mockClear());

  it('batches repeated events into one increment write', async () => {
    const { analytics } = makeAnalytics();
    analytics.setContext({ uid: 'u1', gradeId: 'grade-3' });
    analytics.track('mission_finish');
    analytics.track('mission_finish');
    analytics.track('session_start');
    await analytics.flush();
    expect(setDocMock).toHaveBeenCalledTimes(1);
    const [path, data, options] = setDocMock.mock.calls[0];
    expect(path).toBe('analyticsDaily/2026-11-06_u1');
    expect(data).toEqual({
      uid: 'u1',
      day: '2026-11-06',
      gradeId: 'grade-3',
      counts: { mission_finish: { inc: 2 }, session_start: { inc: 1 } },
    });
    expect(options).toEqual({ merge: true });
  });

  it('drops unknown events and events before a learner is set', async () => {
    const { analytics } = makeAnalytics();
    analytics.track('mission_finish');
    analytics.setContext({ uid: 'u1', gradeId: 'grade-3' });
    analytics.track('typed_text_secret');
    await analytics.flush();
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it('flushes the old learner when the context changes', () => {
    const { analytics } = makeAnalytics();
    analytics.setContext({ uid: 'u1', gradeId: 'grade-3' });
    analytics.track('session_start');
    analytics.setContext(null);
    expect(setDocMock).toHaveBeenCalledTimes(1);
    expect(setDocMock.mock.calls[0][0]).toBe('analyticsDaily/2026-11-06_u1');
  });

  it('survives a failed write', async () => {
    setDocMock.mockRejectedValueOnce(new Error('offline'));
    const { analytics } = makeAnalytics();
    analytics.setContext({ uid: 'u1', gradeId: 'grade-3' });
    analytics.track('session_start');
    await expect(analytics.flush()).resolves.toBeUndefined();
  });
});

describe('error reporter', () => {
  beforeEach(() => setDocMock.mockClear());

  it('scrubs urls, emails and long numbers', () => {
    const text = scrubErrorText('fail at https://x.co/a?t=1 for a@b.com id 123456789', 200);
    expect(text).toBe('fail at <url> for <email> id <n>');
  });

  it('reports one error kind once per session and needs a signed-in user', async () => {
    let uid: string | null = null;
    const report = createErrorReporter({ getDb: () => fakeDb, getUid: () => uid, today: () => '2026-11-06', appVersion: 'test' });
    await report(new Error('boom'), 'render');
    expect(setDocMock).not.toHaveBeenCalled();
    uid = 'u1';
    const error = new Error('boom');
    await report(error, 'render');
    await report(error, 'render');
    expect(setDocMock).toHaveBeenCalledTimes(1);
    expect(setDocMock.mock.calls[0][0]).toBe(`clientErrors/2026-11-06_${errorKey('boom', error.stack ?? '')}`);
  });
});
