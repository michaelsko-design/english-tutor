import React from 'react';
import { HeartHandshake } from 'lucide-react';
import type { OwnerStats } from '../../../services/ownerStatsService';
import { CARD_CLASS, percent } from '../ownerShared';

export const ParentEcosystemCard: React.FC<{
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
