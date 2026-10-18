import { describe, expect, it } from 'vitest';
import { LearnerProfile } from '../types/learner';
import { applyVocabPracticeReward, levelForXp, recordDailyActivity } from './progressRewards';

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
  });
});

describe('applyVocabPracticeReward', () => {
  it('adds a voice word to today’s counter, plus the XP and diamonds', () => {
    const result = applyVocabPracticeReward(baseProfile, 10, 1, TODAY);

    expect(result.dailyCounters).toEqual({ ...baseProfile.dailyCounters, voiceWordsPracticedToday: 3 });
    expect(result.stats.xp).toBe(150);
    expect(result.stats.level).toBe(2);
    expect(result.stats.diamonds).toBe(51);
  });

  it('starts new counters when the stored ones are from an earlier day', () => {
    const profile = { ...baseProfile, dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY } };

    const result = applyVocabPracticeReward(profile, 10, 1, TODAY);

    expect(result.dailyCounters).toEqual({
      dateStr: TODAY,
      missionsCompletedToday: 0,
      voiceWordsPracticedToday: 1,
      threeStarMissionsToday: 0,
    });
  });

  it('does not extend the streak, since vocabulary practice is not a mission', () => {
    const profile = { ...baseProfile, dailyCounters: { ...baseProfile.dailyCounters, dateStr: YESTERDAY } };

    expect(applyVocabPracticeReward(profile, 10, 1, TODAY).stats.streakDays).toBe(4);
  });

  it('still adds to the stored (not shown) lifetime words counter', () => {
    expect(applyVocabPracticeReward(baseProfile, 10, 1, TODAY).stats.wordsMastered).toBe(8);
  });

  it('does not change the profile it was given', () => {
    const snapshot = JSON.stringify(baseProfile);

    applyVocabPracticeReward(baseProfile, 10, 1, TODAY);

    expect(JSON.stringify(baseProfile)).toBe(snapshot);
  });
});
