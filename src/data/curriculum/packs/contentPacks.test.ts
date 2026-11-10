import { describe, expect, it } from 'vitest';
import type { GradeId } from '../../../types/learner';
import { getIconSrc } from '../../../components/art/iconArt';
import { BASE_CURRICULUM_BY_GRADE } from '../base';
import { EXAM_BANK_ITEMS_PER_LIST } from '../examBank/types';
import { isPhonicsUnit } from '../types';
import { ALL_PACK_CONTENT, CURRICULUM_WITH_ALL_PACKS } from './all';
import { ALL_PACK_EXAM_BANK_LOADERS, ALL_PACK_LESSON_LOADERS } from './index';
import { getIdUnitNumber } from './merge';
import { ALL_GRADES, CONTENT_PACK_IDS, packGrades, packHasGrade, packWordsPerMission } from './registry';

const GRADES = ALL_GRADES;
/** Every grade each pack lists (`packGrades`): a core pack may skip a grade that is complete */
const CASES = ALL_PACK_CONTENT.flatMap((content) =>
  packGrades(content.pack).map((grade) => ({ content, grade, packId: content.pack.id }))
);
const gradeIdOf = (grade: number) => `grade-${grade}` as GradeId;
const UNITS_PER_PACK = 1;
const MISSIONS_PER_UNIT = 3;
/** Grades whose words are shown as pictures */
const PICTURE_GRADES = 6;

/** The words of the grade's own topic units, or of its packs (grade 1's letters and blending units don't count) */
const words = (gradeId: GradeId, onlyPacks: boolean) =>
  CURRICULUM_WITH_ALL_PACKS[gradeId].units
    .filter((u) => (onlyPacks ? u.packId !== undefined : u.packId === undefined && !isPhonicsUnit(u)))
    .flatMap((u) => u.missions.flatMap((m) => m.vocabulary.map((v) => v.wordEn.toLowerCase())));

describe('content packs', () => {
  it.each(CASES)('$packId grade $grade has 1 unit of 3 missions with its own ids', ({ content, grade }) => {
    const units = content.curriculum[gradeIdOf(grade)]?.units ?? [];
    expect(units).toHaveLength(UNITS_PER_PACK);
    units.forEach((unit) => {
      expect(getIdUnitNumber(unit)).toBe(content.pack.idUnitNumber);
      expect(unit.titleEn).not.toMatch(/^Unit /);
      expect(unit.missions).toHaveLength(MISSIONS_PER_UNIT);
      expect(unit.missions.map((m) => Boolean(m.isBoss))).toEqual([false, false, true]);
      unit.missions.forEach((m) => {
        expect(m.drillSeed, m.id).toBeDefined();
        expect(m.vocabulary, m.id).toHaveLength(packWordsPerMission(content.pack, grade));
      });
    });
  });

  it('adds no unit to a grade the pack does not list', () => {
    const skipped = ALL_PACK_CONTENT.flatMap((content) =>
      GRADES.filter((grade) => !packHasGrade(content.pack, grade)).map((grade) => ({ content, grade }))
    );
    const withUnits = skipped.filter(({ content, grade }) =>
      CURRICULUM_WITH_ALL_PACKS[gradeIdOf(grade)].units.some((u) => u.packId === content.pack.id)
    );
    expect(withUnits.map(({ content, grade }) => `${content.pack.id} g${grade}`)).toEqual([]);
  });

  it.each(CASES)('$packId grade $grade has a lesson for each regular mission and a full bank per unit', ({ content, grade }) => {
    const units = content.curriculum[gradeIdOf(grade)]?.units ?? [];
    const lessons = content.lessons[grade] ?? {};
    const regular = units.flatMap((u) => u.missions.filter((m) => !m.isBoss).map((m) => m.id));
    // A source folder's lesson file serves its packs together, so it holds this pack's lessons among others
    expect(regular.filter((id) => !(id in lessons)), 'missions without a lesson').toEqual([]);
    const unitBank = content.examBanks[grade]?.[content.pack.idUnitNumber];
    expect(unitBank?.vocabulary).toHaveLength(EXAM_BANK_ITEMS_PER_LIST);
  });

  it.each(CASES)('$packId grade $grade loads the same lessons and bank the tests read', async ({ content, grade, packId }) => {
    expect(await ALL_PACK_LESSON_LOADERS[packId][grade]?.()).toBe(content.lessons[grade]);
    expect(await ALL_PACK_EXAM_BANK_LOADERS[packId][grade]?.()).toBe(content.examBanks[grade]);
  });

  it.each(GRADES)('grade %i: the packs add only new words', (grade) => {
    const gradeId = gradeIdOf(grade);
    const baseWords = new Set(words(gradeId, false));
    const packWords = words(gradeId, true);
    expect(packWords.filter((w) => baseWords.has(w)), 'pack words already in the grade').toEqual([]);
    expect(packWords.filter((w, i) => packWords.indexOf(w) !== i), 'repeated pack words').toEqual([]);
  });

  it.each(CASES)('$packId grade $grade has a drawn icon for every map picture', ({ content, grade }) => {
    const units = content.curriculum[gradeIdOf(grade)]?.units ?? [];
    const pictures = units.flatMap((u) => [
      u.badgeEmoji,
      ...u.missions.flatMap((m) => [m.icon, ...(grade <= PICTURE_GRADES ? m.vocabulary.map((v) => v.emoji ?? '') : [])]),
    ]);
    expect(pictures.filter((emoji) => getIconSrc(emoji, 64) === null), 'emoji without a drawn icon').toEqual([]);
  });

  it('adds nothing to the app while no pack is released', () => {
    expect(CONTENT_PACK_IDS).toEqual(['season2-1', 'season2-2', 'core-3', 'holidays-autumn', 'holidays-spring']);
    expect(BASE_CURRICULUM_BY_GRADE['grade-5'].units).toHaveLength(4);
  });
});
