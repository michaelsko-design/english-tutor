import {
  WORD_LIST_REPEAT_XP,
  applyPracticeSessionReward,
  buildWordListSteps,
  scoreWordListAnswers,
  type WordListAnswer,
  type WordListReward,
  type WordListSessionOutcome,
  type WordListStep,
} from './customWordLists';
import { clearReviewedWords } from './missedWords';
import { deckWordKey } from './wordDecks/deckMastery';
import { getWordItemKind } from './wordDecks/deckSession';
import { toLocalDateStr } from '../utils/dates';
import type { CustomWordList, LearnerGender, LearnerProfile, MissedWord } from '../types/learner';

/**
 * The 1-minute review of missed words (data/missedWords.ts): a meaning match and a magnets step
 * per word, no voice round, so it stays short. It counts for the streak and the daily quests like
 * any practice session, and pays a small reward once a day; then the home card rests until tomorrow.
 */

export const QUICK_REVIEW_LIST_ID = 'quick-review';
export const QUICK_REVIEW_XP = 10;
export const QUICK_REVIEW_DIAMONDS = 1;

export function buildQuickReviewList(words: readonly MissedWord[]): CustomWordList {
  return {
    id: QUICK_REVIEW_LIST_ID,
    title: 'חזרה של דקה',
    createdAt: '',
    items: words.map((word) => ({
      id: deckWordKey(word.wordEn),
      textEn: word.wordEn,
      translationHe: word.translationHe,
      kind: getWordItemKind(word.wordEn),
    })),
  };
}

function sentenceBuilderPromptHe(gender: LearnerGender): string {
  return gender === 'girl' ? 'סדרי את המילים לפי הסדר.' : 'סדר את המילים לפי הסדר.';
}

/** The word-list steps without the voice round; the word-order prompt doesn't name a teacher's page. */
export function buildQuickReviewSteps(list: CustomWordList, gender: LearnerGender, salt: number): WordListStep[] {
  return buildWordListSteps(list, gender, salt)
    .filter((step) => step.type !== 'voice-speak')
    .map((step) => (step.type === 'sentence-builder' ? { ...step, promptHe: sentenceBuilderPromptHe(gender) } : step));
}

export function getQuickReviewReward(profile: LearnerProfile, todayStr: string): WordListReward {
  return profile.quickReviewDoneOn === todayStr
    ? { xp: WORD_LIST_REPEAT_XP, diamonds: 0, isFullReward: false }
    : { xp: QUICK_REVIEW_XP, diamonds: QUICK_REVIEW_DIAMONDS, isFullReward: true };
}

/**
 * A finished review: the words right on the first try stop waiting, the session counts for the
 * streak and the quests, and the review is done for today. Saved through `App.handleUpdateProfile`.
 */
export function applyQuickReviewResult(
  profile: LearnerProfile,
  answers: readonly WordListAnswer[],
  now: Date
): WordListSessionOutcome {
  const todayStr = toLocalDateStr(now);
  const score = scoreWordListAnswers(answers);
  const reward = getQuickReviewReward(profile, todayStr);
  const rewarded = applyPracticeSessionReward(profile, answers, reward, score, todayStr);
  const missedWords = clearReviewedWords(profile.missedWords, answers, todayStr);
  return {
    reward,
    score,
    profile: {
      ...rewarded,
      ...(missedWords ? { missedWords } : {}),
      quickReviewDoneOn: todayStr,
    },
  };
}
