import { describe, expect, it } from 'vitest';
import { readFunnelRows, computeUsageStats, readAllowedRows, readAnalyticsRows, readFeedbackRows, readMissionStruggleRows } from './usageStats.js';

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
    expect(stats.funnel).toEqual({ sessions: 2, onboardingViewed: 0, onboarded: 1, greeted: 0, firstLesson: 0, toured: 0, tourSkipped: 0, reminderOn: 0, welcomeBack: 0, weekOne: 0, placed: 0, firstMission: 1, threeStars: 1 });
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
      { message: 'x', source: 'render', count: 5, days: 2, devices: [] },
      { message: 'y', source: 'window', count: 1, days: 1, devices: [] },
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
      { label: 'noa', cohort: 'tester', daysActive: 2, lastSeen: '2026-11-06', sessions: 2, missions: 1, missionAbandons: 2, hintsUsed: 4, ttsErrors: 1, devices: [] },
      { label: 'dana', cohort: 'tester', daysActive: 0, lastSeen: null, sessions: 0, missions: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0, devices: [] },
    ]);
  });

  it('lists each tester\'s devices (latest first) and counts learners per device', () => {
    const stats = computeUsageStats(
      [
        { ...row('a', '2026-11-05', { session_start: 1 }), device: 'ios-safari-phone' },
        { ...row('a', '2026-11-06', { session_start: 1 }), device: 'windows-chrome-desktop' },
        { ...row('b', '2026-11-06', { session_start: 1 }), device: 'ios-safari-phone' },
        row('c', '2026-11-06', { session_start: 1 }),
      ],
      [],
      '2026-11-06',
      readAllowedRows([{ id: 'a', fields: { label: 'noa', cohort: 'tester' } }])
    );
    expect(stats.testers[0].devices).toEqual(['windows-chrome-desktop', 'ios-safari-phone']);
    expect(stats.devices).toEqual([
      { device: 'ios-safari-phone', learners: 2 },
      { device: 'windows-chrome-desktop', learners: 1 },
    ]);
  });

  it('only accepts device buckets of the expected shape', () => {
    const rows = readAnalyticsRows([
      { fields: { uid: 'a', day: '2026-11-06', counts: {}, device: 'Mozilla/5.0 (iPhone)' } },
      { fields: { uid: 'b', day: '2026-11-06', counts: {}, device: 'android-chrome-phone-pwa' } },
    ]);
    expect(rows.map((r) => r.device)).toEqual([undefined, 'android-chrome-phone-pwa']);
  });

  it('shows the devices an error came from, most affected first', () => {
    const stats = computeUsageStats(
      [row('a', '2026-11-06', { session_start: 1 })],
      [
        { day: '2026-11-06', message: 'chunk', source: 'render', count: 1, device: 'ios-safari-phone' },
        { day: '2026-11-06', message: 'chunk', source: 'render', count: 3, device: 'ios-safari-tablet' },
        { day: '2026-11-06', message: 'old', source: 'window', count: 1 },
      ],
      '2026-11-06'
    );
    expect(stats.errors.find((e) => e.message === 'chunk')?.devices).toEqual(['ios-safari-tablet', 'ios-safari-phone']);
    expect(stats.errors.find((e) => e.message === 'old')?.devices).toEqual([]);
  });

  it('ranks missions by how often they were left unfinished, with the tier split', () => {
    const missions = readMissionStruggleRows([
      { fields: { uid: 'a', day: '2026-11-06', missionId: 'g3-u1-m1', tier: 'challenger', starts: 2, abandons: 2 } },
      { fields: { uid: 'b', day: '2026-11-06', missionId: 'g3-u1-m1', tier: 'explorer', starts: 1, abandons: 1 } },
      { fields: { uid: 'a', day: '2026-11-06', missionId: 'g3-u1-m2', tier: 'explorer', starts: 3, abandons: 0 } },
      { fields: { uid: 'a', day: '2026-11-06', missionId: 'g3-u2-m1', tier: 'master', starts: 1, abandons: 1 } },
      { fields: { uid: 'a', day: '2026-10-01', missionId: 'old-one', tier: 'master', starts: 9, abandons: 9 } },
      { fields: { uid: 'a', day: '2026-11-06', missionId: 'bad id!', tier: 'master', starts: 1, abandons: 1 } },
      { fields: { uid: 'a', day: '2026-11-06', missionId: 'g3-u3-m1', tier: 'wizard', starts: 1, abandons: 1 } },
    ]);
    const stats = computeUsageStats([row('a', '2026-11-06', { session_start: 1 })], [], '2026-11-06', [], [], missions);
    expect(stats.stuckMissions).toEqual([
      { missionId: 'g3-u1-m1', starts: 3, abandons: 3, learners: 2, tiers: { explorer: 1, challenger: 2, master: 0 } },
      { missionId: 'g3-u2-m1', starts: 1, abandons: 1, learners: 1, tiers: { explorer: 0, challenger: 0, master: 1 } },
    ]);
  });

  it('names a note by the live tester, or by the alias saved with a note whose account was deleted', () => {
    const allowed = readAllowedRows([{ id: 'a', fields: { label: 'noa', cohort: 't' } }]);
    const notes = readFeedbackRows(
      [
        { fields: { uid: 'a', day: '2026-11-06', text: 'live', kind: 'idea' } },
        { fields: { uid: '', testerLabel: 'dana', day: '2026-11-05', text: 'kept', kind: 'problem' } },
        { fields: { uid: '', day: '2026-11-04', text: 'orphan' } },
      ],
      allowed
    );
    expect(notes.map((n) => n.tester)).toEqual(['noa', 'dana (account deleted)', 'unknown']);
  });
});

describe('sign-up steps before an account exists', () => {
  it('sums the window per step in funnel order, ignoring days outside it and other documents', () => {
    const rows = readFunnelRows([
      { id: '2026-11-06', fields: { gate_view: 10, signup_started: 6, signup_done: 3 } },
      { id: '2026-11-05', fields: { gate_view: 5, signup_done: 1, signup_error: 2 } },
      { id: '2026-01-01', fields: { gate_view: 99 } },
      { id: 'not-a-day', fields: { gate_view: 99 } },
    ]);
    const { preAuth } = computeUsageStats([], [], '2026-11-06', [], [], [], rows);
    expect(preAuth.map(({ event }) => event)).toEqual([
      'gate_view', 'signup_started', 'signup_basics_done', 'consent_ticked', 'signup_done', 'signup_name_taken', 'signup_error',
    ]);
    expect(Object.fromEntries(preAuth.map(({ event, count }) => [event, count]))).toMatchObject({
      gate_view: 15, signup_started: 6, signup_done: 4, signup_error: 2, consent_ticked: 0,
    });
  });
});
