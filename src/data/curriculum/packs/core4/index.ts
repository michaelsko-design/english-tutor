import type { PackCurriculum, PackExamBankLoaders, PackLessonLoaders } from '../types';
import { CORE_4_GRADE_2_CURRICULUM } from './curriculum/grade2';
import { CORE_4_GRADE_3_CURRICULUM } from './curriculum/grade3';
import { CORE_4_GRADE_4_CURRICULUM } from './curriculum/grade4';
import { CORE_4_GRADE_5_CURRICULUM } from './curriculum/grade5';
import { CORE_4_GRADE_6_CURRICULUM } from './curriculum/grade6';
import { CORE_4_GRADE_7_CURRICULUM } from './curriculum/grade7';
import { CORE_4_GRADE_8_CURRICULUM } from './curriculum/grade8';
import { CORE_4_GRADE_9_CURRICULUM } from './curriculum/grade9';
import { CORE_4_GRADE_10_CURRICULUM } from './curriculum/grade10';
import { CORE_4_GRADE_11_CURRICULUM } from './curriculum/grade11';
import { CORE_4_GRADE_12_CURRICULUM } from './curriculum/grade12';

/**
 * The core-4 pack (`../registry.ts`): its unit of every grade it lists (grade 1 is skipped). The grades
 * here match `CORE_4_GRADES`. Imported by the app only once
 * the pack is released (or in the preview).
 */
export const CORE_4_CURRICULUM: PackCurriculum = {
  'grade-2': CORE_4_GRADE_2_CURRICULUM,
  'grade-3': CORE_4_GRADE_3_CURRICULUM,
  'grade-4': CORE_4_GRADE_4_CURRICULUM,
  'grade-5': CORE_4_GRADE_5_CURRICULUM,
  'grade-6': CORE_4_GRADE_6_CURRICULUM,
  'grade-7': CORE_4_GRADE_7_CURRICULUM,
  'grade-8': CORE_4_GRADE_8_CURRICULUM,
  'grade-9': CORE_4_GRADE_9_CURRICULUM,
  'grade-10': CORE_4_GRADE_10_CURRICULUM,
  'grade-11': CORE_4_GRADE_11_CURRICULUM,
  'grade-12': CORE_4_GRADE_12_CURRICULUM,
};

/** Lazy loaders for the core-4 source's lessons (by mission id) and exam banks (by id unit number 24) */
export const CORE_4_LESSON_LOADERS: PackLessonLoaders = {
  2: () => import('./lessons/grade2').then((m) => m.CORE_4_GRADE_2_LESSONS),
  3: () => import('./lessons/grade3').then((m) => m.CORE_4_GRADE_3_LESSONS),
  4: () => import('./lessons/grade4').then((m) => m.CORE_4_GRADE_4_LESSONS),
  5: () => import('./lessons/grade5').then((m) => m.CORE_4_GRADE_5_LESSONS),
  6: () => import('./lessons/grade6').then((m) => m.CORE_4_GRADE_6_LESSONS),
  7: () => import('./lessons/grade7').then((m) => m.CORE_4_GRADE_7_LESSONS),
  8: () => import('./lessons/grade8').then((m) => m.CORE_4_GRADE_8_LESSONS),
  9: () => import('./lessons/grade9').then((m) => m.CORE_4_GRADE_9_LESSONS),
  10: () => import('./lessons/grade10').then((m) => m.CORE_4_GRADE_10_LESSONS),
  11: () => import('./lessons/grade11').then((m) => m.CORE_4_GRADE_11_LESSONS),
  12: () => import('./lessons/grade12').then((m) => m.CORE_4_GRADE_12_LESSONS),
};

export const CORE_4_EXAM_BANK_LOADERS: PackExamBankLoaders = {
  2: () => import('./examBank/grade2').then((m) => m.CORE_4_GRADE_2_EXAM_BANK),
  3: () => import('./examBank/grade3').then((m) => m.CORE_4_GRADE_3_EXAM_BANK),
  4: () => import('./examBank/grade4').then((m) => m.CORE_4_GRADE_4_EXAM_BANK),
  5: () => import('./examBank/grade5').then((m) => m.CORE_4_GRADE_5_EXAM_BANK),
  6: () => import('./examBank/grade6').then((m) => m.CORE_4_GRADE_6_EXAM_BANK),
  7: () => import('./examBank/grade7').then((m) => m.CORE_4_GRADE_7_EXAM_BANK),
  8: () => import('./examBank/grade8').then((m) => m.CORE_4_GRADE_8_EXAM_BANK),
  9: () => import('./examBank/grade9').then((m) => m.CORE_4_GRADE_9_EXAM_BANK),
  10: () => import('./examBank/grade10').then((m) => m.CORE_4_GRADE_10_EXAM_BANK),
  11: () => import('./examBank/grade11').then((m) => m.CORE_4_GRADE_11_EXAM_BANK),
  12: () => import('./examBank/grade12').then((m) => m.CORE_4_GRADE_12_EXAM_BANK),
};
