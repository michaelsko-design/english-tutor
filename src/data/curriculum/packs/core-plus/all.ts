import type { ExamBankPack } from '../../examBank/types';
import type { LessonPack } from '../../lessons/types';

/** Every grade's lessons and exam bank of the core-plus pack at once, for the tests and the read-aloud corpus only. */
export const CORE_PLUS_LESSONS: Partial<Record<number, LessonPack>> = {};

export const CORE_PLUS_EXAM_BANKS: Partial<Record<number, ExamBankPack>> = {};
