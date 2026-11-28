import React from 'react';
import { RewardCategory } from '../../data/rewardShop';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { FOCUS_RING_CLASS, PRESS_CLASS } from './shopStyles';

export type ShopFilter = RewardCategory | 'all' | 'seasonal';

/** The emoji is decoration (hidden from screen readers); the label is the tab's name */
const TABS: { id: ShopFilter; emoji: string; label: string }[] = [
  { id: 'all', emoji: '🌟', label: 'הכל' },
  { id: 'avatar', emoji: '🐰', label: 'אווטארים לדשבורד' },
  { id: 'accessory', emoji: '🕶️', label: 'אקססוריז לארון' },
  { id: 'sticker', emoji: '🎀', label: 'אלבום מדבקות' },
  { id: 'studio-decor', emoji: '🌸', label: 'עיצוב החדר והסטודיו' },
  { id: 'boost', emoji: '🛡️', label: 'מגני רצף' },
  { id: 'mystery', emoji: '🎁', label: 'קופסאות הפתעה' },
  { id: 'seasonal', emoji: '🗓️', label: 'עונתי' },
];

interface ShopCategoryTabsProps {
  theme: ThemeDefinition;
  selected: ShopFilter;
  onSelect: (filter: ShopFilter) => void;
}

/** One swipeable row on phones; wraps onto lines on wider screens. */
export function ShopCategoryTabs({ theme, selected, onSelect }: ShopCategoryTabsProps) {
  return (
    <div
      role="group"
      aria-label="סינון לפי סוג פריט"
      className="flex gap-1.5 overflow-x-auto overscroll-x-contain snap-x -mx-3 px-3 py-1 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible [scrollbar-width:none]"
    >
      {TABS.map((tab) => {
        const isSelected = selected === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(tab.id)}
            className={`shrink-0 snap-start whitespace-nowrap min-h-11 px-3.5 rounded-2xl text-xs font-extrabold ${
              isSelected ? theme.primaryBtnClass : theme.secondaryBtnClass
            } ${FOCUS_RING_CLASS} ${PRESS_CLASS}`}
          >
            <span aria-hidden="true">{tab.emoji}</span> {tab.label}
          </button>
        );
      })}
    </div>
  );
}
