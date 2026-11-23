import React, { useState } from 'react';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import {
  STREAK_REWARD_BODY_HE,
  STREAK_REWARD_SPOKEN_HE,
  STREAK_REWARD_TITLE_HE,
  hasSeenStreakRewardNotice,
  markStreakRewardNoticeSeen,
} from '../../data/streakReward';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { Button } from '../ui/Button';
import { useHomeCardTurn } from './HomeCardSlot';

interface StreakRewardCardProps {
  /** The account's uid, or a fixed key for a guest; the card shows once per account on this device */
  accountKey: string;
  hasEarnedStreakReward: boolean;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the card in Hebrew (Feature 47) */
  readsHebrewAloud: boolean;
}

/** Home: tells the learner once that the streak reward was paid (data/streakReward.ts). */
export const StreakRewardCard: React.FC<StreakRewardCardProps> = ({ accountKey, hasEarnedStreakReward, theme, readsHebrewAloud }) => {
  const [isClosed, setIsClosed] = useState(() => hasSeenStreakRewardNotice(accountKey));
  const isMyTurn = useHomeCardTurn('streak-reward', hasEarnedStreakReward && !isClosed);
  if (!isMyTurn) return null;

  const close = () => {
    markStreakRewardNoticeSeen(accountKey);
    setIsClosed(true);
  };

  return (
    <section aria-label="מתנת רצף" className={`rounded-2xl px-3.5 py-3 space-y-2 ring-2 ring-orange-300/70 ${theme.cardBgClass}`}>
      <div className="flex items-start gap-2.5">
        <div className="flex-1 min-w-0 space-y-0.5">
          <h2 className="font-extrabold text-sm">{STREAK_REWARD_TITLE_HE}</h2>
          <p className="text-sm font-bold">{STREAK_REWARD_BODY_HE}</p>
        </div>
        <HebrewAudioContext.Provider value={readsHebrewAloud}>
          <HebrewSpeakButton text={STREAK_REWARD_SPOKEN_HE} label="הקשבה" />
        </HebrewAudioContext.Provider>
      </div>
      <Button theme={theme} size="sm" onClick={close}>
        יש! ממשיכים
      </Button>
    </section>
  );
};
