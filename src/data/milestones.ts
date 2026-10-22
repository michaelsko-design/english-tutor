import { CurriculumUnit, MissionNode } from './curriculum/types';

/**
 * Star-gated milestones (Feature 15).
 *
 * A unit's Boss mission unlocks only once the learner has earned enough stars on the
 * unit's regular missions: 2 stars per regular mission (4 of 6 in a 3-mission unit).
 * A Boss that already has stars always stays unlocked, so earlier progress is kept.
 */
export const BOSS_STARS_PER_REGULAR_MISSION = 2;

export interface BossGate {
  required: number;
  earned: number;
  missing: number;
  isMet: boolean;
}

export interface SuggestedMission {
  mission: MissionNode;
  /** Set when the next mission is a star-gated Boss and a replay is suggested instead. */
  bossGate: BossGate | null;
}

type MissionProgress = Record<string, number>;

const starsOf = (progress: MissionProgress, missionId: string): number =>
  progress[missionId] || 0;

/** Star gate of a unit's Boss mission, or null when the unit has no Boss. */
export function getBossGate(unit: CurriculumUnit, progress: MissionProgress): BossGate | null {
  if (!unit.missions.some((m) => m.isBoss)) return null;

  const regularMissions = unit.missions.filter((m) => !m.isBoss);
  const required = regularMissions.length * BOSS_STARS_PER_REGULAR_MISSION;
  const earned = regularMissions.reduce((acc, m) => acc + starsOf(progress, m.id), 0);
  const missing = Math.max(0, required - earned);
  return { required, earned, missing, isMet: missing === 0 };
}

const findUnitOf = (units: CurriculumUnit[], missionId: string): CurriculumUnit | undefined =>
  units.find((u) => u.missions.some((m) => m.id === missionId));

/** True when a Boss has no stars yet and its unit's star gate is not met. */
const isBossGated = (
  units: CurriculumUnit[],
  mission: MissionNode,
  progress: MissionProgress
): boolean => {
  if (!mission.isBoss || starsOf(progress, mission.id) > 0) return false;
  const unit = findUnitOf(units, mission.id);
  const gate = unit ? getBossGate(unit, progress) : null;
  return Boolean(gate && !gate.isMet);
};

/**
 * The units on the same unlock track as `unit`: the grade's path, or the units of a content pack
 * that opens on its own (`CurriculumUnit.track`), whose missions don't wait for the path.
 */
const getTrackUnits = (units: CurriculumUnit[], unit: CurriculumUnit): CurriculumUnit[] =>
  units.filter((u) => u.track === unit.track);

/**
 * Sequential unlock (a mission opens once the previous one on its track has a star) plus the
 * Boss star gate.
 */
export function isMissionUnlocked(
  units: CurriculumUnit[],
  progress: MissionProgress,
  missionId: string
): boolean {
  const unit = findUnitOf(units, missionId);
  if (!unit) return false;
  const allMissions = getTrackUnits(units, unit).flatMap((u) => u.missions);
  const idx = allMissions.findIndex((m) => m.id === missionId);
  if (idx === -1) return false;

  const mission = allMissions[idx];
  if (starsOf(progress, mission.id) > 0) return true;
  if (isBossGated(units, mission, progress)) return false;
  if (idx === 0) return true;

  const firstUncompletedIdx = allMissions.findIndex((m) => starsOf(progress, m.id) === 0);
  return starsOf(progress, allMissions[idx - 1].id) > 0 || idx <= firstUncompletedIdx;
}

/**
 * The next mission to play: the first one without stars, on the grade's path first and then on
 * the tracks of the packs that open on their own. When that is a gated Boss, suggest replaying the
 * unit's weakest regular mission to earn the missing stars.
 */
export function getSuggestedMission(
  units: CurriculumUnit[],
  progress: MissionProgress
): SuggestedMission {
  const pathFirst = [...units.filter((u) => u.track === undefined), ...units.filter((u) => u.track !== undefined)];
  const allMissions = pathFirst.flatMap((u) => u.missions);
  const next = allMissions.find((m) => starsOf(progress, m.id) === 0);
  if (!next) return { mission: allMissions[0], bossGate: null };

  const unit = findUnitOf(units, next.id);
  const gate = next.isBoss && unit ? getBossGate(unit, progress) : null;
  if (!unit || !gate || gate.isMet) return { mission: next, bossGate: null };

  const weakest = unit.missions
    .filter((m) => !m.isBoss)
    .reduce((min, m) => (starsOf(progress, m.id) < starsOf(progress, min.id) ? m : min));
  return { mission: weakest, bossGate: gate };
}

/** Distinct missions finished at least once (≥1 star), across all grades. */
export function countCompletedMissions(progress: MissionProgress): number {
  return Object.values(progress).filter((stars) => stars > 0).length;
}
