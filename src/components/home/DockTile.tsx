import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface DockTileProps {
  emoji: string;
  labelHe: string;
  theme: ThemeDefinition;
  onClick: () => void;
  /** Something new waits inside (a request, an item to place, today's session) */
  hasNews?: boolean;
  /** Screen-reader text for the dot, e.g. "בקשת חברות מחכה" */
  newsLabelHe?: string;
}

/** Feature 27: one icon tile of the home dock (room, exam prep, word lists, friends, report). */
export const DockTile: React.FC<DockTileProps> = ({ emoji, labelHe, theme, onClick, hasNews = false, newsLabelHe }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={hasNews && newsLabelHe ? `${labelHe}: ${newsLabelHe}` : labelHe}
    className={`btn-chunky relative flex-1 min-w-0 aspect-square max-h-24 rounded-2xl flex flex-col items-center justify-center gap-1 px-1 ${theme.cardBgClass}`}
  >
    <span className="text-2xl sm:text-3xl leading-none" aria-hidden="true">
      {emoji}
    </span>
    <span className="text-xs sm:text-sm font-extrabold leading-tight text-center">{labelHe}</span>
    {hasNews && (
      <span
        className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"
        aria-hidden="true"
      />
    )}
  </button>
);
