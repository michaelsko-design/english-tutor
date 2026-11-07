import React from 'react';
import { Bell } from 'lucide-react';
import type { OwnerStats } from '../../../services/ownerStatsService';
import { CARD_CLASS, getDayInfo } from '../ownerShared';

export const ReminderEngineCard: React.FC<{
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
