import { describe, expect, it } from 'vitest';
import { computeOwnerStats, proChildUidsFrom, type LearnerRow } from './ownerStats';

const NOW = new Date('2026-10-29T10:00:00Z');
const TODAY = '2026-10-29';

const learner = (id: string, gradeId: string, log: Array<[string, number, number?]>, isOnboarded = true): LearnerRow => ({
  id,
  fields: {
    gradeId,
    isOnboarded,
    activityLog: log.map(([dateStr, sessions, activeSeconds]) => ({ dateStr, sessions, ...(activeSeconds ? { activeSeconds } : {}) })),
  },
});

const stats = (learners: LearnerRow[], anonymous: string[] = [], pro: string[] = []) =>
  computeOwnerStats({ learners, anonymousUids: new Set(anonymous), proChildUids: new Set(pro), todayStr: TODAY, now: NOW });

describe('computeOwnerStats', () => {
  it('counts registered users apart from guests and counts Pro', () => {
    const result = stats([learner('a', 'grade-3', []), learner('b', 'grade-3', []), learner('g', 'grade-3', [])], ['g'], ['a']);
    expect(result.totals).toMatchObject({ registered: 2, guests: 1, pro: 1 });
  });

  it('groups by grade in grade order', () => {
    const result = stats([learner('a', 'grade-10', []), learner('b', 'grade-2', []), learner('c', 'grade-2', [])], [], ['b']);
    expect(result.byGrade.map((g) => [g.gradeId, g.users, g.proUsers])).toEqual([
      ['grade-2', 2, 1],
      ['grade-10', 1, 0],
    ]);
  });

  it('counts active users in 1, 7 and 30 day windows', () => {
    const result = stats([
      learner('a', 'grade-1', [[TODAY, 2]]),
      learner('b', 'grade-1', [['2026-10-25', 1]]),
      learner('c', 'grade-1', [['2026-10-05', 1]]),
      learner('d', 'grade-1', [['2026-08-01', 1]]),
    ]);
    expect(result.active).toEqual({ last1d: 1, last7d: 2, last30d: 3 });
  });

  it('averages missions and minutes per active day, with time only where tracked', () => {
    const result = stats([learner('a', 'grade-1', [[TODAY, 4, 600], ['2026-10-28', 2]])]);
    expect(result.averages.missionsPerActiveDay).toBe(3);
    expect(result.averages.minutesPerActiveDay).toBe(10);
    expect(result.averages.trackedShare).toBe(0.5);
  });

  it('reports no minutes until some time is tracked', () => {
    expect(stats([learner('a', 'grade-1', [[TODAY, 1]])]).averages.minutesPerActiveDay).toBeNull();
  });

  it('builds a daily series ending today and ignores future or malformed days', () => {
    const result = stats([learner('a', 'grade-1', [[TODAY, 3, 120], ['2026-11-30', 9], ['bad', 5]])]);
    expect(result.daily).toHaveLength(14);
    expect(result.daily[13]).toEqual({ dateStr: TODAY, activeUsers: 1, missions: 3, activeMinutes: 2 });
  });

  it('averages linked kids per parent account', () => {
    const result = computeOwnerStats({
      learners: [],
      anonymousUids: new Set(),
      proChildUids: new Set(),
      todayStr: TODAY,
      now: NOW,
      parentLinks: [
        { parentUid: 'p1', childUid: 'a' },
        { parentUid: 'p1', childUid: 'b' },
        { parentUid: 'p1', childUid: 'b' },
        { parentUid: 'p2', childUid: 'c' },
      ],
    });
    expect(result.parents).toEqual({ withChildren: 2, links: 3, avgKidsPerParent: 1.5 });
    expect(stats([]).parents).toEqual({ withChildren: 0, links: 0, avgKidsPerParent: 0 });
  });

  it('counts a reminder as working when the learner finished a mission the same day', () => {
    const result = computeOwnerStats({
      learners: [learner('a', 'grade-1', [[TODAY, 2]]), learner('b', 'grade-1', [['2026-10-27', 1]])],
      anonymousUids: new Set(),
      proChildUids: new Set(),
      todayStr: TODAY,
      now: NOW,
      reminderSubscribers: 3,
      reminderSends: [
        { uid: 'a', dateStr: TODAY, kind: 'streak' },
        { uid: 'b', dateStr: TODAY, kind: 'comeback' },
        { uid: 'b', dateStr: '2026-10-27', kind: 'comeback' },
        { uid: 'a', dateStr: '2026-01-01', kind: 'streak' },
      ],
    });
    expect(result.reminders).toMatchObject({
      subscribers: 3,
      sent: 3,
      practised: 2,
      conversionRate: 0.67,
      byKind: { streak: { sent: 1, practised: 1 }, comeback: { sent: 2, practised: 1 } },
    });
    expect(result.reminders.daily[13]).toEqual({ dateStr: TODAY, sent: 2, practised: 1 });
    expect(stats([]).reminders.conversionRate).toBeNull();
  });

  it('exposes no learner ids', () => {
    expect(JSON.stringify(stats([learner('secret-uid', 'grade-1', [[TODAY, 1]])]))).not.toContain('secret-uid');
  });
});

describe('proChildUidsFrom', () => {
  const now = Date.UTC(2026, 9, 29);
  const docs = [
    { id: 'a', fields: { status: 'active', periodEnd: now + 1 } },
    { id: 'b', fields: { status: 'past_due', periodEnd: now - 1 } },
    { id: 'c', fields: { status: 'canceled', periodEnd: now + 1000 } },
    { id: 'd', fields: { status: 'canceled', periodEnd: now - 1000 } },
    { id: 'e', fields: { status: 'expired', periodEnd: now + 1000 } },
  ];

  it('keeps live plans and canceled ones still paid for', () => {
    expect([...proChildUidsFrom(docs, now)].sort()).toEqual(['a', 'b', 'c']);
  });
});
