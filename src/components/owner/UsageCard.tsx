import React from 'react';
import type { OwnerStats } from '../../services/ownerStatsService';

const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90';
const MUTED = 'text-xs text-slate-500 dark:text-slate-400';

type Usage = NonNullable<OwnerStats['usage']>;

const FUNNEL_STEPS: Array<{ key: keyof Usage['funnel']; label: string }> = [
  { key: 'sessions', label: 'Opened the app' },
  { key: 'onboarded', label: 'Finished onboarding' },
  { key: 'placed', label: 'Took the placement test' },
  { key: 'firstMission', label: 'Finished a mission' },
  { key: 'threeStars', label: 'Earned 3 stars' },
];

const FEATURE_LABELS: Record<string, string> = {
  feature_exam_prep: 'Exam prep',
  feature_word_lists: 'Word lists',
  feature_friends: 'Friends',
  feature_progress_report: 'Progress report',
  feature_room: 'Room',
  feature_shop: 'Reward shop',
  feature_settings: 'Settings',
};

const percent =(share: number | null): string => (share === null ? '–' : `${Math.round(share * 100)}%`);

/** Funnel, return rate, tier mix and client errors, from the anonymous first-party counters */
export const UsageCard: React.FC<{ usage: OwnerStats['usage'] }> = ({ usage }) => {
  if (!usage || !usage.hasData) {
    return (
      <section className={CARD_CLASS}>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Usage &amp; errors</h2>
        <p className={`mt-2 ${MUTED}`}>Collecting data: numbers appear after learners open the updated app.</p>
      </section>
    );
  }
  const { funnel, retention, missionsByTier, errors, windowDays } = usage;
  const features = usage.features ?? [];
  const top = Math.max(1, funnel.sessions);
  const tierTotal = missionsByTier.explorer + missionsByTier.challenger + missionsByTier.master;

  return (
    <section className={CARD_CLASS}>
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Usage &amp; errors</h2>
      <p className={MUTED}>Last {windowDays} days, distinct learners. Counters started with this release.</p>

      <ul className="mt-4 space-y-2">
        {FUNNEL_STEPS.map(({ key, label }) => (
          <li key={key}>
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>{label}</span>
              <span className="font-bold tabular-nums">
                {funnel[key]} ({Math.round((funnel[key] / top) * 100)}%)
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.round((funnel[key] / top) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className={MUTED}>Back after 1 day</div>
          <div className="text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">{percent(retention.day1)}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className={MUTED}>Back after 7 days</div>
          <div className="text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">{percent(retention.day7)}</div>
        </div>
      </div>

      <p className={`mt-4 ${MUTED}`}>
        Missions by tier: Explorer {missionsByTier.explorer}, Challenger {missionsByTier.challenger}, Master{' '}
        {missionsByTier.master} ({tierTotal} total)
      </p>

      <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">Features opened (learners)</h3>
      {features.length === 0 ? (
        <p className={MUTED}>No feature opens yet.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {features.map(({ key, learners }) => (
            <li key={key} className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>{FEATURE_LABELS[key] ?? key}</span>
              <span className="font-bold tabular-nums">{learners}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">Errors</h3>
      {errors.length === 0 ? (
        <p className={MUTED}>No client errors reported.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {errors.map((error) => (
            <li key={`${error.source}|${error.message}`} className="flex justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
              <span className="min-w-0 break-words" dir="ltr">
                [{error.source}] {error.message}
              </span>
              <span className="shrink-0 font-bold tabular-nums">
                ×{error.count} · {error.days}d
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
