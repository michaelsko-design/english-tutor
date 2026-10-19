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
