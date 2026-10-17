import { describe, expect, it, vi } from 'vitest';
import { ExamPlanDay, ExamPrepPlan, LearnerProfile, PlacementResult } from '../types/learner';

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

function makeExamPlan(id: string, createdAt: string, days: ExamPlanDay[] = []): ExamPrepPlan {
  return {
    id,
    createdAt,
    gradeId: 'grade-5',
    examDateStr: '2026-10-25',
    unitNumbers: [1],
    skills: ['grammar'],
    days,
  };
}

function makeDay(dayIndex: number, extra: Partial<ExamPlanDay> = {}): ExamPlanDay {
  return { dayIndex, dateStr: '2026-10-20', kind: 'practice', focus: [], ...extra };
}

describe('mergeLearnerProfiles examPrep', () => {
  it('keeps the newer plan when the plan ids differ', () => {
    const older = makeExamPlan('a', '2026-10-01T00:00:00.000Z');
    const newer = makeExamPlan('b', '2026-10-12T00:00:00.000Z');

    expect(mergeLearnerProfiles({ ...baseProfile, examPrep: older }, { examPrep: newer }).examPrep).toEqual(newer);
    expect(mergeLearnerProfiles({ ...baseProfile, examPrep: newer }, { examPrep: older }).examPrep).toEqual(newer);
  });

  it('merges progress of the same plan from both devices', () => {
    const local = {
      ...makeExamPlan('a', '2026-10-01T00:00:00.000Z', [
        makeDay(0, { completedAt: '2026-10-20T10:00:00.000Z', scorePercent: 60 }),
        makeDay(1),
      ]),
      bestMockScore: 50,
    };
    const cloud = {
      ...makeExamPlan('a', '2026-10-01T00:00:00.000Z', [
        makeDay(0, { completedAt: '2026-10-20T08:00:00.000Z', scorePercent: 90 }),
        makeDay(1, { completedAt: '2026-10-21T08:00:00.000Z', scorePercent: 70 }),
      ]),
      bestMockScore: 80,
      certificateEarnedAt: '2026-10-22T08:00:00.000Z',
      archivedAt: '2026-10-26T08:00:00.000Z',
    };
    const merged = mergeLearnerProfiles({ ...baseProfile, examPrep: local }, { examPrep: cloud }).examPrep;

    expect(merged?.days[0]).toMatchObject({ completedAt: '2026-10-20T08:00:00.000Z', scorePercent: 90 });
    expect(merged?.days[1]).toMatchObject({ completedAt: '2026-10-21T08:00:00.000Z', scorePercent: 70 });
    expect(merged?.bestMockScore).toBe(80);
    expect(merged?.certificateEarnedAt).toBe('2026-10-22T08:00:00.000Z');
    expect(merged?.archivedAt).toBe('2026-10-26T08:00:00.000Z');
  });

  it('keeps a plan that exists on only one side and omits the field otherwise', () => {
    const plan = makeExamPlan('a', '2026-10-01T00:00:00.000Z');

    expect(mergeLearnerProfiles(baseProfile, { examPrep: plan }).examPrep).toEqual(plan);
    expect('examPrep' in mergeLearnerProfiles(baseProfile, baseProfile)).toBe(false);
  });
});
