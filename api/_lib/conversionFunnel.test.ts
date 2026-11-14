import { describe, expect, it } from 'vitest';
import { COHORT_WEEKS, computeConversionFunnel, weekStartOf, type ConversionInput } from './conversionFunnel';

const TODAY = '2026-12-20'; // a Sunday
const NOW = Date.parse('2026-12-20T10:00:00Z');
const DAY = 24 * 60 * 60 * 1000;
const at = (day: string): number => Date.parse(`${day}T10:00:00Z`);

const log = (...days: Array<[string, number]>) => days.map(([dateStr, sessions]) => ({ dateStr, sessions }));
const learner = (id: string, activityLog: unknown[] = [], gradeId = 'grade-4') => ({ id, fields: { gradeId, activityLog } });

function input(overrides: Partial<ConversionInput>): ConversionInput {
  return {
    learners: [],
    anonymousUids: new Set(),
    createdMsByUid: new Map(),
    signups: [],
    analytics: [],
    parentLinks: [],
    checkouts: [],
    subscriptions: [],
    entitlements: [],
    funnelDocs: [],
    todayStr: TODAY,
    nowMs: NOW,
    ...overrides,
  };
}

const all = (stats: ReturnType<typeof computeConversionFunnel>) => stats.segments[0];

describe('weekStartOf', () => {
  it('is the Sunday on or before the day', () => {
    expect(weekStartOf('2026-12-20')).toBe('2026-12-20');
    expect(weekStartOf('2026-12-26')).toBe('2026-12-20');
    expect(weekStartOf('2026-12-19')).toBe('2026-12-13');
  });
});

describe('computeConversionFunnel', () => {
  it('counts sign-ups without guests', () => {
    const stats = computeConversionFunnel(
      input({
        learners: [learner('a'), learner('guest')],
        anonymousUids: new Set(['guest']),
        createdMsByUid: new Map([['a', at('2026-12-15')], ['guest', at('2026-12-15')]]),
      })
    );
    expect(all(stats).totals.signedUp).toBe(1);
  });

  it('activates on 3 missions over 2 days, not on 3 missions in one day', () => {
    const stats = computeConversionFunnel(
      input({
        learners: [
          learner('two-days', log(['2026-12-15', 2], ['2026-12-16', 1])),
          learner('one-day', log(['2026-12-15', 5])),
          learner('too-few', log(['2026-12-15', 1], ['2026-12-16', 1])),
        ],
        createdMsByUid: new Map([['two-days', at('2026-12-15')], ['one-day', at('2026-12-15')], ['too-few', at('2026-12-15')]]),
      })
    );
    expect(all(stats).totals).toMatchObject({ signedUp: 3, activated: 1 });
  });

  it('walks one learner through every step', () => {
    const stats = computeConversionFunnel(
      input({
        learners: [learner('kid', log(['2026-11-02', 2], ['2026-11-03', 2], ['2026-12-01', 1])), learner('other')],
        createdMsByUid: new Map([['kid', at('2026-11-02')], ['other', at('2026-12-18')]]),
        analytics: [
          { uid: 'kid', day: '2026-11-10', counts: { pro_wall_view: 2 } },
          { uid: 'kid', day: '2026-11-08', counts: { pro_wall_view: 1, pro_ask_sent: 1 } },
        ],
        parentLinks: [{ parentUid: 'mum', childUid: 'kid' }],
        checkouts: [{ id: 'c1', fields: { parentUid: 'mum', childUids: ['kid'], status: 'paid' } }],
        entitlements: [{ id: 'kid', fields: { source: 'subscription', status: 'canceled' } }],
      })
    );
    expect(all(stats).totals).toEqual({
      signedUp: 2,
      activated: 1,
      reachedWall: 1,
      askSent: 1,
      parentLinked: 1,
      checkoutStarted: 1,
      paid: 1,
      day30Eligible: 1,
      activeDay30: 1,
      cancelled: 1,
    });
    expect(stats.wallByGrade).toEqual([{ gradeId: 'grade-4', learners: 1, medianDays: 6 }]);
  });

  it('does not count a comp grant or a pending checkout as paid', () => {
    const stats = computeConversionFunnel(
      input({
        learners: [learner('comp'), learner('pending')],
        createdMsByUid: new Map([['comp', at('2026-12-10')], ['pending', at('2026-12-10')]]),
        checkouts: [{ id: 'c1', fields: { parentUid: 'p', childUids: ['pending'], status: 'pending' } }],
        entitlements: [{ id: 'comp', fields: { source: 'comp', status: 'active' } }],
      })
    );
    expect(all(stats).totals).toMatchObject({ checkoutStarted: 1, paid: 0 });
  });

  it('splits by source tag and by sign-up week', () => {
    const stats = computeConversionFunnel(
      input({
        learners: [learner('a'), learner('b'), learner('c')],
        createdMsByUid: new Map([['a', at('2026-12-14')], ['b', at('2026-12-15')], ['c', at('2026-12-01')]]),
        signups: [
          { id: 'a', fields: { src: 'landing' } },
          { id: 'b', fields: { src: 'wa-family', campaign: 'dec-soft' } },
          { id: 'c', fields: { src: 'not-a-source' } },
        ],
      })
    );
    expect(stats.segments.map((s) => [s.src, s.totals.signedUp])).toEqual([['all', 3], ['direct', 1], ['landing', 1], ['wa-family', 1]]);
    const cohorts = all(stats).cohorts;
    expect(cohorts).toHaveLength(COHORT_WEEKS);
    expect(cohorts[cohorts.length - 1]).toMatchObject({ weekStart: '2026-12-20', signedUp: 0 });
    expect(cohorts[cohorts.length - 2]).toMatchObject({ weekStart: '2026-12-13', signedUp: 2 });
    expect(cohorts[cohorts.length - 4]).toMatchObject({ weekStart: '2026-11-29', signedUp: 1 });
  });

  it('dates an account with no Auth date by its first mission, and skips one with neither', () => {
    const stats = computeConversionFunnel(input({ learners: [learner('old', log(['2026-12-16', 1])), learner('nothing')] }));
    expect(all(stats).totals.signedUp).toBe(1);
    expect(all(stats).cohorts[COHORT_WEEKS - 2]).toMatchObject({ signedUp: 1 });
  });

  it('judges day 30 only for accounts old enough', () => {
    const stats = computeConversionFunnel(
      input({
        learners: [learner('back', log(['2026-11-30', 1])), learner('gone', log(['2026-11-02', 4])), learner('young', log(['2026-12-19', 1]))],
        createdMsByUid: new Map([['back', at('2026-11-01')], ['gone', at('2026-11-01')], ['young', at('2026-12-01')]]),
      })
    );
    expect(all(stats).totals).toMatchObject({ day30Eligible: 2, activeDay30: 1 });
  });

  it('sums the pre-account counters per source and the parent link opens', () => {
    const stats = computeConversionFunnel(
      input({
        funnelDocs: [
          { id: '2026-12-18', fields: { gate_view__landing: 5, signup_done__landing: 2, gate_view__wa_family: 3, parent_link_open: 4, parent_pro_link_open: 1 } },
          { id: '2026-12-19', fields: { gate_view__landing: 1, parent_link_open: 2 } },
        ],
      })
    );
    expect(stats.visitsBySource).toEqual([
      { src: 'landing', gate_view: 6, signup_done: 2 },
      { src: 'wa-family', gate_view: 3, signup_done: 0 },
    ]);
    expect(stats.parentLinkOpens).toEqual({ all: 6, pro: 1 });
  });

  it('feeds the gates: the wall window and the cancel rate', () => {
    const kids = Array.from({ length: 20 }, (_, i) => `k${i}`);
    const stats = computeConversionFunnel(
      input({
        learners: kids.map((id) => learner(id, log(['2026-11-02', 2], ['2026-11-03', 1]))),
        createdMsByUid: new Map(kids.map((id) => [id, at('2026-11-02')])),
        // 10 reached the wall in time, 2 too late
        analytics: [
          ...kids.slice(0, 10).map((uid) => ({ uid, day: '2026-11-10', counts: { pro_wall_view: 1 } })),
          ...kids.slice(10, 12).map((uid) => ({ uid, day: '2026-12-01', counts: { pro_wall_view: 1 } })),
        ],
        subscriptions: [
          ...Array.from({ length: 17 }, (_, i) => ({ id: `s${i}`, fields: { status: 'active', createdAt: NOW - 90 * DAY, periodEnd: NOW + 5 * DAY } })),
          ...Array.from({ length: 3 }, (_, i) => ({ id: `x${i}`, fields: { status: 'canceled', createdAt: NOW - 90 * DAY, periodEnd: NOW - 5 * DAY } })),
          { id: 'long-gone', fields: { status: 'expired', createdAt: NOW - 200 * DAY, periodEnd: NOW - 100 * DAY } },
          { id: 'new', fields: { status: 'canceled', createdAt: NOW - 10 * DAY, periodEnd: NOW + 20 * DAY } },
        ],
      })
    );
    const gate = (id: string) => stats.gates.find((g) => g.id === id);
    expect(gate('activation')).toMatchObject({ status: 'green', value: 1, sample: 20 });
    expect(gate('wall')).toMatchObject({ status: 'green', numerator: 10, sample: 20 });
    expect(gate('monthlyCancel')).toMatchObject({ status: 'amber', numerator: 3, sample: 20 });
    expect(gate('askToPaid')).toMatchObject({ status: 'no-data' });
  });
});
