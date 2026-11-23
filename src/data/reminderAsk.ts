import type { LearnerProfile } from '../types/learner';
import { daysBetween } from '../utils/dates';
import { getCurrentStreak } from './streak';

/**
 * When to ask for the daily reminder (§4.27). Ask 1 is the first-win screen. Ask 2 is the full-screen
 * ask after a mission on a later day, once the learner practised on two days (they are coming back,
 * so a reminder is worth more to them). Ask 3 waits at least 5 days and a 3-day streak. Never more
 * than 3 asks, never two on one day: after that only the home card and the settings offer it, so the
 * learner is never nagged (a legal line too: no pressure on a permission, see docs/legal).
 * The browser and the reminder state are checked by the caller.
 */

export const MAX_REMINDER_ASKS = 3;
export const REMINDER_ASK_MIN_DAYS = 2;
export const THIRD_ASK_GAP_DAYS = 5;
export const THIRD_ASK_MIN_STREAK = 3;

/** The best measure of "came back": the live streak or the total days practised */
export function practisedDays(profile: LearnerProfile, todayStr: string): number {
  return Math.max(getCurrentStreak(profile, todayStr), profile.stats.totalActiveDays ?? 0);
}

/** How many times the learner was asked; profiles from before the count derive it from the old fields */
export function getReminderAskCount(profile: LearnerProfile): number {
  if (typeof profile.reminderAskCount === 'number') return profile.reminderAskCount;
  if (profile.hasSeenReminderReask) return 2;
  return profile.reminderDeclinedAtStr ? 1 : 0;
}

export function getReminderLastAskedStr(profile: LearnerProfile): string | undefined {
  return profile.reminderLastAskedAtStr ?? profile.reminderDeclinedAtStr;
}

const wasAskedToday = (profile: LearnerProfile, todayStr: string): boolean => {
  const lastAsked = getReminderLastAskedStr(profile);
  return Boolean(lastAsked && lastAsked >= todayStr);
};

/** The full-screen ask is due after a mission today (asks 2 and 3). */
export function isReminderAskDue(profile: LearnerProfile, todayStr: string): boolean {
  const count = getReminderAskCount(profile);
  if (count >= MAX_REMINDER_ASKS || wasAskedToday(profile, todayStr)) return false;
  if (practisedDays(profile, todayStr) < REMINDER_ASK_MIN_DAYS) return false;
  if (count < MAX_REMINDER_ASKS - 1) return true;
  const lastAsked = getReminderLastAskedStr(profile);
  const isGapLongEnough = !lastAsked || daysBetween(lastAsked, todayStr) >= THIRD_ASK_GAP_DAYS;
  return isGapLongEnough && getCurrentStreak(profile, todayStr) >= THIRD_ASK_MIN_STREAK;
}

/** The closable home card: from the second practice day, but never on a day the learner was asked. */
export function isReminderCardDue(profile: LearnerProfile, todayStr: string): boolean {
  if (practisedDays(profile, todayStr) < REMINDER_ASK_MIN_DAYS) return false;
  return !wasAskedToday(profile, todayStr) && !isReminderAskDue(profile, todayStr);
}

/** Records one ask (whatever the answer); a "not now" also keeps the day it was declined. */
export function recordReminderAsk(profile: LearnerProfile, todayStr: string, isDeclined: boolean): LearnerProfile {
  return {
    ...profile,
    reminderAskCount: getReminderAskCount(profile) + 1,
    reminderLastAskedAtStr: todayStr,
    ...(isDeclined ? { reminderDeclinedAtStr: todayStr } : {}),
  };
}
