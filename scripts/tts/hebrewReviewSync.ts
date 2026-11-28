/**
 * Takes the marks made on the phone into hebrewReview.json, the only authority, and sends the whole
 * file back to the online page. A PC undo needs nothing special: the next push no longer has the mark.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { clipPath, fingerprintFile, loadState, saveState, type ReviewDirs } from './hebrewReviewState';
import { markTime, withEntry, type InboxItem, type ReviewState } from './reviewMarks';

export interface MarksClient {
  getInbox(): Promise<InboxItem[]>;
  putMarks(state: ReviewState): Promise<void>;
  clearInbox(items: readonly Pick<InboxItem, 'key' | 'markedAt'>[]): Promise<void>;
}

export interface DroppedMark {
  key: string;
  /** changed: the PC's clip is not the one that was heard. older: the PC's mark is newer. */
  why: 'changed' | 'older';
}

export interface ApplyResult {
  state: ReviewState;
  applied: number;
  dropped: DroppedMark[];
}

/**
 * A phone mark counts only for the audio the PC has now, and only over an older mark (a mark on
 * replaced audio is no mark at all).
 */
export function applyInbox(state: ReviewState, items: readonly InboxItem[], currentFp: (key: string) => string | null): ApplyResult {
  return items.reduce<ApplyResult>(
    (result, { key, entry, fp, markedAt }) => {
      const heard = currentFp(key);
      if (heard !== fp) return { ...result, dropped: [...result.dropped, { key, why: 'changed' }] };
      const current = result.state[key];
      if (current && current.fp === heard && markTime(current) >= markedAt) {
        return { ...result, dropped: [...result.dropped, { key, why: 'older' }] };
      }
      return { ...result, state: withEntry(result.state, key, entry), applied: result.applied + 1 };
    },
    { state, applied: 0, dropped: [] },
  );
}

/** The marks as they were before the phone page first touched them. */
export const syncBackupPath = (dirs: ReviewDirs): string => dirs.statePath.replace(/\.json$/, '.before-sync.json.bak');

export async function syncMarks(client: MarksClient, dirs: ReviewDirs): Promise<ApplyResult> {
  const items = await client.getInbox();
  // No await from here to the save: a mark made on the PC meanwhile is already in the file we read
  if (existsSync(dirs.statePath) && !existsSync(syncBackupPath(dirs))) copyFileSync(dirs.statePath, syncBackupPath(dirs));
  const result = applyInbox(loadState(dirs.statePath), items, (key) => fingerprintFile(clipPath(dirs, key)));
  if (result.applied > 0) saveState(dirs.statePath, result.state);
  await client.putMarks(result.state);
  // Cleared only after the push, so no device ever loses sight of a mark
  if (items.length > 0) await client.clearInbox(items.map(({ key, markedAt }) => ({ key, markedAt })));
  return result;
}

/** One run at a time; requests made during a run are served by a single further run. */
export function createCoalescedRunner(task: () => Promise<void>, onError: (error: unknown) => void): () => Promise<void> {
  let running: Promise<void> | null = null;
  let isAgainWanted = false;
  const drain = async (): Promise<void> => {
    do {
      isAgainWanted = false;
      try {
        await task();
      } catch (error) {
        onError(error);
      }
    } while (isAgainWanted);
    running = null;
  };
  return () => {
    if (running) {
      isAgainWanted = true;
      return running;
    }
    running = drain();
    return running;
  };
}
