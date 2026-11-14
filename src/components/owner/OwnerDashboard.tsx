import React, { useCallback, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Crown, RefreshCw, LogOut, TrendingUp } from 'lucide-react';
import { auth, googleProvider } from '../../services/firebase';
import { fetchOwnerStats, type OwnerStats } from '../../services/ownerStatsService';
import { TestAccountsCard } from './TestAccountsCard';
import { EarlyTestersCard } from './EarlyTestersCard';
import { UsageCard } from './UsageCard';
import { SuccessGatesCard } from './SuccessGatesCard';
import { ConversionFunnelCard } from './ConversionFunnelCard';
import { OwnerTabs, type OwnerTabDef } from './OwnerTabs';
import { OverviewPanel } from './cards/OverviewPanel';
import { ReminderEngineCard } from './cards/ReminderEngineCard';
import { GradeDistributionCard } from './cards/GradeDistributionCard';
import { ParentEcosystemCard } from './cards/ParentEcosystemCard';

type Load =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; stats: OwnerStats };

const TAB_IDS = ['overview', 'funnel', 'learners', 'engagement', 'testers'] as const;
type TabId = (typeof TAB_IDS)[number];

const TABS: ReadonlyArray<OwnerTabDef<TabId>> = [
  { id: 'overview', label: 'Overview' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'learners', label: 'Learners' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'testers', label: 'Testers' },
];

function tabFromHash(hash: string): TabId {
  const id = hash.replace(/^#/, '');
  return (TAB_IDS as readonly string[]).includes(id) ? (id as TabId) : 'overview';
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// Tab panels
// ---------------------------------------------------------------------------

const StatsView: React.FC<{ stats: OwnerStats; tab: TabId; onTestUsersChanged: () => void }> = ({
  stats,
  tab,
  onTestUsersChanged,
}) => {
  const { totals, averages, byGrade, parents, reminders } = stats;

  return (
    <div className="space-y-6">
      <div role="tabpanel" id={`owner-panel-${tab}`} aria-labelledby={`owner-tab-${tab}`} className="space-y-6">
        {tab === 'overview' && <OverviewPanel stats={stats} />}

        {tab === 'funnel' &&
          (stats.conversion ? (
            <>
              <SuccessGatesCard gates={stats.conversion.gates} />
              <ConversionFunnelCard conversion={stats.conversion} />
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">The server did not send the funnel yet. Refresh after the next deploy.</p>
          ))}

        {tab === 'learners' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GradeDistributionCard byGrade={byGrade} />
            <ParentEcosystemCard parents={parents} totals={totals} averages={averages} />
          </div>
        )}

        {tab === 'engagement' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 xl:col-span-4">
              <ReminderEngineCard reminders={reminders} totals={totals} />
            </div>
            <div className="lg:col-span-7 xl:col-span-8">
              <UsageCard usage={stats.usage} />
            </div>
          </div>
        )}

        {tab === 'testers' && (
          <>
            <EarlyTestersCard />
            <TestAccountsCard onChanged={onTestUsersChanged} />
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
        <span>Updated: {new Date(stats.generatedAt).toLocaleString('en-GB')}</span>
        <span>
          Telemetry covers the rolling 12-week profile activity log. Aggregates only
          {stats.excludedTestUsers > 0 && ` · ${stats.excludedTestUsers} test ${stats.excludedTestUsers === 1 ? 'account' : 'accounts'} excluded`}.
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Root Dashboard Screen
// ---------------------------------------------------------------------------

export const OwnerDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [load, setLoad] = useState<Load>({ status: 'idle' });
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tab, setTab] = useState<TabId>(() => tabFromHash(window.location.hash));

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return undefined;
    }
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabChange = useCallback((id: TabId) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  // Keeps the current numbers and tab on screen while reloading (only the first load shows the full-page spinner)
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setLoad((prev) => (prev.status === 'ready' ? prev : { status: 'loading' }));
    const result = await fetchOwnerStats();
    setLoad((prev) =>
      result.ok
        ? { status: 'ready', stats: result.stats }
        : prev.status === 'ready'
          ? prev
          : { status: 'error', message: result.message },
    );
    setIsRefreshing(false);
  }, []);

  // After the test-account list changed: reload the numbers in place (no spinner, so the list card keeps its state)
  const reloadQuietly = useCallback(async () => {
    const result = await fetchOwnerStats();
    if (result.ok) setLoad({ status: 'ready', stats: result.stats });
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

  const updatedAt = load.status === 'ready' ? formatTime(load.stats.generatedAt) : '';

  return (
    <div
      dir="ltr"
      lang="en"
      className="min-h-screen w-full bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Pinned header: title, refresh / sign out, and the tab bar stay visible while scrolling */}
      <header
        data-testid="owner-header"
        className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                    EnglishVibe · Owner Command
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Aggregates
                  </span>
                </div>
                <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                  Operational analytics, retention funnels, and monetization telemetry
                </p>
              </div>
            </div>

            {isGoogleUser && (
              <div className="flex shrink-0 items-center gap-2">
                {updatedAt && (
                  <span className="hidden text-xs text-slate-500 dark:text-slate-400 md:inline">
                    Updated {updatedAt}
                  </span>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => void refresh()}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  onClick={() => auth && void signOut(auth)}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                  <span className="sr-only sm:hidden">Sign out</span>
                </button>
              </div>
            )}
          </div>

          {isGoogleUser && load.status === 'ready' && <OwnerTabs tabs={TABS} active={tab} onChange={handleTabChange} />}
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
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

        {isGoogleUser && load.status === 'ready' && (
          <StatsView stats={load.stats} tab={tab} onTestUsersChanged={() => void reloadQuietly()} />
        )}
      </main>
    </div>
  );
};
