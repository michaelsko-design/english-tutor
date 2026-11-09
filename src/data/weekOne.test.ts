import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import { getWeekOneSummary, markWeekOneSeen } from './weekOne';
import type { ActivityLogEntry } from '../types/learner';

const entry = (dateStr: string, sessions: number, starsGained: number): ActivityLogEntry => ({
  dateStr, sessions, voiceWords: 0, threeStarSessions: 0, xpEarned: 0, starsGained, missionStars: {}, firstCompletedIds: [],
});

// Joined at a local noon, so the local calendar day is the same in every time zone
const JOINED = '2026-11-01T12:00:00';
const profile = (overrides = {}) =>
  makeProfile({
    createdAt: JOINED,
    activityLog: [entry('2026-11-01', 1, 3), entry('2026-11-03', 2, 5), entry('2026-11-05', 0, 0), entry('2026-11-09', 4, 9)],
    ...overrides,
  });

describe('getWeekOneSummary', () => {
  it('sums the first seven days (day 1 to day 7), not the days after', () => {
    expect(getWeekOneSummary(profile(), '2026-11-08')).toMatchObject({ activeDays: 2, missions: 3, stars: 8 });
  });

  it('waits until day 7', () => {
    expect(getWeekOneSummary(profile(), '2026-11-07')).toBeNull();
  });

  it('is no longer offered after day 13, so a learner who joined long ago never sees it', () => {
    expect(getWeekOneSummary(profile(), '2026-11-14')).not.toBeNull();
    expect(getWeekOneSummary(profile(), '2026-11-15')).toBeNull();
  });

  it('is shown once', () => {
    expect(getWeekOneSummary(markWeekOneSeen(profile()), '2026-11-08')).toBeNull();
  });

  it('has nothing to say about a week with no activity', () => {
    expect(getWeekOneSummary(profile({ activityLog: [entry('2026-11-05', 0, 0)] }), '2026-11-08')).toBeNull();
    expect(getWeekOneSummary(profile({ activityLog: undefined }), '2026-11-08')).toBeNull();
  });
});
