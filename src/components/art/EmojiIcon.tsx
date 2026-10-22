import React from 'react';
import { useArtStatus } from '../../hooks/useArtStatus';
import { getIconSrc } from './iconArt';
import { getSymbolIcon } from './symbolIcons';
import { RAW_EMOJI_PROP } from '../../emojiJsx/withEmojiIcons';

interface EmojiIconProps {
  emoji: string;
  /** CSS size of the icon box, e.g. '2rem' or '7cqw' */
  size: string;
  className?: string;
  /** Sits in a line of text: its bottom edge goes a little below the baseline, like a glyph's */
  isInline?: boolean;
}

const SYMBOL_STROKE_WIDTH = 2.5;
const PX_PER_REM = 16;
const SIZE_PATTERN = /^(\d+(?:\.\d+)?)(px|rem|em)$/;

/** The size in CSS pixels when it is a fixed px/rem length, else null (e.g. container units). */
function toPixels(size: string): number | null {
  const match = SIZE_PATTERN.exec(size);
  if (!match) return null;
  return Number(match[1]) * (match[2] === 'px' ? 1 : PX_PER_REM);
}

function getDevicePixelRatio(): number {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

/**
 * A catalog emoji as its drawn icon (public/art/icons). Emoji without an icon, and icons whose
 * file is missing, show the plain emoji at the same size, so the box never jumps.
 */
export const EmojiIcon: React.FC<EmojiIconProps> = ({ emoji, size, className = '', isInline = false }) => {
  const SymbolIcon = getSymbolIcon(emoji);
  if (SymbolIcon) {
    return (
      <SymbolIcon
        size={isInline ? '1em' : size}
        strokeWidth={SYMBOL_STROKE_WIDTH}
        fill={emoji.startsWith('⏹') ? 'currentColor' : 'none'}
        aria-hidden="true"
        className={`inline-block shrink-0 ${isInline ? 'align-[-0.125em]' : 'align-middle'} ${className}`}
      />
    );
  }
  const sizePx = toPixels(size);
  const src = getIconSrc(emoji, sizePx ?? Number.POSITIVE_INFINITY, getDevicePixelRatio());
  const textEmoji = (
    <span
      className={`inline-block leading-none ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
      {...{ [RAW_EMOJI_PROP]: '' }}
    >
      {emoji}
    </span>
  );
  if (!src) return textEmoji;
  return (
    <DrawnIcon
      src={src}
      size={size}
      className={`${isInline ? 'align-[-0.2em]' : 'align-middle'} ${className}`}
      fallback={textEmoji}
    />
  );
};

interface DrawnIconProps {
  src: string;
  size: string;
  className: string;
  fallback: React.ReactNode;
}

/** The picture in a box of its own size (spans only, so it may sit inside a paragraph); the fallback when the file is missing. */
const DrawnIcon: React.FC<DrawnIconProps> = ({ src, size, className, fallback }) => {
  const status = useArtStatus(src);
  return (
    <span className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {status === 'loaded' && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain select-none"
        />
      )}
      {status === 'missing' && fallback}
    </span>
  );
};
