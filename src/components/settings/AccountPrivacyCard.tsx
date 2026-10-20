import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { Download, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { deleteAccount, downloadProfileJson, getAccountKind } from '../../services/accountService';
import { PrivacyNoticeDialog } from '../privacy/PrivacyNoticeDialog';

interface AccountPrivacyCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
}

const DELETE_CONFIRM_WORD = 'מחיקה';

/**
 * Settings: the privacy notice, a download of all the learner's data, and deleting the account.
 * Deleting asks for the confirm word, plus the PIN (or Google again) so a parent decides it.
 */
export const AccountPrivacyCard: React.FC<AccountPrivacyCardProps> = ({ profile, theme }) => {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmWord, setConfirmWord] = useState('');
  const [pin, setPin] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);
  // A guest signing out loses the account for good, so it asks first
  const [isConfirmingGuestSignOut, setIsConfirmingGuestSignOut] = useState(false);

  const user = auth?.currentUser ?? null;
  const isGuest = Boolean(user?.isAnonymous);
  const accountKind = user ? getAccountKind(user) : null;
  const canDelete = confirmWord.trim() === DELETE_CONFIRM_WORD && (accountKind !== 'password' || pin.trim().length >= 6);

  const handleDelete = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await deleteAccount(profile.friendsHub?.friendCode, pin.trim());
    // On success the sign-in ends and the app returns to the sign-in screen
    if (!result.ok) {
      setErrorHe(result.errorHe);
      setIsBusy(false);
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
      await signOut(auth);
    } catch {
      setErrorHe('אירעה שגיאה בהתנתקות.');
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      {user && (
        <>
          {isConfirmingGuestSignOut && (
            <p role="alert" className="text-xs sm:text-sm font-extrabold text-rose-700 dark:text-rose-300">
              בטוחים? חשבון אורח שלא נשמר נמחק בהתנתקות, עם כל ההתקדמות. לחיצה נוספת תנתק.
            </p>
          )}
          <button
            type="button"
            disabled={isBusy}
            onClick={handleLogOut}
            className={`w-full min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 ${theme.secondaryBtnClass}`}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            {isConfirmingGuestSignOut ? 'להתנתק בכל זאת' : 'התנתקות מהחשבון'}
          </button>
        </>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsNoticeOpen(true)}
          className={`min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          פרטיות ומידע
        </button>
        <button
          type="button"
          onClick={() => downloadProfileJson(profile)}
          className={`min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          הורדת הנתונים
        </button>
      </div>

      {!isDeleteOpen ? (
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="w-full min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 border border-rose-500/50 text-rose-700 dark:text-rose-300"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          מחיקת החשבון
        </button>
      ) : (
        <div className="p-3.5 rounded-2xl border border-rose-500/50 bg-rose-500/10 space-y-2.5">
          <p className="text-xs sm:text-sm font-bold">
            מחיקת החשבון מוחקת לצמיתות את כל ההתקדמות, החברים והתחרויות. אי אפשר לבטל אותה. כדאי שהורה יאשר.
          </p>
          <label className="block text-xs font-bold">
            כדי לאשר, כתבו <span className="font-black">{DELETE_CONFIRM_WORD}</span>:
            <input
              type="text"
              value={confirmWord}
              onChange={(e) => setConfirmWord(e.target.value)}
              className={`mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`}
            />
          </label>
          {accountKind === 'password' && (
            <label className="block text-xs font-bold">
              הקוד הסודי של החשבון:
              <input
                type="password"
                dir="ltr" lang="en"
                autoComplete="current-password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className={`mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`}
              />
            </label>
          )}
          {accountKind === 'google' && (
            <p className={`text-xs ${theme.mutedTextClass}`}>לפני המחיקה ייפתח חלון של Google לאישור החשבון.</p>
          )}
          {errorHe && (
            <p role="alert" className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
              {errorHe}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!canDelete || isBusy}
              onClick={handleDelete}
              className="flex-1 min-h-11 rounded-2xl text-sm font-extrabold bg-rose-600 text-white disabled:opacity-50"
            >
              {isBusy ? 'מוחקים…' : 'מחיקה לצמיתות'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDeleteOpen(false);
                setConfirmWord('');
                setPin('');
                setErrorHe(null);
              }}
              className={`min-h-11 px-4 rounded-2xl text-sm font-extrabold ${theme.secondaryBtnClass}`}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {isNoticeOpen && <PrivacyNoticeDialog theme={theme} onClose={() => setIsNoticeOpen(false)} />}
    </div>
  );
};
