import { describe, expect, it } from 'vitest';
import {
  countMasteredDeckItems,
  deckWordKey,
  getFirstTryItemIds,
  getMasteredDeckWords,
  isDeckWordMastered,
  mergeDeckWordMastery,
  recordDeckMastery,
  type DeckSessionAnswer,
} from './deckMastery';
import { FIXTURE_DECK } from './fixtures';

const [apple, bread] = FIXTURE_DECK.items;
const APPLE = deckWordKey(apple.wordEn);
const BREAD = deckWordKey(bread.wordEn);

const right = (itemId: string): DeckSessionAnswer => ({ itemId, isCorrect: true, isSkipped: false });
const wrong = (itemId: string): DeckSessionAnswer => ({ itemId, isCorrect: false, isSkipped: false });
const skipped = (itemId: string): DeckSessionAnswer => ({ itemId, isCorrect: true, isSkipped: true });

describe('deckWordKey', () => {
  it('makes a plain lowercase map key', () => {
    expect(deckWordKey('  Ice Cream ')).toBe('ice_cream');
    expect(deckWordKey('a/an')).toBe('a-an');
    expect(deckWordKey('Mr.')).toBe('mr-');
    expect(deckWordKey("don't")).toBe("don't");
  });
});

describe('getFirstTryItemIds', () => {
  it('credits an item only when every scored step was right the first time', () => {
    const ids = getFirstTryItemIds([right(APPLE), right(APPLE), skipped(APPLE), right(BREAD), wrong(BREAD)]);
    expect([...ids]).toEqual([APPLE]);
  });

  it('ignores answers without an item and items with only skipped steps', () => {
    expect(getFirstTryItemIds([{ isCorrect: true, isSkipped: false }, skipped(APPLE)]).size).toBe(0);
  });
});

describe('recordDeckMastery', () => {
  it('needs first-try right answers on two different local days', () => {
    const day1 = recordDeckMastery(undefined, FIXTURE_DECK.items, [right(APPLE)], '2026-11-01');
    expect(day1[APPLE]).toEqual({ wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01'] });
    expect(isDeckWordMastered(day1, 'apple')).toBe(false);

    const sameDay = recordDeckMastery(day1, FIXTURE_DECK.items, [right(APPLE)], '2026-11-01');
    expect(isDeckWordMastered(sameDay, 'apple')).toBe(false);

    const day2 = recordDeckMastery(sameDay, FIXTURE_DECK.items, [right(APPLE)], '2026-11-03');
    expect(day2[APPLE].masteredOn).toBe('2026-11-03');
    expect(day2[APPLE].firstTryDays).toEqual(['2026-11-01', '2026-11-03']);
  });

  it('does not credit a word answered wrong first, and leaves the input unchanged', () => {
    const before = {};
    const after = recordDeckMastery(before, FIXTURE_DECK.items, [wrong(APPLE), right(BREAD)], '2026-11-01');
    expect(after[APPLE]).toBeUndefined();
    expect(after[BREAD].firstTryDays).toEqual(['2026-11-01']);
    expect(before).toEqual({});
  });

  it('keeps a mastered word as it is', () => {
    const mastered = { [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01', '2026-11-02'], masteredOn: '2026-11-02' } };
    expect(recordDeckMastery(mastered, FIXTURE_DECK.items, [right(APPLE)], '2026-11-09')).toEqual(mastered);
  });
});

describe('counting mastered deck words', () => {
  const mastery = {
    [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01', '2026-11-02'], masteredOn: '2026-11-02' },
    [BREAD]: { wordEn: 'bread', translationHe: 'לחם', firstTryDays: ['2026-11-01'] },
  };

  it('counts the deck items that are mastered', () => {
    expect(countMasteredDeckItems(FIXTURE_DECK.items, mastery)).toBe(1);
    expect(countMasteredDeckItems(FIXTURE_DECK.items, undefined)).toBe(0);
  });

  it('lists the words mastered in a date range', () => {
    expect(getMasteredDeckWords(mastery).map((w) => w.wordEn)).toEqual(['apple']);
    expect(getMasteredDeckWords(mastery, '2026-11-03', '2026-11-09')).toEqual([]);
  });
});

describe('mergeDeckWordMastery', () => {
  it('keeps either side when the other has none', () => {
    const one = { [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01'] } };
    expect(mergeDeckWordMastery(one, undefined)).toBe(one);
    expect(mergeDeckWordMastery(undefined, one)).toBe(one);
    expect(mergeDeckWordMastery(undefined, undefined)).toBeUndefined();
  });

  it('unites the words and keeps the earliest mastery date', () => {
    const local = {
      [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01', '2026-11-05'], masteredOn: '2026-11-05' },
    };
    const cloud = {
      [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-02', '2026-11-03'], masteredOn: '2026-11-03' },
      [BREAD]: { wordEn: 'bread', translationHe: 'לחם', firstTryDays: ['2026-11-04'] },
    };
    const merged = mergeDeckWordMastery(local, cloud);
    expect(merged?.[APPLE]).toEqual({
      wordEn: 'apple',
      translationHe: 'תפוח',
      firstTryDays: ['2026-11-01', '2026-11-02'],
      masteredOn: '2026-11-02',
    });
    expect(merged?.[BREAD].firstTryDays).toEqual(['2026-11-04']);
  });

  it('masters a word practised one day on each device', () => {
    const local = { [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01'] } };
    const cloud = { [APPLE]: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-02'] } };
    expect(mergeDeckWordMastery(local, cloud)?.[APPLE].masteredOn).toBe('2026-11-02');
  });
});
