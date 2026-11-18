import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import type { LearnerProfile } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { enableReminder, getNotificationPermission, getReminderSupport, isReminderOn } from '../../services/push/pushSubscription';
import { trackReminderDeclined, trackReminderResult } from '../../services/push/reminderOptIn';
import { getReminderFacts } from '../../hooks/useReminderSync';
import { useDialog } from '../../hooks/useDialog';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { applyReminderReward, REMINDER_REWARD_DIAMONDS } from '../../data/reminderReward';
import { markReminderReaskSeen } from '../../data/reminderReask';
import { toLocalDateStr } from '../../utils/dates';
import { Companion } from '../companion/Companion';
import { Button } from '../ui/Button';
import { SHEET_OVERLAY_CLASS, SHEET_PANEL_WIDE_CLASS } from '../ui/sheetLayout';

interface ReminderReaskSheetProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onClose: () => void;
}

type ReaskView = 'checking' | 'ask' | 'install';

/**
 * The one-time second ask for the daily reminder (data/reminderReask.ts), after a mission on a later
 * day, for a learner who said "not now" on the first-win screen. On iPhone outside the Home Screen
 * app it shows the install step instead. Whatever happens, it is marked as shown and never returns.
 */
export const ReminderReaskSheet: React.FC<ReminderReaskSheetProps> = ({ profile, theme, onUpdateProfile, onClose }) => {
  const sheetRef = useRef<HTMLElement>(null);
  const isReducedMotion = usePrefersReducedMotion();
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const support = getReminderSupport();
  const isBlocked = getNotificationPermission() === 'denied';
  const [view, setView] = useState<ReaskView>('checking');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  const finish = (updated: LearnerProfile) => {
    onUpdateProfile(markReminderReaskSeen(updated));
    onClose();
  };

  useDialog(sheetRef, { onClose: () => finish(profile) });

  useEffect(() => {
    if (!uid) {
      onClose();
      return undefined;
    }
    if (support === 'unsupported' || isBlocked) {
      finish(profile);
      return undefined;
    }
    if (support === 'needs-install') {
      setView('install');
      return undefined;
    }
    let isCancelled = false;
    isReminderOn(uid)
      .then((isOn) => {
        if (isCancelled) return;
        if (isOn) finish(profile);
        else setView('ask');
      })
      .catch(() => {
        if (!isCancelled) onClose();
      });
    return () => {
      isCancelled = true;
    };
    // Decided once, when the sheet opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!uid || view === 'checking') return null;

  const handleEnable = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await enableReminder(uid, getReminderFacts(profile));
    setIsBusy(false);
    trackReminderResult('reask', result);
    if (!result.ok) {
      setErrorHe(result.errorHe);
      return;
    }
    finish(applyReminderReward(profile));
  };

  const handleNotNow = () => {
    trackReminderDeclined();
    finish({ ...profile, reminderDeclinedAtStr: toLocalDateStr(new Date()) });
  };

  return createPortal(
    <div className={`${SHEET_OVERLAY_CLASS} z-[80]`} role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={() => finish(profile)} aria-hidden="true" />
      <section
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-reask-title"
        className={`relative w-full max-w-md rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-3 text-center outline-none ${SHEET_PANEL_WIDE_CLASS} ${theme.cardBgClass} ${
          isReducedMotion ? '' : 'animate-sheet-up'
        }`}
      >
        <div className="flex justify-center">
          <Companion theme={theme} pose="cheer" size={88} />
        </div>
        <h2 id="reminder-reask-title" className="text-lg font-extrabold flex items-center justify-center gap-1.5">
          <Bell className="w-5 h-5" aria-hidden="true" />
          הולך לכם מצוין! רוצים תזכורת?
        </h2>
        {view === 'install' ? (
          <>
            <p className={`text-sm font-bold ${theme.mutedTextClass}`}>
              להורים: הודעה קטנה פעם ביום אם עוד לא תרגלנו. באייפון ובאייפד צריך קודם להוסיף את האפליקציה למסך הבית (כפתור
              השיתוף, ואז <bdi dir="ltr" lang="en">Add to Home Screen</bdi>), ולפתוח אותה משם.
            </p>
            <Button theme={theme} size="lg" className="w-full" onClick={() => finish(profile)}>
              הבנתי
            </Button>
          </>
        ) : (
          <>
            <p className={`text-sm font-bold ${theme.mutedTextClass}`}>
              להורים: הודעה קטנה פעם ביום, רק אם עוד לא תרגלנו, כדי לשמור על הרצף. לא חובה, ואפשר לכבות בהגדרות.
              {!profile.hasEarnedReminderReward && ` מתנה: ${REMINDER_REWARD_DIAMONDS} יהלומים 💎`}
            </p>
            {errorHe && (
              <p role="alert" className="text-xs font-bold text-red-600 dark:text-red-400">
                {errorHe}
              </p>
            )}
            <Button theme={theme} size="lg" className="w-full" onClick={handleEnable} disabled={isBusy}>
              כן, להפעיל תזכורת
            </Button>
            <Button theme={theme} variant="secondary" className="w-full" onClick={handleNotNow} disabled={isBusy}>
              לא עכשיו
            </Button>
          </>
        )}
      </section>
    </div>,
    document.body
  );
};
