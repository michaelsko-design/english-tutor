import React, { useRef, useState } from 'react';
import { ModalPortal } from './ModalPortal';
import { EmojiIcon } from './art/EmojiIcon';
import { useDialog } from '../hooks/useDialog';
import { celebrate } from '../utils/celebrate';
import {
  getRewardShopItems,
  RewardCategory,
  RewardShopItem,
} from '../data/rewardShop';
import { getRewardRarity } from '../data/mysteryBox';
import { isSeasonOpen, RARITY_LABEL_HE, RewardRarity, SEASON_WINDOWS } from '../data/shopRarity';
import { LearnerGender } from '../types/learner';
import { STREAK_SHIELD_ITEM_ID } from '../data/streak';
import { ThemeDefinition } from '../themes/themeRegistry';
import { X, Gem, CheckCircle2, Sparkles, ShoppingBag, Lock } from 'lucide-react';

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

const RARITY_STYLE: Record<RewardRarity, { badge: string; box: string }> = {
  common: { badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-200', box: 'border-slate-400 bg-slate-500/10' },
  rare: { badge: 'bg-sky-500/20 text-sky-700 dark:text-sky-200', box: 'border-sky-400 bg-sky-500/10' },
  epic: { badge: 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-200', box: 'border-fuchsia-400 bg-fuchsia-500/10' },
  legendary: { badge: 'bg-amber-400/30 text-amber-800 dark:text-amber-200', box: 'border-amber-400 bg-amber-400/15' },
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
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all' | 'seasonal'>('all');
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
  const filteredItems = visibleItems
    .filter((item) =>
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'seasonal'
          ? Boolean(item.season)
          : item.category === selectedCategory
    )
    // Mystery boxes first, then cheapest first so the next goal is always near the top
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const boxOrder = Number(b.item.category === 'mystery') - Number(a.item.category === 'mystery');
      return boxOrder || a.item.costDiamonds - b.item.costDiamonds || a.index - b.index;
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

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, { onClose: onClose });

  const handleBuyOrEquip = (item: RewardShopItem) => {
    const isUnlocked = isOwned(item);

    if (isUnlocked) {
      if (item.category === 'avatar') {
        onEquipAvatar(item.emoji);
        setStatusMessage(
          isGirl
            ? `האווטאר ${item.emoji} (${item.titleHe}) הוצמד לדשבורד שלך!`
            : `האווטאר ${item.emoji} (${item.titleHe}) הוצמד לדשבורד שלך!`
        );
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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="חנות הפרסים"
        className={`outline-none w-full max-w-4xl wide:max-w-6xl max-h-[90dvh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {/* Header */}
        <div
          className={`px-4 sm:px-6 py-3 sm:py-4 ${theme.hudBgClass} flex items-center justify-between gap-3 shrink-0`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${theme.primaryBtnClass}`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg md:text-xl font-extrabold leading-tight">
                🛍️ {theme.shopTitleHe}
              </h2>
              <p className={`text-xs hidden sm:block ${theme.mutedTextClass}`}>
                {isGirl
                  ? 'השתמשי ביהלומים שצברת במשימות כדי לפתוח אווטארים, מדבקות נדירות ומגני רצף!'
                  : 'השתמש ביהלומים שצברת במשימות כדי לפתוח אווטארים, מדבקות נדירות ומגני רצף!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center gap-1 font-extrabold text-xs sm:text-sm">
              <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-500" />
              <span>{diamonds}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`p-2 sm:p-2.5 rounded-xl ${theme.secondaryBtnClass}`}
              aria-label="סגירה"
              title="סגירה"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 space-y-2.5 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: '🌟 הכל' },
              { id: 'avatar', label: '🐰 אווטארים לדשבורד' },
              { id: 'accessory', label: '🕶️ אקססוריז לארון' },
              { id: 'sticker', label: '🎀 אלבום מדבקות' },
              { id: 'studio-decor', label: '🌸 עיצוב החדר והסטודיו' },
              { id: 'boost', label: '🛡️ מגני רצף' },
              { id: 'mystery', label: '🎁 קופסאות הפתעה' },
              { id: 'seasonal', label: '🗓️ עונתי' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as RewardCategory | 'all' | 'seasonal')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedCategory === tab.id
                    ? theme.primaryBtnClass
                    : theme.secondaryBtnClass
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {nextGoal && !revealedItem && (
            <p className={`text-xs font-extrabold ${theme.mutedTextClass}`}>
              🎯 המטרה הבאה: <EmojiIcon emoji={nextGoal.emoji} size="1rem" /> {nextGoal.titleHe} — חסרים עוד{' '}
              {nextGoal.costDiamonds - diamonds} 💎
            </p>
          )}

          {revealedItem && (
            <div
              role="status"
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${RARITY_STYLE[getRewardRarity(revealedItem)].box}`}
            >
              <EmojiIcon emoji={revealedItem.emoji} size="3.5rem" />
              <div className="min-w-0">
                <p className="text-xs font-extrabold">
                  🎉 {RARITY_LABEL_HE[getRewardRarity(revealedItem)]} — קיבלת פריט חדש!
                </p>
                <p className="font-extrabold text-base">{revealedItem.titleHe}</p>
                <p className="text-xs opacity-80" dir="ltr" lang="en">
                  {revealedItem.titleEn}
                </p>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-xs font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {filteredItems.length === 0 && (
          <p className={`p-6 text-sm font-extrabold text-center ${theme.mutedTextClass}`}>
            🗓️ אין עכשיו פריטים עונתיים למכירה. הם חוזרים בחגים ובעונות, כדאי לחסוך יהלומים!
          </p>
        )}

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isUnlocked = isOwned(item);
            const isEquipped =
              item.category === 'avatar' && equippedAvatarEmoji === item.emoji;
            const canAfford = isUnlocked || diamonds >= item.costDiamonds;
            const missingDiamonds = Math.max(0, item.costDiamonds - diamonds);

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 ${theme.cardBgClass} flex flex-col justify-between gap-3 transition-all ${
                  isEquipped ? 'ring-2 ring-amber-400' : ''
                } ${
                  !canAfford
                    ? 'opacity-60 grayscale-[65%] border-dashed border-slate-300 dark:border-slate-700 hover:opacity-85'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <EmojiIcon emoji={item.emoji} size="2.75rem" />
                  </div>
                  {isUnlocked ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isEquipped ? 'מצויד כעת' : 'פתוח'}</span>
                    </span>
                  ) : !canAfford ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>💎 {item.costDiamonds}</span>
                    </span>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
                      💎 {item.costDiamonds}
                    </span>
                  )}
                </div>

                <div>
                  {item.category !== 'mystery' && item.costDiamonds > 0 && (
                    <span
                      className={`inline-block mb-1 px-2 py-0.5 rounded-full text-xs font-extrabold ${RARITY_STYLE[getRewardRarity(item)].badge}`}
                    >
                      {RARITY_LABEL_HE[getRewardRarity(item)]}
                      {item.season ? ` · ${SEASON_WINDOWS[item.season].labelHe}` : ''}
                    </span>
                  )}
                  <h3 className="font-extrabold text-sm md:text-base">
                    {item.titleHe}
                  </h3>
                  <p className="text-xs opacity-70" dir="ltr" lang="en">
                    {item.titleEn}
                  </p>
                  <p className={`text-xs ${theme.mutedTextClass} mt-1`}>
                    {item.descriptionHe}
                  </p>
                  {item.id === STREAK_SHIELD_ITEM_ID && streakShieldsLeft > 0 && (
                    <p className="text-xs font-extrabold mt-1">
                      🛡️ {streakShieldsLeft === 1 ? 'יש לך מגן רצף אחד' : `יש לך ${streakShieldsLeft} מגני רצף`}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyOrEquip(item)}
                  className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    isUnlocked
                      ? item.category === 'avatar'
                        ? isEquipped
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400'
                          : theme.secondaryBtnClass
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 cursor-default'
                      : !canAfford
                        ? 'bg-slate-200/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 active:scale-[0.99] cursor-pointer'
                        : theme.primaryBtnClass
                  }`}
                >
                  {isUnlocked ? (
                    item.category === 'avatar' ? (
                      isEquipped ? (
                        '✓ האווטאר הפעיל שלך'
                      ) : isGirl ? (
                        'בחרי כאווטאר ראשי'
                      ) : (
                        'בחר כאווטאר ראשי'
                      )
                    ) : (
                      '✓ נמצא באלבום שלך'
                    )
                  ) : !canAfford ? (
                    <>
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>חסרים עוד {missingDiamonds} 💎</span>
                    </>
                  ) : item.category === 'mystery' ? (
                    `🎁 פתיחת קופסה ב-${item.costDiamonds} 💎`
                  ) : (
                    `פתיחה ב-${item.costDiamonds} 💎`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
