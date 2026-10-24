import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import {
  ParentInvite,
  ParentLink,
  ReportSnapshot,
  generateParentCode,
  getInviteExpiry,
  isInviteExpired,
  isParentCode,
  normalizeParentCode,
  parentLinkId,
} from '../data/parentLink';

/**
 * Firestore access for the optional parent features (see data/parentLink.ts and firestore.rules).
 * Learner side: a one-time parent code, the paired parents and the report snapshot. Parent side:
 * claiming a code, the paired children and their snapshots. Calls return typed results with a
 * Hebrew error; none of it is needed for the learner app to work.
 */

export type ParentResult<T = void> = { ok: true; value: T } | { ok: false; errorHe: string };

const GENERIC_ERROR_HE = 'משהו השתבש. כדאי לנסות שוב.';
const OFFLINE_ERROR_HE = 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.';
const MAX_CODE_ATTEMPTS = 3;
const MAX_NAME_LENGTH = 24;

function describeError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  return code === 'unavailable' || code === 'network-request-failed' ? OFFLINE_ERROR_HE : GENERIC_ERROR_HE;
}

const activeCodeKey = (uid: string) => `english_tutor_parent_code_${uid}`;

function readActiveCode(uid: string): string | null {
  try {
    return localStorage.getItem(activeCodeKey(uid));
  } catch {
    return null;
  }
}

function saveActiveCode(uid: string, code: string | null): void {
  try {
    if (code) localStorage.setItem(activeCodeKey(uid), code);
    else localStorage.removeItem(activeCodeKey(uid));
  } catch {
    // Without storage the learner just makes a new code next time
  }
}

/** A valid code the learner can still hand out, or null. */
export async function getActiveParentInvite(uid: string, now: Date = new Date()): Promise<{ code: string; invite: ParentInvite } | null> {
  const code = readActiveCode(uid);
  if (!db || !code) return null;
  try {
    const snap = await getDoc(doc(db, 'parentInvites', code));
    const invite = snap.exists() ? (snap.data() as ParentInvite) : null;
    if (invite && invite.childUid === uid && !isInviteExpired(invite, now)) return { code, invite };
  } catch {
    // Offline: the learner can make a new code
  }
  return null;
}

/** Makes a new parent code (replacing the previous one) for the signed-in learner. */
export async function createParentInvite(
  uid: string,
  childName: string,
  childAvatar: string,
  now: Date = new Date()
): Promise<ParentResult<{ code: string; invite: ParentInvite }>> {
  if (!db) return { ok: false, errorHe: GENERIC_ERROR_HE };
  const invite: ParentInvite = {
    childUid: uid,
    childName: childName.trim().slice(0, MAX_NAME_LENGTH) || 'לומד/ת',
    childAvatar,
    expiresAtMs: getInviteExpiry(now),
  };
  try {
    const previous = readActiveCode(uid);
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
      const code = generateParentCode();
      try {
        await setDoc(doc(db, 'parentInvites', code), invite);
      } catch (error) {
        // A code already taken by someone else is refused like any write: try another one
        if ((error as { code?: string })?.code === 'permission-denied' && attempt < MAX_CODE_ATTEMPTS - 1) continue;
        throw error;
      }
      saveActiveCode(uid, code);
      if (previous && previous !== code) await deleteDoc(doc(db, 'parentInvites', previous)).catch(() => {});
      return { ok: true, value: { code, invite } };
    }
    return { ok: false, errorHe: GENERIC_ERROR_HE };
  } catch (error) {
    return { ok: false, errorHe: describeError(error) };
  }
}

export async function withdrawParentInvite(uid: string): Promise<void> {
  const code = readActiveCode(uid);
  saveActiveCode(uid, null);
  if (db && code) await deleteDoc(doc(db, 'parentInvites', code)).catch(() => {});
}

async function listLinks(field: 'childUid' | 'parentUid', uid: string): Promise<ParentLink[]> {
  if (!db) return [];
  const snapshot = await getDocs(query(collection(db, 'parentLinks'), where(field, '==', uid)));
  return snapshot.docs.map((d) => d.data() as ParentLink).sort((a, b) => a.linkedAt.localeCompare(b.linkedAt));
}

/** The parents paired with a learner. */
export function listParentsOfChild(childUid: string): Promise<ParentLink[]> {
  return listLinks('childUid', childUid);
}

/** The learners paired with a parent. */
export function listChildrenOfParent(parentUid: string): Promise<ParentLink[]> {
  return listLinks('parentUid', parentUid);
}

export async function unlinkParent(link: Pick<ParentLink, 'parentUid' | 'childUid'>): Promise<ParentResult> {
  if (!db) return { ok: false, errorHe: GENERIC_ERROR_HE };
  try {
    await deleteDoc(doc(db, 'parentLinks', parentLinkId(link.parentUid, link.childUid)));
    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, errorHe: describeError(error) };
  }
}

/** Marks the signed-in Google account as a parent account (so the learner app can tell). */
export async function markParentAccount(uid: string, now: Date = new Date()): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'parents', uid);
  if (!(await getDoc(ref)).exists()) await setDoc(ref, { createdAt: now.toISOString() });
}

export async function isParentAccount(uid: string): Promise<boolean> {
  if (!db) return false;
  return (await getDoc(doc(db, 'parents', uid))).exists();
}

/** Whether the account has a learner profile, so it can't also be a parent account. */
export async function hasLearnerProfile(uid: string): Promise<boolean> {
  if (!db) return false;
  return (await getDoc(doc(db, 'learners', uid))).exists();
}

/** A parent claims a code: the link is created and the one-time code deleted in the same write. */
export async function claimParentCode(
  parentUid: string,
  rawCode: string,
  now: Date = new Date()
): Promise<ParentResult<ParentLink>> {
  const code = normalizeParentCode(rawCode);
  if (!db || !isParentCode(code)) return { ok: false, errorHe: 'הקוד לא נראה תקין. כדאי לבדוק אותו עם הילד או הילדה.' };
  try {
    const inviteRef = doc(db, 'parentInvites', code);
    const snap = await getDoc(inviteRef);
    const invite = snap.exists() ? (snap.data() as ParentInvite) : null;
    if (!invite || isInviteExpired(invite, now)) {
      return { ok: false, errorHe: 'הקוד לא נמצא או שפג תוקפו. אפשר לבקש קוד חדש בהגדרות של האפליקציה.' };
    }
    if (invite.childUid === parentUid) return { ok: false, errorHe: 'אי אפשר לחבר חשבון לעצמו.' };
    const link: ParentLink = {
      parentUid,
      childUid: invite.childUid,
      childName: invite.childName,
      childAvatar: invite.childAvatar,
      inviteCode: code,
      linkedAt: now.toISOString(),
    };
    const batch = writeBatch(db);
    batch.set(doc(db, 'parentLinks', parentLinkId(parentUid, invite.childUid)), link);
    batch.delete(inviteRef);
    await batch.commit();
    return { ok: true, value: link };
  } catch (error) {
    return { ok: false, errorHe: describeError(error) };
  }
}

export async function publishReportSnapshot(uid: string, snapshot: ReportSnapshot): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'reportSnapshots', uid), snapshot);
}

export async function loadReportSnapshot(childUid: string): Promise<ReportSnapshot | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'reportSnapshots', childUid));
  return snap.exists() ? (snap.data() as ReportSnapshot) : null;
}

/** Removes everything the learner has for parents (account deletion). */
export async function deleteLearnerParentData(uid: string): Promise<void> {
  if (!db) return;
  const links = await listLinks('childUid', uid);
  await Promise.all(links.map((link) => deleteDoc(doc(db!, 'parentLinks', parentLinkId(link.parentUid, uid)))));
  const code = readActiveCode(uid);
  if (code) await deleteDoc(doc(db, 'parentInvites', code)).catch(() => {});
  saveActiveCode(uid, null);
  await deleteDoc(doc(db, 'reportSnapshots', uid));
}

/** Removes a parent account's links and marker (the parent's own account deletion). */
export async function deleteParentAccountData(uid: string): Promise<void> {
  if (!db) return;
  const links = await listLinks('parentUid', uid);
  await Promise.all(links.map((link) => deleteDoc(doc(db!, 'parentLinks', parentLinkId(uid, link.childUid)))));
  await deleteDoc(doc(db, 'parents', uid));
}

/** Who a code belongs to, shown to the parent before they confirm. */
export async function previewParentCode(rawCode: string, now: Date = new Date()): Promise<ParentResult<ParentInvite>> {
  const code = normalizeParentCode(rawCode);
  if (!db || !isParentCode(code)) return { ok: false, errorHe: 'הקוד לא נראה תקין. כדאי לבדוק אותו עם הילד או הילדה.' };
  try {
    const snap = await getDoc(doc(db, 'parentInvites', code));
    const invite = snap.exists() ? (snap.data() as ParentInvite) : null;
    if (!invite || isInviteExpired(invite, now)) {
      return { ok: false, errorHe: 'הקוד לא נמצא או שפג תוקפו. אפשר לבקש קוד חדש בהגדרות של האפליקציה.' };
    }
    return { ok: true, value: invite };
  } catch (error) {
    return { ok: false, errorHe: describeError(error) };
  }
}
