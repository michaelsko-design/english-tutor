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
  getOtherWallPoint,
  getPlacedRoomEntries,
  getSurfaces,
  placeNamedRoomItemAt,
  placeRoomItemAt,
  snapToSurface,
  stepPoint,
  turnRoomItem,
} from './roomPlacement';
import { ROOM_NAMING_XP, ROOM_SLOTS, RoomSlotKind, getUnplacedRoomItems, removeRoomItem } from './room';
import { LearnerProfile, ThemeId } from '../types/learner';
import { floorEdgeY, getRoomGeometry } from './roomGeometry';

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

describe('themed room geometry', () => {
  const THEMES: ThemeId[] = ['cozy-studio', 'neon-pop', 'starlight-rpg', 'focus-desk', 'urban-night', 'travel-journal'];
  const themed = (themeId: ThemeId) => ({ ...baseProfile, themeId }) as LearnerProfile;

  it('falls back to the original room for a profile without a themed room', () => {
    expect(getRoomGeometry(undefined).isLegacy).toBe(true);
    expect(getRoomLayout(baseProfile).geometry.isLegacy).toBe(true);
  });

  THEMES.forEach((themeId) => {
    describe(themeId, () => {
      const geometry = getRoomGeometry(themeId);
      const layout = getRoomLayout(themed(themeId));

      it('has a baseboard line across the whole room, with the corner inside it', () => {
        expect(geometry.isLegacy).toBeFalsy();
        expect(geometry.floorEdge[0].x).toBe(0);
        expect(geometry.floorEdge[geometry.floorEdge.length - 1].x).toBe(100);
        expect(geometry.cornerX).toBeGreaterThan(30);
        expect(geometry.cornerX).toBeLessThan(70);
      });

      it('stands the bed, the wardrobe and the desk side by side, never on one another', () => {
        const entries = getPlacedRoomEntries(themed(themeId));
        const spans = ['object:bed', 'object:wardrobe', 'object:desk'].map((key) => {
          const entry = entries.find((candidate) => candidate.key === key)!;
          const half = (entry.width * getDepthScale('floor', entry.point.y, geometry)) / 2;
          return { key, from: entry.point.x - half, to: entry.point.x + half, y: entry.point.y };
        });
        spans.forEach((span) => expect(span.y, span.key).toBeGreaterThanOrEqual(floorEdgeY(geometry, span.from + 1)));
        spans.forEach((a, index) =>
          spans.slice(index + 1).forEach((b) => expect(a.to <= b.from || b.to <= a.from, `${a.key} / ${b.key}`).toBe(true))
        );
      });

      it('keeps every surface inside the scene', () => {
        KINDS.forEach((kind) =>
          getSurfaces(kind, layout).forEach((s) => {
            expect(s.xMin).toBeGreaterThanOrEqual(0);
            expect(s.xMax).toBeLessThanOrEqual(100);
            expect(s.yMax).toBeLessThanOrEqual(100);
            expect(s.xMin).toBeLessThanOrEqual(s.xMax);
            expect(s.yMin).toBeLessThanOrEqual(s.yMax);
          })
        );
      });

      it('never lets a wall item hang over the window, the shelves and the board stay clear of it too', () => {
        const window = geometry.window!;
        const overlapsWindow = (b: { xMin: number; xMax: number; yMin: number; yMax: number }) =>
          b.xMax > window.xMin && b.xMin < window.xMax && b.yMax > window.yMin && b.yMin < window.yMax;
        getSurfaces('wall', layout).forEach((surface) => expect(overlapsWindow(surface), surface.id).toBe(false));
        expect(overlapsWindow(geometry.board), 'board').toBe(false);
        geometry.shelves
          .filter((shelf) => shelf.id !== 'window-sill')
          .forEach((shelf) => expect(overlapsWindow({ ...shelf, yMin: shelf.y, yMax: shelf.y }), shelf.id).toBe(false));
        // an item dropped in the middle of the window is put beside it, not on it
        const middle = { x: (window.xMin + window.xMax) / 2, y: (window.yMin + window.yMax) / 2 };
        const { point } = snapToSurface('wall', middle, { layout, width: 8 });
        expect(point.x > window.xMin && point.x < window.xMax && point.y > window.yMin && point.y < window.yMax).toBe(false);
      });

      it('never lets floor items stand above the baseboard, wherever they are dropped', () => {
        [0, 12, 30, 50, 70, 88, 100].forEach((x) => {
          [0, 50, 100].forEach((y) => {
            const { point } = snapToSurface('floor', { x, y }, { layout, width: 8 });
            expect(point.y, `${x},${y}`).toBeGreaterThanOrEqual(floorEdgeY(geometry, point.x));
            expect(point.y).toBeLessThanOrEqual(100);
          });
        });
      });

      it('keeps all the legs of a big piece on the floor, wherever it is dragged: its back leg is higher up than its feet', () => {
        const width = getItemWidth({ id: 'object:bed', slotKind: 'floor' });
        [10, 25, 40, geometry.cornerX + 10, 85].forEach((x) => {
          const { point } = snapToSurface('floor', { x, y: 0 }, { layout, width, isFurniture: true });
          const side = point.x < geometry.cornerX ? -1 : 1;
          // the back leg by the wall: near one end of the piece, about 0.37 of its width up from its feet
          const backLegX = point.x + side * 0.45 * width;
          expect(point.y - 0.37 * width, `x ${x}`).toBeGreaterThanOrEqual(floorEdgeY(geometry, backLegX));
          expect(point.y).toBeLessThanOrEqual(geometry.floorMaxY);
        });
      });

      it('puts every default mission object on the floor, the phone on the desk top', () => {
        const entries = getPlacedRoomEntries(themed(themeId));
        ['bed', 'wardrobe', 'desk', 'games-book'].forEach((id) => {
          const entry = entries.find((e) => e.key === `object:${id}`)!;
          expect(entry.item.slotKind, id).toBe('floor');
          expect(entry.point.y, id).toBeGreaterThanOrEqual(floorEdgeY(geometry, entry.point.x));
        });
        const phone = entries.find((e) => e.key === 'object:phone')!;
        expect(phone.item.slotKind).toBe('desk');
        expect(phone.point.y).toBeCloseTo(getDeskTopPoint(layout.deskPoint, geometry, layout.deskShape).y);
      });

      it('makes floor items smaller far back and bigger near the front', () => {
        const far = getDepthScale('floor', geometry.floorMinY, geometry);
        const near = getDepthScale('floor', geometry.floorMaxY, geometry);
        expect(far).toBeLessThan(near);
        expect(far).toBeCloseTo(0.85);
        expect(near).toBeCloseTo(1.1);
      });
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
    // The desk top moves a little less than the desk's feet (the desk is drawn bigger further down)
    const dy = getDeskTopPoint(desk).y - getDeskTopPoint(DEFAULT_DESK_POINT).y;
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

  describe('the games book', () => {
    const deskTop = getDeskTopPoint(DEFAULT_DESK_POINT);
    const onDesk = moveRoomObject(baseProfile, 'games-book', deskTop, NOW);

    it('stands on the floor by default', () => {
      expect(findEntry(baseProfile, 'object:games-book')?.item.slotKind).toBe('floor');
    });

    it('can be put on the desk top, where it counts as a desk item', () => {
      const entry = findEntry(onDesk, 'object:games-book')!;
      expect(entry.item.slotKind).toBe('desk');
      expect(entry.point.y).toBeCloseTo(deskTop.y);
      expect(Math.abs(entry.point.x - deskTop.x)).toBeLessThanOrEqual(9);
    });

    it('goes back to the floor when it is dropped there', () => {
      const entry = findEntry(moveRoomObject(onDesk, 'games-book', { x: 30, y: 90 }, NOW), 'object:games-book')!;
      expect(entry.item.slotKind).toBe('floor');
      expect(entry.point.y).toBe(90);
    });

    it('moves with the desk and stays on it', () => {
      const moved = moveRoomObject(onDesk, 'desk', { x: 40, y: 85 }, NOW);
      const desk = findEntry(moved, 'object:desk')!.point;
      const book = findEntry(moved, 'object:games-book')!;
      expect(book.item.slotKind).toBe('desk');
      expect(book.point.y).toBeCloseTo(getDeskTopPoint(desk).y);
    });

    it('does not let other objects onto the desk', () => {
      const entry = findEntry(moveRoomObject(baseProfile, 'bed', deskTop, NOW), 'object:bed')!;
      expect(entry.item.slotKind).toBe('floor');
    });
  });

  describe('turning big items to the other wall', () => {
    const cozy = { ...baseProfile, themeId: 'cozy-studio' } as LearnerProfile;
    const { cornerX } = getRoomGeometry('cozy-studio');
    const sofaOnRightWall = placeRoomItemAt(cozy, 'room-sofa', { x: 75, y: 88 }, NOW);

    it('marks only furniture with a front and a side as turnable', () => {
      ['room-sofa', 'object:bed', 'object:wardrobe', 'object:desk'].forEach((key) =>
        expect(findEntry(key === 'room-sofa' ? sofaOnRightWall : cozy, key)?.canRotate, key).toBe(true)
      );
      expect(findEntry(cozy, 'object:phone')?.canRotate).toBe(false);
      expect(findEntry(placeRoomItemAt(cozy, 'room-books', { x: 70, y: 40 }, NOW), 'room-books')?.canRotate).toBe(false);
    });

    it('knows which wall a big item stands against from where it stands', () => {
      expect(findEntry(sofaOnRightWall, 'room-sofa')?.isOnLeftWall).toBe(false);
      // by default the bed and the wardrobe stand along the left wall, the desk along the right one
      expect(findEntry(cozy, 'object:bed')?.isOnLeftWall).toBe(true);
      expect(findEntry(cozy, 'object:wardrobe')?.isOnLeftWall).toBe(true);
      expect(findEntry(cozy, 'object:desk')?.isOnLeftWall).toBe(false);
    });

    it('moves a turned item to the other wall, so it never floats away from the wall it was against', () => {
      const turned = findEntry(turnRoomItem(sofaOnRightWall, 'room-sofa', NOW), 'room-sofa')!;
      expect(turned.isOnLeftWall).toBe(true);
      expect(turned.point.x).toBeLessThan(cornerX);
      const back = findEntry(turnRoomItem(turnRoomItem(sofaOnRightWall, 'room-sofa', NOW), 'room-sofa', NOW), 'room-sofa')!;
      expect(back.isOnLeftWall).toBe(false);
      expect(back.point.x).toBeGreaterThan(cornerX);
    });

    it('keeps a turned item on the floor, below the baseboard', () => {
      const geometry = getRoomGeometry('cozy-studio');
      ['room-sofa', 'object:bed', 'object:wardrobe', 'object:desk'].forEach((key) => {
        const profile = turnRoomItem(key === 'room-sofa' ? sofaOnRightWall : cozy, key, NOW);
        const entry = findEntry(profile, key)!;
        expect(entry.point.y, key).toBeGreaterThanOrEqual(floorEdgeY(geometry, entry.point.x));
        expect(entry.item.slotKind, key).toBe('floor');
      });
    });

    it('turns the desk with what lies on it', () => {
      const turned = turnRoomItem(cozy, 'object:desk', NOW);
      const desk = findEntry(turned, 'object:desk')!;
      expect(desk.isOnLeftWall).toBe(true);
      const phone = findEntry(turned, 'object:phone')!;
      expect(phone.item.slotKind).toBe('desk');
      expect(Math.abs(phone.point.x - desk.point.x)).toBeLessThan(9);
    });

    it('turns the same way in the original room, across its middle', () => {
      const profile = placeRoomItemAt(baseProfile, 'room-sofa', { x: 30, y: 85 }, NOW);
      expect(findEntry(turnRoomItem(profile, 'room-sofa', NOW), 'room-sofa')!.point.x).toBeGreaterThan(50);
    });

    it('leaves items that cannot turn, and unknown keys, unchanged', () => {
      expect(turnRoomItem(cozy, 'object:phone', NOW)).toBe(cozy);
      expect(turnRoomItem(cozy, 'nope', NOW)).toBe(cozy);
    });

    it('maps a point to the matching point on the other wall, and back', () => {
      const geometry = getRoomGeometry('neon-pop');
      const point = { x: 80, y: 90 };
      const other = getOtherWallPoint(point, geometry);
      expect(other.x).toBeLessThan(geometry.cornerX);
      expect(other.y - floorEdgeY(geometry, other.x)).toBeCloseTo(point.y - floorEdgeY(geometry, point.x));
      const back = getOtherWallPoint(other, geometry);
      expect(back.x).toBeCloseTo(point.x);
      expect(back.y).toBeCloseTo(point.y);
    });
  });

  it('snaps to the nearest surface across several kinds', () => {
    const top = getDeskTopPoint(DEFAULT_DESK_POINT);
    expect(snapToSurface(['floor', 'desk'], { x: top.x, y: top.y - 1 }).surface.kind).toBe('desk');
    expect(snapToSurface(['floor', 'desk'], { x: 30, y: 90 }).surface.kind).toBe('floor');
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
