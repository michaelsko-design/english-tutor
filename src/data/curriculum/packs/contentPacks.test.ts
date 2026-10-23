import { describe, expect, it } from 'vitest';
import type { GradeId } from '../../../types/learner';
import { getIconSrc } from '../../../components/art/iconArt';
import { BASE_CURRICULUM_BY_GRADE } from '../base';
import { EXAM_BANK_ITEMS_PER_LIST } from '../examBank/types';
import { isPhonicsUnit } from '../types';
import { ALL_PACK_CONTENT, CURRICULUM_WITH_ALL_PACKS } from './all';
import { ALL_PACK_EXAM_BANK_LOADERS, ALL_PACK_LESSON_LOADERS } from './index';
import { getIdUnitNumber } from './merge';
import { CONTENT_PACK_IDS } from './registry';

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const CASES = ALL_PACK_CONTENT.flatMap((content) => GRADES.map((grade) => ({ content, grade, packId: content.pack.id })));
const gradeIdOf = (grade: number) => `grade-${grade}` as GradeId;
const UNITS_PER_PACK = 2;
const MISSIONS_PER_UNIT = 3;
/** Every pack mission teaches 4 words, so the two packs add as many words as the grade has */
const WORDS_PER_MISSION = 4;
/** Grades whose words are shown as pictures */
const PICTURE_GRADES = 6;

/** The words of the grade's own topic units, or of its packs (grade 1's letters and blending units don't count) */
const words = (gradeId: GradeId, onlyPacks: boolean) =>
  CURRICULUM_WITH_ALL_PACKS[gradeId].units
    .filter((u) => (onlyPacks ? u.packId !== undefined : u.packId === undefined && !isPhonicsUnit(u)))
    .flatMap((u) => u.missions.flatMap((m) => m.vocabulary.map((v) => v.wordEn.toLowerCase())));

describe('content packs', () => {
  it.each(CASES)('$packId grade $grade has 2 units of 3 missions with its own ids', ({ content, grade }) => {
    const units = content.curriculum[gradeIdOf(grade)]?.units ?? [];
    expect(units).toHaveLength(UNITS_PER_PACK);
    units.forEach((unit, index) => {
      expect(getIdUnitNumber(unit)).toBe(content.pack.idUnitNumbers[index]);
      expect(unit.titleEn).not.toMatch(/^Unit /);
      expect(unit.missions).toHaveLength(MISSIONS_PER_UNIT);
      expect(unit.missions.map((m) => Boolean(m.isBoss))).toEqual([false, false, true]);
      unit.missions.forEach((m) => {
        expect(m.drillSeed, m.id).toBeDefined();
        expect(m.vocabulary, m.id).toHaveLength(WORDS_PER_MISSION);
      });
    });
  });

  it.each(CASES)('$packId grade $grade has a lesson for each regular mission and a full bank per unit', ({ content, grade }) => {
    const units = content.curriculum[gradeIdOf(grade)]?.units ?? [];
    const lessons = content.lessons[grade] ?? {};
    const regular = units.flatMap((u) => u.missions.filter((m) => !m.isBoss).map((m) => m.id));
    expect(Object.keys(lessons).sort()).toEqual(regular.sort());
    const bank = content.examBanks[grade] ?? {};
    expect(Object.keys(bank).map(Number)).toEqual([...content.pack.idUnitNumbers]);
    Object.values(bank).forEach((unitBank) => expect(unitBank.vocabulary).toHaveLength(EXAM_BANK_ITEMS_PER_LIST));
  });

  it.each(CASES)('$packId grade $grade loads the same lessons and bank the tests read', async ({ content, grade, packId }) => {
    expect(await ALL_PACK_LESSON_LOADERS[packId][grade]?.()).toBe(content.lessons[grade]);
    expect(await ALL_PACK_EXAM_BANK_LOADERS[packId][grade]?.()).toBe(content.examBanks[grade]);
  });

  it.each(GRADES)('grade %i: the packs add new words, as many as the grade has', (grade) => {
    const gradeId = gradeIdOf(grade);
    const baseWords = new Set(words(gradeId, false));
    const packWords = words(gradeId, true);
    expect(packWords.filter((w) => baseWords.has(w)), 'pack words already in the grade').toEqual([]);
    expect(packWords.filter((w, i) => packWords.indexOf(w) !== i), 'repeated pack words').toEqual([]);
    expect(packWords.length).toBeGreaterThanOrEqual(baseWords.size);
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
    expect(CONTENT_PACK_IDS).toEqual(['core-plus', 'holidays']);
    expect(BASE_CURRICULUM_BY_GRADE['grade-5'].units).toHaveLength(4);
  });
});
