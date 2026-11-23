import { isIosDevice, isStandalone } from './pushSubscription';

/**
 * iPhone and iPad can receive the reminder only in the app added to the Home Screen. The install guide
 * ends with "open it from the Home Screen and turn the reminder on", so the first time the installed
 * app opens on this device, the full-screen ask comes up once. A per-device flag: the install is per
 * device, so it is not a profile field.
 */
const askedKey = (uid: string) => `english_tutor_reminder_installed_ask_${uid}`;

export function isInstalledAppAskDue(uid: string): boolean {
  if (!isIosDevice(navigator.userAgent) || !isStandalone()) return false;
  try {
    return window.localStorage.getItem(askedKey(uid)) !== '1';
  } catch {
    // No storage (private mode): don't ask, so it can't come back on every open
    return false;
  }
}

export function markInstalledAppAsked(uid: string): void {
  try {
    window.localStorage.setItem(askedKey(uid), '1');
  } catch {
    // Not saved: isInstalledAppAskDue also reads nothing next time, and says no
  }
}
