import React, { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import type { OwnerStats } from '../../../services/ownerStatsService';
import { CARD_CLASS, getDayInfo } from '../ownerShared';

export const ActivityTrendChart: React.FC<{ daily: OwnerStats['daily'] }> = ({ daily }) => {
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
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-800/80 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-1.5 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                {activeDayInfo.weekday} {activeDayInfo.shortDate}
                {activeDayInfo.isWeekend && ' (Weekend)'}
              </span>
            </div>
            <div className="hidden h-3 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 whitespace-nowrap font-bold tabular-nums">
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
        <div className="flex flex-col items-center gap-0.5 sm:block">
          <span className="text-slate-500 dark:text-slate-400">14-Day Missions:</span>{' '}
          <strong className="text-slate-900 dark:text-white tabular-nums">{total14dMissions.toLocaleString()}</strong>
        </div>
        <div className="flex flex-col items-center gap-0.5 sm:block">
          <span className="text-slate-500 dark:text-slate-400">Daily Average:</span>{' '}
          <strong className="whitespace-nowrap text-slate-900 dark:text-white tabular-nums">{avg14dMissions} / day</strong>
        </div>
        <div className="flex flex-col items-center gap-0.5 sm:block">
          <span className="text-slate-500 dark:text-slate-400">Peak Day:</span>{' '}
          <strong className="whitespace-nowrap text-slate-900 dark:text-white tabular-nums">{peakDay?.missions ?? 0} missions</strong>
        </div>
      </div>

      {/* Dual Bar + Line Chart */}
      <div className="mt-6">
        <div className="relative flex h-48 items-end gap-0.5 sm:gap-2">
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
                className="group relative flex h-full min-w-0 flex-1 cursor-pointer flex-col justify-end"
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
                  <p className="font-semibold">
                    <span className="sm:hidden">{weekday.slice(0, 2)}</span>
                    <span className="hidden sm:inline">{weekday}</span>
                  </p>
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
