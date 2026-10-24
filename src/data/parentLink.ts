import { DEFAULT_PROFILE } from './defaultProfile';
import { ActivityLogEntry, GradeId, LearnerGender, LearnerProfile, LearnerStats, ProficiencyTier } from '../types/learner';

/**
 * Pairing a parent with a learner. The learner makes a one-time parent code (`parentInvites/{code}`);
 * the parent, signed in with their own Google account, claims it, which creates
 * `parentLinks/{parentUid}_{childUid}`. A paired learner keeps a small report snapshot
 * (`reportSnapshots/{uid}`) the parent can read. Everything here is optional: the learner app
 * works the same with no parent.
 */

export const PARENT_PARAM = 'parent';
export const PARENT_CODE_LENGTH = 8;
/** Same letters as the friend codes: no 0/O, 1/I/L */
export const PARENT_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const PARENT_CODE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The part of the profile the weekly report reads; nothing else leaves the learner's account. */
export interface ReportSnapshot {
  name: string;
  gender: LearnerGender;
  gradeId: GradeId;
  preferredTier: ProficiencyTier;
  isShabbatObserver: boolean;
  stats: Pick<
    LearnerStats,
    'level' | 'streakDays' | 'streakLastDateStr' | 'streakShieldsBought' | 'streakShieldsUsed' | 'totalActiveDays'
  >;
  missionProgress: Record<string, number>;
  activityLog: ActivityLogEntry[];
  /** ISO time of the last publish */
  updatedAt: string;
}

export interface ParentInvite {
  childUid: string;
  childName: string;
  childAvatar: string;
  /** Epoch milliseconds (the rules compare it with the server time) */
  expiresAtMs: number;
}

export interface ParentLink {
  parentUid: string;
  childUid: string;
  childName: string;
  childAvatar: string;
  /** The code that was claimed; the invite is deleted in the same write */
  inviteCode: string;
  /** ISO time */
  linkedAt: string;
}

export function generateParentCode(randomBytes: (length: number) => Uint8Array = defaultRandomBytes): string {
  const alphabetSize = PARENT_CODE_ALPHABET.length;
  // Bytes at or above this limit are skipped so every letter is equally likely
  const limit = 256 - (256 % alphabetSize);
  let code = '';
  while (code.length < PARENT_CODE_LENGTH) {
    for (const byte of randomBytes(PARENT_CODE_LENGTH * 2)) {
      if (byte < limit && code.length < PARENT_CODE_LENGTH) code += PARENT_CODE_ALPHABET[byte % alphabetSize];
    }
  }
  return code;
}

function defaultRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

export function normalizeParentCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s-]/g, '');
}

export function isParentCode(code: string): boolean {
  return code.length === PARENT_CODE_LENGTH && [...code].every((ch) => PARENT_CODE_ALPHABET.includes(ch));
}

/** The code in `/?parent=CODE`, or null when it is missing or invalid (`/?parent` alone opens the portal). */
export function parseParentParam(search: string): string | null {
  const value = new URLSearchParams(search).get(PARENT_PARAM);
  if (!value) return null;
  const code = normalizeParentCode(value);
  return isParentCode(code) ? code : null;
}

/** Whether the address asks for the parent portal. */
export function isParentRoute(search: string): boolean {
  return new URLSearchParams(search).has(PARENT_PARAM);
}

export function buildParentUrl(origin: string, code: string): string {
  return `${origin.replace(/\/+$/, '')}/?${PARENT_PARAM}=${encodeURIComponent(code)}`;
}

export function getInviteExpiry(now: Date): number {
  return now.getTime() + PARENT_CODE_DAYS * DAY_MS;
}

export function isInviteExpired(invite: Pick<ParentInvite, 'expiresAtMs'>, now: Date): boolean {
  return invite.expiresAtMs <= now.getTime();
}

/** The message a learner sends to a parent. The reader's gender is unknown, so only the sender's is used. */
export function buildParentMessageHe(childName: string, gender: LearnerGender, code: string, url: string): string {
  const asks = gender === 'girl' ? 'מבקשת' : 'מבקש';
  const name = childName.trim() || (gender === 'girl' ? 'הילדה שלך' : 'הילד שלך');
  return `${name} ${asks} שתצטרפו לאזור ההורים באפליקציית האנגלית: דוח שבועי של ההתקדמות, בלי לשאול.\nקוד ההורים: ${code}\n${url}`;
}

export function parentLinkId(parentUid: string, childUid: string): string {
  return `${parentUid}_${childUid}`;
}

export function buildReportSnapshot(profile: LearnerProfile, now: Date): ReportSnapshot {
  const { level, streakDays, streakLastDateStr, streakShieldsBought, streakShieldsUsed, totalActiveDays } = profile.stats;
  return {
    name: profile.name,
    gender: profile.gender,
    gradeId: profile.gradeId,
    preferredTier: profile.preferredTier,
    isShabbatObserver: profile.isShabbatObserver ?? true,
    // Firestore rejects undefined, so absent numbers are left out
    stats: {
      level,
      streakDays,
      ...(streakLastDateStr ? { streakLastDateStr } : {}),
      ...(streakShieldsBought !== undefined ? { streakShieldsBought } : {}),
      ...(streakShieldsUsed !== undefined ? { streakShieldsUsed } : {}),
      ...(totalActiveDays !== undefined ? { totalActiveDays } : {}),
    },
    missionProgress: profile.missionProgress,
    activityLog: profile.activityLog ?? [],
    updatedAt: now.toISOString(),
  };
}

/** A profile the report code can read, built from a snapshot. Everything outside the snapshot is a default. */
export function snapshotToProfile(snapshot: ReportSnapshot): LearnerProfile {
  return {
    ...DEFAULT_PROFILE,
    isOnboarded: true,
    name: snapshot.name,
    gender: snapshot.gender,
    gradeId: snapshot.gradeId,
    preferredTier: snapshot.preferredTier,
    isShabbatObserver: snapshot.isShabbatObserver,
    stats: { ...DEFAULT_PROFILE.stats, ...snapshot.stats },
    missionProgress: snapshot.missionProgress,
    activityLog: snapshot.activityLog,
  };
}

/** The snapshot without its publish time, to tell whether anything changed since the last publish. */
export function snapshotContentKey(snapshot: ReportSnapshot): string {
  return JSON.stringify({ ...snapshot, updatedAt: '' });
}

/** Fired on `window` when the learner's list of paired parents may have changed. */
export const PARENTS_CHANGED_EVENT = 'english_tutor_parents_changed';
