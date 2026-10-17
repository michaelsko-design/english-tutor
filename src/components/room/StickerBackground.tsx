import React from 'react';
import { NameableItem } from '../../data/room';
import { ItemIcon } from './ItemIcon';

interface StickerBackgroundProps {
  sticker: NameableItem;
}

const ROWS = 9;
const COLUMNS = 6;

/** A faint repeating pattern of the chosen sticker behind the dashboard (Feature 12 Sticker Studio). */
export const StickerBackground: React.FC<StickerBackgroundProps> = ({ sticker }) => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-[0.13]" aria-hidden="true">
    <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
      {Array.from({ length: ROWS * COLUMNS }, (_, i) => {
        const row = Math.floor(i / COLUMNS);
        return (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ transform: `rotate(${(i % 3) * 12 - 12}deg) translateX(${row % 2 ? 50 : 0}%)` }}
          >
            <ItemIcon item={sticker} size="2.5rem" />
          </div>
        );
      })}
    </div>
  </div>
);
