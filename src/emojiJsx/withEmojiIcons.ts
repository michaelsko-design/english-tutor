import React from 'react';
import { EmojiIcon } from '../components/art/EmojiIcon';
import { splitIconEmoji } from '../utils/emojiSegments';

/** Elements whose text is not shown as rendered children, or must stay plain. */
const PLAIN_TEXT_TAGS = new Set(['option', 'textarea', 'title', 'style', 'script', 'input']);
/** A prop that keeps an element's own emoji text as it is (the fallback inside EmojiIcon). */
export const RAW_EMOJI_PROP = 'data-raw-emoji';
const INLINE_ICON_SIZE = '1.2em';

function iconsInString(text: string): React.ReactNode {
  const segments = splitIconEmoji(text);
  if (!segments) return text;
  return segments.map((segment, index) =>
    segment.kind === 'text'
      ? segment.text
      : React.createElement(EmojiIcon, { key: index, emoji: segment.emoji, size: INLINE_ICON_SIZE, isInline: true }),
  );
}

function iconsInChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') return iconsInString(children);
  if (Array.isArray(children)) {
    const swapped = children.map((child) => (typeof child === 'string' ? iconsInString(child) : child));
    return swapped.some((child, index) => child !== children[index]) ? swapped : children;
  }
  return children;
}

/** The props of a DOM element with every emoji that has a drawn icon in its text swapped for the icon. */
export function withEmojiIcons<P>(type: unknown, props: P): P {
  if (typeof type !== 'string' || PLAIN_TEXT_TAGS.has(type) || typeof props !== 'object' || props === null) return props;
  const { children, [RAW_EMOJI_PROP]: rawEmoji } = props as { children?: React.ReactNode; [RAW_EMOJI_PROP]?: unknown };
  if (children === undefined || rawEmoji !== undefined) return props;
  const swapped = iconsInChildren(children);
  return swapped === children ? props : { ...props, children: swapped };
}
