import type { LearnerGender } from '../types/learner';
import type { ReminderHint } from './reminderSchedule';

/** What a reminder can name: a hint the app stored, or a friend's contest the cron found */
export type ReminderTopic = ReminderHint | 'friend-contest';

/**
 * The daily reminder's text, sent by the cron (api/_lib/streakReminder.ts). Kept in src so app code
 * and tests can read it.
 * Legal: a service message only. No Pro, prices or offers ever go in here (Spam Law §30A covers
 * advertising messages); reminderMessage.test.ts fails the build if they do.
 * It names something real that waits in the app (data/reminderSchedule.ts) instead of the streak
 * when there is one, and never warns about losing the streak (Consumer Protection s.3(2)).
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
  /** Today's pick of what waits (`pickReminderHint`), or a friend's contest */
  hint?: ReminderTopic;
  /** The next mission's story hook from the curriculum (gender-neutral plural Hebrew) */
  nextMissionHookHe?: string;
  /** The new pack's Hebrew title, for the `new-pack` hint */
  newPackTitleHe?: string;
}

function buildHintBody(hint: ReminderTopic, isGirl: boolean, facts: ReminderMessageFacts): string {
  const come = isGirl ? 'בואי' : 'בוא';
  if (hint === 'quick-review') return `כמה מילים מחכות לחזרה של דקה. ${come} נסדר אותן!`;
  // No friend's name: the push shows on a lock screen
  if (hint === 'friend-contest') return `תחרות עם חבר או חברה מחכה לך. ${come} לשחק!`;
  if (hint === 'room-item') return `פריט חדש מחכה לך בחדר. ${come} למצוא לו מקום!`;
  if (hint === 'new-pack') {
    return facts.newPackTitleHe
      ? `חדש באפליקציה: ${facts.newPackTitleHe}! ${come} לראות את המשימות החדשות.`
      : `משימות חדשות נוספו למפה שלך. ${come} לראות!`;
  }
  return facts.nextMissionHookHe ?? `המשימה הבאה שלך מחכה. ${come} נצא לדרך!`;
}

/** Gender-aware Hebrew text; the streak count is only a number so there is no English to isolate. */
export function buildReminderMessage(facts: ReminderMessageFacts, kind: ReminderKind): ReminderMessage {
  const isGirl = facts.gender === 'girl';
  if (facts.hint) return { title: REMINDER_TITLE, body: buildHintBody(facts.hint, isGirl, facts) };
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
