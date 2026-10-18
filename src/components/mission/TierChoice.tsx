import React from 'react';
import { LearnerGender, ProficiencyTier } from '../../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../../themes/themeRegistry';

interface TierChoiceProps {
  tier: ProficiencyTier;
  onChangeTier: (tier: ProficiencyTier) => void;
  gender: LearnerGender;
  theme: ThemeDefinition;
  /** Three chips in a row (the world map's mission sheet) instead of full-width cards */
  isCompact?: boolean;
}

export const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];

/** The three challenge tiers as chunky buttons: on the mission intro and the world map's mission sheet. */
export const TierChoice: React.FC<TierChoiceProps> = ({ tier, onChangeTier, gender, theme, isCompact = false }) => {
  const legend = gender === 'girl' ? 'בחרי רמת אתגר:' : 'בחר רמת אתגר:';
  const selectedStyle = 'bg-emerald-500/15 border-2 border-emerald-500 btn-chunky-correct';

  if (isCompact) {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-extrabold mb-2">{legend}</legend>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((tierId) => {
            const meta = TIER_CONFIG[tierId];
            const isSelected = tier === tierId;
            return (
              <button
                key={tierId}
                type="button"
                onClick={() => onChangeTier(tierId)}
                aria-pressed={isSelected}
                className={`btn-chunky p-2 rounded-2xl flex flex-col items-center gap-0.5 ${
                  isSelected ? selectedStyle : theme.cardBgClass
                }`}
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {meta.badgeEmoji}
                </span>
                <span className="text-sm font-extrabold">{meta.labelHe}</span>
              </button>
            );
          })}
        </div>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>{TIER_CONFIG[tier].descriptionHe}</p>
      </fieldset>
    );
  }

  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-extrabold mb-2">{legend}</legend>
      {TIERS.map((tierId) => {
        const meta = TIER_CONFIG[tierId];
        const isSelected = tier === tierId;
        return (
          <button
            key={tierId}
            type="button"
            onClick={() => onChangeTier(tierId)}
            aria-pressed={isSelected}
            className={`btn-chunky w-full text-start p-3.5 rounded-2xl flex items-center gap-3 ${
              isSelected ? selectedStyle : theme.cardBgClass
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {meta.badgeEmoji}
            </span>
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-2 font-extrabold text-base">
                {meta.labelHe}
                <span className={`px-2 py-0.5 rounded-md text-xs ${theme.badgeClass}`} dir="ltr">
                  {meta.labelEn}
                </span>
              </span>
              <span className={`block text-xs font-bold mt-0.5 ${theme.mutedTextClass}`}>{meta.descriptionHe}</span>
            </span>
          </button>
        );
      })}
    </fieldset>
  );
};
