import { LearnerProfile, LearnerRoom } from '../types/learner';
import { levelForXp } from './progressRewards';

/**
 * Feature 12 — My English Room: the room item catalog, fixed slots, 3-star rewards and the
 * "name it to place it" rule. Everything here is pure; the UI lives in components/room/.
 */

export type RoomSlotKind = 'wall' | 'board' | 'shelf' | 'desk' | 'floor';

export interface RoomItem {
  id: string;
  emoji: string;
  /** The English name the learner says or spells to place the item (1–2 simple words) */
  nameEn: string;
  nameHe: string;
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

/** The order in which first-time 3-star missions award room items. */
export const ROOM_REWARD_ORDER: string[] = ROOM_ITEMS.map((item) => item.id).filter(
  (id) => !ROOM_STARTER_ITEM_IDS.includes(id)
);

/** XP for naming an item for the first time; naming it again gives nothing. */
export const ROOM_NAMING_XP = 5;

const ALL_ROOM_ITEMS = [...ROOM_ITEMS, ...SHOP_ROOM_ITEMS];

export function getRoomItem(itemId: string): RoomItem | undefined {
  return ALL_ROOM_ITEMS.find((item) => item.id === itemId);
}

export function getRoomSlot(slotId: string): RoomSlot | undefined {
  return ROOM_SLOTS.find((slot) => slot.id === slotId);
}

export function getRoom(profile: LearnerProfile): LearnerRoom {
  return profile.room || { placements: {}, namedItemIds: [], updatedAt: '' };
}

/** Room items the learner owns: starter items, earned room items and shop decor/stickers. */
export function getOwnedRoomItems(profile: LearnerProfile): RoomItem[] {
  const owned = new Set([...ROOM_STARTER_ITEM_IDS, ...(profile.unlockedRewardIds || [])]);
  return ALL_ROOM_ITEMS.filter((item) => owned.has(item.id));
}

/** Owned items that are not placed anywhere in the room yet. */
export function getUnplacedRoomItems(profile: LearnerProfile): RoomItem[] {
  const placed = new Set(Object.values(getRoom(profile).placements));
  return getOwnedRoomItems(profile).filter((item) => !placed.has(item.id));
}

export function getPlaceableSlots(itemId: string): RoomSlot[] {
  const item = getRoomItem(itemId);
  return item ? ROOM_SLOTS.filter((slot) => slot.kind === item.slotKind) : [];
}

/** The item a first 3-star result would award now, or null when every item is owned. */
export function getNextRoomReward(profile: LearnerProfile): RoomItem | null {
  const owned = new Set(profile.unlockedRewardIds || []);
  const nextId = ROOM_REWARD_ORDER.find((id) => !owned.has(id));
  return nextId ? getRoomItem(nextId) || null : null;
}

/**
 * The room item a mission result earns: only a mission's first 3-star result awards one,
 * so replaying a mastered mission can't farm items.
 */
export function getRoomRewardForMission(
  profile: LearnerProfile,
  missionId: string,
  starsEarned: number
): RoomItem | null {
  const previousStars = profile.missionProgress?.[missionId] || 0;
  if (starsEarned < 3 || previousStars >= 3) return null;
  return getNextRoomReward(profile);
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
  const item = getRoomItem(itemId);
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

/** Takes the item out of a slot and back to the inventory. */
export function removeRoomItem(profile: LearnerProfile, slotId: string, now: Date): LearnerProfile {
  const room = getRoom(profile);
  if (!(slotId in room.placements)) return profile;
  const placements = Object.fromEntries(Object.entries(room.placements).filter(([id]) => id !== slotId));
  return { ...profile, room: { ...room, placements, updatedAt: now.toISOString() } };
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
