import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DESK_POINT,
  LEGACY_SLOT_POINTS,
  ROOM_SURFACES,
  cycleSurface,
  findFreePoint,
  getDepthScale,
  getDeskTopPoint,
  getItemWidth,
  getRoomLayout,
  moveRoomEntry,
  moveRoomObject,
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
    const point = findFreePoint('shelf', { x: 17, y: 43 }, [{ point: { x: 17, y: 43 }, width: 6 }]);
    expect(Math.abs(point.x - 17)).toBeGreaterThanOrEqual(6);
    expect(point.y).toBe(43);
  });

  it('keeps the drop when nothing is in the way', () => {
    expect(findFreePoint('floor', { x: 50, y: 80 }, [{ point: { x: 80, y: 90 }, width: 9 }])).toEqual({ x: 50, y: 80 });
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
    const entries = getPlacedRoomEntries(legacy).filter((e) => !e.key.startsWith('object:'));
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
    expect(getPlacedRoomEntries(odd).filter((e) => !e.key.startsWith('object:'))).toEqual([]);
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

describe('mission objects and the desk', () => {
  const findEntry = (profile: LearnerProfile, key: string) => getPlacedRoomEntries(profile).find((e) => e.key === key);

  it('lists every mission object and the desk as movable entries on the floor or desk', () => {
    const entries = getPlacedRoomEntries(baseProfile);
    ['bed', 'wardrobe', 'games-book', 'phone', 'desk'].forEach((id) => expect(findEntry(baseProfile, `object:${id}`)).toBeDefined());
    ['bed', 'wardrobe', 'desk'].forEach((id) => {
      const entry = entries.find((e) => e.key === `object:${id}`);
      expect(entry?.item.slotKind).toBe('floor');
      expect(entry!.point.y).toBeGreaterThanOrEqual(74);
    });
    expect(findEntry(baseProfile, 'object:phone')?.item.slotKind).toBe('desk');
  });

  it('keeps the phone on the desk top by default', () => {
    expect(findEntry(baseProfile, 'object:phone')!.point.y).toBe(getDeskTopPoint(DEFAULT_DESK_POINT).y);
  });

  it('moves the bed and saves its position', () => {
    const moved = moveRoomObject(baseProfile, 'bed', { x: 35, y: 80 }, NOW);
    expect(findEntry(moved, 'object:bed')?.point).toEqual({ x: 35, y: 80 });
    expect(moved.room?.updatedAt).toBe(NOW.toISOString());
  });

  it('keeps big furniture inside the room and apart from other furniture', () => {
    const edge = moveRoomObject(baseProfile, 'bed', { x: 0, y: 90 }, NOW);
    expect(findEntry(edge, 'object:bed')!.point.x).toBeGreaterThanOrEqual(getItemWidth({ id: 'object:bed', slotKind: 'floor' }) / 2);
    const wardrobe = findEntry(baseProfile, 'object:wardrobe')!.point;
    const onWardrobe = moveRoomObject(baseProfile, 'bed', wardrobe, NOW);
    const bed = findEntry(onWardrobe, 'object:bed')!.point;
    expect(Math.abs(bed.x - wardrobe.x) + Math.abs(bed.y - wardrobe.y)).toBeGreaterThan(8);
  });

  it('carries the phone and desk items when the desk moves', () => {
    const withLamp = placeRoomItemAt(
      { ...baseProfile, unlockedRewardIds: [...baseProfile.unlockedRewardIds, 'room-lamp'] } as LearnerProfile,
      'room-lamp',
      { x: 62, y: 60 },
      NOW
    );
    const lampBefore = findEntry(withLamp, 'room-lamp')!.point;
    const phoneBefore = findEntry(withLamp, 'object:phone')!.point;
    const moved = moveRoomObject(withLamp, 'desk', { x: 40, y: 85 }, NOW);
    const desk = findEntry(moved, 'object:desk')!.point;
    const dx = desk.x - DEFAULT_DESK_POINT.x;
    const dy = desk.y - DEFAULT_DESK_POINT.y;
    expect(findEntry(moved, 'room-lamp')!.point.x).toBeCloseTo(lampBefore.x + dx);
    expect(findEntry(moved, 'room-lamp')!.point.y).toBeCloseTo(lampBefore.y + dy);
    expect(findEntry(moved, 'object:phone')!.point.y).toBeCloseTo(phoneBefore.y + dy);
    expect(getRoomLayout(moved).deskPoint).toEqual(desk);
  });

  it('moves objects and items through moveRoomEntry and ignores unknown keys', () => {
    expect(findEntry(moveRoomEntry(baseProfile, 'object:wardrobe', { x: 70, y: 90 }, NOW), 'object:wardrobe')?.point.y).toBe(90);
    expect(moveRoomEntry(baseProfile, 'nope', { x: 10, y: 10 }, NOW)).toBe(baseProfile);
    expect(moveRoomEntry(baseProfile, 'object:nope', { x: 10, y: 10 }, NOW)).toBe(baseProfile);
  });

  it('keeps object positions when an item is placed or removed', () => {
    const moved = moveRoomObject(baseProfile, 'bed', { x: 35, y: 80 }, NOW);
    const placed = placeRoomItemAt(moved, 'room-books', { x: 17, y: 30 }, NOW);
    expect(findEntry(placed, 'object:bed')?.point).toEqual({ x: 35, y: 80 });
    expect(findEntry(removeRoomItem(placed, 'room-books', NOW), 'object:bed')?.point).toEqual({ x: 35, y: 80 });
  });
});

describe('item sizes', () => {
  it('gives furniture a believable relative scale', () => {
    const width = (id: string, kind: RoomSlotKind = 'floor') => getItemWidth({ id, slotKind: kind });
    expect(width('object:bed')).toBeGreaterThan(width('room-sofa'));
    expect(width('room-sofa')).toBeGreaterThan(width('object:wardrobe'));
    expect(width('object:desk')).toBeGreaterThan(width('room-sofa'));
    expect(width('object:wardrobe')).toBeGreaterThan(width('room-plant'));
    expect(width('room-plant')).toBeGreaterThan(width('room-ball'));
    expect(width('room-lamp', 'desk')).toBeGreaterThan(width('object:phone', 'desk'));
  });

  it('puts the desk legs on the floor with the top above it', () => {
    expect(getDeskTopPoint(DEFAULT_DESK_POINT).y).toBeLessThan(DEFAULT_DESK_POINT.y);
    expect(DEFAULT_DESK_POINT.y).toBeGreaterThanOrEqual(74);
  });
});
