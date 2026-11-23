import type { LearnerGender } from '../types/learner';

/**
 * The daily reminder's text, sent by the cron (api/_lib/streakReminder.ts). Kept in src so app code
 * and tests can read it.
 * Legal: a service message only. No Pro, prices or offers ever go in here (Spam Law §30A covers
 * advertising messages); reminderMessage.test.ts fails the build if they do.
 */

export const REMINDER_TITLE = 'EnglishVibe 🔥';

export type ReminderKind = 'streak' | 'comeback';

export interface ReminderMessage {
  title: string;
  body: string;
}

export interface ReminderMessageFacts {
  streakDays: number;
  gender?: LearnerGender;
}

/** Gender-aware Hebrew text; the streak count is only a number so there is no English to isolate. */
export function buildReminderMessage(facts: ReminderMessageFacts, kind: ReminderKind): ReminderMessage {
  const isGirl = facts.gender === 'girl';
  if (kind === 'streak') {
    // "של 1 ימים" is not Hebrew: a one-day streak is named without a count
    const streakHe = facts.streakDays > 1 ? `הרצף שלך של ${facts.streakDays} ימים` : 'הרצף שלך';
    return {
      title: REMINDER_TITLE,
      body: isGirl
        ? `המשיכי כך! ${streakHe} מחכה לך. תרגלי קצת היום ותשמרי עליו.`
        : `המשך כך! ${streakHe} מחכה לך. תרגל קצת היום ותשמור עליו.`,
    };
  }
  return {
    title: REMINDER_TITLE,
    body: isGirl
      ? 'עבר קצת זמן מאז שתרגלת. בואי נחזור לזה, רק 5 דקות!'
      : 'עבר קצת זמן מאז שתרגלת. בוא נחזור לזה, רק 5 דקות!',
  };
}
