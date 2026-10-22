import type { ExamBankPack } from '../../examBank/types';
import type { LessonPack } from '../../lessons/types';

/** Every grade's lessons and exam bank of the holidays pack at once, for the tests and the read-aloud corpus only. */
export const HOLIDAYS_LESSONS: Partial<Record<number, LessonPack>> = {};

export const HOLIDAYS_EXAM_BANKS: Partial<Record<number, ExamBankPack>> = {};
