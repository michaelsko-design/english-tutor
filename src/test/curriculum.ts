/**
 * Every grade's curriculum, loaded eagerly: for tests, e2e support and scripts. The app never
 * imports this (or `base.ts`); it loads grades on demand through `data/curriculum/loader.ts`.
 */
import type { GradeId } from '../types/learner';
import { BASE_CURRICULUM_BY_GRADE } from '../data/curriculum/base';
import { ALL_PACK_CURRICULA } from '../data/curriculum/packs';
import { withPacks } from '../data/curriculum/packs/merge';
import { CONTENT_PACK_IDS, IS_PACK_PREVIEW, RELEASED_CONTENT_PACKS } from '../data/curriculum/packs/registry';
import type { GradeCurriculumPack } from '../data/curriculum/types';

export const CURRICULUM_BY_GRADE: Record<GradeId, GradeCurriculumPack> = withPacks(
  BASE_CURRICULUM_BY_GRADE,
  IS_PACK_PREVIEW ? CONTENT_PACK_IDS : RELEASED_CONTENT_PACKS.map((released) => released.id),
  ALL_PACK_CURRICULA
);

/** Loads every grade into the loader's cache, for tests of code that reads loaded grades. */
export { loadAllGrades as preloadCurriculum } from '../data/curriculum/loader';
