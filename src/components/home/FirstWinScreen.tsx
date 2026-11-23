import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { trackEvent } from '../../services/analytics';
import { applyShowOffReward, buildFirstWinSummaryHe, SHOW_OFF_DIAMONDS } from '../../data/showOff';
import { playsHebrewAloud } from '../../data/hebrewAudio';
import { WELCOME_BACK_DIAMONDS } from '../../data/welcomeBack';
import { Companion } from '../companion/Companion';
import { ParentShareBlock } from '../parent/ParentShareBlock';
import { Button } from '../ui/Button';
import { ReminderAskScreen } from './ReminderAskScreen';

interface FirstWinScreenProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** The streak after the first win (1 for a new learner) */
  streakDays: number;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onContinue: () => void;
}

const COMPANION_PX = 128;

type FirstWinStep = 'celebrate' | 'reminder' | 'showOff';

/**
 * The first win (the first lesson or mission done), while the learner is happiest:
 * 1. a short celebration and the first streak day;
 * 2. ask 1 for the daily reminder: the same full-screen ReminderAskScreen as asks 2 and 3
 *    (data/reminderAsk.ts). It closes by itself where it cannot work (unsupported or blocked browser,
 *    reminder already on) and shows the install steps on iPhone outside the Home Screen app;
 * 3. "show your parents": a message with the parent link, and one-time diamonds for sending it.
 * An old guest account (no real uid) gets neither ask, only the celebration.
 */
export const FirstWinScreen: React.FC<FirstWinScreenProps> = ({ profile, theme, streakDays, onUpdateProfile, onContinue }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const [step, setStep] = useState<FirstWinStep>('celebrate');

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
        <Button theme={theme} size="lg" className="w-full" onClick={() => (uid ? setStep('reminder') : onContinue())}>
          ממשיכים
        </Button>
      </div>
      {step === 'reminder' && (
        <ReminderAskScreen
          profile={profile}
          theme={theme}
          source="firstwin"
          onUpdateProfile={onUpdateProfile}
          onClose={() => setStep('showOff')}
        />
      )}
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
