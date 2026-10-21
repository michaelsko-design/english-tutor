import { LearnerProfile, LearnerRoom } from '../types/learner';
import { levelForXp } from './progressRewards';

/**
 * Feature 12 — My English Room: the room item catalog, fixed slots, 3-star rewards and the
 * "name it to place it" rule. Everything here is pure; the UI lives in components/room/.
 */

export type RoomSlotKind = 'wall' | 'board' | 'shelf' | 'desk' | 'floor';

/** Anything the learner names in English to use it: room items and wardrobe items. */
export interface NameableItem {
  id: string;
  emoji: string;
  /** The English name the learner says or spells (1–2 simple words) */
  nameEn: string;
  nameHe: string;
  /** A drawn sticker's picture, shown instead of the emoji */
  imageUrl?: string;
}

export interface RoomItem extends NameableItem {
  slotKind: RoomSlotKind;
}

export interface RoomSlot {
  id: string;
  kind: RoomSlotKind;
}

/** Fixed spots in the room; their positions on screen are in components/room/roomLayout.ts. */
export const ROOM_SLOTS: RoomSlot[] = [
  { id: 'wall-left', kind: 'wall' },
  { id: 'wall-right', kind: 'wall' },
  { id: 'board-1', kind: 'board' },
  { id: 'board-2', kind: 'board' },
  { id: 'board-3', kind: 'board' },
  { id: 'shelf', kind: 'shelf' },
  { id: 'window-sill', kind: 'shelf' },
  { id: 'desk-top', kind: 'desk' },
  { id: 'floor-left', kind: 'floor' },
  { id: 'floor-center', kind: 'floor' },
  { id: 'floor-right', kind: 'floor' },
];

export type RoomObjectId = 'bed' | 'phone' | 'wardrobe' | 'games-book';

/** Mission objects are always in the room; each one will open its own English activity. */
export interface RoomObject {
  id: RoomObjectId;
  emoji: string;
  nameEn: string;
  nameHe: string;
  activityHe: string;
}

export const ROOM_OBJECTS: RoomObject[] = [
  { id: 'bed', emoji: '🛏️', nameEn: 'bed', nameHe: 'מיטה', activityHe: 'יומן חלומות — כתיבה ותרגום' },
  { id: 'phone', emoji: '📱', nameEn: 'phone', nameHe: 'טלפון', activityHe: 'הודעות קוליות — דיבור' },
  { id: 'wardrobe', emoji: '🚪', nameEn: 'wardrobe', nameHe: 'ארון', activityHe: 'סטודיו הלבשה — אוצר מילים' },
  { id: 'games-book', emoji: '📖', nameEn: 'games book', nameHe: 'ספר משחקים', activityHe: 'משחקי מילים' },
];

/** Items earned in the room (3-star missions). */
export const ROOM_ITEMS: RoomItem[] = [
  { id: 'room-plant', emoji: '🪴', nameEn: 'plant', nameHe: 'עציץ', slotKind: 'floor' },
  { id: 'room-sofa', emoji: '🛋️', nameEn: 'sofa', nameHe: 'ספה', slotKind: 'floor' },
  { id: 'room-lamp', emoji: '💡', nameEn: 'lamp', nameHe: 'מנורה', slotKind: 'desk' },
  { id: 'room-clock', emoji: '🕰️', nameEn: 'clock', nameHe: 'שעון', slotKind: 'wall' },
  { id: 'room-books', emoji: '📚', nameEn: 'books', nameHe: 'ספרים', slotKind: 'shelf' },
  { id: 'room-star', emoji: '⭐', nameEn: 'star', nameHe: 'כוכב', slotKind: 'board' },
  { id: 'room-teddy', emoji: '🧸', nameEn: 'teddy bear', nameHe: 'דובי', slotKind: 'shelf' },
  { id: 'room-globe', emoji: '🌍', nameEn: 'globe', nameHe: 'גלובוס', slotKind: 'desk' },
  { id: 'room-picture', emoji: '🖼️', nameEn: 'picture', nameHe: 'תמונה', slotKind: 'wall' },
  { id: 'room-chair', emoji: '🪑', nameEn: 'chair', nameHe: 'כיסא', slotKind: 'floor' },
  { id: 'room-rainbow', emoji: '🌈', nameEn: 'rainbow', nameHe: 'קשת בענן', slotKind: 'board' },
  { id: 'room-robot', emoji: '🤖', nameEn: 'robot', nameHe: 'רובוט', slotKind: 'shelf' },
  { id: 'room-kite', emoji: '🪁', nameEn: 'kite', nameHe: 'עפיפון', slotKind: 'wall' },
  { id: 'room-computer', emoji: '💻', nameEn: 'computer', nameHe: 'מחשב', slotKind: 'desk' },
  { id: 'room-ball', emoji: '⚽', nameEn: 'ball', nameHe: 'כדור', slotKind: 'floor' },
  { id: 'room-heart', emoji: '❤️', nameEn: 'heart', nameHe: 'לב', slotKind: 'board' },
  { id: 'room-cactus', emoji: '🌵', nameEn: 'cactus', nameHe: 'קקטוס', slotKind: 'shelf' },
  { id: 'room-mirror', emoji: '🪞', nameEn: 'mirror', nameHe: 'מראה', slotKind: 'wall' },
  { id: 'room-drum', emoji: '🥁', nameEn: 'drum', nameHe: 'תוף', slotKind: 'floor' },
  { id: 'room-trophy', emoji: '🏆', nameEn: 'trophy', nameHe: 'גביע', slotKind: 'shelf' },
];

/** Reward Shop decor and stickers (Feature 5) also live in the room. Ids match the shop items. */
export const SHOP_ROOM_ITEMS: RoomItem[] = [
  { id: 'decor-neon-lamp', emoji: '🌸', nameEn: 'flower lamp', nameHe: 'מנורת פרחים', slotKind: 'desk' },
  { id: 'sticker-strawberry-croissant', emoji: '🥐', nameEn: 'croissant', nameHe: 'קרואסון', slotKind: 'board' },
  { id: 'sticker-backstage-pass', emoji: '🎸', nameEn: 'guitar', nameHe: 'גיטרה', slotKind: 'board' },
  { id: 'sticker-london-compass', emoji: '🧭', nameEn: 'compass', nameHe: 'מצפן', slotKind: 'board' },
];

/** Every learner starts with these, so the room has something to place from day one. */
export const ROOM_STARTER_ITEM_IDS = ['room-plant'];

/** XP for naming an item for the first time; naming it again gives nothing. */
export const ROOM_NAMING_XP = 5;

const ALL_ROOM_ITEMS = [...ROOM_ITEMS, ...SHOP_ROOM_ITEMS];

/** A catalog item (room items, shop decor and stickers); drawn stickers need getRoomItemFor. */
export function getRoomItem(itemId: string): RoomItem | undefined {
  return ALL_ROOM_ITEMS.find((item) => item.id === itemId);
}

/** The learner's own drawn stickers (not deleted), as board items. */
export function getDrawnStickerItems(profile: LearnerProfile): RoomItem[] {
  return (getRoom(profile).drawnStickers || [])
    .filter((sticker) => !sticker.archivedAt)
    .map((sticker) => ({
      id: sticker.id,
      emoji: '🎨',
      nameEn: sticker.nameEn,
      nameHe: 'המדבקה שלי',
      slotKind: 'board' as const,
      imageUrl: sticker.imageDataUrl,
    }));
}

/** Any item the learner can have in the room, including their drawn stickers. */
export function getRoomItemFor(profile: LearnerProfile, itemId: string | undefined): RoomItem | undefined {
  if (!itemId) return undefined;
  return getRoomItem(itemId) ?? getDrawnStickerItems(profile).find((item) => item.id === itemId);
}

export function getRoomSlot(slotId: string): RoomSlot | undefined {
  return ROOM_SLOTS.find((slot) => slot.id === slotId);
}

export function getRoom(profile: LearnerProfile): LearnerRoom {
  return profile.room || { placements: {}, namedItemIds: [], updatedAt: '' };
}

/** Room items the learner owns: starter items, earned room items, shop decor/stickers and drawn stickers. */
export function getOwnedRoomItems(profile: LearnerProfile): RoomItem[] {
  const owned = new Set([...ROOM_STARTER_ITEM_IDS, ...(profile.unlockedRewardIds || [])]);
  return [...ALL_ROOM_ITEMS.filter((item) => owned.has(item.id)), ...getDrawnStickerItems(profile)];
}

/** Slot id -> the item placed there (skipping items that no longer exist, e.g. a deleted sticker). */
export function getPlacedRoomItems(profile: LearnerProfile): Record<string, RoomItem> {
  return Object.fromEntries(
    Object.entries(getRoom(profile).placements)
      .map(([slotId, itemId]) => [slotId, getRoomItemFor(profile, itemId)] as const)
      .filter((entry): entry is readonly [string, RoomItem] => Boolean(entry[1]))
  );
}

/** Owned items that are not placed anywhere in the room yet. */
export function getUnplacedRoomItems(profile: LearnerProfile): RoomItem[] {
  const placed = new Set(Object.values(getRoom(profile).placements));
  return getOwnedRoomItems(profile).filter((item) => !placed.has(item.id));
}

function isOwned(profile: LearnerProfile, itemId: string): boolean {
  return getOwnedRoomItems(profile).some((item) => item.id === itemId);
}

/**
 * Puts an owned item in a slot of its kind. An item already placed elsewhere moves, and an item
 * already in the slot goes back to the inventory. Invalid moves return the profile unchanged.
 */
export function placeRoomItem(
  profile: LearnerProfile,
  slotId: string,
  itemId: string,
  now: Date
): LearnerProfile {
  const slot = getRoomSlot(slotId);
  const item = getRoomItemFor(profile, itemId);
  if (!slot || !item || slot.kind !== item.slotKind || !isOwned(profile, itemId)) return profile;

  const room = getRoom(profile);
  const otherPlacements = Object.fromEntries(
    Object.entries(room.placements).filter(([, placedId]) => placedId !== itemId)
  );
  return {
    ...profile,
    room: {
      ...room,
      placements: { ...otherPlacements, [slotId]: itemId },
      updatedAt: now.toISOString(),
    },
  };
}

/** Takes the item out of its slot or position (the placement key) and back to the inventory. */
export function removeRoomItem(profile: LearnerProfile, placementKey: string, now: Date): LearnerProfile {
  const room = getRoom(profile);
  if (!(placementKey in room.placements)) return profile;
  const placements = Object.fromEntries(Object.entries(room.placements).filter(([id]) => id !== placementKey));
  const positions = Object.fromEntries(Object.entries(room.positions ?? {}).filter(([id]) => id !== placementKey));
  return { ...profile, room: { ...room, placements, positions, updatedAt: now.toISOString() } };
}

/** Records that the learner said or spelled the item's name; the first time earns XP. */
export function applyItemNamedReward(
  profile: LearnerProfile,
  itemId: string
): { profile: LearnerProfile; xpEarned: number } {
  const room = getRoom(profile);
  if (room.namedItemIds.includes(itemId)) return { profile, xpEarned: 0 };

  const xp = profile.stats.xp + ROOM_NAMING_XP;
  return {
    profile: {
      ...profile,
      room: { ...room, namedItemIds: [...room.namedItemIds, itemId] },
      stats: { ...profile.stats, xp, level: levelForXp(xp, profile.stats.level) },
    },
    xpEarned: ROOM_NAMING_XP,
  };
}

/** The "name it to place it" result: naming reward plus the placement, as one update. */
export function placeNamedRoomItem(
  profile: LearnerProfile,
  slotId: string,
  itemId: string,
  now: Date
): { profile: LearnerProfile; xpEarned: number } {
  const placed = placeRoomItem(profile, slotId, itemId, now);
  if (placed === profile) return { profile, xpEarned: 0 };
  return applyItemNamedReward(placed, itemId);
}
