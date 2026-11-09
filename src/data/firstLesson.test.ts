import { describe, expect, it } from 'vitest';
import { getFirstLesson } from './firstLesson';
import { getLessonCards } from './miniLessons';

describe('getFirstLesson', () => {
  const lesson = getFirstLesson();

  it('teaches the first letters, one card per letter', () => {
    expect(lesson.letters).toEqual(['A', 'B', 'C']);
    expect(lesson.examples.length).toBeGreaterThanOrEqual(3);
  });

  it('has nothing to answer: only the idea and the examples', () => {
    expect(lesson.quickTry).toBeUndefined();
    expect(getLessonCards(lesson)).toEqual(['idea', 'examples']);
  });

  it('shows a picture with every example, since the learner cannot read English yet', () => {
    expect(lesson.examples.every((example) => Boolean(example.emoji))).toBe(true);
  });

  it('is a copy: the mission lesson keeps its quick try', async () => {
    const { GRADE_1_PHONICS_LESSONS } = await import('./curriculum/lessons/grade1Phonics');
    expect(GRADE_1_PHONICS_LESSONS['g1-u11-m1'].quickTry).toBeDefined();
  });
});
