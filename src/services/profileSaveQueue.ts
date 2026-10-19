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

  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    if (!pending) return;
    const { uid, profile } = pending;
    pending = null;
    save(uid, profile)
      .then(() => onStatus('synced'))
      .catch((error: unknown) => {
        console.warn('Saving the profile failed:', (error as { code?: string })?.code ?? error);
        onStatus('offline-error');
      });
  };

  return {
    schedule(uid: string, profile: LearnerProfile) {
      // Another account's waiting save goes out first
      if (pending && pending.uid !== uid) flush();
      pending = { uid, profile };
      onStatus('syncing');
      clearTimeout(timer);
      timer = setTimeout(flush, delayMs);
    },
    flush,
  };
}
