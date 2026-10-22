import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createProfileSaveQueue } from './profileSaveQueue';
import { LearnerProfile } from '../types/learner';

const profile = (name: string) => ({ name }) as LearnerProfile;

describe('createProfileSaveQueue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('saves only the latest profile of a burst, once, after the pause', async () => {
    const save = vi.fn(async () => {});
    const queue = createProfileSaveQueue(save, 1000, () => {});
    queue.schedule('uid', profile('a'));
    queue.schedule('uid', profile('b'));
    vi.advanceTimersByTime(999);
    expect(save).not.toHaveBeenCalled();
    queue.schedule('uid', profile('c'));
    vi.advanceTimersByTime(1000);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('uid', profile('c'));
  });

  it('saves at once on flush (the app was hidden or closed)', () => {
    const save = vi.fn(async () => {});
    const queue = createProfileSaveQueue(save, 1000, () => {});
    queue.schedule('uid', profile('a'));
    queue.flush();
    expect(save).toHaveBeenCalledWith('uid', profile('a'));
    vi.advanceTimersByTime(2000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('flush resolves once the save is done, so a sign-out can wait for it', async () => {
    const order: string[] = [];
    const save = vi.fn(async () => {
      await Promise.resolve();
      order.push('saved');
    });
    const queue = createProfileSaveQueue(save, 1000, () => {});
    queue.schedule('uid', profile('a'));

    await queue.flush();
    order.push('after flush');

    expect(order).toEqual(['saved', 'after flush']);
  });

  it('flush resolves even when the save fails', async () => {
    const queue = createProfileSaveQueue(async () => Promise.reject(new Error('offline')), 1000, () => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    queue.schedule('uid', profile('a'));

    await expect(queue.flush()).resolves.toBeUndefined();
  });

  it('flush also waits for a save that is already on its way', async () => {
    let finishSave = () => {};
    const save = vi.fn(() => new Promise<void>((resolve) => (finishSave = resolve)));
    const queue = createProfileSaveQueue(save, 1000, () => {});
    queue.schedule('uid', profile('a'));
    vi.advanceTimersByTime(1000);
    let isFlushed = false;

    const flushed = queue.flush().then(() => (isFlushed = true));
    await Promise.resolve();
    expect(isFlushed).toBe(false);
    finishSave();
    await flushed;

    expect(isFlushed).toBe(true);
  });

  it('holds new saves while an account is being deleted, and keeps them if it is not', () => {
    const save = vi.fn(async () => {});
    const queue = createProfileSaveQueue(save, 1000, () => {});
    queue.hold();
    queue.schedule('uid', profile('a'));
    vi.advanceTimersByTime(2000);
    void queue.flush();
    expect(save).not.toHaveBeenCalled();

    queue.release();
    vi.advanceTimersByTime(1000);

    expect(save).toHaveBeenCalledWith('uid', profile('a'));
  });

  it('discard drops the held save of a deleted account and saves normally again', () => {
    const save = vi.fn(async () => {});
    const queue = createProfileSaveQueue(save, 1000, () => {});
    queue.hold();
    queue.schedule('uid', profile('a'));

    queue.discard();
    vi.advanceTimersByTime(2000);
    expect(save).not.toHaveBeenCalled();
    queue.schedule('other', profile('b'));
    vi.advanceTimersByTime(1000);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('other', profile('b'));
  });

  it('does nothing on flush when nothing is waiting', () => {
    const save = vi.fn(async () => {});
    createProfileSaveQueue(save, 1000, () => {}).flush();
    expect(save).not.toHaveBeenCalled();
  });

  it('reports syncing, then synced or the error', async () => {
    vi.useRealTimers();
    const statuses: string[] = [];
    const save = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(Object.assign(new Error('x'), { code: 'unavailable' }));
    const queue = createProfileSaveQueue(save, 0, (status) => statuses.push(status));
    queue.schedule('uid', profile('a'));
    queue.flush();
    await vi.waitFor(() => expect(statuses).toEqual(['syncing', 'synced']));
    queue.schedule('uid', profile('b'));
    queue.flush();
    await vi.waitFor(() => expect(statuses).toEqual(['syncing', 'synced', 'syncing', 'offline-error']));
  });
});
