import { CORE_PLUS_CURRICULUM, CORE_PLUS_EXAM_BANK_LOADERS, CORE_PLUS_LESSON_LOADERS } from './core-plus';
import { HOLIDAYS_CURRICULUM, HOLIDAYS_EXAM_BANK_LOADERS, HOLIDAYS_LESSON_LOADERS } from './holidays';
import type { ContentPackId, PackCurriculum, PackExamBankLoaders, PackLessonLoaders } from './types';

/**
 * Every pack, released or not: for the preview (`npm run dev:packs`), the tests and the read-aloud
 * corpus. The app reaches this module only in the preview, so unreleased packs stay out of the
 * production bundle.
 */
export const ALL_PACK_CURRICULA: Record<ContentPackId, PackCurriculum> = {
  'core-plus': CORE_PLUS_CURRICULUM,
  holidays: HOLIDAYS_CURRICULUM,
};

export const ALL_PACK_LESSON_LOADERS: Record<ContentPackId, PackLessonLoaders> = {
  'core-plus': CORE_PLUS_LESSON_LOADERS,
  holidays: HOLIDAYS_LESSON_LOADERS,
};

export const ALL_PACK_EXAM_BANK_LOADERS: Record<ContentPackId, PackExamBankLoaders> = {
  'core-plus': CORE_PLUS_EXAM_BANK_LOADERS,
  holidays: HOLIDAYS_EXAM_BANK_LOADERS,
};
