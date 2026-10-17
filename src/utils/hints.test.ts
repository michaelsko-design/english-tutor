import { describe, expect, it } from 'vitest';
import {
  findAnswerSentenceNumber,
  getPronunciationTipHe,
  getSentenceOrderHintHe,
  getSpellingHintHe,
  getWordShapeHintHe,
  toClozeSentence,
} from './hints';

describe('getWordShapeHintHe', () => {
  it('gives only the letter count when no other option has the same length', () => {
    const hint = getWordShapeHintHe('cat', ['horse']);
    expect(hint).toContain('3 אותיות');
    expect(hint).not.toContain('C');
  });

  it('adds the first letter when another option has the same length', () => {
    const hint = getWordShapeHintHe('cat', ['dog']);
    expect(hint).toContain('באות C');
    expect(hint).toContain('3 אותיות');
  });

  it('counts only letters of a phrase', () => {
    expect(getWordShapeHintHe('ice cream', ['ball'])).toContain('8 אותיות');
  });
});

describe('getSpellingHintHe', () => {
  it('names the first letter and the letter count', () => {
    expect(getSpellingHintHe(['l', 'a', 'm', 'p'])).toBe('המילה מתחילה באות "l" ויש בה 4 אותיות.');
  });
});

describe('toClozeSentence', () => {
  it('blanks the word out of the sentence', () => {
    expect(toClozeSentence('I have a red apple.', 'apple')).toBe('I have a red ____.');
  });

  it('blanks inflected forms and ignores case', () => {
    expect(toClozeSentence('She runs every day.', 'run')).toBe('She ____ every day.');
    expect(toClozeSentence('We are making a cake.', 'make')).toBe('We are ____ a cake.');
    expect(toClozeSentence('He studies at night.', 'study')).toBe('He ____ at night.');
    expect(toClozeSentence('Happy birthday!', 'happy')).toBe('____ birthday!');
  });

  it('blanks every occurrence and multi-word entries', () => {
    expect(toClozeSentence('A cat and a cat.', 'cat')).toBe('A ____ and a ____.');
    expect(toClozeSentence('The bank is next to the park.', 'next to')).toBe('The bank is ____ the park.');
  });

  it('returns null when the word is not in the sentence', () => {
    expect(toClozeSentence('Yesterday I went home.', 'go')).toBeNull();
  });
});

describe('getSentenceOrderHintHe', () => {
  it('gives the last word and the count for short sentences, without punctuation', () => {
    expect(getSentenceOrderHintHe(['My', 'dog', 'is', 'big.'])).toBe('המשפט מסתיים במילה "big" ויש בו 4 מילים.');
  });

  it('gives the first and last words for longer sentences', () => {
    const hint = getSentenceOrderHintHe(['I', 'have', 'a', 'red', 'ball.']);
    expect(hint).toContain('"I"');
    expect(hint).toContain('"ball"');
    expect(hint).toContain('5 מילים');
  });
});

describe('getPronunciationTipHe', () => {
  it.each([
    ['I think so.', 'think', 'th'],
    ['I want it.', 'want', 'w'],
    ['I know it.', 'know', 'k'],
    ['Please write it.', 'write', 'w'],
    ['Good night.', 'night', 'gh'],
    ['I can climb.', 'climb', 'b'],
    ['I played.', 'played', 'ed'],
    ['It ended.', 'ended', 'אִד'],
    ['I am singing.', 'singing', 'ing'],
    ['I like cake.', 'like', 'e'],
    ['I see a tree.', 'see', 'ee'],
  ])('finds the tricky sound in "%s"', (sentence, word, sound) => {
    const tip = getPronunciationTipHe(sentence);
    expect(tip).toContain(`"${word}"`);
    expect(tip).toContain(sound);
  });

  it('prefers th over later rules', () => {
    expect(getPronunciationTipHe('I played with three balls.')).toContain('"three"');
  });

  it('tries content words before function words like "the"', () => {
    expect(getPronunciationTipHe('The kids played.')).toContain('"played"');
    expect(getPronunciationTipHe('Look at the sun.')).toContain('"the"');
  });

  it('skips words whose final e does not lengthen the vowel', () => {
    expect(getPronunciationTipHe('I have a big dog.')).toContain('🐢');
  });

  it('falls back to the slow listening tip', () => {
    expect(getPronunciationTipHe('I am big.')).toContain('🐢');
  });
});

describe('findAnswerSentenceNumber', () => {
  const passage = 'Dana has a pet. It is a small parrot. It likes apples.';

  it('finds the sentence that holds the answer', () => {
    expect(findAnswerSentenceNumber(passage, 'a parrot', 'What does Dana have?')).toBe(2);
    expect(findAnswerSentenceNumber(passage, 'apples', 'What does it like?')).toBe(3);
  });

  it('falls back to the question words when the answer is not in the passage', () => {
    expect(findAnswerSentenceNumber(passage, 'fruit', 'What does the pet like?')).toBe(1);
  });

  it('does not split sentences after titles or inside numbers', () => {
    const withTitle = 'The cave was dark. Dr. Green found glowing crystals. She took photos.';
    expect(findAnswerSentenceNumber(withTitle, 'glowing crystals', 'What did she find?')).toBe(2);
    const withNumber = 'The shop opens at 9. It sold 2.5 kilos of apples. Then it closed.';
    expect(findAnswerSentenceNumber(withNumber, 'apples', 'What did it sell?')).toBe(2);
  });

  it('returns null for a one-sentence passage or no match', () => {
    expect(findAnswerSentenceNumber('Dana has a parrot.', 'a parrot', 'What?')).toBeNull();
    expect(findAnswerSentenceNumber(passage, 'blue', 'Why?')).toBeNull();
  });
});
