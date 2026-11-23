import { describe, expect, it } from 'vitest';
import { CurriculumUnit, MissionNode } from './curriculum';
import { DAILY_STOP_MISSIONS, getVictoryNextStep } from './victoryNextStep';

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
    missions: [makeMission(unitNumber, 1), makeMission(unitNumber, 2), makeMission(unitNumber, 3, true)],
  }) as CurriculumUnit;

const UNITS = [makeUnit(1), makeUnit(2)];
const BASE = { units: UNITS, missionsTodayAfter: 1, isFirstMission: false };

describe('getVictoryNextStep', () => {
  it('offers the next mission without stars after a finished one', () => {
    const step = getVictoryNextStep({ ...BASE, progressAfter: { 'u1-m1': 2 } });

    expect(step).toEqual({ kind: 'next', mission: UNITS[0].missions[1], isReplay: false });
  });

  it('offers a star replay when the Boss gate is not met yet', () => {
    const step = getVictoryNextStep({ ...BASE, progressAfter: { 'u1-m1': 1, 'u1-m2': 2 } });

    expect(step).toEqual({ kind: 'next', mission: UNITS[0].missions[0], isReplay: true });
  });

  it(`says "done for today" once ${DAILY_STOP_MISSIONS} missions were finished today`, () => {
    const step = getVictoryNextStep({
      ...BASE,
      progressAfter: { 'u1-m1': 2 },
      missionsTodayAfter: DAILY_STOP_MISSIONS,
    });

    expect(step).toEqual({ kind: 'rest' });
  });

  it('offers nothing after the very first mission (the first-win screen comes next)', () => {
    const step = getVictoryNextStep({ ...BASE, progressAfter: { 'u1-m1': 3 }, isFirstMission: true });

    expect(step).toEqual({ kind: 'none' });
  });

  it('offers nothing when every playable mission already has stars', () => {
    const allStarred = Object.fromEntries(UNITS.flatMap((u) => u.missions).map((m) => [m.id, 3]));

    expect(getVictoryNextStep({ ...BASE, progressAfter: allStarred })).toEqual({ kind: 'none' });
  });

  it('offers nothing when there are no playable units', () => {
    expect(getVictoryNextStep({ ...BASE, units: [], progressAfter: {} })).toEqual({ kind: 'none' });
  });
});
