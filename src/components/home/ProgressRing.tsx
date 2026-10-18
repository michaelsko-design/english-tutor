import React from 'react';
import { getRingDash } from '../../data/homeBase';

interface ProgressRingProps {
  /** Fill, 0..1 */
  ratio: number;
  /** Width and height in CSS pixels */
  size: number;
  strokeWidth: number;
  /** Stroke classes of the filled arc, e.g. a `text-*` colour (the arc uses currentColor) */
  arcClassName?: string;
  trackClassName?: string;
  children?: React.ReactNode;
}

/** An SVG progress ring with content in the middle (Feature 27: level ring and quest rings). */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  ratio,
  size,
  strokeWidth,
  arcClassName = 'text-fuchsia-500',
  trackClassName = 'text-black/10 dark:text-white/15',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const { circumference, offset } = getRingDash(ratio, radius);
  const center = size / 2;

  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      {/* Starts at the top and fills clockwise */}
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={trackClassName} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ${arcClassName}`}
        />
      </svg>
      <span className="relative flex items-center justify-center">{children}</span>
    </span>
  );
};
