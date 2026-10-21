import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROOM_ITEMS, ROOM_OBJECTS, SHOP_ROOM_ITEMS } from '../../data/room';
import { REWARD_SHOP_ITEMS } from '../../data/rewardShop';
import { WARDROBE_ITEMS } from '../../data/wardrobe';
import { ICON_ID_BY_EMOJI, getIconSrc } from './iconArt';

const ICON_DIR = join(process.cwd(), 'public', 'art', 'icons');
const DOCK_EMOJI = ['📅', '👫', '📊', '🏠', '📝'];
const VARIATION_SELECTOR = /\uFE0F/g;

const CATALOG_EMOJI = [
  ...ROOM_OBJECTS,
  ...ROOM_ITEMS,
  ...SHOP_ROOM_ITEMS,
  ...WARDROBE_ITEMS,
  ...REWARD_SHOP_ITEMS,
  ...DOCK_EMOJI.map((emoji) => ({ id: `dock ${emoji}`, emoji })),
].map((item) => ({ id: item.id, emoji: item.emoji }));

describe('ICON_ID_BY_EMOJI', () => {
  it('has a picture on disk, in both sizes, for every mapped icon', () => {
    for (const id of new Set(Object.values(ICON_ID_BY_EMOJI))) {
      expect(existsSync(join(ICON_DIR, `${id}.webp`)), `${id}.webp`).toBe(true);
      expect(existsSync(join(ICON_DIR, `${id}@128.webp`)), `${id}@128.webp`).toBe(true);
    }
  });

  it('covers every emoji of the room, shop, wardrobe and dock catalogs', () => {
    const unmapped = CATALOG_EMOJI.filter(({ emoji }) => getIconSrc(emoji, 64) === null).map(({ id }) => id);
    expect(unmapped).toEqual([]);
  });

  it('keys carry no variation selector, so both spellings of an emoji resolve', () => {
    expect(Object.keys(ICON_ID_BY_EMOJI).filter((key) => VARIATION_SELECTOR.test(key))).toEqual([]);
    expect(getIconSrc('❤️', 64)).toBe(getIconSrc('❤', 64));
    expect(getIconSrc('🛏️', 64)).toBe('/art/icons/bed@128.webp');
  });
});

describe('getIconSrc', () => {
  it('uses the 128px picture while the size on screen stays within 128 device pixels', () => {
    expect(getIconSrc('🛏️', 64, 2)).toBe('/art/icons/bed@128.webp');
    expect(getIconSrc('🛏️', 64, 3)).toBe('/art/icons/bed.webp');
    expect(getIconSrc('🛏️', Number.POSITIVE_INFINITY)).toBe('/art/icons/bed.webp');
  });

  it('is null for an emoji without a drawn icon', () => {
    expect(getIconSrc('🧿', 64)).toBeNull();
  });

  it('treats a bad pixel ratio as 1', () => {
    expect(getIconSrc('🛏️', 100, 0)).toBe('/art/icons/bed@128.webp');
  });
});
