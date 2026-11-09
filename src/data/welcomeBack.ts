import { LearnerProfile } from '../types/learner';

export const WELCOME_BACK_DIAMONDS = 20;

/**
 * The day-2 "welcome back" gift, for a new learner who finished one active day and now returns on a
 * later one (the next day or after a gap). Learners with more than one active day are not new, and a
 * claimed gift is never offered again. Dates are local calendar days (`utils/dates.ts`).
 */
export function isWelcomeBackDue(profile: LearnerProfile, todayStr: string): boolean {
  if (profile.hasClaimedWelcomeBack) return false;
  const { totalActiveDays, streakLastDateStr } = profile.stats;
  if (totalActiveDays !== 1 || !streakLastDateStr) return false;
  return streakLastDateStr < todayStr;
}

/** The one-time gems for coming back; the same profile once they were paid. */
export function applyWelcomeBack(profile: LearnerProfile): LearnerProfile {
  if (profile.hasClaimedWelcomeBack) return profile;
  return {
    ...profile,
    hasClaimedWelcomeBack: true,
    stats: { ...profile.stats, diamonds: profile.stats.diamonds + WELCOME_BACK_DIAMONDS },
  };
}
