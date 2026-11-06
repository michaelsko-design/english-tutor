import type { GradeId } from '../../../types/learner';
import { BASE_CURRICULUM_BY_GRADE } from '../base';
import { ALL_EXAM_BANKS } from '../examBank';
import type { ExamBankPack } from '../examBank/types';
import { ALL_LESSON_PACKS } from '../lessons';
import type { LessonPack } from '../lessons/types';
import type { GradeCurriculumPack } from '../types';
import { HOLIDAYS_EXAM_BANKS, HOLIDAYS_LESSONS } from './holidays/all';
import { SEASON2_EXAM_BANKS, SEASON2_LESSONS } from './season2/all';
import { ALL_PACK_CURRICULA } from './index';
import { mergeExamBank, mergeLessonPacks, withPacks } from './merge';
import { CONTENT_PACK_IDS, CONTENT_PACKS } from './registry';
import type { ContentPackId, PackContent } from './types';

/** Each pack's lessons and exam banks: the whole source folder's, of which it uses its own unit's */
const PACK_SOURCE_CONTENT: Record<ContentPackId, Pick<PackContent, 'lessons' | 'examBanks'>> = {
  'season2-1': { lessons: SEASON2_LESSONS, examBanks: SEASON2_EXAM_BANKS },
  'season2-2': { lessons: SEASON2_LESSONS, examBanks: SEASON2_EXAM_BANKS },
  'holidays-autumn': { lessons: HOLIDAYS_LESSONS, examBanks: HOLIDAYS_EXAM_BANKS },
  'holidays-spring': { lessons: HOLIDAYS_LESSONS, examBanks: HOLIDAYS_EXAM_BANKS },
};

/**
 * Every pack's content at once, and the curriculum, lessons and exam banks as if every pack had
 * shipped: for the tests and the read-aloud corpus only (never imported by the app).
 */
export const ALL_PACK_CONTENT: readonly PackContent[] = CONTENT_PACK_IDS.map((id) => ({
  pack: CONTENT_PACKS[id],
  curriculum: ALL_PACK_CURRICULA[id],
  ...PACK_SOURCE_CONTENT[id],
}));

function listed<T>(value: T | undefined): T[] {
  return value === undefined ? [] : [value];
}

/** The grades, lessons and exam banks as if the given packs had shipped, in the given order */
export interface ContentWithPacks {
  curriculum: Record<GradeId, GradeCurriculumPack>;
  lessons: Record<number, LessonPack>;
  examBanks: Partial<Record<number, ExamBankPack>>;
}

export function getContentWithPacks(packIds: readonly ContentPackId[]): ContentWithPacks {
  const contents = packIds.map((id) => ALL_PACK_CONTENT[CONTENT_PACK_IDS.indexOf(id)]);
  const curriculum = withPacks(BASE_CURRICULUM_BY_GRADE, packIds, ALL_PACK_CURRICULA);
  const lessons: Record<number, LessonPack> = Object.fromEntries(
    Object.entries(ALL_LESSON_PACKS).map(([grade, base]) => [
      grade,
      mergeLessonPacks(base, contents.flatMap((content) => listed(content.lessons[Number(grade)]))),
    ])
  );
  const examBanks: Partial<Record<number, ExamBankPack>> = Object.fromEntries(
    Object.entries(ALL_EXAM_BANKS).map(([grade, bank]) => [
      grade,
      mergeExamBank(
        bank ?? {},
        contents.flatMap((content) => listed(content.examBanks[Number(grade)])),
        curriculum[`grade-${grade}` as GradeId].units
      ),
    ])
  );
  return { curriculum, lessons, examBanks };
}

const WITH_ALL_PACKS = getContentWithPacks(CONTENT_PACK_IDS);

export const CURRICULUM_WITH_ALL_PACKS: Record<GradeId, GradeCurriculumPack> = WITH_ALL_PACKS.curriculum;
export const ALL_LESSON_PACKS_WITH_PACKS: Record<number, LessonPack> = WITH_ALL_PACKS.lessons;
export const ALL_EXAM_BANKS_WITH_PACKS: Partial<Record<number, ExamBankPack>> = WITH_ALL_PACKS.examBanks;
