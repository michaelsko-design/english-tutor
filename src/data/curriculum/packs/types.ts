import type { GradeId } from '../../../types/learner';
import type { ExamBankPack } from '../examBank/types';
import type { LessonPack } from '../lessons/types';
import type { GradeCurriculumPack } from '../types';

/**
 * Content expansion packs: one extra unit in every grade, written, tested and voiced ahead of time
 * and switched on later as an update or a seasonal special (`registry.ts`). One unit per pack, so
 * new content can ship a little at a time.
 */
export type ContentPackId = 'season2-1' | 'season2-2' | 'core-3' | 'holidays-autumn' | 'holidays-spring';

/**
 * `core` packs continue the grade's path and enrich it toward the Ministry curriculum, one after
 * another (`after`); `seasonal` packs are themed specials on their own open track.
 */
export type PackKind = 'core' | 'seasonal';

/**
 * How a released pack's units unlock: `sequence` continues the grade's path (after unit 4's Boss),
 * `open` starts its own track that is playable at once.
 */
export type PackUnlock = 'sequence' | 'open';

/** New words each mission teaches: the same in every grade, or one number for grades 1–3 and one for 4–12 */
export type WordsPerMission = number | { readonly upToGrade3: number; readonly fromGrade4: number };

export interface ContentPack {
  id: ContentPackId;
  titleHe: string;
  titleEn: string;
  unlock: PackUnlock;
  kind: PackKind;
  /** A sequence pack that must be released before this one (its unit comes first on the path) */
  after?: ContentPackId;
  /** The unit number in the pack's mission ids (`g5-u21-m1`), the same in every grade */
  idUnitNumber: number;
  /** The unit number its rewards are scaled by, so a pack pays like units 5–8 */
  xpUnitNumber: number;
  /** New words per mission (`packWordsPerMission`); core-3 onward use `ENRICHMENT_WORDS_PER_MISSION` */
  wordsPerMission: WordsPerMission;
  /**
   * The grades (1–12) that get the pack's unit, read with `packGrades`; all 12 when left out. A core
   * pack may skip a grade that is already complete (grade 1 has no core-3 to core-8).
   */
  grades?: readonly number[];
}

/**
 * A pack's unit of each grade, built with the grade's builder. Pack files build them with a
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

/** A released pack is Pro only unless its entry says `access: 'free'` */
export const DEFAULT_PACK_ACCESS: PackAccess = 'pro';

/** A pack switched on in the app, with the local day it shipped (`YYYY-MM-DD`) and who plays it (default Pro) */
export interface ReleasedPack {
  id: ContentPackId;
  releasedAt: string;
  access?: PackAccess;
}
