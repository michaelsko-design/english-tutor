import { APP_NAME } from '../config/appInfo';
import type { LearnerGender } from '../types/learner';
import { PARENT_PARAM, buildParentUrl } from './parentLink';

/**
 * The kid-safe "ask a parent" step of EnglishVibe Pro (docs/feature-pro-tier.md): the learner sends a
 * parent a link to the parent portal. No prices or plans are ever shown to the learner.
 */

/** How the Hebrew voice says "Pro" (niqqud keeps it from reading פרו as "paru") */
export const PRO_SPOKEN_HE = 'פְּרוֹ';

export const ASK_PARENT_LABEL_HE = 'לבקש מהורה 💬';

/** Tells the parent portal to open on the child's Pro card */
export const PRO_INTENT_PARAM = 'pro';

/** The link a parent opens: with a new pairing code, or just the portal when a parent is already paired. */
export function buildProAskUrl(origin: string, parentCode: string | null): string {
  const base = parentCode
    ? buildParentUrl(origin, parentCode)
    : `${origin.replace(/\/+$/, '')}/?${PARENT_PARAM}`;
  return `${base}&${PRO_INTENT_PARAM}=1`;
}

/**
 * The message the learner sends. The parent's gender is unknown, so only the sender's is used. With an
 * exam or school lists (data/examPitch.ts) that line replaces "open all the missions".
 */
export function buildProAskMessageHe(childName: string, gender: LearnerGender, url: string, examLineHe?: string): string {
  const isGirl = gender === 'girl';
  const name = childName.trim();
  const hello = name ? `היי! כאן ${name} 😊` : 'היי! 😊';
  const learns = isGirl ? 'לומדת' : 'לומד';
  const why = examLineHe ? `. ${examLineHe}` : ' ורוצה לפתוח את כל המשימות.';
  return `${hello} אני ${learns} אנגלית ב-${APP_NAME}${why} אפשר לשדרג כאן:\n${url}`;
}

const askKey = (uid: string) => `english_tutor_pro_ask_${uid}`;

/** What a Pro ask opened with: the locked thing the learner tapped */
export const PRO_ASK_FOCUSES = ['missions', 'exam', 'lists', 'themes'] as const;
export type ProAskFocus = (typeof PRO_ASK_FOCUSES)[number];

/** After this long without Pro, the home screen offers to send the ask again (the code itself lasts 2 days) */
export const ASK_RESEND_AFTER_MS = 48 * 60 * 60 * 1000;
/** At most this many resends per ask, so the reminder never turns into nagging */
export const MAX_ASK_RESENDS = 2;

/** The last ask on this device (per device, like the one-ask-a-day cap) */
export interface ProAskRecord {
  dateStr: string;
  atMs: number;
  focus: ProAskFocus;
  /** Resends of this ask so far */
  resends: number;
  /** The learner closed the "send again" card for this ask */
  dismissedAtMs?: number;
}

const isFocus = (value: unknown): value is ProAskFocus => typeof value === 'string' && (PRO_ASK_FOCUSES as readonly string[]).includes(value);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Reads the stored ask; an older device kept only the day, which counts as an ask at that day's start. */
export function readLastAsk(uid: string): ProAskRecord | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(askKey(uid));
  } catch {
    return null;
  }
  if (!raw) return null;
  if (DATE_RE.test(raw)) return { dateStr: raw, atMs: new Date(`${raw}T00:00:00`).getTime(), focus: 'missions', resends: 0 };
  try {
    const value = JSON.parse(raw) as Partial<ProAskRecord>;
    if (typeof value.dateStr !== 'string' || !DATE_RE.test(value.dateStr) || typeof value.atMs !== 'number') return null;
    return {
      dateStr: value.dateStr,
      atMs: value.atMs,
      focus: isFocus(value.focus) ? value.focus : 'missions',
      resends: typeof value.resends === 'number' && value.resends >= 0 ? value.resends : 0,
      ...(typeof value.dismissedAtMs === 'number' ? { dismissedAtMs: value.dismissedAtMs } : {}),
    };
  } catch {
    return null;
  }
}

function writeAsk(uid: string, record: ProAskRecord): void {
  try {
    localStorage.setItem(askKey(uid), JSON.stringify(record));
  } catch {
    // Storage blocked: the learner may ask again today, which is harmless
  }
}

/** One ask a day: kindness to parents, not security (the server needs no limit). */
export function hasAskedToday(uid: string, todayStr: string): boolean {
  return readLastAsk(uid)?.dateStr === todayStr;
}

/** Remembers an ask; a resend keeps counting against the same ask, a new ask starts over. */
export function rememberAsk(
  uid: string,
  todayStr: string,
  options: { focus?: ProAskFocus; isResend?: boolean; nowMs?: number } = {}
): void {
  const previous = readLastAsk(uid);
  const resends = options.isResend && previous ? previous.resends + 1 : 0;
  writeAsk(uid, { dateStr: todayStr, atMs: options.nowMs ?? Date.now(), focus: options.focus ?? previous?.focus ?? 'missions', resends });
}

/** The learner closed the "send again" card; it stays away until the next ask. */
export function dismissAskResend(uid: string, nowMs: number = Date.now()): void {
  const previous = readLastAsk(uid);
  if (previous) writeAsk(uid, { ...previous, dismissedAtMs: nowMs });
}

/** An ask that is 48 hours old, still without Pro, not resent too often, and not closed: offer to send it again. */
export function getUnansweredAsk(uid: string, nowMs: number, hasPro: boolean): ProAskRecord | null {
  if (hasPro) return null;
  const record = readLastAsk(uid);
  if (!record || record.resends >= MAX_ASK_RESENDS) return null;
  if (record.dismissedAtMs !== undefined && record.dismissedAtMs >= record.atMs) return null;
  return nowMs - record.atMs >= ASK_RESEND_AFTER_MS ? record : null;
}

/** The Pro sheet's heading, by the learner's gender (spelled apart, so its clip says the right form) */
export function getProSheetTitleHe(gender: LearnerGender): string {
  return gender === 'girl' ? 'בואי נמשיך להרפתקה הבאה!' : 'בוא נמשיך להרפתקה הבאה!';
}

/** What the Pro sheet's 🔊 reads to grades 1–2 (one clip per gender, in the Hebrew corpus) */
export function getProSheetSpokenHe(gender: LearnerGender): string {
  return `${getProSheetTitleHe(gender)} עם ${PRO_SPOKEN_HE} נפתחים כל היחידות והבוסים, הכנה מלאה למבחן, עוד רשימות מילים, וכל העיצובים והדמויות. אפשר לבקש מהורה לפתוח אותם.`;
}
