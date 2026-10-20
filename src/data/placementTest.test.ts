import { describe, expect, it } from 'vitest';
import { CURRICULUM_BY_GRADE } from './curriculum';
import {
  PLACEMENT_QUESTION_COUNT,
  PLACEMENT_REWARD_DIAMONDS,
  PLACEMENT_REWARD_XP,
  PlacementAnswer,
  applyPlacementToProfile,
  buildNonReaderResult,
  getSchoolGradeId,
  buildPlacementPool,
  computePlacementResult,
  getStartingDifficulty,
  gradeIdToNumber,
  gradeNumberToId,
  nextDifficulty,
  pickNextQuestion,
} from './placementTest';
import { LearnerProfile, PlacementResult } from '../types/learner';

const ALL_GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/** Simulates a full test where `answerFn` decides correctness from the current difficulty. */
function simulateTest(
  schoolGrade: number,
  answerFn: (difficulty: number, index: number) => boolean
): PlacementAnswer[] {
  const answers: PlacementAnswer[] = [];
  let difficulty = getStartingDifficulty(schoolGrade);
  for (let i = 0; i < PLACEMENT_QUESTION_COUNT; i++) {
    const question = pickNextQuestion(
      difficulty,
      i,
      answers.map((a) => a.questionId),
      'girl',
      42
    );
    const isCorrect = answerFn(difficulty, i);
    answers.push({ questionId: question.id, difficulty, isCorrect });
    difficulty = nextDifficulty(difficulty, isCorrect, i);
  }
  return answers;
}

describe('grade id helpers', () => {
  it('converts between grade ids and numbers', () => {
    expect(gradeIdToNumber('grade-7')).toBe(7);
    expect(gradeNumberToId(12)).toBe('grade-12');
  });

  it('clamps out-of-range grade numbers', () => {
    expect(gradeNumberToId(0)).toBe('grade-1');
    expect(gradeNumberToId(15)).toBe('grade-12');
  });
});

describe('buildPlacementPool', () => {
  it.each(ALL_GRADES)('builds a rule item and a vocab item per mission for grade %i', (grade) => {
    const missions = CURRICULUM_BY_GRADE[gradeNumberToId(grade)].units.flatMap((u) => u.missions);
    const pool = buildPlacementPool(grade, 'girl');

    expect(pool).toHaveLength(missions.length * 2);
    expect(pool.filter((q) => q.kind === 'rule')).toHaveLength(missions.length);
    expect(pool.filter((q) => q.kind === 'vocab')).toHaveLength(missions.length);
  });

  it.each(ALL_GRADES)('gives every grade %i item 3 distinct options with exactly one correct', (grade) => {
    for (const q of buildPlacementPool(grade, 'girl')) {
      expect(q.options).toHaveLength(3);
      expect(q.options.filter((o) => o.isCorrect)).toHaveLength(1);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(3);
      expect(q.gradeNum).toBe(grade);
    }
  });

  it('inflects the Hebrew prompt for boys', () => {
    const girlPrompt = buildPlacementPool(5, 'girl')[0].promptHe;
    const boyPrompt = buildPlacementPool(5, 'boy')[0].promptHe;
    expect(girlPrompt).toContain('בחרי');
    expect(boyPrompt).toContain('בחר');
    expect(boyPrompt).not.toContain('בחרי');
  });
});

describe('getStartingDifficulty', () => {
  it('starts one grade below the school grade', () => {
    expect(getStartingDifficulty(7)).toBe(6);
  });

  it('never starts below grade 1', () => {
    expect(getStartingDifficulty(1)).toBe(1);
  });
});

describe('nextDifficulty', () => {
  it('moves by 2 during the first three questions', () => {
    expect(nextDifficulty(6, true, 0)).toBe(8);
    expect(nextDifficulty(6, false, 2)).toBe(4);
  });

  it('moves by 1 from the fourth question on', () => {
    expect(nextDifficulty(6, true, 3)).toBe(7);
    expect(nextDifficulty(6, false, 9)).toBe(5);
  });

  it('clamps to grades 1 through 12', () => {
    expect(nextDifficulty(12, true, 0)).toBe(12);
    expect(nextDifficulty(1, false, 5)).toBe(1);
    expect(nextDifficulty(11, true, 1)).toBe(12);
  });
});

describe('pickNextQuestion', () => {
  it('alternates vocab and rule items', () => {
    expect(pickNextQuestion(5, 0, [], 'girl', 1).kind).toBe('vocab');
    expect(pickNextQuestion(5, 1, [], 'girl', 1).kind).toBe('rule');
  });

  it('picks from the requested grade', () => {
    expect(pickNextQuestion(9, 0, [], 'girl', 1).gradeNum).toBe(9);
  });

  it('never repeats a question within one test', () => {
    const answers = simulateTest(5, () => true);
    const ids = answers.map((a) => a.questionId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never repeats even when every question stays at the same grade', () => {
    const used: string[] = [];
    for (let i = 0; i < 24; i++) {
      used.push(pickNextQuestion(1, i, used, 'girl', 7).id);
    }
    expect(new Set(used).size).toBe(24);
  });

  it('returns the same question and option order for the same salt', () => {
    const a = pickNextQuestion(6, 2, [], 'girl', 99);
    const b = pickNextQuestion(6, 2, [], 'girl', 99);
    expect(b).toEqual(a);
  });

  it('varies the questions between attempts with different salts', () => {
    const picks = new Set(
      [1, 2, 3, 4, 5, 6].map((salt) => pickNextQuestion(6, 0, [], 'girl', salt).id)
    );
    expect(picks.size).toBeGreaterThan(1);
  });
});

describe('computePlacementResult', () => {
  const completedAt = '2026-10-17T10:00:00.000Z';

  it('recommends a higher grade at its middle tier when every answer is correct (not also the hardest tier)', () => {
    const result = computePlacementResult(simulateTest(4, () => true), 4, completedAt);
    expect(result.correctCount).toBe(PLACEMENT_QUESTION_COUNT);
    expect(result.totalQuestions).toBe(PLACEMENT_QUESTION_COUNT);
    expect(result.recommendedTier).toBe('challenger');
    expect(gradeIdToNumber(result.estimatedGradeId)).toBeGreaterThanOrEqual(6);
    expect(result.recommendedGradeId).toBe(result.estimatedGradeId);
    expect(result.completedAt).toBe(completedAt);
  });

  it('recommends explorer and a lower grade when every answer is wrong', () => {
    const result = computePlacementResult(simulateTest(8, () => false), 8, completedAt);
    expect(result.correctCount).toBe(0);
    expect(result.recommendedTier).toBe('explorer');
    expect(result.estimatedGradeId).toBe('grade-1');
    expect(result.recommendedGradeId).toBe('grade-1');
  });

  it('recommends explorer for a first grader who misses every question', () => {
    const result = computePlacementResult(simulateTest(1, () => false), 1, completedAt);
    expect(result.estimatedGradeId).toBe('grade-1');
    expect(result.recommendedTier).toBe('explorer');
    expect(result.recommendedGradeId).toBe('grade-1');
  });

  it('recommends master for a twelfth grader who answers everything correctly', () => {
    const result = computePlacementResult(simulateTest(12, () => true), 12, completedAt);
    expect(result.estimatedGradeId).toBe('grade-12');
    expect(result.recommendedTier).toBe('master');
    expect(result.recommendedGradeId).toBe('grade-12');
  });

  it('recommends challenger at the school grade when ability matches the school grade', () => {
    // Knows everything up to grade 7, nothing above it.
    const answers = simulateTest(7, (difficulty) => difficulty <= 7);
    const result = computePlacementResult(answers, 7, completedAt);
    expect(result.estimatedGradeId).toBe('grade-7');
    expect(result.recommendedTier).toBe('challenger');
    expect(result.recommendedGradeId).toBe('grade-7');
  });

  it('keeps the school grade but lowers the tier when one grade below', () => {
    const answers = simulateTest(7, (difficulty) => difficulty <= 6);
    const result = computePlacementResult(answers, 7, completedAt);
    expect(result.estimatedGradeId).toBe('grade-6');
    expect(result.recommendedTier).toBe('explorer');
    expect(result.recommendedGradeId).toBe('grade-7');
  });

  it('keeps the school grade but raises the tier when one grade above', () => {
    const answers = simulateTest(7, (difficulty) => difficulty <= 8);
    const result = computePlacementResult(answers, 7, completedAt);
    expect(result.estimatedGradeId).toBe('grade-8');
    expect(result.recommendedTier).toBe('master');
    expect(result.recommendedGradeId).toBe('grade-7');
  });
});

describe('applyPlacementToProfile', () => {
  const result: PlacementResult = {
    completedAt: '2026-10-17T10:00:00.000Z',
    estimatedGradeId: 'grade-5',
    recommendedGradeId: 'grade-5',
    recommendedTier: 'explorer',
    correctCount: 3,
    totalQuestions: 10,
  };
  const profile: LearnerProfile = {
    isOnboarded: true,
    name: 'Noa',
    age: 12,
    gender: 'girl',
    gradeId: 'grade-7',
    preferredTier: 'challenger',
    themeId: 'cozy-studio',
    stats: {
      xp: 140,
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
  };

  it('keeps the school grade when a test moves the practice grade', () => {
    const moved = applyPlacementToProfile(profile, result, true);
    expect(moved.gradeId).toBe('grade-5');
    expect(getSchoolGradeId(moved)).toBe('grade-7');
    // A later test still starts from the school grade
    expect(getSchoolGradeId(applyPlacementToProfile(moved, result, true))).toBe('grade-7');
  });

  it('puts a learner who cannot read English yet in grade 1, Explorer, keeping the school grade', () => {
    const nonReader = buildNonReaderResult('2026-10-20T10:00:00.000Z');
    expect(nonReader).toMatchObject({
      recommendedGradeId: 'grade-1',
      estimatedGradeId: 'grade-1',
      recommendedTier: 'explorer',
      totalQuestions: 0,
      isNonReader: true,
    });
    const applied = applyPlacementToProfile(profile, nonReader, true);
    expect(applied.gradeId).toBe('grade-1');
    expect(applied.preferredTier).toBe('explorer');
    expect(applied.schoolGradeId).toBe('grade-7');
    expect(applied.stats.xp).toBe(profile.stats.xp + PLACEMENT_REWARD_XP);
    expect(applyPlacementToProfile(applied, nonReader, true).stats.xp).toBe(applied.stats.xp);
  });

  it('applies the recommended grade and tier when asked', () => {
    const updated = applyPlacementToProfile(profile, result, true);
    expect(updated.gradeId).toBe('grade-5');
    expect(updated.preferredTier).toBe('explorer');
    expect(updated.placementResult).toEqual(result);
  });

  it('keeps the current grade and tier but still saves the result', () => {
    const updated = applyPlacementToProfile(profile, result, false);
    expect(updated.gradeId).toBe('grade-7');
    expect(updated.preferredTier).toBe('challenger');
    expect(updated.placementResult).toEqual(result);
  });

  it('grants the reward only on the first completed test', () => {
    const first = applyPlacementToProfile(profile, result, false);
    expect(first.stats.xp).toBe(profile.stats.xp + PLACEMENT_REWARD_XP);
    expect(first.stats.diamonds).toBe(profile.stats.diamonds + PLACEMENT_REWARD_DIAMONDS);
    expect(first.stats.level).toBe(2);

    const retake = applyPlacementToProfile(first, result, false);
    expect(retake.stats.xp).toBe(first.stats.xp);
    expect(retake.stats.diamonds).toBe(first.stats.diamonds);
  });

  it('does not mutate the input profile', () => {
    const snapshot = JSON.stringify(profile);
    applyPlacementToProfile(profile, result, true);
    expect(JSON.stringify(profile)).toBe(snapshot);
  });
});
