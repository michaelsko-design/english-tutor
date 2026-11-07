import React from 'react';
import { Users, Crown, Activity, Clock } from 'lucide-react';
import type { OwnerStats } from '../../../services/ownerStatsService';
import { percent } from '../ownerShared';
import { KpiCard } from './KpiCard';
import { ActivityTrendChart } from './ActivityTrendChart';

export const OverviewPanel: React.FC<{ stats: OwnerStats }> = ({ stats }) => {
  const { totals, active, averages, daily } = stats;
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

      <ActivityTrendChart daily={daily} />
    </div>
  );
};
