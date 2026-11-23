import React, { useState } from 'react';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { formatShortDateHe } from '../../data/progressReport';
import {
  PRO_WEEK_ENDED_HE,
  PRO_WEEK_ENDED_SPOKEN_HE,
  PRO_WEEK_ON_HE,
  PRO_WEEK_ON_SPOKEN_HE,
  hasSeenProWeekEnded,
  markProWeekEndedSeen,
  type ProWeekState,
} from '../../data/proWeek';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { toLocalDateStr } from '../../utils/dates';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { Button } from '../ui/Button';
import { useHomeCardTurn } from '../home/HomeCardSlot';

interface ProWeekCardProps {
  uid: string;
  state: ProWeekState;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the line in Hebrew (Feature 47) */
  readsHebrewAloud: boolean;
}

/**
 * The learner's free Pro week on the home screen (data/proWeek.ts): a calm line while it runs, and a
 * one-time "it ended, your progress is kept" card. No countdown, offer or ask: those are the parent's.
 */
export const ProWeekCard: React.FC<ProWeekCardProps> = ({ uid, state, theme, readsHebrewAloud }) => {
  const [isEndedClosed, setIsEndedClosed] = useState(() => hasSeenProWeekEnded(uid));
  const isMyTurn = useHomeCardTurn('pro-week', state !== null && (state.kind === 'on' || !isEndedClosed));
  if (!state || !isMyTurn) return null;

  if (state.kind === 'on') {
    return (
      <section aria-label="שבוע Pro" className={`rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 ${theme.cardBgClass}`}>
        <span className="text-2xl leading-none shrink-0" aria-hidden="true">
          👑
        </span>
        <p className="flex-1 min-w-0 text-sm font-bold">
          {PRO_WEEK_ON_HE}{' '}
          <span className={`text-xs ${theme.mutedTextClass}`}>(עד {formatShortDateHe(toLocalDateStr(new Date(state.endsAt)))})</span>
        </p>
        <HebrewAudioContext.Provider value={readsHebrewAloud}>
          <HebrewSpeakButton text={PRO_WEEK_ON_SPOKEN_HE} label="הקשבה" />
        </HebrewAudioContext.Provider>
      </section>
    );
  }

  if (isEndedClosed) return null;
  const close = () => {
    markProWeekEndedSeen(uid);
    setIsEndedClosed(true);
  };
  return (
    <section aria-label="שבוע Pro הסתיים" className={`rounded-2xl px-3.5 py-3 space-y-2 ${theme.cardBgClass}`}>
      <div className="flex items-start gap-2.5">
        <p className="flex-1 min-w-0 text-sm font-bold">{PRO_WEEK_ENDED_HE}</p>
        <HebrewAudioContext.Provider value={readsHebrewAloud}>
          <HebrewSpeakButton text={PRO_WEEK_ENDED_SPOKEN_HE} label="הקשבה" />
        </HebrewAudioContext.Provider>
      </div>
      <Button theme={theme} variant="secondary" size="sm" onClick={close}>
        הבנתי
      </Button>
    </section>
  );
};
