import React from 'react';
import { ProficiencyTier } from '../../types/learner';
import { TIER_CONFIG } from '../../themes/themeRegistry';
import { MissionLadder, TIER_ORDER, hasMasterTrophy } from '../../data/tierProgress';

interface TierLadderProps {
  ladder: MissionLadder;
  /** The tier just played, highlighted */
  currentTier?: ProficiencyTier;
  className?: string;
}

const MAX_STARS = 3;

function starsText(count: number): string {
  return `${'★'.repeat(count)}${'☆'.repeat(MAX_STARS - count)}`;
}

/** A mission's progress up the three tiers: the stars at each, and the Master trophy. */
export const TierLadder: React.FC<TierLadderProps> = ({ ladder, currentTier, className = '' }) => (
  <ul className={`flex items-stretch justify-center gap-2 ${className}`} aria-label="התקדמות ברמות המשימה">
    {TIER_ORDER.map((tier) => {
      const meta = TIER_CONFIG[tier];
      const stars = ladder[tier];
      return (
        <li
          key={tier}
          aria-label={`${meta.labelHe}: ${stars} מתוך ${MAX_STARS} כוכבים`}
          className={`flex-1 min-w-0 rounded-2xl border-2 px-1.5 py-1.5 flex flex-col items-center gap-0.5 ${
            tier === currentTier ? 'border-amber-400 bg-amber-400/15' : 'border-current/15'
          } ${stars === 0 ? 'opacity-60' : ''}`}
        >
          <span className="text-xl leading-none" aria-hidden="true">
            {tier === 'master' && hasMasterTrophy(ladder) ? '🏆' : meta.badgeEmoji}
          </span>
          <span className="text-xs font-extrabold truncate max-w-full">{meta.labelHe}</span>
          <span className="text-sm text-amber-500 leading-none tracking-wider" aria-hidden="true" dir="ltr">
            {starsText(stars)}
          </span>
        </li>
      );
    })}
  </ul>
);
