import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import type { CustomWordList, ExamPrepPlan } from '../types/learner';
import {
  buildExamAskLineHe,
  buildExamHeadlineHe,
  buildExamPerkHe,
  currentExamPitch,
  formatExamDateHe,
  getExamPitch,
  pickExamLead,
} from './examPitch';

const TODAY = '2026-12-03';

const plan = (overrides: Partial<ExamPrepPlan> = {}): ExamPrepPlan => ({
  id: 'p1',
  createdAt: '2026-11-30T10:00:00.000Z',
  gradeId: 'grade-5',
  examDateStr: '2026-12-12',
  unitNumbers: [1],
  skills: ['vocabulary'],
  days: [],
  ...overrides,
});

const list = (id: string, archivedAt?: string): CustomWordList => ({
  id,
  title: 'הכתבה',
  createdAt: '2026-11-30T10:00:00.000Z',
  items: [],
  ...(archivedAt ? { archivedAt } : {}),
});

describe('getExamPitch', () => {
  it('takes a coming exam day and the kept school lists', () => {
    const profile = makeProfile({ examPrep: plan(), customWordLists: [list('a'), list('b', '2026-12-01T00:00:00Z')] });
    expect(getExamPitch(profile, TODAY)).toEqual({ examDateStr: '2026-12-12', listCount: 1 });
  });

  it('leaves out an archived or past exam', () => {
    expect(getExamPitch(makeProfile({ examPrep: plan({ archivedAt: '2026-12-01T00:00:00Z' }) }), TODAY)).toBeNull();
    expect(getExamPitch(makeProfile({ examPrep: plan({ examDateStr: '2026-12-01' }), customWordLists: [list('a')] }), TODAY)).toEqual({ listCount: 1 });
  });

  it('is null with neither an exam nor lists', () => {
    expect(getExamPitch(makeProfile(), TODAY)).toBeNull();
  });
});

describe('currentExamPitch', () => {
  it('drops an exam day that has passed since the snapshot', () => {
    expect(currentExamPitch({ examDateStr: '2026-12-01', listCount: 0 }, TODAY)).toBeNull();
    expect(currentExamPitch({ examDateStr: '2026-12-01', listCount: 2 }, TODAY)).toEqual({ listCount: 2 });
    expect(currentExamPitch(undefined, TODAY)).toBeNull();
  });
});

describe('the exam lines', () => {
  it('writes the day the Israeli way', () => {
    expect(formatExamDateHe('2026-12-05')).toBe('5.12');
  });

  it('leads the learner\'s perks with the exam and the days left', () => {
    expect(buildExamPerkHe({ examDateStr: '2026-12-12', listCount: 0 }, TODAY)).toBe('המבחן ב-12.12 (עוד 9 ימים): הכנה מלאה, עם סימולציה ותעודה');
    expect(buildExamPerkHe({ examDateStr: '2026-12-04', listCount: 0 }, TODAY)).toContain('(מחר)');
    expect(buildExamPerkHe({ listCount: 3 }, TODAY)).toBe('3 רשימות המילים מבית הספר, ועוד רשימות');
  });

  it('tells the parent about the exam in the ask message', () => {
    expect(buildExamAskLineHe({ examDateStr: '2026-12-12', listCount: 0 })).toContain('מבחן באנגלית ב-12.12');
    expect(buildExamAskLineHe({ listCount: 1 })).toContain('רשימות המילים');
  });

  it('headlines the checkout with the child and the exam day', () => {
    expect(buildExamHeadlineHe('נועה', { examDateStr: '2026-12-12', listCount: 0 }, TODAY)).toBe(
      'להתכונן למבחן באנגלית של נועה ב-12.12 (עוד 9 ימים)'
    );
    expect(buildExamHeadlineHe('נועה', { listCount: 2 }, TODAY)).toBe('לתרגל עם נועה את רשימות המילים מבית הספר');
  });
});

describe('pickExamLead', () => {
  it('picks the soonest exam, then a child with lists', () => {
    const lead = pickExamLead([
      { name: 'א', pitch: { listCount: 4 } },
      { name: 'ב', pitch: { examDateStr: '2026-12-20', listCount: 0 } },
      { name: 'ג', pitch: { examDateStr: '2026-12-10', listCount: 0 } },
    ]);
    expect(lead?.name).toBe('ג');
    expect(pickExamLead([{ name: 'א', pitch: null }, { name: 'ב', pitch: { listCount: 1 } }])?.name).toBe('ב');
    expect(pickExamLead([{ name: 'א', pitch: null }])).toBeNull();
  });
});
