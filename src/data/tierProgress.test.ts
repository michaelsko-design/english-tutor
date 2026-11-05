import { describe, expect, it } from 'vitest';
import {
  FIRST_TIER_CLEAR_DIAMONDS,
  getMissionLadder,
  getNextTier,
  hasMasterTrophy,
  mergeTierStars,
  recordTierStars,
  type MissionTierStars,
} from './tierProgress';

describe('tier progress ladder', () => {
  it('records the best stars per mission and tier, without mutating', () => {
    const start: MissionTierStars = { m1: { explorer: 2 } };
    const first = recordTierStars(start, 'm1', 'challenger', 1);
    expect(first.isFirstClear).toBe(true);
    expect(first.tierStars).toEqual({ m1: { explorer: 2, challenger: 1 } });
    expect(start).toEqual({ m1: { explorer: 2 } });

    const better = recordTierStars(first.tierStars, 'm1', 'challenger', 3);
    expect(better.isFirstClear).toBe(false);
    expect(better.tierStars.m1.challenger).toBe(3);

    const worse = recordTierStars(better.tierStars, 'm1', 'challenger', 1);
    expect(worse.tierStars.m1.challenger).toBe(3);
  });

  it('merges two devices by the highest stars per cell', () => {
    const merged = mergeTierStars(
      { a: { explorer: 3, master: 1 }, b: { explorer: 1 } },
      { a: { explorer: 2, master: 2 }, c: { challenger: 3 } }
    );
    expect(merged).toEqual({
      a: { explorer: 3, master: 2 },
      b: { explorer: 1 },
      c: { challenger: 3 },
    });
    expect(mergeTierStars(undefined, undefined)).toEqual({});
  });

  it('reads the ladder, crediting old profiles to the preferred tier and every tier below it', () => {
    const profile = { missionProgress: { old: 2, fresh: 3 }, missionTierStars: { fresh: { master: 3 } }, preferredTier: 'challenger' as const };
    expect(getMissionLadder(profile, 'old')).toEqual({ explorer: 2, challenger: 2, master: 0 });
    expect(getMissionLadder({ ...profile, preferredTier: 'master' }, 'old')).toEqual({ explorer: 2, challenger: 2, master: 2 });
    expect(getMissionLadder({ ...profile, preferredTier: 'explorer' }, 'old')).toEqual({ explorer: 2, challenger: 0, master: 0 });
    expect(getMissionLadder(profile, 'fresh')).toEqual({ explorer: 0, challenger: 0, master: 3 });
    expect(getMissionLadder(profile, 'none')).toEqual({ explorer: 0, challenger: 0, master: 0 });
  });

  it('suggests the next tier to try', () => {
    expect(getNextTier({ explorer: 0, challenger: 0, master: 0 })).toBe('explorer');
    expect(getNextTier({ explorer: 3, challenger: 0, master: 0 })).toBe('challenger');
    expect(getNextTier({ explorer: 3, challenger: 2, master: 0 })).toBe('master');
    expect(getNextTier({ explorer: 3, challenger: 3, master: 3 })).toBeNull();
  });

  it('gives the Master trophy for three stars at Master only', () => {
    expect(hasMasterTrophy({ explorer: 3, challenger: 3, master: 2 })).toBe(false);
    expect(hasMasterTrophy({ explorer: 0, challenger: 0, master: 3 })).toBe(true);
  });

  it('pays a bigger one-time bonus for each higher tier', () => {
    expect(FIRST_TIER_CLEAR_DIAMONDS.explorer).toBeLessThan(FIRST_TIER_CLEAR_DIAMONDS.challenger);
    expect(FIRST_TIER_CLEAR_DIAMONDS.challenger).toBeLessThan(FIRST_TIER_CLEAR_DIAMONDS.master);
  });
});
