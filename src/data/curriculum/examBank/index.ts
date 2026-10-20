import type { ExamBankPack } from './types';
import { GRADE_7_EXAM_BANK } from './grade7';

/**
 * Every grade's exam bank at once, for the tests and the read-aloud corpus only. The app loads one
 * grade at a time through `EXAM_BANK_LOADERS` (data/examBank.ts); keep both lists in step.
 */
export const ALL_EXAM_BANKS: Partial<Record<number, ExamBankPack>> = {
  7: GRADE_7_EXAM_BANK,
};
