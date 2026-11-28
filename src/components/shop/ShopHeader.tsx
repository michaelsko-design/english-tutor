import React from 'react';
import { Gem, ShoppingBag, X } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { useCountUp } from '../../hooks/useCountUp';
import { FOCUS_RING_CLASS, PRESS_CLASS } from './shopStyles';

interface ShopHeaderProps {
  theme: ThemeDefinition;
  diamonds: number;
  isGirl: boolean;
  onClose: () => void;
}

export function ShopHeader({ theme, diamonds, isGirl, onClose }: ShopHeaderProps) {
  // The wallet counts down after a purchase, so the price is seen leaving it
  const diamondsShown = useCountUp(diamonds);
  const subtitle = isGirl
    ? 'השתמשי ביהלומים שצברת במשימות כדי לפתוח אווטארים, מדבקות נדירות ומגני רצף!'
    : 'השתמש ביהלומים שצברת במשימות כדי לפתוח אווטארים, מדבקות נדירות ומגני רצף!';
  return (
    <header className={`px-3 sm:px-6 py-3 sm:py-4 ${theme.hudBgClass} flex items-center justify-between gap-3 shrink-0`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.primaryBtnClass}`}>
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-xl md:text-2xl font-black leading-tight text-balance">{theme.shopTitleHe}</h2>
          <p className={`text-xs hidden sm:block ${theme.mutedTextClass}`}>{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <p
          className="ps-2.5 pe-3 sm:ps-3 sm:pe-4 min-h-11 rounded-2xl bg-fuchsia-500/15 border-2 border-fuchsia-400/50 flex items-center gap-1.5"
          aria-label={`יש לך ${diamonds} יהלומים`}
        >
          <Gem className="w-5 h-5 text-fuchsia-500" aria-hidden="true" />
          <span className="text-lg sm:text-xl font-black tabular-nums" aria-hidden="true">
            {diamondsShown}
          </span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${theme.secondaryBtnClass} ${FOCUS_RING_CLASS} ${PRESS_CLASS}`}
          aria-label="סגירה"
          title="סגירה"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
