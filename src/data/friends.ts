import { LearnerGender, LearnerProfile } from '../types/learner';
import { countCompletedMissions } from './milestones';
import { getCurrentStreak } from './streak';
import { toUsernameSlug } from '../utils/username';

/**
 * Feature 19: Friends Hub. Pure helpers for friend codes, friend requests, the public summary
 * friends can see, reactions and invite links. Firestore access lives in services/friendsService.
 */

export const MAX_FRIENDS = 30;
export const MAX_OUTGOING_REQUESTS = 10;
export const FRIEND_CODE_LENGTH = 6;
/** No 0/O, 1/I/L, so a code read aloud or copied by hand can't be mistyped */
export const FRIEND_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const MAX_DISPLAY_NAME_LENGTH = 24;
export const INVITE_PARAM = 'invite';

/** Preset reactions; there is no free text between learners. Kept in sync with firestore.rules. */
export const FRIEND_REACTIONS: { emoji: string; labelHe: string }[] = [
  { emoji: '👏', labelHe: 'מחיאות כפיים' },
  { emoji: '🔥', labelHe: 'אש' },
  { emoji: '⭐', labelHe: 'כוכב' },
  { emoji: '😄', labelHe: 'חיוך' },
  { emoji: '💪', labelHe: 'כוח' },
  { emoji: '🎉', labelHe: 'חגיגה' },
];

/** What a friend can see about the learner: display name, avatar and progress, nothing else. */
export interface PublicProfile {
  displayName: string;
  avatarEmoji: string;
  level: number;
  streakDays: number;
  stars: number;
  missionsCompleted: number;
}

/** A friend code or username entry: who it belongs to and how to show them before adding. */
export interface FriendLookupEntry {
  uid: string;
  displayName: string;
  avatarEmoji: string;
}

export interface FriendReaction {
  emoji: string;
  at: string;
}

export type FriendshipStatus = 'pending' | 'accepted';

/** A `friendships/{pairId}` document: a pending request, or an accepted friendship. */
export interface FriendshipDoc {
  id: string;
  /** [requester, addressee] */
  uids: string[];
  requesterUid: string;
  requesterName: string;
  requesterAvatar: string;
  addresseeName: string;
  addresseeAvatar: string;
  status: FriendshipStatus;
  /** uid -> the latest reaction that learner sent */
  reactions?: Record<string, FriendReaction>;
  createdAt: string;
  acceptedAt?: string;
}

/** One side of a friendship, seen from the learner's point of view. */
export interface FriendLink {
  friendshipId: string;
  friendUid: string;
  /** Name and avatar saved with the request, shown until the friend's public profile loads */
  fallbackName: string;
  fallbackAvatar: string;
  /** Latest reaction the friend sent me */
  theirReaction?: FriendReaction;
  /** Latest reaction I sent the friend */
  myReaction?: FriendReaction;
  createdAt: string;
}

export interface ClassifiedFriendships {
  accepted: FriendLink[];
  /** Requests waiting for my answer */
  incoming: FriendLink[];
  /** Requests I sent that are still waiting */
  outgoing: FriendLink[];
}

/** Learners younger than this need a parent's approval for the Friends Hub. */
export const PARENT_APPROVAL_AGE = 13;

export function needsParentApproval(profile: Pick<LearnerProfile, 'age'>): boolean {
  return profile.age < PARENT_APPROVAL_AGE;
}

/**
 * The learner's choice in the settings; without one, the hub is on from age 13 and off for
 * younger learners until a parent turns it on.
 */
export function isFriendsHubEnabled(profile: LearnerProfile): boolean {
  return profile.friendsHub?.isEnabled ?? !needsParentApproval(profile);
}

/**
 * Turns the hub on or off; the toggle time decides the merge between devices. Turning it on for a
 * learner under 13 is the parent's approval (the settings ask for it), so its time is kept.
 */
export function setFriendsHubEnabled(profile: LearnerProfile, isEnabled: boolean, now: Date): LearnerProfile {
  const isParentApproval = isEnabled && needsParentApproval(profile);
  return {
    ...profile,
    friendsHub: {
      ...profile.friendsHub,
      isEnabled,
      ...(isParentApproval ? { parentApprovedAt: now.toISOString() } : {}),
      updatedAt: now.toISOString(),
    },
  };
}

/** Others can find the learner by username only after the learner turned it on. */
export function isUsernameSearchable(profile: LearnerProfile): boolean {
  return profile.friendsHub?.isUsernameSearchable ?? false;
}

export function setUsernameSearchable(profile: LearnerProfile, isSearchable: boolean, now: Date): LearnerProfile {
  return {
    ...profile,
    friendsHub: {
      isEnabled: isFriendsHubEnabled(profile),
      ...profile.friendsHub,
      isUsernameSearchable: isSearchable,
      updatedAt: now.toISOString(),
    },
  };
}

/**
 * Stores a newly claimed friend code. Its toggle time is kept (or the epoch when there is none),
 * so claiming a code never overrides a toggle change made on another device.
 */
export function withFriendCode(profile: LearnerProfile, code: string, now: Date): LearnerProfile {
  return {
    ...profile,
    friendsHub: {
      isEnabled: isFriendsHubEnabled(profile),
      updatedAt: profile.friendsHub?.updatedAt || new Date(0).toISOString(),
      ...profile.friendsHub,
      friendCode: code,
      friendCodeCreatedAt: now.toISOString(),
    },
  };
}

/** A random friend code; `random` returns [0, 1) like Math.random. */
export function generateFriendCode(random: () => number = Math.random): string {
  return Array.from(
    { length: FRIEND_CODE_LENGTH },
    () => FRIEND_CODE_ALPHABET[Math.floor(random() * FRIEND_CODE_ALPHABET.length)]
  ).join('');
}

/** Uppercases a typed code and drops spaces and dashes. */
export function normalizeFriendCode(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '');
}

export function isFriendCode(input: string): boolean {
  const code = normalizeFriendCode(input);
  return code.length === FRIEND_CODE_LENGTH && [...code].every((ch) => FRIEND_CODE_ALPHABET.includes(ch));
}

/**
 * How to look up what the learner typed: as a friend code, as a username, or both (a 6-letter
 * username like "noahhh" also looks like a code, so the code is tried first).
 */
export function normalizeFriendQuery(input: string): { code?: string; usernameSlug?: string } {
  const code = isFriendCode(input) ? normalizeFriendCode(input) : undefined;
  const slug = toUsernameSlug(input.replace(/^@/, ''));
  const usernameSlug = slug.length >= 2 ? slug : undefined;
  return { ...(code ? { code } : {}), ...(usernameSlug ? { usernameSlug } : {}) };
}

/** The friendship document id: both uids, sorted, so either learner finds the same document. */
export function getPairId(a: string, b: string): string {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

/**
 * Whole words that make a name unfit to show to other children. Matched per word, so names that
 * merely contain the letters (Assaf, Dickens) still pass. Friends see only the name and avatar,
 * so this is the one place free text could carry an insult.
 */
const BLOCKED_NAME_WORDS = new Set([
  'stupid', 'idiot', 'dumb', 'loser', 'ugly', 'fat', 'hate', 'kill', 'die', 'sex', 'sexy',
  'fuck', 'shit', 'bitch', 'ass', 'dick', 'porn', 'nazi',
  'מטומטם', 'מטומטמת', 'טיפש', 'טיפשה', 'אידיוט', 'אידיוטית', 'דביל', 'דבילית', 'מפגר', 'מפגרת',
  'סתום', 'סתומה', 'זונה', 'שרמוטה', 'מניאק', 'מניאקית', 'חרא', 'מכוער', 'מכוערת', 'לוזר', 'נאצי',
]);

function isBlockedName(name: string): boolean {
  return name
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .some((word) => BLOCKED_NAME_WORDS.has(word));
}

/** The learner's first name, trimmed to what the public profile allows; a rude name becomes "Learner". */
export function toDisplayName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed || isBlockedName(trimmed)) return 'Learner';
  return trimmed.slice(0, MAX_DISPLAY_NAME_LENGTH);
}

/** The largest values firestore.rules accepts on a public profile (isPublicProfile) */
export const PUBLIC_PROFILE_LIMITS = { level: 1000, streakDays: 3650, stars: 432, missionsCompleted: 144 } as const;

const capped = (value: number, max: number): number => Math.max(0, Math.min(max, Math.floor(value) || 0));

/** `todayStr` is the learner's local date: a streak with a missed day shows 0. */
export function buildPublicProfile(profile: LearnerProfile, avatarEmoji: string, todayStr: string): PublicProfile {
  return {
    displayName: toDisplayName(profile.name),
    avatarEmoji,
    // Capped like the rules, so an inflated stored number can't block publishing
    level: capped(profile.stats.level, PUBLIC_PROFILE_LIMITS.level),
    streakDays: capped(getCurrentStreak(profile, todayStr), PUBLIC_PROFILE_LIMITS.streakDays),
    stars: capped(profile.stats.stars, PUBLIC_PROFILE_LIMITS.stars),
    missionsCompleted: capped(countCompletedMissions(profile.missionProgress || {}), PUBLIC_PROFILE_LIMITS.missionsCompleted),
  };
}

export function isSamePublicProfile(a: PublicProfile | null, b: PublicProfile): boolean {
  if (!a) return false;
  return (Object.keys(b) as (keyof PublicProfile)[]).every((key) => a[key] === b[key]);
}

function toLink(doc: FriendshipDoc, myUid: string): FriendLink {
  const isRequester = doc.requesterUid === myUid;
  const friendUid = doc.uids.find((uid) => uid !== myUid) || '';
  return {
    friendshipId: doc.id,
    friendUid,
    fallbackName: isRequester ? doc.addresseeName : doc.requesterName,
    fallbackAvatar: isRequester ? doc.addresseeAvatar : doc.requesterAvatar,
    ...(doc.reactions?.[friendUid] ? { theirReaction: doc.reactions[friendUid] } : {}),
    ...(doc.reactions?.[myUid] ? { myReaction: doc.reactions[myUid] } : {}),
    createdAt: doc.acceptedAt || doc.createdAt,
  };
}

/** Splits the learner's friendship documents into friends, incoming and outgoing requests. */
export function classifyFriendships(docs: FriendshipDoc[], myUid: string): ClassifiedFriendships {
  const mine = docs.filter((d) => d.uids.includes(myUid) && d.uids.length === 2);
  const byName = (a: FriendLink, b: FriendLink) => a.fallbackName.localeCompare(b.fallbackName, 'he');
  const newestFirst = (a: FriendLink, b: FriendLink) => b.createdAt.localeCompare(a.createdAt);
  return {
    accepted: mine.filter((d) => d.status === 'accepted').map((d) => toLink(d, myUid)).sort(byName),
    incoming: mine
      .filter((d) => d.status === 'pending' && d.requesterUid !== myUid)
      .map((d) => toLink(d, myUid))
      .sort(newestFirst),
    outgoing: mine
      .filter((d) => d.status === 'pending' && d.requesterUid === myUid)
      .map((d) => toLink(d, myUid))
      .sort(newestFirst),
  };
}

export type FriendRequestCheck =
  | { kind: 'ok' }
  | { kind: 'self' }
  | { kind: 'already-friends' }
  | { kind: 'already-sent' }
  /** They already asked me, so adding them accepts their request */
  | { kind: 'accept-incoming'; friendshipId: string }
  | { kind: 'too-many-friends' }
  | { kind: 'too-many-requests' };

/** Whether the learner can send a request to `targetUid`, given their current friendships. */
export function checkFriendRequest(
  friendships: ClassifiedFriendships,
  myUid: string,
  targetUid: string
): FriendRequestCheck {
  if (targetUid === myUid) return { kind: 'self' };
  if (friendships.accepted.some((f) => f.friendUid === targetUid)) return { kind: 'already-friends' };
  if (friendships.outgoing.some((f) => f.friendUid === targetUid)) return { kind: 'already-sent' };
  const incoming = friendships.incoming.find((f) => f.friendUid === targetUid);
  if (incoming) return { kind: 'accept-incoming', friendshipId: incoming.friendshipId };
  if (friendships.accepted.length >= MAX_FRIENDS) return { kind: 'too-many-friends' };
  if (friendships.outgoing.length >= MAX_OUTGOING_REQUESTS) return { kind: 'too-many-requests' };
  return { kind: 'ok' };
}

export function isPresetReaction(emoji: string): boolean {
  return FRIEND_REACTIONS.some((r) => r.emoji === emoji);
}

export function buildInviteUrl(origin: string, code: string): string {
  return `${origin.replace(/\/+$/, '')}/?${INVITE_PARAM}=${encodeURIComponent(code)}`;
}

/** The friend code in an invite link's query string, or null when it is missing or invalid. */
export function parseInviteParam(search: string): string | null {
  const value = new URLSearchParams(search).get(INVITE_PARAM);
  return value && isFriendCode(value) ? normalizeFriendCode(value) : null;
}

/** The message sent with an invite link. The reader's gender is unknown, so only the sender's is used. */
export function buildInviteMessageHe(displayName: string, gender: LearnerGender, code: string, url: string): string {
  const invites = gender === 'girl' ? 'מזמינה' : 'מזמין';
  return `${displayName} ${invites} אותך להיות חברים באפליקציית האנגלית! 🎉\nקוד החבר: ${code}\n${url}`;
}
