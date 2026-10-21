import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { Button } from '../ui/Button';

interface RoomPanelFrameProps {
  titleHe: string;
  theme: ThemeDefinition;
  onClose: () => void;
  /** Label of the back button (default: back to the room) */
  closeLabel?: string;
  children: React.ReactNode;
}

/** The card under the room scene that holds an activity (wardrobe, phone, journal, games, stickers). Closing it stops the reading. */
export const RoomPanelFrame: React.FC<RoomPanelFrameProps> = ({ titleHe, theme, onClose, closeLabel = 'חזרה לחדר', children }) => {
  useStopSpeechOnLeave();
  return (
    <section aria-label={titleHe} className={`p-4 rounded-3xl space-y-3 ${theme.cardBgClass}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-extrabold text-sm sm:text-base">{titleHe}</h3>
        <Button theme={theme} variant="secondary" size="sm" className="shrink-0" onClick={onClose}>
          {closeLabel}
        </Button>
      </div>
      {children}
    </section>
  );
};
