import React from 'react';
import { RoomActivityReward } from '../../data/roomActivities';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

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
      ? `+${reward.xpEarned} XP ו־+${reward.diamondsEarned} 💎 — וזה נספר כמשימה של היום! 🎯`
      : partialHe ?? `+${reward.xpEarned} XP · את הפרס היומי כבר קיבלת היום, ${isGirl ? 'המשיכי' : 'המשך'} להתאמן!`;

  return (
    <div className="space-y-3 text-center py-2" role="status">
      <p className="text-base font-extrabold">{headlineHe}</p>
      <p className={`text-xs sm:text-sm font-bold ${reward?.isFullReward ? 'text-emerald-600 dark:text-emerald-300' : theme.mutedTextClass}`}>
        {rewardText}
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-1">
        <button type="button" onClick={onAgain} className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass}`}>
          {againLabel}
        </button>
        <button type="button" onClick={onClose} className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm ${theme.secondaryBtnClass}`}>
          חזרה לחדר
        </button>
      </div>
    </div>
  );
};
