import { describe, expect, it } from 'vitest';
import {
  CERTIFICATE_BONUS_DIAMONDS,
  EXAM_MAX_DAYS_AHEAD,
  EXAM_READY_SCORE,
  EXAM_REPEAT_REWARD_XP,
  EXAM_SESSION_MAX_STEPS,
  EXAM_SESSION_REWARD_DIAMONDS,
  EXAM_SESSION_REWARD_XP,
  EXAM_SKILLS,
  ExamAnswer,
  MOCK_EXAM_QUESTION_COUNT,
  MOCK_EXAM_REWARD_DIAMONDS,
  MOCK_EXAM_REWARD_XP,
  addDays,
  applyExamResultToProfile,
  buildExamPlan,
  buildMockExamSteps,
  buildSessionSteps,
  getConfidenceTips,
  getDayStatus,
  getNextSession,
  getStudyDates,
  getUnitOptions,
  getWeakSkills,
  isMockUnlocked,
  summarizeAnswers,
  toLocalDateStr,
} from './examPrep';
import { ExamPrepPlan, ExamSkill, LearnerProfile } from '../types/learner';
import { GRADE_7_EXAM_BANK } from './curriculum/examBank/grade7';
import { EXAM_MOCK_RESERVED_PER_LIST, EXAM_BANK_ITEMS_PER_LIST } from './curriculum/examBank/types';

/** 2026-10-18 is a Sunday; 2026-10-24 is a Saturday. */
const SUNDAY = '2026-10-18';
const SKILL_TO_STEP_TYPE: Record<ExamSkill, string> = {
  grammar: 'grammar-detective',
  vocabulary: 'chat-reply',
  unseen: 'story-unseen',
  sentences: 'sentence-builder',
};

function makePlan(overrides: Partial<Parameters<typeof buildExamPlan>[0]> = {}): ExamPrepPlan {
  return buildExamPlan({
    gradeId: 'grade-7',
    examDateStr: '2026-10-23',
    unitNumbers: [2, 3],
    skills: ['grammar', 'vocabulary'],
    todayStr: SUNDAY,
    isShabbatObserver: true,
    createdAt: '2026-10-18T08:00:00.000Z',
    ...overrides,
  });
}

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 12,
  gender: 'girl',
  gradeId: 'grade-7',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 100,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 4,
    streakLastDateStr: '2026-10-17',
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 2,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function answers(skill: ExamSkill, correct: number, total: number): ExamAnswer[] {
  return Array.from({ length: total }, (_, i) => ({ skill, isCorrect: i < correct }));
}

describe('date helpers', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(toLocalDateStr(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });

  it('adds days across month boundaries', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(addDays('2026-10-18', -1)).toBe('2026-10-17');
  });
});

describe('getStudyDates', () => {
  it('returns only today for an exam today or tomorrow (crash course)', () => {
    expect(getStudyDates(SUNDAY, SUNDAY, true)).toEqual([SUNDAY]);
    expect(getStudyDates(SUNDAY, '2026-10-19', true)).toEqual([SUNDAY]);
  });

  it('returns no dates for an exam in the past or too far ahead', () => {
    expect(getStudyDates(SUNDAY, '2026-10-17', true)).toEqual([]);
    expect(getStudyDates(SUNDAY, addDays(SUNDAY, EXAM_MAX_DAYS_AHEAD + 1), true)).toEqual([]);
  });

  it('lists every day from today up to the day before the exam', () => {
    expect(getStudyDates(SUNDAY, '2026-10-23', false)).toEqual([
      '2026-10-18',
      '2026-10-19',
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
    ]);
  });

  it('skips Saturday for Shabbat observers only', () => {
    expect(getStudyDates(SUNDAY, '2026-10-26', true)).not.toContain('2026-10-24');
    expect(getStudyDates(SUNDAY, '2026-10-26', true)).toHaveLength(7);
    expect(getStudyDates(SUNDAY, '2026-10-26', false)).toContain('2026-10-24');
  });
});

describe('buildExamPlan', () => {
  it('builds a 1-day crash course with a mixed review and the mock exam', () => {
    const plan = makePlan({ examDateStr: '2026-10-19' });

    expect(plan.days).toHaveLength(2);
    expect(plan.days[0]).toMatchObject({ dateStr: SUNDAY, kind: 'practice', focus: [] });
    expect(plan.days[1]).toMatchObject({ dateStr: SUNDAY, kind: 'mock' });
  });

  it('ends a multi-day plan with a mixed review and then the mock exam', () => {
    const plan = makePlan();

    expect(plan.days.map((d) => d.dateStr)).toEqual([
      '2026-10-18',
      '2026-10-19',
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
    ]);
    expect(plan.days.map((d) => d.kind)).toEqual(['practice', 'practice', 'practice', 'practice', 'mock']);
    expect(plan.days[3].focus).toEqual([]);
    expect(plan.days.map((d) => d.dayIndex)).toEqual([0, 1, 2, 3, 4]);
  });

  it('spreads every unit × skill block over the focused days exactly once', () => {
    const plan = makePlan();
    const focused = plan.days.slice(0, 3).flatMap((d) => d.focus);

    expect(focused).toHaveLength(4);
    expect(focused).toEqual(
      expect.arrayContaining([
        { unitNumber: 2, skill: 'grammar' },
        { unitNumber: 2, skill: 'vocabulary' },
        { unitNumber: 3, skill: 'grammar' },
        { unitNumber: 3, skill: 'vocabulary' },
      ])
    );
    plan.days.slice(0, 3).forEach((d) => expect(d.focus.length).toBeGreaterThan(0));
  });

  it('repeats blocks when there are more days than blocks', () => {
    const plan = makePlan({ unitNumbers: [1], skills: ['unseen'], examDateStr: '2026-10-26' });
    const focusedDays = plan.days.filter((d) => d.kind === 'practice' && d.focus.length > 0);

    expect(focusedDays.length).toBeGreaterThan(1);
    focusedDays.forEach((d) => expect(d.focus).toEqual([{ unitNumber: 1, skill: 'unseen' }]));
  });

  it('sorts units and skills into a canonical order', () => {
    const plan = makePlan({ unitNumbers: [3, 1], skills: ['unseen', 'grammar'] });

    expect(plan.unitNumbers).toEqual([1, 3]);
    expect(plan.skills).toEqual(['grammar', 'unseen']);
  });

  it('rejects a plan without units, skills or valid dates', () => {
    expect(() => makePlan({ unitNumbers: [] })).toThrow();
    expect(() => makePlan({ skills: [] })).toThrow();
    expect(() => makePlan({ examDateStr: '2026-10-01' })).toThrow();
  });
});

describe('getUnitOptions', () => {
  it('lists the grade units with their grammar topics', () => {
    const units = getUnitOptions('grade-7');

    expect(units).toHaveLength(4);
    expect(units[0].unitNumber).toBe(1);
    expect(units[0].topics.length).toBeGreaterThan(0);
  });
});

describe('buildSessionSteps', () => {
  it('only uses the step types and units of the day focus', () => {
    const plan = makePlan();
    const day = plan.days[0];
    const steps = buildSessionSteps(plan, day, 'challenger', 'girl', 7);
    const focusSkills = new Set(day.focus.map((f) => f.skill));
    const focusUnits = new Set(day.focus.map((f) => f.unitNumber));

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.length).toBeLessThanOrEqual(EXAM_SESSION_MAX_STEPS);
    steps.forEach((s) => {
      expect(focusSkills.has(s.skill)).toBe(true);
      expect(focusUnits.has(s.unitNumber)).toBe(true);
      expect(s.type).toBe(SKILL_TO_STEP_TYPE[s.skill]);
    });
  });

  it('mixes all chosen skills on a mixed review day and never includes voice drills', () => {
    const plan = makePlan({ skills: ['grammar', 'vocabulary', 'unseen', 'sentences'] });
    const steps = buildSessionSteps(plan, plan.days[3], 'challenger', 'boy', 7);

    expect(new Set(steps.map((s) => s.skill)).size).toBe(4);
    expect(steps.some((s) => s.type === 'voice-speak')).toBe(false);
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });

  it('relabels badges for exam practice and is stable for the same salt', () => {
    const plan = makePlan();
    const a = buildSessionSteps(plan, plan.days[0], 'challenger', 'girl', 3);
    const b = buildSessionSteps(plan, plan.days[0], 'challenger', 'girl', 3);

    expect(a).toEqual(b);
    a.forEach((s) => expect(s.badgeLabelHe).not.toContain('שלב'));
  });
});

describe('buildMockExamSteps', () => {
  it('balances the questions across all chosen skills, grouped by skill', () => {
    const plan = makePlan({ skills: ['grammar', 'vocabulary', 'unseen', 'sentences'] });
    const steps = buildMockExamSteps(plan, 'challenger', 'girl', 11);
    const skillOrder = steps.map((s) => EXAM_SKILLS.indexOf(s.skill));

    expect(steps).toHaveLength(MOCK_EXAM_QUESTION_COUNT);
    EXAM_SKILLS.forEach((skill) =>
      expect(steps.filter((s) => s.skill === skill)).toHaveLength(MOCK_EXAM_QUESTION_COUNT / 4)
    );
    expect(skillOrder).toEqual([...skillOrder].sort((x, y) => x - y));
  });

  it('uses every available item when the material is small', () => {
    const plan = makePlan({ unitNumbers: [1], skills: ['grammar'] });

    expect(buildMockExamSteps(plan, 'challenger', 'girl', 11)).toHaveLength(3);
  });
});

/** Bank step ids end in the item index (`-4`) or the passage and question (`-1.2`). */
function isMockReserved(stepId: string): boolean {
  const index = stepId.split('-').pop()!;
  if (index.includes('.')) return index.startsWith('1.');
  return Number(index) >= EXAM_BANK_ITEMS_PER_LIST - EXAM_MOCK_RESERVED_PER_LIST;
}

describe('sessions with the exam question bank (Feature 43)', () => {
  const allSkills: ExamSkill[] = ['grammar', 'vocabulary', 'unseen', 'sentences'];

  it('practises only bank items that are not kept for the mock', () => {
    const plan = makePlan({ skills: allSkills, unitNumbers: [1, 2, 3, 4] });
    plan.days
      .filter((d) => d.kind === 'practice')
      .forEach((day) => {
        const steps = buildSessionSteps(plan, day, 'challenger', 'girl', 5, GRADE_7_EXAM_BANK);
        expect(steps.length).toBeGreaterThan(0);
        expect(steps.length).toBeLessThanOrEqual(EXAM_SESSION_MAX_STEPS);
        steps.forEach((s) => {
          expect(s.id.startsWith('exam-g7-')).toBe(true);
          expect(isMockReserved(s.id)).toBe(false);
          expect(s.type).toBe(SKILL_TO_STEP_TYPE[s.skill]);
        });
      });
  });

  it('builds a balanced mock exam from the reserved items only', () => {
    const plan = makePlan({ skills: allSkills, unitNumbers: [1, 2] });
    const steps = buildMockExamSteps(plan, 'challenger', 'girl', 11, GRADE_7_EXAM_BANK);

    expect(steps).toHaveLength(MOCK_EXAM_QUESTION_COUNT);
    EXAM_SKILLS.forEach((skill) =>
      expect(steps.filter((s) => s.skill === skill)).toHaveLength(MOCK_EXAM_QUESTION_COUNT / 4)
    );
    steps.forEach((s) => expect(isMockReserved(s.id)).toBe(true));
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });

  it('falls back to the mission questions for a unit the bank lacks', () => {
    const plan = makePlan({ unitNumbers: [1, 2], skills: ['grammar'] });
    const { 1: unitOne } = GRADE_7_EXAM_BANK;
    const steps = buildMockExamSteps(plan, 'challenger', 'girl', 11, { 1: unitOne });

    expect(steps.filter((s) => s.unitNumber === 1).every((s) => s.id.startsWith('exam-'))).toBe(true);
    expect(steps.filter((s) => s.unitNumber === 2).every((s) => s.id.startsWith('g7-u2-'))).toBe(true);
  });
});

describe('scoring', () => {
  it('summarizes answers into a percent score and a per-skill breakdown', () => {
    const summary = summarizeAnswers([...answers('grammar', 3, 4), ...answers('vocabulary', 4, 6)]);

    expect(summary).toMatchObject({ correctCount: 7, totalQuestions: 10, scorePercent: 70 });
    expect(summary.bySkill.grammar).toEqual({ correct: 3, total: 4 });
  });

  it('lists skills below the exam-ready score as weak', () => {
    const summary = summarizeAnswers([...answers('grammar', 1, 3), ...answers('unseen', 3, 3)]);

    expect(getWeakSkills(summary)).toEqual(['grammar']);
  });

  it('returns gendered confidence tips including weak-skill tips', () => {
    expect(getConfidenceTips(['grammar'], ['grammar'], 'girl').length).toBeGreaterThanOrEqual(3);
    expect(getConfidenceTips(['grammar'], [], 'boy').join(' ')).not.toContain('קראי');
  });
});

describe('applyExamResultToProfile', () => {
  const now = new Date('2026-10-18T10:00:00.000Z');

  it('records the first practice session with rewards and daily activity', () => {
    const plan = makePlan();
    const profile = { ...baseProfile, examPrep: plan };
    const updated = applyExamResultToProfile(profile, 0, answers('grammar', 4, 5), now);

    expect(updated.examPrep?.days[0]).toMatchObject({
      completedAt: now.toISOString(),
      scorePercent: 80,
    });
    expect(updated.stats.xp).toBe(100 + EXAM_SESSION_REWARD_XP);
    expect(updated.stats.diamonds).toBe(50 + EXAM_SESSION_REWARD_DIAMONDS);
    expect(updated.stats.streakDays).toBe(5);
    expect(updated.dailyCounters).toMatchObject({
      dateStr: '2026-10-18',
      missionsCompletedToday: 1,
      threeStarMissionsToday: 1,
    });
    expect(updated.missionProgress).toEqual({});
  });

  it('keeps the best score and gives only a small reward on a repeat', () => {
    const plan = makePlan();
    const first = applyExamResultToProfile({ ...baseProfile, examPrep: plan }, 0, answers('grammar', 4, 5), now);
    const later = new Date('2026-10-18T12:00:00.000Z');
    const repeat = applyExamResultToProfile(first, 0, answers('grammar', 2, 5), later);

    expect(repeat.examPrep?.days[0]).toMatchObject({ completedAt: now.toISOString(), scorePercent: 80 });
    expect(repeat.stats.xp).toBe(first.stats.xp + EXAM_REPEAT_REWARD_XP);
    expect(repeat.stats.diamonds).toBe(first.stats.diamonds);
    expect(repeat.stats.streakDays).toBe(first.stats.streakDays);
  });

  it('grants the certificate and bonus once for a mock score at the exam-ready threshold', () => {
    const plan = makePlan();
    const mockIdx = plan.days.length - 1;
    const passed = applyExamResultToProfile(
      { ...baseProfile, examPrep: plan },
      mockIdx,
      answers('grammar', EXAM_READY_SCORE / 10, 10),
      now
    );

    expect(passed.examPrep?.certificateEarnedAt).toBe(now.toISOString());
    expect(passed.examPrep?.bestMockScore).toBe(EXAM_READY_SCORE);
    expect(passed.stats.xp).toBe(100 + MOCK_EXAM_REWARD_XP);
    expect(passed.stats.diamonds).toBe(50 + MOCK_EXAM_REWARD_DIAMONDS + CERTIFICATE_BONUS_DIAMONDS);

    const retake = applyExamResultToProfile(passed, mockIdx, answers('grammar', 10, 10), new Date('2026-10-19T10:00:00.000Z'));
    expect(retake.examPrep?.certificateEarnedAt).toBe(now.toISOString());
    expect(retake.examPrep?.bestMockScore).toBe(100);
    expect(retake.stats.diamonds).toBe(passed.stats.diamonds);
  });

  it('does not grant the certificate below the exam-ready score', () => {
    const plan = makePlan();
    const failed = applyExamResultToProfile(
      { ...baseProfile, examPrep: plan },
      plan.days.length - 1,
      answers('grammar', 6, 10),
      now
    );

    expect(failed.examPrep?.certificateEarnedAt).toBeUndefined();
    expect(failed.examPrep?.bestMockScore).toBe(60);
  });

  it('does not mutate the input profile and ignores a missing plan', () => {
    const plan = makePlan();
    const profile = { ...baseProfile, examPrep: plan };
    const snapshot = JSON.parse(JSON.stringify(profile));
    applyExamResultToProfile(profile, 0, answers('grammar', 5, 5), now);

    expect(profile).toEqual(snapshot);
    expect(applyExamResultToProfile(baseProfile, 0, answers('grammar', 5, 5), now)).toBe(baseProfile);
  });
});

describe('plan progress helpers', () => {
  it('reports day status relative to today', () => {
    const plan = makePlan();
    const done = { ...plan.days[0], completedAt: '2026-10-18T10:00:00.000Z' };

    expect(getDayStatus(done, '2026-10-19')).toBe('done');
    expect(getDayStatus(plan.days[0], '2026-10-19')).toBe('missed');
    expect(getDayStatus(plan.days[1], '2026-10-19')).toBe('today');
    expect(getDayStatus(plan.days[2], '2026-10-19')).toBe('upcoming');
  });

  it('suggests catch-up sessions first and unlocks the mock when practice is done', () => {
    const plan = makePlan();

    expect(getNextSession(plan, '2026-10-19')?.dayIndex).toBe(0);
    expect(isMockUnlocked(plan, '2026-10-19')).toBe(false);

    const allPracticeDone: ExamPrepPlan = {
      ...plan,
      days: plan.days.map((d) => (d.kind === 'practice' ? { ...d, completedAt: 'x' } : d)),
    };
    expect(isMockUnlocked(allPracticeDone, '2026-10-19')).toBe(true);
    expect(getNextSession(allPracticeDone, '2026-10-19')?.kind).toBe('mock');
  });

  it('unlocks the mock on its own day even with practice left', () => {
    const plan = makePlan();

    expect(isMockUnlocked(plan, '2026-10-22')).toBe(true);
  });
});
