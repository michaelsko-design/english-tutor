import type { GradeId } from '../../../types/learner';
import { BASE_CURRICULUM_BY_GRADE } from '../base';
import { ALL_EXAM_BANKS } from '../examBank';
import type { ExamBankPack } from '../examBank/types';
import { ALL_LESSON_PACKS } from '../lessons';
import type { LessonPack } from '../lessons/types';
import type { GradeCurriculumPack } from '../types';
import { CORE_PLUS_EXAM_BANKS, CORE_PLUS_LESSONS } from './core-plus/all';
import { HOLIDAYS_EXAM_BANKS, HOLIDAYS_LESSONS } from './holidays/all';
import { ALL_PACK_CURRICULA } from './index';
import { mergeExamBank, mergeLessonPacks, withPacks } from './merge';
import { CONTENT_PACK_IDS, CONTENT_PACKS } from './registry';
import type { PackContent } from './types';

/**
 * Every pack's content at once, and the curriculum, lessons and exam banks as if every pack had
 * shipped: for the tests and the read-aloud corpus only (never imported by the app).
 */
export const ALL_PACK_CONTENT: readonly PackContent[] = [
  {
    pack: CONTENT_PACKS['core-plus'],
    curriculum: ALL_PACK_CURRICULA['core-plus'],
    lessons: CORE_PLUS_LESSONS,
    examBanks: CORE_PLUS_EXAM_BANKS,
  },
  {
    pack: CONTENT_PACKS.holidays,
    curriculum: ALL_PACK_CURRICULA.holidays,
    lessons: HOLIDAYS_LESSONS,
    examBanks: HOLIDAYS_EXAM_BANKS,
  },
];

function listed<T>(value: T | undefined): T[] {
  return value === undefined ? [] : [value];
}

export const CURRICULUM_WITH_ALL_PACKS: Record<GradeId, GradeCurriculumPack> = withPacks(
  BASE_CURRICULUM_BY_GRADE,
  CONTENT_PACK_IDS,
  ALL_PACK_CURRICULA
);

export const ALL_LESSON_PACKS_WITH_PACKS: Record<number, LessonPack> = Object.fromEntries(
  Object.entries(ALL_LESSON_PACKS).map(([grade, lessons]) => [
    grade,
    mergeLessonPacks(
      lessons,
      ALL_PACK_CONTENT.flatMap((content) => listed(content.lessons[Number(grade)]))
    ),
  ])
);

export const ALL_EXAM_BANKS_WITH_PACKS: Partial<Record<number, ExamBankPack>> = Object.fromEntries(
  Object.entries(ALL_EXAM_BANKS).map(([grade, bank]) => [
    grade,
    mergeExamBank(
      bank ?? {},
      ALL_PACK_CONTENT.flatMap((content) => listed(content.examBanks[Number(grade)])),
      CURRICULUM_WITH_ALL_PACKS[`grade-${grade}` as GradeId].units
    ),
  ])
);
