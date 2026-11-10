import { CORE_3_CURRICULUM, CORE_3_EXAM_BANK_LOADERS, CORE_3_LESSON_LOADERS } from './core3';
import { HOLIDAYS_AUTUMN_CURRICULUM, HOLIDAYS_EXAM_BANK_LOADERS, HOLIDAYS_LESSON_LOADERS, HOLIDAYS_SPRING_CURRICULUM } from './holidays';
import { SEASON2_1_CURRICULUM, SEASON2_2_CURRICULUM, SEASON2_EXAM_BANK_LOADERS, SEASON2_LESSON_LOADERS } from './season2';
import type { ContentPackId, PackCurriculum, PackExamBankLoaders, PackLessonLoaders } from './types';

/**
 * Every pack, released or not: for the preview (`npm run dev:packs`), the tests and the read-aloud
 * corpus. The app reaches this module only in the preview, so unreleased packs stay out of the
 * production bundle. Packs from one source folder share its lesson and bank loaders.
 */
export const ALL_PACK_CURRICULA: Record<ContentPackId, PackCurriculum> = {
  'season2-1': SEASON2_1_CURRICULUM,
  'season2-2': SEASON2_2_CURRICULUM,
  'core-3': CORE_3_CURRICULUM,
  'holidays-autumn': HOLIDAYS_AUTUMN_CURRICULUM,
  'holidays-spring': HOLIDAYS_SPRING_CURRICULUM,
};

export const ALL_PACK_LESSON_LOADERS: Record<ContentPackId, PackLessonLoaders> = {
  'season2-1': SEASON2_LESSON_LOADERS,
  'season2-2': SEASON2_LESSON_LOADERS,
  'core-3': CORE_3_LESSON_LOADERS,
  'holidays-autumn': HOLIDAYS_LESSON_LOADERS,
  'holidays-spring': HOLIDAYS_LESSON_LOADERS,
};

export const ALL_PACK_EXAM_BANK_LOADERS: Record<ContentPackId, PackExamBankLoaders> = {
  'season2-1': SEASON2_EXAM_BANK_LOADERS,
  'season2-2': SEASON2_EXAM_BANK_LOADERS,
  'core-3': CORE_3_EXAM_BANK_LOADERS,
  'holidays-autumn': HOLIDAYS_EXAM_BANK_LOADERS,
  'holidays-spring': HOLIDAYS_EXAM_BANK_LOADERS,
};
