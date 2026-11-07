import React, { useEffect, useRef, useState } from 'react';
import { KeyRound, LogOut } from 'lucide-react';
import { ThemeDefinition } from '../themes/themeRegistry';
import {
  isCompleteAccessCode,
  normalizeAccessCode,
  redeemAccessCode,
  readPendingAccessCode,
} from '../services/accessService';

interface AccessGateScreenProps {
  theme: ThemeDefinition;
  /** Called once the code is accepted: the app then loads the learner's profile again */
  onRedeemed: () => void;
  onSignOut: () => void;
}

/**
 * Closed early-tester phase: an account that is not allowed yet lands here instead of the app.
 * A code from the invite link is sent at once; otherwise the learner (or parent) types it in.
 */
export const AccessGateScreen: React.FC<AccessGateScreenProps> = ({ theme, onRedeemed, onSignOut }) => {
  const [code, setCode] = useState<string>(() => readPendingAccessCode() ?? '');
  const [errorHe, setErrorHe] = useState<string>('');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const hasAutoSubmitted = useRef<boolean>(false);

  const submit = async (value: string): Promise<void> => {
    if (!isCompleteAccessCode(value) || isBusy) return;
    setIsBusy(true);
    setErrorHe('');
    const result = await redeemAccessCode(value);
    setIsBusy(false);
    if (result.ok) onRedeemed();
    else setErrorHe(result.errorHe);
  };

  useEffect(() => {
    if (hasAutoSubmitted.current || !isCompleteAccessCode(code)) return;
    hasAutoSubmitted.current = true;
    void submit(code);
    // Runs once for a code that came with the link
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-6`}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(code);
        }}
        className={`max-w-sm w-full rounded-3xl p-6 text-center space-y-4 ${theme.cardBgClass}`}
      >
        <KeyRound className="w-12 h-12 mx-auto opacity-70" aria-hidden="true" />
        <h1 className="font-extrabold text-lg">האפליקציה בבדיקות סגורות</h1>
        <p className={`text-sm ${theme.mutedTextClass}`}>
          כרגע רק משפחות שהוזמנו יכולות להשתמש בה. הזינו את קוד ההזמנה שקיבלתם, או פתחו שוב את הקישור האישי.
        </p>
        <label className="block text-start text-sm font-bold" htmlFor="access-code">
          קוד הזמנה
        </label>
        <input
          id="access-code"
          dir="ltr"
          lang="en"
          autoComplete="off"
          autoCapitalize="characters"
          inputMode="text"
          value={code}
          onChange={(event) => setCode(normalizeAccessCode(event.target.value))}
          className="w-full min-h-11 rounded-2xl border-2 border-current/20 bg-transparent px-4 text-center text-lg font-extrabold tracking-widest"
        />
        {errorHe && (
          <p role="alert" className="text-sm font-bold text-red-600 dark:text-red-400">
            {errorHe}
          </p>
        )}
        <button
          type="submit"
          disabled={!isCompleteAccessCode(code) || isBusy}
          className={`w-full min-h-11 rounded-2xl font-extrabold disabled:opacity-50 ${theme.primaryBtnClass}`}
        >
          {isBusy ? 'בודקים…' : 'כניסה'}
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className={`w-full min-h-11 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 ${theme.secondaryBtnClass}`}
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          יציאה מהחשבון
        </button>
      </form>
    </div>
  );
};
