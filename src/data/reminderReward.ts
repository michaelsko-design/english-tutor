import { LearnerProfile } from '../types/learner';

export const REMINDER_REWARD_DIAMONDS = 10;

/** The one-time diamonds for turning on the daily reminder; the same profile once they were paid. */
export function applyReminderReward(profile: LearnerProfile): LearnerProfile {
  if (profile.hasEarnedReminderReward) return profile;
  return {
    ...profile,
    hasEarnedReminderReward: true,
    stats: { ...profile.stats, diamonds: profile.stats.diamonds + REMINDER_REWARD_DIAMONDS },
  };
}
