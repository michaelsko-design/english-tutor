import { describe, expect, it } from 'vitest';
import { isCloudSpeakable, isHebrewSpeakable } from '../../src/services/tts/ttsText';
import { ALL_WORD_DECKS } from '../../src/data/wordDecks/all';
import { FIXTURE_DECK } from '../../src/data/wordDecks/fixtures';
import { buildDeckSteps, getDeckItemReading, getDeckSaltCount } from '../../src/data/wordDecks/deckSession';
import { CorpusBuilder } from './corpusBuilder';
import { addDeckEnglish, addDeckHebrew, getDeckStepHebrew } from './deckCorpus';

const englishCorpus = () => new CorpusBuilder(isCloudSpeakable);
const hebrewCorpus = () => new CorpusBuilder(isHebrewSpeakable, true);
const texts = (corpus: CorpusBuilder) => corpus.list().map((phrase) => phrase.text);

describe('deck read-aloud corpus', () => {
  it('voices every deck word (normal and slow), example and the Vault reading', () => {
    const corpus = englishCorpus();
    addDeckEnglish(corpus, [FIXTURE_DECK]);
    const phrases = corpus.list();
    expect(phrases.filter((p) => p.text === 'apple').map((p) => p.speed).sort()).toEqual(['normal', 'slow']);
    expect(texts(corpus)).toEqual(expect.arrayContaining(['I eat an apple.', 'apple. I eat an apple.', 'all the time', 'time']));
  });

  it('voices the deck titles and every session’s Hebrew for both genders', () => {
    const corpus = hebrewCorpus();
    addDeckHebrew(corpus, [FIXTURE_DECK]);
    const voiced = new Set(texts(corpus));
    expect(voiced.has(FIXTURE_DECK.topicHe)).toBe(true);
    const meaning = buildDeckSteps(FIXTURE_DECK, 'boy', getDeckSaltCount(FIXTURE_DECK) - 1).find((s) => s.type === 'meaning-match');
    expect(meaning && voiced.has(meaning.promptHe)).toBe(true);
    const boyPrompt = buildDeckSteps(FIXTURE_DECK, 'boy', 0).find((s) => s.type === 'voice-speak')?.promptHe;
    expect(boyPrompt && voiced.has(boyPrompt)).toBe(true);
    expect(getDeckStepHebrew(buildDeckSteps(FIXTURE_DECK, 'girl', 0)[0]).length).toBeGreaterThan(0);
  });

  it('voices every written deck: each word, its example and the Vault reading, with no "?." after a phrase', () => {
    const decks = Object.values(ALL_WORD_DECKS).flat();
    const corpus = englishCorpus();
    addDeckEnglish(corpus, decks);
    // A clip's text may differ in case only ("Earth" is voiced as "earth")
    const voiced = new Set(texts(corpus).map((text) => text.toLowerCase()));
    const isVoiced = (text: string) => voiced.has(text.toLowerCase());
    decks.forEach((deck) =>
      deck.items.forEach((item) => {
        expect(isVoiced(item.wordEn), item.wordEn).toBe(true);
        expect(isVoiced(item.exampleEn), item.exampleEn).toBe(true);
        expect(isVoiced(getDeckItemReading(item)), item.wordEn).toBe(true);
      })
    );
    expect([...voiced].filter((text) => /[?!]\./.test(text))).toEqual([]);
  });
});
