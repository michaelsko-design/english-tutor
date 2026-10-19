import React from 'react';
import { CloudOff, LogOut, RefreshCw } from 'lucide-react';
import { ThemeDefinition } from '../themes/themeRegistry';

interface CloudLoadErrorScreenProps {
  theme: ThemeDefinition;
  onRetry: () => void;
  onSignOut: () => void;
}

/**
 * Shown when the learner's progress couldn't be read from the cloud after sign-in. The app waits
 * here instead of opening onboarding with an empty profile, which would overwrite the progress.
 */
export const CloudLoadErrorScreen: React.FC<CloudLoadErrorScreenProps> = ({ theme, onRetry, onSignOut }) => (
  <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-6`}>
    <div role="alert" className={`max-w-sm w-full rounded-3xl p-6 text-center space-y-4 ${theme.cardBgClass}`}>
      <CloudOff className="w-12 h-12 mx-auto opacity-70" aria-hidden="true" />
      <h1 className="font-extrabold text-lg">לא הצלחנו לטעון את ההתקדמות שלך</h1>
      <p className={`text-sm ${theme.mutedTextClass}`}>
        כנראה שאין כרגע חיבור לאינטרנט. ההתקדמות שמורה בענן ולא נמחקה. בדקו את החיבור ונסו שוב.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={`w-full min-h-11 rounded-2xl font-extrabold flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        נסו שוב
      </button>
      <button
        type="button"
        onClick={onSignOut}
        className={`w-full min-h-11 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 ${theme.secondaryBtnClass}`}
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        יציאה מהחשבון
      </button>
    </div>
  </div>
);
