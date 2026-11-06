import React, { useCallback, useEffect, useState } from 'react';
import { FlaskConical, Plus, RefreshCw, X } from 'lucide-react';
import { addTestUser, fetchTestUsers, removeTestUser, type TestUserEntry, type TestUsersResult } from '../../services/ownerTestUsersService';

const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90';

interface TestAccountsCardProps {
  /** Called after the list changed, so the numbers above are reloaded without it */
  onChanged: () => void;
}

/** The owner's list of test accounts: they are left out of every number on the dashboard. */
export const TestAccountsCard: React.FC<TestAccountsCardProps> = ({ onChanged }) => {
  const [users, setUsers] = useState<TestUserEntry[] | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apply = useCallback(
    (result: TestUsersResult, isChange: boolean): boolean => {
      if (!result.ok) {
        setMessage(result.message);
        return false;
      }
      setUsers(result.users);
      setMessage(null);
      if (isChange) onChanged();
      return true;
    },
    [onChanged]
  );

  useEffect(() => {
    let isCancelled = false;
    void fetchTestUsers().then((result) => {
      if (!isCancelled) apply(result, false);
    });
    return () => {
      isCancelled = true;
    };
  }, [apply]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = identifier.trim();
    if (!value || isBusy) return;
    setIsBusy(true);
    if (apply(await addTestUser(value), true)) setIdentifier('');
    setIsBusy(false);
  };

  const handleRemove = async (uid: string) => {
    if (isBusy) return;
    setIsBusy(true);
    apply(await removeTestUser(uid), true);
    setIsBusy(false);
  };

  return (
    <section className={CARD_CLASS} aria-labelledby="test-accounts-title">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <FlaskConical className="h-4 w-4" />
        </div>
        <div>
          <h2 id="test-accounts-title" className="text-base font-extrabold text-slate-900 dark:text-white">
            Test accounts
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Left out of every number on this page, so it shows real users only. Add a learner by username, a parent or learner by
            Google email, or by uid.
          </p>
        </div>
      </div>

      <form className="mt-4 flex gap-2" onSubmit={(event) => void handleAdd(event)}>
        <label className="sr-only" htmlFor="test-account-input">
          Username, email or uid
        </label>
        <input
          id="test-account-input"
          type="text"
          value={identifier}
          maxLength={120}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Username, email or uid"
          onChange={(event) => setIdentifier(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={isBusy || !identifier.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBusy ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          <span>Add</span>
        </button>
      </form>

      {message && (
        <p role="alert" className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
          {message}
        </p>
      )}

      <div className="mt-4">
        {users === null ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No test accounts yet. Every account is counted.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((entry) => (
              <li key={entry.uid} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.label}</span>
                <button
                  type="button"
                  disabled={isBusy}
                  aria-label={`Count ${entry.label} again`}
                  title="Count this account again"
                  onClick={() => void handleRemove(entry.uid)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                  <span>Remove</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
