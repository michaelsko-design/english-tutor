import type { ContentPack, ContentPackId, ReleasedPack } from './types';

export const CONTENT_PACKS: Record<ContentPackId, ContentPack> = {
  'core-plus': {
    id: 'core-plus',
    titleHe: 'עונה 2: עוד הרפתקאות',
    titleEn: 'Season 2: More Adventures',
    unlock: 'sequence',
    idUnitNumbers: [21, 22],
    xpUnitNumbers: [5, 6],
  },
  holidays: {
    id: 'holidays',
    titleHe: 'חגים ועונות',
    titleEn: 'Holidays & Seasons',
    unlock: 'open',
    idUnitNumbers: [31, 32],
    xpUnitNumbers: [7, 8],
  },
};

export const CONTENT_PACK_IDS = Object.keys(CONTENT_PACKS) as ContentPackId[];

/**
 * The packs learners see, in the order they shipped (their units are added to the map in this
 * order, so a unit's place never changes after it ships). To release a pack: add it here with
 * today's date, and add its curriculum, lessons and exam bank to `RELEASED_PACK_CURRICULA`
 * (`curriculum/index.ts`), `RELEASED_PACK_LESSON_LOADERS` (`miniLessons.ts`) and
 * `RELEASED_PACK_EXAM_BANK_LOADERS` (`examBank.ts`). See docs/architecture.md §4.26.
 */
export const RELEASED_CONTENT_PACKS: readonly ReleasedPack[] = [];

/** `vite --mode packs` (`npm run dev:packs`) shows every pack, released or not */
export const IS_PACK_PREVIEW = import.meta.env?.MODE === 'packs';
