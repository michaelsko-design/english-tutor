import { describe, expect, it } from 'vitest';
import type { GradeId } from '../../../types/learner';
import { getNewPackOffer, type PackReleaseState } from '../../contentPacks';
import { getSuggestedMission, isMissionUnlocked } from '../../milestones';
import type { CurriculumUnit, GradeCurriculumPack, MissionNode } from '../types';
import { getPackUnits, packLoadersInGrade, packsInGrade, withPacks } from './merge';
import { ALL_GRADES, CONTENT_PACKS, packGrades, packHasGrade } from './registry';
import type { ContentPack, ContentPackId, PackCurriculum } from './types';

/**
 * A core pack may skip a grade that is already complete (grade 1 has no core-3 to core-8). These
 * tests use a synthetic registry: A (every grade), B (after A, skips grade 1) and C (after B, every
 * grade), with ids borrowed from the real union.
 */
const BASE_UNIT_COUNT = 4;
const SKIPPED_GRADE = 1;
const NOT_GRADE_1 = ALL_GRADES.filter((grade) => grade !== SKIPPED_GRADE);

const makeUnit = (grade: number, idUnit: number, place = idUnit): CurriculumUnit => ({
  unitNumber: place,
  titleEn: `Unit ${idUnit}`,
  titleHe: '',
  subtitleHe: '',
  badgeEmoji: '⭐',
  missions: [1, 2, 3].map(
    (n) => ({ id: `g${grade}-u${idUnit}-m${n}`, unitNumber: place, missionNumber: n, isBoss: n === 3 }) as MissionNode
  ),
});

const baseOf = (grade: number): GradeCurriculumPack => ({
  gradeId: `grade-${grade}` as GradeId,
  units: Array.from({ length: BASE_UNIT_COUNT }, (_, i) => makeUnit(grade, i + 1)),
});

const A: ContentPackId = 'season2-1';
const B: ContentPackId = 'season2-2';
const C: ContentPackId = 'holidays-autumn';

const REGISTRY: Record<ContentPackId, ContentPack> = {
  ...CONTENT_PACKS,
  [B]: { ...CONTENT_PACKS[B], after: A, grades: NOT_GRADE_1 },
  [C]: { ...CONTENT_PACKS[C], kind: 'core', unlock: 'sequence', after: B, idUnitNumber: 23 },
};

/** Every pack's curriculum holds a unit in every grade, even B in grade 1: the list decides */
const curriculumOf = (idUnit: number): PackCurriculum =>
  Object.fromEntries(ALL_GRADES.map((grade) => [`grade-${grade}`, { gradeId: `grade-${grade}`, units: [makeUnit(grade, idUnit)] }]));
const CURRICULA: Partial<Record<ContentPackId, PackCurriculum>> = {
  [A]: curriculumOf(21),
  [B]: curriculumOf(22),
  [C]: curriculumOf(23),
};

const BASE = Object.fromEntries(ALL_GRADES.map((grade) => [`grade-${grade}`, baseOf(grade)])) as Record<
  GradeId,
  GradeCurriculumPack
>;

const RELEASED_B: PackReleaseState = { released: [{ id: B, releasedAt: '2027-01-01', access: 'free' }], isPreview: false };

const allStars = (units: readonly CurriculumUnit[]) =>
  Object.fromEntries(units.flatMap((u) => u.missions.map((m) => [m.id, 3])));

describe('packGrades', () => {
  it('lists all 12 grades when the pack names none', () => {
    expect(ALL_GRADES).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(packGrades(CONTENT_PACKS[A])).toEqual(ALL_GRADES);
    expect(packHasGrade(CONTENT_PACKS[A], SKIPPED_GRADE)).toBe(true);
  });

  it('reads the pack’s own list', () => {
    expect(packGrades(REGISTRY[B])).toEqual(NOT_GRADE_1);
    expect(packHasGrade(REGISTRY[B], SKIPPED_GRADE)).toBe(false);
    expect(packHasGrade(REGISTRY[B], 2)).toBe(true);
  });

  it('keeps only the items whose pack lists the grade', () => {
    const items = [REGISTRY[A], REGISTRY[B]].map((pack) => ({ pack }));
    expect(packsInGrade(items, SKIPPED_GRADE).map((i) => i.pack.id)).toEqual([A]);
    expect(packsInGrade(items, 2).map((i) => i.pack.id)).toEqual([A, B]);
  });
});

describe('a pack that skips grade 1', () => {
  it('adds no unit to grade 1, even when its curriculum has one', () => {
    expect(getPackUnits('grade-1', [B], CURRICULA, REGISTRY)).toEqual([]);
    expect(getPackUnits('grade-2', [B], CURRICULA, REGISTRY).map((p) => p.units.length)).toEqual([1]);
  });

  it('loads no lessons or bank for grade 1, even when its source folder has that grade', () => {
    const shared = { 1: 'g1-file', 2: 'g2-file' };
    const loaders = { [A]: shared, [B]: shared };
    expect(packLoadersInGrade(loaders, SKIPPED_GRADE, REGISTRY)).toEqual(['g1-file']);
    expect(packLoadersInGrade(loaders, 2, REGISTRY)).toEqual(['g2-file', 'g2-file']);
    expect(packLoadersInGrade({ [A]: { 2: 'g2-file' } }, SKIPPED_GRADE, REGISTRY)).toEqual([]);
  });

  it('leaves the merged grade-1 curriculum unchanged', () => {
    const merged = withPacks(BASE, [B], CURRICULA, REGISTRY);
    expect(merged['grade-1']).toBe(BASE['grade-1']);
    expect(merged['grade-2'].units).toHaveLength(BASE_UNIT_COUNT + 1);
  });

  it('shows no new-pack card in grade 1, and shows it in grade 2', () => {
    const merged = withPacks(BASE, [B], CURRICULA, REGISTRY);
    expect(getNewPackOffer(merged['grade-1'].units, '2027-01-02', [], RELEASED_B)).toBeNull();
    expect(getNewPackOffer(merged['grade-2'].units, '2027-01-02', [], RELEASED_B)?.firstMissionId).toBe('g2-u22-m1');
  });
});

describe('the core chain across a skipped grade', () => {
  const merged = withPacks(BASE, [A, B, C], CURRICULA, REGISTRY);
  const grade1 = merged['grade-1'].units;

  it('puts the next pack straight after the last unit grade 1 has, with no gap in places', () => {
    expect(grade1.map((u) => [u.unitNumber, u.packId])).toEqual([
      [1, undefined],
      [2, undefined],
      [3, undefined],
      [4, undefined],
      [5, A],
      [6, C],
    ]);
    expect(merged['grade-2'].units.map((u) => u.packId).slice(BASE_UNIT_COUNT)).toEqual([A, B, C]);
  });

  it('opens the next pack once A is done: the skipped pack never blocks grade 1', () => {
    const firstOfC = 'g1-u23-m1';
    const aDone = allStars(grade1.filter((u) => u.packId !== C));
    expect(isMissionUnlocked(grade1, allStars(grade1.slice(0, BASE_UNIT_COUNT)), firstOfC)).toBe(false);
    expect(isMissionUnlocked(grade1, aDone, firstOfC)).toBe(true);
    expect(getSuggestedMission(grade1, aDone).mission.id).toBe(firstOfC);
  });

  it('suggests a grade-1 mission when every unit is done', () => {
    expect(getSuggestedMission(grade1, allStars(grade1)).mission.id).toBe('g1-u1-m1');
  });
});
