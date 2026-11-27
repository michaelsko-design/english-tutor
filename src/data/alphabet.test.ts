import { describe, expect, it } from 'vitest';
import { getAlphabetLetter, getLetterExampleHe, getLetterLikeHe } from './alphabet';

describe('letter example wording', () => {
  it('links a letter to a word it begins', () => {
    const letter = getAlphabetLetter('A');
    expect(getLetterLikeHe(letter)).toBe('כמו');
    expect(getLetterExampleHe(letter, letter.words[0])).toBe(`A כמו ${letter.words[0].he}`);
  });

  it('says X is heard at the end of fox, not as if fox began with it', () => {
    const letter = getAlphabetLetter('X');
    expect(getLetterLikeHe(letter)).toBe('כמו בסוף המילה');
    expect(getLetterExampleHe(letter, letter.words[0])).toBe('X כמו בסוף המילה fox');
  });
});
