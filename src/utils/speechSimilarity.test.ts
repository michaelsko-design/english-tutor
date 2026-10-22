import { describe, expect, it } from 'vitest';
import { evaluateSpokenSentence } from './speechSimilarity';
import { CURRICULUM_WITH_ALL_PACKS } from '../data/curriculum/packs/all';

function expectFullMatch(target: string, spoken: string) {
  const result = evaluateSpokenSentence(target, spoken);
  expect(result.wordResults.filter((w) => !w.matched).map((w) => w.targetWord), spoken).toEqual([]);
  expect(result.scorePercent, spoken).toBe(100);
  expect(result.passed, spoken).toBe(true);
}

describe('evaluateSpokenSentence', () => {
  it('matches an exact transcript, ignoring case and punctuation', () => {
    expectFullMatch('I have two eyes and one nose.', 'i have two eyes and one nose');
  });

  it('marks missing words and fails below 80%', () => {
    const result = evaluateSpokenSentence('I have two eyes and one nose.', 'I have eyes');
    expect(result.passed).toBe(false);
    expect(result.wordResults.find((w) => w.targetWord === 'nose.')?.matched).toBe(false);
  });

  it('fails an empty transcript', () => {
    expect(evaluateSpokenSentence('Hello', '').passed).toBe(false);
  });

  it('still forgives a small slip on a long word', () => {
    expectFullMatch('The library is beautiful.', 'The library is beautifull');
  });

  it('keeps one result per target word', () => {
    const result = evaluateSpokenSentence("I don't like it at half past four.", 'I do not like it at 4:30');
    expect(result.wordResults.map((w) => w.targetWord)).toEqual([
      'I',
      "don't",
      'like',
      'it',
      'at',
      'half',
      'past',
      'four.',
    ]);
  });

  describe('numbers', () => {
    it('accepts digits for number words', () => {
      expectFullMatch('I have two eyes and one nose.', 'I have 2 eyes and 1 nose');
    });

    it('accepts number words for digits', () => {
      expectFullMatch('I have 2 eyes and 1 nose.', 'I have two eyes and one nose');
    });

    it('accepts compound numbers written either way', () => {
      expectFullMatch('There are twenty-five students.', 'There are 25 students');
      expectFullMatch('There are 25 students.', 'There are twenty five students');
      expectFullMatch('It costs one hundred shekels.', 'It costs 100 shekels');
    });

    it('accepts ordinals and percentages', () => {
      expectFullMatch('My birthday is on the third of May.', 'My birthday is on the 3rd of May');
      expectFullMatch('Sales grew by twenty percent.', 'Sales grew by 20%');
    });

    it('does not match a different number', () => {
      const result = evaluateSpokenSentence('I have two eyes.', 'I have 3 eyes');
      expect(result.wordResults.find((w) => w.targetWord === 'two')?.matched).toBe(false);
    });
  });

  describe('times', () => {
    it('accepts a clock time for "half past"', () => {
      expectFullMatch('It is half past three, so we go home.', 'it is 3:30 so we go home');
      expectFullMatch('Dan arrives at half past four.', 'Dan arrives at half past 4');
    });

    it("accepts a clock time for o'clock", () => {
      expectFullMatch("It is four o'clock.", 'It is 4:00');
      expectFullMatch("It is four o'clock.", "it's 4 o'clock");
      expectFullMatch("The bus will arrive at five o'clock.", 'the bus will arrive at 5:00');
      expectFullMatch("The bus will arrive at five o’clock.", "the bus will arrive at 5 o'clock");
    });

    it('accepts quarter past and quarter to', () => {
      expectFullMatch('We meet at quarter past six.', 'we meet at 6:15');
      expectFullMatch('We meet at quarter to seven.', 'we meet at 6:45');
    });

    it('accepts spoken words for a written clock time', () => {
      expectFullMatch('The film starts at 7:30.', 'the film starts at half past seven');
      expectFullMatch('The film starts at 7:30.', 'the film starts at seven thirty');
    });

    it('does not accept the wrong time', () => {
      const result = evaluateSpokenSentence('It is half past three.', 'it is 4:30');
      expect(result.passed).toBe(false);
    });
  });

  describe('contractions', () => {
    it('accepts the long form for a contraction', () => {
      expectFullMatch("I don't like rainy days.", 'I do not like rainy days');
      expectFullMatch("I'm happy today.", 'I am happy today');
      expectFullMatch("She can't swim.", 'she cannot swim');
      expectFullMatch("They're at school.", 'they are at school');
      expectFullMatch("We'll win the game.", 'we will win the game');
    });

    it('accepts a contraction for the long form', () => {
      expectFullMatch('I do not like rainy days.', "I don't like rainy days");
      expectFullMatch('I am happy today.', "I'm happy today");
      expectFullMatch('He is my friend.', "he's my friend");
      expectFullMatch('I would have helped you.', "I'd have helped you");
    });

    it('reads "he\'s" and "I\'d" the way the target needs', () => {
      expectFullMatch('He has finished his homework.', "he's finished his homework");
      expectFullMatch('If I had known, I would have come.', "If I'd known I'd have come");
    });

    it('accepts curly apostrophes', () => {
      expectFullMatch('I don’t know.', 'I do not know');
    });

    it('keeps possessives as they are', () => {
      expectFullMatch("Dana's bag is red.", "Dana's bag is red");
      const result = evaluateSpokenSentence("Dana's bag is red.", 'Dana is bag is red');
      expect(result.wordResults[0].matched).toBe(false);
    });

    it('needs every part of a contraction', () => {
      const result = evaluateSpokenSentence("I don't like it.", 'I do like it');
      expect(result.wordResults.find((w) => w.targetWord === "don't")?.matched).toBe(false);
    });
  });

  it('fully matches every curriculum speaking target read back exactly', () => {
    const targets = Object.values(CURRICULUM_WITH_ALL_PACKS).flatMap((pack) =>
      pack.units.flatMap((u) =>
        u.missions.flatMap((m) => [m.sampleSentenceEn, m.drillSeed?.shortSentenceEn ?? '', ...m.vocabulary.map((v) => v.wordEn)])
      )
    );
    for (const target of targets.filter(Boolean)) {
      expect(evaluateSpokenSentence(target, target).scorePercent, target).toBe(100);
    }
  });
});
