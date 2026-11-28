import React from 'react';
import { RewardShopItem } from '../../data/rewardShop';
import { EmojiIcon } from '../art/EmojiIcon';
import { ShopProgressBar } from './ShopProgressBar';

interface ShopGoalCardProps {
  item: RewardShopItem;
  diamonds: number;
  mutedTextClass: string;
}

/** The cheapest thing the learner can't buy yet, and how close they are: the shop's savings jar. */
export function ShopGoalCard({ item, diamonds, mutedTextClass }: ShopGoalCardProps) {
  const missing = Math.max(0, item.costDiamonds - diamonds);
  return (
    <div className="max-w-2xl flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed border-fuchsia-400/50 bg-fuchsia-500/5">
      <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center shrink-0">
        <EmojiIcon emoji={item.emoji} size="2.25rem" />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-xs sm:text-sm font-extrabold flex flex-wrap items-baseline gap-x-1.5">
          <span className={mutedTextClass}>🎯 המטרה הבאה:</span>
          <span>{item.titleHe}</span>
        </p>
        <ShopProgressBar diamonds={diamonds} costDiamonds={item.costDiamonds} label={`התקדמות אל ${item.titleHe}`} />
      </div>
      <p className="shrink-0 text-xs font-extrabold text-center leading-tight">
        <span className={`block ${mutedTextClass}`}>חסרים עוד</span>
        <span className="text-base font-black tabular-nums">{missing}</span> 💎
      </p>
    </div>
  );
}
