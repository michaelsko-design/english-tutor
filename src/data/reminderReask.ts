import type { LearnerProfile } from '../types/learner';
import { getCurrentStreak } from './streak';

/**
 * When to offer the daily reminder again. The first-win screen asks once; a learner who said
 * "not now" is asked one more time after a mission on a later day, once they have practised on two
 * days or more (they are coming back, so a reminder is worth more to them). The closable home card
 * waits for the same second day, and after a "not now" it waits until that second ask was shown,
 * so the learner never sees the reminder right after declining it.
 */

export const REMINDER_REASK_MIN_DAYS = 2;

/** The best measure of "came back": the live streak or the total days practised */
export function practisedDays(profile: LearnerProfile, todayStr: string): number {
  return Math.max(getCurrentStreak(profile, todayStr), profile.stats.totalActiveDays ?? 0);
}

/** The one-time second ask is due (the browser and the reminder state are checked separately). */
export function shouldReaskReminder(profile: LearnerProfile, todayStr: string): boolean {
  const declinedOn = profile.reminderDeclinedAtStr;
  if (!declinedOn || profile.hasSeenReminderReask) return false;
  return declinedOn < todayStr && practisedDays(profile, todayStr) >= REMINDER_REASK_MIN_DAYS;
}

/** The home reminder card may show (the browser and the reminder state are checked separately). */
export function isReminderCardDue(profile: LearnerProfile, todayStr: string): boolean {
  if (practisedDays(profile, todayStr) < REMINDER_REASK_MIN_DAYS) return false;
  return !profile.reminderDeclinedAtStr || Boolean(profile.hasSeenReminderReask);
}

export const markReminderReaskSeen = (profile: LearnerProfile): LearnerProfile =>
  profile.hasSeenReminderReask ? profile : { ...profile, hasSeenReminderReask: true };
