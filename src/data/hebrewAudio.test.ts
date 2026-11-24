import { describe, expect, it } from 'vitest';
import { HEBREW_AUDIO_GRADES, playsHebrewAloud, startsWithLettersLesson } from './hebrewAudio';

describe('playsHebrewAloud', () => {
  it('plays the Hebrew instructions by themselves for grades 1–2 only', () => {
    expect(playsHebrewAloud({ gradeId: 'grade-1', age: 6 })).toBe(true);
    expect(playsHebrewAloud({ gradeId: 'grade-2', age: 7 })).toBe(true);
    expect(playsHebrewAloud({ gradeId: 'grade-3', age: 6 })).toBe(false);
    expect(playsHebrewAloud({ gradeId: 'grade-12', age: 7 })).toBe(false);
  });

  it('stays quiet for a child of 8 or more who starts English at grade 1–2: they read Hebrew', () => {
    expect(playsHebrewAloud({ gradeId: 'grade-1', age: 8 })).toBe(false);
    expect(playsHebrewAloud({ gradeId: 'grade-2', age: 12 })).toBe(false);
  });

  it('keeps the Hebrew for an early grade when the age is missing', () => {
    expect(playsHebrewAloud({ gradeId: 'grade-1', age: Number.NaN })).toBe(true);
  });
});

describe('startsWithLettersLesson', () => {
  it('goes by English level only: an 8-year-old beginner still starts with the letters', () => {
    expect(startsWithLettersLesson('grade-1')).toBe(true);
    expect(startsWithLettersLesson('grade-2')).toBe(true);
    expect(startsWithLettersLesson('grade-3')).toBe(false);
  });
});

describe('HEBREW_AUDIO_GRADES', () => {
  it('lists only grades 1–2, the only grades that get Hebrew clips', () => {
    expect([...HEBREW_AUDIO_GRADES]).toEqual(['grade-1', 'grade-2']);
  });
});
