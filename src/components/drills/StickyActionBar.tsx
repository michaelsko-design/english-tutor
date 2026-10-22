import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface StickyActionBarProps {
  theme: ThemeDefinition;
  className?: string;
  children: React.ReactNode;
}

/**
 * A drill's check / reset buttons. When the drill is taller than a phone screen, the bar stays
 * pinned to the bottom of the screen so "check" is always reachable without scrolling.
 */
export const StickyActionBar: React.FC<StickyActionBarProps> = ({ theme, className = '', children }) => (
  <div className={`sticky bottom-2 z-10 flex items-center gap-2.5 p-2 rounded-2xl ${theme.cardBgClass} ${className}`}>
    {children}
  </div>
);
