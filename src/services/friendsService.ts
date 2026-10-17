import {
  FirestoreError,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  FriendLookupEntry,
  FriendshipDoc,
  PublicProfile,
  generateFriendCode,
  getPairId,
  normalizeFriendQuery,
} from '../data/friends';
import { ContestDoc, ContestResult } from '../data/contests';
import { toUsernameSlug, usernameFromEmail } from '../utils/username';

/**
 * Feature 19: Firestore access for the Friends Hub. The data model and who may read or write
 * each document are in firestore.rules. Every call returns a typed result with a Hebrew error.
 */

const FRIEND_CODES = 'friendCodes';
const FRIEND_CODE_OWNERS = 'friendCodeOwners';
const USERNAMES = 'usernames';
const PUBLIC_PROFILES = 'publicProfiles';
const FRIENDSHIPS = 'friendships';
const CODE_CLAIM_ATTEMPTS = 5;

export type ServiceResult<T> = { ok: true; value: T } | { ok: false; errorHe: string };

const NOT_CONFIGURED_HE = 'החיבור לענן לא זמין כרגע.';

function describeError(error: unknown): string {
  const code = (error as FirestoreError | undefined)?.code;
  if (code === 'permission-denied') return 'אין הרשאה לפעולה הזו.';
  if (code === 'unavailable') return 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.';
  return 'משהו השתבש. כדאי לנסות שוב.';
}

async function attempt<T>(action: () => Promise<T>): Promise<ServiceResult<T>> {
  if (!db) return { ok: false, errorHe: NOT_CONFIGURED_HE };
  try {
    return { ok: true, value: await action() };
  } catch (error) {
    return { ok: false, errorHe: describeError(error) };
  }
}

function requireDb() {
  if (!db) throw new Error('Firestore is not configured');
  return db;
}

export interface FriendIdentity {
  uid: string;
  email: string | null;
  displayName: string;
  avatarEmoji: string;
}

/**
 * The learner's friend code: the one recorded in friendCodeOwners (e.g. claimed on another
 * device), or a new one claimed together with that record. Each learner owns exactly one code.
 */
async function claimFriendCode(identity: FriendIdentity): Promise<string> {
  const firestore = requireDb();
  const ownerRef = doc(firestore, FRIEND_CODE_OWNERS, identity.uid);
  const owned = await getDoc(ownerRef);
  if (owned.exists()) return (owned.data() as { code: string }).code;
  for (let i = 0; i < CODE_CLAIM_ATTEMPTS; i++) {
    const code = generateFriendCode();
    const codeRef = doc(firestore, FRIEND_CODES, code);
    const claimed = await runTransaction(firestore, async (tx) => {
      const ownerNow = await tx.get(ownerRef);
      if (ownerNow.exists()) return (ownerNow.data() as { code: string }).code;
      if ((await tx.get(codeRef)).exists()) return null;
      tx.set(codeRef, { uid: identity.uid, displayName: identity.displayName, avatarEmoji: identity.avatarEmoji });
      tx.set(ownerRef, { code });
      return code;
    });
    if (claimed) return claimed;
  }
  throw new Error('No free friend code found');
}

/** Creates or refreshes a lookup entry (friend code or username) for the learner. */
async function upsertLookupEntry(collectionName: string, id: string, identity: FriendIdentity): Promise<void> {
  const ref = doc(requireDb(), collectionName, id);
  const entry = { uid: identity.uid, displayName: identity.displayName, avatarEmoji: identity.avatarEmoji };
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const current = snapshot.data() as FriendLookupEntry;
    if (current.uid === entry.uid && current.displayName === entry.displayName && current.avatarEmoji === entry.avatarEmoji) {
      return;
    }
  }
  // A username left by a deleted account is taken over by the account that now owns its email
  await setDoc(ref, entry);
}

/**
 * Makes sure the learner can be found: claims (or recovers) the friend code, refreshes the name and
 * avatar it shows, and claims the username of a username+PIN account.
 * Returns the friend code to keep on the profile.
 */
export function ensureFriendIdentity(
  identity: FriendIdentity,
  existingCode: string | undefined
): Promise<ServiceResult<string>> {
  return attempt(async () => {
    const code = existingCode || (await claimFriendCode(identity));
    await upsertLookupEntry(FRIEND_CODES, code, identity);
    const username = usernameFromEmail(identity.email);
    if (username) await upsertLookupEntry(USERNAMES, toUsernameSlug(username), identity);
    return code;
  });
}

/**
 * The hub was turned off: the friend code and username stop finding the learner. The code stays
 * the learner's (friendCodeOwners) and comes back when the hub is turned on again.
 */
export function removeLookupEntries(identity: { uid: string; email: string | null }, code: string | undefined): Promise<ServiceResult<void>> {
  return attempt(async () => {
    const firestore = requireDb();
    if (code) {
      const codeRef = doc(firestore, FRIEND_CODES, code);
      if ((await getDoc(codeRef)).exists()) await deleteDoc(codeRef);
    }
    const username = usernameFromEmail(identity.email);
    if (username) {
      const nameRef = doc(firestore, USERNAMES, toUsernameSlug(username));
      if ((await getDoc(nameRef)).exists()) await deleteDoc(nameRef);
    }
  });
}

export function publishPublicProfile(uid: string, profile: PublicProfile): Promise<ServiceResult<void>> {
  return attempt(() =>
    setDoc(doc(requireDb(), PUBLIC_PROFILES, uid), { ...profile, updatedAt: new Date().toISOString() })
  );
}

/** Hides the learner's progress from friends (the hub was turned off). */
export function removePublicProfile(uid: string): Promise<ServiceResult<void>> {
  return attempt(() => deleteDoc(doc(requireDb(), PUBLIC_PROFILES, uid)));
}

export interface FriendLookupMatch {
  entry: FriendLookupEntry;
  via: 'code' | 'username';
}

/**
 * Finds learners by friend code and by username. A username can look like a code, so both are
 * looked up and every match is returned, labelled, rather than letting one hide the other.
 */
export function lookupFriend(input: string): Promise<ServiceResult<FriendLookupMatch[]>> {
  return attempt(async () => {
    const { code, usernameSlug } = normalizeFriendQuery(input);
    const firestore = requireDb();
    const [byCode, byName] = await Promise.all([
      code ? getDoc(doc(firestore, FRIEND_CODES, code)) : Promise.resolve(null),
      usernameSlug ? getDoc(doc(firestore, USERNAMES, usernameSlug)) : Promise.resolve(null),
    ]);
    const matches: FriendLookupMatch[] = [];
    if (byName?.exists()) matches.push({ entry: byName.data() as FriendLookupEntry, via: 'username' });
    if (byCode?.exists()) {
      const entry = byCode.data() as FriendLookupEntry;
      if (!matches.some((m) => m.entry.uid === entry.uid)) matches.push({ entry, via: 'code' });
    }
    return matches;
  });
}

export function sendFriendRequest(
  me: FriendIdentity,
  target: FriendLookupEntry
): Promise<ServiceResult<void>> {
  return attempt(() =>
    setDoc(doc(requireDb(), FRIENDSHIPS, getPairId(me.uid, target.uid)), {
      uids: [me.uid, target.uid],
      requesterUid: me.uid,
      requesterName: me.displayName,
      requesterAvatar: me.avatarEmoji,
      addresseeName: target.displayName,
      addresseeAvatar: target.avatarEmoji,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
  );
}

export function acceptFriendRequest(friendshipId: string): Promise<ServiceResult<void>> {
  return attempt(() =>
    updateDoc(doc(requireDb(), FRIENDSHIPS, friendshipId), {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    })
  );
}

/** Cancels a sent request, declines a received one, or removes a friend. */
export function deleteFriendship(friendshipId: string): Promise<ServiceResult<void>> {
  return attempt(() => deleteDoc(doc(requireDb(), FRIENDSHIPS, friendshipId)));
}

export function sendReaction(friendshipId: string, myUid: string, emoji: string): Promise<ServiceResult<void>> {
  return attempt(() =>
    updateDoc(doc(requireDb(), FRIENDSHIPS, friendshipId), {
      [`reactions.${myUid}`]: { emoji, at: new Date().toISOString() },
    })
  );
}

/** Live list of the learner's friendship documents (friends and pending requests). */
export function subscribeFriendships(
  uid: string,
  onChange: (docs: FriendshipDoc[]) => void,
  onError: (errorHe: string) => void
): () => void {
  if (!db) {
    onError(NOT_CONFIGURED_HE);
    return () => undefined;
  }
  const friendshipsQuery = query(collection(db, FRIENDSHIPS), where('uids', 'array-contains', uid));
  return onSnapshot(
    friendshipsQuery,
    (snapshot) =>
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FriendshipDoc, 'id'>) }))),
    (error) => onError(describeError(error))
  );
}

/** Live public profile of a friend; null when the friend turned the hub off. */
export function subscribePublicProfile(
  uid: string,
  onChange: (profile: PublicProfile | null) => void
): () => void {
  if (!db) return () => undefined;
  return onSnapshot(
    doc(db, PUBLIC_PROFILES, uid),
    (snapshot) => onChange(snapshot.exists() ? (snapshot.data() as PublicProfile) : null),
    () => onChange(null)
  );
}

const CONTESTS = 'contests';

/**
 * Invites a friend to today's contest. The caller checks the live contest list first; if the pair
 * already has one today, the write counts as an update and the rules reject it.
 */
export function createContestDoc(contest: ContestDoc): Promise<ServiceResult<void>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, hasPendingWrites, ...data } = contest;
  return attempt(() => setDoc(doc(requireDb(), CONTESTS, id), data));
}

export function respondToContest(contestId: string, isAccepted: boolean): Promise<ServiceResult<void>> {
  return attempt(() =>
    updateDoc(doc(requireDb(), CONTESTS, contestId), { status: isAccepted ? 'accepted' : 'declined' })
  );
}

const SAVE_TIMEOUT_MS = 10_000;
const OFFLINE_SAVE_HE = 'אין חיבור לאינטרנט כרגע. התוצאה תישלח כשהחיבור יחזור, אם זה יקרה לפני חצות.';

/**
 * Saves the learner's contest result. Offline, Firestore keeps the write queued without
 * confirming it, so after a while this reports that instead of waiting forever.
 */
export function submitContestResult(
  contestId: string,
  myUid: string,
  result: ContestResult
): Promise<ServiceResult<void>> {
  const save = attempt(() => updateDoc(doc(requireDb(), CONTESTS, contestId), { [`results.${myUid}`]: result }));
  const timeout = new Promise<ServiceResult<void>>((resolve) =>
    window.setTimeout(() => resolve({ ok: false, errorHe: OFFLINE_SAVE_HE }), SAVE_TIMEOUT_MS)
  );
  return Promise.race([save, timeout]);
}

/** Live list of the learner's contests from the last few days. */
export function subscribeContests(
  uid: string,
  sinceDateStr: string,
  onChange: (contests: ContestDoc[]) => void,
  onError: (errorHe: string) => void
): () => void {
  if (!db) return () => undefined;
  const contestsQuery = query(
    collection(db, CONTESTS),
    where('uids', 'array-contains', uid),
    where('dateStr', '>=', sinceDateStr)
  );
  // Metadata changes tell when a local write (e.g. my result) is confirmed by the server
  return onSnapshot(
    contestsQuery,
    { includeMetadataChanges: true },
    (snapshot) =>
      onChange(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ContestDoc, 'id'>),
          hasPendingWrites: d.metadata.hasPendingWrites,
        }))
      ),
    (error) => onError(describeError(error))
  );
}
