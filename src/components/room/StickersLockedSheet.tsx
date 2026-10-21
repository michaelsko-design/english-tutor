import React, { useEffect } from 'react';
import { speakHebrew } from '../../services/tts';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { playsHebrewAloud } from '../../data/hebrewAudio';
import { getHebrewCopy } from '../../utils/hebrewGender';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { Button } from '../ui/Button';

interface StickersLockedSheetProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onOpenShop: () => void;
  onClose: () => void;
}

/** What the sticker button says when the learner has no stickers yet: where to get them. Read aloud for grades 1-2. */
export const StickersLockedSheet: React.FC<StickersLockedSheetProps> = ({ profile, theme, onOpenShop, onClose }) => {
  const copy = getHebrewCopy(profile.gender, profile.name);
  const isReadAloud = playsHebrewAloud(profile.gradeId);
  const spoken = `${copy.stickersLockedTitle}. ${copy.stickersLockedBody}`;

  useEffect(() => {
    if (isReadAloud) void speakHebrew(spoken);
  }, [isReadAloud, spoken]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
      <section
        role="dialog"
        aria-label={copy.stickersLockedTitle}
        className={`w-full max-w-md p-4 rounded-3xl shadow-2xl space-y-3 pointer-events-auto ${theme.cardBgClass}`}
      >
        <div className="flex items-start gap-2">
          <span className="text-3xl" aria-hidden="true">
            🎨
          </span>
          <div className="flex-1 space-y-1">
            <h3 className="font-extrabold text-sm">{copy.stickersLockedTitle}</h3>
            <p className="text-sm font-bold">{copy.stickersLockedBody}</p>
          </div>
          {isReadAloud && <HebrewSpeakButton text={spoken} label="הקשבה להסבר" />}
        </div>
        <div className="flex gap-2">
          <Button theme={theme} className="flex-1" onClick={onOpenShop}>
            לחנות 🛍️
          </Button>
          <Button theme={theme} variant="secondary" onClick={onClose}>
            סגירה
          </Button>
        </div>
      </section>
    </div>
  );
};
