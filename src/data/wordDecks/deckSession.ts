import {
  WORD_LIST_HIGH_SCORE,
  WORD_LIST_HIGH_SCORE_BONUS_DIAMONDS,
  WORD_LIST_REPEAT_XP,
  WORD_LIST_REWARD_DIAMONDS,
  WORD_LIST_REWARD_XP,
  applyPracticeSessionReward,
  buildWordListSteps,
  scoreWordListAnswers,
  type WordListAnswer,
  type WordListReward,
  type WordListSessionOutcome,
  type WordListStep,
} from '../customWordLists';
import { toLocalDateStr } from '../../utils/dates';
import type { CustomItemKind, CustomWordList, LearnerGender, LearnerProfile } from '../../types/learner';
import { deckWordKey, recordDeckMastery } from './deckMastery';
import type { WordDeck, WordDeckItem } from './types';

/**
 * A deck session runs on the school word-list engine (`buildWordListSteps`: meaning match →
 * magnets → voice), with the deck's words as the list, and pays like a word list.
 */

/** Up to this many words is a word (letter magnets); longer items are phrases (word magnets) */
const MAX_WORD_ITEM_WORDS = 2;

function itemKind(wordEn: string): CustomItemKind {
  return wordEn.trim().split(/\s+/).length <= MAX_WORD_ITEM_WORDS ? 'word' : 'sentence';
}

/** A phrase that ends a sentence ("How old are you?") needs no full stop before its example */
const SENTENCE_END = /[.?!]$/;

/** What the Vault reads for a deck word: the word, then its example ("hotel. The hotel is near the beach.") */
export function getDeckItemReading(item: Pick<WordDeckItem, 'wordEn' | 'exampleEn'>): string {
  const word = item.wordEn.trim();
  return `${SENTENCE_END.test(word) ? word : `${word}.`} ${item.exampleEn}`;
}

/** The deck as a word list for the engine; each item's id is its `deckWordKey`. */
export function deckToWordList(deck: WordDeck): CustomWordList {
  return {
    id: `deck-${deck.id}`,
    title: deck.topicHe,
    createdAt: '',
    items: deck.items.map((item) => ({
      id: deckWordKey(item.wordEn),
      textEn: item.wordEn,
      translationHe: item.translationHe,
      kind: itemKind(item.wordEn),
    })),
  };
}

/**
 * A session's salt: one of as many as the deck has words. Bounded, so the read-aloud corpus can
 * voice every session's Hebrew (`buildDeckSteps` over each salt), like the missions' replay salts.
 */
export function getDeckSaltCount(deck: WordDeck): number {
  return Math.max(1, deck.items.length);
}

export function pickDeckSalt(deck: WordDeck, random: () => number = Math.random): number {
  return Math.min(getDeckSaltCount(deck) - 1, Math.floor(random() * getDeckSaltCount(deck)));
}

/** The school-list word-order prompt says "from the teacher's page", which a Ministry deck isn't. */
function deckSentenceBuilderPromptHe(gender: LearnerGender): string {
  return gender === 'girl' ? 'סדרי את המילים למשפט.' : 'סדר את המילים למשפט.';
}

export function buildDeckSteps(deck: WordDeck, gender: LearnerGender, salt: number): WordListStep[] {
  return buildWordListSteps(deckToWordList(deck), gender, salt).map((step) =>
    step.type === 'sentence-builder' ? { ...step, promptHe: deckSentenceBuilderPromptHe(gender) } : step,
  );
}

/** Like a word list's reward: the full reward once per deck per day, a little XP after that. */
export function getDeckReward(
  profile: LearnerProfile,
  deckId: string,
  scorePercent: number,
  todayStr: string
): WordListReward {
  if (profile.deckRewardDates?.[deckId] === todayStr) {
    return { xp: WORD_LIST_REPEAT_XP, diamonds: 0, isFullReward: false };
  }
  return {
    xp: WORD_LIST_REWARD_XP,
    diamonds: WORD_LIST_REWARD_DIAMONDS + (scorePercent >= WORD_LIST_HIGH_SCORE ? WORD_LIST_HIGH_SCORE_BONUS_DIAMONDS : 0),
    isFullReward: true,
  };
}

/**
 * A finished deck session: today's first-try words toward mastery, the session toward the daily
 * quests and the streak, and the reward. The caller saves it through `App.handleUpdateProfile`.
 */
export function applyDeckResultToProfile(
  profile: LearnerProfile,
  deck: WordDeck,
  answers: readonly WordListAnswer[],
  now: Date
): WordListSessionOutcome {
  const todayStr = toLocalDateStr(now);
  const score = scoreWordListAnswers(answers);
  const reward = getDeckReward(profile, deck.id, score.scorePercent, todayStr);
  const rewarded = applyPracticeSessionReward(profile, answers, reward, score, todayStr);
  return {
    reward,
    score,
    profile: {
      ...rewarded,
      deckWordMastery: recordDeckMastery(profile.deckWordMastery, deck.items, answers, todayStr),
      ...(reward.isFullReward ? { deckRewardDates: { ...(profile.deckRewardDates ?? {}), [deck.id]: todayStr } } : {}),
    },
  };
}
