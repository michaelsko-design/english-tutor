import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  REWARD_SHOP_ITEMS,
  RewardCategory,
  RewardShopItem,
} from '../data/rewardShop';
import { LearnerGender } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { X, Gem, CheckCircle2, Sparkles, ShoppingBag, Lock } from 'lucide-react';

interface RewardShopModalProps {
  diamonds: number;
  unlockedRewardIds: string[];
  equippedAvatarEmoji: string;
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  onBuyReward: (item: RewardShopItem) => void;
  onEquipAvatar: (emoji: string) => void;
  onClose: () => void;
}

export const RewardShopModal: React.FC<RewardShopModalProps> = ({
  diamonds,
  unlockedRewardIds,
  equippedAvatarEmoji,
  gender,
  learnerName,
  theme,
  onBuyReward,
  onEquipAvatar,
  onClose,
}) => {
  const isGirl = gender === 'girl';
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredItems = REWARD_SHOP_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleBuyOrEquip = (item: RewardShopItem) => {
    const isUnlocked =
      item.costDiamonds === 0 || unlockedRewardIds.includes(item.id);

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
      setStatusMessage(
        isGirl
          ? `חסרים לך עוד ${item.costDiamonds - diamonds} 💎 כדי לפתוח את "${item.titleHe}". השלימי משימה כדי להרוויח עוד!`
          : `חסרים לך עוד ${item.costDiamonds - diamonds} 💎 כדי לפתוח את "${item.titleHe}". השלם משימה כדי להרוויח עוד!`
      );
      return;
    }

    confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
    onBuyReward(item);
    setStatusMessage(
      isGirl
        ? `תתחדשי ${learnerName}! פתחת את "${item.titleHe}" ${item.emoji}!`
        : `תתחדש ${learnerName}! פתחת את "${item.titleHe}" ${item.emoji}!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 ${theme.hudBgClass} flex items-center justify-between gap-4 shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${theme.primaryBtnClass}`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div dir="rtl">
              <h2 className="text-lg md:text-xl font-extrabold">
                🛍️ {theme.shopTitleHe} (Reward Shop)
              </h2>
              <p className={`text-xs ${theme.mutedTextClass}`}>
                {isGirl
                  ? 'השתמשי ביהלומים שצברת במשימות כדי לפתוח אווטארים, מדבקות נדירות ומגני רצף!'
                  : 'השתמש ביהלומים שצברת במשימות כדי לפתוח אווטארים, מדבקות נדירות ומגני רצף!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center gap-1.5 font-extrabold text-sm">
              <Gem className="w-4 h-4 text-fuchsia-500" />
              <span>{diamonds} 💎</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`p-2.5 rounded-xl ${theme.secondaryBtnClass}`}
              title="Close Shop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 pt-4 pb-2 space-y-3 shrink-0" dir="rtl">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: '🌟 הכל' },
              { id: 'avatar', label: '🐰 אווטארים לדשבורד' },
              { id: 'sticker', label: '🎀 אלבום מדבקות' },
              { id: 'studio-decor', label: '🌸 עיצוב החדר והסטודיו' },
              { id: 'boost', label: '🛡️ מגני רצף' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as RewardCategory | 'all')}
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

          {statusMessage && (
            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-xs font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
          {filteredItems.map((item) => {
            const isUnlocked =
              item.costDiamonds === 0 || unlockedRewardIds.includes(item.id);
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
                  <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-3xl shrink-0">
                    {item.emoji}
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
                  <h3 className="font-extrabold text-sm md:text-base">
                    {item.titleHe}
                  </h3>
                  <p className="text-xs opacity-70" dir="ltr">
                    {item.titleEn}
                  </p>
                  <p className={`text-xs ${theme.mutedTextClass} mt-1`}>
                    {item.descriptionHe}
                  </p>
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
  );
};
