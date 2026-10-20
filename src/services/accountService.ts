import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  deleteUser,
  linkWithCredential,
  linkWithPopup,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updateProfile,
} from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { LearnerProfile } from '../types/learner';
import { normalizeIdentifierToEmail, toUsernameSlug, usernameFromEmail } from '../utils/username';

/**
 * Account-level actions for the settings: deleting the account with all of its data, exporting
 * the data, and saving a guest account under Google or a username + PIN (same uid, so nothing
 * moves). Every call returns a typed result with a Hebrew error.
 */

export type AccountResult = { ok: true } | { ok: false; errorHe: string };

function describeAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'הקוד הסודי לא נכון.';
  if (code === 'auth/email-already-in-use' || code === 'auth/credential-already-in-use') {
    return 'שם המשתמש הזה כבר תפוס. כדאי לבחור שם אחר.';
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'החלון נסגר לפני סיום הפעולה.';
  if (code === 'auth/popup-blocked') return 'הדפדפן חסם את החלון הקופץ. כדאי לאשר חלונות קופצים ולנסות שוב.';
  if (code === 'auth/weak-password') return 'הקוד הסודי צריך לפחות 6 תווים.';
  if (code === 'auth/network-request-failed' || code === 'unavailable') return 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.';
  return 'משהו השתבש. כדאי לנסות שוב.';
}

/** How the signed-in account proves it is its owner before it is deleted. */
export type AccountKind = 'guest' | 'google' | 'password';

export function getAccountKind(user: User): AccountKind {
  if (user.isAnonymous) return 'guest';
  return user.providerData.some((p) => p.providerId === 'password') ? 'password' : 'google';
}

async function reauthenticate(user: User, pin: string): Promise<void> {
  const kind = getAccountKind(user);
  if (kind === 'password' && user.email) {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, pin));
  } else if (kind === 'google' && googleProvider) {
    await reauthenticateWithPopup(user, googleProvider);
  }
}

/** Deletes every document of the learner, the documents shared with friends included. */
async function deleteLearnerData(user: User, friendCode: string | undefined): Promise<void> {
  if (!db) return;
  const uid = user.uid;
  const shared = await Promise.all(
    ['friendships', 'contests'].map((name) => getDocs(query(collection(db!, name), where('uids', 'array-contains', uid))))
  );
  await Promise.all(shared.flatMap((snapshot) => snapshot.docs.map((d) => deleteDoc(d.ref))));

  const ownedCode = (await getDoc(doc(db, 'friendCodeOwners', uid))).data()?.code as string | undefined;
  for (const code of new Set([friendCode, ownedCode].filter(Boolean) as string[])) {
    const codeRef = doc(db, 'friendCodes', code);
    const codeDoc = await getDoc(codeRef);
    if (codeDoc.exists() && codeDoc.data().uid === uid) await deleteDoc(codeRef);
  }
  const username = usernameFromEmail(user.email);
  if (username) {
    const nameRef = doc(db, 'usernames', toUsernameSlug(username));
    if ((await getDoc(nameRef)).exists()) await deleteDoc(nameRef);
  }
  await Promise.all([
    deleteDoc(doc(db, 'friendCodeOwners', uid)),
    deleteDoc(doc(db, 'publicProfiles', uid)),
    deleteDoc(doc(db, 'learners', uid)),
  ]);
}

/**
 * Deletes the signed-in account: first proves it is the owner (the PIN, or Google again), so a
 * stale sign-in can't fail halfway, then deletes all of its data and the sign-in itself.
 */
export async function deleteAccount(friendCode: string | undefined, pin: string): Promise<AccountResult> {
  const user = auth?.currentUser;
  if (!user) return { ok: false, errorHe: 'צריך להיות מחוברים לחשבון.' };
  try {
    await reauthenticate(user, pin);
    await deleteLearnerData(user, friendCode);
    await deleteUser(user);
    return { ok: true };
  } catch (error) {
    return { ok: false, errorHe: describeAuthError(error) };
  }
}

/** The learner's data as a JSON file the browser downloads (no server involved). */
export function downloadProfileJson(profile: LearnerProfile): void {
  const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `englishvibe-${(profile.name || 'learner').replace(/[^\p{L}\p{N}_-]+/gu, '_')}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Keeps a guest's progress by adding Google sign-in to the same account. */
export async function saveGuestWithGoogle(): Promise<AccountResult> {
  const user = auth?.currentUser;
  if (!user?.isAnonymous || !googleProvider) return { ok: false, errorHe: 'אפשר לשמור רק חשבון אורח.' };
  try {
    await linkWithPopup(user, googleProvider as GoogleAuthProvider);
    return { ok: true };
  } catch (error) {
    return { ok: false, errorHe: describeAuthError(error) };
  }
}

export function hasGoogleLinked(user: User): boolean {
  return user.providerData.some((p) => p.providerId === 'google.com');
}

/**
 * Adds Google sign-in to the signed-in username + PIN account (same uid, so nothing moves and
 * the progress stays). Lets a learner who forgets the PIN still get back in with Google.
 */
export async function linkGoogleToAccount(): Promise<AccountResult> {
  const user = auth?.currentUser;
  if (!user || user.isAnonymous || !googleProvider) return { ok: false, errorHe: 'צריך להיות מחוברים לחשבון.' };
  if (hasGoogleLinked(user)) return { ok: true };
  try {
    await linkWithPopup(user, googleProvider as GoogleAuthProvider);
    return { ok: true };
  } catch (error) {
    const code = (error as { code?: string })?.code || '';
    if (code === 'auth/credential-already-in-use' || code === 'auth/email-already-in-use') {
      return { ok: false, errorHe: 'חשבון Google הזה כבר מחובר לחשבון אחר. כדאי לבחור חשבון Google אחר.' };
    }
    return { ok: false, errorHe: describeAuthError(error) };
  }
}

/** Keeps a guest's progress by adding a username + PIN sign-in to the same account. */
export async function saveGuestWithUsername(identifier: string, pin: string, name: string): Promise<AccountResult> {
  const user = auth?.currentUser;
  if (!user?.isAnonymous) return { ok: false, errorHe: 'אפשר לשמור רק חשבון אורח.' };
  if (!identifier.trim()) return { ok: false, errorHe: 'צריך לבחור שם משתמש באנגלית.' };
  if (pin.trim().length < 6) return { ok: false, errorHe: 'הקוד הסודי צריך לפחות 6 תווים.' };
  try {
    const credential = EmailAuthProvider.credential(normalizeIdentifierToEmail(identifier), pin.trim());
    const linked = await linkWithCredential(user, credential);
    if (name.trim()) await updateProfile(linked.user, { displayName: name.trim() });
    return { ok: true };
  } catch (error) {
    return { ok: false, errorHe: describeAuthError(error) };
  }
}
