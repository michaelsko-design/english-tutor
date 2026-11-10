import { describe, expect, it } from 'vitest';
import { splitIconEmoji } from './emojiSegments';

describe('splitIconEmoji', () => {
  it('returns null for text without a drawn emoji', () => {
    expect(splitIconEmoji('')).toBeNull();
    expect(splitIconEmoji('שלום')).toBeNull();
  });

  it('splits text around a drawn emoji, with or without its variation selector', () => {
    expect(splitIconEmoji('🌋 הר געש')).toEqual([
      { kind: 'emoji', emoji: '🌋' },
      { kind: 'text', text: ' הר געש' },
    ]);
    expect(splitIconEmoji('a ☝️ b')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'emoji', emoji: '☝️' },
      { kind: 'text', text: ' b' },
    ]);
  });

  it('keeps a joined emoji whole when a variation selector sits inside it', () => {
    // "🕵️‍♀️" is 🕵 FE0F ZWJ ♀ FE0F: matching only 🕵 would leave a stray ♀ sign in the text
    expect(splitIconEmoji('🕵️‍♀️ שלב 4/5')).toEqual([
      { kind: 'emoji', emoji: '🕵️‍♀️' },
      { kind: 'text', text: ' שלב 4/5' },
    ]);
    expect(splitIconEmoji('🕵️‍♂️')).toEqual([{ kind: 'emoji', emoji: '🕵️‍♂️' }]);
  });
});
