import type { ExamBankPack } from './types';
import { GRADE_7_EXAM_BANK } from './grade7';
import { GRADE_8_EXAM_BANK } from './grade8';
import { GRADE_9_EXAM_BANK } from './grade9';
import { GRADE_10_EXAM_BANK } from './grade10';
import { GRADE_11_EXAM_BANK } from './grade11';
import { GRADE_12_EXAM_BANK } from './grade12';

/**
 * Every grade's exam bank at once, for the tests and the read-aloud corpus only. The app loads one
 * grade at a time through `EXAM_BANK_LOADERS` (data/examBank.ts); keep both lists in step.
 */
export const ALL_EXAM_BANKS: Partial<Record<number, ExamBankPack>> = {
  7: GRADE_7_EXAM_BANK,
  8: GRADE_8_EXAM_BANK,
  9: GRADE_9_EXAM_BANK,
  10: GRADE_10_EXAM_BANK,
  11: GRADE_11_EXAM_BANK,
  12: GRADE_12_EXAM_BANK,
};
