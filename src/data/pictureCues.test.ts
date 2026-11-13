import { describe, expect, it } from 'vitest';
import { getPictureCue } from './pictureCues';

describe('getPictureCue', () => {
  it('keeps a clear picture', () => {
    expect(getPictureCue({ wordEn: 'apple', emoji: '🍎' })).toBe('🍎');
  });

  it('drops a picture that shows something else, so the card shows the Hebrew word', () => {
    expect(getPictureCue({ wordEn: 'doll', emoji: '🪆' })).toBeUndefined();
    expect(getPictureCue({ wordEn: 'Jump', emoji: '🦘' })).toBeUndefined();
  });

  it('drops a picture for an abstract word', () => {
    expect(getPictureCue({ wordEn: 'always', emoji: '✅' })).toBeUndefined();
    expect(getPictureCue({ wordEn: 'next to', emoji: '👉' })).toBeUndefined();
  });

  it('uses a clearer replacement picture', () => {
    expect(getPictureCue({ wordEn: 'grandparents', emoji: '👵' })).toBe('👵👴');
  });

  it('has no picture for a word without an emoji', () => {
    expect(getPictureCue({ wordEn: 'apple' })).toBeUndefined();
    expect(getPictureCue({ wordEn: 'apple', emoji: '' })).toBeUndefined();
  });
});
