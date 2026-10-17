import { describe, expect, it } from 'vitest';
import {
  ROOM_NAMING_XP,
  ROOM_SLOTS,
  RoomSlotKind,
  getOwnedRoomItems,
  getPlaceableSlots,
  getUnplacedRoomItems,
  placeNamedRoomItem,
  placeRoomItem,
  removeRoomItem,
} from './room';
import { LearnerProfile } from '../types/learner';

const NOW = new Date('2026-10-17T10:00:00.000Z');

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 9,
  gender: 'girl',
  gradeId: 'grade-4',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 148,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: ['avatar-boba-cat'],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function owning(...ids: string[]): LearnerProfile {
  return { ...baseProfile, unlockedRewardIds: [...baseProfile.unlockedRewardIds, ...ids] };
}

describe('getOwnedRoomItems', () => {
  it('includes the starter plant for every learner', () => {
    expect(getOwnedRoomItems(baseProfile).map((i) => i.id)).toEqual(['room-plant']);
  });

  it('includes shop decor and stickers but not avatars or boosts', () => {
    const ids = getOwnedRoomItems(
      owning('decor-neon-lamp', 'sticker-london-compass', 'boost-streak-shield')
    ).map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(['decor-neon-lamp', 'sticker-london-compass']));
    expect(ids).not.toContain('boost-streak-shield');
    expect(ids).not.toContain('avatar-boba-cat');
  });
});

describe('getPlaceableSlots', () => {
  it('returns only slots of the item kind', () => {
    const slots = getPlaceableSlots('room-sofa');
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => s.kind === 'floor')).toBe(true);
  });

  it('gives every item kind at least one slot', () => {
    const kinds = new Set(ROOM_SLOTS.map((s) => s.kind));
    const allKinds: RoomSlotKind[] = ['wall', 'board', 'shelf', 'desk', 'floor'];
    allKinds.forEach((kind) => expect(kinds.has(kind)).toBe(true));
  });
});

describe('placeRoomItem', () => {
  const withSofa = owning('room-sofa');

  it('places an owned item in a matching slot and stamps the time', () => {
    const placed = placeRoomItem(withSofa, 'floor-left', 'room-sofa', NOW);
    expect(placed.room?.placements).toEqual({ 'floor-left': 'room-sofa' });
    expect(placed.room?.updatedAt).toBe(NOW.toISOString());
    expect(getUnplacedRoomItems(placed).map((i) => i.id)).toEqual(['room-plant']);
  });

  it('does not mutate the input profile', () => {
    placeRoomItem(withSofa, 'floor-left', 'room-sofa', NOW);
    expect(withSofa.room).toBeUndefined();
  });

  it('rejects a slot of another kind, an unknown slot and an item not owned', () => {
    expect(placeRoomItem(withSofa, 'wall-left', 'room-sofa', NOW)).toBe(withSofa);
    expect(placeRoomItem(withSofa, 'attic', 'room-sofa', NOW)).toBe(withSofa);
    expect(placeRoomItem(withSofa, 'floor-left', 'room-chair', NOW)).toBe(withSofa);
  });

  it('moves an item that is already placed', () => {
    const first = placeRoomItem(withSofa, 'floor-left', 'room-sofa', NOW);
    const moved = placeRoomItem(first, 'floor-right', 'room-sofa', NOW);
    expect(moved.room?.placements).toEqual({ 'floor-right': 'room-sofa' });
  });

  it('sends the item already in the slot back to the inventory', () => {
    const first = placeRoomItem(withSofa, 'floor-left', 'room-sofa', NOW);
    const replaced = placeRoomItem(first, 'floor-left', 'room-plant', NOW);
    expect(replaced.room?.placements).toEqual({ 'floor-left': 'room-plant' });
    expect(getUnplacedRoomItems(replaced).map((i) => i.id)).toEqual(['room-sofa']);
  });
});

describe('removeRoomItem', () => {
  it('empties the slot', () => {
    const placed = placeRoomItem(baseProfile, 'floor-left', 'room-plant', NOW);
    const later = new Date('2026-10-18T10:00:00.000Z');
    const removed = removeRoomItem(placed, 'floor-left', later);
    expect(removed.room?.placements).toEqual({});
    expect(removed.room?.updatedAt).toBe(later.toISOString());
  });

  it('leaves the profile unchanged for an empty slot', () => {
    expect(removeRoomItem(baseProfile, 'floor-left', NOW)).toBe(baseProfile);
  });
});

describe('placeNamedRoomItem', () => {
  it('gives XP and levels up the first time an item is named', () => {
    const { profile, xpEarned } = placeNamedRoomItem(baseProfile, 'floor-left', 'room-plant', NOW);
    expect(xpEarned).toBe(ROOM_NAMING_XP);
    expect(profile.stats.xp).toBe(baseProfile.stats.xp + ROOM_NAMING_XP);
    expect(profile.stats.level).toBe(2);
    expect(profile.room?.namedItemIds).toEqual(['room-plant']);
    expect(profile.room?.placements).toEqual({ 'floor-left': 'room-plant' });
  });

  it('gives no XP when the item was named before', () => {
    const first = placeNamedRoomItem(baseProfile, 'floor-left', 'room-plant', NOW).profile;
    const again = placeNamedRoomItem(first, 'floor-right', 'room-plant', NOW);
    expect(again.xpEarned).toBe(0);
    expect(again.profile.stats.xp).toBe(first.stats.xp);
    expect(again.profile.room?.placements).toEqual({ 'floor-right': 'room-plant' });
  });

  it('gives nothing for an invalid placement', () => {
    const result = placeNamedRoomItem(baseProfile, 'wall-left', 'room-plant', NOW);
    expect(result.xpEarned).toBe(0);
    expect(result.profile).toBe(baseProfile);
  });
});
