import { describe, expect, it } from 'vitest';
import { canSplit, SPLIT_TAKE, splitPieces, stitchPieces, withChosenTake } from './hebrewSplitLines';
import type { Pcm } from './geminiTts';

const RATE = 24000;
/** A loud stretch of `ms` milliseconds with no quiet at its edges. */
const tone = (ms: number): Pcm => ({ samples: new Int16Array((RATE * ms) / 1000).fill(8000), sampleRate: RATE });
const lengthMs = (pcm: Pcm) => Math.round((pcm.samples.length * 1000) / pcm.sampleRate);

describe('withChosenTake', () => {
  it('records the line when the split take is chosen', () => {
    expect(withChosenTake({}, 'abc', 'robot מתחיל באות R.', SPLIT_TAKE)).toEqual({ abc: 'robot מתחיל באות R.' });
  });

  it('drops the line when a whole take is chosen, leaving the others', () => {
    const lines = { abc: 'robot מתחיל באות R.', def: 'zipper מתחיל באות Z.' };
    expect(withChosenTake(lines, 'abc', 'robot מתחיל באות R.', 'new')).toEqual({ def: 'zipper מתחיל באות Z.' });
    expect(lines).toHaveProperty('abc');
  });
});

describe('canSplit', () => {
  it('splits a Hebrew line with an English word in it', () => {
    expect(canSplit('robot מתחיל באות R.')).toBe(true);
    expect(splitPieces('zipper מתחיל באות Z.')).toEqual(['zipper', 'מתחיל באות', 'Zed.']);
  });

  it('keeps Hebrew-only lines and English-only lines whole', () => {
    expect(canSplit('קרא את הסיפור הקצר. מה גדול?')).toBe(false);
    expect(canSplit('run')).toBe(false);
  });
});

describe('stitchPieces', () => {
  it('pauses longer after a sentence than between pieces of one', () => {
    const inSentence = stitchPieces([tone(100), tone(100)], ['zipper', 'מתחיל באות']);
    const afterSentence = stitchPieces([tone(100), tone(100)], ['זוֹ האות זֶד.', 'זֶד כמו']);
    expect(lengthMs(inSentence)).toBe(240);
    expect(lengthMs(afterSentence)).toBe(490);
  });
});
