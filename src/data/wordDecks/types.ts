import type { ContentPackId } from '../curriculum/packs/types';

/**
 * The Ministry word track (docs/content-packs-roadmap.md §3, docs/architecture.md §4.26.1): decks of
 * Ministry words per grade, practised in the Vocabulary Vault and released with a core pack.
 */

/** The Ministry word lists (`docs/ministry-sources/raw/parsed/wordLists.json`, its `list` field) */
export type MinistryListId =
  | 'pre-band-1'
  | 'band-1-core-1'
  | 'band-1-core-2'
  | 'band-2-core-1'
  | 'band-2-core-2'
  | 'band-3-core-1'
  | 'band-3-core-2';

/** Receptive (understood) or productive (used) in the Ministry list */
export type RecProd = 'rec' | 'prod';

export interface WordDeckItem {
  wordEn: string;
  translationHe: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleHe: string;
  ministryList: MinistryListId;
  recProd: RecProd;
  /** Grades 1–6 */
  emoji?: string;
}

export interface WordDeck {
  /** Unique across grades, e.g. `g7-core-3-food` */
  id: string;
  /** The core pack the deck ships with: hidden and released exactly like it */
  packId: ContentPackId;
  topicEn: string;
  topicHe: string;
  items: readonly WordDeckItem[];
}

/** A grade's decks, in the order the Vault lists them */
export type GradeDecks = readonly WordDeck[];
