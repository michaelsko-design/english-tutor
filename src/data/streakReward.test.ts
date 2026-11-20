import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import type { LearnerProfile } from '../types/learner';
import { recordDailyActivity } from './progressRewards';
import { applyStreakReward, STREAK_REWARD_DAYS, STREAK_REWARD_DIAMONDS } from './streakReward';

const TODAY = '2026-11-18'; // a Wednesday
const MISSION = { missions: 1, voiceWords: 0, threeStarMissions: 0 };

function withStreak(days: number, lastDateStr: string, overrides: Partial<LearnerProfile> = {}): LearnerProfile {
  const base = makeProfile(overrides);
  return { ...base, stats: { ...base.stats, streakDays: days, streakLastDateStr: lastDateStr, totalActiveDays: days } };
}

describe('applyStreakReward', () => {
  it('pays the diamonds once the streak reaches its goal, and marks the profile', () => {
    const profile = withStreak(STREAK_REWARD_DAYS, TODAY);
    const paid = applyStreakReward(profile, TODAY);

    expect(paid.stats.diamonds).toBe(profile.stats.diamonds + STREAK_REWARD_DIAMONDS);
    expect(paid.hasEarnedStreakReward).toBe(true);
    expect(profile.hasEarnedStreakReward).toBeUndefined();
  });

  it('pays nothing before the goal', () => {
    const profile = withStreak(STREAK_REWARD_DAYS - 1, TODAY);

    expect(applyStreakReward(profile, TODAY)).toBe(profile);
  });

  it('pays nothing the second time', () => {
    const paid = applyStreakReward(withStreak(STREAK_REWARD_DAYS, TODAY), TODAY);

    expect(applyStreakReward(paid, TODAY)).toBe(paid);
  });

  it('does not depend on the old reminder gift (reminders on or off)', () => {
    const remindedBefore = withStreak(STREAK_REWARD_DAYS, TODAY, { hasEarnedReminderReward: true });

    expect(applyStreakReward(remindedBefore, TODAY).hasEarnedStreakReward).toBe(true);
  });
});

describe('recordDailyActivity and the streak reward', () => {
  it('pays it with the first mission of the day that brings the streak to the goal', () => {
    const profile = withStreak(STREAK_REWARD_DAYS - 1, '2026-11-17', { isShabbatObserver: false });
    const result = recordDailyActivity(profile, MISSION, TODAY);

    expect(result.stats.streakDays).toBe(STREAK_REWARD_DAYS);
    expect(result.hasEarnedStreakReward).toBe(true);
    expect(result.stats.diamonds).toBe(profile.stats.diamonds + STREAK_REWARD_DIAMONDS);
  });

  it('does not pay it twice on later missions', () => {
    const profile = withStreak(STREAK_REWARD_DAYS - 1, '2026-11-17', { isShabbatObserver: false });
    const first = recordDailyActivity(profile, MISSION, TODAY);
    const second = recordDailyActivity(first, MISSION, TODAY);

    expect(second.stats.diamonds).toBe(first.stats.diamonds);
  });
});
