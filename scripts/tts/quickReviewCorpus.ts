/**
 * The 1-minute review's Hebrew for grades 1–2 (Feature 47; data/quickReview.ts). A learner's review
 * words are the mission and deck words of the grade they missed, so every such word's fixed lines
 * are voiced: the meaning question, the right answer and the "another word" line, plus the prompts
 * and the home card. The word-shape hints depend on which other words share the review, so they
 * stay on the online Hebrew voice.
 */
import { CURRICULUM_WITH_ALL_PACKS as CURRICULUM_BY_GRADE } from '../../src/data/curriculum/packs/all';
import { getMagnetPromptHe, getMeaningPromptHe, getMeaningRightHe, getMeaningWrongHe } from '../../src/data/customWordLists';
import { HEBREW_AUDIO_GRADES } from '../../src/data/hebrewAudio';
import { gradeIdToNumber } from '../../src/data/placementTest';
import { QUICK_REVIEW_SPOKEN_HE, sentenceBuilderPromptHe } from '../../src/data/quickReview';
import { ALL_WORD_DECKS } from '../../src/data/wordDecks/all';
import { getWordItemKind } from '../../src/data/wordDecks/deckSession';
import type { LearnerGender } from '../../src/types/learner';
import type { CorpusBuilder } from './corpusBuilder';

const GENDERS: LearnerGender[] = ['girl', 'boy'];

interface ReviewWord {
  wordEn: string;
  translationHe: string;
}

/** Every word a grade 1–2 learner can miss: the missions' vocabulary and the decks' words. */
export function getYoungReviewWords(): ReviewWord[] {
  return HEBREW_AUDIO_GRADES.flatMap((gradeId) => [
    ...CURRICULUM_BY_GRADE[gradeId].units.flatMap((unit) => unit.missions.flatMap((mission) => mission.vocabulary)),
    ...(ALL_WORD_DECKS[gradeIdToNumber(gradeId)] ?? []).flatMap((deck) => deck.items),
  ]).map((item) => ({ wordEn: item.wordEn.trim(), translationHe: item.translationHe.trim() }));
}

export function addQuickReviewHebrew(corpus: CorpusBuilder): void {
  corpus.add(QUICK_REVIEW_SPOKEN_HE);
  GENDERS.forEach((gender) => {
    corpus.add(getMagnetPromptHe(gender));
    corpus.add(sentenceBuilderPromptHe(gender));
  });
  getYoungReviewWords()
    .filter((word) => word.wordEn && word.translationHe && getWordItemKind(word.wordEn) === 'word')
    .forEach((word) => {
      corpus.add(getMeaningPromptHe(word.translationHe));
      corpus.add(getMeaningRightHe(word.wordEn, word.translationHe));
      GENDERS.forEach((gender) => corpus.add(getMeaningWrongHe(word.wordEn, gender)));
    });
}
