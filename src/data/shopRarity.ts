/** Rarity tiers and seasonal windows for Reward Shop items. Pure data and helpers, no imports. */

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export const RARITY_ORDER: RewardRarity[] = ['common', 'rare', 'epic', 'legendary'];

export const RARITY_LABEL_HE: Record<RewardRarity, string> = {
  common: 'רגיל',
  rare: 'נדיר',
  epic: 'אפי',
  legendary: 'אגדי',
};

/** Price bands per rarity: [min, max] diamonds. */
export const RARITY_PRICE_BANDS: Record<RewardRarity, readonly [number, number]> = {
  common: [30, 99],
  rare: [100, 199],
  epic: [200, 399],
  legendary: [400, 800],
};

export type SeasonId = 'hanukkah' | 'winter' | 'tishrei' | 'pesach' | 'independence' | 'summer';

/** Inclusive month-day windows, repeating every year. A window may wrap past new year. */
export const SEASON_WINDOWS: Record<SeasonId, { from: string; to: string; labelHe: string }> = {
  hanukkah: { from: '12-01', to: '01-10', labelHe: 'חנוכה' },
  winter: { from: '12-01', to: '02-28', labelHe: 'חורף' },
  tishrei: { from: '08-25', to: '10-20', labelHe: 'חגי תשרי' },
  pesach: { from: '03-15', to: '04-25', labelHe: 'פסח' },
  independence: { from: '04-10', to: '05-20', labelHe: 'יום העצמאות' },
  summer: { from: '06-15', to: '08-31', labelHe: 'קיץ' },
};

/** Fallback when an item has no explicit rarity: derived from its price. */
export function rarityFromCost(costDiamonds: number): RewardRarity {
  if (costDiamonds >= RARITY_PRICE_BANDS.legendary[0]) return 'legendary';
  if (costDiamonds >= RARITY_PRICE_BANDS.epic[0]) return 'epic';
  if (costDiamonds >= RARITY_PRICE_BANDS.rare[0]) return 'rare';
  return 'common';
}

/** True when the local calendar day of `now` is inside the season (no season = always open). */
export function isSeasonOpen(season: SeasonId | undefined, now: Date): boolean {
  if (!season) return true;
  const { from, to } = SEASON_WINDOWS[season];
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const monthDay = `${month}-${day}`;
  return from <= to ? monthDay >= from && monthDay <= to : monthDay >= from || monthDay <= to;
}
