import React, { useCallback, useEffect, useState } from 'react';
import { Archive, Copy, RefreshCw, UserPlus, X } from 'lucide-react';
import {
  archiveFinishedInvites,
  createInvites,
  fetchTesters,
  inviteLink,
  lockOutTester,
  withdrawInvite,
  type InviteEntry,
  type OwnerTestersView,
  type TestersResult,
} from '../../services/ownerTestersService';

const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90';
const MUTED = 'text-xs text-slate-500 dark:text-slate-400';
const INPUT_CLASS =
  'min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';
const SMALL_BTN =
  'inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800';
const DEFAULT_COHORT = 'tester';
const DEFAULT_DAYS = 14;
const STATUS_CLASS: Record<InviteEntry['status'], string> = {
  open: 'text-emerald-600 dark:text-emerald-400',
  used: 'text-slate-500 dark:text-slate-400',
  expired: 'text-red-600 dark:text-red-400',
};

/** Aliases typed one per line or separated by commas */
export function parseAliases(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((alias) => alias.trim())
    .filter(Boolean);
}

/** Early-tester management: create single-use invite links, see who joined, lock a tester out. */
export const EarlyTestersCard: React.FC = () => {
  const [view, setView] = useState<OwnerTestersView | null>(null);
  const [aliases, setAliases] = useState('');
  const [cohort, setCohort] = useState(DEFAULT_COHORT);
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const apply = useCallback((result: TestersResult): boolean => {
    if (!result.ok) {
      setMessage(result.message);
      return false;
    }
    setView(result.view);
    setMessage(null);
    return true;
  }, []);

  useEffect(() => {
    let isCancelled = false;
    void fetchTesters().then((result) => {
      if (!isCancelled) apply(result);
    });
    return () => {
      isCancelled = true;
    };
  }, [apply]);

  const run = async (action: () => Promise<TestersResult>): Promise<boolean> => {
    if (isBusy) return false;
    setIsBusy(true);
    const isOk = apply(await action());
    setIsBusy(false);
    return isOk;
  };

  const openCount = view?.invites.filter((invite) => invite.status === 'open').length ?? 0;
  const finishedCount = view ? view.invites.length - openCount : 0;

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const labels = parseAliases(aliases);
    if (labels.length === 0) return;
    if (await run(() => createInvites(labels, cohort.trim() || DEFAULT_COHORT, days))) setAliases('');
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(inviteLink(window.location.origin, code));
      setCopiedCode(code);
    } catch {
      setMessage('Copy failed. Select the link and copy it by hand.');
    }
  };

  const handleLockOut = (uid: string, label: string) => {
    // Cuts the child off at once: confirm first
    if (window.confirm(`Lock ${label} out? They can no longer use the app.`)) void run(() => lockOutTester(uid));
  };

  return (
    <section className={CARD_CLASS} aria-labelledby="early-testers-title">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
          <UserPlus className="h-4 w-4" />
        </div>
        <div>
          <h2 id="early-testers-title" className="text-base font-extrabold text-slate-900 dark:text-white">
            Early testers{view && <> <span className="ms-1 text-sm font-bold text-teal-600 dark:text-teal-400">{view.testers.length} {view.testers.length === 1 ? 'account' : 'accounts'}</span></>}
          </h2>
          <p className={`mt-0.5 ${MUTED}`}>
            One single-use link per child. Send it to the parent only. Use aliases (first name or &quot;kid-3&quot;), never full names.
          </p>
          {view && (
            <p className={`mt-1 text-xs font-bold ${view.accessOpen ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {view.accessOpen ? 'Access is OPEN: anyone can sign up.' : 'Access is closed: only invited accounts can use the app.'}
            </p>
          )}
        </div>
      </div>

      <form className="mt-4 space-y-2" onSubmit={(event) => void handleCreate(event)}>
        <label className="sr-only" htmlFor="tester-aliases">
          Aliases, one per line
        </label>
        <textarea
          id="tester-aliases"
          rows={3}
          value={aliases}
          onChange={(event) => setAliases(event.target.value)}
          placeholder={'noa\ndana'}
          dir="ltr"
          className={`${INPUT_CLASS} w-full`}
        />
        <div className="flex flex-wrap items-end gap-2">
          <label className={MUTED}>
            Cohort
            <input type="text" value={cohort} maxLength={30} onChange={(event) => setCohort(event.target.value)} className={`${INPUT_CLASS} mt-1 block w-36`} />
          </label>
          <label className={MUTED}>
            Valid (days)
            <input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(event) => setDays(Math.min(90, Math.max(1, Math.round(Number(event.target.value) || DEFAULT_DAYS))))}
              className={`${INPUT_CLASS} mt-1 block w-24`}
            />
          </label>
          <button
            type="submit"
            disabled={isBusy || parseAliases(aliases).length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            <span>Create invites</span>
          </button>
        </div>
      </form>

      {message && (
        <p role="alert" className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
          {message}
        </p>
      )}

      {view === null ? (
        <p className={`mt-4 ${MUTED}`}>Loading…</p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Invites <span className={MUTED}>· {openCount} open{view.archivedInvites > 0 ? ` · ${view.archivedInvites} archived` : ''}</span>
            </h3>
            {finishedCount > 0 && (
              <button type="button" disabled={isBusy} className={SMALL_BTN} onClick={() => void run(archiveFinishedInvites)}>
                <Archive className="h-3 w-3" />
                <span>Archive {finishedCount} used or expired</span>
              </button>
            )}
          </div>
          {view.invites.length === 0 ? (
            <p className={MUTED}>No invites to show.</p>
          ) : (
            <ul className="mt-1 divide-y divide-slate-100 dark:divide-slate-800">
              {view.invites.map((invite) => (
                <li key={invite.code} className="flex items-center justify-between gap-2 py-2">
                  <span className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200" dir="ltr">
                    {invite.label} <span className={MUTED}>· {invite.cohort}</span>
                  </span>
                  <span className={`shrink-0 text-xs font-bold ${STATUS_CLASS[invite.status]}`}>
                    {invite.status === 'open' ? `open until ${new Date(invite.expiresAt).toLocaleDateString('en-GB')}` : invite.status}
                  </span>
                  {invite.status === 'open' && (
                    <>
                      <button type="button" className={SMALL_BTN} aria-label={`Copy link for ${invite.label}`} onClick={() => void handleCopy(invite.code)}>
                        <Copy className="h-3 w-3" />
                        <span>{copiedCode === invite.code ? 'Copied' : 'Copy link'}</span>
                      </button>
                      <button type="button" disabled={isBusy} className={SMALL_BTN} aria-label={`Withdraw invite for ${invite.label}`} onClick={() => void run(() => withdrawInvite(invite.code))}>
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-5 text-xs font-bold text-slate-900 dark:text-white">Allowed accounts</h3>
          {view.testers.length === 0 ? (
            <p className={MUTED}>Nobody has joined yet.</p>
          ) : (
            <ul className="mt-1 divide-y divide-slate-100 dark:divide-slate-800">
              {view.testers.map((tester) => (
                <li key={tester.uid} className="flex items-center justify-between gap-2 py-2">
                  <span className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200" dir="ltr">
                    {tester.label} <span className={MUTED}>· {tester.cohort}{tester.isGrandfathered ? ' · existing account' : ''}</span>
                  </span>
                  <button type="button" disabled={isBusy} className={SMALL_BTN} aria-label={`Lock ${tester.label} out`} onClick={() => handleLockOut(tester.uid, tester.label)}>
                    <X className="h-3 w-3" />
                    <span>Lock out</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};
