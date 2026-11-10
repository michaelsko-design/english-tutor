import { RELEASED_CONTENT_PACKS } from '../curriculum/packs/registry';
import type { ReleasedPack } from '../curriculum/packs/types';
import { getPackAccess, hasFullAccess, type ProAccess } from '../proGate';
import { getDeckPackIds, getVisibleDecks } from './release';
import type { GradeDecks, WordDeck } from './types';

export { getDeckPackIds, getVisibleDecks } from './release';

export type { GradeDecks, MinistryListId, RecProd, WordDeck, WordDeckItem } from './types';

/**
 * The Ministry word decks of each grade (docs/architecture.md §4.26.1), loaded when the Vocabulary
 * Vault or the Games Book needs them, like the lessons and exam banks, so they never add to the
 * first download. A deck is hidden until its pack is released.
 */
export const WORD_DECK_LOADERS: Partial<Record<number, () => Promise<GradeDecks>>> = {
  1: () => import('./grade1').then((m) => m.GRADE_1_DECKS),
  2: () => import('./grade2').then((m) => m.GRADE_2_DECKS),
  3: () => import('./grade3').then((m) => m.GRADE_3_DECKS),
  4: () => import('./grade4').then((m) => m.GRADE_4_DECKS),
  5: () => import('./grade5').then((m) => m.GRADE_5_DECKS),
  6: () => import('./grade6').then((m) => m.GRADE_6_DECKS),
  7: () => import('./grade7').then((m) => m.GRADE_7_DECKS),
  8: () => import('./grade8').then((m) => m.GRADE_8_DECKS),
  9: () => import('./grade9').then((m) => m.GRADE_9_DECKS),
  10: () => import('./grade10').then((m) => m.GRADE_10_DECKS),
  11: () => import('./grade11').then((m) => m.GRADE_11_DECKS),
  12: () => import('./grade12').then((m) => m.GRADE_12_DECKS),
};

/** The released decks of a grade (1–12); none for a grade without a registry */
export async function loadGradeDecks(grade: number): Promise<WordDeck[]> {
  const load = WORD_DECK_LOADERS[grade];
  if (!load) return [];
  return getVisibleDecks(await load(), grade, getDeckPackIds());
}

/** Who practises a deck: the free/Pro access of its pack (`getPackAccess`), like the pack's unit */
export function canPlayDeck(
  deck: WordDeck,
  access: ProAccess,
  released: readonly ReleasedPack[] = RELEASED_CONTENT_PACKS
): boolean {
  return hasFullAccess(access) || getPackAccess(deck.packId, released) === 'free';
}
