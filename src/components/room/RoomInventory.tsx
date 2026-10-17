import React from 'react';
import { RoomItem } from '../../data/room';
import { ItemIcon } from './ItemIcon';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface RoomInventoryProps {
  items: RoomItem[];
  placedItemIds: string[];
  selectedItemId: string | null;
  gender: LearnerGender;
  theme: ThemeDefinition;
  onSelectItem: (itemId: string) => void;
}

/** The learner's room items: tap one to pick where it goes. */
export const RoomInventory: React.FC<RoomInventoryProps> = ({
  items,
  placedItemIds,
  selectedItemId,
  gender,
  theme,
  onSelectItem,
}) => {
  const isGirl = gender === 'girl';
  const unplacedCount = items.filter((item) => !placedItemIds.includes(item.id)).length;

  return (
    <section aria-label="הפריטים שלי" className={`p-4 rounded-3xl space-y-3 ${theme.cardBgClass}`} dir="rtl">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-extrabold text-sm sm:text-base">🎁 הפריטים שלי</h3>
        {unplacedCount > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${theme.badgeClass}`}>
            {unplacedCount} מחכים למקום
          </span>
        )}
      </div>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        {isGirl
          ? 'בחרי פריט, ואז מקום מהבהב בחדר. משימה עם 3 כוכבים נותנת פריט חדש!'
          : 'בחר פריט, ואז מקום מהבהב בחדר. משימה עם 3 כוכבים נותנת פריט חדש!'}
      </p>
      <ul className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {items.map((item) => {
          const isPlaced = placedItemIds.includes(item.id);
          const isSelected = selectedItemId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectItem(item.id)}
                aria-pressed={isSelected}
                className={`w-full p-2 rounded-2xl flex flex-col items-center gap-0.5 border-2 transition-all ${
                  isSelected
                    ? 'border-fuchsia-500 bg-fuchsia-500/15 scale-105'
                    : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-current/20'
                }`}
              >
                <ItemIcon item={item} size="1.5rem" />
                <span className="text-[11px] font-extrabold truncate max-w-full">{item.imageUrl ? item.nameEn : item.nameHe}</span>
                <span className={`text-[10px] font-bold ${isPlaced ? 'text-emerald-600 dark:text-emerald-300' : theme.mutedTextClass}`}>
                  {isPlaced ? '✓ בחדר' : 'חדש'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
