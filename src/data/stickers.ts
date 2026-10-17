import { DrawnSticker, LearnerProfile } from '../types/learner';
import { RoomItem, applyItemNamedReward, getOwnedRoomItems, getRoom, getRoomItemFor } from './room';

/**
 * Feature 12, phase 6 — Sticker Studio: the album of every sticker the learner has, used on the
 * room's sticker board or as the app background. With the Sticker Studio Pass (a shop item) the
 * learner can draw stickers; a drawing is saved once it has an English name.
 */

export const STICKER_PASS_ID = 'pass-sticker-studio';
export const MAX_DRAWN_STICKERS = 12;
/** Drawings are saved as small square PNGs, so the synced profile stays small. */
export const DRAWN_STICKER_SIZE = 96;
/** A real 96px drawing is about 4–15 KB; 12 at the cap stay far below Firestore's 1 MiB per doc. */
export const MAX_STICKER_DATA_URL_LENGTH = 30_000;
const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export type AddStickerError = 'no-pass' | 'full' | 'bad-name' | 'bad-image';

export function hasStickerPass(profile: LearnerProfile): boolean {
  return (profile.unlockedRewardIds || []).includes(STICKER_PASS_ID);
}

/** Every sticker the learner owns: shop stickers, earned board stickers and drawings. */
export function getAlbumStickers(profile: LearnerProfile): RoomItem[] {
  return getOwnedRoomItems(profile).filter((item) => item.slotKind === 'board');
}

export function getActiveDrawnStickers(profile: LearnerProfile): DrawnSticker[] {
  return (getRoom(profile).drawnStickers || []).filter((sticker) => !sticker.archivedAt);
}

/** Lower case, single spaces. */
export function normalizeStickerName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** One to three English words, 2–20 letters in all. */
export function isValidStickerName(name: string): boolean {
  const clean = normalizeStickerName(name);
  return clean.length >= 2 && clean.length <= 20 && /^[a-z]+( [a-z]+){0,2}$/.test(clean);
}

export function isValidStickerImage(dataUrl: string): boolean {
  return dataUrl.startsWith(PNG_DATA_URL_PREFIX) && dataUrl.length <= MAX_STICKER_DATA_URL_LENGTH;
}

/**
 * Saves a drawing with its English name. Naming it counts as naming a new item (first-time XP),
 * so placing it later needs the name again but gives no extra XP.
 */
export function addDrawnSticker(
  profile: LearnerProfile,
  nameEn: string,
  imageDataUrl: string,
  now: Date
): { profile: LearnerProfile; error?: AddStickerError; xpEarned: number } {
  const fail = (error: AddStickerError) => ({ profile, error, xpEarned: 0 });
  if (!hasStickerPass(profile)) return fail('no-pass');
  if (getActiveDrawnStickers(profile).length >= MAX_DRAWN_STICKERS) return fail('full');
  if (!isValidStickerName(nameEn)) return fail('bad-name');
  if (!isValidStickerImage(imageDataUrl)) return fail('bad-image');

  const room = getRoom(profile);
  const sticker: DrawnSticker = {
    id: `drawn-${now.getTime()}`,
    nameEn: normalizeStickerName(nameEn),
    imageDataUrl,
    createdAt: now.toISOString(),
  };
  const withSticker: LearnerProfile = {
    ...profile,
    room: { ...room, drawnStickers: [...(room.drawnStickers || []), sticker] },
  };
  return applyItemNamedReward(withSticker, sticker.id);
}

/**
 * Deletes a drawing: it is archived with its picture emptied, and taken off the board and the
 * background if it was there.
 */
export function deleteDrawnSticker(profile: LearnerProfile, stickerId: string, now: Date): LearnerProfile {
  const room = getRoom(profile);
  const stickers = room.drawnStickers || [];
  if (!stickers.some((s) => s.id === stickerId && !s.archivedAt)) return profile;
  return {
    ...profile,
    room: {
      ...room,
      drawnStickers: stickers.map((s) => (s.id === stickerId ? { ...s, imageDataUrl: '', archivedAt: now.toISOString() } : s)),
      placements: Object.fromEntries(Object.entries(room.placements).filter(([, itemId]) => itemId !== stickerId)),
      backgroundStickerId: room.backgroundStickerId === stickerId ? undefined : room.backgroundStickerId,
      updatedAt: now.toISOString(),
    },
  };
}

/** Sets (or clears, with null) the sticker shown as the app background. */
export function setBackgroundSticker(profile: LearnerProfile, itemId: string | null, now: Date): LearnerProfile {
  const room = getRoom(profile);
  if (itemId && !getAlbumStickers(profile).some((item) => item.id === itemId)) return profile;
  const rest = Object.fromEntries(Object.entries(room).filter(([key]) => key !== 'backgroundStickerId')) as typeof room;
  return {
    ...profile,
    room: { ...rest, ...(itemId ? { backgroundStickerId: itemId } : {}), updatedAt: now.toISOString() },
  };
}

/** The background sticker, if it still exists in the album. */
export function getBackgroundSticker(profile: LearnerProfile): RoomItem | undefined {
  const id = getRoom(profile).backgroundStickerId;
  const item = getRoomItemFor(profile, id);
  return item && item.slotKind === 'board' ? item : undefined;
}
