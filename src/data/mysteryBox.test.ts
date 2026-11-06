import { describe, expect, it } from 'vitest';
import { REWARD_SHOP_ITEMS } from './rewardShop';
import { getMysteryPool, rollMysteryBox } from './mysteryBox';
import { isSeasonOpen, RARITY_PRICE_BANDS, rarityFromCost } from './shopRarity';
import { getRewardRarity } from './mysteryBox';

const JULY = new Date(2026, 6, 10);
const JANUARY = new Date(2026, 0, 5);

describe('shop catalog', () => {
  it('has unique ids', () => {
    const ids = REWARD_SHOP_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps every explicit rarity inside its price band', () => {
    REWARD_SHOP_ITEMS.filter((item) => item.rarity).forEach((item) => {
      const [min, max] = RARITY_PRICE_BANDS[item.rarity!];
      expect(item.costDiamonds, item.id).toBeGreaterThanOrEqual(min);
      expect(item.costDiamonds, item.id).toBeLessThanOrEqual(max);
    });
  });

  it('does not reuse an emoji between two avatars', () => {
    const emojis = REWARD_SHOP_ITEMS.filter((item) => item.category === 'avatar').map((item) => item.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it('is large enough to keep a learner busy', () => {
    const paid = REWARD_SHOP_ITEMS.filter((item) => item.costDiamonds > 0 && item.category !== 'mystery');
    expect(paid.length).toBeGreaterThanOrEqual(90);
    expect(paid.reduce((sum, item) => sum + item.costDiamonds, 0)).toBeGreaterThan(8000);
  });
});

describe('isSeasonOpen', () => {
  it('is always open without a season', () => {
    expect(isSeasonOpen(undefined, JULY)).toBe(true);
  });

  it('opens summer in July and not in January', () => {
    expect(isSeasonOpen('summer', JULY)).toBe(true);
    expect(isSeasonOpen('summer', JANUARY)).toBe(false);
  });

  it('handles a window that wraps past new year', () => {
    expect(isSeasonOpen('hanukkah', JANUARY)).toBe(true);
    expect(isSeasonOpen('hanukkah', JULY)).toBe(false);
  });
});

describe('getMysteryPool', () => {
  it('only holds paid, unowned items that are in season', () => {
    const pool = getMysteryPool(['avatar-tiger'], JANUARY);
    expect(pool.map((i) => i.id)).not.toContain('avatar-tiger');
    expect(pool.map((i) => i.id)).not.toContain('season-palm-tree');
    expect(pool.map((i) => i.id)).toContain('season-menorah');
    pool.forEach((item) => {
      expect(item.costDiamonds).toBeGreaterThan(0);
      expect(['boost', 'mystery']).not.toContain(item.category);
    });
    expect(pool.map((i) => i.id)).not.toContain('pass-sticker-studio');
  });
});

describe('rollMysteryBox', () => {
  it('returns an item the learner does not own', () => {
    const owned = ['avatar-tiger', 'avatar-bear'];
    for (let i = 0; i < 50; i += 1) {
      const result = rollMysteryBox(owned, 'bronze', JULY, Math.random);
      expect(result.itemId).not.toBeNull();
      expect(owned).not.toContain(result.itemId);
    }
  });

  it('picks the rarity by weight: a very low roll gives the first rarity band', () => {
    const result = rollMysteryBox([], 'gold', JULY, () => 0);
    const item = REWARD_SHOP_ITEMS.find((i) => i.id === result.itemId)!;
    expect(getRewardRarity(item)).toBe('rare');
  });

  it('can give a legendary item from a gold box', () => {
    const result = rollMysteryBox([], 'gold', JULY, () => 0.999);
    const item = REWARD_SHOP_ITEMS.find((i) => i.id === result.itemId)!;
    expect(getRewardRarity(item)).toBe('legendary');
  });

  it('falls back to another rarity when the picked one is all owned', () => {
    const commons = REWARD_SHOP_ITEMS.filter((i) => getRewardRarity(i) === 'common').map((i) => i.id);
    const result = rollMysteryBox(commons, 'bronze', JULY, () => 0);
    expect(result.itemId).not.toBeNull();
    expect(commons).not.toContain(result.itemId);
  });

  it('returns null (a refund) when everything is owned', () => {
    const all = REWARD_SHOP_ITEMS.map((i) => i.id);
    expect(rollMysteryBox(all, 'silver', JULY, Math.random).itemId).toBeNull();
  });

  it('is deterministic for a fixed rng', () => {
    expect(rollMysteryBox([], 'silver', JULY, () => 0.5)).toEqual(rollMysteryBox([], 'silver', JULY, () => 0.5));
  });
});

describe('rarityFromCost', () => {
  it('maps price bands to rarities', () => {
    expect(rarityFromCost(50)).toBe('common');
    expect(rarityFromCost(150)).toBe('rare');
    expect(rarityFromCost(300)).toBe('epic');
    expect(rarityFromCost(600)).toBe('legendary');
  });
});
