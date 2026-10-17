import React from 'react';
import { NameableItem } from '../../data/room';

interface ItemIconProps {
  item: NameableItem;
  /** CSS size of the icon box, e.g. '2rem' or '7cqw' */
  size: string;
  className?: string;
}

/** An item's emoji, or the picture of a drawn sticker. */
export const ItemIcon: React.FC<ItemIconProps> = ({ item, size, className = '' }) =>
  item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt=""
      draggable={false}
      className={`inline-block object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <span className={`inline-block leading-none ${className}`} style={{ fontSize: size }} aria-hidden="true">
      {item.emoji}
    </span>
  );
