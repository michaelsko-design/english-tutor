import React, { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ModalPortal } from './ModalPortal';
import { EmojiIcon } from './art/EmojiIcon';
import { useDialog } from '../hooks/useDialog';
import { celebrate } from '../utils/celebrate';
import { getRewardShopItems, RewardShopItem } from '../data/rewardShop';
import { getRewardRarity } from '../data/mysteryBox';
import { isSeasonOpen, RARITY_LABEL_HE } from '../data/shopRarity';
import { LearnerGender } from '../types/learner';
import { STREAK_SHIELD_ITEM_ID } from '../data/streak';
import { ThemeDefinition } from '../themes/themeRegistry';
import { ShopHeader } from './shop/ShopHeader';
import { ShopGoalCard } from './shop/ShopGoalCard';
import { ShopCategoryTabs, ShopFilter } from './shop/ShopCategoryTabs';
import { ShopItemCard } from './shop/ShopItemCard';
import { RARITY_STYLE } from './shop/shopStyles';

interface RewardShopModalProps {
  diamonds: number;
  unlockedRewardIds: string[];
  equippedAvatarEmoji: string;
  /** Streak shields owned and not used up yet; shields can be bought again */
  streakShieldsLeft: number;
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  onBuyReward: (item: RewardShopItem) => void;
  /** Opens a mystery box; returns the item won, or null when nothing happened */
  onOpenMysteryBox?: (box: RewardShopItem) => RewardShopItem | null;
  onEquipAvatar: (emoji: string) => void;
  onClose: () => void;
}

const matchesFilter = (item: RewardShopItem, filter: ShopFilter): boolean => {
  if (filter === 'all') return true;
  if (filter === 'seasonal') return Boolean(item.season);
  return item.category === filter;
};

export const RewardShopModal: React.FC<RewardShopModalProps> = ({
  diamonds,
  unlockedRewardIds,
  equippedAvatarEmoji,
  streakShieldsLeft,
  gender,
  learnerName,
  theme,
  onBuyReward,
  onOpenMysteryBox,
  onEquipAvatar,
  onClose,
}) => {
  const isGirl = gender === 'girl';
  const [selectedCategory, setSelectedCategory] = useState<ShopFilter>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [revealedItem, setRevealedItem] = useState<RewardShopItem | null>(null);

  const now = new Date();
  const shopItems = getRewardShopItems(gender);

  /** Owned for good; shields and mystery boxes are used up, so they are never "owned" */
  const isOwned = (item: RewardShopItem): boolean =>
    item.id !== STREAK_SHIELD_ITEM_ID &&
    item.category !== 'mystery' &&
    (item.costDiamonds === 0 || unlockedRewardIds.includes(item.id));

  // A seasonal item is on sale only inside its window; one already owned stays visible
  const visibleItems = shopItems.filter((item) => isSeasonOpen(item.season, now) || isOwned(item));
  // What is still for sale cheapest first (the next goal is near the top), what the learner already
  // owns last. Mystery boxes sort by price like everything else: a chance item is not pushed first.
  const filteredItems = visibleItems
    .filter((item) => matchesFilter(item, selectedCategory))
    .map((item, index) => ({ item, index, isOwned: isOwned(item) }))
    .sort((a, b) => {
      const ownedOrder = Number(a.isOwned) - Number(b.isOwned);
      return ownedOrder || a.item.costDiamonds - b.item.costDiamonds || a.index - b.index;
    })
    .map(({ item }) => item);

  const nextGoal = visibleItems
    .filter(
      (item) =>
        !isOwned(item) &&
        item.category !== 'mystery' &&
        item.id !== STREAK_SHIELD_ITEM_ID &&
        item.costDiamonds > diamonds
    )
    .sort((a, b) => a.costDiamonds - b.costDiamonds)[0];

  const revealedRarity = revealedItem ? getRewardRarity(revealedItem) : null;

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, { onClose: onClose });

  const handleBuyOrEquip = (item: RewardShopItem) => {
    if (isOwned(item)) {
      if (item.category === 'avatar') {
        onEquipAvatar(item.emoji);
        setStatusMessage(`האווטאר ${item.emoji} (${item.titleHe}) הוצמד לדשבורד שלך!`);
      } else {
        setStatusMessage(`הפריט "${item.titleHe}" כבר נמצא באוסף שלך! ✨`);
      }
      return;
    }

    if (diamonds < item.costDiamonds) {
      setRevealedItem(null);
      setStatusMessage(
        isGirl
          ? `חסרים לך עוד ${item.costDiamonds - diamonds} 💎 כדי לפתוח את "${item.titleHe}". השלימי משימה כדי להרוויח עוד!`
          : `חסרים לך עוד ${item.costDiamonds - diamonds} 💎 כדי לפתוח את "${item.titleHe}". השלם משימה כדי להרוויח עוד!`
      );
      return;
    }

    if (item.category === 'mystery') {
      const won = onOpenMysteryBox?.(item) ?? null;
      if (!won) {
        setStatusMessage('כבר יש לך כל פריט שהקופסה הזאת יכולה לתת, אז היא נשארה סגורה ולא שילמת. נסו קופסה אחרת!');
        return;
      }
      celebrate(getRewardRarity(won) === 'common' ? 'small' : 'big');
      setRevealedItem(shopItems.find((candidate) => candidate.id === won.id) ?? won);
      setStatusMessage(null);
      return;
    }

    setRevealedItem(null);
    celebrate('small');
    onBuyReward(item);
    setStatusMessage(
      isGirl
        ? `תתחדשי ${learnerName}! פתחת את "${item.titleHe}" ${item.emoji}!`
        : `תתחדש ${learnerName}! פתחת את "${item.titleHe}" ${item.emoji}!`
    );
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 md:p-6">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="חנות הפרסים"
          className={`outline-none w-full max-w-4xl wide:max-w-6xl max-h-[94dvh] sm:max-h-[90dvh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
        >
          <ShopHeader theme={theme} diamonds={diamonds} isGirl={isGirl} onClose={onClose} />

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="px-3 sm:px-6 pt-3 pb-2 space-y-3">
              <ShopCategoryTabs theme={theme} selected={selectedCategory} onSelect={setSelectedCategory} />

              {nextGoal && !revealedItem && (
                <ShopGoalCard item={nextGoal} diamonds={diamonds} mutedTextClass={theme.mutedTextClass} />
              )}
            </div>

            {filteredItems.length === 0 ? (
              <p className={`p-6 text-sm font-extrabold text-center text-balance ${theme.mutedTextClass}`}>
                🗓️ אין עכשיו פריטים עונתיים למכירה. הם חוזרים בחגים ובעונות, כדאי לחסוך יהלומים!
              </p>
            ) : (
              <div className="px-3 sm:px-6 pt-2 pb-6 grid grid-cols-2 lg:grid-cols-3 wide:grid-cols-4 gap-3 sm:gap-4">
                {filteredItems.map((item) => {
                  const owned = isOwned(item);
                  const state = {
                    isOwned: owned,
                    isEquipped: item.category === 'avatar' && equippedAvatarEmoji === item.emoji,
                    canAfford: owned || diamonds >= item.costDiamonds,
                  };
                  return (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      state={state}
                      diamonds={diamonds}
                      isGirl={isGirl}
                      streakShieldsLeft={streakShieldsLeft}
                      theme={theme}
                      onSelect={handleBuyOrEquip}
                    />
                  );
                })}
              </div>
            )}

            {/* Feedback sits at the bottom of the scroller, next to the thumb and the card just tapped */}
            <div aria-live="polite" className={`sticky bottom-0 z-10 px-3 sm:px-6 space-y-2 ${revealedItem || statusMessage ? 'pb-3' : ''}`}>
              {revealedItem && (
                <div
                  role="status"
                  className={`p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-3 shadow-xl backdrop-blur-md ${theme.cardBgClass} ${RARITY_STYLE[revealedRarity ?? 'common'].box}`}
                >
                  <span className="animate-reward-pop shrink-0">
                    <EmojiIcon emoji={revealedItem.emoji} size="3.5rem" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold">
                      🎉 קיבלת פריט חדש!{revealedRarity && revealedRarity !== 'common' ? ` ${RARITY_LABEL_HE[revealedRarity]}!` : ''}
                    </p>
                    <p className="font-extrabold text-base">{revealedItem.titleHe}</p>
                    <p className="text-xs opacity-80" dir="ltr" lang="en">
                      {revealedItem.titleEn}
                    </p>
                  </div>
                </div>
              )}
              {statusMessage && (
                <p
                  className={`p-3 rounded-2xl border-2 border-purple-400/50 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl backdrop-blur-md ${theme.cardBgClass}`}
                >
                  <Sparkles className="w-4 h-4 text-purple-500 shrink-0" aria-hidden="true" />
                  <span className="text-pretty">{statusMessage}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
