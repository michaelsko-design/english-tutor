import { DressUpDay, LearnerProfile } from '../types/learner';
import { seededShuffle } from '../utils/shuffle';
import { toLocalDateStr } from './examPrep';
import { grantDailyActivityReward } from './roomActivities';
import { NameableItem, applyItemNamedReward, getRoom } from './room';

/**
 * Feature 12, phase 2 — the Wardrobe Dress-Up Studio: clothes and accessories the avatar wears.
 * An item goes on only after the learner says, spells or (Explorer) picks its English name.
 */

export type WardrobeLayer = 'head' | 'face' | 'neck' | 'torso' | 'legs' | 'feet';

/** Drawing order, top to bottom. */
export const WARDROBE_LAYERS: WardrobeLayer[] = ['head', 'face', 'neck', 'torso', 'legs', 'feet'];

export interface WardrobeItem extends NameableItem {
  layer: WardrobeLayer;
  /** Clothes need a body, so only the person avatars wear them; accessories fit every avatar */
  isHumanOnly: boolean;
}

export type NamingMethod = 'say' | 'spell' | 'choose';

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // Starter set
  { id: 'wear-cap', emoji: '🧢', nameEn: 'cap', nameHe: 'כובע מצחייה', layer: 'head', isHumanOnly: false },
  { id: 'wear-glasses', emoji: '👓', nameEn: 'glasses', nameHe: 'משקפיים', layer: 'face', isHumanOnly: false },
  { id: 'wear-scarf', emoji: '🧣', nameEn: 'scarf', nameHe: 'צעיף', layer: 'neck', isHumanOnly: false },
  { id: 'wear-shirt', emoji: '👕', nameEn: 'shirt', nameHe: 'חולצה', layer: 'torso', isHumanOnly: true },
  { id: 'wear-jeans', emoji: '👖', nameEn: 'jeans', nameHe: 'ג׳ינס', layer: 'legs', isHumanOnly: true },
  // Earned from 3-star missions
  { id: 'wear-shoes', emoji: '👟', nameEn: 'shoes', nameHe: 'נעליים', layer: 'feet', isHumanOnly: true },
  { id: 'wear-bow', emoji: '🎀', nameEn: 'bow', nameHe: 'סרט לשיער', layer: 'head', isHumanOnly: false },
  { id: 'wear-dress', emoji: '👗', nameEn: 'dress', nameHe: 'שמלה', layer: 'torso', isHumanOnly: true },
  { id: 'wear-hat', emoji: '🎩', nameEn: 'hat', nameHe: 'כובע', layer: 'head', isHumanOnly: false },
  { id: 'wear-shorts', emoji: '🩳', nameEn: 'shorts', nameHe: 'מכנסיים קצרים', layer: 'legs', isHumanOnly: true },
  { id: 'wear-necklace', emoji: '📿', nameEn: 'necklace', nameHe: 'שרשרת', layer: 'neck', isHumanOnly: false },
  { id: 'wear-coat', emoji: '🧥', nameEn: 'coat', nameHe: 'מעיל', layer: 'torso', isHumanOnly: true },
  { id: 'wear-boots', emoji: '👢', nameEn: 'boots', nameHe: 'מגפיים', layer: 'feet', isHumanOnly: true },
  { id: 'wear-socks', emoji: '🧦', nameEn: 'socks', nameHe: 'גרביים', layer: 'feet', isHumanOnly: true },
  // Sold in the Reward Shop (category 'accessory', same ids)
  { id: 'wear-sunglasses', emoji: '🕶️', nameEn: 'sunglasses', nameHe: 'משקפי שמש', layer: 'face', isHumanOnly: false },
  { id: 'wear-crown', emoji: '👑', nameEn: 'crown', nameHe: 'כתר', layer: 'head', isHumanOnly: false },
  { id: 'wear-graduation-cap', emoji: '🎓', nameEn: 'graduation cap', nameHe: 'כובע סיום', layer: 'head', isHumanOnly: false },
];

export const WARDROBE_STARTER_IDS = ['wear-cap', 'wear-glasses', 'wear-scarf', 'wear-shirt', 'wear-jeans'];
export const SHOP_WARDROBE_IDS = ['wear-sunglasses', 'wear-crown', 'wear-graduation-cap'];

/** Wardrobe items awarded by first-time 3-star missions, in order. */
export const WARDROBE_REWARD_ORDER: string[] = WARDROBE_ITEMS.map((item) => item.id).filter(
  (id) => !WARDROBE_STARTER_IDS.includes(id) && !SHOP_WARDROBE_IDS.includes(id)
);

/** The avatars with a body: they can wear clothes as well as accessories. */
export const HUMAN_AVATAR_EMOJIS = ['👧', '👦'];

export const DRESS_UP_DAILY_GOAL = 3;
export const DRESS_UP_REWARD_XP = 10;
export const DRESS_UP_REWARD_DIAMONDS = 2;

export function isHumanAvatar(avatarEmoji: string): boolean {
  return HUMAN_AVATAR_EMOJIS.includes(avatarEmoji);
}

export function getWardrobeItem(itemId: string): WardrobeItem | undefined {
  return WARDROBE_ITEMS.find((item) => item.id === itemId);
}

export function canWear(item: WardrobeItem, avatarEmoji: string): boolean {
  return !item.isHumanOnly || isHumanAvatar(avatarEmoji);
}

/** Starter items plus earned and bought ones. */
export function getOwnedWardrobeItems(profile: LearnerProfile): WardrobeItem[] {
  const owned = new Set([...WARDROBE_STARTER_IDS, ...(profile.unlockedRewardIds || [])]);
  return WARDROBE_ITEMS.filter((item) => owned.has(item.id));
}

/** What the avatar shows, top to bottom; clothes are hidden on avatars that can't wear them. */
export function getWornItems(profile: LearnerProfile, avatarEmoji: string): WardrobeItem[] {
  const outfit = getRoom(profile).outfit || {};
  return WARDROBE_LAYERS.map((layer) => getWardrobeItem(outfit[layer]))
    .filter((item): item is WardrobeItem => Boolean(item))
    .filter((item) => canWear(item, avatarEmoji));
}

/** Two other wardrobe names for the Explorer "pick the name" choice. */
export function getWardrobeDistractors(item: WardrobeItem, seed: string | number): string[] {
  const others = WARDROBE_ITEMS.filter((other) => other.id !== item.id).map((other) => other.nameEn);
  return seededShuffle(others, seed).slice(0, 2);
}

/** Today's dress-up progress (an older day counts as nothing yet). */
export function getDressUpDay(profile: LearnerProfile, now: Date): DressUpDay {
  const todayStr = toLocalDateStr(now);
  const day = getRoom(profile).dressUpDay;
  return day?.dateStr === todayStr
    ? day
    : { dateStr: todayStr, namedCount: 0, voiceCount: 0, isRewarded: false, wornItemIds: [] };
}

/**
 * Today's progress after putting an item on: only an item not worn yet today counts, so taking
 * the same item off and on again doesn't reach the daily goal. A day saved before wornItemIds
 * existed keeps its count until the distinct items catch up.
 */
function addWornItem(day: DressUpDay, itemId: string, method: NamingMethod): DressUpDay {
  const previousIds = day.wornItemIds || [];
  if (previousIds.includes(itemId)) return day;
  const wornItemIds = [...previousIds, itemId];
  const legacyCount = day.wornItemIds ? 0 : day.namedCount;
  return {
    ...day,
    wornItemIds,
    namedCount: Math.max(legacyCount, wornItemIds.length),
    voiceCount: day.voiceCount + (method === 'say' ? 1 : 0),
  };
}

export interface PutOnResult {
  profile: LearnerProfile;
  /** First-time naming XP plus the daily reward XP */
  xpEarned: number;
  diamondsEarned: number;
  isDailyRewardEarned: boolean;
}

/**
 * Puts an owned, wearable item on the avatar after the learner named it. It replaces whatever was
 * on the same layer. Invalid requests (not owned, can't wear, already worn) change nothing.
 */
export function putOnWardrobeItem(
  profile: LearnerProfile,
  itemId: string,
  avatarEmoji: string,
  method: NamingMethod,
  now: Date
): PutOnResult {
  const unchanged = { profile, xpEarned: 0, diamondsEarned: 0, isDailyRewardEarned: false };
  const item = getWardrobeItem(itemId);
  const room = getRoom(profile);
  const outfit = room.outfit || {};
  const isOwned = getOwnedWardrobeItems(profile).some((owned) => owned.id === itemId);
  if (!item || !isOwned || !canWear(item, avatarEmoji) || outfit[item.layer] === itemId) return unchanged;

  const day = addWornItem(getDressUpDay(profile, now), itemId, method);
  const isDailyRewardEarned = !day.isRewarded && day.namedCount >= DRESS_UP_DAILY_GOAL;

  const dressed: LearnerProfile = {
    ...profile,
    room: {
      ...room,
      outfit: { ...outfit, [item.layer]: itemId },
      dressUpDay: { ...day, isRewarded: day.isRewarded || isDailyRewardEarned },
      updatedAt: now.toISOString(),
    },
  };
  const named = applyItemNamedReward(dressed, itemId);
  const finalProfile = isDailyRewardEarned
    ? grantDailyActivityReward(
        named.profile,
        { xp: DRESS_UP_REWARD_XP, diamonds: DRESS_UP_REWARD_DIAMONDS, voiceWords: day.voiceCount },
        now
      )
    : named.profile;

  return {
    profile: finalProfile,
    xpEarned: named.xpEarned + (isDailyRewardEarned ? DRESS_UP_REWARD_XP : 0),
    diamondsEarned: isDailyRewardEarned ? DRESS_UP_REWARD_DIAMONDS : 0,
    isDailyRewardEarned,
  };
}

/** Takes the item off a layer; no naming needed. */
export function takeOffWardrobeLayer(profile: LearnerProfile, layer: WardrobeLayer, now: Date): LearnerProfile {
  const room = getRoom(profile);
  const outfit = room.outfit || {};
  if (!(layer in outfit)) return profile;
  const remaining = Object.fromEntries(Object.entries(outfit).filter(([key]) => key !== layer));
  return { ...profile, room: { ...room, outfit: remaining, updatedAt: now.toISOString() } };
}
