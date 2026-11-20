import { isPro, type Entitlement } from './proGate';
import { PRO_SPOKEN_HE } from './proAsk';
import { isolateLtr } from '../utils/bidi';

/**
 * The learner's side of a free Pro week a parent started (docs/feature-pro-tier.md, "Pro week"): calm,
 * factual lines only. No countdown, no "ask a parent", no offer: by law (Consumer Protection
 * regulations on marketing to minors, 1991) the sales side is the parent's alone.
 */

const ON = (pro: string) => `יש לך ${pro} לשבוע, במתנה מההורים.`;
const ENDED = (pro: string) => `שבוע ה-${pro} הסתיים. כל ההתקדמות שלך נשמרה, והיחידות החינמיות ממשיכות כרגיל.`;

/** Shown on the home screen while the week runs (the date follows, as plain text) */
export const PRO_WEEK_ON_HE = ON(isolateLtr('Pro'));
/** Shown once after the week ended */
export const PRO_WEEK_ENDED_HE = ENDED(isolateLtr('Pro'));
/** What their 🔊 reads to grades 1–2 (one clip each, gender-neutral, in the Hebrew corpus) */
export const PRO_WEEK_ON_SPOKEN_HE = ON(PRO_SPOKEN_HE);
export const PRO_WEEK_ENDED_SPOKEN_HE = ENDED(PRO_SPOKEN_HE);

export type ProWeekState = { kind: 'on'; endsAt: number } | { kind: 'ended'; endsAt: number } | null;

/** The learner's Pro week now: running, ended, or none (any other Pro, or no Pro week at all) */
export function getProWeekState(entitlement: Entitlement | null, nowMs: number): ProWeekState {
  if (!entitlement || entitlement.source !== 'trial') return null;
  return isPro(entitlement, nowMs) ? { kind: 'on', endsAt: entitlement.periodEnd } : { kind: 'ended', endsAt: entitlement.periodEnd };
}

const endedSeenKey = (uid: string) => `english_tutor_pro_week_ended_seen_${uid}`;

/** The "week ended" card shows once per account on this device */
export function hasSeenProWeekEnded(uid: string): boolean {
  try {
    return localStorage.getItem(endedSeenKey(uid)) === '1';
  } catch {
    return false;
  }
}

export function markProWeekEndedSeen(uid: string): void {
  try {
    localStorage.setItem(endedSeenKey(uid), '1');
  } catch {
    // Storage blocked: the card may show again, which is harmless
  }
}
