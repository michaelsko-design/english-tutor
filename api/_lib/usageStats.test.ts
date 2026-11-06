import { describe, expect, it } from 'vitest';
import { computeUsageStats, readAnalyticsRows } from './usageStats.js';

const row = (uid: string, day: string, counts: Record<string, number>) => ({ uid, day, counts });

describe('computeUsageStats', () => {
  it('counts distinct learners per funnel step and missions per tier', () => {
    const stats = computeUsageStats(
      [
        row('a', '2026-11-05', { session_start: 1, onboarding_done: 1, mission_finish: 2, mission_finish_tier_explorer: 2 }),
        row('a', '2026-11-06', { session_start: 1, mission_finish: 1, mission_finish_tier_master: 1, mission_three_stars: 1 }),
        row('b', '2026-11-06', { session_start: 1 }),
      ],
      [],
      '2026-11-06'
    );
    expect(stats.funnel).toEqual({ sessions: 2, onboarded: 1, placed: 0, firstMission: 1, threeStars: 1 });
    expect(stats.missionsByTier).toEqual({ explorer: 2, challenger: 0, master: 1 });
  });

  it('counts distinct learners per opened feature, most used first', () => {
    const stats = computeUsageStats(
      [
        row('a', '2026-11-05', { session_start: 1, feature_room: 2 }),
        row('a', '2026-11-06', { feature_room: 1, feature_shop: 1 }),
        row('b', '2026-11-06', { feature_room: 1 }),
      ],
      [],
      '2026-11-06'
    );
    expect(stats.features).toEqual([
      { key: 'feature_room', learners: 2 },
      { key: 'feature_shop', learners: 1 },
    ]);
  });

  it('computes day-1 retention only over learners old enough', () => {
    const stats = computeUsageStats(
      [row('a', '2026-11-04', { session_start: 1 }), row('a', '2026-11-05', { session_start: 1 }), row('b', '2026-11-04', { session_start: 1 }), row('c', '2026-11-06', { session_start: 1 })],
      [],
      '2026-11-06'
    );
    expect(stats.retention.day1).toBe(0.5);
    expect(stats.retention.day7).toBeNull();
  });

  it('groups errors by message and source, most frequent first', () => {
    const stats = computeUsageStats(
      [],
      [
        { day: '2026-11-05', message: 'x', source: 'render', count: 2 },
        { day: '2026-11-06', message: 'x', source: 'render', count: 3 },
        { day: '2026-11-06', message: 'y', source: 'window', count: 1 },
        { day: '2026-01-01', message: 'old', source: 'window', count: 9 },
      ],
      '2026-11-06'
    );
    expect(stats.hasData).toBe(false);
    expect(stats.errors).toEqual([
      { message: 'x', source: 'render', count: 5, days: 2 },
      { message: 'y', source: 'window', count: 1, days: 1 },
    ]);
  });

  it('ignores malformed rows', () => {
    expect(readAnalyticsRows([{ fields: { uid: 1, day: 'x' } }, { fields: { uid: 'a', day: '2026-11-06', counts: { session_start: 'n' } } }])).toEqual([
      { uid: 'a', day: '2026-11-06', counts: { session_start: 0 } },
    ]);
  });
});
