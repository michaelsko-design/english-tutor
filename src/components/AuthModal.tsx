import React, { useEffect, useRef, useState } from 'react';
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
import { SignInPanel } from './auth/SignInPanel';
import { CredentialMode, credentialErrorHe, validateCredentials } from './auth/credentialValidation';
import { APP_NAME } from '../config/appInfo';
import { AppLogo } from './AppLogo';
import { saveGuestWithGoogle, saveGuestWithUsername } from '../services/accountService';
import { PrivacyNoticeDialog } from './privacy/PrivacyNoticeDialog';
import {
  X,
  Cloud,
  CheckCircle2,
  LogOut,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { Button } from './ui/Button';
import { trackFunnel } from '../services/analytics/funnel';

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

  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);
  const [successHe, setSuccessHe] = useState<string | null>(null);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  // A guest signing out loses the account for good, so it asks first
  const [isConfirmingGuestSignOut, setIsConfirmingGuestSignOut] = useState(false);
  const [guestUsername, setGuestUsername] = useState('');
  const [guestPin, setGuestPin] = useState('');
  // Linking doesn't fire a sign-in change, so the saved state is kept here until the next load
  const [isGuestSaved, setIsGuestSaved] = useState(false);
  const isGuest = Boolean(authUser?.isAnonymous) && !isGuestSaved;

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

  const clearMessages = () => {
    setErrorHe(null);
    setSuccessHe(null);
    setIsUsernameTaken(false);
  };

  const handleCredentials = async (mode: CredentialMode, username: string, password: string) => {
    if (!auth) return;
    clearMessages();
    const invalidHe = validateCredentials(mode, username, password);
    if (invalidHe) {
      setErrorHe(invalidHe);
      return;
    }

    setIsBusy(true);
    const emailToUse = normalizeIdentifierToEmail(username);
    try {
      if (mode === 'new') {
        const cred = await createUserWithEmailAndPassword(auth, emailToUse, password.trim());
        if (learnerName.trim()) {
          await updateProfile(cred.user, { displayName: learnerName.trim() });
        }
        trackFunnel('signup_done');
        setSuccessHe('החשבון נוצר! 🎉');
      } else {
        await signInWithEmailAndPassword(auth, emailToUse, password.trim());
        setSuccessHe(isGirl ? 'ברוכה השבה! ☁️' : 'ברוך השב! ☁️');
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/email-already-in-use') {
        setIsUsernameTaken(true);
        trackFunnel('signup_name_taken');
        setErrorHe('השם הזה כבר תפוס. אם זה החשבון שלך, אפשר להיכנס איתו. אם לא, בחרו שם אחר.');
      } else {
        if (mode === 'new') trackFunnel('signup_error');
        setErrorHe(credentialErrorHe(code));
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

  // The sign-in gate: no account yet, and the app can't be used without one
  const isGate = isMandatory && !authUser;
  useEffect(() => {
    if (isGate) trackFunnel('gate_view');
  }, [isGate]);

  const statusMessages = (
    <>
      {errorHe && (
        <div role="alert" className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs sm:text-sm font-extrabold flex items-center gap-2 text-rose-600 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorHe}</span>
        </div>
      )}

      {successHe && (
        <div role="status" className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs sm:text-sm font-extrabold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successHe}</span>
        </div>
      )}
    </>
  );

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={isGate ? 'התחברות' : 'חשבון וסנכרון'}
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
              {isGate ? (
                <AppLogo size={36} />
              ) : syncStatus === 'synced' ? (
                <Cloud className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
            </div>
            <div>
              {isGate ? (
                <h2 className="text-lg md:text-xl font-extrabold">
                  ברוכים הבאים ל־<bdi>{APP_NAME}</bdi>!
                </h2>
              ) : (
                <>
                  <h2 className="text-base md:text-lg font-extrabold">
                    ☁️ סנכרון ענן וחשבון רב-מכשירים
                    {/* English on its own isolated line, so it can't flip or wrap into the Hebrew title */}
                    <bdi className="block text-xs font-bold opacity-70 text-right">Cloud Sync</bdi>
                  </h2>
                  <p className={`text-xs ${theme.mutedTextClass}`}>
                    {authUser ? heb.loggedInAs(formatUserLabel(authUser)) : 'אפשר להתחבר או לפתוח חשבון חדש'}
                  </p>
                </>
              )}
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
          {!isGate && <p className={`text-xs md:text-sm ${theme.mutedTextClass}`}>{heb.cloudSyncModalSubtitle}</p>}

          {authUser && statusMessages}

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

          {/* Not signed in: a child signs in or opens an account; a parent is sent to the parent area */}
          {!authUser && (
            <div className="space-y-4">
              <SignInPanel
                theme={theme}
                isBusy={isBusy}
                showAudienceSwitch={isMandatory}
                isUsernameTaken={isUsernameTaken}
                messages={statusMessages}
                onGoogle={() => void handleGoogleSignIn()}
                onSubmitCredentials={(mode, username, password) => void handleCredentials(mode, username, password)}
                onClearMessages={clearMessages}
              />

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
