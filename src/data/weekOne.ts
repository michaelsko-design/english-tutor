import { LearnerProfile } from '../types/learner';
import { addDays, daysBetween, toLocalDateStr } from '../utils/dates';
import { getCurrentStreak } from './streak';

/** Days after sign-up when the first-week summary first appears */
export const WEEK_ONE_DAYS = 7;
/** After this many days the summary is no longer offered: it would not be "the first week" any more */
export const WEEK_ONE_LAST_DAY = 13;

export interface WeekOneSummary {
  activeDays: number;
  missions: number;
  stars: number;
  streakDays: number;
}

/**
 * The summary of a learner's first seven days, shown once on the home screen from day 7 to day 13
 * after they joined (dates are local calendar days). Nothing to show when they did nothing that week,
 * and old learners, who are past day 13, never see it.
 */
export function getWeekOneSummary(profile: LearnerProfile, todayStr: string): WeekOneSummary | null {
  if (profile.hasSeenWeekOneSummary || !profile.createdAt) return null;
  const joinedStr = toLocalDateStr(new Date(profile.createdAt));
  const daysSinceJoining = daysBetween(joinedStr, todayStr);
  if (daysSinceJoining < WEEK_ONE_DAYS || daysSinceJoining > WEEK_ONE_LAST_DAY) return null;

  const lastDayStr = addDays(joinedStr, WEEK_ONE_DAYS - 1);
  const firstWeek = (profile.activityLog ?? []).filter((entry) => entry.dateStr >= joinedStr && entry.dateStr <= lastDayStr);
  const active = firstWeek.filter((entry) => entry.sessions > 0 || entry.starsGained > 0);
  if (active.length === 0) return null;

  return {
    activeDays: active.length,
    missions: firstWeek.reduce((sum, entry) => sum + entry.sessions, 0),
    stars: firstWeek.reduce((sum, entry) => sum + entry.starsGained, 0),
    streakDays: getCurrentStreak(profile, todayStr),
  };
}

export function markWeekOneSeen(profile: LearnerProfile): LearnerProfile {
  return profile.hasSeenWeekOneSummary ? profile : { ...profile, hasSeenWeekOneSummary: true };
}
