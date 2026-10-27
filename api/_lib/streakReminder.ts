/**
 * Who gets a streak reminder right now. Pure functions so the daily cron can be tested without a
 * clock or a network. Times are Israel time: the learner's timezone is not stored.
 */
import { isStreakProtectedDay } from '../../src/data/streak.js';
import { addDays } from '../../src/utils/dates.js';

export const REMINDER_TIME_ZONE = 'Asia/Jerusalem';

export interface ReminderSubscriber {
  id: string;
  streakDays: number;
  streakLastDateStr?: string;
  isShabbatObserver: boolean;
  gender?: 'girl' | 'boy';
}

/** The calendar day (YYYY-MM-DD) in Israel at the given instant. */
export function getIsraelToday(nowMs: number): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REMINDER_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(nowMs));
  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** True when every day between the last practice and today needed no session (Shabbat for observers). */
function isStreakAlive(lastDateStr: string, todayStr: string, isShabbatObserver: boolean): boolean {
  for (let day = addDays(lastDateStr, 1); day < todayStr; day = addDays(day, 1)) {
    if (!isStreakProtectedDay(day, isShabbatObserver)) return false;
  }
  return true;
}

/** A reminder goes out every day, unless the learner already practised today or it is Friday/Shabbat for an observer. */
export function isReminderDue(subscriber: ReminderSubscriber, todayStr: string): boolean {
  if (subscriber.streakLastDateStr && subscriber.streakLastDateStr >= todayStr) return false;
  return !isStreakProtectedDay(todayStr, subscriber.isShabbatObserver);
}

export type ReminderKind = 'streak' | 'comeback';

/** 'streak' while the streak is alive and can still be saved today, otherwise 'comeback'. */
export function getReminderKind(subscriber: ReminderSubscriber, todayStr: string): ReminderKind {
  const { streakDays, streakLastDateStr, isShabbatObserver } = subscriber;
  return streakDays >= 1 && streakLastDateStr && isStreakAlive(streakLastDateStr, todayStr, isShabbatObserver)
    ? 'streak'
    : 'comeback';
}

export interface ReminderMessage {
  title: string;
  body: string;
}

/** Gender-aware Hebrew text; the streak count is only a number so there is no English to isolate. */
export function buildReminderMessage(subscriber: ReminderSubscriber, kind: ReminderKind): ReminderMessage {
  const isGirl = subscriber.gender === 'girl';
  const title = 'EnglishVibe 🔥';
  if (kind === 'streak') {
    return {
      title,
      body: isGirl
        ? `המשיכי כך! הרצף שלך של ${subscriber.streakDays} ימים מחכה לך. תרגלי קצת היום ותשמרי עליו.`
        : `המשך כך! הרצף שלך של ${subscriber.streakDays} ימים מחכה לך. תרגל קצת היום ותשמור עליו.`,
    };
  }
  return {
    title,
    body: isGirl
      ? 'עבר קצת זמן מאז שתרגלת. בואי נחזור לזה, רק 5 דקות!'
      : 'עבר קצת זמן מאז שתרגלת. בוא נחזור לזה, רק 5 דקות!',
  };
}
