import { describe, expect, it } from 'vitest';
import { LearnerProfile } from '../types/learner';
import {
  VAULT_DAILY_REWARD_WORDS,
  applyVocabPracticeReward,
  getTodayCounters,
  levelForXp,
  recordDailyActivity,
} from './progressRewards';

const TODAY = '2026-10-18';
const YESTERDAY = '2026-10-17';

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 10,
  gender: 'girl',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  isShabbatObserver: false,
  stats: {
    xp: 140,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 4,
    streakLastDateStr: YESTERDAY,
    totalActiveDays: 4,
    shabbatShieldActive: false,
    wordsMastered: 7,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: TODAY,
    missionsCompletedToday: 1,
    voiceWordsPracticedToday: 2,
    threeStarMissionsToday: 1,
  },
  createdAt: '2026-09-01T00:00:00.000Z',
};

describe('levelForXp', () => {
  it('never lowers the level', () => {
    expect(levelForXp(150, 1)).toBe(2);
    expect(levelForXp(10, 4)).toBe(4);
  });
});

describe('recordDailyActivity', () => {
  it('extends the streak on the first mission of a new day', () => {
    const profile = { ...baseProfile, dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY } };

    const result = recordDailyActivity(profile, { missions: 1, voiceWords: 0, threeStarMissions: 0 }, TODAY);

    expect(result.dailyCounters).toEqual({
      dateStr: TODAY,
      missionsCompletedToday: 1,
      voiceWordsPracticedToday: 0,
      threeStarMissionsToday: 0,
    });
    expect(result.stats.streakDays).toBe(5);
    expect(result.stats.streakLastDateStr).toBe(TODAY);
  });

  it('forgets yesterday’s claimed quests on a new day', () => {
    const profile = {
      ...baseProfile,
      claimedDailyQuestIds: ['quest-daily-mission'],
      dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY },
    };

    const result = recordDailyActivity(profile, { missions: 0, voiceWords: 1, threeStarMissions: 0 }, TODAY);

    expect(result.claimedDailyQuestIds).toEqual([]);
  });

  it('keeps today’s claimed quests', () => {
    const profile = { ...baseProfile, claimedDailyQuestIds: ['quest-daily-mission'] };

    const result = recordDailyActivity(profile, { missions: 1, voiceWords: 0, threeStarMissions: 0 }, TODAY);

    expect(result.claimedDailyQuestIds).toEqual(['quest-daily-mission']);
  });
});

describe('getTodayCounters', () => {
  it('shows zero counters and no claims when the stored ones are from an earlier day', () => {
    const profile = {
      ...baseProfile,
      claimedDailyQuestIds: ['quest-daily-mission'],
      dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY },
    };

    expect(getTodayCounters(profile, TODAY)).toEqual({
      counters: { dateStr: TODAY, missionsCompletedToday: 0, voiceWordsPracticedToday: 0, threeStarMissionsToday: 0 },
      claimedQuestIds: [],
    });
  });

  it('shows today’s counters and claims', () => {
    const profile = { ...baseProfile, claimedDailyQuestIds: ['quest-daily-mission'] };

    expect(getTodayCounters(profile, TODAY)).toEqual({
      counters: baseProfile.dailyCounters,
      claimedQuestIds: ['quest-daily-mission'],
    });
  });
});

describe('applyVocabPracticeReward', () => {
  it('adds a voice word to today’s counter, plus the XP and diamonds', () => {
    const result = applyVocabPracticeReward(baseProfile, 'apple', 10, 1, TODAY).profile;

    expect(result.dailyCounters).toEqual({ ...baseProfile.dailyCounters, voiceWordsPracticedToday: 3 });
    expect(result.vaultPractice).toEqual({ dateStr: TODAY, words: ['apple'] });
    expect(result.stats.xp).toBe(150);
    expect(result.stats.level).toBe(2);
    expect(result.stats.diamonds).toBe(51);
  });

  it('starts new counters when the stored ones are from an earlier day', () => {
    const profile = { ...baseProfile, dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY } };

    const result = applyVocabPracticeReward(profile, 'apple', 10, 1, TODAY).profile;

    expect(result.dailyCounters).toEqual({
      dateStr: TODAY,
      missionsCompletedToday: 0,
      voiceWordsPracticedToday: 1,
      threeStarMissionsToday: 0,
    });
  });

  it('does not extend the streak, since vocabulary practice is not a mission', () => {
    const profile = { ...baseProfile, dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY } };

    expect(applyVocabPracticeReward(profile, 'apple', 10, 1, TODAY).profile.stats.streakDays).toBe(4);
  });

  it('still adds to the stored (not shown) lifetime words counter', () => {
    expect(applyVocabPracticeReward(baseProfile, 'apple', 10, 1, TODAY).profile.stats.wordsMastered).toBe(8);
  });

  it('does not change the profile it was given', () => {
    const snapshot = JSON.stringify(baseProfile);

    applyVocabPracticeReward(baseProfile, 'apple', 10, 1, TODAY);

    expect(JSON.stringify(baseProfile)).toBe(snapshot);
  });

  it('rewards each word only once a day', () => {
    const once = applyVocabPracticeReward(baseProfile, 'apple', 10, 1, TODAY);
    const twice = applyVocabPracticeReward(once.profile, 'Apple', 10, 1, TODAY);

    expect(once.isRewarded).toBe(true);
    expect(twice.isRewarded).toBe(false);
    expect(twice.profile).toBe(once.profile);
  });

  it('rewards the same word again on a new day', () => {
    const profile = { ...baseProfile, vaultPractice: { dateStr: YESTERDAY, words: ['apple'] } };

    const result = applyVocabPracticeReward(profile, 'apple', 10, 1, TODAY);

    expect(result.isRewarded).toBe(true);
    expect(result.profile.vaultPractice).toEqual({ dateStr: TODAY, words: ['apple'] });
  });

  it('stops rewarding after the daily word limit', () => {
    const words = Array.from({ length: VAULT_DAILY_REWARD_WORDS }, (_, i) => `word${i}`);
    const profile = { ...baseProfile, vaultPractice: { dateStr: TODAY, words } };

    const result = applyVocabPracticeReward(profile, 'apple', 10, 1, TODAY);

    expect(result.isRewarded).toBe(false);
    expect(result.profile).toBe(profile);
  });
});
