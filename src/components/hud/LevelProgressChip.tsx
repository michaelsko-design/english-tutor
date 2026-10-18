import React from 'react';
import { getLevelProgress } from '../../utils/rewardFeedback';

interface LevelProgressChipProps {
  xp: number;
  level: number;
  badgeClass: string;
}

/** Feature 24: the "Lv.N" chip with a small bar of the XP toward the next level. */
export const LevelProgressChip: React.FC<LevelProgressChipProps> = ({ xp, level, badgeClass }) => {
  const progress = getLevelProgress(xp, level);
  const percent = Math.round(progress.ratio * 100);
  const label = `רמה ${progress.level}: עוד ${progress.xpToNextLevel} XP לרמה ${progress.level + 1}`;

  return (
    <span
      className={`text-[11px] pl-2 pr-1.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${badgeClass}`}
      dir="ltr"
      title={label}
      role="img"
      aria-label={label}
    >
      <span>Lv.{progress.level}</span>
      <span className="w-10 sm:w-14 h-1.5 rounded-full bg-black/15 dark:bg-white/20 overflow-hidden">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-[width] duration-700"
          style={{ width: `${percent}%` }}
        />
      </span>
    </span>
  );
};
