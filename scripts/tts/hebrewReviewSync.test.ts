import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clipPath, fingerprintFile, loadState, markClip, saveState, type ReviewDirs } from './hebrewReviewState';
import { applyInbox, createCoalescedRunner, syncBackupPath, syncMarks, type MarksClient } from './hebrewReviewSync';
import type { InboxItem, ReviewState } from './reviewMarks';

let root = '';
let dirs: ReviewDirs;
const fp = (key: string): string => fingerprintFile(clipPath(dirs, key)) as string;
const currentFp = (key: string): string | null => fingerprintFile(clipPath(dirs, key));

const phone = (key: string, status: 'good' | 'regenerate' | null, markedAt: string, heard = fp(key)): InboxItem => ({
  key,
  fp: heard,
  markedAt,
  entry: status && { status, fp: heard, at: markedAt.slice(0, 10), markedAt },
});
const EARLY = '2000-01-01T00:00:00.000Z';
const LATE = '2100-01-01T00:00:00.000Z';

function fakeClient(items: InboxItem[]) {
  const pushed: ReviewState[] = [];
  const cleared: { key: string; markedAt: string }[] = [];
  const client: MarksClient = {
    getInbox: vi.fn(async () => items),
    putMarks: vi.fn(async (state: ReviewState) => void pushed.push(state)),
    clearInbox: vi.fn(async (refs) => void cleared.push(...refs)),
  };
  return { client, pushed, cleared };
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'he-sync-'));
  dirs = { clipDir: join(root, 'clips'), candidateDir: join(root, 'cand'), undoDir: join(root, 'undo'), statePath: join(root, 'review.json') };
  mkdirSync(dirs.clipDir);
  writeFileSync(clipPath(dirs, 'a'), 'audio-a');
  writeFileSync(clipPath(dirs, 'b'), 'audio-b');
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('applyInbox', () => {
  it('takes a phone mark on a clip the PC has not judged', () => {
    const result = applyInbox({}, [phone('a', 'good', LATE)], currentFp);
    expect(result.state.a?.status).toBe('good');
    expect(result.applied).toBe(1);
  });

  it('keeps a PC mark that is newer than the phone mark', () => {
    const state = markClip(dirs, {}, 'a', 'regenerate');
    const result = applyInbox(state, [phone('a', 'good', EARLY)], currentFp);
    expect(result.state.a?.status).toBe('regenerate');
    expect(result.dropped).toEqual([{ key: 'a', why: 'older' }]);
  });

  it('drops a mark given to audio the PC no longer has', () => {
    const heard = fp('a');
    writeFileSync(clipPath(dirs, 'a'), 'audio-a-rerendered');
    const result = applyInbox({}, [phone('a', 'good', LATE, heard)], currentFp);
    expect(result.state).toEqual({});
    expect(result.dropped).toEqual([{ key: 'a', why: 'changed' }]);
  });

  it('takes the phone mark when the PC mark is for older audio, whatever its time', () => {
    const state: ReviewState = { a: { status: 'good', fp: '1-0000000000000000', at: '2100-01-01' } };
    expect(applyInbox(state, [phone('a', 'regenerate', EARLY)], currentFp).state.a?.status).toBe('regenerate');
  });

  it('applies a newer phone undo', () => {
    const state = markClip(dirs, {}, 'a', 'good');
    expect(applyInbox(state, [phone('a', null, LATE)], currentFp).state).toEqual({});
  });
});

describe('syncMarks', () => {
  it('saves phone marks, pushes the whole map, then clears what it handled', async () => {
    saveState(dirs.statePath, markClip(dirs, {}, 'b', 'good'));
    const items = [phone('a', 'good', LATE), phone('b', 'regenerate', EARLY)];
    const { client, pushed, cleared } = fakeClient(items);
    const result = await syncMarks(client, dirs);
    expect(result.applied).toBe(1);
    expect(loadState(dirs.statePath).a?.status).toBe('good');
    expect(Object.keys(pushed[0] as ReviewState).sort()).toEqual(['a', 'b']);
    expect(cleared).toEqual(items.map(({ key, markedAt }) => ({ key, markedAt })));
  });

  it('keeps a mark made on the PC while the inbox was being fetched', async () => {
    const { client } = fakeClient([]);
    client.getInbox = vi.fn(async () => {
      saveState(dirs.statePath, markClip(dirs, {}, 'b', 'good'));
      return [phone('a', 'good', LATE)];
    });
    await syncMarks(client, dirs);
    expect(Object.keys(loadState(dirs.statePath))).toEqual(['a', 'b']);
  });

  it('pushes an undo made on the PC as a plain removal', async () => {
    saveState(dirs.statePath, markClip(dirs, markClip(dirs, {}, 'a', 'good'), 'a', null));
    const { client, pushed } = fakeClient([]);
    await syncMarks(client, dirs);
    expect(pushed[0]).toEqual({});
    expect(client.clearInbox).not.toHaveBeenCalled();
  });

  it('does not clear the inbox when the push fails', async () => {
    const { client } = fakeClient([phone('a', 'good', LATE)]);
    client.putMarks = vi.fn(async () => { throw new Error('offline'); });
    await expect(syncMarks(client, dirs)).rejects.toThrow('offline');
    expect(client.clearInbox).not.toHaveBeenCalled();
    expect(loadState(dirs.statePath).a?.status).toBe('good');
  });

  it('copies the marks file once, before the first sync', async () => {
    const original = markClip(dirs, {}, 'b', 'good');
    saveState(dirs.statePath, original);
    await syncMarks(fakeClient([phone('a', 'good', LATE)]).client, dirs);
    await syncMarks(fakeClient([]).client, dirs);
    expect(loadState(syncBackupPath(dirs))).toEqual(original);
  });

  it('leaves the file alone when nothing changes it', async () => {
    await syncMarks(fakeClient([]).client, dirs);
    expect(existsSync(dirs.statePath)).toBe(false);
  });
});

describe('createCoalescedRunner', () => {
  it('runs one at a time and once more for the requests made meanwhile', async () => {
    const releases: (() => void)[] = [];
    const task = vi.fn(() => new Promise<void>((resolve) => releases.push(resolve)));
    const run = createCoalescedRunner(task, () => {});
    const first = run();
    void run();
    void run();
    expect(task).toHaveBeenCalledTimes(1);
    releases[0]?.();
    await vi.waitFor(() => expect(task).toHaveBeenCalledTimes(2));
    releases[1]?.();
    await first;
    expect(task).toHaveBeenCalledTimes(2);
  });

  it('reports a failure and keeps working', async () => {
    const onError = vi.fn();
    const task = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
    const run = createCoalescedRunner(task, onError);
    await run();
    await run();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(task).toHaveBeenCalledTimes(2);
  });
});
