import { describe, expect, it } from 'vitest';
import type { DailyActivityCounters } from '../types/learner';
import { MAX_SURPRISES_PER_DAY, SURPRISE_DIAMOND_AMOUNTS, rollMissionSurprise } from './victorySurprise';

const DAY = '2026-11-24';

const counters = (overrides: Partial<DailyActivityCounters> = {}): DailyActivityCounters => ({
  dateStr: DAY,
  missionsCompletedToday: 0,
  voiceWordsPracticedToday: 0,
  threeStarMissionsToday: 0,
  ...overrides,
});

/** Rolls the first mission of the day for many learners */
const rollMany = (overrides: Partial<DailyActivityCounters> = {}, isFullReward = true): number[] =>
  Array.from({ length: 500 }, (_, i) =>
    rollMissionSurprise({ isFullReward, todayCounters: counters(overrides), learnerSeed: `learner-${i}`, todayStr: DAY })
  );

describe('rollMissionSurprise', () => {
  it('comes now and then: roughly one finished mission in five', () => {
    const hits = rollMany().filter((d) => d > 0).length;
    expect(hits).toBeGreaterThan(60);
    expect(hits).toBeLessThan(140);
  });

  it('pays one of the set amounts', () => {
    rollMany()
      .filter((d) => d > 0)
      .forEach((d) => expect(SURPRISE_DIAMOND_AMOUNTS).toContain(d));
  });

  it('never comes with a replay that earns only the repeat prize', () => {
    expect(rollMany({}, false).every((d) => d === 0)).toBe(true);
  });

  it('comes at most once a day', () => {
    expect(rollMany({ surprisesToday: MAX_SURPRISES_PER_DAY, missionsCompletedToday: 1 }).every((d) => d === 0)).toBe(true);
  });

  it("ignores yesterday's surprise", () => {
    const yesterday = counters({ dateStr: '2026-11-23', surprisesToday: 1, missionsCompletedToday: 2 });
    const rolls = Array.from({ length: 200 }, (_, i) =>
      rollMissionSurprise({ isFullReward: true, todayCounters: yesterday, learnerSeed: `l${i}`, todayStr: DAY })
    );
    expect(rolls.some((d) => d > 0)).toBe(true);
  });

  it('gives the same answer for the same learner, day and mission number (no re-roll by replaying)', () => {
    const input = { isFullReward: true, todayCounters: counters({ missionsCompletedToday: 2 }), learnerSeed: 'x', todayStr: DAY };
    expect(rollMissionSurprise(input)).toBe(rollMissionSurprise(input));
  });
});
