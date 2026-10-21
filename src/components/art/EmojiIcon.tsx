import React from 'react';
import { ArtImage } from './ArtImage';
import { getIconSrc } from './iconArt';

interface EmojiIconProps {
  emoji: string;
  /** CSS size of the icon box, e.g. '2rem' or '7cqw' */
  size: string;
  className?: string;
}

const PX_PER_REM = 16;
const SIZE_PATTERN = /^(\d+(?:\.\d+)?)(px|rem)$/;

/** The size in CSS pixels when it is a fixed px/rem length, else null (e.g. container units). */
function toPixels(size: string): number | null {
  const match = SIZE_PATTERN.exec(size);
  if (!match) return null;
  return Number(match[1]) * (match[2] === 'rem' ? PX_PER_REM : 1);
}

function getDevicePixelRatio(): number {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

/**
 * A catalog emoji as its drawn icon (public/art/icons). Emoji without an icon, and icons whose
 * file is missing, show the plain emoji at the same size, so the box never jumps.
 */
export const EmojiIcon: React.FC<EmojiIconProps> = ({ emoji, size, className = '' }) => {
  const sizePx = toPixels(size);
  const src = getIconSrc(emoji, sizePx ?? Number.POSITIVE_INFINITY, getDevicePixelRatio());
  const textEmoji = (
    <span className={`inline-block leading-none ${className}`} style={{ fontSize: size }} aria-hidden="true">
      {emoji}
    </span>
  );
  if (!src) return textEmoji;
  return (
    <span className={`inline-block align-middle ${className}`} style={{ width: size, height: size }}>
      <ArtImage src={src} className="w-full h-full" fallback={textEmoji} />
    </span>
  );
};
