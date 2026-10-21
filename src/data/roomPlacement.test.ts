import { describe, expect, it } from 'vitest';
import {
  LEGACY_SLOT_POINTS,
  ROOM_SURFACES,
  cycleSurface,
  findFreePoint,
  getDepthScale,
  getPlacedRoomEntries,
  getSurfaces,
  placeNamedRoomItemAt,
  placeRoomItemAt,
  snapToSurface,
  stepPoint,
} from './roomPlacement';
import { ROOM_NAMING_XP, ROOM_SLOTS, RoomSlotKind, getUnplacedRoomItems, removeRoomItem } from './room';
import { LearnerProfile } from '../types/learner';

const NOW = new Date('2026-10-17T10:00:00.000Z');

const baseProfile = {
  isOnboarded: true,
  name: 'Noa',
  gender: 'girl',
  stats: { xp: 0, level: 1, stars: 0, diamonds: 0 },
  unlockedRewardIds: ['room-books', 'room-teddy', 'room-robot', 'room-cactus', 'room-trophy', 'room-sofa', 'room-clock'],
  room: { placements: {}, namedItemIds: [], updatedAt: '' },
} as unknown as LearnerProfile;

const KINDS: RoomSlotKind[] = ['wall', 'board', 'shelf', 'desk', 'floor'];

describe('surfaces', () => {
  it('gives every item kind at least one surface', () => {
    KINDS.forEach((kind) => expect(getSurfaces(kind).length).toBeGreaterThan(0));
  });

  it('keeps every old slot default on a surface of its kind', () => {
    ROOM_SLOTS.forEach((slot) => {
      const point = LEGACY_SLOT_POINTS[slot.id];
      expect(snapToSurface(slot.kind, point).point).toEqual(point);
    });
  });

  it('keeps surfaces inside the scene', () => {
    ROOM_SURFACES.forEach((s) => {
      expect(s.xMin).toBeGreaterThanOrEqual(0);
      expect(s.xMax).toBeLessThanOrEqual(100);
      expect(s.yMax).toBeLessThanOrEqual(100);
      expect(s.xMin).toBeLessThanOrEqual(s.xMax);
      expect(s.yMin).toBeLessThanOrEqual(s.yMax);
    });
  });
});

describe('snapToSurface', () => {
  it('puts a point dropped above a shelf onto the shelf line', () => {
    const snapped = snapToSurface('shelf', { x: 15, y: 25 });
    expect(snapped.point).toEqual({ x: 15, y: 30 });
    expect(snapped.surface.id).toBe('shelf-high');
  });

  it('picks the nearest shelf and clamps along it', () => {
    const snapped = snapToSurface('shelf', { x: 99, y: 50 });
    expect(snapped.surface.id).toBe('window-sill');
    expect(snapped.point.x).toBe(53);
  });
});

describe('getDepthScale', () => {
  it('is larger near the viewer and 1 off the floor', () => {
    expect(getDepthScale('floor', 92)).toBeGreaterThan(getDepthScale('floor', 74));
    expect(getDepthScale('shelf', 43)).toBe(1);
  });
});

describe('findFreePoint', () => {
  it('moves a drop that lands on another item to the nearest free spot', () => {
    const point = findFreePoint('shelf', { x: 17, y: 43 }, [{ x: 17, y: 43 }]);
    expect(Math.abs(point.x - 17)).toBeGreaterThanOrEqual(6);
    expect(point.y).toBe(43);
  });

  it('keeps the drop when nothing is in the way', () => {
    expect(findFreePoint('floor', { x: 50, y: 80 }, [{ x: 80, y: 90 }])).toEqual({ x: 50, y: 80 });
  });
});

describe('keyboard moves', () => {
  it('steps within the surface and stops at its edge', () => {
    expect(stepPoint('shelf', { x: 25, y: 43 }, 2, 0)).toEqual({ x: 26, y: 43 });
  });

  it('cycles through the surfaces of a kind and wraps', () => {
    const next = cycleSurface('shelf', { x: 17, y: 30 }, 1);
    expect(snapToSurface('shelf', next).surface.id).toBe('shelf-low');
    const wrapped = cycleSurface('shelf', { x: 45, y: 52 }, 1);
    expect(snapToSurface('shelf', wrapped).surface.id).toBe('shelf-high');
    const back = cycleSurface('shelf', { x: 17, y: 30 }, -1);
    expect(snapToSurface('shelf', back).surface.id).toBe('window-sill');
  });
});

describe('placeRoomItemAt', () => {
  it('places an owned item at a snapped point and saves the position', () => {
    const placed = placeRoomItemAt(baseProfile, 'room-books', { x: 20, y: 20 }, NOW);
    expect(placed.room?.placements).toEqual({ 'room-books': 'room-books' });
    expect(placed.room?.positions?.['room-books']).toEqual({ x: 20, y: 30 });
    expect(placed.room?.updatedAt).toBe(NOW.toISOString());
    expect(baseProfile.room?.placements).toEqual({});
  });

  it('ignores items the learner does not own or that do not exist', () => {
    expect(placeRoomItemAt(baseProfile, 'room-lamp', { x: 60, y: 55 }, NOW)).toBe(baseProfile);
    expect(placeRoomItemAt(baseProfile, 'nope', { x: 60, y: 55 }, NOW)).toBe(baseProfile);
  });

  it('moves a placed item instead of duplicating it', () => {
    const first = placeRoomItemAt(baseProfile, 'room-books', { x: 10, y: 30 }, NOW);
    const moved = placeRoomItemAt(first, 'room-books', { x: 24, y: 43 }, NOW);
    expect(Object.values(moved.room?.placements ?? {})).toEqual(['room-books']);
    expect(moved.room?.positions).toEqual({ 'room-books': { x: 24, y: 43 } });
  });

  it('keeps two items on a shelf apart', () => {
    const first = placeRoomItemAt(baseProfile, 'room-books', { x: 17, y: 30 }, NOW);
    const second = placeRoomItemAt(first, 'room-teddy', { x: 17, y: 30 }, NOW);
    const [a, b] = getPlacedRoomEntries(second).map((entry) => entry.point);
    expect(Math.abs(a.x - b.x)).toBeGreaterThanOrEqual(6);
  });

  it('puts the item back in the inventory when removed', () => {
    const placed = placeRoomItemAt(baseProfile, 'room-books', { x: 17, y: 30 }, NOW);
    const removed = removeRoomItem(placed, 'room-books', NOW);
    expect(removed.room?.positions).toEqual({});
    expect(getUnplacedRoomItems(removed).map((i) => i.id)).toContain('room-books');
  });
});

describe('migration of slot placements', () => {
  const legacy = {
    ...baseProfile,
    room: { placements: { shelf: 'room-books', 'floor-left': 'room-sofa' }, namedItemIds: [], updatedAt: '' },
  } as LearnerProfile;

  it('shows old placements at their slot default without writing anything', () => {
    const entries = getPlacedRoomEntries(legacy);
    expect(entries.map((e) => [e.item.id, e.point])).toEqual([
      ['room-books', LEGACY_SLOT_POINTS.shelf],
      ['room-sofa', LEGACY_SLOT_POINTS['floor-left']],
    ]);
    expect(legacy.room?.positions).toBeUndefined();
  });

  it('moves an old placement to a new key and position when dragged', () => {
    const moved = placeRoomItemAt(legacy, 'room-books', { x: 20, y: 30 }, NOW);
    expect(moved.room?.placements).toEqual({ 'floor-left': 'room-sofa', 'room-books': 'room-books' });
    const entries = getPlacedRoomEntries(moved);
    expect(entries.find((e) => e.item.id === 'room-books')?.point).toEqual({ x: 20, y: 30 });
    expect(entries.find((e) => e.item.id === 'room-sofa')?.point).toEqual(LEGACY_SLOT_POINTS['floor-left']);
  });

  it('skips a placement with an unknown key and no position', () => {
    const odd = { ...legacy, room: { ...legacy.room!, placements: { attic: 'room-books' } } };
    expect(getPlacedRoomEntries(odd)).toEqual([]);
  });
});

describe('placeNamedRoomItemAt', () => {
  it('rewards naming once and places the item', () => {
    const first = placeNamedRoomItemAt(baseProfile, 'room-books', { x: 17, y: 30 }, NOW);
    expect(first.xpEarned).toBe(ROOM_NAMING_XP);
    expect(first.profile.room?.placements['room-books']).toBe('room-books');
    const again = placeNamedRoomItemAt(first.profile, 'room-books', { x: 20, y: 43 }, NOW);
    expect(again.xpEarned).toBe(0);
  });

  it('does nothing for an item that cannot be placed', () => {
    expect(placeNamedRoomItemAt(baseProfile, 'room-lamp', { x: 60, y: 55 }, NOW)).toEqual({
      profile: baseProfile,
      xpEarned: 0,
    });
  });
});
