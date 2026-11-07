import { describe, expect, it } from 'vitest';
import { computeUsageStats, readAllowedRows, readAnalyticsRows } from './usageStats.js';

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

  it('sums struggle counters and builds one row per invited tester, silent ones included', () => {
    const stats = computeUsageStats(
      [
        row('a', '2026-11-05', { session_start: 1, mission_start: 3, mission_abandon: 2, hint_used: 4, mission_finish: 1 }),
        row('a', '2026-11-06', { session_start: 1, tts_error: 1 }),
        row('x', '2026-11-06', { session_start: 1, mission_start: 1 }),
      ],
      [],
      '2026-11-06',
      readAllowedRows([
        { id: 'a', fields: { label: 'noa', cohort: 'tester' } },
        { id: 'b', fields: { label: 'dana', cohort: 'tester' } },
      ])
    );
    expect(stats.struggle).toEqual({ missionStarts: 4, missionAbandons: 2, hintsUsed: 4, ttsErrors: 1 });
    expect(stats.testers).toEqual([
      { label: 'noa', cohort: 'tester', daysActive: 2, lastSeen: '2026-11-06', sessions: 2, missions: 1, missionAbandons: 2, hintsUsed: 4, ttsErrors: 1 },
      { label: 'dana', cohort: 'tester', daysActive: 0, lastSeen: null, sessions: 0, missions: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0 },
    ]);
  });
});
