import type { LessonPack } from './types';
import { GRADE_1_LESSONS } from './grade1';
import { GRADE_2_LESSONS } from './grade2';
import { GRADE_3_LESSONS } from './grade3';
import { GRADE_4_LESSONS } from './grade4';
import { GRADE_5_LESSONS } from './grade5';
import { GRADE_6_LESSONS } from './grade6';
import { GRADE_7_LESSONS } from './grade7';
import { GRADE_8_LESSONS } from './grade8';
import { GRADE_9_LESSONS } from './grade9';
import { GRADE_10_LESSONS } from './grade10';
import { GRADE_11_LESSONS } from './grade11';
import { GRADE_12_LESSONS } from './grade12';

/**
 * Every grade's lessons at once, for the tests and the read-aloud corpus only. The app loads one
 * grade at a time through `LESSON_PACK_LOADERS` (data/miniLessons.ts); keep both lists in step.
 */
export const ALL_LESSON_PACKS: Record<number, LessonPack> = {
  1: GRADE_1_LESSONS,
  2: GRADE_2_LESSONS,
  3: GRADE_3_LESSONS,
  4: GRADE_4_LESSONS,
  5: GRADE_5_LESSONS,
  6: GRADE_6_LESSONS,
  7: GRADE_7_LESSONS,
  8: GRADE_8_LESSONS,
  9: GRADE_9_LESSONS,
  10: GRADE_10_LESSONS,
  11: GRADE_11_LESSONS,
  12: GRADE_12_LESSONS,
};
