import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { RewardShopItem } from '../../data/rewardShop';
import { getRewardRarity } from '../../data/mysteryBox';
import { RARITY_LABEL_HE, SEASON_WINDOWS } from '../../data/shopRarity';
import { STREAK_SHIELD_ITEM_ID } from '../../data/streak';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { EmojiIcon } from '../art/EmojiIcon';
import { ShopProgressBar } from './ShopProgressBar';
import {
  CLAY_SHADOW_CLASS,
  FOCUS_RING_CLASS,
  getEmojiTileClass,
  OFFSCREEN_SKIP_CLASS,
  PRESS_CLASS,
  RARITY_STYLE,
} from './shopStyles';

export interface ShopItemState {
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
}

interface ShopItemCardProps {
  item: RewardShopItem;
  state: ShopItemState;
  diamonds: number;
  isGirl: boolean;
  streakShieldsLeft: number;
  theme: ThemeDefinition;
  onSelect: (item: RewardShopItem) => void;
}

function getButtonLabel(item: RewardShopItem, state: ShopItemState, isGirl: boolean, missing: number): React.ReactNode {
  if (state.isOwned) {
    if (item.category !== 'avatar') return '✓ נמצא באלבום שלך';
    if (state.isEquipped) return '✓ האווטאר הפעיל שלך';
    return isGirl ? 'בחרי כאווטאר ראשי' : 'בחר כאווטאר ראשי';
  }
  if (!state.canAfford) {
    return (
      <>
        <Lock className="hidden sm:block w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">חסרים עוד {missing} 💎</span>
      </>
    );
  }
  return item.category === 'mystery' ? `🎁 פתיחת קופסה ב-${item.costDiamonds} 💎` : `פתיחה ב-${item.costDiamonds} 💎`;
}

function getButtonClass(item: RewardShopItem, state: ShopItemState, theme: ThemeDefinition): string {
  if (state.isOwned) {
    if (item.category !== 'avatar') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 cursor-default';
    return state.isEquipped
      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-400'
      : theme.secondaryBtnClass;
  }
  return state.canAfford ? theme.primaryBtnClass : theme.secondaryBtnClass;
}

function StatusChip({ item, state, theme }: { item: RewardShopItem; state: ShopItemState; theme: ThemeDefinition }) {
  if (state.isOwned) {
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold inline-flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{state.isEquipped ? 'מצויד כעת' : 'פתוח'}</span>
      </span>
    );
  }
  // On a phone's two-column shelf the button already carries the price, so the chip waits for sm:
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold hidden sm:inline-flex items-center gap-1 tabular-nums ${theme.badgeClass}`}>
      {!state.canAfford && <Lock className="w-3.5 h-3.5 shrink-0" aria-label="נעול" />}
      <span>💎 {item.costDiamonds}</span>
    </span>
  );
}

/** One item on the shelf: emoji tile, name, rarity, price, and its single action button. */
export function ShopItemCard({ item, state, diamonds, isGirl, streakShieldsLeft, theme, onSelect }: ShopItemCardProps) {
  const rarity = getRewardRarity(item);
  const isMystery = item.category === 'mystery';
  // Only rare and up are labelled: "common" on a prize only tells a child it is ordinary
  const hasRarityBadge = !isMystery && item.costDiamonds > 0 && rarity !== 'common';
  const missing = Math.max(0, item.costDiamonds - diamonds);
  const isLocked = !state.isOwned && !state.canAfford;
  const equippedRing = state.isEquipped ? 'ring-4 ring-amber-400/80' : '';

  return (
    <article className={`relative rounded-3xl ${CLAY_SHADOW_CLASS} ${OFFSCREEN_SKIP_CLASS} ${equippedRing}`}>
      <div className={`h-full rounded-3xl p-3 sm:p-4 flex flex-col gap-3 overflow-hidden ${theme.cardBgClass}`}>
        {hasRarityBadge && (
          <span aria-hidden="true" className={`absolute inset-x-6 top-0 h-1.5 rounded-b-full ${RARITY_STYLE[rarity].strip}`} />
        )}

        <div className="flex items-start justify-between gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getEmojiTileClass(item)}`}>
            <EmojiIcon emoji={item.emoji} size="3rem" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusChip item={item} state={state} theme={theme} />
            {hasRarityBadge && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${RARITY_STYLE[rarity].badge}`}>
                {RARITY_LABEL_HE[rarity]}
                {item.season ? ` · ${SEASON_WINDOWS[item.season].labelHe}` : ''}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-extrabold text-sm md:text-base leading-snug text-balance">{item.titleHe}</h3>
          <p className="text-xs opacity-75" dir="ltr" lang="en">
            {item.titleEn}
          </p>
        </div>

        <p className={`hidden sm:block text-xs leading-relaxed text-pretty ${theme.mutedTextClass}`}>{item.descriptionHe}</p>
        {item.id === STREAK_SHIELD_ITEM_ID && streakShieldsLeft > 0 && (
          <p className="text-xs font-extrabold">
            🛡️ {streakShieldsLeft === 1 ? 'יש לך מגן רצף אחד' : `יש לך ${streakShieldsLeft} מגני רצף`}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {/* An empty bar says nothing; it shows once some diamonds are saved toward the price */}
          {isLocked && diamonds > 0 && (
            <ShopProgressBar diamonds={diamonds} costDiamonds={item.costDiamonds} label={`התקדמות אל ${item.titleHe}`} />
          )}
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={`w-full min-h-11 px-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 ${getButtonClass(item, state, theme)} ${FOCUS_RING_CLASS} ${PRESS_CLASS}`}
          >
            {getButtonLabel(item, state, isGirl, missing)}
          </button>
        </div>
      </div>
    </article>
  );
}
