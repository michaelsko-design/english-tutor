import React from 'react';
import { X, Clock, BookOpen } from 'lucide-react';
import { MissionNode } from '../../data/curriculum';
import { LearnerGender, ProficiencyTier } from '../../types/learner';
import { inflectHebrew } from '../../utils/hebrewGender';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { Companion } from '../companion/Companion';
import { TierChoice } from './TierChoice';
import { Button } from '../ui/Button';

/**
 * The mission's mini-lesson (Feature 42): it opens by itself after Start on a first play ('auto'),
 * is offered as a reminder on replays ('optional'), or the mission has none yet.
 */
export type LessonOffer = 'auto' | 'optional' | 'none';

/** About how long the mini-lesson adds to the mission */
const LESSON_MINUTES = 1;

interface MissionIntroProps {
  mission: MissionNode;
  stepCount: number;
  tier: ProficiencyTier;
  onChangeTier: (tier: ProficiencyTier) => void;
  gender: LearnerGender;
  theme: ThemeDefinition;
  lessonOffer: LessonOffer;
  onOpenLesson: () => void;
  onStart: () => void;
  onClose: () => void;
}

/** Small enough that the intro fits a phone screen without scrolling */
export const INTRO_COMPANION_SIZE = 96;

/**
 * Feature 25: the mission start. The companion waves, the mission is introduced and the tier
 * is chosen here (it used to sit in every step's header).
 */
export const MissionIntro: React.FC<MissionIntroProps> = ({
  mission,
  stepCount,
  tier,
  onChangeTier,
  gender,
  theme,
  lessonOffer,
  onOpenLesson,
  onStart,
  onClose,
}) => {
  const isGirl = gender === 'girl';
  const minutes = mission.estimatedMinutes + (lessonOffer === 'auto' ? LESSON_MINUTES : 0);
  return (
    <div className="relative px-4 sm:px-8 pt-4 pb-5 short:pb-4 space-y-4 short:space-y-3">
      <button
        type="button"
        onClick={onClose}
        className={`absolute top-3 left-3 min-w-11 min-h-11 flex items-center justify-center rounded-xl ${theme.secondaryBtnClass}`}
        aria-label="יציאה מהמשימה"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center text-center gap-1.5 pt-1">
        {/* Shrinks to three quarters on short screens */}
        <Companion theme={theme} pose="wave" size={INTRO_COMPANION_SIZE} sizeClassName="w-fluid-companion-96 h-fluid-companion-96" />
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
          {mission.isBoss ? '👑 משימת בוס · ' : ''}
          יחידה {mission.unitNumber} · משימה {mission.missionNumber}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
          <span className="me-1.5" aria-hidden="true">
            {mission.icon}
          </span>
          {inflectHebrew(mission.titleHe, gender)}
        </h2>
        <p className={`text-sm font-bold ${theme.mutedTextClass}`} dir="ltr" lang="en">
          {mission.titleEn}
        </p>
        <p className="text-sm font-bold max-w-md">{inflectHebrew(mission.storyHookHe, gender)}</p>
        <p className={`text-xs font-bold flex items-center gap-1.5 ${theme.mutedTextClass}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>
            {lessonOffer === 'auto' ? 'שיעור קצרצר + ' : ''}
            {stepCount} שלבים · כ-{minutes} דקות
          </span>
        </p>
      </div>

      {/* Phones get the three tiers as one row of chips, so Start is on screen without scrolling */}
      <div className="sm:hidden">
        <TierChoice tier={tier} onChangeTier={onChangeTier} gender={gender} theme={theme} isCompact />
      </div>
      <div className="hidden sm:block">
        <TierChoice tier={tier} onChangeTier={onChangeTier} gender={gender} theme={theme} />
      </div>

      {lessonOffer === 'optional' && (
        <Button theme={theme} variant="secondary" size="lg" className="w-full" onClick={onOpenLesson}>
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>תזכורת קצרה לפני שמתחילים</span>
        </Button>
      )}

      <Button theme={theme} size="lg" className="btn-chunky w-full" onClick={onStart}>
        {isGirl ? 'יאללה, בואי נתחיל! 🚀' : 'יאללה, בוא נתחיל! 🚀'}
      </Button>
    </div>
  );
};
