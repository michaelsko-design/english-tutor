import React, { useEffect, useState } from 'react';
import { Bell, Send } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { enableReminder, getNotificationPermission, getReminderSupport, isReminderOn } from '../../services/push/pushSubscription';
import { trackReminderDeclined, trackReminderResult } from '../../services/push/reminderOptIn';
import { trackEvent } from '../../services/analytics';
import { getReminderFacts } from '../../hooks/useReminderSync';
import { applyReminderReward, REMINDER_REWARD_DIAMONDS } from '../../data/reminderReward';
import { applyShowOffReward, buildFirstWinSummaryHe, SHOW_OFF_DIAMONDS } from '../../data/showOff';
import { playsHebrewAloud } from '../../data/hebrewAudio';
import { WELCOME_BACK_DIAMONDS } from '../../data/welcomeBack';
import { toLocalDateStr } from '../../utils/dates';
import { Companion } from '../companion/Companion';
import { ParentShareBlock } from '../parent/ParentShareBlock';
import { Button } from '../ui/Button';

interface FirstWinScreenProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** The streak after the first win (1 for a new learner) */
  streakDays: number;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onContinue: () => void;
}

const COMPANION_PX = 128;

type FirstWinStep = 'reminder' | 'showOff';

/**
 * The first win (the first lesson or mission done), in two steps while the learner is happiest:
 * 1. a short celebration, the first streak day, and the ask for the daily reminder (for a grown-up to
 *    accept, never required, and left out where it cannot work: an unsupported or blocked browser, a
 *    reminder that is already on). The same switch stays in the settings and on the home screen.
 * 2. "show your parents": a message with the parent link, and one-time diamonds for sending it.
 * An old guest account (no real uid) gets neither ask, only the celebration.
 */
export const FirstWinScreen: React.FC<FirstWinScreenProps> = ({ profile, theme, streakDays, onUpdateProfile, onContinue }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const support = getReminderSupport();
  const isBlocked = getNotificationPermission() === 'denied';
  const canCheckReminder = Boolean(uid) && support === 'supported' && !isBlocked;
  const [step, setStep] = useState<FirstWinStep>('reminder');
  // null while we check whether the reminder is already on, so the wrong button never flashes
  const [canAsk, setCanAsk] = useState<boolean | null>(canCheckReminder ? null : false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !canCheckReminder) return undefined;
    let isCancelled = false;
    isReminderOn(uid)
      .then((isOn) => {
        if (!isCancelled) setCanAsk(!isOn);
      })
      // Not knowing is not a reason to hold the learner here: just skip the ask
      .catch(() => {
        if (!isCancelled) setCanAsk(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [uid, canCheckReminder]);

  const goToShowOff = () => {
    if (uid) setStep('showOff');
    else onContinue();
  };

  const handleEnable = async () => {
    if (!uid) return;
    setIsBusy(true);
    setErrorHe(null);
    const result = await enableReminder(uid, getReminderFacts(profile));
    setIsBusy(false);
    trackReminderResult('firstwin', result);
    if (!result.ok) {
      setErrorHe(result.errorHe);
      return;
    }
    if (!profile.hasEarnedReminderReward) onUpdateProfile(applyReminderReward(profile));
    goToShowOff();
  };

  const handleNotNow = () => {
    trackReminderDeclined();
    onUpdateProfile({ ...profile, reminderDeclinedAtStr: toLocalDateStr(new Date()) });
    goToShowOff();
  };

  if (step === 'showOff' && uid) {
    return (
      <ShowOffStep uid={uid} profile={profile} theme={theme} streakDays={streakDays} onUpdateProfile={onUpdateProfile} onContinue={onContinue} />
    );
  }

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-3 sm:p-6`}>
      <div className={`w-full max-w-md rounded-3xl p-6 text-center space-y-4 ${theme.cardBgClass}`}>
        <div className="flex justify-center">
          <Companion theme={theme} pose="cheer" size={COMPANION_PX} />
        </div>
        <div className="text-3xl" aria-hidden="true">⭐⭐⭐</div>
        <h1 className="text-xl sm:text-2xl font-extrabold">
          {profile.name.trim() ? `כל הכבוד, ${profile.name.trim()}!` : 'כל הכבוד!'}
        </h1>
        <p className="text-sm sm:text-base font-bold">
          יום {streakDays} ברצף 🔥 חוזרים מחר ללמוד עוד
        </p>
        {!profile.hasClaimedWelcomeBack && (
          <p className="text-sm font-extrabold">
            מחר מחכה לכם מתנה: {WELCOME_BACK_DIAMONDS} {theme.currencyNameHe} 🎁
          </p>
        )}

        {support === 'needs-install' && (
          <p className={`text-xs sm:text-sm font-bold ${theme.mutedTextClass}`}>
            להורים: אפשר לקבל תזכורת יומית. באייפון ובאייפד צריך קודם להוסיף את האפליקציה למסך הבית (כפתור השיתוף, ואז{' '}
            <bdi dir="ltr" lang="en">Add to Home Screen</bdi>
            ), ולפתוח אותה משם.
          </p>
        )}

        {canAsk && (
          <section aria-label="תזכורת יומית" className="space-y-1.5 p-3 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5">
            <h2 className="font-extrabold text-sm flex items-center justify-center gap-1.5">
              <Bell className="w-4 h-4" aria-hidden="true" />
              להורים: רוצים תזכורת קטנה פעם ביום?
            </h2>
            <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
              הודעה אם עוד לא תרגלנו. לא חובה, ואפשר לכבות בהגדרות.
              {!profile.hasEarnedReminderReward && ` מתנה: ${REMINDER_REWARD_DIAMONDS} יהלומים 💎`}
            </p>
            {errorHe && (
              <p role="alert" className="text-xs font-bold text-red-600 dark:text-red-400">
                {errorHe}
              </p>
            )}
          </section>
        )}

        {canAsk === null ? null : canAsk ? (
          <div className="space-y-2">
            <Button theme={theme} size="lg" className="w-full" onClick={handleEnable} disabled={isBusy}>
              כן, להפעיל תזכורת
            </Button>
            <Button theme={theme} variant="secondary" className="w-full" onClick={handleNotNow} disabled={isBusy}>
              לא עכשיו
            </Button>
          </div>
        ) : (
          <Button theme={theme} size="lg" className="w-full" onClick={goToShowOff}>
            ממשיכים
          </Button>
        )}
      </div>
    </div>
  );
};

interface ShowOffStepProps extends FirstWinScreenProps {
  uid: string;
}

/** Step 2: send the first win to a parent, with the parent link; the gift is paid on the first tap. */
const ShowOffStep: React.FC<ShowOffStepProps> = ({ uid, profile, theme, streakDays, onUpdateProfile, onContinue }) => {
  const [hasShared, setHasShared] = useState(false);
  const isRewardPending = !profile.hasEarnedShowOffReward;
  const summaryHe = buildFirstWinSummaryHe({
    name: profile.name,
    gender: profile.gender,
    streakDays,
    isLesson: playsHebrewAloud(profile.gradeId),
  });

  const handleShared = () => {
    trackEvent('show_off_shared');
    setHasShared(true);
    if (isRewardPending) onUpdateProfile(applyShowOffReward(profile));
  };

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-3 sm:p-6`}>
      <section aria-label="לשתף את ההורים" className={`w-full max-w-md rounded-3xl p-6 text-center space-y-4 ${theme.cardBgClass}`}>
        <div className="flex justify-center">
          <Companion theme={theme} pose="cheer" size={COMPANION_PX} />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold flex items-center justify-center gap-2">
          <Send className="w-5 h-5" aria-hidden="true" />
          שלחו להורים מה עשיתם היום!
        </h1>
        <p className={`text-sm font-bold ${theme.mutedTextClass}`}>
          הודעה קצרה בוואטסאפ, עם קישור לאזור ההורים.
          {isRewardPending && ` מתנה על השליחה: ${SHOW_OFF_DIAMONDS} יהלומים 💎`}
        </p>
        <ParentShareBlock
          uid={uid}
          childName={profile.name}
          childAvatar={profile.equippedAvatarEmoji || theme.companion.avatarEmoji}
          summaryHe={summaryHe}
          theme={theme}
          onShared={handleShared}
        />
        {hasShared && (
          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-300" aria-live="polite">
            נשלח! תודה ששיתפתם 💜
          </p>
        )}
        <Button theme={theme} size="lg" variant={hasShared ? 'primary' : 'secondary'} className="w-full" onClick={onContinue}>
          {hasShared ? 'ממשיכים' : 'אולי אחר כך'}
        </Button>
      </section>
    </div>
  );
};
