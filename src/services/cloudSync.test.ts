import { describe, expect, it, vi } from 'vitest';
import { LearnerProfile, PlacementResult } from '../types/learner';

vi.mock('./firebase', () => ({ db: null }));

const { mergeLearnerProfiles } = await import('./cloudSync');

function makePlacement(completedAt: string, grade: 'grade-4' | 'grade-6'): PlacementResult {
  return {
    completedAt,
    estimatedGradeId: grade,
    recommendedGradeId: grade,
    recommendedTier: 'challenger',
    correctCount: 6,
    totalQuestions: 10,
  };
}

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Ido',
  age: 10,
  gender: 'boy',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-10T00:00:00.000Z',
};

describe('mergeLearnerProfiles placementResult', () => {
  const older = makePlacement('2026-10-05T00:00:00.000Z', 'grade-4');
  const newer = makePlacement('2026-10-15T00:00:00.000Z', 'grade-6');

  it('keeps the newer local result over an older cloud result', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, placementResult: newer },
      { ...baseProfile, placementResult: older }
    );
    expect(merged.placementResult).toEqual(newer);
  });

  it('keeps the newer cloud result over an older local result', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, placementResult: older },
      { ...baseProfile, placementResult: newer }
    );
    expect(merged.placementResult).toEqual(newer);
  });

  it('keeps a result that exists on only one side', () => {
    const merged = mergeLearnerProfiles(baseProfile, { ...baseProfile, placementResult: older });
    expect(merged.placementResult).toEqual(older);
  });

  it('leaves the field out when neither side has taken the test', () => {
    const merged = mergeLearnerProfiles(baseProfile, baseProfile);
    expect('placementResult' in merged).toBe(false);
  });
});
