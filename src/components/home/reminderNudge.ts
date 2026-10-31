/**
 * Whether this device has closed the "turn on the daily reminder" card for a learner. Device only,
 * not synced: the card never blocks anything and the same switch is always in the settings.
 */
const keyFor = (uid: string) => `english_tutor_reminder_nudge_dismissed_${uid}`;

export function isReminderNudgeDismissed(uid: string): boolean {
  try {
    return window.localStorage.getItem(keyFor(uid)) === '1';
  } catch {
    return false;
  }
}

export function dismissReminderNudge(uid: string): void {
  try {
    window.localStorage.setItem(keyFor(uid), '1');
  } catch {
    // Storage blocked (private mode): the card may show again next visit, which is harmless
  }
}
