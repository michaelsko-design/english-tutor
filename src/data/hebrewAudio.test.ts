import { describe, expect, it } from 'vitest';
import { playsHebrewAloud } from './hebrewAudio';

describe('playsHebrewAloud', () => {
  it('plays the Hebrew instructions by themselves for grades 1–2 only', () => {
    expect(playsHebrewAloud('grade-1')).toBe(true);
    expect(playsHebrewAloud('grade-2')).toBe(true);
    expect(playsHebrewAloud('grade-3')).toBe(false);
    expect(playsHebrewAloud('grade-12')).toBe(false);
  });
});
