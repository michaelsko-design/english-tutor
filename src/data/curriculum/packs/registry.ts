import type { ContentPack, ContentPackId, ReleasedPack } from './types';

export const CONTENT_PACKS: Record<ContentPackId, ContentPack> = {
  'season2-1': {
    id: 'season2-1',
    titleHe: 'עונה 2: פרק 1',
    titleEn: 'Season 2: Chapter 1',
    unlock: 'sequence',
    kind: 'core',
    idUnitNumber: 21,
    xpUnitNumber: 5,
  },
  'season2-2': {
    id: 'season2-2',
    titleHe: 'עונה 2: פרק 2',
    titleEn: 'Season 2: Chapter 2',
    unlock: 'sequence',
    kind: 'core',
    after: 'season2-1',
    idUnitNumber: 22,
    xpUnitNumber: 6,
  },
  'holidays-autumn': {
    id: 'holidays-autumn',
    titleHe: 'חגי הסתיו והחורף',
    titleEn: 'Autumn & Winter Holidays',
    unlock: 'open',
    kind: 'seasonal',
    idUnitNumber: 31,
    xpUnitNumber: 7,
  },
  'holidays-spring': {
    id: 'holidays-spring',
    titleHe: 'חגי האביב והקיץ',
    titleEn: 'Spring & Summer Holidays',
    unlock: 'open',
    kind: 'seasonal',
    idUnitNumber: 32,
    xpUnitNumber: 8,
  },
};

/** Every pack adds exactly one unit to each grade */
export const PACK_UNIT_COUNT = 1;

export const CONTENT_PACK_IDS = Object.keys(CONTENT_PACKS) as ContentPackId[];

/**
 * The packs learners see, in the order they shipped (their units are added to the map in this
 * order, so a unit's place never changes after it ships). A pack with `after` ships only after
 * that pack (`registry.test.ts`). To release a pack: add it here with
 * today's date and its `access` (free, or Pro only), and add its curriculum, lessons and exam bank to `RELEASED_PACK_CURRICULA`
 * (`curriculum/loader.ts`), `RELEASED_PACK_LESSON_LOADERS` (`miniLessons.ts`) and
 * `RELEASED_PACK_EXAM_BANK_LOADERS` (`examBank.ts`). See docs/architecture.md §4.26.
 */
export const RELEASED_CONTENT_PACKS: readonly ReleasedPack[] = [];

/** `vite --mode packs` (`npm run dev:packs`) shows every pack, released or not */
export const IS_PACK_PREVIEW = import.meta.env?.MODE === 'packs';
