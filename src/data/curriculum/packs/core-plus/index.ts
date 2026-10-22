import type { PackCurriculum, PackExamBankLoaders, PackLessonLoaders } from '../types';

/**
 * The core-plus pack (`../registry.ts`): its two units of every grade, and lazy loaders for their
 * lessons and exam banks. Imported by the app only once the pack is released (or in the preview).
 */
export const CORE_PLUS_CURRICULUM: PackCurriculum = {};

export const CORE_PLUS_LESSON_LOADERS: PackLessonLoaders = {};

export const CORE_PLUS_EXAM_BANK_LOADERS: PackExamBankLoaders = {};
