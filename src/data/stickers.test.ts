import { describe, expect, it } from 'vitest';
import {
  MAX_DRAWN_STICKERS,
  MAX_STICKER_DATA_URL_LENGTH,
  STICKER_PASS_ID,
  addDrawnSticker,
  deleteDrawnSticker,
  getActiveDrawnStickers,
  getAlbumStickers,
  getBackgroundSticker,
  isValidStickerName,
  setBackgroundSticker,
} from './stickers';
import { ROOM_NAMING_XP, getOwnedRoomItems, getPlacedRoomItems, getRoom, placeRoomItem } from './room';
import { LearnerProfile } from '../types/learner';

const NOW = new Date('2026-10-17T10:00:00.000Z');
const LATER = new Date('2026-10-17T11:00:00.000Z');
const PNG = 'data:image/png;base64,iVBORw0KGgo=';

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 11,
  gender: 'girl',
  gradeId: 'grade-6',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 0,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [STICKER_PASS_ID, 'sticker-london-compass'],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('isValidStickerName', () => {
  it('accepts one to three English words', () => {
    ['cat', 'Happy Sun', '  my  red car '].forEach((name) => expect(isValidStickerName(name)).toBe(true));
  });

  it('rejects Hebrew, digits, too short and too many words', () => {
    ['חתול', 'cat2', 'a', 'one two three four', 'x'.repeat(21)].forEach((name) =>
      expect(isValidStickerName(name)).toBe(false)
    );
  });
});

describe('addDrawnSticker', () => {
  it('saves a named drawing as a board sticker and gives naming XP', () => {
    const result = addDrawnSticker(baseProfile, '  Happy  SUN ', PNG, NOW);
    expect(result.error).toBeUndefined();
    expect(result.xpEarned).toBe(ROOM_NAMING_XP);
    const [sticker] = getActiveDrawnStickers(result.profile);
    expect(sticker).toMatchObject({ nameEn: 'happy sun', imageDataUrl: PNG, createdAt: NOW.toISOString() });
    const owned = getOwnedRoomItems(result.profile).find((item) => item.id === sticker.id);
    expect(owned).toMatchObject({ slotKind: 'board', imageUrl: PNG, nameEn: 'happy sun' });
    expect(getAlbumStickers(result.profile).map((i) => i.id)).toEqual(['sticker-london-compass', sticker.id]);
  });

  it('needs the pass, a valid name, a small PNG and a free spot', () => {
    expect(addDrawnSticker({ ...baseProfile, unlockedRewardIds: [] }, 'sun', PNG, NOW).error).toBe('no-pass');
    expect(addDrawnSticker(baseProfile, 'שמש', PNG, NOW).error).toBe('bad-name');
    expect(addDrawnSticker(baseProfile, 'sun', 'data:image/jpeg;base64,AA', NOW).error).toBe('bad-image');
    const tooBig = PNG.padEnd(MAX_STICKER_DATA_URL_LENGTH + 1, 'A');
    expect(addDrawnSticker(baseProfile, 'sun', tooBig, NOW).error).toBe('bad-image');
    expect(addDrawnSticker(baseProfile, 'sun', tooBig.slice(0, -1), NOW).error).toBeUndefined();

    let full = baseProfile;
    for (let i = 0; i < MAX_DRAWN_STICKERS; i++) {
      full = addDrawnSticker(full, 'sun', PNG, new Date(NOW.getTime() + i)).profile;
    }
    expect(addDrawnSticker(full, 'moon', PNG, LATER).error).toBe('full');
  });
});

describe('deleteDrawnSticker', () => {
  it('archives the drawing and takes it off the board and the background', () => {
    const drawn = addDrawnSticker(baseProfile, 'sun', PNG, NOW).profile;
    const id = getActiveDrawnStickers(drawn)[0].id;
    const placed = setBackgroundSticker(placeRoomItem(drawn, 'board-1', id, NOW), id, NOW);
    expect(getPlacedRoomItems(placed)['board-1'].id).toBe(id);
    expect(getBackgroundSticker(placed)?.id).toBe(id);

    const deleted = deleteDrawnSticker(placed, id, LATER);
    expect(getActiveDrawnStickers(deleted)).toEqual([]);
    expect(getRoom(deleted).drawnStickers?.[0]).toMatchObject({ imageDataUrl: '', archivedAt: LATER.toISOString() });
    expect(getRoom(deleted).placements).toEqual({});
    expect(getBackgroundSticker(deleted)).toBeUndefined();
  });

  it('leaves the profile unchanged for an unknown sticker', () => {
    expect(deleteDrawnSticker(baseProfile, 'drawn-x', NOW)).toBe(baseProfile);
  });
});

describe('setBackgroundSticker', () => {
  it('sets an owned sticker and clears it with null', () => {
    const withBg = setBackgroundSticker(baseProfile, 'sticker-london-compass', NOW);
    expect(getBackgroundSticker(withBg)?.emoji).toBe('🧭');
    expect('backgroundStickerId' in getRoom(setBackgroundSticker(withBg, null, LATER))).toBe(false);
  });

  it('ignores a sticker the learner does not own or a non-sticker item', () => {
    expect(setBackgroundSticker(baseProfile, 'sticker-backstage-pass', NOW)).toBe(baseProfile);
    expect(setBackgroundSticker(baseProfile, 'room-plant', NOW)).toBe(baseProfile);
  });
});
