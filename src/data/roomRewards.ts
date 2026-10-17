import { LearnerProfile } from '../types/learner';
import { NameableItem, ROOM_ITEMS, ROOM_STARTER_ITEM_IDS, getRoomItem } from './room';
import { WARDROBE_REWARD_ORDER, getWardrobeItem } from './wardrobe';

/** Feature 12: what a mission's first 3-star result earns — room decor and wardrobe items, alternating. */

export type RoomRewardKind = 'decor' | 'wear';

export interface RoomRewardItem extends NameableItem {
  kind: RoomRewardKind;
}

const DECOR_REWARD_ORDER = ROOM_ITEMS.map((item) => item.id).filter((id) => !ROOM_STARTER_ITEM_IDS.includes(id));

function interleave(a: string[], b: string[]): string[] {
  const length = Math.max(a.length, b.length);
  return Array.from({ length }, (_, i) => [a[i], b[i]]).flat().filter((id): id is string => Boolean(id));
}

/** Decor and wardrobe items take turns, so both the room and the wardrobe keep growing. */
export const ROOM_REWARD_ORDER: string[] = interleave(DECOR_REWARD_ORDER, WARDROBE_REWARD_ORDER);

export function getRewardItem(itemId: string): RoomRewardItem | null {
  const decor = getRoomItem(itemId);
  if (decor) return { id: decor.id, emoji: decor.emoji, nameEn: decor.nameEn, nameHe: decor.nameHe, kind: 'decor' };
  const wear = getWardrobeItem(itemId);
  if (wear) return { id: wear.id, emoji: wear.emoji, nameEn: wear.nameEn, nameHe: wear.nameHe, kind: 'wear' };
  return null;
}

/** The item a first 3-star result would award now, or null when every item is owned. */
export function getNextRoomReward(profile: LearnerProfile): RoomRewardItem | null {
  const owned = new Set(profile.unlockedRewardIds || []);
  const nextId = ROOM_REWARD_ORDER.find((id) => !owned.has(id));
  return nextId ? getRewardItem(nextId) : null;
}

/**
 * The item a mission result earns: only a mission's first 3-star result awards one,
 * so replaying a mastered mission can't farm items.
 */
export function getRoomRewardForMission(
  profile: LearnerProfile,
  missionId: string,
  starsEarned: number
): RoomRewardItem | null {
  const previousStars = profile.missionProgress?.[missionId] || 0;
  if (starsEarned < 3 || previousStars >= 3) return null;
  return getNextRoomReward(profile);
}
