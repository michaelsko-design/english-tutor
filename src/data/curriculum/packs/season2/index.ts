import type { PackCurriculum, PackExamBankLoaders, PackLessonLoaders } from '../types';
import { SEASON2_1_GRADE_1_CURRICULUM, SEASON2_2_GRADE_1_CURRICULUM } from './curriculum/grade1';
import { SEASON2_1_GRADE_2_CURRICULUM, SEASON2_2_GRADE_2_CURRICULUM } from './curriculum/grade2';
import { SEASON2_1_GRADE_3_CURRICULUM, SEASON2_2_GRADE_3_CURRICULUM } from './curriculum/grade3';
import { SEASON2_1_GRADE_4_CURRICULUM, SEASON2_2_GRADE_4_CURRICULUM } from './curriculum/grade4';
import { SEASON2_1_GRADE_5_CURRICULUM, SEASON2_2_GRADE_5_CURRICULUM } from './curriculum/grade5';
import { SEASON2_1_GRADE_6_CURRICULUM, SEASON2_2_GRADE_6_CURRICULUM } from './curriculum/grade6';
import { SEASON2_1_GRADE_7_CURRICULUM, SEASON2_2_GRADE_7_CURRICULUM } from './curriculum/grade7';
import { SEASON2_1_GRADE_8_CURRICULUM, SEASON2_2_GRADE_8_CURRICULUM } from './curriculum/grade8';
import { SEASON2_1_GRADE_9_CURRICULUM, SEASON2_2_GRADE_9_CURRICULUM } from './curriculum/grade9';
import { SEASON2_1_GRADE_10_CURRICULUM, SEASON2_2_GRADE_10_CURRICULUM } from './curriculum/grade10';
import { SEASON2_1_GRADE_11_CURRICULUM, SEASON2_2_GRADE_11_CURRICULUM } from './curriculum/grade11';
import { SEASON2_1_GRADE_12_CURRICULUM, SEASON2_2_GRADE_12_CURRICULUM } from './curriculum/grade12';

/** The season2-1 pack (`../registry.ts`): its unit of every grade. Imported by the app only once the pack is released (or in the preview). */
export const SEASON2_1_CURRICULUM: PackCurriculum = {
  'grade-1': SEASON2_1_GRADE_1_CURRICULUM,
  'grade-2': SEASON2_1_GRADE_2_CURRICULUM,
  'grade-3': SEASON2_1_GRADE_3_CURRICULUM,
  'grade-4': SEASON2_1_GRADE_4_CURRICULUM,
  'grade-5': SEASON2_1_GRADE_5_CURRICULUM,
  'grade-6': SEASON2_1_GRADE_6_CURRICULUM,
  'grade-7': SEASON2_1_GRADE_7_CURRICULUM,
  'grade-8': SEASON2_1_GRADE_8_CURRICULUM,
  'grade-9': SEASON2_1_GRADE_9_CURRICULUM,
  'grade-10': SEASON2_1_GRADE_10_CURRICULUM,
  'grade-11': SEASON2_1_GRADE_11_CURRICULUM,
  'grade-12': SEASON2_1_GRADE_12_CURRICULUM,
};

/** The season2-2 pack (`../registry.ts`): its unit of every grade. Imported by the app only once the pack is released (or in the preview). */
export const SEASON2_2_CURRICULUM: PackCurriculum = {
  'grade-1': SEASON2_2_GRADE_1_CURRICULUM,
  'grade-2': SEASON2_2_GRADE_2_CURRICULUM,
  'grade-3': SEASON2_2_GRADE_3_CURRICULUM,
  'grade-4': SEASON2_2_GRADE_4_CURRICULUM,
  'grade-5': SEASON2_2_GRADE_5_CURRICULUM,
  'grade-6': SEASON2_2_GRADE_6_CURRICULUM,
  'grade-7': SEASON2_2_GRADE_7_CURRICULUM,
  'grade-8': SEASON2_2_GRADE_8_CURRICULUM,
  'grade-9': SEASON2_2_GRADE_9_CURRICULUM,
  'grade-10': SEASON2_2_GRADE_10_CURRICULUM,
  'grade-11': SEASON2_2_GRADE_11_CURRICULUM,
  'grade-12': SEASON2_2_GRADE_12_CURRICULUM,
};

/**
 * Lazy loaders for the Season 2 source's lessons and exam banks, shared by its two packs: lessons are
 * keyed by mission id and banks by the unit number in the mission ids, so each pack only picks up
 * its own unit's (`mergeLessonPacks`, `mergeExamBank`).
 */
export const SEASON2_LESSON_LOADERS: PackLessonLoaders = {
  1: () => import('./lessons/grade1').then((m) => m.SEASON2_GRADE_1_LESSONS),
  2: () => import('./lessons/grade2').then((m) => m.SEASON2_GRADE_2_LESSONS),
  3: () => import('./lessons/grade3').then((m) => m.SEASON2_GRADE_3_LESSONS),
  4: () => import('./lessons/grade4').then((m) => m.SEASON2_GRADE_4_LESSONS),
  5: () => import('./lessons/grade5').then((m) => m.SEASON2_GRADE_5_LESSONS),
  6: () => import('./lessons/grade6').then((m) => m.SEASON2_GRADE_6_LESSONS),
  7: () => import('./lessons/grade7').then((m) => m.SEASON2_GRADE_7_LESSONS),
  8: () => import('./lessons/grade8').then((m) => m.SEASON2_GRADE_8_LESSONS),
  9: () => import('./lessons/grade9').then((m) => m.SEASON2_GRADE_9_LESSONS),
  10: () => import('./lessons/grade10').then((m) => m.SEASON2_GRADE_10_LESSONS),
  11: () => import('./lessons/grade11').then((m) => m.SEASON2_GRADE_11_LESSONS),
  12: () => import('./lessons/grade12').then((m) => m.SEASON2_GRADE_12_LESSONS),
};

export const SEASON2_EXAM_BANK_LOADERS: PackExamBankLoaders = {
  1: () => import('./examBank/grade1').then((m) => m.SEASON2_GRADE_1_EXAM_BANK),
  2: () => import('./examBank/grade2').then((m) => m.SEASON2_GRADE_2_EXAM_BANK),
  3: () => import('./examBank/grade3').then((m) => m.SEASON2_GRADE_3_EXAM_BANK),
  4: () => import('./examBank/grade4').then((m) => m.SEASON2_GRADE_4_EXAM_BANK),
  5: () => import('./examBank/grade5').then((m) => m.SEASON2_GRADE_5_EXAM_BANK),
  6: () => import('./examBank/grade6').then((m) => m.SEASON2_GRADE_6_EXAM_BANK),
  7: () => import('./examBank/grade7').then((m) => m.SEASON2_GRADE_7_EXAM_BANK),
  8: () => import('./examBank/grade8').then((m) => m.SEASON2_GRADE_8_EXAM_BANK),
  9: () => import('./examBank/grade9').then((m) => m.SEASON2_GRADE_9_EXAM_BANK),
  10: () => import('./examBank/grade10').then((m) => m.SEASON2_GRADE_10_EXAM_BANK),
  11: () => import('./examBank/grade11').then((m) => m.SEASON2_GRADE_11_EXAM_BANK),
  12: () => import('./examBank/grade12').then((m) => m.SEASON2_GRADE_12_EXAM_BANK),
};
