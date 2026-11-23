import type { MissedWord } from '../types/learner';
import type { VocabularyItem } from './curriculum/types';
import type { MissionExerciseStep } from './missionExercises';
import { deckWordKey, getFirstTryItemIds, type DeckSessionAnswer } from './wordDecks/deckMastery';

/**
 * Missed words and the 1-minute review (retention audit follow-up, docs/architecture.md §4.7.1):
 * a word the learner got wrong on the first try in a mission or a deck session waits on the
 * profile (`missedWords`, keyed by `deckWordKey`); a short review of a few of them is offered on
 * the home screen once a day. A word answered right on the first try in the review stops waiting.
 */

export type MissedWordMap = Record<string, MissedWord>;

/** At most this many words are kept (the newest), so the profile stays small */
export const MISSED_WORDS_MAX = 40;
/** Words in one review: a meaning match and a magnets step each, about a minute */
export const QUICK_REVIEW_WORD_COUNT = 4;
/** The review needs this many waiting words (a meaning match needs two other words as options) */
export const QUICK_REVIEW_MIN_WORDS = 3;

export interface MissedWordInput {
  wordEn: string;
  translationHe: string;
}

export function isMissedWordWaiting(word: MissedWord): boolean {
  return !word.clearedOn || word.missedOn > word.clearedOn;
}

function latestDate(word: MissedWord): string {
  return word.clearedOn && word.clearedOn > word.missedOn ? word.clearedOn : word.missedOn;
}

/** Keeps the newest `MISSED_WORDS_MAX` words, waiting words first. */
function pruneMissedWords(map: MissedWordMap): MissedWordMap {
  const entries = Object.entries(map);
  if (entries.length <= MISSED_WORDS_MAX) return map;
  const kept = [...entries]
    .sort(([, a], [, b]) => {
      const waitingOrder = Number(isMissedWordWaiting(b)) - Number(isMissedWordWaiting(a));
      return waitingOrder || latestDate(b).localeCompare(latestDate(a));
    })
    .slice(0, MISSED_WORDS_MAX);
  return Object.fromEntries(kept);
}

/** Records words missed today; a word reviewed before waits again. */
export function recordMissedWords(
  map: MissedWordMap | undefined,
  words: readonly MissedWordInput[],
  todayStr: string
): MissedWordMap | undefined {
  const usable = words.filter((word) => word.wordEn.trim() && word.translationHe.trim());
  if (!usable.length) return map;
  const next = usable.reduce<MissedWordMap>(
    (acc, word) => {
      const key = deckWordKey(word.wordEn);
      const previous = acc[key];
      return {
        ...acc,
        [key]: {
          wordEn: word.wordEn.trim(),
          translationHe: word.translationHe.trim(),
          missedOn: todayStr,
          ...(previous?.clearedOn ? { clearedOn: previous.clearedOn } : {}),
        },
      };
    },
    { ...(map ?? {}) }
  );
  return pruneMissedWords(next);
}

/** The waiting words, newest first. */
export function getWaitingMissedWords(map: MissedWordMap | undefined): MissedWord[] {
  return Object.values(map ?? {})
    .filter(isMissedWordWaiting)
    .sort((a, b) => b.missedOn.localeCompare(a.missedOn) || a.wordEn.localeCompare(b.wordEn));
}

/** Marks the words answered right on the first try in a review as reviewed today. */
export function clearReviewedWords(
  map: MissedWordMap | undefined,
  answers: readonly DeckSessionAnswer[],
  todayStr: string
): MissedWordMap | undefined {
  if (!map) return map;
  const rightFirstTime = getFirstTryItemIds(answers);
  return Object.fromEntries(
    Object.entries(map).map(([key, word]) => [key, rightFirstTime.has(key) ? { ...word, clearedOn: todayStr } : word])
  );
}

/** The words a deck or review session got wrong (any scored step of the item wrong the first time). */
export function getMissedSessionItemIds(answers: readonly DeckSessionAnswer[]): Set<string> {
  const scoredIds = new Set(answers.filter((a) => a.itemId && !a.isSkipped).map((a) => a.itemId as string));
  const rightFirstTime = getFirstTryItemIds(answers);
  return new Set([...scoredIds].filter((id) => !rightFirstTime.has(id)));
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The English a step is about: its right option, its sentence, its card */
function getStepEnglish(step: MissionExerciseStep): string {
  return [
    step.questionEn,
    step.targetSentenceEn,
    step.focusWordEn,
    step.cardDisplay,
    ...(step.options ?? []).filter((option) => option.isCorrect).map((option) => option.textEn),
  ]
    .filter(Boolean)
    .join(' \n ');
}

/** Voice steps are left out: a wrong try there is often the microphone, not the word. */
const NOT_A_WORD_MISS = new Set<MissionExerciseStep['type']>(['voice-speak']);

/**
 * The mission words a learner missed: the mission vocabulary words that appear in the steps they
 * got wrong on the first try (whole words, any case).
 */
export function getMissionMissedWords(
  vocabulary: readonly VocabularyItem[],
  missedSteps: readonly MissionExerciseStep[]
): MissedWordInput[] {
  const text = missedSteps
    .filter((step) => !NOT_A_WORD_MISS.has(step.type))
    .map(getStepEnglish)
    .join(' \n ');
  if (!text) return [];
  return vocabulary
    .filter((item) => new RegExp(`(^|[^A-Za-z])${escapeRegExp(item.wordEn.trim())}($|[^A-Za-z])`, 'i').test(text))
    .map((item) => ({ wordEn: item.wordEn, translationHe: item.translationHe }));
}

/** Merges two devices' missed words: the later miss and the later review win, per word. */
export function mergeMissedWords(
  local: MissedWordMap | undefined,
  cloud: MissedWordMap | undefined
): MissedWordMap | undefined {
  if (!local) return cloud;
  if (!cloud) return local;
  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const merged = [...keys].reduce<MissedWordMap>((acc, key) => {
    const a = local[key];
    const b = cloud[key];
    if (!a || !b) return { ...acc, [key]: (a ?? b) as MissedWord };
    const newer = b.missedOn > a.missedOn ? b : a;
    const clearedOn = [a.clearedOn, b.clearedOn].filter((d): d is string => Boolean(d)).sort().pop();
    return { ...acc, [key]: { ...newer, missedOn: newer.missedOn, ...(clearedOn ? { clearedOn } : {}) } };
  }, {});
  return pruneMissedWords(merged);
}

/** The words of today's 1-minute review, or none (done today, or too few waiting). */
export function getQuickReviewWords(
  map: MissedWordMap | undefined,
  quickReviewDoneOn: string | undefined,
  todayStr: string
): MissedWord[] {
  if (quickReviewDoneOn === todayStr) return [];
  const waiting = getWaitingMissedWords(map);
  return waiting.length >= QUICK_REVIEW_MIN_WORDS ? waiting.slice(0, QUICK_REVIEW_WORD_COUNT) : [];
}
