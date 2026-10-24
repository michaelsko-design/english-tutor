import React from 'react';
import { ChevronDown } from 'lucide-react';
import { MapPeek as MapPeekData } from '../../data/homeBase';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { HudIcon } from '../hud/HudIcon';

interface MapPeekProps {
  peek: MapPeekData;
  gradeLabelHe: string;
  theme: ThemeDefinition;
  onOpenMap: () => void;
}

/** Feature 27: a small strip above the full mission map: the current unit and the grade's stars. */
export const MapPeek: React.FC<MapPeekProps> = ({ peek, gradeLabelHe, theme, onOpenMap }) => (
  <button
    type="button"
    onClick={onOpenMap}
    className={`w-full rounded-2xl px-3.5 py-2.5 flex items-center gap-3 text-right transition-transform active:scale-[0.99] ${theme.cardBgClass}`}
  >
    <span className="text-2xl leading-none shrink-0" aria-hidden="true">
      {peek.unitEmoji || '🗺️'}
    </span>
    <span className="flex-1 min-w-0">
      <span className="block font-extrabold text-sm leading-tight line-clamp-2">
        יחידה {peek.unitNumber}: {peek.unitTitleHe}
      </span>
      <span className={`block text-xs font-bold leading-tight ${theme.mutedTextClass}`}>
        🗺️ המפה שלי · {gradeLabelHe} · {peek.missionsCompleted}/{peek.missionsTotal} משימות
      </span>
    </span>
    <span className="flex items-center gap-1 text-sm font-extrabold shrink-0">
      <HudIcon name="star" className="w-5 h-5" />
      <bdi className="tabular-nums">
        {peek.starsEarned}/{peek.starsPossible}
      </bdi>
    </span>
    <ChevronDown className={`w-5 h-5 shrink-0 ${theme.mutedTextClass}`} aria-hidden="true" />
  </button>
);
