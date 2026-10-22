import { GradeId } from '../../types/learner';
import { BASE_CURRICULUM_BY_GRADE } from './base';
import { ALL_PACK_CURRICULA } from './packs';
import { withPacks } from './packs/merge';
import { CONTENT_PACK_IDS, IS_PACK_PREVIEW, RELEASED_CONTENT_PACKS } from './packs/registry';
import type { ContentPackId, PackCurriculum } from './packs/types';
import { GradeCurriculumPack } from './types';

export * from './types';

/**
 * The released content packs' units. When a pack ships, import its curriculum here
 * (`./packs/<id>`) next to its entry in `RELEASED_CONTENT_PACKS`.
 */
const RELEASED_PACK_CURRICULA: Partial<Record<ContentPackId, PackCurriculum>> = {};

/** Every grade's units, with the released packs' units after them (every pack in the preview). */
export const CURRICULUM_BY_GRADE: Record<GradeId, GradeCurriculumPack> = IS_PACK_PREVIEW
  ? withPacks(BASE_CURRICULUM_BY_GRADE, CONTENT_PACK_IDS, ALL_PACK_CURRICULA)
  : withPacks(
      BASE_CURRICULUM_BY_GRADE,
      RELEASED_CONTENT_PACKS.map((released) => released.id),
      RELEASED_PACK_CURRICULA
    );
