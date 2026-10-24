import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import { getAccountKind } from '../../services/accountService';
import { hasLearnerProfile, isParentAccount, markParentAccount } from '../../services/parentService';
import { THEME_REGISTRY } from '../../themes/themeRegistry';
import { ParentHome } from './ParentHome';

interface ParentPortalProps {
  /** The code from the link (`/?parent=CODE`), when there is one */
  initialCode: string | null;
}

const theme = THEME_REGISTRY['cozy-studio'];

type AccountCheck = 'checking' | 'ok' | 'not-google' | 'is-learner' | 'error';

const messageClass = 'p-5 rounded-3xl text-center space-y-3';

async function checkParentAccount(user: User): Promise<AccountCheck> {
  if (getAccountKind(user) !== 'google') return 'not-google';
  try {
    // A Google learner has a profile; a real parent account has the marker instead
    if ((await hasLearnerProfile(user.uid)) && !(await isParentAccount(user.uid))) return 'is-learner';
    await markParentAccount(user.uid);
    return 'ok';
  } catch {
    return 'error';
  }
}

/**
 * The parent area (`/?parent`): a parent signs in with their own Google account, joins a learner
 * with the code from the learner's settings, and reads the learner's weekly report. It is separate
 * from the learner app and never creates a learner profile.
 */
export const ParentPortal: React.FC<ParentPortalProps> = ({ initialCode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [check, setCheck] = useState<AccountCheck>('checking');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return undefined;
    }
    return onAuthStateChanged(auth, (next) => {
      setCheck('checking');
      setUser(next);
    });
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    let isCancelled = false;
    void checkParentAccount(user).then((result) => {
      if (!isCancelled) setCheck(result);
    });
    return () => {
      isCancelled = true;
    };
  }, [user]);

  const handleSignIn = async () => {
    if (!auth || !googleProvider) return;
    setIsBusy(true);
    setErrorHe(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = (error as { code?: string })?.code || '';
      if (code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider).catch(() => setErrorHe('הדפדפן חסם את חלון ההתחברות של Google.'));
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setErrorHe('לא הצלחנו להתחבר עם Google. בדקו את החיבור ונסו שוב.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = () => {
    if (auth) void signOut(auth);
  };

  const shell = (children: React.ReactNode) => (
    <div className={`min-h-screen w-full ${theme.pageBgClass}`}>
      <main className="max-w-xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-extrabold">אזור הורים</h1>
        {children}
      </main>
    </div>
  );

  if (user === undefined || (user && check === 'checking')) {
    return shell(
      <p role="status" className="font-bold">
        טוענים…
      </p>
    );
  }

  if (!user) {
    return shell(
      <section className={`${messageClass} ${theme.cardBgClass}`}>
        <p className="font-bold text-sm">
          כאן הורים רואים דוח שבועי של ההתקדמות באנגלית. נכנסים עם חשבון Google של ההורה (לא של הילד או הילדה).
        </p>
        {initialCode && (
          <p className="text-sm font-bold">
            קוד ההורים: <span dir="ltr" lang="en" className="font-black tracking-widest">{initialCode}</span>
          </p>
        )}
        {errorHe && (
          <p role="alert" className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
            {errorHe}
          </p>
        )}
        <button
          type="button"
          disabled={isBusy || !auth}
          onClick={() => void handleSignIn()}
          className={`w-full min-h-11 p-2.5 rounded-2xl text-sm font-extrabold ${theme.primaryBtnClass}`}
        >
          כניסה עם Google
        </button>
        <a href="/" className="block text-xs underline opacity-75">
          חזרה לאפליקציה
        </a>
      </section>
    );
  }

  if (check === 'not-google' || check === 'is-learner' || check === 'error') {
    const text =
      check === 'is-learner'
        ? 'חשבון ה-Google הזה משמש כחשבון של לומד או לומדת. כדי להיות הורה צריך להיכנס עם חשבון Google אחר.'
        : check === 'not-google'
          ? 'מחוברים כרגע לחשבון של לומד או לומדת. כדי להיכנס כהורה צריך להתנתק ולהיכנס עם חשבון Google של ההורה.'
          : 'לא הצלחנו לבדוק את החשבון. בדקו את החיבור ונסו שוב.';
    return shell(
      <section role="alert" className={`${messageClass} ${theme.cardBgClass}`}>
        <p className="font-bold text-sm">{text}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className={`w-full min-h-11 p-2.5 rounded-2xl text-sm font-extrabold ${theme.secondaryBtnClass}`}
        >
          התנתקות
        </button>
      </section>
    );
  }

  return shell(<ParentHome user={user} theme={theme} initialCode={initialCode} onSignOut={handleSignOut} />);
};
