import React, { useEffect, useRef, useState } from 'react';

interface RemoveTesterDialogProps {
  /** The alias or username the owner has to type */
  expected: string;
  kind: 'alias' | 'username';
  isBusy: boolean;
  onConfirm: (typed: string) => void;
  onCancel: () => void;
}

/**
 * Last stop before a tester's sign-in and data are deleted for good. Deleting needs the exact
 * alias/username typed, so a stray click (or Enter) can never remove anyone.
 */
export const RemoveTesterDialog: React.FC<RemoveTesterDialogProps> = ({ expected, kind, isBusy, onConfirm, onCancel }) => {
  const [typed, setTyped] = useState('');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const isMatch = typed.trim() === expected;

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isMatch && !isBusy) onConfirm(typed.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={onCancel}>
      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-tester-title"
        aria-describedby="remove-tester-text"
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 id="remove-tester-title" className="text-base font-extrabold text-red-600 dark:text-red-400">
          Remove {expected} completely?
        </h2>
        <p id="remove-tester-text" className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          This deletes the sign-in and all of this tester&apos;s data (progress, friends, parent links, usage counters). Notes they sent
          stay, without a link to them. This cannot be undone.
        </p>
        <label className="mt-3 block text-xs font-bold text-slate-600 dark:text-slate-300">
          Type {expected} to confirm
          <input
            type="text"
            dir="ltr"
            value={typed}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setTyped(event.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">The {kind} must match exactly.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isMatch || isBusy}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete forever
          </button>
        </div>
      </form>
    </div>
  );
};
