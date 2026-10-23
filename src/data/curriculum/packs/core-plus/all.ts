import type { ExamBankPack } from '../../examBank/types';
import type { LessonPack } from '../../lessons/types';
import { CORE_PLUS_GRADE_1_LESSONS } from './lessons/grade1';
import { CORE_PLUS_GRADE_2_LESSONS } from './lessons/grade2';
import { CORE_PLUS_GRADE_3_LESSONS } from './lessons/grade3';
import { CORE_PLUS_GRADE_4_LESSONS } from './lessons/grade4';
import { CORE_PLUS_GRADE_5_LESSONS } from './lessons/grade5';
import { CORE_PLUS_GRADE_6_LESSONS } from './lessons/grade6';
import { CORE_PLUS_GRADE_7_LESSONS } from './lessons/grade7';
import { CORE_PLUS_GRADE_8_LESSONS } from './lessons/grade8';
import { CORE_PLUS_GRADE_9_LESSONS } from './lessons/grade9';
import { CORE_PLUS_GRADE_10_LESSONS } from './lessons/grade10';
import { CORE_PLUS_GRADE_11_LESSONS } from './lessons/grade11';
import { CORE_PLUS_GRADE_12_LESSONS } from './lessons/grade12';
import { CORE_PLUS_GRADE_1_EXAM_BANK } from './examBank/grade1';
import { CORE_PLUS_GRADE_2_EXAM_BANK } from './examBank/grade2';
import { CORE_PLUS_GRADE_3_EXAM_BANK } from './examBank/grade3';
import { CORE_PLUS_GRADE_4_EXAM_BANK } from './examBank/grade4';
import { CORE_PLUS_GRADE_5_EXAM_BANK } from './examBank/grade5';
import { CORE_PLUS_GRADE_6_EXAM_BANK } from './examBank/grade6';
import { CORE_PLUS_GRADE_7_EXAM_BANK } from './examBank/grade7';
import { CORE_PLUS_GRADE_8_EXAM_BANK } from './examBank/grade8';
import { CORE_PLUS_GRADE_9_EXAM_BANK } from './examBank/grade9';
import { CORE_PLUS_GRADE_10_EXAM_BANK } from './examBank/grade10';
import { CORE_PLUS_GRADE_11_EXAM_BANK } from './examBank/grade11';
import { CORE_PLUS_GRADE_12_EXAM_BANK } from './examBank/grade12';

/** Every grade's lessons and exam bank of the core-plus pack at once, for the tests and the read-aloud corpus only. */
export const CORE_PLUS_LESSONS: Partial<Record<number, LessonPack>> = {
  1: CORE_PLUS_GRADE_1_LESSONS,
  2: CORE_PLUS_GRADE_2_LESSONS,
  3: CORE_PLUS_GRADE_3_LESSONS,
  4: CORE_PLUS_GRADE_4_LESSONS,
  5: CORE_PLUS_GRADE_5_LESSONS,
  6: CORE_PLUS_GRADE_6_LESSONS,
  7: CORE_PLUS_GRADE_7_LESSONS,
  8: CORE_PLUS_GRADE_8_LESSONS,
  9: CORE_PLUS_GRADE_9_LESSONS,
  10: CORE_PLUS_GRADE_10_LESSONS,
  11: CORE_PLUS_GRADE_11_LESSONS,
  12: CORE_PLUS_GRADE_12_LESSONS,
};

export const CORE_PLUS_EXAM_BANKS: Partial<Record<number, ExamBankPack>> = {
  1: CORE_PLUS_GRADE_1_EXAM_BANK,
  2: CORE_PLUS_GRADE_2_EXAM_BANK,
  3: CORE_PLUS_GRADE_3_EXAM_BANK,
  4: CORE_PLUS_GRADE_4_EXAM_BANK,
  5: CORE_PLUS_GRADE_5_EXAM_BANK,
  6: CORE_PLUS_GRADE_6_EXAM_BANK,
  7: CORE_PLUS_GRADE_7_EXAM_BANK,
  8: CORE_PLUS_GRADE_8_EXAM_BANK,
  9: CORE_PLUS_GRADE_9_EXAM_BANK,
  10: CORE_PLUS_GRADE_10_EXAM_BANK,
  11: CORE_PLUS_GRADE_11_EXAM_BANK,
  12: CORE_PLUS_GRADE_12_EXAM_BANK,
};
