import { LearnerProfile } from '../types/learner';
import { getCurrentStreak } from './streak';

/**
 * A one-time reward for practising a few days in a row. It pays for practice, never for a setting:
 * a reward for turning on the daily reminder tied a gift to a permission
 * (docs/legal/child-facing-pro-review.md), so the reminder ask now only says it helps keep the streak.
 */
export const STREAK_REWARD_DAYS = 3;
export const STREAK_REWARD_DIAMONDS = 10;

/** Pays the streak reward once the streak reaches its goal; the same profile otherwise. */
export function applyStreakReward(profile: LearnerProfile, todayStr: string): LearnerProfile {
  if (profile.hasEarnedStreakReward) return profile;
  if (getCurrentStreak(profile, todayStr) < STREAK_REWARD_DAYS) return profile;
  return {
    ...profile,
    hasEarnedStreakReward: true,
    stats: { ...profile.stats, diamonds: profile.stats.diamonds + STREAK_REWARD_DIAMONDS },
  };
}
