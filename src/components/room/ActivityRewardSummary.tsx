import React from 'react';
import { RoomActivityReward } from '../../data/roomActivities';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { formatGainLtr } from '../../utils/bidi';
import { Button } from '../ui/Button';

interface ActivityRewardSummaryProps {
  /** null when nothing was earned (e.g. no message was sent) */
  reward: RoomActivityReward | null;
  theme: ThemeDefinition;
  gender: LearnerGender;
  headlineHe: string;
  emptyHe: string;
  /** Shown instead of the "already rewarded today" line when a smaller reward has another reason */
  partialHe?: string;
  againLabel: string;
  onAgain: () => void;
  onClose: () => void;
}

/** End screen of a room activity: what was done and what it earned today. */
export const ActivityRewardSummary: React.FC<ActivityRewardSummaryProps> = ({
  reward,
  theme,
  gender,
  headlineHe,
  emptyHe,
  partialHe,
  againLabel,
  onAgain,
  onClose,
}) => {
  const isGirl = gender === 'girl';
  const rewardText = !reward
    ? emptyHe
    : reward.isFullReward
      ? `${formatGainLtr(reward.xpEarned, 'XP')} ו־${formatGainLtr(reward.diamondsEarned, '💎')} — וזה נספר כמשימה של היום! 🎯`
      : partialHe ?? `${formatGainLtr(reward.xpEarned, 'XP')} · את הפרס היומי כבר קיבלת היום, ${isGirl ? 'המשיכי' : 'המשך'} להתאמן!`;

  return (
    <div className="space-y-3 text-center py-2" role="status">
      <p className="text-base font-extrabold">{headlineHe}</p>
      <p className={`text-xs sm:text-sm font-bold ${reward?.isFullReward ? 'text-emerald-600 dark:text-emerald-300' : theme.mutedTextClass}`}>
        {rewardText}
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-1">
        <Button theme={theme} onClick={onAgain}>
          {againLabel}
        </Button>
        <Button theme={theme} variant="secondary" onClick={onClose}>
          חזרה לחדר
        </Button>
      </div>
    </div>
  );
};
