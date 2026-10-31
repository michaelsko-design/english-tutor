import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  Users,
  Crown,
  Activity,
  Clock,
  Flame,
  Bell,
  RefreshCw,
  LogOut,
  TrendingUp,
  UserCheck,
  Award,
  Calendar,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { auth, googleProvider } from '../../services/firebase';
import { fetchOwnerStats, type OwnerStats } from '../../services/ownerStatsService';

type Load =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; stats: OwnerStats };

const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Returns day info, short date, and whether the day is Friday or Saturday (Israel weekend/Shabbat) */
function getDayInfo(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const dayIndex = d.getUTCDay();
  const weekday = WEEKDAYS[dayIndex];
  const isWeekend = dayIndex === 5 || dayIndex === 6;
  return { weekday, isWeekend, shortDate: dateStr.slice(5) };
}

function percent(share: number | null): string {
  return share === null ? '–' : `${Math.round(share * 100)}%`;
}

function gradeLabel(gradeId: string): string {
  return gradeId.replace('grade-', 'Grade ');
}

// ---------------------------------------------------------------------------
// 1. KPI Cards
// ---------------------------------------------------------------------------

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: { text: string; tone?: 'positive' | 'neutral' | 'accent' };
  breakdown?: React.ReactNode;
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  accentColor,
  badge,
  breakdown,
  subtitle,
}) => {
  const toneClasses = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  }[badge?.tone ?? 'neutral'];

  return (
    <div className={CARD_CLASS}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${accentColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {value}
        </span>
        {badge && (
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${toneClasses}`}>
            {badge.text}
          </span>
        )}
      </div>
      {breakdown && <div className="mt-3">{breakdown}</div>}
      {subtitle && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. 14-Day Dual-Metric Activity Chart (SVG + Tailwind)
// ---------------------------------------------------------------------------

const ActivityTrendChart: React.FC<{ daily: OwnerStats['daily'] }> = ({ daily }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Default to the latest day if no hover
  const activeDay = hoveredIdx !== null ? daily[hoveredIdx] : daily[daily.length - 1];
  const activeDayInfo = activeDay ? getDayInfo(activeDay.dateStr) : null;

  const maxMissions = useMemo(() => Math.max(1, ...daily.map((d) => d.missions)), [daily]);
  const maxUsers = useMemo(() => Math.max(1, ...daily.map((d) => d.activeUsers)), [daily]);

  const total14dMissions = useMemo(() => daily.reduce((sum, d) => sum + d.missions, 0), [daily]);
  const avg14dMissions = daily.length ? Math.round(total14dMissions / daily.length) : 0;
  const peakDay = useMemo(() => {
    return daily.reduce((peak, cur) => (cur.missions > peak.missions ? cur : peak), daily[0] ?? { missions: 0 });
  }, [daily]);

  return (
    <section className={CARD_CLASS}>
      {/* Chart Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Daily Learning Activity</h2>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
              Last 14 Days
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Completed missions and active learners · Israel timezone
          </p>
        </div>

        {/* Dynamic Day Inspection Pill */}
        {activeDay && activeDayInfo && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-800/80">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {activeDayInfo.weekday} {activeDayInfo.shortDate}
                {activeDayInfo.isWeekend && ' (Weekend)'}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2 font-bold tabular-nums">
              <span className="text-indigo-600 dark:text-indigo-400">{activeDay.missions} missions</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-600 dark:text-emerald-400">{activeDay.activeUsers} users</span>
              {activeDay.activeMinutes > 0 && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-amber-600 dark:text-amber-400">{activeDay.activeMinutes}m</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mini Stats Banner */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs dark:bg-slate-800/50">
        <div>
          <span className="text-slate-500 dark:text-slate-400">14-Day Missions:</span>{' '}
          <strong className="text-slate-900 dark:text-white tabular-nums">{total14dMissions.toLocaleString()}</strong>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Daily Average:</span>{' '}
          <strong className="text-slate-900 dark:text-white tabular-nums">{avg14dMissions} / day</strong>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Peak Day:</span>{' '}
          <strong className="text-slate-900 dark:text-white tabular-nums">{peakDay?.missions ?? 0} missions</strong>
        </div>
      </div>

      {/* Dual Bar + Line Chart */}
      <div className="mt-6">
        <div className="relative flex h-48 items-end gap-1.5 sm:gap-2">
          {daily.map((day, idx) => {
            const { weekday, isWeekend, shortDate } = getDayInfo(day.dateStr);
            const missionHeightPercent = Math.max(4, Math.round((day.missions / maxMissions) * 100));
            const userHeightPercent = Math.max(4, Math.round((day.activeUsers / maxUsers) * 100));
            const isHovered = hoveredIdx === idx;
            const isLatest = idx === daily.length - 1 && hoveredIdx === null;
            const isSelected = isHovered || isLatest;

            return (
              <div
                key={day.dateStr}
                className="group relative flex h-full flex-1 cursor-pointer flex-col justify-end"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Weekend column background shading */}
                {isWeekend && (
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 top-0 rounded-lg bg-amber-500/[0.04] dark:bg-amber-400/[0.04]"
                    title="Weekend / Shabbat"
                  />
                )}

                {/* Bars Container */}
                <div className="relative flex h-full w-full items-end justify-center gap-0.5 pb-2">
                  {/* Mission bar (Indigo) */}
                  <div
                    className={`w-1/2 rounded-t transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 shadow-sm shadow-indigo-300 dark:bg-indigo-400'
                        : 'bg-indigo-300/80 hover:bg-indigo-400 dark:bg-indigo-700/60 dark:hover:bg-indigo-600'
                    }`}
                    style={{ height: `${missionHeightPercent}%` }}
                  />

                  {/* Active Users bar (Emerald) */}
                  <div
                    className={`w-1/2 rounded-t transition-all duration-200 ${
                      isSelected
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-200 dark:bg-emerald-400'
                        : 'bg-emerald-300/80 hover:bg-emerald-400 dark:bg-emerald-700/60 dark:hover:bg-emerald-600'
                    }`}
                    style={{ height: `${userHeightPercent}%` }}
                  />
                </div>

                {/* Bottom X-Axis Label */}
                <div
                  className={`border-t pt-1.5 text-center text-[10px] leading-tight transition-colors ${
                    isSelected
                      ? 'border-indigo-500 font-extrabold text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  <p className="font-semibold">{weekday}</p>
                  <p className="text-[9px] opacity-75">{shortDate.split('-')[1]}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              Missions Completed
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Active Learners
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2.5 w-2.5 rounded-sm border border-amber-300/50 bg-amber-500/10" />
            Friday–Saturday Shabbat window
          </span>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 3. 15:00 Streak Reminder Engine Card
// ---------------------------------------------------------------------------

const ReminderEngineCard: React.FC<{
  reminders: OwnerStats['reminders'];
  totals: OwnerStats['totals'];
}> = ({ reminders, totals }) => {
  const convPercent = reminders.conversionRate !== null ? Math.round(reminders.conversionRate * 100) : 0;
  const subscriberShare = totals.registered ? Math.round((reminders.subscribers / totals.registered) * 100) : 0;
  const maxSent = Math.max(1, ...reminders.daily.map((d) => d.sent));

  // Circular gauge SVG parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (convPercent / 100) * circumference;

  return (
    <section className={CARD_CLASS}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Streak Reminder Engine</h2>
            <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <Bell className="h-3 w-3" />
              15:00 Push
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {reminders.subscribers} learners subscribed ({subscriberShare}% of registered)
          </p>
        </div>
      </div>

      {/* Conversion Radial Gauge & Summary */}
      <div className="mt-4 flex items-center justify-around gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-emerald-500 transition-all duration-700 ease-out"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {reminders.conversionRate !== null ? `${convPercent}%` : '–'}
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rescue Rate
            </span>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400">Window:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Last {reminders.windowDays} days</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400">Pushes Sent:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{reminders.sent}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400">Practised Same Day:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{reminders.practised}</span>
          </div>
        </div>
      </div>

      {/* A/B Message Comparison */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(['streak', 'comeback'] as const).map((kind) => {
          const item = reminders.byKind[kind];
          const rate = item.sent > 0 ? Math.round((item.practised / item.sent) * 100) : 0;
          const isStreak = kind === 'streak';

          return (
            <div
              key={kind}
              className="rounded-xl border border-slate-200/70 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/80"
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isStreak ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isStreak ? 'Keep your streak' : 'Come back'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {item.sent > 0 ? `${rate}%` : '–'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {item.practised} / {item.sent}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full ${isStreak ? 'bg-amber-500' : 'bg-indigo-500'}`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 14-Day Send Bars Mini Sparkline */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Daily Sent Pushes</span>
          <span className="text-[11px]">Hover bars to inspect</span>
        </div>
        <div className="flex h-12 items-end gap-1">
          {reminders.daily.map((d) => {
            const heightPercent = Math.max(6, Math.round((d.sent / maxSent) * 100));
            const dayInfo = getDayInfo(d.dateStr);
            return (
              <div
                key={d.dateStr}
                className="group relative flex-1 cursor-pointer"
                title={`${dayInfo.weekday} ${dayInfo.shortDate}: ${d.sent} sent · ${d.practised} converted`}
              >
                <div
                  className="rounded-t bg-amber-400/80 transition-all hover:bg-amber-500 dark:bg-amber-500/60 dark:hover:bg-amber-400"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 4. Grade Demographics Card
// ---------------------------------------------------------------------------

const GradeDistributionCard: React.FC<{ byGrade: OwnerStats['byGrade'] }> = ({ byGrade }) => {
  const maxUsers = useMemo(() => Math.max(1, ...byGrade.map((g) => g.users)), [byGrade]);

  // Find grade with highest engagement velocity
  const topEngaged = useMemo(() => {
    return byGrade.reduce(
      (top, cur) => (cur.missionsPerActiveUser7d > top.missionsPerActiveUser7d ? cur : top),
      byGrade[0] ?? { missionsPerActiveUser7d: 0 }
    );
  }, [byGrade]);

  return (
    <section className={CARD_CLASS}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Learners by Grade</h2>
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
              Curriculum Health
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Total learners, Pro adoption, and 7-day mission velocity per active child
          </p>
        </div>

        {topEngaged && topEngaged.missionsPerActiveUser7d > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <Flame className="h-3.5 w-3.5 text-amber-600" />
            <span>Top Velocity: {gradeLabel(topEngaged.gradeId)}</span>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3.5">
        {byGrade.map((g) => {
          const proPercent = g.users > 0 ? Math.round((g.proUsers / g.users) * 100) : 0;
          const userBarWidth = Math.max(3, Math.round((g.users / maxUsers) * 100));
          const proSegmentWidth = g.users > 0 ? Math.round((g.proUsers / g.users) * userBarWidth) : 0;

          return (
            <div key={g.gradeId} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">{gradeLabel(g.gradeId)}</span>
                <div className="flex items-center gap-3 font-semibold tabular-nums text-slate-600 dark:text-slate-400">
                  <span>
                    <strong className="text-slate-900 dark:text-white">{g.users}</strong> learners
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    <strong>{g.proUsers}</strong> Pro ({proPercent}%)
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    <strong>{g.missionsPerActiveUser7d}</strong> m/user (7d)
                  </span>
                </div>
              </div>

              {/* Segmented Bar */}
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {/* Total learners bar */}
                <div
                  className="h-full rounded-full bg-slate-200 transition-all duration-300 dark:bg-slate-700"
                  style={{ width: `${userBarWidth}%` }}
                />
                {/* Overlaid Pro segment */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${proSegmentWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            Total Learners
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Pro Plan Share
          </span>
        </div>
        <span>Velocity: missions finished per active learner over last 7d</span>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 5. Parent & Learner Ecosystem Card
// ---------------------------------------------------------------------------

const ParentEcosystemCard: React.FC<{
  parents: OwnerStats['parents'];
  totals: OwnerStats['totals'];
  averages: OwnerStats['averages'];
}> = ({ parents, totals, averages }) => {
  const guestRatio =
    totals.registered + totals.guests > 0
      ? Math.round((totals.guests / (totals.registered + totals.guests)) * 100)
      : 0;

  return (
    <section className={CARD_CLASS}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Family & Parent Ecosystem</h2>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              Multi-Child Adoption
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Parents supervise their children and pay for Pro subscriptions
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
          <HeartHandshake className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Linked Parents
          </span>
          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {parents.withChildren}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">accounts with ≥1 child</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kids / Parent
          </span>
          <p className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {parents.avgKidsPerParent}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">{parents.links} parent-child links</span>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Practice Tracking
          </span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {Math.round(averages.trackedShare * 100)}%
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">of active days timed</span>
        </div>
      </div>

      {/* Account Conversion Funnel */}
      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Learner Lifecycle Funnel
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Registered Accounts vs Guests</span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                {totals.registered} registered · {totals.guests} guests ({guestRatio}% anonymous)
              </span>
            </div>
            <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="bg-indigo-600 transition-all"
                style={{
                  width: `${
                    totals.registered + totals.guests > 0
                      ? (totals.registered / (totals.registered + totals.guests)) * 100
                      : 100
                  }%`,
                }}
              />
              <div
                className="bg-slate-300 dark:bg-slate-600 transition-all"
                style={{
                  width: `${
                    totals.registered + totals.guests > 0
                      ? (totals.guests / (totals.registered + totals.guests)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Onboarding Completion</span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                {totals.onboarded} of {totals.registered} ({percent(totals.registered ? totals.onboarded / totals.registered : 0)})
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${totals.registered ? (totals.onboarded / totals.registered) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 6. Main Stats View
// ---------------------------------------------------------------------------

const StatsView: React.FC<{ stats: OwnerStats }> = ({ stats }) => {
  const { totals, active, averages, byGrade, daily, parents, reminders } = stats;

  const proShare = totals.registered ? Math.round((totals.pro / totals.registered) * 100) : 0;
  const stickiness = active.last30d > 0 ? Math.round((active.last1d / active.last30d) * 100) : 0;
  const minutes = averages.minutesPerActiveDay;

  return (
    <div className="space-y-6">
      {/* Executive KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Learners */}
        <KpiCard
          title="Total Learners"
          value={totals.registered.toLocaleString()}
          icon={Users}
          accentColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          badge={{
            text: `${totals.guests} guests`,
            tone: 'neutral',
          }}
          breakdown={
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Onboarded:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {totals.onboarded} ({percent(totals.registered ? totals.onboarded / totals.registered : 0)})
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${totals.registered ? (totals.onboarded / totals.registered) * 100 : 0}%` }}
                />
              </div>
            </div>
          }
        />

        {/* KPI 2: Pro Subscribers */}
        <KpiCard
          title="Pro Subscribers"
          value={totals.pro.toLocaleString()}
          icon={Crown}
          accentColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          badge={{
            text: `${proShare}% of registered`,
            tone: 'positive',
          }}
          breakdown={
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Free-to-Pro Conversion:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">{proShare}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(100, proShare)}%` }} />
              </div>
            </div>
          }
        />

        {/* KPI 3: Active Learners */}
        <KpiCard
          title="Active Learners"
          value={active.last7d.toLocaleString()}
          icon={Activity}
          accentColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          badge={{
            text: `WAU (7 Days)`,
            tone: 'accent',
          }}
          breakdown={
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                DAU: <strong className="text-slate-700 dark:text-slate-200">{active.last1d}</strong>
              </span>
              <span>·</span>
              <span>
                MAU: <strong className="text-slate-700 dark:text-slate-200">{active.last30d}</strong>
              </span>
              <span>·</span>
              <span title="Daily Active Users / Monthly Active Users">
                Stickiness: <strong className="text-emerald-600 dark:text-emerald-400">{stickiness}%</strong>
              </span>
            </div>
          }
        />

        {/* KPI 4: Learning Intensity */}
        <KpiCard
          title="Daily Intensity"
          value={`${averages.missionsPerActiveDay} missions`}
          icon={Clock}
          accentColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          badge={{
            text: minutes !== null ? `${minutes} min/day` : 'No time logged',
            tone: minutes !== null ? 'positive' : 'neutral',
          }}
          subtitle={
            minutes !== null
              ? `Time tracked on ${Math.round(averages.trackedShare * 100)}% of user-days (${averages.windowDays}d window)`
              : `Averaged over last ${averages.windowDays} days`
          }
        />
      </div>

      {/* Row 2: 14-Day Dual-Metric Trend + Streak Reminder Engine */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <ActivityTrendChart daily={daily} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <ReminderEngineCard reminders={reminders} totals={totals} />
        </div>
      </div>

      {/* Row 3: Grade Demographics + Family Ecosystem */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GradeDistributionCard byGrade={byGrade} />
        <ParentEcosystemCard parents={parents} totals={totals} averages={averages} />
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
        <span>Updated: {new Date(stats.generatedAt).toLocaleString('en-GB')}</span>
        <span>Telemetry covers the rolling 12-week profile activity log. Aggregates only.</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 7. Root Dashboard Screen
// ---------------------------------------------------------------------------

export const OwnerDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [load, setLoad] = useState<Load>({ status: 'idle' });
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return undefined;
    }
    return onAuthStateChanged(auth, setUser);
  }, []);

  const refresh = useCallback(async () => {
    setLoad({ status: 'loading' });
    const result = await fetchOwnerStats();
    setLoad(result.ok ? { status: 'ready', stats: result.stats } : { status: 'error', message: result.message });
  }, []);

  const isGoogleUser = !!user && !user.isAnonymous && user.providerData.some((p) => p.providerId === 'google.com');

  useEffect(() => {
    if (isGoogleUser) void refresh();
  }, [isGoogleUser, refresh]);

  const handleSignIn = async () => {
    if (!auth || !googleProvider) return;
    setSignInError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = (error as { code?: string })?.code || '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setSignInError('Google sign-in failed.');
      }
    }
  };

  return (
    <div
      dir="ltr"
      lang="en"
      className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100"
    >
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EnglishVibe · Owner Command
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Aggregates
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operational analytics, retention funnels, and monetization telemetry
              </p>
            </div>
          </div>

          {isGoogleUser && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={() => void refresh()}
                disabled={load.status === 'loading'}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${load.status === 'loading' ? 'animate-spin text-indigo-600' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                onClick={() => auth && void signOut(auth)}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </header>

        {/* Authentication & Loading States */}
        {user === undefined && (
          <div className="flex items-center justify-center p-12 text-sm font-semibold text-slate-500">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-indigo-600" />
            Authenticating owner session…
          </div>
        )}

        {user !== undefined && !isGoogleUser && (
          <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Crown className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              Owner Verification Required
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Sign in with your verified owner Google account to view private EnglishVibe telemetry.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700"
              onClick={() => void handleSignIn()}
            >
              Sign in with Google
            </button>
            {signInError && <p role="alert" className="mt-3 text-xs font-bold text-red-600">{signInError}</p>}
          </section>
        )}

        {isGoogleUser && load.status === 'loading' && (
          <div className="flex items-center justify-center p-12 text-sm font-semibold text-slate-500">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-indigo-600" />
            Loading real-time telemetry…
          </div>
        )}

        {isGoogleUser && load.status === 'error' && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {load.message}
          </div>
        )}

        {/* Dashboard Content */}
        {isGoogleUser && load.status === 'ready' && <StatsView stats={load.stats} />}
      </main>
    </div>
  );
};
