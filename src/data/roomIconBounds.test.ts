import { describe, expect, it } from 'vitest';
import { ROOM_ICON_BOUNDS } from './roomIconBounds';
import { ROOM_ITEMS, ROOM_OBJECTS, SHOP_ROOM_ITEMS } from './room';

const VARIATION_SELECTOR = '\ufe0f';

describe('ROOM_ICON_BOUNDS', () => {
  const emojis = [...ROOM_ITEMS, ...SHOP_ROOM_ITEMS, ...ROOM_OBJECTS].map((item) => item.emoji.replace(VARIATION_SELECTOR, ''));

  it('measures the drawn object of every room item and object', () => {
    emojis.forEach((emoji) => expect(ROOM_ICON_BOUNDS[emoji], emoji).toBeDefined());
  });

  it('keeps the bounds inside the picture, with the bottom below the top', () => {
    Object.values(ROOM_ICON_BOUNDS).forEach((bounds) => {
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(1);
      expect(bounds.left).toBeLessThan(bounds.right);
      expect(bounds.top).toBeLessThan(bounds.bottom);
      expect(bounds.bottom).toBeLessThanOrEqual(1);
    });
  });
});
