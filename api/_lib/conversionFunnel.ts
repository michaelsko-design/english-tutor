/**
 * The conversion funnel behind the owner dashboard's Funnel tab: for every signed-up learner, how far
 * they got (activated, first Pro wall, ask sent, parent linked, checkout, paid, active at day 30,
 * cancelled), summed per sign-up week and per source tag. Aggregates only; nothing here names a learner.
 * The paid steps are read from the provider-neutral billing collections, so they work with any gateway.
 */
import { addDaysToDateStr, israelDateStr, type LearnerRow, type ParentLinkRow } from './ownerStats.js';
import type { AnalyticsDayRow } from './usageStats.js';
import { DIRECT_SOURCE, MARKETING_SOURCES, isMarketingSource, type MarketingSource } from '../../src/config/marketingSources.js';
import { FUNNEL_SOURCE_EVENTS, funnelSourceKey, type FunnelSourceEvent } from '../../src/services/analytics/events.js';
import {
  CANCEL_MIN_AGE_DAYS,
  CANCEL_WINDOW_DAYS,
  WALL_WINDOW_DAYS,
  evaluateGates,
  type GateCounts,
  type GateResult,
} from '../../src/data/successGates.js';

/** Activated: this many missions… */
export const ACTIVATION_MISSIONS = 3;
/** …on at least this many different days */
export const ACTIVATION_DAYS = 2;
/** "Active at day 30": any activity on one of these days after sign-up */
export const DAY30_WINDOW_START = 28;
export const DAY30_WINDOW_END = 34;
export const COHORT_WEEKS = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const WALL_EVENT = 'pro_wall_view';
const ASK_EVENT = 'pro_ask_sent';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type DocRow = { id: string; fields: Record<string, unknown> };

export interface StepCounts {
  signedUp: number;
  activated: number;
  reachedWall: number;
  askSent: number;
  parentLinked: number;
  checkoutStarted: number;
  paid: number;
  /** Learners who signed up long enough ago to be judged on day 30 */
  day30Eligible: number;
  activeDay30: number;
  cancelled: number;
}

export interface CohortRow extends StepCounts {
  /** The Sunday that starts the sign-up week, YYYY-MM-DD */
  weekStart: string;
}

export interface FunnelSegment {
  /** `all`, or one source tag */
  src: 'all' | MarketingSource;
  totals: StepCounts;
  cohorts: CohortRow[];
}

export interface WallByGrade {
  gradeId: string;
  learners: number;
  /** Median days from sign-up to the first wall */
  medianDays: number;
}

export interface ConversionStats {
  segments: FunnelSegment[];
  wallByGrade: WallByGrade[];
  /** Page loads before an account exists, per source tag (visits, not people) */
  visitsBySource: Array<{ src: MarketingSource } & Record<FunnelSourceEvent, number>>;
  /** Parent links opened (page loads): all of them, and the ones that came from a Pro ask */
  parentLinkOpens: { all: number; pro: number };
  gates: GateResult[];
}

export interface ConversionInput {
  /** Real learners only (test accounts already removed) */
  learners: readonly LearnerRow[];
  anonymousUids: ReadonlySet<string>;
  /** When each Auth account was created, in ms */
  createdMsByUid: ReadonlyMap<string, number>;
  signups: readonly DocRow[];
  analytics: readonly AnalyticsDayRow[];
  parentLinks: readonly ParentLinkRow[];
  checkouts: readonly DocRow[];
  subscriptions: readonly DocRow[];
  entitlements: readonly DocRow[];
  funnelDocs: readonly DocRow[];
  todayStr: string;
  nowMs: number;
}

interface LearnerFunnel {
  src: MarketingSource;
  gradeId: string;
  signupDay: string;
  isActivated: boolean;
  wallDay: string | null;
  hasAsked: boolean;
  hasParent: boolean;
  hasCheckout: boolean;
  isPaid: boolean;
  isDay30Eligible: boolean;
  isActiveDay30: boolean;
  isCancelled: boolean;
}

const EMPTY_COUNTS: StepCounts = {
  signedUp: 0,
  activated: 0,
  reachedWall: 0,
  askSent: 0,
  parentLinked: 0,
  checkoutStarted: 0,
  paid: 0,
  day30Eligible: 0,
  activeDay30: 0,
  cancelled: 0,
};

const num = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0);
const strings = (value: unknown): string[] => (Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []);
const daysBetween = (from: string, to: string): number => Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);

/** The Sunday on or before this day (weeks start on Sunday in Israel). */
export function weekStartOf(dateStr: string): string {
  return addDaysToDateStr(dateStr, -new Date(`${dateStr}T00:00:00Z`).getUTCDay());
}

/** The days with at least one mission, oldest first. */
function missionDays(activityLog: unknown): Array<{ dateStr: string; sessions: number }> {
  if (!Array.isArray(activityLog)) return [];
  return activityLog
    .flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const { dateStr, sessions } = entry as Record<string, unknown>;
      return typeof dateStr === 'string' && DATE_RE.test(dateStr) && num(sessions) > 0 ? [{ dateStr, sessions: num(sessions) }] : [];
    })
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
}

function isActivated(days: ReadonlyArray<{ sessions: number }>): boolean {
  const missions = days.reduce((sum, day) => sum + day.sessions, 0);
  return days.length >= ACTIVATION_DAYS && missions >= ACTIVATION_MISSIONS;
}

/** The first day each learner fired this counter. */
function firstDayByUid(analytics: readonly AnalyticsDayRow[], event: string): Map<string, string> {
  const first = new Map<string, string>();
  for (const row of analytics) {
    if (!(row.counts[event] > 0)) continue;
    const known = first.get(row.uid);
    if (!known || row.day < known) first.set(row.uid, row.day);
  }
  return first;
}

function add(counts: StepCounts, learner: LearnerFunnel): StepCounts {
  const plus = (flag: boolean): number => (flag ? 1 : 0);
  return {
    signedUp: counts.signedUp + 1,
    activated: counts.activated + plus(learner.isActivated),
    reachedWall: counts.reachedWall + plus(learner.wallDay !== null),
    askSent: counts.askSent + plus(learner.hasAsked),
    parentLinked: counts.parentLinked + plus(learner.hasParent),
    checkoutStarted: counts.checkoutStarted + plus(learner.hasCheckout),
    paid: counts.paid + plus(learner.isPaid),
    day30Eligible: counts.day30Eligible + plus(learner.isDay30Eligible),
    activeDay30: counts.activeDay30 + plus(learner.isActiveDay30),
    cancelled: counts.cancelled + plus(learner.isCancelled),
  };
}

function segmentOf(src: FunnelSegment['src'], learners: readonly LearnerFunnel[], weekStarts: readonly string[]): FunnelSegment {
  const byWeek = new Map<string, StepCounts>(weekStarts.map((week) => [week, EMPTY_COUNTS]));
  let totals = EMPTY_COUNTS;
  for (const learner of learners) {
    totals = add(totals, learner);
    const week = weekStartOf(learner.signupDay);
    const known = byWeek.get(week);
    if (known) byWeek.set(week, add(known, learner));
  }
  return { src, totals, cohorts: weekStarts.map((weekStart) => ({ weekStart, ...(byWeek.get(weekStart) ?? EMPTY_COUNTS) })) };
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function wallByGradeOf(learners: readonly LearnerFunnel[]): WallByGrade[] {
  const daysByGrade = new Map<string, number[]>();
  for (const { gradeId, wallDay, signupDay } of learners) {
    if (wallDay === null) continue;
    daysByGrade.set(gradeId, [...(daysByGrade.get(gradeId) ?? []), Math.max(0, daysBetween(signupDay, wallDay))]);
  }
  return [...daysByGrade.entries()]
    .map(([gradeId, days]) => ({ gradeId, learners: days.length, medianDays: median(days) }))
    .sort((a, b) => a.gradeId.localeCompare(b.gradeId, 'en', { numeric: true }));
}

/** Paid plans old enough to judge, and how many of them were cancelled lately. A cancelled plan has no
 * cancel date, so "lately" means its paid period ended within the window or is still running. */
function cancelCounts(subscriptions: readonly DocRow[], nowMs: number): Pick<GateCounts, 'cancelBase' | 'cancelledRecently'> {
  const old = subscriptions.filter(({ fields }) => num(fields.createdAt) > 0 && num(fields.createdAt) <= nowMs - CANCEL_MIN_AGE_DAYS * DAY_MS);
  const isRecentCancel = ({ fields }: DocRow): boolean =>
    (fields.status === 'canceled' || fields.status === 'expired') && num(fields.periodEnd) >= nowMs - CANCEL_WINDOW_DAYS * DAY_MS;
  const base = old.filter((sub) => sub.fields.status === 'active' || sub.fields.status === 'past_due' || isRecentCancel(sub));
  return { cancelBase: base.length, cancelledRecently: base.filter(isRecentCancel).length };
}

function visitsBySourceOf(funnelDocs: readonly DocRow[]): ConversionStats['visitsBySource'] {
  return MARKETING_SOURCES.map((src) => {
    const sums = Object.fromEntries(
      FUNNEL_SOURCE_EVENTS.map((event) => [event, funnelDocs.reduce((sum, doc) => sum + num(doc.fields[funnelSourceKey(event, src)]), 0)])
    ) as Record<FunnelSourceEvent, number>;
    return { src, ...sums };
  }).filter((row) => FUNNEL_SOURCE_EVENTS.some((event) => row[event] > 0));
}

export function computeConversionFunnel(input: ConversionInput): ConversionStats {
  const { todayStr, nowMs } = input;
  const srcByUid = new Map(input.signups.map(({ id, fields }) => [id, isMarketingSource(fields.src) ? fields.src : DIRECT_SOURCE]));
  const wallDays = firstDayByUid(input.analytics, WALL_EVENT);
  const askDays = firstDayByUid(input.analytics, ASK_EVENT);
  const linkedKids = new Set(input.parentLinks.map((link) => link.childUid));
  const checkoutKids = new Set(input.checkouts.flatMap(({ fields }) => strings(fields.childUids)));
  const paidKids = new Set([
    ...input.checkouts.filter(({ fields }) => fields.status === 'paid').flatMap(({ fields }) => strings(fields.childUids)),
    ...input.entitlements.filter(({ fields }) => fields.source === 'subscription').map(({ id }) => id),
  ]);
  const cancelledKids = new Set(
    input.entitlements
      .filter(({ fields }) => fields.source === 'subscription' && (fields.status === 'canceled' || fields.status === 'expired'))
      .map(({ id }) => id)
  );

  const learners = input.learners.flatMap(({ id, fields }): LearnerFunnel[] => {
    if (input.anonymousUids.has(id)) return [];
    const days = missionDays(fields.activityLog);
    const createdMs = input.createdMsByUid.get(id);
    // An account the Auth lookup did not return a date for is dated by its first mission
    const signupDay = createdMs ? israelDateStr(new Date(createdMs)) : days[0]?.dateStr;
    if (!signupDay) return [];
    const day30Start = addDaysToDateStr(signupDay, DAY30_WINDOW_START);
    const day30End = addDaysToDateStr(signupDay, DAY30_WINDOW_END);
    const isDay30Eligible = day30End <= todayStr;
    return [
      {
        src: srcByUid.get(id) ?? DIRECT_SOURCE,
        gradeId: typeof fields.gradeId === 'string' ? fields.gradeId : 'unknown',
        signupDay,
        isActivated: isActivated(days),
        wallDay: wallDays.get(id) ?? null,
        hasAsked: askDays.has(id),
        hasParent: linkedKids.has(id),
        hasCheckout: checkoutKids.has(id),
        isPaid: paidKids.has(id),
        isDay30Eligible,
        isActiveDay30: isDay30Eligible && days.some((day) => day.dateStr >= day30Start && day.dateStr <= day30End),
        isCancelled: cancelledKids.has(id),
      },
    ];
  });

  const thisWeek = weekStartOf(todayStr);
  const weekStarts = Array.from({ length: COHORT_WEEKS }, (_, i) => addDaysToDateStr(thisWeek, -DAYS_IN_WEEK * (COHORT_WEEKS - 1 - i)));
  const usedSources = MARKETING_SOURCES.filter((src) => learners.some((learner) => learner.src === src));
  const segments = [
    segmentOf('all', learners, weekStarts),
    ...usedSources.map((src) => segmentOf(src, learners.filter((learner) => learner.src === src), weekStarts)),
  ];

  const wallCutoff = addDaysToDateStr(todayStr, -WALL_WINDOW_DAYS);
  const mature = learners.filter((learner) => learner.isActivated && learner.signupDay <= wallCutoff);
  const totals = segments[0].totals;
  const gateCounts: GateCounts = {
    signedUp: totals.signedUp,
    activated: totals.activated,
    activatedMature: mature.length,
    wallInWindow: mature.filter((l) => l.wallDay !== null && daysBetween(l.signupDay, l.wallDay) <= WALL_WINDOW_DAYS).length,
    reachedWall: totals.reachedWall,
    askSent: totals.askSent,
    paidAfterAsk: learners.filter((l) => l.hasAsked && l.isPaid).length,
    paidActivated: learners.filter((l) => l.isActivated && l.isPaid).length,
    ...cancelCounts(input.subscriptions, nowMs),
  };

  const sumField = (field: string): number => input.funnelDocs.reduce((sum, doc) => sum + num(doc.fields[field]), 0);
  return {
    segments,
    wallByGrade: wallByGradeOf(learners),
    visitsBySource: visitsBySourceOf(input.funnelDocs),
    parentLinkOpens: { all: sumField('parent_link_open'), pro: sumField('parent_pro_link_open') },
    gates: evaluateGates(gateCounts),
  };
}
