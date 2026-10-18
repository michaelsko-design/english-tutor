import React from 'react';
import { X, Clock } from 'lucide-react';
import { MissionNode } from '../../data/curriculum';
import { ProficiencyTier } from '../../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../../themes/themeRegistry';
import { Companion } from '../companion/Companion';

interface MissionIntroProps {
  mission: MissionNode;
  stepCount: number;
  tier: ProficiencyTier;
  onChangeTier: (tier: ProficiencyTier) => void;
  isGirl: boolean;
  theme: ThemeDefinition;
  onStart: () => void;
  onClose: () => void;
}

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
export const INTRO_COMPANION_SIZE = 120;

/**
 * Feature 25: the mission start. The companion waves, the mission is introduced and the tier
 * is chosen here (it used to sit in every step's header).
 */
export const MissionIntro: React.FC<MissionIntroProps> = ({
  mission,
  stepCount,
  tier,
  onChangeTier,
  isGirl,
  theme,
  onStart,
  onClose,
}) => (
  <div className="relative px-4 sm:px-8 pt-4 pb-6 space-y-5" dir="rtl">
    <button
      type="button"
      onClick={onClose}
      className={`absolute top-3 left-3 p-2 rounded-xl ${theme.secondaryBtnClass}`}
      aria-label="יציאה מהמשימה"
    >
      <X className="w-4 h-4" />
    </button>

    <div className="flex flex-col items-center text-center gap-2 pt-2">
      <Companion theme={theme} pose="wave" size={INTRO_COMPANION_SIZE} />
      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
        {mission.isBoss ? '👑 משימת בוס · ' : ''}
        יחידה {mission.unitNumber} · משימה {mission.missionNumber}
      </span>
      <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
        <span className="me-1.5" aria-hidden="true">
          {mission.icon}
        </span>
        {mission.titleHe}
      </h2>
      <p className={`text-sm font-bold ${theme.mutedTextClass}`} dir="ltr">
        {mission.titleEn}
      </p>
      <p className="text-sm font-bold max-w-md">{mission.storyHookHe}</p>
      <p className={`text-xs font-bold flex items-center gap-1.5 ${theme.mutedTextClass}`}>
        <Clock className="w-3.5 h-3.5" />
        <span>
          {stepCount} שלבים · כ-{mission.estimatedMinutes} דקות
        </span>
      </p>
    </div>

    <fieldset className="space-y-2.5">
      <legend className="text-sm font-extrabold mb-2">{isGirl ? 'בחרי רמת אתגר:' : 'בחר רמת אתגר:'}</legend>
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
              isSelected ? 'bg-emerald-500/15 border-2 border-emerald-500 btn-chunky-correct' : theme.cardBgClass
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {meta.badgeEmoji}
            </span>
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-2 font-extrabold text-base">
                {meta.labelHe}
                <span className={`px-2 py-0.5 rounded-md text-[11px] ${theme.badgeClass}`} dir="ltr">
                  {meta.labelEn}
                </span>
              </span>
              <span className={`block text-xs font-bold mt-0.5 ${theme.mutedTextClass}`}>{meta.descriptionHe}</span>
            </span>
          </button>
        );
      })}
    </fieldset>

    <button
      type="button"
      onClick={onStart}
      className={`btn-chunky w-full py-4 rounded-2xl text-lg font-extrabold ${theme.primaryBtnClass}`}
    >
      {isGirl ? 'יאללה, בואי נתחיל! 🚀' : 'יאללה, בוא נתחיל! 🚀'}
    </button>
  </div>
);
