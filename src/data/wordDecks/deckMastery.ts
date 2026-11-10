import type { DeckWordMastery } from '../../types/learner';
import type { WordDeckItem } from './types';

/**
 * Ministry deck word mastery (docs/content-packs-roadmap.md §3): a deck word counts as mastered
 * ("taught") once it was answered right on the first try in deck sessions on two different local
 * calendar days. Stored on the profile as `deckWordMastery`, keyed by `deckWordKey`.
 */

/** Different local days with a first-try right answer that make a deck word mastered */
export const DECK_MASTERY_DAYS = 2;

export type DeckWordMasteryMap = Record<string, DeckWordMastery>;

/** One answer of a deck session, as the word-list engine records it */
export interface DeckSessionAnswer {
  itemId?: string;
  isCorrect: boolean;
  isSkipped: boolean;
}

/**
 * The profile key of a deck word: lowercase, spaces as `_` and anything but letters, digits, `'`
 * and `-` as `-` ("a/an" → "a-an"), so it is a plain Firestore map key. The same word in two decks
 * is one key: mastered once, it is mastered in both.
 */
export function deckWordKey(wordEn: string): string {
  return wordEn
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9'_-]/g, '-');
}

/**
 * The items answered right on the first try in this session: every scored step of the item (its
 * meaning match, magnets and voice) was right the first time. A skipped voice step doesn't count
 * either way; an item with no scored step isn't credited.
 */
export function getFirstTryItemIds(answers: readonly DeckSessionAnswer[]): Set<string> {
  const byItem = answers.reduce<Map<string, boolean>>((acc, answer) => {
    if (!answer.itemId || answer.isSkipped) return acc;
    const next = new Map(acc);
    next.set(answer.itemId, (acc.get(answer.itemId) ?? true) && answer.isCorrect);
    return next;
  }, new Map());
  return new Set([...byItem].filter(([, isAllRight]) => isAllRight).map(([itemId]) => itemId));
}

/** The earliest `DECK_MASTERY_DAYS` distinct days, oldest first */
function earliestDays(days: readonly string[]): string[] {
  return [...new Set(days)].sort().slice(0, DECK_MASTERY_DAYS);
}

/** The mastery date the days reach (their second day), if they reach it */
function masteredOnFromDays(days: readonly string[]): string | undefined {
  return days.length >= DECK_MASTERY_DAYS ? days[DECK_MASTERY_DAYS - 1] : undefined;
}

function earliest(...dates: (string | undefined)[]): string | undefined {
  return dates.filter((date): date is string => Boolean(date)).sort()[0];
}

function withDay(record: DeckWordMastery, todayStr: string): DeckWordMastery {
  if (record.masteredOn) return record;
  const firstTryDays = earliestDays([...record.firstTryDays, todayStr]);
  const masteredOn = masteredOnFromDays(firstTryDays);
  return { ...record, firstTryDays, ...(masteredOn ? { masteredOn } : {}) };
}

/** Records today's first-try right answers of a deck session (item ids are `deckWordKey`s). */
export function recordDeckMastery(
  mastery: DeckWordMasteryMap | undefined,
  items: readonly WordDeckItem[],
  answers: readonly DeckSessionAnswer[],
  todayStr: string
): DeckWordMasteryMap {
  const rightFirstTime = getFirstTryItemIds(answers);
  return items.reduce<DeckWordMasteryMap>((acc, item) => {
    const key = deckWordKey(item.wordEn);
    if (!rightFirstTime.has(key)) return acc;
    const record = acc[key] ?? { wordEn: item.wordEn, translationHe: item.translationHe, firstTryDays: [] };
    return { ...acc, [key]: withDay(record, todayStr) };
  }, { ...(mastery ?? {}) });
}

export function isDeckWordMastered(mastery: DeckWordMasteryMap | undefined, wordEn: string): boolean {
  return Boolean(mastery?.[deckWordKey(wordEn)]?.masteredOn);
}

/** How many of the deck's words are mastered */
export function countMasteredDeckItems(items: readonly WordDeckItem[], mastery: DeckWordMasteryMap | undefined): number {
  return items.filter((item) => isDeckWordMastered(mastery, item.wordEn)).length;
}

/** The mastered deck words, optionally only those mastered from `fromDay` to `toDay` (inclusive) */
export function getMasteredDeckWords(
  mastery: DeckWordMasteryMap | undefined,
  fromDay = '',
  toDay = '9999-12-31'
): DeckWordMastery[] {
  return Object.values(mastery ?? {}).filter(
    (record) => record.masteredOn !== undefined && record.masteredOn >= fromDay && record.masteredOn <= toDay
  );
}

function mergeRecord(local: DeckWordMastery | undefined, cloud: DeckWordMastery | undefined): DeckWordMastery {
  if (!local || !cloud) return (local ?? cloud) as DeckWordMastery;
  const firstTryDays = earliestDays([...local.firstTryDays, ...cloud.firstTryDays]);
  const masteredOn = earliest(local.masteredOn, cloud.masteredOn, masteredOnFromDays(firstTryDays));
  return {
    wordEn: local.wordEn || cloud.wordEn,
    translationHe: local.translationHe || cloud.translationHe,
    firstTryDays,
    ...(masteredOn ? { masteredOn } : {}),
  };
}

/**
 * Sync merge (`mergeLearnerProfiles`): the union of both devices' words. A word's first-try days
 * are united (the earliest two kept), and its mastery date is the earliest of either side's and
 * the date the united days reach, so a word practised one day on each device is mastered too.
 */
export function mergeDeckWordMastery(
  local: DeckWordMasteryMap | undefined,
  cloud: DeckWordMasteryMap | undefined
): DeckWordMasteryMap | undefined {
  if (!local || !cloud) return local ?? cloud;
  const keys = [...new Set([...Object.keys(local), ...Object.keys(cloud)])];
  return Object.fromEntries(keys.map((key) => [key, mergeRecord(local[key], cloud[key])]));
}
