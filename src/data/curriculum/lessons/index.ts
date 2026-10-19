import type { LessonPack } from './types';
import { GRADE_7_LESSONS } from './grade7';

/**
 * Every grade's lessons at once, for the tests and the read-aloud corpus only. The app loads one
 * grade at a time through `LESSON_PACK_LOADERS` (data/miniLessons.ts); keep both lists in step.
 */
export const ALL_LESSON_PACKS: Record<number, LessonPack> = {
  7: GRADE_7_LESSONS,
};
