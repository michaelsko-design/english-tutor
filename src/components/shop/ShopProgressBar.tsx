import React from 'react';
import { DIAMOND_FILL_CLASS } from './shopStyles';

interface ShopProgressBarProps {
  diamonds: number;
  costDiamonds: number;
  /** What the bar measures, read by screen readers */
  label: string;
  className?: string;
}

/** Diamonds saved toward a price, as a bar that fills from the start of the line (the right, in RTL). */
export function ShopProgressBar({ diamonds, costDiamonds, label, className = '' }: ShopProgressBarProps) {
  const saved = Math.max(0, Math.min(diamonds, costDiamonds));
  const percent = costDiamonds > 0 ? Math.round((saved / costDiamonds) * 100) : 100;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={costDiamonds}
      aria-valuenow={saved}
      aria-valuetext={`${saved} מתוך ${costDiamonds} יהלומים`}
      className={`h-2.5 w-full rounded-full bg-black/10 dark:bg-white/15 overflow-hidden ${className}`}
    >
      <div className={`h-full rounded-full ${DIAMOND_FILL_CLASS}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
