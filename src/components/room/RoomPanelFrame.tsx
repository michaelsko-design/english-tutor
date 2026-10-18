import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface RoomPanelFrameProps {
  titleHe: string;
  theme: ThemeDefinition;
  onClose: () => void;
  /** Label of the back button (default: back to the room) */
  closeLabel?: string;
  children: React.ReactNode;
}

/** The card under the room scene that holds an activity (wardrobe, phone, journal, games, stickers). */
export const RoomPanelFrame: React.FC<RoomPanelFrameProps> = ({ titleHe, theme, onClose, closeLabel = 'חזרה לחדר', children }) => (
  <section aria-label={titleHe} className={`p-4 rounded-3xl space-y-3 ${theme.cardBgClass}`}>
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-extrabold text-sm sm:text-base">{titleHe}</h3>
      <button type="button" onClick={onClose} className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${theme.secondaryBtnClass}`}>
        {closeLabel}
      </button>
    </div>
    {children}
  </section>
);
