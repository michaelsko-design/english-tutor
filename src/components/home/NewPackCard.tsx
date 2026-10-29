import React from 'react';
import { X } from 'lucide-react';
import { getNewPackCopy, type NewPackOffer } from '../../data/contentPacks';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { Button } from '../ui/Button';

interface NewPackCardProps {
  offer: NewPackOffer;
  gender: LearnerGender;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the card in Hebrew (Feature 47) */
  readsHebrewAloud: boolean;
  /** A Pro pack the learner can't play yet: the button asks a parent instead of opening the map */
  isProLocked?: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/** A newly released content pack: shown once on the home screen, it takes the learner to its first unit on the map. */
export const NewPackCard: React.FC<NewPackCardProps> = ({ offer, gender, theme, readsHebrewAloud, isProLocked = false, onOpen, onClose }) => {
  const copy = getNewPackCopy(offer.pack, offer.unitCount, gender, isProLocked);
  return (
    <section
      aria-label={copy.titleHe}
      className={`relative rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-amber-300/70 ${theme.cardBgClass}`}
    >
      <span className="text-3xl leading-none shrink-0" aria-hidden="true">
        {offer.badgeEmoji}
      </span>
      <div className="flex-1 min-w-0 space-y-0.5">
        <h2 className="font-extrabold text-sm">{copy.titleHe}</h2>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>{copy.bodyHe}</p>
      </div>
      <HebrewAudioContext.Provider value={readsHebrewAloud}>
        <HebrewSpeakButton text={copy.spokenHe} label="הקשבה להודעה" />
      </HebrewAudioContext.Provider>
      <Button theme={theme} size="sm" className="shrink-0" onClick={onOpen}>
        {copy.buttonHe}
      </Button>
      <button
        type="button"
        onClick={onClose}
        aria-label="סגירה"
        className="min-w-11 min-h-11 -my-2 -ml-2 inline-flex items-center justify-center rounded-xl shrink-0 hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </section>
  );
};
