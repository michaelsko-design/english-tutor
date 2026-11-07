import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import type { OwnerStats } from '../../../services/ownerStatsService';
import { CARD_CLASS, gradeLabel } from '../ownerShared';

export const GradeDistributionCard: React.FC<{ byGrade: OwnerStats['byGrade'] }> = ({ byGrade }) => {
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
