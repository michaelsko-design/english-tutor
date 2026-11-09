import React from 'react';
import type { OwnerStats } from '../../services/ownerStatsService';

const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90';
const MUTED = 'text-xs text-slate-500 dark:text-slate-400';

type Usage = NonNullable<OwnerStats['usage']>;

const FUNNEL_STEPS: Array<{ key: keyof Usage['funnel']; label: string }> = [
  { key: 'sessions', label: 'Opened the app' },
  { key: 'onboardingViewed', label: 'Saw the onboarding form' },
  { key: 'onboarded', label: 'Finished onboarding' },
  { key: 'greeted', label: 'Opened the welcome chest' },
  { key: 'toured', label: 'Finished the app tour' },
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

const OS_LABELS: Record<string, string> = { ios: 'iOS', android: 'Android', windows: 'Windows', mac: 'Mac', linux: 'Linux', other: 'Other OS' };
const BROWSER_LABELS: Record<string, string> = { safari: 'Safari', chrome: 'Chrome', firefox: 'Firefox', edge: 'Edge', samsung: 'Samsung Internet', other: 'Other browser' };

/** `ios-safari-phone-pwa` -> "iPhone/iOS Safari phone (app)" style label, from fixed words only */
export function deviceLabel(device: string): string {
  const [os = 'other', browser = 'other', form = 'desktop', pwa] = device.split('-');
  return `${OS_LABELS[os] ?? os} ${BROWSER_LABELS[browser] ?? browser} ${form}${pwa ? ' (installed)' : ''}`;
}

const deviceList = (devices: readonly string[] | undefined): string => (devices && devices.length > 0 ? devices.map(deviceLabel).join(', ') : '–');

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

      {usage.struggle && (
        <p className={`mt-4 ${MUTED}`}>
          Struggle signals: {usage.struggle.missionStarts} missions started, {usage.struggle.missionAbandons} abandoned,{' '}
          {usage.struggle.hintsUsed} hints opened, {usage.struggle.ttsErrors} read-aloud failures
        </p>
      )}

      {usage.stuckMissions && usage.stuckMissions.length > 0 && (
        <>
          <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">Where learners get stuck</h3>
          <div className="overflow-x-auto">
            <table className="mt-1 w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className={MUTED}>
                <tr>
                  <th className="pr-2 font-medium">Mission</th>
                  <th className="pr-2 font-medium">Started</th>
                  <th className="pr-2 font-medium">Left unfinished</th>
                  <th className="pr-2 font-medium">Rate</th>
                  <th className="pr-2 font-medium">Learners</th>
                  <th className="font-medium">Tier (E / C / M)</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {usage.stuckMissions.map((mission) => (
                  <tr key={mission.missionId}>
                    <td className="pr-2 font-bold" dir="ltr">{mission.missionId}</td>
                    <td className="pr-2">{mission.starts}</td>
                    <td className="pr-2">{mission.abandons}</td>
                    <td className="pr-2">{mission.starts > 0 ? `${Math.round((mission.abandons / mission.starts) * 100)}%` : '–'}</td>
                    <td className="pr-2">{mission.learners}</td>
                    <td dir="ltr">{mission.tiers.explorer} / {mission.tiers.challenger} / {mission.tiers.master}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {usage.devices && usage.devices.length > 0 && (
        <>
          <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">Devices (learners)</h3>
          <ul className="mt-1 space-y-1">
            {usage.devices.map(({ device, learners }) => (
              <li key={device} className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                <span dir="ltr">{deviceLabel(device)}</span>
                <span className="font-bold tabular-nums">{learners}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {usage.testers && usage.testers.length > 0 && (
        <>
          <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">Early testers</h3>
          <div className="overflow-x-auto">
            <table className="mt-1 w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className={MUTED}>
                <tr>
                  <th className="pr-2 font-medium">Tester</th>
                  <th className="pr-2 font-medium">Days</th>
                  <th className="pr-2 font-medium">Last seen</th>
                  <th className="pr-2 font-medium">Missions</th>
                  <th className="pr-2 font-medium">Abandoned</th>
                  <th className="pr-2 font-medium">Hints</th>
                  <th className="pr-2 font-medium">Audio errors</th>
                  <th className="font-medium">Device</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {usage.testers.map((tester) => (
                  <tr key={`${tester.cohort}|${tester.label}`}>
                    <td className="pr-2 font-bold" dir="ltr">{tester.label}</td>
                    <td className="pr-2">{tester.daysActive}</td>
                    <td className="pr-2">{tester.lastSeen ?? 'never'}</td>
                    <td className="pr-2">{tester.missions}</td>
                    <td className="pr-2">{tester.missionAbandons}</td>
                    <td className="pr-2">{tester.hintsUsed}</td>
                    <td className="pr-2">{tester.ttsErrors}</td>
                    <td dir="ltr">{deviceList(tester.devices)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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

      {usage.feedback && usage.feedback.length > 0 && (
        <>
          <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">Tester notes</h3>
          <ul className="mt-1 space-y-2">
            {usage.feedback.map((note, index) => (
              <li key={`${note.day}|${note.tester}|${index}`} className="text-xs text-slate-700 dark:text-slate-300">
                <span className={MUTED} dir="ltr">
                  {note.day} · {note.tester} · {note.kind} · grade {note.gradeId} · {note.appVersion}
                </span>
                <p className="break-words" dir="auto">{note.text}</p>
              </li>
            ))}
          </ul>
        </>
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
                {error.devices && error.devices.length > 0 && <span className={`ms-1 ${MUTED}`}>({deviceList(error.devices)})</span>}
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
