import React, { useCallback, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import { fetchOwnerStats, type OwnerStats } from '../../services/ownerStatsService';

type Load = { status: 'idle' } | { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; stats: OwnerStats };

const cardClass = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800';

const gradeLabel = (gradeId: string): string => gradeId.replace('grade-', 'Grade ');

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "Thu 10-16" from a YYYY-MM-DD day */
const dayLabel = (dateStr: string): string => {
  const weekday = WEEKDAYS[new Date(`${dateStr}T12:00:00Z`).getUTCDay()];
  return `${weekday} ${dateStr.slice(5)}`;
};

const percent = (share: number | null): string => (share === null ? '–' : `${Math.round(share * 100)}%`);

const Tile: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div className={cardClass}>
    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-1 text-3xl font-extrabold">{value}</p>
    {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
  </div>
);

const Bar: React.FC<{ value: number; max: number; label: string; note?: string }> = ({ value, max, label, note }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="w-20 shrink-0 font-bold">{label}</span>
    <div className="h-3 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
      <div
        className="h-3 rounded-full bg-indigo-500"
        style={{ width: `${max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0}%` }}
      />
    </div>
    <span className="w-10 shrink-0 text-end tabular-nums">{value}</span>
    {note && <span className="w-16 shrink-0 text-end text-slate-500 dark:text-slate-400">{note}</span>}
  </div>
);

const StatsView: React.FC<{ stats: OwnerStats }> = ({ stats }) => {
  const { totals, active, averages, byGrade, daily, parents, reminders } = stats;
  const maxReminderSent = Math.max(1, ...reminders.daily.map((d) => d.sent));
  const maxGradeUsers = Math.max(1, ...byGrade.map((g) => g.users));
  const maxDailyMissions = Math.max(1, ...daily.map((d) => d.missions));
  const minutes = averages.minutesPerActiveDay;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Registered" value={String(totals.registered)} hint={`${totals.guests} guests not counted`} />
        <Tile
          label="On Pro"
          value={String(totals.pro)}
          hint={totals.registered ? `${Math.round((totals.pro / totals.registered) * 100)}% of registered` : undefined}
        />
        <Tile label="Active 7 days" value={String(active.last7d)} hint={`${active.last1d} today · ${active.last30d} in 30 days`} />
        <Tile label="Onboarded" value={String(totals.onboarded)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Tile
          label="Missions / active day"
          value={String(averages.missionsPerActiveDay)}
          hint={`per user, last ${averages.windowDays} days`}
        />
        <Tile
          label="Minutes / active day"
          value={minutes === null ? '–' : String(minutes)}
          hint={
            minutes === null
              ? 'No time tracked yet'
              : `time tracked on ${Math.round(averages.trackedShare * 100)}% of active days`
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Tile label="Parent accounts" value={String(parents.withChildren)} hint="with at least one linked child" />
        <Tile
          label="Kids / parent"
          value={String(parents.avgKidsPerParent)}
          hint={`${parents.links} links in total`}
        />
      </div>
      <section className={cardClass}>
        <h2 className="mb-1 text-sm font-extrabold">Streak reminder (15:00)</h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {reminders.subscribers} learners have it on
          {totals.registered ? ` (${Math.round((reminders.subscribers / totals.registered) * 100)}% of registered)` : ''}.
          Last {reminders.windowDays} days: {reminders.sent} sent, {reminders.practised} finished a mission the same
          day ({percent(reminders.conversionRate)}).
        </p>
        <table className="mb-3 w-full text-xs">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400">
              <th className="text-start font-bold">Message</th>
              <th className="text-end font-bold">Sent</th>
              <th className="text-end font-bold">Practised same day</th>
            </tr>
          </thead>
          <tbody>
            {(['streak', 'comeback'] as const).map((kind) => (
              <tr key={kind}>
                <td>{kind === 'streak' ? 'Keep your streak' : 'Come back'}</td>
                <td className="text-end tabular-nums">{reminders.byKind[kind].sent}</td>
                <td className="text-end tabular-nums">
                  {reminders.byKind[kind].practised} (
                  {percent(reminders.byKind[kind].sent ? reminders.byKind[kind].practised / reminders.byKind[kind].sent : null)})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-2">
          {reminders.daily.map((d) => (
            <Bar key={d.dateStr} label={dayLabel(d.dateStr)} value={d.sent} max={maxReminderSent} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Bars are reminders sent per day. Only learners who had not practised yet get one, so "practised same day" is
          the best sign it worked, but some would have practised anyway. Counting started when this logging shipped.
        </p>
      </section>
      <section className={cardClass}>
        <h2 className="mb-3 text-sm font-extrabold">Users by grade</h2>
        <div className="space-y-2">
          {byGrade.map((g) => (
            <Bar key={g.gradeId} label={gradeLabel(g.gradeId)} value={g.users} max={maxGradeUsers} />
          ))}
        </div>
        <table className="mt-4 w-full text-xs">
          <thead>
            <tr className="text-start text-slate-500 dark:text-slate-400">
              <th className="text-start font-bold">Grade</th>
              <th className="text-end font-bold">Users</th>
              <th className="text-end font-bold">Pro</th>
              <th className="text-end font-bold">Missions / active user (7d)</th>
            </tr>
          </thead>
          <tbody>
            {byGrade.map((g) => (
              <tr key={g.gradeId}>
                <td>{gradeLabel(g.gradeId)}</td>
                <td className="text-end tabular-nums">{g.users}</td>
                <td className="text-end tabular-nums">{g.proUsers}</td>
                <td className="text-end tabular-nums">{g.missionsPerActiveUser7d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className={cardClass}>
        <h2 className="mb-1 text-sm font-extrabold">Missions per day (last {daily.length} days)</h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Each row is a day (month-day, Israel time). The number is the missions all users finished that day;
          the small figure is how many users were active.
        </p>
        <div className="space-y-2">
          {daily.map((d) => (
            <Bar
              key={d.dateStr}
              label={dayLabel(d.dateStr)}
              value={d.missions}
              max={maxDailyMissions}
              note={`${d.activeUsers} users`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Active users and minutes today: {daily[daily.length - 1]?.activeUsers ?? 0} users ·{' '}
          {daily[daily.length - 1]?.activeMinutes ?? 0} min
        </p>
      </section>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Updated {new Date(stats.generatedAt).toLocaleString('en-GB')}. Activity covers the last 12 weeks kept in each
        profile.
      </p>
    </div>
  );
};

/** The owner's private stats page (`?owner`). The server decides who is the owner. */
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
    <div dir="ltr" lang="en" className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <main className="mx-auto max-w-3xl space-y-4 p-4">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-extrabold">EnglishVibe · Owner</h1>
          {isGoogleUser && (
            <div className="flex gap-2 text-xs font-bold">
              <button type="button" className="rounded-lg border px-3 py-2" onClick={() => void refresh()}>
                Refresh
              </button>
              <button type="button" className="rounded-lg border px-3 py-2" onClick={() => auth && void signOut(auth)}>
                Sign out
              </button>
            </div>
          )}
        </header>
        {user === undefined && <p role="status">Loading…</p>}
        {user !== undefined && !isGoogleUser && (
          <section className={cardClass}>
            <p className="mb-3 text-sm font-bold">Sign in with the owner's Google account.</p>
            <button type="button" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white" onClick={() => void handleSignIn()}>
              Sign in with Google
            </button>
            {signInError && <p role="alert" className="mt-2 text-xs text-red-600">{signInError}</p>}
          </section>
        )}
        {isGoogleUser && load.status === 'loading' && <p role="status">Loading stats…</p>}
        {isGoogleUser && load.status === 'error' && (
          <p role="alert" className="text-sm font-bold text-red-600">{load.message}</p>
        )}
        {isGoogleUser && load.status === 'ready' && <StatsView stats={load.stats} />}
      </main>
    </div>
  );
};
