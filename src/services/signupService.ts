/**
 * Stores where a new account came from: `signups/{uid}` = { uid, day, src, campaign? }, written once,
 * right after the account is created (create-only in firestore.rules; the owner's funnel reads it on
 * the server). Only an account made in the last day is recorded, so an old account that later opens
 * a tagged link keeps its place in the funnel.
 */
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { toLocalDateStr } from '../utils/dates';
import type { Attribution } from '../data/attribution';

export const SIGNUPS_COLLECTION = 'signups';
/** An account older than this is not a new sign-up */
export const NEW_ACCOUNT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RECORDED_KEY_PREFIX = 'english_tutor_signup_recorded_';

export interface SignupRecord {
  uid: string;
  day: string;
  src: string;
  campaign?: string;
}

export interface NewAccount {
  uid: string;
  /** Firebase's `metadata.creationTime` */
  creationTime?: string;
}

export function isNewAccount(creationTime: string | undefined, nowMs: number): boolean {
  const createdMs = creationTime ? Date.parse(creationTime) : Number.NaN;
  return Number.isFinite(createdMs) && nowMs - createdMs >= 0 && nowMs - createdMs < NEW_ACCOUNT_WINDOW_MS;
}

export function buildSignupRecord(uid: string, attribution: Attribution, now: Date): SignupRecord {
  return { uid, day: toLocalDateStr(now), src: attribution.src, ...(attribution.campaign ? { campaign: attribution.campaign } : {}) };
}

function wasRecorded(uid: string): boolean {
  try {
    return window.localStorage.getItem(RECORDED_KEY_PREFIX + uid) === '1';
  } catch {
    return false;
  }
}

function rememberRecorded(uid: string): void {
  try {
    window.localStorage.setItem(RECORDED_KEY_PREFIX + uid, '1');
  } catch {
    // Storage is blocked: the rules still refuse a second write
  }
}

export interface RecordSignupDeps {
  write?: (record: SignupRecord) => Promise<void>;
  now?: () => Date;
}

const writeToFirestore = async (record: SignupRecord): Promise<void> => {
  if (!db) throw new Error('Firestore is not configured');
  await setDoc(doc(db, SIGNUPS_COLLECTION, record.uid), record);
};

/**
 * Records the sign-up once. True only when this call stored it. A failure is not remembered, so the
 * next page load tries again (an account waiting behind the early-tester gate is refused until it is let in).
 */
export async function recordSignup(account: NewAccount, attribution: Attribution, deps: RecordSignupDeps = {}): Promise<boolean> {
  const { write = writeToFirestore, now = () => new Date() } = deps;
  const moment = now();
  if (!isNewAccount(account.creationTime, moment.getTime()) || wasRecorded(account.uid)) return false;
  try {
    await write(buildSignupRecord(account.uid, attribution, moment));
    rememberRecorded(account.uid);
    return true;
  } catch {
    // Refused (already stored, or not let in yet) or offline: the funnel must never get in a child's way
    return false;
  }
}

/** The signed-in account as `recordSignup` needs it; null when nobody is signed in or there is no cloud. */
export function currentNewAccount(uid: string): NewAccount | null {
  const user = auth?.currentUser;
  if (!isFirebaseConfigured || !user || user.uid !== uid) return null;
  return { uid, creationTime: user.metadata.creationTime };
}
