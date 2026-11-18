import type { LearnerGender, LearnerProfile } from '../types/learner';
import { APP_NAME } from '../config/appInfo';

/**
 * "Show your parents": short progress messages a learner sends a parent, each ending with the parent
 * link (a pairing code, or the portal for a parent who is already paired), plus the one-time diamonds
 * for sharing the first win. The app can't know a message was really sent, so the gift goes on the tap.
 */

export const SHOW_OFF_DIAMONDS = 20;

/** The one-time diamonds for sharing the first win with a parent; the same profile once they were paid. */
export function applyShowOffReward(profile: LearnerProfile): LearnerProfile {
  if (profile.hasEarnedShowOffReward) return profile;
  return {
    ...profile,
    hasEarnedShowOffReward: true,
    stats: { ...profile.stats, diamonds: profile.stats.diamonds + SHOW_OFF_DIAMONDS },
  };
}

const fallbackName = (gender: LearnerGender): string => (gender === 'girl' ? 'הילדה שלך' : 'הילד שלך');

const displayName = (name: string, gender: LearnerGender): string => name.trim() || fallbackName(gender);

/** "Noa finished her first mission today": a lesson for grades 1–2, a mission for everyone else. */
export function buildFirstWinSummaryHe(input: {
  name: string;
  gender: LearnerGender;
  streakDays: number;
  isLesson: boolean;
}): string {
  const isGirl = input.gender === 'girl';
  const finished = isGirl ? 'סיימה' : 'סיים';
  const step = input.isLesson ? (isGirl ? 'את השיעור הראשון שלה' : 'את השיעור הראשון שלו') : isGirl ? 'את המשימה הראשונה שלה' : 'את המשימה הראשונה שלו';
  return `${displayName(input.name, input.gender)} ${finished} היום ${step} באנגלית ב-${APP_NAME}! ⭐⭐⭐\nיום ${input.streakDays} ברצף 🔥`;
}

/** "Noa took the level test: level of grade 4, practising grade 4 as a Challenger" */
export function buildPlacementSummaryHe(input: {
  name: string;
  gender: LearnerGender;
  levelHe: string;
  practiceGradeHe: string;
  tierHe: string;
}): string {
  const did = input.gender === 'girl' ? 'עשתה' : 'עשה';
  return `${displayName(input.name, input.gender)} ${did} מבחן רמה באנגלית ב-${APP_NAME} 🎯\nהרמה: ${input.levelHe}\nממשיכים לתרגל: ${input.practiceGradeHe}, ${input.tierHe}`;
}

/** The summary, then the parent link: a code to pair with, or the portal for a paired parent. */
export function buildParentShareMessageHe(summaryHe: string, link: { url: string; code: string | null }): string {
  const invite = link.code
    ? `רוצים לראות את ההתקדמות כל שבוע? באזור ההורים, עם קוד ההורים: ${link.code}`
    : 'כל ההתקדמות באזור ההורים:';
  return `${summaryHe}\n\n${invite}\n${link.url}`;
}
