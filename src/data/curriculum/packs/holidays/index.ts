import type { PackCurriculum, PackExamBankLoaders, PackLessonLoaders } from '../types';

/**
 * The holidays pack (`../registry.ts`): its two units of every grade, and lazy loaders for their
 * lessons and exam banks. Imported by the app only once the pack is released (or in the preview).
 */
export const HOLIDAYS_CURRICULUM: PackCurriculum = {};

export const HOLIDAYS_LESSON_LOADERS: PackLessonLoaders = {};

export const HOLIDAYS_EXAM_BANK_LOADERS: PackExamBankLoaders = {};
