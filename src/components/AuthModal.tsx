import React, { useId, useRef, useState } from 'react';
import { ModalPortal } from './ModalPortal';
import { useDialog } from '../hooks/useDialog';
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import {
  AuthUserSummary,
  CloudSyncStatus,
  LearnerGender,
} from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { getHebrewCopy } from '../utils/hebrewGender';
import { normalizeIdentifierToEmail, usernameFromEmail } from '../utils/username';
import { APP_NAME } from '../config/appInfo';
import { saveGuestWithGoogle, saveGuestWithUsername } from '../services/accountService';
import { PrivacyNoticeDialog } from './privacy/PrivacyNoticeDialog';
import {
  X,
  Cloud,
  CheckCircle2,
  LogOut,
  UserPlus,
  LogIn,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/Button';

interface AuthModalProps {
  authUser: AuthUserSummary | null;
  syncStatus: CloudSyncStatus;
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  isMandatory?: boolean;
  onClose?: () => void;
  /** Signs out after the waiting cloud save, so the last changes aren't lost (App) */
  onSignOut: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  authUser,
  syncStatus,
  gender,
  learnerName,
  theme,
  isMandatory = false,
  onClose,
  onSignOut,
}) => {
  const isGirl = gender === 'girl';
  const heb = getHebrewCopy(gender, learnerName);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);
  const [successHe, setSuccessHe] = useState<string | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  // A guest signing out loses the account for good, so it asks first
  const [isConfirmingGuestSignOut, setIsConfirmingGuestSignOut] = useState(false);
  const [guestUsername, setGuestUsername] = useState('');
  const [guestPin, setGuestPin] = useState('');
  // Linking doesn't fire a sign-in change, so the saved state is kept here until the next load
  const [isGuestSaved, setIsGuestSaved] = useState(false);
  const isGuest = Boolean(authUser?.isAnonymous) && !isGuestSaved;

  const identifierInputId = useId();
  const pinInputId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  // The sign-in gate can't be dismissed; the cloud panel closes with Escape
  useDialog(dialogRef, { onClose: isMandatory ? undefined : onClose });

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) return;
    setIsBusy(true);
    setErrorHe(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessHe(
        isGirl
          ? 'התחברת בהצלחה עם Google! כל ההתקדמות שלך מסונכרנת לענן ☁️'
          : 'התחברת בהצלחה עם Google! כל ההתקדמות שלך מסונכרנת לענן ☁️'
      );
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch {
          setErrorHe('הדפדפן חסם את חלון ההתחברות של Google. אשרו חלונות קופצים או התחברו עם שם משתמש וסיסמה.');
        }
      } else if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        setErrorHe('חלון ההתחברות נסגר לפני סיום הפעולה.');
      } else if (code === 'auth/unauthorized-domain') {
        setErrorHe(
          `הדומיין (${window.location.hostname}) טרם אושר ב-Firebase Auth. נסו לרענן את העמוד או להשתמש בשם משתמש וסיסמה.`
        );
      } else {
        setErrorHe('לא הצלחנו להתחבר עם Google. בדקו את החיבור או נסו שם משתמש וסיסמה.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleUsernameOrEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    if (!identifier.trim()) {
      setErrorHe(
        isGirl
          ? 'אנא הקלידי שם משתמש באנגלית או כתובת אימייל.'
          : 'אנא הקלד שם משתמש באנגלית או כתובת אימייל.'
      );
      return;
    }

    if (secretPin.trim().length < 6) {
      setErrorHe('הקוד הסודי / סיסמה חייבים להכיל לפחות 6 תווים או ספרות.');
      return;
    }

    setIsBusy(true);
    setErrorHe(null);
    setSuccessHe(null);

    const emailToUse = normalizeIdentifierToEmail(identifier);

    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(
          auth,
          emailToUse,
          secretPin.trim()
        );
        if (learnerName.trim()) {
          await updateProfile(cred.user, { displayName: learnerName.trim() });
        }
        setSuccessHe(
          isGirl
            ? 'החשבון נוצר והכוכבים והיהלומים שלך סונכרנו לענן! 🎉'
            : 'החשבון נוצר והכוכבים והיהלומים שלך סונכרנו לענן! 🎉'
        );
      } else {
        await signInWithEmailAndPassword(auth, emailToUse, secretPin.trim());
        setSuccessHe(
          isGirl
            ? 'ברוכה השבה! הפרופיל שלך סונכרן מהענן בהצלחה ☁️'
            : 'ברוך השב! הפרופיל שלך סונכרן מהענן בהצלחה ☁️'
        );
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorHe(
          isGirl
            ? 'שם המשתמש או האימייל הזה כבר קיימים — עברי ללשונית "התחברות"!'
            : 'שם המשתמש או האימייל הזה כבר קיימים — עבור ללשונית "התחברות"!'
        );
      } else if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        setErrorHe('שם המשתמש או הקוד הסודי אינם נכונים, או שהחשבון טרם נוצר.');
      } else {
        setErrorHe('אירעה שגיאה בהתחברות. ודאו שחיבור האינטרנט תקין.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleAnonymousCloudSync = async () => {
    if (!auth) return;
    setIsBusy(true);
    setErrorHe(null);
    try {
      await signInAnonymously(auth);
      setSuccessHe('חשבון אורח הופעל! כדי לא לאבד את ההתקדמות, כדאי לשמור אותו עם Google או שם משתמש.');
    } catch {
      setErrorHe('לא ניתן להפעיל חשבון אורח כרגע.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveGuest = async (method: 'google' | 'username') => {
    setIsBusy(true);
    setErrorHe(null);
    setSuccessHe(null);
    const result =
      method === 'google' ? await saveGuestWithGoogle() : await saveGuestWithUsername(guestUsername, guestPin, learnerName);
    setIsBusy(false);
    if (result.ok) {
      setIsGuestSaved(true);
      setIsConfirmingGuestSignOut(false);
      setSuccessHe('החשבון נשמר! מעכשיו אפשר להיכנס אליו מכל מכשיר, וכל ההתקדמות נשארה ☁️');
    } else {
      setErrorHe(result.errorHe);
    }
  };

  const handleLogOut = async () => {
    if (!auth) return;
    if (isGuest && !isConfirmingGuestSignOut) {
      setIsConfirmingGuestSignOut(true);
      return;
    }
    setIsBusy(true);
    setErrorHe(null);
    try {
      // The progress stays in the cloud and comes back at the next sign-in (a guest's is gone)
      await onSignOut();
    } catch {
      setErrorHe('אירעה שגיאה בהתנתקות.');
    } finally {
      setIsBusy(false);
    }
  };

  const formatUserLabel = (u: AuthUserSummary): string => {
    if (u.isAnonymous) return `Guest Cloud (${u.uid.slice(0, 6)})`;
    const username = usernameFromEmail(u.email);
    if (username) return username;
    return u.displayName || u.email || learnerName || 'Learner';
  };

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={isMandatory && !authUser ? 'התחברות' : 'חשבון וסנכרון'}
        className={`outline-none w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {/* Top Modal Header */}
        <div
          className={`px-6 py-4 ${theme.hudBgClass} flex items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${theme.primaryBtnClass}`}
            >
              {syncStatus === 'synced' ? (
                <Cloud className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base md:text-lg font-extrabold">
                {isMandatory && !authUser ? <>🔐 התחברות ל־<bdi>{APP_NAME}</bdi></> :'☁️ סנכרון ענן וחשבון רב-מכשירים'}
                {/* English on its own isolated line, so it can't flip or wrap into the Hebrew title */}
                <bdi className="block text-xs font-bold opacity-70 text-right">
                  {isMandatory && !authUser ? 'Sign In Required' : 'Cloud Sync'}
                </bdi>
              </h2>
              <p className={`text-xs ${theme.mutedTextClass}`}>
                {authUser
                  ? heb.loggedInAs(formatUserLabel(authUser))
                  : 'יש להתחבר לחשבון או לפתוח חשבון חדש כדי להמשיך'}
              </p>
            </div>
          </div>

          {!isMandatory && onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl ${theme.secondaryBtnClass}`}
              aria-label="סגירה"
              title="סגירה"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          <p className={`text-xs md:text-sm ${theme.mutedTextClass}`}>
            {isMandatory && !authUser
              ? 'ברוכים הבאים! התחברו עם חשבון Google או עם שם משתמש וקוד סודי כדי לשמור ולסנכרן את כל הכוכבים, היהלומים וההתקדמות שלכם.'
              : heb.cloudSyncModalSubtitle}
          </p>

          {/* Status Messages */}
          {errorHe && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs font-extrabold flex items-center gap-2 text-rose-600 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorHe}</span>
            </div>
          )}

          {successHe && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successHe}</span>
            </div>
          )}

          {/* Authenticated User View */}
          {authUser && (
            <div className={`p-5 rounded-2xl ${theme.cardBgClass} space-y-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>מסונכרן בזמן אמת <bdi>(Real-time Firestore Sync)</bdi></span>
                  </span>
                  <div className="text-base font-extrabold" dir="ltr" lang="en">
                    Logged in as: {formatUserLabel(authUser)}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeClass}`}>
                  {authUser.isAnonymous ? 'Guest Cloud' : 'Cloud Account'}
                </span>
              </div>

              <p className={`text-xs ${theme.mutedTextClass}`}>
                {isGirl
                  ? 'תוכלי להיכנס עם אותו החשבון מהטלפון או מהמחשב הנייד, וכל הכוכבים והיהלומים שלך יופיעו מיד!'
                  : 'תוכל להיכנס עם אותו החשבון מהטלפון או מהמחשב הנייד, וכל הכוכבים והיהלומים שלך יופיעו מיד!'}
              </p>

              {isGuest && (
                <div className="p-3.5 rounded-2xl border border-amber-500/50 bg-amber-500/10 space-y-2.5">
                  <p className="text-xs sm:text-sm font-extrabold">
                    זה חשבון אורח: אם תתנתקו או תחליפו מכשיר בלי לשמור אותו, ההתקדמות תאבד.
                  </p>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleSaveGuest('google')}
                    className={`w-full min-h-11 rounded-xl text-xs sm:text-sm font-extrabold ${theme.primaryBtnClass}`}
                  >
                    🌐 שמירה עם חשבון Google
                  </button>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveGuest('username');
                    }}
                    className="space-y-2"
                  >
                    <label className="block text-xs font-bold">
                      או שם משתמש באנגלית:
                      <input
                        type="text"
                        dir="ltr" lang="en"
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={guestUsername}
                        onChange={(e) => setGuestUsername(e.target.value)}
                        className={`mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`}
                      />
                    </label>
                    <label className="block text-xs font-bold">
                      וקוד סודי (לפחות 6 תווים):
                      <input
                        type="password"
                        dir="ltr" lang="en"
                        autoComplete="new-password"
                        value={guestPin}
                        onChange={(e) => setGuestPin(e.target.value)}
                        className={`mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={isBusy}
                      className={`w-full min-h-11 rounded-xl text-xs sm:text-sm font-extrabold ${theme.secondaryBtnClass}`}
                    >
                      שמירה עם שם משתמש וקוד סודי
                    </button>
                  </form>
                </div>
              )}

              {isConfirmingGuestSignOut && (
                <p role="alert" className="text-xs sm:text-sm font-extrabold text-rose-700 dark:text-rose-300">
                  בטוח? חשבון אורח שלא נשמר נמחק בהתנתקות, עם כל ההתקדמות. לחיצה נוספת תנתק.
                </p>
              )}

              <Button theme={theme} variant="secondary" size="lg" className="w-full" disabled={isBusy} onClick={handleLogOut}>
                <LogOut className="w-4 h-4" />
                <span>{isConfirmingGuestSignOut ? 'להתנתק בכל זאת' : 'התנתקות מהחשבון'}</span>
              </Button>
            </div>
          )}

          {/* Not Logged In (Sign In / Create Account Options) */}
          {!authUser && (
            <div className="space-y-4">
              {/* Option 1: 1-Tap Google Sign-In */}
              <Button theme={theme} size="lg" className="w-full" disabled={isBusy} onClick={handleGoogleSignIn}>
                <span>🌐</span>
                <span>התחברות מהירה בלחיצה אחת עם Google</span>
              </Button>

              <div className="flex items-center gap-3 text-xs opacity-60">
                <div className="h-px flex-1 bg-current" />
                <span>או עם שם משתמש וקוד סודי</span>
                <div className="h-px flex-1 bg-current" />
              </div>

              {/* Mode Switcher: Login vs Register */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorHe(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 ${
                    mode === 'login' ? theme.primaryBtnClass : theme.secondaryBtnClass
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>התחברות לחשבון קיים</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorHe(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 ${
                    mode === 'register'
                      ? theme.primaryBtnClass
                      : theme.secondaryBtnClass
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>פתיחת חשבון חדש</span>
                </button>
              </div>

              {/* Option 2: Kid-Friendly Username/Email + PIN/Password Form */}
              <form onSubmit={handleUsernameOrEmailAuth} className="space-y-3">
                <div>
                  <label htmlFor={identifierInputId} className="block text-xs font-bold mb-1">
                    שם משתמש באנגלית או אימייל <bdi>(Username or Email)</bdi>:
                  </label>
                  <input
                    id={identifierInputId}
                    type="text"
                    dir="ltr" lang="en"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. noa12 or noa@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-bold outline-none ${theme.inputBgClass}`}
                  />
                </div>

                <div>
                  <label htmlFor={pinInputId} className="block text-xs font-bold mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>קוד סודי / סיסמה (לפחות 6 ספרות או אותיות):</span>
                  </label>
                  <input
                    id={pinInputId}
                    type="password"
                    dir="ltr" lang="en"
                    value={secretPin}
                    onChange={(e) => setSecretPin(e.target.value)}
                    placeholder="••••••"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-bold outline-none ${theme.inputBgClass}`}
                  />
                </div>

                <Button theme={theme} size="lg" className="w-full" type="submit" disabled={isBusy}>
                  {mode === 'register'
                    ? 'יצירת חשבון וסנכרון ההתקדמות לענן 🚀'
                    : 'התחברות וסנכרון מהענן ☁️'}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-xs underline opacity-75 hover:opacity-100"
                >
                  🔒 פרטיות ומידע להורים
                </button>
              </div>

              {!isMandatory && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleAnonymousCloudSync}
                    className="text-xs underline opacity-75 hover:opacity-100"
                  >
                    המשך עם גיבוי ענן מהיר ללא סיסמה <bdi>(Guest Cloud)</bdi>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isPrivacyOpen && <PrivacyNoticeDialog theme={theme} onClose={() => setIsPrivacyOpen(false)} />}
    </div>
    </ModalPortal>
  );
};
