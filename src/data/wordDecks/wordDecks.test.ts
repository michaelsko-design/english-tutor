import { describe, expect, it } from 'vitest';
import { CURRICULUM_WITH_ALL_PACKS } from '../curriculum/packs/all';
import { CONTENT_PACKS } from '../curriculum/packs/registry';
import type { ContentPack, ContentPackId, ReleasedPack } from '../curriculum/packs/types';
import { getProAccess } from '../proGate';
import { ALL_WORD_DECKS, getPackDecks } from './all';
import { FIXTURE_DECK, FIXTURE_PRO_DECK } from './fixtures';
import { WORD_DECK_LOADERS, canPlayDeck, getDeckPackIds, getVisibleDecks, loadGradeDecks } from './index';
import type { MinistryListId } from './types';

const RELEASED: readonly ReleasedPack[] = [
  { id: 'season2-1', releasedAt: '2026-12-01', access: 'free' },
  { id: 'holidays-spring', releasedAt: '2026-12-01', access: 'pro' },
];
const MINISTRY_LISTS: readonly MinistryListId[] = [
  'pre-band-1',
  'band-1-core-1',
  'band-1-core-2',
  'band-2-core-1',
  'band-2-core-2',
  'band-3-core-1',
  'band-3-core-2',
];
/** The Ministry lists a grade's decks draw from: its own band only (roadmap: no word from outside the band's lists) */
function bandListsOfGrade(grade: number): readonly MinistryListId[] {
  if (grade <= 3) return ['pre-band-1'];
  if (grade <= 6) return ['band-1-core-1', 'band-1-core-2'];
  if (grade <= 9) return ['band-2-core-1', 'band-2-core-2'];
  return ['band-3-core-1', 'band-3-core-2'];
}
const LAST_EMOJI_GRADE = 6;
const MIN_DECK_WORDS = 12;
const MAX_DECK_WORDS = 30;

/** Lower-case, curly apostrophes straight, punctuation dropped: "I'm a boy." and "i’m a boy" are one word */
const wordKey = (text: string): string =>
  text.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' -]/g, '').replace(/\s+/g, ' ').trim();

describe('deck release gate', () => {
  it('shows only decks of released packs, or every pack in the packs preview', () => {
    expect(getDeckPackIds([], false)).toEqual([]);
    expect(getDeckPackIds(RELEASED, false)).toEqual(['season2-1', 'holidays-spring']);
    expect(getDeckPackIds([], true)).toEqual(Object.keys(CONTENT_PACKS));
  });

  it('hides a deck until its pack is released', () => {
    expect(getVisibleDecks([FIXTURE_DECK, FIXTURE_PRO_DECK], 4, [])).toEqual([]);
    expect(getVisibleDecks([FIXTURE_DECK, FIXTURE_PRO_DECK], 4, ['season2-1'])).toEqual([FIXTURE_DECK]);
  });

  it('hides a deck in a grade its pack skips', () => {
    const registry: Record<ContentPackId, ContentPack> = {
      ...CONTENT_PACKS,
      'season2-1': { ...CONTENT_PACKS['season2-1'], grades: [2, 3] },
    };
    expect(getVisibleDecks([FIXTURE_DECK], 1, ['season2-1'], registry)).toEqual([]);
    expect(getVisibleDecks([FIXTURE_DECK], 2, ['season2-1'], registry)).toEqual([FIXTURE_DECK]);
  });

  it('nothing is released yet, so no grade loads a deck', async () => {
    const loaded = await Promise.all(Object.keys(WORD_DECK_LOADERS).map((grade) => loadGradeDecks(Number(grade))));
    expect(loaded.flat()).toEqual([]);
    expect(await loadGradeDecks(13)).toEqual([]);
  });
});

describe('deck access', () => {
  const free = getProAccess(false, true);
  const pro = getProAccess(true, true);

  it('a free pack deck is for everyone; a Pro pack deck needs Pro (while gating is on)', () => {
    expect(canPlayDeck(FIXTURE_DECK, free, RELEASED)).toBe(true);
    expect(canPlayDeck(FIXTURE_PRO_DECK, free, RELEASED)).toBe(false);
    expect(canPlayDeck(FIXTURE_PRO_DECK, pro, RELEASED)).toBe(true);
    expect(canPlayDeck(FIXTURE_PRO_DECK, getProAccess(false, false), RELEASED)).toBe(true);
  });
});

describe('deck data (every grade registry)', () => {
  it('has a loader and a registry for grades 1–12', () => {
    expect(Object.keys(WORD_DECK_LOADERS).map(Number)).toEqual(Object.keys(ALL_WORD_DECKS).map(Number));
    expect(Object.keys(ALL_WORD_DECKS)).toHaveLength(12);
  });

  const decks = Object.entries(ALL_WORD_DECKS).flatMap(([grade, gradeDecks]) =>
    gradeDecks.map((deck) => ({ grade: Number(grade), deck }))
  );

  it('deck ids are unique across grades', () => {
    const ids = decks.map(({ deck }) => deck.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no deck word repeats a word of another deck or of any mission (base, Season 2, holidays)', () => {
    const missionWords = new Set(
      Object.values(CURRICULUM_WITH_ALL_PACKS).flatMap((pack) =>
        pack.units.flatMap((unit) => unit.missions.flatMap((mission) => mission.vocabulary.map((item) => wordKey(item.wordEn))))
      )
    );
    const deckWords = decks.flatMap(({ deck }) => deck.items.map((item) => wordKey(item.wordEn)));
    expect(deckWords.filter((word, index) => deckWords.indexOf(word) !== index)).toEqual([]);
    expect(deckWords.filter((word) => missionWords.has(word))).toEqual([]);
  });

  it('a deck has 12–30 words', () => {
    decks.forEach(({ deck }) => {
      expect(deck.items.length, deck.id).toBeGreaterThanOrEqual(MIN_DECK_WORDS);
      expect(deck.items.length, deck.id).toBeLessThanOrEqual(MAX_DECK_WORDS);
    });
  });

  it.each(decks.map(({ grade, deck }) => [deck.id, grade, deck] as const))('%s is complete', (_id, grade, deck) => {
    expect(getVisibleDecks([deck], grade, [deck.packId])).toEqual([deck]);
    expect(deck.items.length).toBeGreaterThan(0);
    deck.items.forEach((item) => {
      expect(item.wordEn && item.translationHe && item.exampleEn && item.exampleHe && item.partOfSpeech).toBeTruthy();
      expect(MINISTRY_LISTS).toContain(item.ministryList);
      expect(bandListsOfGrade(grade), `${item.wordEn} is from ${item.ministryList}`).toContain(item.ministryList);
      expect(['rec', 'prod']).toContain(item.recProd);
      if (grade <= LAST_EMOJI_GRADE) expect(item.emoji).toBeTruthy();
    });
  });
});

describe('getPackDecks (the coverage report)', () => {
  const all = { 4: [FIXTURE_DECK, FIXTURE_PRO_DECK] };

  it('counts a grade’s decks only for the listed packs', () => {
    expect(getPackDecks(4, [], all)).toEqual([]);
    expect(getPackDecks(4, ['holidays-spring'], all)).toEqual([FIXTURE_PRO_DECK]);
    expect(getPackDecks(4, ['season2-1', 'holidays-spring'], all)).toEqual([FIXTURE_DECK, FIXTURE_PRO_DECK]);
    expect(getPackDecks(5, ['season2-1'], all)).toEqual([]);
  });
});
