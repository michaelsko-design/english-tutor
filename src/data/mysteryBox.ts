import { MysteryBoxTier, REWARD_SHOP_ITEMS, RewardShopItem } from './rewardShop';
import { isSeasonOpen, RARITY_ORDER, RewardRarity, rarityFromCost } from './shopRarity';

/**
 * Mystery boxes: a paid roll that unlocks a random shop item the learner does not own yet.
 * Pure; the random source is injected so tests are deterministic.
 */

export const MYSTERY_BOX_TIER_BY_ID: Readonly<Record<string, MysteryBoxTier>> = {
  'mystery-bronze': 'bronze',
  'mystery-silver': 'silver',
  'mystery-gold': 'gold',
};

/** Relative chance of each rarity per box. A rarity with nothing left to win is skipped. */
export const MYSTERY_WEIGHTS: Record<MysteryBoxTier, Partial<Record<RewardRarity, number>>> = {
  bronze: { common: 80, rare: 20 },
  silver: { common: 30, rare: 55, epic: 15 },
  gold: { rare: 40, epic: 45, legendary: 15 },
};

/** Items a box never gives: free ones, repeatables, the studio pass. */
const EXCLUDED_ITEM_IDS = new Set(['pass-sticker-studio']);

export function getRewardRarity(item: RewardShopItem): RewardRarity {
  return item.rarity ?? rarityFromCost(item.costDiamonds);
}

export function isMysteryBox(item: RewardShopItem): boolean {
  return item.category === 'mystery';
}

/** Every item a box could give right now: paid, not owned, and in season. */
export function getMysteryPool(ownedIds: readonly string[], now: Date): RewardShopItem[] {
  const owned = new Set(ownedIds);
  return REWARD_SHOP_ITEMS.filter(
    (item) =>
      item.costDiamonds > 0 &&
      item.category !== 'boost' &&
      item.category !== 'mystery' &&
      !EXCLUDED_ITEM_IDS.has(item.id) &&
      !owned.has(item.id) &&
      isSeasonOpen(item.season, now)
  );
}

export interface MysteryRollResult {
  /** The unlocked item id, or null when nothing is left to win (the box is then free) */
  itemId: string | null;
}

export function rollMysteryBox(
  ownedIds: readonly string[],
  tier: MysteryBoxTier,
  now: Date,
  rng: () => number
): MysteryRollResult {
  const pool = getMysteryPool(ownedIds, now);
  const byRarity = RARITY_ORDER.map((rarity) => ({
    rarity,
    items: pool.filter((item) => getRewardRarity(item) === rarity),
    weight: MYSTERY_WEIGHTS[tier][rarity] ?? 0,
  })).filter((entry) => entry.items.length > 0 && entry.weight > 0);

  // This box's rarities are all owned: give anything left rather than a dead purchase
  const candidates = byRarity.length > 0 ? byRarity : groupLeftovers(pool);
  if (candidates.length === 0) return { itemId: null };

  const totalWeight = candidates.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = rng() * totalWeight;
  const picked = candidates.find((entry) => (roll -= entry.weight) < 0) ?? candidates[candidates.length - 1];
  const index = Math.min(picked.items.length - 1, Math.floor(rng() * picked.items.length));
  return { itemId: picked.items[index].id };
}

function groupLeftovers(pool: RewardShopItem[]) {
  return pool.length === 0 ? [] : [{ rarity: 'common' as RewardRarity, items: pool, weight: 1 }];
}
