import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X } from 'lucide-react';
import type { LearnerProfile } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { enableReminder, getNotificationPermission, getReminderSupport, isReminderOn } from '../../services/push/pushSubscription';
import {
  trackReminderAskShown,
  trackReminderDeclined,
  trackReminderResult,
  type ReminderAskScreenSource,
} from '../../services/push/reminderOptIn';
import { getReminderFacts } from '../../hooks/useReminderSync';
import { useDialog } from '../../hooks/useDialog';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { recordReminderAsk } from '../../data/reminderAsk';
import { REMINDER_ASK_COPY as copy } from '../../data/reminderAskCopy';
import { HebrewAudioContext, playsHebrewAloud } from '../../data/hebrewAudio';
import { toLocalDateStr } from '../../utils/dates';
import { Companion } from '../companion/Companion';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { IosInstallGuide } from '../push/IosInstallGuide';
import { Button } from '../ui/Button';

interface ReminderAskScreenProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  source: ReminderAskScreenSource;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onClose: () => void;
}

type AskView = 'checking' | 'ask' | 'install' | 'blocked' | 'done';

/**
 * The full-screen ask for the daily reminder: on the first-win screen (ask 1), over the home screen
 * after a mission (asks 2 and 3, data/reminderAsk.ts), and on the first open of the iPhone Home Screen
 * app. For a child: a title, one line on why it helps, and two buttons. The browser's own prompt
 * only comes after "yes", never on its own, and the yes button then says to tap "Allow".
 * Every way out counts as one ask; X, Escape and the backdrop count as "not now".
 */
export const ReminderAskScreen: React.FC<ReminderAskScreenProps> = ({ profile, theme, source, onUpdateProfile, onClose }) => {
  const panelRef = useRef<HTMLElement>(null);
  const isReducedMotion = usePrefersReducedMotion();
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const todayStr = toLocalDateStr(new Date());
  const [view, setView] = useState<AskView>('checking');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  const finish = (isDeclined: boolean) => {
    if (isDeclined) trackReminderDeclined();
    onUpdateProfile(recordReminderAsk(profile, todayStr, isDeclined));
    onClose();
  };
  const dismiss = () => finish(view === 'ask');

  useDialog(panelRef, { onClose: dismiss });

  useEffect(() => {
    const support = getReminderSupport();
    if (!uid || support === 'unsupported' || getNotificationPermission() === 'denied') {
      onClose();
      return undefined;
    }
    if (support === 'needs-install') {
      trackReminderAskShown();
      setView('install');
      return undefined;
    }
    let isCancelled = false;
    isReminderOn(uid)
      .then((isOn) => {
        if (isCancelled) return;
        if (isOn) {
          onClose();
          return;
        }
        trackReminderAskShown();
        setView('ask');
      })
      .catch(() => {
        if (!isCancelled) onClose();
      });
    return () => {
      isCancelled = true;
    };
    // Decided once, when the screen opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!uid || view === 'checking') return null;

  const handleEnable = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await enableReminder(uid, getReminderFacts(profile));
    setIsBusy(false);
    trackReminderResult(source, result);
    if (result.ok) setView('done');
    else if (result.reason === 'denied') setView('blocked');
    else setErrorHe(result.errorHe);
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6" role="presentation">
      <div className="absolute inset-0 bg-black/60" onClick={dismiss} aria-hidden="true" />
      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-ask-title"
        className={`relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl p-5 sm:p-6 space-y-4 text-center outline-none ${
          theme.cardBgClass
        } ${isReducedMotion ? '' : 'animate-sheet-up'}`}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="סגירה"
          className="absolute top-2 left-2 min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="flex justify-center">
          <Companion theme={theme} pose={view === 'blocked' ? 'think' : 'cheer'} size={112} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h2 id="reminder-ask-title" className="text-xl font-extrabold flex items-center gap-1.5">
              <Bell className="w-5 h-5" aria-hidden="true" />
              {view === 'done' ? copy.doneHe : copy.titleHe}
            </h2>
            {view !== 'done' && (
              <HebrewAudioContext.Provider value={playsHebrewAloud(profile.gradeId)}>
                <HebrewSpeakButton text={copy.spokenHe} label="הקשבה" />
              </HebrewAudioContext.Provider>
            )}
          </div>
        </div>

        {(view === 'ask' || view === 'install') && <p className="text-base font-bold">{copy.benefitHe}</p>}

        {view === 'ask' && (
          <>
            {errorHe && (
              <p role="alert" className="text-xs font-bold text-red-600 dark:text-red-400">
                {errorHe}
              </p>
            )}
            <div className="space-y-2">
              <Button theme={theme} size="lg" className="w-full" onClick={handleEnable} disabled={isBusy}>
                {isBusy ? copy.allowHe : copy.yesHe}
              </Button>
              {/* A small link, but readable and with a full-size tap area (no hidden way out) */}
              <button
                type="button"
                onClick={() => finish(true)}
                disabled={isBusy}
                className="mx-auto block min-h-11 px-4 text-sm font-bold underline underline-offset-4 decoration-current/40 hover:decoration-current disabled:opacity-50"
              >
                {copy.notNowHe}
              </button>
            </div>
          </>
        )}

        {view === 'install' && (
          <>
            <IosInstallGuide theme={theme} title={copy.installTitleHe} />
            <Button theme={theme} size="lg" className="w-full" onClick={() => finish(false)}>
              הבנתי
            </Button>
          </>
        )}

        {view === 'blocked' && (
          <>
            <p role="alert" className="text-xs sm:text-sm font-bold">
              {copy.blockedHe}
            </p>
            <Button theme={theme} size="lg" className="w-full" onClick={() => finish(false)}>
              הבנתי
            </Button>
          </>
        )}

        {view === 'done' && (
          <Button theme={theme} size="lg" className="w-full" onClick={() => finish(false)}>
            ממשיכים
          </Button>
        )}
      </section>
    </div>,
    document.body
  );
};
