/**
 * Whether a Google account on this device is a parent account or a learner's, remembered per uid so
 * the app opens on the right screen without asking Firestore at every start. Device only.
 */
export type AccountRole = 'parent' | 'learner';

const keyFor = (uid: string) => `english_tutor_account_role_${uid}`;

export function readAccountRole(uid: string): AccountRole | null {
  try {
    const value = window.localStorage.getItem(keyFor(uid));
    return value === 'parent' || value === 'learner' ? value : null;
  } catch {
    return null;
  }
}

export function writeAccountRole(uid: string, role: AccountRole | null): void {
  try {
    if (role) window.localStorage.setItem(keyFor(uid), role);
    else window.localStorage.removeItem(keyFor(uid));
  } catch {
    // Storage blocked (private mode): the role is looked up again at the next start
  }
}
