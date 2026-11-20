import { LearnerProfile } from '../types/learner';
import { getCurrentStreak } from './streak';

/**
 * A one-time reward for practising a few days in a row. It pays for practice, never for a setting:
 * a reward for turning on the daily reminder tied a gift to a permission
 * (docs/legal/child-facing-pro-review.md), so the reminder ask now only says it helps keep the streak.
 */
export const STREAK_REWARD_DAYS = 3;
export const STREAK_REWARD_DIAMONDS = 10;

/** The one-time card that says the reward was paid (gender-neutral; the 🔊 reads the spoken line to grades 1–2) */
export const STREAK_REWARD_TITLE_HE = `כל הכבוד! ${STREAK_REWARD_DAYS} ימים ברצף 🔥`;
export const STREAK_REWARD_BODY_HE = `מתנה על הרצף: ${STREAK_REWARD_DIAMONDS} יהלומים 💎`;
/** In the Hebrew corpus (scripts/tts/hebrewCorpus.ts); numbers as words so the clip reads them right */
export const STREAK_REWARD_SPOKEN_HE = 'כל הכבוד! שלושה ימים ברצף. מתנה על הרצף: עשרה יהלומים.';

const noticeSeenKey = (accountKey: string) => `english_tutor_streak_reward_seen_${accountKey}`;

/** The card shows once per account on this device, after the reward was paid (on any device) */
export function hasSeenStreakRewardNotice(accountKey: string): boolean {
  try {
    return localStorage.getItem(noticeSeenKey(accountKey)) === '1';
  } catch {
    return false;
  }
}

export function markStreakRewardNoticeSeen(accountKey: string): void {
  try {
    localStorage.setItem(noticeSeenKey(accountKey), '1');
  } catch {
    // Storage blocked: the card may show again, which is harmless
  }
}

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
