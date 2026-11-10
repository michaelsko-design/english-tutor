/**
 * The Ministry word decks in the read-aloud corpus (docs/architecture.md §4.26.1). Every deck is voiced
 * before it ships, released or not, like the content packs. With no deck written yet these add nothing.
 */
import { buildDeckSteps, deckToWordList, getDeckItemReading, getDeckSaltCount } from '../../src/data/wordDecks/deckSession';
import type { WordListStep } from '../../src/data/customWordLists';
import type { WordDeck } from '../../src/data/wordDecks/types';
import type { LearnerGender } from '../../src/types/learner';
import type { CorpusBuilder } from './corpusBuilder';

const GENDERS: LearnerGender[] = ['girl', 'boy'];
const HEBREW_LETTER = /[א-ת]/;

/**
 * English: each word (normal and slow, as the Vault and the drills read it), its example sentence,
 * and the Vault's "word. example" reading. A phrase is practised with word magnets, which read
 * each word as it is placed.
 */
export function addDeckEnglish(corpus: CorpusBuilder, decks: readonly WordDeck[]): void {
  decks.forEach((deck) => {
    deck.items.forEach((item) => {
      corpus.addWord(item.wordEn);
      corpus.add(item.exampleEn);
      corpus.add(getDeckItemReading(item));
    });
    deckToWordList(deck)
      .items.filter((item) => item.kind === 'sentence')
      .forEach((item) => corpus.addSentenceAndWords(item.textEn));
  });
}

/** The Hebrew a deck session step shows: instruction, hint, card and the options' explanations. */
export function getDeckStepHebrew(step: WordListStep): string[] {
  return [step.promptHe, step.hintHe, step.translationHe, ...(step.options ?? []).map((option) => option.explanationHe)].filter(
    (text): text is string => Boolean(text) && HEBREW_LETTER.test(text as string)
  );
}

/**
 * Hebrew, for the grades that hear it (1–2): each deck's topic title, and every session's Hebrew
 * for both genders. A session's salt is one of `getDeckSaltCount` (`pickDeckSalt`), so this is
 * every session the learner can get.
 */
export function addDeckHebrew(corpus: CorpusBuilder, decks: readonly WordDeck[]): void {
  decks.forEach((deck) => {
    corpus.add(deck.topicHe);
    GENDERS.forEach((gender) => {
      for (let salt = 0; salt < getDeckSaltCount(deck); salt++) {
        buildDeckSteps(deck, gender, salt).forEach((step) => getDeckStepHebrew(step).forEach((text) => corpus.add(text)));
      }
    });
  });
}
