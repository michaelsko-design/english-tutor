import { describe, expect, it } from 'vitest';
import { hasCommaChip, joinSentenceChips, normalizeSentenceWithCommas } from './sentenceChips';

describe('sentence chips with a comma chip', () => {
  it('joins a comma chip to the word before it', () => {
    expect(joinSentenceChips(['If', 'it', 'rains', ',', 'we', 'stay'])).toBe('If it rains, we stay');
    expect(joinSentenceChips(['We', 'stay'])).toBe('We stay');
  });

  it('knows whether the bank has a comma chip', () => {
    expect(hasCommaChip(['it', ',', 'rains'])).toBe(true);
    expect(hasCommaChip(['it', 'rains'])).toBe(false);
  });

  it('counts where the comma is', () => {
    const target = normalizeSentenceWithCommas('If it rains, we stay at home.');
    expect(normalizeSentenceWithCommas(joinSentenceChips(['If', 'it', 'rains', ',', 'we', 'stay', 'at', 'home']))).toBe(target);
    // A comma in the wrong place, or none, is a different sentence
    expect(normalizeSentenceWithCommas(joinSentenceChips(['If', 'it', ',', 'rains', 'we', 'stay', 'at', 'home']))).not.toBe(target);
    expect(normalizeSentenceWithCommas(joinSentenceChips(['If', 'it', 'rains', 'we', 'stay', 'at', 'home']))).not.toBe(target);
  });

  it('still ignores case, the final stop and spacing', () => {
    expect(normalizeSentenceWithCommas('  However ,  it is clear!')).toBe('however, it is clear');
  });
});
