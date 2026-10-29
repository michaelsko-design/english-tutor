/**
 * The owner dashboard's numbers: aggregates only, so nothing here can name a learner. The learner
 * list comes from `learners/{uid}` with a field mask (grade, dates, activity log).
 */

export const OWNER_STATS_DAYS = 14;
const AVERAGE_WINDOW_DAYS = 28;

export interface LearnerRow {
  id: string;
  fields: Record<string, unknown>;
}

export interface GradeStats {
  gradeId: string;
  users: number;
  proUsers: number;
  /** Missions per active user over the last 7 days */
  missionsPerActiveUser7d: number;
}

export interface DailyStats {
  dateStr: string;
  activeUsers: number;
  missions: number;
  activeMinutes: number;
}

export interface OwnerStats {
  generatedAt: string;
  totals: { registered: number; guests: number; pro: number; onboarded: number };
  active: { last1d: number; last7d: number; last30d: number };
  averages: {
    windowDays: number;
    /** Missions finished per user per active day */
    missionsPerActiveDay: number;
    /** Minutes of active use per user per active day; null until some time is tracked */
    minutesPerActiveDay: number | null;
    /** Share of active user-days that carry tracked time */
    trackedShare: number;
  };
  byGrade: GradeStats[];
  daily: DailyStats[];
}

interface LogDay {
  dateStr: string;
  sessions: number;
  activeSeconds: number;
}

export interface OwnerStatsInput {
  learners: LearnerRow[];
  anonymousUids: ReadonlySet<string>;
  proChildUids: ReadonlySet<string>;
  /** Today in the learners' calendar (Israel), YYYY-MM-DD */
  todayStr: string;
  now: Date;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const asNumber = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0);

export function addDaysToDateStr(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** Today's date in Israel, where the learners' days are counted. */
export function israelDateStr(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(now);
}

function readLog(value: unknown): LogDay[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): LogDay[] => {
    if (!entry || typeof entry !== 'object') return [];
    const { dateStr, sessions, activeSeconds } = entry as Record<string, unknown>;
    if (typeof dateStr !== 'string' || !DATE_RE.test(dateStr)) return [];
    return [{ dateStr, sessions: asNumber(sessions), activeSeconds: asNumber(activeSeconds) }];
  });
}

const round1 = (value: number): number => Math.round(value * 10) / 10;
const isActiveDay = (day: LogDay): boolean => day.sessions > 0 || day.activeSeconds > 0;

export function computeOwnerStats({ learners, anonymousUids, proChildUids, todayStr, now }: OwnerStatsInput): OwnerStats {
  const real = learners.filter((row) => !anonymousUids.has(row.id));
  const windowStart = addDaysToDateStr(todayStr, -(AVERAGE_WINDOW_DAYS - 1));
  const dailyStart = addDaysToDateStr(todayStr, -(OWNER_STATS_DAYS - 1));
  const cutoff = (days: number) => addDaysToDateStr(todayStr, -(days - 1));

  const dailyMap = new Map<string, { users: number; missions: number; seconds: number }>();
  for (let i = 0; i < OWNER_STATS_DAYS; i += 1) dailyMap.set(addDaysToDateStr(dailyStart, i), { users: 0, missions: 0, seconds: 0 });

  const active = { last1d: 0, last7d: 0, last30d: 0 };
  const gradeMap = new Map<string, { users: number; proUsers: number; activeUsers7d: number; missions7d: number }>();
  let userDays = 0;
  let missionTotal = 0;
  let trackedUserDays = 0;
  let trackedSeconds = 0;
  let onboarded = 0;
  let pro = 0;

  for (const row of real) {
    const gradeId = typeof row.fields.gradeId === 'string' ? row.fields.gradeId : 'unknown';
    const isPro = proChildUids.has(row.id);
    if (isPro) pro += 1;
    if (row.fields.isOnboarded === true) onboarded += 1;
    const grade = gradeMap.get(gradeId) ?? { users: 0, proUsers: 0, activeUsers7d: 0, missions7d: 0 };
    grade.users += 1;
    if (isPro) grade.proUsers += 1;

    const log = readLog(row.fields.activityLog).filter((day) => day.dateStr <= todayStr);
    const activeDays = log.filter(isActiveDay);
    const latest = activeDays.reduce((max, day) => (day.dateStr > max ? day.dateStr : max), '');
    if (latest >= cutoff(1)) active.last1d += 1;
    if (latest >= cutoff(7)) active.last7d += 1;
    if (latest >= cutoff(30)) active.last30d += 1;

    let missions7d = 0;
    for (const day of activeDays) {
      if (day.dateStr >= cutoff(7)) missions7d += day.sessions;
      const bucket = dailyMap.get(day.dateStr);
      if (bucket) {
        bucket.users += 1;
        bucket.missions += day.sessions;
        bucket.seconds += day.activeSeconds;
      }
      if (day.dateStr < windowStart) continue;
      userDays += 1;
      missionTotal += day.sessions;
      if (day.activeSeconds > 0) {
        trackedUserDays += 1;
        trackedSeconds += day.activeSeconds;
      }
    }
    if (latest >= cutoff(7)) {
      grade.activeUsers7d += 1;
      grade.missions7d += missions7d;
    }
    gradeMap.set(gradeId, grade);
  }

  const byGrade = [...gradeMap.entries()]
    .map(([gradeId, g]) => ({
      gradeId,
      users: g.users,
      proUsers: g.proUsers,
      missionsPerActiveUser7d: g.activeUsers7d ? round1(g.missions7d / g.activeUsers7d) : 0,
    }))
    .sort((a, b) => gradeOrder(a.gradeId) - gradeOrder(b.gradeId));

  const daily = [...dailyMap.entries()].map(([dateStr, d]) => ({
    dateStr,
    activeUsers: d.users,
    missions: d.missions,
    activeMinutes: Math.round(d.seconds / 60),
  }));

  return {
    generatedAt: now.toISOString(),
    totals: { registered: real.length, guests: learners.length - real.length, pro, onboarded },
    active,
    averages: {
      windowDays: AVERAGE_WINDOW_DAYS,
      missionsPerActiveDay: userDays ? round1(missionTotal / userDays) : 0,
      minutesPerActiveDay: trackedUserDays ? round1(trackedSeconds / 60 / trackedUserDays) : null,
      trackedShare: userDays ? Math.round((trackedUserDays / userDays) * 100) / 100 : 0,
    },
    byGrade,
    daily,
  };
}

function gradeOrder(gradeId: string): number {
  const match = /^grade-(\d+)$/.exec(gradeId);
  return match ? Number(match[1]) : 99;
}

/** Entitlement documents that still give Pro: active or past due, or canceled but paid until `periodEnd`. */
export function proChildUidsFrom(
  entitlements: ReadonlyArray<{ id: string; fields: Record<string, unknown> }>,
  nowMs: number
): Set<string> {
  const uids = new Set<string>();
  for (const { id, fields } of entitlements) {
    const { status, periodEnd } = fields;
    const isLive = typeof periodEnd === 'number' && periodEnd > nowMs;
    if (status === 'active' || status === 'past_due' || (status === 'canceled' && isLive)) uids.add(id);
  }
  return uids;
}
