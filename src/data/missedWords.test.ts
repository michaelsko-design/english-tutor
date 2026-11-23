import { describe, expect, it } from 'vitest';
import type { VocabularyItem } from './curriculum/types';
import type { MissionExerciseStep } from './missionExercises';
import {
  MISSED_WORDS_MAX,
  QUICK_REVIEW_WORD_COUNT,
  clearReviewedWords,
  getMissedSessionItemIds,
  getMissionMissedWords,
  getQuickReviewWords,
  getWaitingMissedWords,
  mergeMissedWords,
  recordMissedWords,
} from './missedWords';

const DAY1 = '2026-11-20';
const DAY2 = '2026-11-21';
const DAY3 = '2026-11-22';

const word = (wordEn: string, translationHe = 'מילה') => ({ wordEn, translationHe });

describe('recordMissedWords', () => {
  it('keys words by their deck key and keeps the latest miss day', () => {
    const map = recordMissedWords(undefined, [word('Ice cream', 'גלידה')], DAY1);
    const again = recordMissedWords(map, [word('ice cream', 'גלידה')], DAY2);

    expect(again).toEqual({ ice_cream: { wordEn: 'ice cream', translationHe: 'גלידה', missedOn: DAY2 } });
  });

  it('leaves the map as it was when nothing was missed', () => {
    const map = recordMissedWords(undefined, [word('cat')], DAY1);
    expect(recordMissedWords(map, [], DAY2)).toBe(map);
    expect(recordMissedWords(undefined, [word('  ', 'x')], DAY2)).toBeUndefined();
  });

  it('makes a reviewed word wait again after a new miss', () => {
    const reviewed = { cat: { wordEn: 'cat', translationHe: 'חתול', missedOn: DAY1, clearedOn: DAY2 } };
    expect(getWaitingMissedWords(reviewed)).toEqual([]);

    const missedAgain = recordMissedWords(reviewed, [word('cat', 'חתול')], DAY3);
    expect(getWaitingMissedWords(missedAgain).map((w) => w.wordEn)).toEqual(['cat']);
  });

  it(`keeps at most ${MISSED_WORDS_MAX} words, the newest waiting ones`, () => {
    const many = Array.from({ length: MISSED_WORDS_MAX }, (_, i) => word(`old${i}`));
    const map = recordMissedWords(recordMissedWords(undefined, many, DAY1), [word('fresh')], DAY2);

    expect(Object.keys(map ?? {})).toHaveLength(MISSED_WORDS_MAX);
    expect(map?.fresh?.missedOn).toBe(DAY2);
  });
});

describe('clearReviewedWords and getMissedSessionItemIds', () => {
  const answers = [
    { itemId: 'cat', isCorrect: true, isSkipped: false },
    { itemId: 'cat', isCorrect: true, isSkipped: false },
    { itemId: 'dog', isCorrect: true, isSkipped: false },
    { itemId: 'dog', isCorrect: false, isSkipped: false },
  ];

  it('clears only words right on every first try', () => {
    const map = recordMissedWords(undefined, [word('cat'), word('dog')], DAY1);
    const cleared = clearReviewedWords(map, answers, DAY2);

    expect(cleared?.cat?.clearedOn).toBe(DAY2);
    expect(cleared?.dog?.clearedOn).toBeUndefined();
    expect(getWaitingMissedWords(cleared).map((w) => w.wordEn)).toEqual(['dog']);
  });

  it('finds the session items with a wrong first try', () => {
    expect([...getMissedSessionItemIds(answers)]).toEqual(['dog']);
  });
});

describe('getMissionMissedWords', () => {
  const vocabulary = [
    { wordEn: 'cat', translationHe: 'חתול' },
    { wordEn: 'catch', translationHe: 'לתפוס' },
    { wordEn: 'red ball', translationHe: 'כדור אדום' },
  ] as VocabularyItem[];

  const step = (fields: Partial<MissionExerciseStep>): MissionExerciseStep =>
    ({ id: 's', stepNumber: 1, type: 'chat-reply', badgeLabelHe: '', promptHe: '', hintHe: '', questionEn: '', ...fields }) as MissionExerciseStep;

  it('finds whole vocabulary words in the missed steps, any case', () => {
    const missed = [
      step({
        options: [
          { textEn: 'The Cat sleeps.', isCorrect: true, explanationHe: '' },
          { textEn: 'catch', isCorrect: false, explanationHe: '' },
        ],
      }),
      step({ type: 'sentence-builder', targetSentenceEn: 'I have a red ball.' }),
    ];

    expect(getMissionMissedWords(vocabulary, missed).map((w) => w.wordEn)).toEqual(['cat', 'red ball']);
  });

  it('leaves voice steps out', () => {
    const missed = [step({ type: 'voice-speak', questionEn: 'Say: cat', focusWordEn: 'cat' })];
    expect(getMissionMissedWords(vocabulary, missed)).toEqual([]);
  });
});

describe('mergeMissedWords', () => {
  it('keeps the later miss and the later review of each word', () => {
    const local = { cat: { wordEn: 'cat', translationHe: 'חתול', missedOn: DAY1, clearedOn: DAY2 } };
    const cloud = {
      cat: { wordEn: 'cat', translationHe: 'חתול', missedOn: DAY3 },
      dog: { wordEn: 'dog', translationHe: 'כלב', missedOn: DAY1 },
    };

    expect(mergeMissedWords(local, cloud)).toEqual({
      cat: { wordEn: 'cat', translationHe: 'חתול', missedOn: DAY3, clearedOn: DAY2 },
      dog: { wordEn: 'dog', translationHe: 'כלב', missedOn: DAY1 },
    });
    expect(mergeMissedWords(undefined, cloud)).toBe(cloud);
    expect(mergeMissedWords(local, undefined)).toBe(local);
  });
});

describe('getQuickReviewWords', () => {
  const map = recordMissedWords(undefined, ['a1', 'b2', 'c3', 'd4', 'e5'].map((w) => word(w)), DAY1);

  it(`offers the newest ${QUICK_REVIEW_WORD_COUNT} waiting words`, () => {
    expect(getQuickReviewWords(map, undefined, DAY2)).toHaveLength(QUICK_REVIEW_WORD_COUNT);
  });

  it('rests once done today, and needs a few waiting words', () => {
    expect(getQuickReviewWords(map, DAY2, DAY2)).toEqual([]);
    const few = recordMissedWords(undefined, [word('a'), word('b')], DAY1);
    expect(getQuickReviewWords(few, undefined, DAY2)).toEqual([]);
  });
});
