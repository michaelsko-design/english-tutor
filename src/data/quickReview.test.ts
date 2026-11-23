import { describe, expect, it } from 'vitest';
import { WORD_LIST_REPEAT_XP, type WordListAnswer } from './customWordLists';
import { makeProfile } from '../test/fixtures';
import { recordMissedWords } from './missedWords';
import {
  QUICK_REVIEW_DIAMONDS,
  QUICK_REVIEW_XP,
  applyQuickReviewResult,
  buildQuickReviewList,
  buildQuickReviewSteps,
} from './quickReview';

const NOW = new Date('2026-11-23T10:00:00');
const TODAY = '2026-11-23';
const WORDS = [
  { wordEn: 'apple', translationHe: 'תפוח', missedOn: '2026-11-22' },
  { wordEn: 'bread', translationHe: 'לחם', missedOn: '2026-11-22' },
  { wordEn: 'milk', translationHe: 'חלב', missedOn: '2026-11-22' },
  { wordEn: 'all the time', translationHe: 'כל הזמן', missedOn: '2026-11-22' },
];

const answersFor = (isCorrect: (itemId: string) => boolean): WordListAnswer[] =>
  buildQuickReviewSteps(buildQuickReviewList(WORDS), 'girl', 0).map((step) => ({
    type: step.type,
    itemId: step.itemId,
    isCorrect: isCorrect(step.itemId),
    isSkipped: false,
  }));

describe('buildQuickReviewSteps', () => {
  it('has a meaning and a magnets step per word, and no voice round', () => {
    const steps = buildQuickReviewSteps(buildQuickReviewList(WORDS), 'boy', 0);

    expect(steps.some((step) => step.type === 'voice-speak')).toBe(false);
    expect(steps.filter((step) => step.type === 'meaning-match')).toHaveLength(3);
    expect(steps.filter((step) => step.type === 'spelling-magnet')).toHaveLength(3);
    expect(steps.find((step) => step.type === 'sentence-builder')?.promptHe).toBe('סדר את המילים לפי הסדר.');
  });
});

describe('applyQuickReviewResult', () => {
  const profile = makeProfile({
    missedWords: recordMissedWords(undefined, WORDS, '2026-11-22'),
  });

  it('clears the words right on the first try, pays once a day and marks today done', () => {
    const outcome = applyQuickReviewResult(profile, answersFor((id) => id !== 'milk'), NOW);

    expect(outcome.reward).toEqual({ xp: QUICK_REVIEW_XP, diamonds: QUICK_REVIEW_DIAMONDS, isFullReward: true });
    expect(outcome.profile.quickReviewDoneOn).toBe(TODAY);
    expect(outcome.profile.missedWords?.apple?.clearedOn).toBe(TODAY);
    expect(outcome.profile.missedWords?.milk?.clearedOn).toBeUndefined();
    expect(outcome.profile.stats.diamonds).toBe(profile.stats.diamonds + QUICK_REVIEW_DIAMONDS);
  });

  it('pays only the repeat XP for a second review the same day', () => {
    const outcome = applyQuickReviewResult({ ...profile, quickReviewDoneOn: TODAY }, answersFor(() => true), NOW);

    expect(outcome.reward).toEqual({ xp: WORD_LIST_REPEAT_XP, diamonds: 0, isFullReward: false });
  });
});
