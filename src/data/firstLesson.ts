import { GRADE_1_PHONICS_LESSONS } from './curriculum/lessons/grade1Phonics';
import type { MiniLesson } from './curriculum/lessons/types';

/** The mission whose letters lesson (A, B, C) is the first thing a grade 1–2 learner sees */
export const FIRST_LESSON_SOURCE_MISSION_ID = 'g1-u11-m1';

/**
 * The first lesson of a learner in grades 1–2, who is not expected to know the English letters yet
 * (English starts in grade 3): the letters lesson of the first phonics mission, without its quick
 * try, so there is nothing to answer. Each letter is a big card to tap and hear, with pictures of
 * simple words (cat, apple, ...). No new text or audio: it is the mission's own lesson.
 */
export function getFirstLesson(): MiniLesson {
  const { quickTry: _quickTry, ...lesson } = GRADE_1_PHONICS_LESSONS[FIRST_LESSON_SOURCE_MISSION_ID];
  void _quickTry;
  return lesson;
}
