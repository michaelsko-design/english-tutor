import { describe, expect, it } from 'vitest';
import { advanceStreak, getCurrentStreak, getStreakShieldsLeft, mergeStreakStats } from './streak';
import { ActivityLogEntry, LearnerProfile, LearnerStats } from '../types/learner';

// 2026-10-15 is a Thursday, 10-16 Friday, 10-17 Shabbat, 10-18 Sunday, 10-19 Monday.
const baseStats: LearnerStats = {
  xp: 0,
  level: 1,
  stars: 0,
  maxPossibleStars: 36,
  diamonds: 50,
  streakDays: 0,
  shabbatShieldActive: true,
  wordsMastered: 0,
  missionsCompleted: 0,
};

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 9,
  gender: 'girl',
  gradeId: 'grade-4',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: baseStats,
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: { dateStr: '2026-10-19', missionsCompletedToday: 0, voiceWordsPracticedToday: 0, threeStarMissionsToday: 0 },
  isShabbatObserver: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

function withStreak(stats: Partial<LearnerStats>, profile: Partial<LearnerProfile> = {}): LearnerProfile {
  return { ...baseProfile, ...profile, stats: { ...baseStats, ...stats } };
}

function logDay(dateStr: string, sessions = 1): ActivityLogEntry {
  return {
    dateStr,
    sessions,
    voiceWords: 0,
    threeStarSessions: 0,
    xpEarned: 0,
    starsGained: 0,
    missionStars: {},
    firstCompletedIds: [],
  };
}

describe('advanceStreak', () => {
  it('starts a streak of 1 on the first ever learning day', () => {
    const stats = advanceStreak(withStreak({ streakLastDateStr: undefined, totalActiveDays: 0 }), '2026-10-19');
    expect(stats.streakDays).toBe(1);
    expect(stats.streakLastDateStr).toBe('2026-10-19');
    expect(stats.totalActiveDays).toBe(1);
  });

  it('extends the streak after learning yesterday', () => {
    const stats = advanceStreak(withStreak({ streakDays: 4, streakLastDateStr: '2026-10-18', totalActiveDays: 9 }), '2026-10-19');
    expect(stats.streakDays).toBe(5);
    expect(stats.totalActiveDays).toBe(10);
  });

  it('does nothing on a second session of the same day', () => {
    const profile = withStreak({ streakDays: 4, streakLastDateStr: '2026-10-19', totalActiveDays: 9 });
    expect(advanceStreak(profile, '2026-10-19')).toEqual(profile.stats);
  });

  it('starts again at 1 after a missed weekday', () => {
    const stats = advanceStreak(withStreak({ streakDays: 6, streakLastDateStr: '2026-10-15', totalActiveDays: 6 }), '2026-10-18');
    expect(stats.streakDays).toBe(1);
  });

  it('skips Friday and Shabbat for a Shabbat observer', () => {
    const profile = withStreak(
      { streakDays: 6, streakLastDateStr: '2026-10-15', totalActiveDays: 6 },
      { isShabbatObserver: true }
    );
    expect(advanceStreak(profile, '2026-10-18').streakDays).toBe(7);
  });

  it('uses up a shield for each missed day it covers', () => {
    const profile = withStreak({
      streakDays: 6,
      streakLastDateStr: '2026-10-16',
      streakShieldsBought: 2,
      streakShieldsUsed: 0,
      totalActiveDays: 6,
    });
    const stats = advanceStreak(profile, '2026-10-19');
    expect(stats.streakDays).toBe(7);
    expect(stats.streakShieldsUsed).toBe(2);
  });

  it('breaks the streak when there are fewer shields than missed days, keeping the shields', () => {
    const profile = withStreak({
      streakDays: 6,
      streakLastDateStr: '2026-10-15',
      streakShieldsBought: 1,
      streakShieldsUsed: 0,
      totalActiveDays: 6,
    });
    const stats = advanceStreak(profile, '2026-10-19');
    expect(stats.streakDays).toBe(1);
    expect(stats.streakShieldsUsed).toBe(0);
  });

  it('moves the old lifetime count to total active days and rebuilds the streak from the log', () => {
    // An old profile: streakDays counted every active day ever, and there is no streak date.
    const profile = withStreak(
      { streakDays: 40 },
      { activityLog: [logDay('2026-10-10'), logDay('2026-10-17'), logDay('2026-10-18')] }
    );
    const stats = advanceStreak(profile, '2026-10-19');
    expect(stats.streakDays).toBe(3);
    expect(stats.totalActiveDays).toBe(41);
  });

  it('counts an old shop shield as one shield', () => {
    const profile = withStreak({ streakDays: 3 }, { unlockedRewardIds: ['boost-streak-shield'] });
    expect(getStreakShieldsLeft(profile)).toBe(1);
  });

  it('does not change the profile it was given', () => {
    const profile = withStreak({ streakDays: 4, streakLastDateStr: '2026-10-18', totalActiveDays: 9 });
    const before = JSON.stringify(profile);
    advanceStreak(profile, '2026-10-19');
    expect(JSON.stringify(profile)).toBe(before);
  });
});

describe('getCurrentStreak', () => {
  it('shows the streak while today can still extend it', () => {
    expect(getCurrentStreak(withStreak({ streakDays: 5, streakLastDateStr: '2026-10-18' }), '2026-10-19')).toBe(5);
  });

  it('shows 0 once a weekday was missed', () => {
    expect(getCurrentStreak(withStreak({ streakDays: 5, streakLastDateStr: '2026-10-15' }), '2026-10-19')).toBe(0);
  });

  it('keeps the streak over Friday and Shabbat for an observer', () => {
    const profile = withStreak({ streakDays: 5, streakLastDateStr: '2026-10-15' }, { isShabbatObserver: true });
    expect(getCurrentStreak(profile, '2026-10-18')).toBe(5);
  });

  it('keeps the streak when shields cover the missed days', () => {
    const profile = withStreak({
      streakDays: 5,
      streakLastDateStr: '2026-10-16',
      streakShieldsBought: 2,
      streakShieldsUsed: 0,
    });
    expect(getCurrentStreak(profile, '2026-10-19')).toBe(5);
  });

  it('rebuilds an old profile’s streak from the activity log', () => {
    const profile = withStreak({ streakDays: 40 }, { activityLog: [logDay('2026-10-17'), logDay('2026-10-18')] });
    expect(getCurrentStreak(profile, '2026-10-19')).toBe(2);
  });

  it('ignores log days without a finished session', () => {
    const profile = withStreak({ streakDays: 40 }, { activityLog: [logDay('2026-10-17'), logDay('2026-10-18', 0)] });
    expect(getCurrentStreak(profile, '2026-10-19')).toBe(0);
  });
});

describe('mergeStreakStats', () => {
  it('keeps the streak of the device that learned most recently', () => {
    const merged = mergeStreakStats(
      { ...baseStats, streakDays: 9, streakLastDateStr: '2026-10-15' },
      { ...baseStats, streakDays: 1, streakLastDateStr: '2026-10-19' }
    );
    expect(merged.streakDays).toBe(1);
    expect(merged.streakLastDateStr).toBe('2026-10-19');
  });

  it('keeps the higher streak on the same day', () => {
    const merged = mergeStreakStats(
      { ...baseStats, streakDays: 3, streakLastDateStr: '2026-10-19' },
      { ...baseStats, streakDays: 4, streakLastDateStr: '2026-10-19' }
    );
    expect(merged.streakDays).toBe(4);
  });

  it('prefers a dated streak over an old undated one', () => {
    const merged = mergeStreakStats(
      { ...baseStats, streakDays: 40 },
      { ...baseStats, streakDays: 2, streakLastDateStr: '2026-10-19', totalActiveDays: 41 }
    );
    expect(merged.streakDays).toBe(2);
    expect(merged.totalActiveDays).toBe(41);
  });

  it('takes the larger shield counters', () => {
    const merged = mergeStreakStats(
      { ...baseStats, streakShieldsBought: 2, streakShieldsUsed: 1 },
      { ...baseStats, streakShieldsBought: 1, streakShieldsUsed: 0 }
    );
    expect(merged.streakShieldsBought).toBe(2);
    expect(merged.streakShieldsUsed).toBe(1);
  });

  it('keeps old undated streaks as before (the higher one)', () => {
    const merged = mergeStreakStats({ ...baseStats, streakDays: 3 }, { ...baseStats, streakDays: 7 });
    expect(merged.streakDays).toBe(7);
    expect(merged.streakLastDateStr).toBeUndefined();
  });
});
