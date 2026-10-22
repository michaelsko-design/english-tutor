import type { ExamBankPack } from '../examBank/types';
import type { LessonPack } from '../lessons/types';
import type { GradeId } from '../../../types/learner';
import type { CurriculumUnit, GradeCurriculumPack } from '../types';
import { CONTENT_PACKS } from './registry';
import type { ContentPack, ContentPackId, PackCurriculum } from './types';

/** A pack's units of one grade, ready to be added to the grade's map */
export interface PackUnits {
  pack: ContentPack;
  units: readonly CurriculumUnit[];
}

const MISSION_ID_UNIT = /^g\d+-u(\d+)-m\d+$/;

/** The unit number in a unit's mission ids (`g5-u21-m1` → 21); its place when it has none. */
export function getIdUnitNumber(unit: Pick<CurriculumUnit, 'unitNumber' | 'missions'>): number {
  const match = unit.missions[0] && MISSION_ID_UNIT.exec(unit.missions[0].id);
  return match ? Number(match[1]) : unit.unitNumber;
}

function placeUnit(unit: CurriculumUnit, pack: ContentPack, place: number): CurriculumUnit {
  return {
    ...unit,
    unitNumber: place,
    titleEn: `Unit ${place}: ${unit.titleEn}`,
    missions: unit.missions.map((mission) => ({ ...mission, unitNumber: place })),
    packId: pack.id,
    ...(pack.unlock === 'open' ? { track: pack.id } : {}),
  };
}

/**
 * The grade's units followed by the released packs' units, in release order: a unit's place (its
 * map region, exam-plan and contest unit number) never changes when a later pack ships.
 */
export function mergeCurriculum(base: GradeCurriculumPack, packs: readonly PackUnits[]): GradeCurriculumPack {
  if (packs.length === 0) return base;
  const units = packs.reduce<CurriculumUnit[]>(
    (merged, { pack, units: packUnits }) => [
      ...merged,
      ...packUnits.map((unit, index) => placeUnit(unit, pack, merged.length + index + 1)),
    ],
    [...base.units]
  );
  return { ...base, units };
}

/** Lesson packs are keyed by mission id, so the packs' lessons simply join the grade's. */
export function mergeLessonPacks(base: LessonPack, packLessons: readonly LessonPack[]): LessonPack {
  return packLessons.reduce<LessonPack>((merged, lessons) => ({ ...merged, ...lessons }), base);
}

/**
 * A grade's exam bank with the packs' banks added. Pack banks are keyed by the unit number in the
 * mission ids (21, 22…); the grade's bank is keyed by place, so each one moves to its unit's place.
 */
export function mergeExamBank(
  base: ExamBankPack,
  packBanks: readonly ExamBankPack[],
  units: readonly CurriculumUnit[]
): ExamBankPack {
  const byIdUnit = packBanks.reduce<ExamBankPack>((merged, bank) => ({ ...merged, ...bank }), {});
  return units
    .filter((unit) => unit.packId !== undefined)
    .reduce<ExamBankPack>((merged, unit) => {
      const unitBank = byIdUnit[getIdUnitNumber(unit)];
      return unitBank ? { ...merged, [unit.unitNumber]: unitBank } : merged;
    }, base);
}

/** The given packs' units of one grade, in the given order, for `mergeCurriculum`. */
export function getPackUnits(
  gradeId: GradeId,
  packIds: readonly ContentPackId[],
  curricula: Partial<Record<ContentPackId, PackCurriculum>>
): PackUnits[] {
  return packIds.map((id) => ({ pack: CONTENT_PACKS[id], units: curricula[id]?.[gradeId]?.units ?? [] }));
}

/** Every grade with the given packs' units added, in the given order. */
export function withPacks(
  base: Record<GradeId, GradeCurriculumPack>,
  packIds: readonly ContentPackId[],
  curricula: Partial<Record<ContentPackId, PackCurriculum>>
): Record<GradeId, GradeCurriculumPack> {
  return Object.fromEntries(
    Object.entries(base).map(([gradeId, pack]) => [
      gradeId,
      mergeCurriculum(pack, getPackUnits(gradeId as GradeId, packIds, curricula)),
    ])
  ) as Record<GradeId, GradeCurriculumPack>;
}
