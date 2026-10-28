import type { GradeId } from '../../../types/learner';
import type { ExamBankPack } from '../examBank/types';
import type { LessonPack } from '../lessons/types';
import type { GradeCurriculumPack } from '../types';

/**
 * Content expansion packs: extra units for every grade, written, tested and voiced ahead of time
 * and switched on later as an update or a seasonal special (`registry.ts`).
 */
export type ContentPackId = 'core-plus' | 'holidays';

/**
 * How a released pack's units unlock: `sequence` continues the grade's path (after unit 4's Boss),
 * `open` starts its own track that is playable at once.
 */
export type PackUnlock = 'sequence' | 'open';

export interface ContentPack {
  id: ContentPackId;
  titleHe: string;
  titleEn: string;
  unlock: PackUnlock;
  /** The unit numbers in the pack's mission ids (`g5-u21-m1`), the same in every grade */
  idUnitNumbers: readonly [number, number];
  /** The unit numbers its rewards are scaled by, so a pack pays like units 5–8 */
  xpUnitNumbers: readonly [number, number];
}

/**
 * A pack's two units of each grade, built with the grade's builder. Pack files build them with a
 * `/*#__PURE__*\/` call, so an unreleased pack is dropped from the production bundle.
 */
export type PackCurriculum = Partial<Record<GradeId, GradeCurriculumPack>>;

/** Lazy loaders by grade number, like `LESSON_PACK_LOADERS` and `EXAM_BANK_LOADERS` */
export type PackLessonLoaders = Partial<Record<number, () => Promise<LessonPack>>>;
/** A pack's exam bank loaders; each bank is keyed by the unit number in the mission ids (21, 22…) */
export type PackExamBankLoaders = Partial<Record<number, () => Promise<ExamBankPack>>>;

/** Everything one pack holds, for the tests, the read-aloud corpus and the preview */
export interface PackContent {
  pack: ContentPack;
  curriculum: PackCurriculum;
  lessons: Partial<Record<number, LessonPack>>;
  examBanks: Partial<Record<number, ExamBankPack>>;
}

/** Who plays a released pack: every learner, or Pro learners only (docs/feature-pro-tier.md) */
export type PackAccess = 'free' | 'pro';

/** A pack switched on in the app, with the local day it shipped (`YYYY-MM-DD`) and who plays it */
export interface ReleasedPack {
  id: ContentPackId;
  releasedAt: string;
  access: PackAccess;
}
