import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { PassageBox, StickyActionBar, StoryArt } from '../drills';
import { Button } from '../ui/Button';

interface StoryPassageProps {
  missionId: string;
  /** The story step shows the mission's spot illustration (when its file exists) */
  hasArt: boolean;
  passageEn: string;
  passageHe?: string;
  canRevealHebrew: boolean;
  /** Phones: the passage is on screen on its own; the question comes after "read it" */
  isReading: boolean;
  onDoneReading: () => void;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

/**
 * A step's reading passage. Wide screens show it above the question. Phones show it on its own
 * first (the picture, the passage, then "read it, to the question"), so neither the passage nor
 * the answers have to squeeze into one screen; the question screen has a button back to it.
 */
export const StoryPassage: React.FC<StoryPassageProps> = ({
  missionId,
  hasArt,
  passageEn,
  passageHe,
  canRevealHebrew,
  isReading,
  onDoneReading,
  theme,
  onSpeakEnglish,
}) => (
  <div className={`space-y-3 sm:space-y-5 ${isReading ? '' : 'hidden sm:block'}`}>
    {hasArt && <StoryArt missionId={missionId} />}
    <PassageBox
      passageEn={passageEn}
      passageHe={passageHe}
      canRevealHebrew={canRevealHebrew}
      theme={theme}
      onSpeakEnglish={onSpeakEnglish}
    />
    {isReading && (
      <StickyActionBar theme={theme} className="sm:hidden">
        <Button theme={theme} size="lg" className="btn-chunky flex-1" onClick={onDoneReading}>
          <span>קראתי, לשאלה</span>
          <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
        </Button>
      </StickyActionBar>
    )}
  </div>
);
