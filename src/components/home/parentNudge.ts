/**
 * Whether this device has closed the "invite a parent" card for a learner. Device only, not
 * synced: on another device the card shows once more. The card never blocks anything.
 */
const keyFor = (uid: string) => `english_tutor_parent_nudge_dismissed_${uid}`;

export function isParentNudgeDismissed(uid: string): boolean {
  try {
    return window.localStorage.getItem(keyFor(uid)) === '1';
  } catch {
    return false;
  }
}

export function dismissParentNudge(uid: string): void {
  try {
    window.localStorage.setItem(keyFor(uid), '1');
  } catch {
    // Storage blocked (private mode): the card may show again next visit, which is harmless
  }
}
