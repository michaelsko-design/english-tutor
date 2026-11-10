import type { ContentPack, ContentPackId, ReleasedPack, WordsPerMission } from './types';

/** Season 2 and the holiday packs, written before the enrichment rule, teach 4 new words per mission */
const LEGACY_WORDS_PER_MISSION = 4;
/** Core packs from core-3 on teach the Ministry word lists: 6 words per mission in grades 1–3, 8 in 4–12 */
export const ENRICHMENT_WORDS_PER_MISSION: WordsPerMission = { upToGrade3: 6, fromGrade4: 8 };
const LAST_LOWER_GRADE = 3;
/** core-3 serves grades 2–12: grade 1 is skipped (complete at 12 units) */
const CORE_3_GRADES: readonly number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const CONTENT_PACKS: Record<ContentPackId, ContentPack> = {
  'season2-1': {
    id: 'season2-1',
    titleHe: 'עונה 2: פרק 1',
    titleEn: 'Season 2: Chapter 1',
    unlock: 'sequence',
    kind: 'core',
    idUnitNumber: 21,
    xpUnitNumber: 5,
    wordsPerMission: LEGACY_WORDS_PER_MISSION,
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
    wordsPerMission: LEGACY_WORDS_PER_MISSION,
  },
  'core-3': {
    id: 'core-3',
    titleHe: 'עונה 3: פרק 1',
    titleEn: 'Season 3: Chapter 1',
    unlock: 'sequence',
    kind: 'core',
    after: 'season2-2',
    idUnitNumber: 23,
    // 5–8 are taken by Season 2 and the holiday packs; the reward scale only grows along the path
    xpUnitNumber: 9,
    wordsPerMission: ENRICHMENT_WORDS_PER_MISSION,
    grades: CORE_3_GRADES,
  },
  'holidays-autumn': {
    id: 'holidays-autumn',
    titleHe: 'חגי הסתיו והחורף',
    titleEn: 'Autumn & Winter Holidays',
    unlock: 'open',
    kind: 'seasonal',
    idUnitNumber: 31,
    xpUnitNumber: 7,
    wordsPerMission: LEGACY_WORDS_PER_MISSION,
  },
  'holidays-spring': {
    id: 'holidays-spring',
    titleHe: 'חגי האביב והקיץ',
    titleEn: 'Spring & Summer Holidays',
    unlock: 'open',
    kind: 'seasonal',
    idUnitNumber: 32,
    xpUnitNumber: 8,
    wordsPerMission: LEGACY_WORDS_PER_MISSION,
  },
};

/** How many new words each of the pack's missions teaches in this grade (1–12) */
export function packWordsPerMission(pack: ContentPack, grade: number): number {
  const rule = pack.wordsPerMission;
  if (typeof rule === 'number') return rule;
  return grade <= LAST_LOWER_GRADE ? rule.upToGrade3 : rule.fromGrade4;
}

const GRADE_COUNT = 12;
/** Grades 1–12, the grades a pack serves unless it lists its own */
export const ALL_GRADES: readonly number[] = Array.from({ length: GRADE_COUNT }, (_, i) => i + 1);

/** The grades that get the pack's unit: its `grades` list, or all 12 */
export function packGrades(pack: ContentPack): readonly number[] {
  return pack.grades ?? ALL_GRADES;
}

/** True when the pack adds a unit to this grade (1–12) */
export function packHasGrade(pack: ContentPack, grade: number): boolean {
  return packGrades(pack).includes(grade);
}

/** Every pack adds exactly one unit to each grade it lists (`packGrades`) */
export const PACK_UNIT_COUNT = 1;

export const CONTENT_PACK_IDS = Object.keys(CONTENT_PACKS) as ContentPackId[];

/**
 * The packs learners see, in the order they shipped (their units are added to the map in this
 * order, so a unit's place never changes after it ships). A pack with `after` ships only after
 * that pack (`registry.test.ts`). To release a pack: add it here with
 * today's date (it is Pro only by default; add `access: 'free'` to open it to everyone), and add its curriculum, lessons and exam bank to `RELEASED_PACK_CURRICULA`
 * (`curriculum/loader.ts`), `RELEASED_PACK_LESSON_LOADERS` (`miniLessons.ts`) and
 * `RELEASED_PACK_EXAM_BANK_LOADERS` (`examBank.ts`). See docs/architecture.md §4.26.
 */
export const RELEASED_CONTENT_PACKS: readonly ReleasedPack[] = [];

/** `vite --mode packs` (`npm run dev:packs`) shows every pack, released or not */
export const IS_PACK_PREVIEW = import.meta.env?.MODE === 'packs';
