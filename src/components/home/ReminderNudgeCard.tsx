import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { enableReminder, getReminderSupport, isReminderOn } from '../../services/push/pushSubscription';
import { getReminderFacts } from '../../hooks/useReminderSync';
import { applyReminderReward, REMINDER_REWARD_DIAMONDS } from '../../data/reminderReward';
import { Button } from '../ui/Button';
import { dismissReminderNudge, isReminderNudgeDismissed } from './reminderNudge';

interface ReminderNudgeCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
}

/**
 * A small, closable home card offering the daily practice reminder. It shows only for a signed-in
 * (not guest) learner on a device that can receive it and has not turned it on, never gates
 * anything, and stays away once closed on this device. On iPhone/iPad outside the Home Screen app it
 * explains how to install first. The same switch is always in the settings.
 */
export const ReminderNudgeCard: React.FC<ReminderNudgeCardProps> = ({ profile, theme, onUpdateProfile }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const support = getReminderSupport();
  const [isVisible, setIsVisible] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !profile.isOnboarded || support === 'unsupported' || isReminderNudgeDismissed(uid)) return undefined;
    if (support === 'needs-install') {
      setIsVisible(true);
      return undefined;
    }
    let isCancelled = false;
    void isReminderOn(uid).then((isOn) => {
      if (!isCancelled) setIsVisible(!isOn);
    });
    return () => {
      isCancelled = true;
    };
  }, [uid, profile.isOnboarded, support]);

  if (!uid || !isVisible) return null;

  const close = () => {
    dismissReminderNudge(uid);
    setIsVisible(false);
  };

  const handleEnable = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await enableReminder(uid, getReminderFacts(profile));
    setIsBusy(false);
    if (result.ok) {
      setIsVisible(false);
      if (!profile.hasEarnedReminderReward) onUpdateProfile(applyReminderReward(profile));
    } else {
      setErrorHe(result.errorHe);
    }
  };

  return (
    <section
      aria-label="תזכורת יומית"
      className={`relative rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-pink-300/60 ${theme.cardBgClass}`}
    >
      <Bell className="w-7 h-7 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <h2 className="font-extrabold text-sm">רוצים תזכורת קטנה לתרגל?</h2>
        {support === 'needs-install' ? (
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
            באייפון ובאייפד צריך קודם להוסיף את האפליקציה למסך הבית (כפתור השיתוף, ואז{' '}
            <bdi dir="ltr" lang="en">Add to Home Screen</bdi>
            ), ולפתוח אותה משם.
          </p>
        ) : (
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
            הודעה פעם ביום אם עוד לא תרגלתם. לא חובה, ואפשר לכבות בהגדרות.
            {!profile.hasEarnedReminderReward && ` מתנה: ${REMINDER_REWARD_DIAMONDS} יהלומים 💎`}
          </p>
        )}
        {errorHe && (
          <p role="alert" className="text-xs font-bold text-red-600 dark:text-red-400">
            {errorHe}
          </p>
        )}
      </div>
      {support === 'supported' && (
        <Button theme={theme} size="sm" className="shrink-0" onClick={handleEnable} disabled={isBusy}>
          להפעיל תזכורת
        </Button>
      )}
      <button
        type="button"
        onClick={close}
        aria-label="סגירה"
        className="min-w-11 min-h-11 -my-2 -ml-2 inline-flex items-center justify-center rounded-xl shrink-0 hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </section>
  );
};
