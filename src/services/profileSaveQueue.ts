import { CloudSyncStatus, LearnerProfile } from '../types/learner';

/**
 * Batches cloud saves: a burst of changes (placing room items, answering quickly) becomes one
 * write of the latest profile after a short pause, instead of one full-profile write per tap.
 * The app flushes it when it is hidden or closed, so nothing waits behind a closed tab.
 */
export function createProfileSaveQueue(
  save: (uid: string, profile: LearnerProfile) => Promise<void>,
  delayMs: number,
  onStatus: (status: CloudSyncStatus) => void
) {
  let pending: { uid: string; profile: LearnerProfile } | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  /** The saves on their way, one after another; settles when the last one is done (or failed) */
  let inFlight: Promise<void> = Promise.resolve();
  /** While an account is being deleted, no save may go out: it would re-create the profile */
  let isHeld = false;

  /**
   * Saves the waiting profile now. Resolves once every save on its way is done (or failed), so
   * a sign-out after it can't cut one off.
   */
  const flush = (): Promise<void> => {
    clearTimeout(timer);
    timer = undefined;
    if (!pending || isHeld) return inFlight;
    const { uid, profile } = pending;
    pending = null;
    const saved = save(uid, profile)
      .then(() => onStatus('synced'))
      .catch((error: unknown) => {
        console.warn('Saving the profile failed:', (error as { code?: string })?.code ?? error);
        onStatus('offline-error');
      });
    inFlight = Promise.all([inFlight, saved]).then(() => undefined);
    return inFlight;
  };

  const startTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => void flush(), delayMs);
  };

  return {
    schedule(uid: string, profile: LearnerProfile) {
      // Another account's waiting save goes out first
      if (pending && pending.uid !== uid) void flush();
      pending = { uid, profile };
      onStatus('syncing');
      if (!isHeld) startTimer();
    },
    flush,
    /** Keeps changes waiting (unsaved) while the account is being deleted */
    hold() {
      isHeld = true;
      clearTimeout(timer);
      timer = undefined;
    },
    /** The deletion didn't happen: the waiting changes go out as usual */
    release() {
      isHeld = false;
      if (pending) startTimer();
    },
    /** The account is gone: its waiting changes are dropped, and saving works again for the next one */
    discard() {
      isHeld = false;
      pending = null;
      clearTimeout(timer);
      timer = undefined;
    },
  };
}
