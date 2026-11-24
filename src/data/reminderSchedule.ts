/**
 * When the daily reminder comes and what it points at. Shared by the app (settings, the sync of
 * `pushSubscriptions/{uid}`) and the cron (api/_lib/streakReminder.ts), so it imports nothing.
 *
 * Hours are Israel time. Vercel's Hobby plan runs a cron at most once a day and somewhere inside
 * its hour, so vercel.json has one daily job per UTC hour that can be one of these Israel hours
 * (winter UTC+2, summer UTC+3), and each run sends to the learners whose hour it is now.
 */

export const REMINDER_HOURS = [14, 15, 16, 17, 18, 19, 20] as const;
export type ReminderHour = (typeof REMINDER_HOURS)[number];
/** The hour for a learner who never chose one (the calendar reminder's hour too) */
export const DEFAULT_REMINDER_HOUR: ReminderHour = 15;

/**
 * Something real waiting in the app; the reminder names one of them instead of the streak.
 * `new-pack`: a newly released content pack the learner can play and hasn't started (`newPackId`).
 */
export const REMINDER_HINTS = ['quick-review', 'room-item', 'next-mission', 'new-pack'] as const;
export type ReminderHint = (typeof REMINDER_HINTS)[number];
/** Named every day while it waits, ahead of the daily rotation: new content is news only for a while */
const PRIORITY_HINT: ReminderHint = 'new-pack';
/** Longest mission story hook kept for the reminder (firestore.rules has the same limit) */
export const MISSION_HOOK_MAX_LENGTH = 160;
/** A content pack id as stored for the reminder (firestore.rules checks the same pattern) */
const PACK_ID_PATTERN = /^[a-z0-9-]{1,24}$/;

export function isStoredPackId(value: unknown): value is string {
  return typeof value === 'string' && PACK_ID_PATTERN.test(value);
}

export function isReminderHour(value: unknown): value is ReminderHour {
  return typeof value === 'number' && (REMINDER_HOURS as readonly number[]).includes(value);
}

export function isReminderHint(value: unknown): value is ReminderHint {
  return typeof value === 'string' && (REMINDER_HINTS as readonly string[]).includes(value);
}

/** "15:00": a number only, so it needs no bidi isolation inside Hebrew */
export function formatReminderHour(hour: number): string {
  return `${hour}:00`;
}

/** Days since 1970-01-01 for a YYYY-MM-DD day, to rotate the hints by date */
function dayNumber(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * One hint a day: a new pack while it waits, else a different one each day when several wait, so no
 * reminder repeats itself.
 */
export function pickReminderHint(hints: readonly ReminderHint[], dateStr: string): ReminderHint | undefined {
  if (hints.includes(PRIORITY_HINT)) return PRIORITY_HINT;
  if (hints.length === 0) return undefined;
  return hints[((dayNumber(dateStr) % hints.length) + hints.length) % hints.length];
}
