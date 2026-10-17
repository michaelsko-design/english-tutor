import { describe, expect, it } from 'vitest';
import {
  BOSS_STARS_PER_REGULAR_MISSION,
  countCompletedMissions,
  getBossGate,
  getSuggestedMission,
  isMissionUnlocked,
} from './milestones';
import { CURRICULUM_BY_GRADE, CurriculumUnit, MissionNode } from './curriculum';

const makeMission = (unitNumber: number, missionNumber: number, isBoss = false): MissionNode =>
  ({
    id: `u${unitNumber}-m${missionNumber}`,
    unitNumber,
    missionNumber,
    ...(isBoss ? { isBoss: true } : {}),
  }) as MissionNode;

const makeUnit = (unitNumber: number): CurriculumUnit =>
  ({
    unitNumber,
    missions: [
      makeMission(unitNumber, 1),
      makeMission(unitNumber, 2),
      makeMission(unitNumber, 3, true),
    ],
  }) as CurriculumUnit;

const UNITS = [makeUnit(1), makeUnit(2)];

describe('getBossGate', () => {
  it('requires 2 stars per regular mission', () => {
    const gate = getBossGate(UNITS[0], {});

    expect(BOSS_STARS_PER_REGULAR_MISSION).toBe(2);
    expect(gate).toEqual({ required: 4, earned: 0, missing: 4, isMet: false });
  });

  it('counts only the regular missions of the unit', () => {
    const progress = { 'u1-m1': 1, 'u1-m2': 2, 'u1-m3': 3, 'u2-m1': 3 };

    const gate = getBossGate(UNITS[0], progress);

    expect(gate).toEqual({ required: 4, earned: 3, missing: 1, isMet: false });
  });

  it('is met at 4 of 6 stars', () => {
    const gate = getBossGate(UNITS[0], { 'u1-m1': 3, 'u1-m2': 1 });

    expect(gate?.isMet).toBe(true);
    expect(gate?.missing).toBe(0);
  });

  it('returns null for a unit without a boss', () => {
    const unit = { unitNumber: 9, missions: [makeMission(9, 1)] } as CurriculumUnit;

    expect(getBossGate(unit, {})).toBeNull();
  });
});

describe('isMissionUnlocked', () => {
  it('keeps the sequential rule for regular missions', () => {
    const progress = { 'u1-m1': 1 };

    expect(isMissionUnlocked(UNITS, progress, 'u1-m1')).toBe(true);
    expect(isMissionUnlocked(UNITS, progress, 'u1-m2')).toBe(true);
    expect(isMissionUnlocked(UNITS, {}, 'u1-m2')).toBe(false);
  });

  it('locks the boss while the unit has fewer stars than required', () => {
    const progress = { 'u1-m1': 1, 'u1-m2': 2 };

    expect(isMissionUnlocked(UNITS, progress, 'u1-m3')).toBe(false);
  });

  it('unlocks the boss once the star gate is met', () => {
    const progress = { 'u1-m1': 2, 'u1-m2': 2 };

    expect(isMissionUnlocked(UNITS, progress, 'u1-m3')).toBe(true);
  });

  it('keeps a boss that already has stars unlocked even below the gate', () => {
    const progress = { 'u1-m1': 1, 'u1-m2': 1, 'u1-m3': 2 };

    expect(isMissionUnlocked(UNITS, progress, 'u1-m3')).toBe(true);
  });

  it('keeps the next unit locked while its previous boss is gated', () => {
    const progress = { 'u1-m1': 1, 'u1-m2': 1 };

    expect(isMissionUnlocked(UNITS, progress, 'u2-m1')).toBe(false);
  });

  it('returns false for an unknown mission id', () => {
    expect(isMissionUnlocked(UNITS, {}, 'nope')).toBe(false);
  });
});

describe('getSuggestedMission', () => {
  it('suggests the first mission without stars', () => {
    const result = getSuggestedMission(UNITS, { 'u1-m1': 3 });

    expect(result.mission.id).toBe('u1-m2');
    expect(result.bossGate).toBeNull();
  });

  it('suggests the boss once its gate is met', () => {
    const result = getSuggestedMission(UNITS, { 'u1-m1': 2, 'u1-m2': 2 });

    expect(result.mission.id).toBe('u1-m3');
    expect(result.bossGate).toBeNull();
  });

  it('redirects a gated boss to the weakest regular mission of its unit', () => {
    const result = getSuggestedMission(UNITS, { 'u1-m1': 2, 'u1-m2': 1 });

    expect(result.mission.id).toBe('u1-m2');
    expect(result.bossGate).toEqual({ required: 4, earned: 3, missing: 1, isMet: false });
  });

  it('falls back to the first mission when every mission has stars', () => {
    const progress = Object.fromEntries(
      UNITS.flatMap((u) => u.missions).map((m) => [m.id, 1])
    );

    const result = getSuggestedMission(UNITS, progress);

    expect(result.mission.id).toBe('u1-m1');
    expect(result.bossGate).toBeNull();
  });
});

describe('countCompletedMissions', () => {
  it('counts distinct missions with at least one star', () => {
    expect(countCompletedMissions({ a: 1, b: 3, c: 0, d: 2 })).toBe(3);
  });

  it('returns 0 for empty progress', () => {
    expect(countCompletedMissions({})).toBe(0);
  });
});

describe('curriculum boss layout', () => {
  it('every unit in every grade ends with exactly one boss mission', () => {
    const units = Object.values(CURRICULUM_BY_GRADE).flatMap((pack) => pack.units);

    for (const unit of units) {
      const bosses = unit.missions.filter((m) => m.isBoss);
      expect(bosses).toHaveLength(1);
      expect(unit.missions[unit.missions.length - 1].isBoss).toBe(true);
    }
  });
});
