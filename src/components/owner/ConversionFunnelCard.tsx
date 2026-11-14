import React, { useState } from 'react';
import type { OwnerStats } from '../../services/ownerStatsService';
import { CARD_CLASS, gradeLabel, percent } from './ownerShared';

type Conversion = NonNullable<OwnerStats['conversion']>;
type Segment = Conversion['segments'][number];
type Counts = Segment['totals'];
type StepKey = Exclude<keyof Counts, 'day30Eligible'>;

const MUTED = 'text-xs text-slate-500 dark:text-slate-400';
const TH = 'px-2 py-1.5 text-end font-semibold';
const TD = 'px-2 py-1.5 text-end tabular-nums';

const STEPS: ReadonlyArray<{ key: StepKey; label: string; short: string }> = [
  { key: 'signedUp', label: 'Signed up', short: 'Signed up' },
  { key: 'activated', label: 'Activated (3 missions on 2 days)', short: 'Activated' },
  { key: 'reachedWall', label: 'Reached the first Pro wall', short: 'Wall' },
  { key: 'askSent', label: 'Sent an ask to a parent', short: 'Ask' },
  { key: 'parentLinked', label: 'Parent signed in and paired', short: 'Parent' },
  { key: 'checkoutStarted', label: 'Checkout started', short: 'Checkout' },
  { key: 'paid', label: 'Paid', short: 'Paid' },
  { key: 'activeDay30', label: 'Active at day 30', short: 'Day 30' },
  { key: 'cancelled', label: 'Cancelled', short: 'Cancelled' },
];

const SOURCE_LABELS: Record<string, string> = {
  all: 'All sources',
  direct: 'Direct / no tag',
  landing: 'Landing page',
  'wa-family': 'WhatsApp: family and friends',
  'wa-teachers': 'WhatsApp: teachers',
  'wa-parents': 'WhatsApp: parent groups',
  'wa-students': 'WhatsApp: students',
  qr: 'QR code',
  ig: 'Instagram',
  fb: 'Facebook',
  tiktok: 'TikTok',
  ad: 'Paid ad',
  other: 'Other tag',
};

const sourceLabel = (src: string): string => SOURCE_LABELS[src] ?? src;
const share = (part: number, whole: number): number | null => (whole > 0 ? part / whole : null);

/** Day 30 is judged only on learners who signed up long enough ago; every other step on all sign-ups */
const baseOf = (key: StepKey, counts: Counts): number => (key === 'activeDay30' ? counts.day30Eligible : counts.signedUp);

const StepBars: React.FC<{ totals: Counts }> = ({ totals }) => (
  <ul className="mt-3 space-y-2">
    {STEPS.map(({ key, label }) => {
      const rate = share(totals[key], baseOf(key, totals));
      return (
        <li key={key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-slate-700 dark:text-slate-200">{label}</span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
              {totals[key]} <span className={MUTED}>{key === 'signedUp' ? '' : percent(rate)}</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${Math.round((rate ?? 0) * 100)}%` }} />
          </div>
        </li>
      );
    })}
  </ul>
);

const CohortTable: React.FC<{ cohorts: Segment['cohorts'] }> = ({ cohorts }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="w-full min-w-[640px] text-xs text-slate-700 dark:text-slate-200">
      <caption className="sr-only">Funnel steps per sign-up week</caption>
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-700">
          <th scope="col" className="px-2 py-1.5 text-start font-semibold">
            Week of
          </th>
          {STEPS.map(({ key, short }) => (
            <th key={key} scope="col" className={TH}>
              {short}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...cohorts].reverse().map((week) => (
          <tr key={week.weekStart} className="border-b border-slate-100 dark:border-slate-800">
            <th scope="row" className="px-2 py-1.5 text-start font-medium tabular-nums">
              {week.weekStart.slice(5)}
            </th>
            {STEPS.map(({ key }) => (
              <td key={key} className={TD}>
                {week.signedUp === 0 ? '–' : week[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** The conversion funnel by source tag and sign-up week, and how long each grade takes to reach the wall */
export const ConversionFunnelCard: React.FC<{ conversion: Conversion }> = ({ conversion }) => {
  const [src, setSrc] = useState<string>('all');
  const segment = conversion.segments.find((s) => s.src === src) ?? conversion.segments[0];
  const { parentLinkOpens, visitsBySource, wallByGrade } = conversion;

  return (
    <section className={CARD_CLASS} aria-labelledby="conversion-funnel-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="conversion-funnel-title" className="text-base font-bold text-slate-900 dark:text-white">
          Conversion funnel
        </h2>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Source
          <select
            value={segment.src}
            onChange={(event) => setSrc(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {conversion.segments.map((s) => (
              <option key={s.src} value={s.src}>
                {sourceLabel(s.src)} ({s.totals.signedUp})
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className={`mt-1 ${MUTED}`}>
        Share of sign-ups; day 30 is out of the {segment.totals.day30Eligible} who signed up at least 5 weeks ago. Wall and ask are missing for
        learners whose parent turned usage statistics off.
      </p>

      <StepBars totals={segment.totals} />
      <p className={`mt-3 ${MUTED}`}>
        Parent links opened (page loads, all sources): {parentLinkOpens.all}, of them from a Pro ask: {parentLinkOpens.pro}.
      </p>

      <h3 className="mt-6 text-sm font-bold text-slate-900 dark:text-white">By sign-up week (last 12, newest first)</h3>
      <CohortTable cohorts={segment.cohorts} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Days from sign-up to the first wall</h3>
          {wallByGrade.length === 0 ? (
            <p className={`mt-2 ${MUTED}`}>No learner has reached a wall yet (Pro gating is off until launch).</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
              {wallByGrade.map((row) => (
                <li key={row.gradeId} className="flex justify-between gap-3">
                  <span>{gradeLabel(row.gradeId)}</span>
                  <span className="tabular-nums">
                    median {row.medianDays} days <span className={MUTED}>({row.learners})</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Before the account exists, by link tag</h3>
          {visitsBySource.length === 0 ? (
            <p className={`mt-2 ${MUTED}`}>No visits counted yet.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
              {visitsBySource.map((row) => (
                <li key={row.src} className="flex justify-between gap-3">
                  <span>{sourceLabel(row.src)}</span>
                  <span className="tabular-nums">
                    {row.gate_view} saw sign-in · {row.signup_done} created an account
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
