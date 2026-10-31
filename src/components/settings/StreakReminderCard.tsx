import React, { useEffect, useState } from 'react';
import { Bell, CalendarPlus } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import {
  disableReminder,
  enableReminder,
  getReminderSupport,
  isReminderOn,
} from '../../services/push/pushSubscription';
import { CALENDAR_REMINDER_HOUR, buildGoogleCalendarUrl, downloadReminderIcs } from '../../utils/reminderIcs';
import { getReminderFacts } from '../../hooks/useReminderSync';
import { REMINDER_REWARD_DIAMONDS } from '../../data/reminderReward';

interface StreakReminderCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** Called after reminders were turned on, so the one-time gift can be paid */
  onEnabled: () => void;
}

const buttonClass = 'w-full min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5';

/**
 * Settings: the optional daily reminder. A Web Push once a day if the learner has not practised yet
 * (never on Friday/Shabbat for Shabbat observers), and a calendar
 * reminder that needs no permission. On iPhone/iPad the app must be added to the Home Screen first.
 */
export const StreakReminderCard: React.FC<StreakReminderCardProps> = ({ profile, onEnabled }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const support = getReminderSupport();
  const [isOn, setIsOn] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || support !== 'supported') return;
    void isReminderOn(uid).then(setIsOn);
  }, [uid, support]);

  if (!uid) return null;

  const facts = getReminderFacts(profile);

  const handleToggle = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = isOn ? await disableReminder(uid) : await enableReminder(uid, facts);
    if (result.ok) {
      setIsOn(!isOn);
      if (!isOn) onEnabled();
    } else {
      setErrorHe(result.errorHe);
    }
    setIsBusy(false);
  };

  const appUrl = window.location.origin;

  return (
    <div className="space-y-2 p-3 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5">

      {support === 'supported' && (
        <>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isBusy}
            aria-pressed={isOn}
            className={`${buttonClass} ${isOn ? 'bg-pink-500/15 border border-pink-500/60' : 'bg-pink-500 text-white'}`}
          >
            <Bell size={16} aria-hidden="true" />
            {isOn ? 'כיבוי תזכורות' : 'הפעלת תזכורות'}
          </button>
          {!isOn && !profile.hasEarnedReminderReward && (
            <p className="text-xs sm:text-sm font-bold">מתנה: {REMINDER_REWARD_DIAMONDS} יהלומים 💎 על הפעלת התזכורת.</p>
          )}
        </>
      )}

      {support === 'needs-install' && (
        <p className="text-xs sm:text-sm font-bold">
          באייפון ובאייפד צריך קודם להוסיף את האפליקציה למסך הבית: לוחצים על כפתור השיתוף בדפדפן, ובוחרים
          {' '}
          <bdi dir="ltr" lang="en">Add to Home Screen</bdi>
          . אחרי זה פותחים אותה משם וחוזרים לכאן.
        </p>
      )}

      {support === 'unsupported' && (
        <p className="text-xs sm:text-sm opacity-80">התראות לא זמינות בדפדפן הזה. אפשר להשתמש בתזכורת ביומן.</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => downloadReminderIcs(new Date(), CALENDAR_REMINDER_HOUR, appUrl)}
          className={`${buttonClass} border border-current/20`}
        >
          <CalendarPlus size={16} aria-hidden="true" />
          קובץ ליומן
        </button>
        <a
          href={buildGoogleCalendarUrl(new Date(), CALENDAR_REMINDER_HOUR, appUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} border border-current/20`}
        >
          <CalendarPlus size={16} aria-hidden="true" />
          <bdi dir="ltr" lang="en">Google Calendar</bdi>
        </a>
      </div>

      {errorHe && (
        <p role="alert" className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400">
          {errorHe}
        </p>
      )}
    </div>
  );
};
