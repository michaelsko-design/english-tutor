import { GRADE_1_DECKS } from './grade1';
import { GRADE_2_DECKS } from './grade2';
import { GRADE_3_DECKS } from './grade3';
import { GRADE_4_DECKS } from './grade4';
import { GRADE_5_DECKS } from './grade5';
import { GRADE_6_DECKS } from './grade6';
import { GRADE_7_DECKS } from './grade7';
import { GRADE_8_DECKS } from './grade8';
import { GRADE_9_DECKS } from './grade9';
import { GRADE_10_DECKS } from './grade10';
import { GRADE_11_DECKS } from './grade11';
import { GRADE_12_DECKS } from './grade12';
import type { ContentPackId } from '../curriculum/packs/types';
import { getVisibleDecks } from './release';
import type { GradeDecks, WordDeck } from './types';

/**
 * Every grade's decks, released or not: for the tests, the read-aloud corpus and the coverage
 * report only (never imported by the app, which loads a grade with `loadGradeDecks`).
 */
export const ALL_WORD_DECKS: Record<number, GradeDecks> = {
  1: GRADE_1_DECKS,
  2: GRADE_2_DECKS,
  3: GRADE_3_DECKS,
  4: GRADE_4_DECKS,
  5: GRADE_5_DECKS,
  6: GRADE_6_DECKS,
  7: GRADE_7_DECKS,
  8: GRADE_8_DECKS,
  9: GRADE_9_DECKS,
  10: GRADE_10_DECKS,
  11: GRADE_11_DECKS,
  12: GRADE_12_DECKS,
};

/**
 * The grade's decks of the given packs, for the coverage report (`review:coverage -- --packs`):
 * a deck counts when its pack is listed and adds a unit to the grade.
 */
export function getPackDecks(
  grade: number,
  packIds: readonly ContentPackId[],
  all: Record<number, GradeDecks> = ALL_WORD_DECKS
): WordDeck[] {
  return getVisibleDecks(all[grade] ?? [], grade, packIds);
}
