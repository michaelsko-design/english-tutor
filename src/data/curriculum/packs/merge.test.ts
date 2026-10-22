import { describe, expect, it } from 'vitest';
import type { ExamBankPack, ExamUnitBank } from '../examBank/types';
import type { CurriculumUnit, GradeCurriculumPack, MissionNode } from '../types';
import { getIdUnitNumber, mergeCurriculum, mergeExamBank, mergeLessonPacks, type PackUnits } from './merge';
import { CONTENT_PACKS } from './registry';

function makeUnit(idUnitNumber: number, title: string): CurriculumUnit {
  const missions = [1, 2, 3].map(
    (missionNumber) =>
      ({ id: `g5-u${idUnitNumber}-m${missionNumber}`, unitNumber: 1, missionNumber }) as MissionNode
  );
  return { unitNumber: 1, titleEn: title, titleHe: title, subtitleHe: '', badgeEmoji: '⭐', missions };
}

const BASE: GradeCurriculumPack = {
  gradeId: 'grade-5',
  units: [1, 2, 3, 4].map((n) => ({ ...makeUnit(n, `Unit ${n}: Base`), unitNumber: n })),
};
const CORE: PackUnits = { pack: CONTENT_PACKS['core-plus'], units: [makeUnit(21, 'Trips'), makeUnit(22, 'Records')] };
const HOLIDAYS: PackUnits = { pack: CONTENT_PACKS.holidays, units: [makeUnit(31, 'Winter'), makeUnit(32, 'Spring')] };

const bankFor = (label: string): ExamUnitBank => ({ vocabulary: [], grammar: [], sentences: [], passages: [label] }) as never;

describe('mergeCurriculum', () => {
  it('returns the grade untouched when no pack is released', () => {
    expect(mergeCurriculum(BASE, [])).toBe(BASE);
  });

  it('adds a pack after the grade units with places, titles and the pack id', () => {
    const merged = mergeCurriculum(BASE, [CORE]);
    expect(merged.units.map((u) => u.unitNumber)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(merged.units[4].titleEn).toBe('Unit 5: Trips');
    expect(merged.units[4].packId).toBe('core-plus');
    expect(merged.units[4].track).toBeUndefined();
    expect(merged.units[4].missions.map((m) => [m.id, m.unitNumber])).toEqual([
      ['g5-u21-m1', 5],
      ['g5-u21-m2', 5],
      ['g5-u21-m3', 5],
    ]);
    expect(BASE.units).toHaveLength(4);
  });

  it('puts an open pack on its own track', () => {
    const merged = mergeCurriculum(BASE, [HOLIDAYS]);
    expect(merged.units.slice(4).map((u) => [u.titleEn, u.track])).toEqual([
      ['Unit 5: Winter', 'holidays'],
      ['Unit 6: Spring', 'holidays'],
    ]);
  });

  it('keeps release order, and the same mission ids whichever pack ships first', () => {
    const coreFirst = mergeCurriculum(BASE, [CORE, HOLIDAYS]);
    const holidaysFirst = mergeCurriculum(BASE, [HOLIDAYS, CORE]);
    expect(coreFirst.units.map((u) => u.titleEn).slice(4)).toEqual([
      'Unit 5: Trips',
      'Unit 6: Records',
      'Unit 7: Winter',
      'Unit 8: Spring',
    ]);
    expect(holidaysFirst.units[6].titleEn).toBe('Unit 7: Trips');
    const ids = (pack: GradeCurriculumPack) => pack.units.flatMap((u) => u.missions.map((m) => m.id)).sort();
    expect(ids(coreFirst)).toEqual(ids(holidaysFirst));
  });
});

describe('getIdUnitNumber', () => {
  it('reads the unit number of the mission ids, else the place', () => {
    expect(getIdUnitNumber(makeUnit(31, 'x'))).toBe(31);
    expect(getIdUnitNumber({ unitNumber: 3, missions: [] })).toBe(3);
  });
});

describe('mergeLessonPacks', () => {
  it('adds the packs lessons by mission id', () => {
    const base = { 'g5-u1-m1': { titleHe: 'a' } } as never;
    const merged = mergeLessonPacks(base, [{ 'g5-u21-m1': { titleHe: 'b' } } as never]);
    expect(Object.keys(merged)).toEqual(['g5-u1-m1', 'g5-u21-m1']);
    expect(mergeLessonPacks(base, [])).toBe(base);
  });
});

describe('mergeExamBank', () => {
  it('moves each pack bank to its unit place', () => {
    const base: ExamBankPack = { 1: bankFor('base-1') };
    const units = mergeCurriculum(BASE, [HOLIDAYS, CORE]).units;
    const merged = mergeExamBank(base, [{ 21: bankFor('trips'), 22: bankFor('records') }, { 31: bankFor('winter') }], units);
    expect(merged[1]).toBe(base[1]);
    expect(merged[5]).toEqual(bankFor('winter'));
    expect(merged[6]).toBeUndefined();
    expect(merged[7]).toEqual(bankFor('trips'));
    expect(merged[8]).toEqual(bankFor('records'));
    expect(merged[21]).toBeUndefined();
  });
});
