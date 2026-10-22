import { describe, expect, it } from 'vitest';
import { HEBREW_AUDIO_GRADES, playsHebrewAloud } from './hebrewAudio';

describe('playsHebrewAloud', () => {
  it('plays the Hebrew instructions by themselves for grades 1–2 only', () => {
    expect(playsHebrewAloud('grade-1')).toBe(true);
    expect(playsHebrewAloud('grade-2')).toBe(true);
    expect(playsHebrewAloud('grade-3')).toBe(false);
    expect(playsHebrewAloud('grade-12')).toBe(false);
  });
});

describe('HEBREW_AUDIO_GRADES', () => {
  it('lists only grades 1–2, the only grades that get Hebrew clips', () => {
    expect([...HEBREW_AUDIO_GRADES]).toEqual(['grade-1', 'grade-2']);
  });
});
