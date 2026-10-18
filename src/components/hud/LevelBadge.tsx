import React from 'react';
import { getCommonArt, pickCutoutSrc } from '../../themes/themeArt';
import { ArtImage } from '../art/ArtImage';

interface LevelBadgeProps {
  level: number;
  /** Width and height in CSS pixels */
  size: number;
  /** Margins and the like; the badge is always position: relative, so wrap it to place it */
  className?: string;
}

/**
 * Where the blank violet centre of /art/common/level-badge.webp sits, as a share of the image
 * (measured on the 512px file; the ribbon covers the lower part of the disc).
 */
const BADGE_CENTRE_X = 0.495;
const BADGE_CENTRE_Y = 0.48;
/** The level number's font size as a share of the badge size */
const BADGE_NUMBER_SCALE = 0.3;

function getDevicePixelRatio(): number {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

/**
 * The level-up badge art with the level number drawn on its blank centre. Without the art it
 * falls back to a plain gold circle of the same size, so nothing jumps.
 */
export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size, className = '' }) => {
  const numberStyle: React.CSSProperties = {
    left: `${BADGE_CENTRE_X * 100}%`,
    top: `${BADGE_CENTRE_Y * 100}%`,
    fontSize: Math.round(size * BADGE_NUMBER_SCALE),
  };

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <ArtImage
        src={pickCutoutSrc(getCommonArt('level-badge'), size, getDevicePixelRatio())}
        className="w-full h-full"
        fallback={
          <span className="absolute inset-[12%] rounded-full bg-violet-500 border-4 border-amber-400 shadow-md" />
        }
      />
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 font-extrabold leading-none text-white tabular-nums"
        style={{ ...numberStyle, textShadow: '0 1px 2px rgba(59, 42, 90, 0.6)' }}
      >
        {level}
      </span>
    </div>
  );
};
