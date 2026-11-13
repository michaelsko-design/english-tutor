import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgePlus,
  CaseSensitive,
  Check,
  Circle,
  FastForward,
  Play,
  Plus,
  Settings,
  Square,
  Undo2,
  Volume2,
  X,
  type LucideIcon,
} from 'lucide-react';

/** Plain symbols that show as Lucide line icons (follow the text colour); key = glyph without variation selector. */
export const SYMBOL_ICONS: Readonly<Record<string, LucideIcon>> = {
  '✓': Check,
  '➡': ArrowRight,
  '⬅': ArrowLeft,
  '⬆': ArrowUp,
  '↩': Undo2,
  '⏹': Square,
  '➕': Plus,
  '⚙': Settings,
  '⚪': Circle,
  '🔊': Volume2,
  '▶': Play,
  '⏩': FastForward,
  '✔': Check,
  '✘': X,
  '🔠': CaseSensitive,
  '🆕': BadgePlus,
};

const VARIATION_SELECTOR = /️/g;

export function getSymbolIcon(glyph: string): LucideIcon | null {
  return SYMBOL_ICONS[glyph.replace(VARIATION_SELECTOR, '')] ?? null;
}
