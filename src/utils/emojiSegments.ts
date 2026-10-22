import { ICON_ID_BY_EMOJI } from '../components/art/iconArt';
import { SYMBOL_ICONS } from '../components/art/symbolIcons';

/** A run of plain text, or one emoji or symbol that has a drawn icon. */
export type EmojiSegment = { kind: 'text'; text: string } | { kind: 'emoji'; emoji: string };

const VARIATION_SELECTOR = '\uFE0F';

/** The drawn emoji and the symbols with a Lucide icon, longest first, each with its optional variation selector. */
const ICON_EMOJI_PATTERN = new RegExp(
  `(${[...Object.keys(ICON_ID_BY_EMOJI), ...Object.keys(SYMBOL_ICONS)]
    .sort((a, b) => b.length - a.length)
    .map((emoji) => `${emoji}${VARIATION_SELECTOR}?`)
    .join('|')})`,
  'u',
);

/** Splits a string around the emoji that have a drawn icon; null when it holds none. */
export function splitIconEmoji(text: string): EmojiSegment[] | null {
  if (text.length === 0) return null;
  const parts = text.split(ICON_EMOJI_PATTERN);
  if (parts.length === 1) return null;
  const segments: EmojiSegment[] = [];
  parts.forEach((part, index) => {
    if (part.length === 0) return;
    // split() with a capture group puts the matches at the odd positions
    segments.push(index % 2 === 1 ? { kind: 'emoji', emoji: part } : { kind: 'text', text: part });
  });
  return segments;
}
