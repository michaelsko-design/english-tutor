import { CONTENT_PACKS, CONTENT_PACK_IDS, IS_PACK_PREVIEW, RELEASED_CONTENT_PACKS, packHasGrade } from '../curriculum/packs/registry';
import type { ContentPack, ContentPackId, ReleasedPack } from '../curriculum/packs/types';
import type { GradeDecks, WordDeck } from './types';

/** The deck release gate: the same as the content packs' (docs/architecture.md §4.26.1). */

/**
 * The packs whose decks learners see: the released packs (`RELEASED_CONTENT_PACKS`, the same gate
 * as the pack's units), or every pack in the packs preview (`npm run dev:packs`).
 */
export function getDeckPackIds(
  released: readonly ReleasedPack[] = RELEASED_CONTENT_PACKS,
  isPreview: boolean = IS_PACK_PREVIEW
): readonly ContentPackId[] {
  return isPreview ? CONTENT_PACK_IDS : released.map((pack) => pack.id);
}

/** The grade's decks whose pack is in `packIds` and adds a unit to this grade (`packHasGrade`) */
export function getVisibleDecks(
  decks: GradeDecks,
  grade: number,
  packIds: readonly ContentPackId[],
  registry: Record<ContentPackId, ContentPack> = CONTENT_PACKS
): WordDeck[] {
  return decks.filter((deck) => packIds.includes(deck.packId) && packHasGrade(registry[deck.packId], grade));
}
