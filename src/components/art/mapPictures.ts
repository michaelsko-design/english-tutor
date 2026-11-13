import { getMissionPictureId, getUnitPictureId } from './mapPictureIds';

interface UnitLike {
  unitNumber: number;
  missions: ReadonlyArray<{ id: string }>;
}

const GRADE_FROM_MISSION_ID = /^g(\d+)-/;

/** A unit badge's drawn picture; the grade comes from its missions' ids ("g3-u21-m1" → grade-3). */
export function getUnitPicture(unit: UnitLike): string | undefined {
  const grade = GRADE_FROM_MISSION_ID.exec(unit.missions[0]?.id ?? '')?.[1];
  return grade ? getUnitPictureId(`grade-${grade}`, unit.unitNumber) : undefined;
}

export { getMissionPictureId };
