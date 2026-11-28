import { RewardRarity } from '../../data/shopRarity';
import { RewardShopItem } from '../../data/rewardShop';

/** Rarity colours: the badge, the reveal box, and the strip along the top edge of a shop card */
export const RARITY_STYLE: Record<RewardRarity, { badge: string; box: string; strip: string }> = {
  common: {
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-200',
    box: 'border-slate-400 bg-slate-500/10',
    strip: 'bg-slate-400/70',
  },
  rare: {
    badge: 'bg-sky-500/20 text-sky-700 dark:text-sky-200',
    box: 'border-sky-400 bg-sky-500/10',
    strip: 'bg-sky-400',
  },
  epic: {
    badge: 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-200',
    box: 'border-fuchsia-400 bg-fuchsia-500/10',
    strip: 'bg-fuchsia-400',
  },
  legendary: {
    badge: 'bg-amber-400/30 text-amber-800 dark:text-amber-200',
    box: 'border-amber-400 bg-amber-400/15',
    strip: 'bg-amber-400',
  },
};

/** Mystery boxes are tinted by their metal, so the three read apart at a glance */
const MYSTERY_TINT: Record<string, string> = {
  'mystery-bronze': 'bg-gradient-to-br from-orange-300/40 to-amber-700/30',
  'mystery-silver': 'bg-gradient-to-br from-slate-200/70 to-slate-400/40',
  'mystery-gold': 'bg-gradient-to-br from-yellow-200/70 to-amber-400/40',
};
const DEFAULT_TILE = 'bg-black/5 dark:bg-white/10';

export function getEmojiTileClass(item: RewardShopItem): string {
  return MYSTERY_TINT[item.id] ?? DEFAULT_TILE;
}

/** Diamonds are fuchsia everywhere in the shop: the wallet, prices and the progress bars */
export const DIAMOND_FILL_CLASS = 'bg-gradient-to-l from-fuchsia-500 to-purple-500';

/** The "clay" lift under each card: a short solid ledge plus a soft drop */
export const CLAY_SHADOW_CLASS = 'shadow-[0_3px_0_0_rgba(0,0,0,0.07),0_14px_28px_-18px_rgba(0,0,0,0.45)]';

/** Visible keyboard focus for every control in the shop */
export const FOCUS_RING_CLASS =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-400/70';

/** A soft press, skipped when the learner asked for less motion */
export const PRESS_CLASS =
  'touch-manipulation transition-transform duration-150 motion-safe:active:translate-y-[2px]';

/** About 95 cards: the browser skips laying out the ones far off-screen */
export const OFFSCREEN_SKIP_CLASS = '[content-visibility:auto] [contain-intrinsic-size:auto_280px]';
