/**
 * Dev-only harness for the reward shop (shop-preview.html): the real modal with fixed learner data,
 * so before/after screenshots of a redesign are like-for-like. ?theme=<ThemeId>.
 */
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/rubik';
import './index.css';
import { RewardShopModal } from './components/RewardShopModal';
import { getRewardShopItems, RewardShopItem } from './data/rewardShop';
import { resolveTheme } from './themes/themeRegistry';
import { ThemeId } from './types/learner';

const themeId = (new URLSearchParams(location.search).get('theme') ?? 'cozy-studio') as ThemeId;
const theme = resolveTheme(themeId);
document.documentElement.classList.toggle('dark', theme.isDark);

const START_DIAMONDS = 120;
const START_OWNED = ['avatar-kpop-bunny', 'sticker-strawberry-croissant'];
/** The mystery box always gives the same prize, so the reveal shot is repeatable */
const MYSTERY_PRIZE_ID = 'sticker-london-compass';

function Preview() {
  const [diamonds, setDiamonds] = useState(START_DIAMONDS);
  const [owned, setOwned] = useState<string[]>(START_OWNED);
  const [equipped, setEquipped] = useState('🐰');
  const items = getRewardShopItems('girl');

  const buy = (item: RewardShopItem) => {
    setDiamonds((d) => d - item.costDiamonds);
    setOwned((ids) => [...ids, item.id]);
  };
  const openBox = (box: RewardShopItem): RewardShopItem | null => {
    const prize = items.find((item) => item.id === MYSTERY_PRIZE_ID) ?? null;
    if (!prize) return null;
    setDiamonds((d) => d - box.costDiamonds);
    setOwned((ids) => [...ids, prize.id]);
    return prize;
  };

  return (
    <div className={`min-h-dvh ${theme.pageBgClass}`}>
      <RewardShopModal
        diamonds={diamonds}
        unlockedRewardIds={owned}
        equippedAvatarEmoji={equipped}
        streakShieldsLeft={1}
        gender="girl"
        learnerName="נועה"
        theme={theme}
        onBuyReward={buy}
        onOpenMysteryBox={openBox}
        onEquipAvatar={setEquipped}
        onClose={() => undefined}
      />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
