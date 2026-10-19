import React from 'react';
import { RefreshCw } from 'lucide-react';
import { THEME_REGISTRY } from '../themes/themeRegistry';
import { ThemeId } from '../types/learner';
import { Companion } from './companion/Companion';

const STORAGE_KEY = 'english_tutor_learner_profile_v2';
const COMPANION_SIZE = 140;

/** The learner's theme from the local profile copy; the boundary sits above the app's state. */
function readStoredThemeId(): ThemeId {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as { themeId?: ThemeId };
    return stored.themeId && stored.themeId in THEME_REGISTRY ? stored.themeId : 'cozy-studio';
  } catch {
    return 'cozy-studio';
  }
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches a render error anywhere in the app and shows the companion with a way back, instead
 * of a blank white page. Progress is saved in the cloud as it happens, so nothing is lost.
 */
export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('The app crashed while rendering:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;
    const theme = THEME_REGISTRY[readStoredThemeId()];
    return (
      <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-6`}>
        <div role="alert" className={`max-w-sm w-full rounded-3xl p-6 text-center space-y-4 ${theme.cardBgClass}`}>
          <div className="flex justify-center">
            <Companion theme={theme} pose="oops" size={COMPANION_SIZE} />
          </div>
          <h1 className="font-extrabold text-lg">אופס, משהו השתבש</h1>
          <p className={`text-sm ${theme.mutedTextClass}`}>ההתקדמות שלך שמורה. ננסה שוב?</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className={`w-full min-h-11 rounded-2xl font-extrabold flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            ננסה שוב
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`w-full min-h-11 rounded-2xl text-sm font-bold ${theme.secondaryBtnClass}`}
          >
            טעינה מחדש של האפליקציה
          </button>
        </div>
      </div>
    );
  }
}
