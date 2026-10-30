import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DESK_POINT,
  LEGACY_SLOT_POINTS,
  ROOM_SURFACES,
  cycleSurface,
  findFreePoint,
  getDepthScale,
  getDeskTopPoint,
  getFixedFurniture,
  getItemWidth,
  getRoomLayout,
  moveRoomEntry,
  moveRoomObject,
  getPlacedRoomEntries,
  getPlacementOptions,
  getSurfaces,
  placeNamedRoomItemAt,
  placeRoomItemAt,
  snapToSurface,
  stepPoint,
  turnRoomItem,
} from './roomPlacement';
import { ROOM_NAMING_XP, ROOM_SLOTS, RoomSlotKind, getUnplacedRoomItems, removeRoomItem } from './room';
import { LearnerProfile, ThemeId } from '../types/learner';
import { BED_LEGS, floorEdgeY, getRoomGeometry, lineYAt } from './roomGeometry';
import { isInConvexPolygon } from './scenePolygon';

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

      // A room with its furniture drawn in has no movable bed, wardrobe or desk (see 'a room with its furniture drawn in')
      const itWithMovableFurniture = geometry.baked ? () => undefined : it;

      itWithMovableFurniture('stands the bed, the wardrobe and the desk side by side, never on one another', () => {
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

      itWithMovableFurniture('keeps all the legs of a big piece on the floor, wherever it is dragged: its back legs are higher up than its feet', () => {
        const width = getItemWidth({ id: 'object:bed', slotKind: 'floor' });
        (['left', 'right'] as const).forEach((wall) =>
          [10, 25, 40, geometry.cornerX + 10, 85].forEach((x) => {
            const options = getPlacementOptions('object:bed', width, layout, wall);
            const { point } = snapToSurface('floor', { x, y: 0 }, options);
            const side = wall === 'left' ? 1 : -1;
            BED_LEGS.forEach((leg) => {
              const dx = side * leg.dx * width;
              // the picture is sheared about its feet to lie along its wall, which lifts one end
              const legY = point.y + leg.dy * width + options.furnitureShear! * dx * (4 / 3);
              expect(legY, `${wall} wall, x ${x}`).toBeGreaterThanOrEqual(floorEdgeY(geometry, point.x + dx) - 0.01);
            });
            expect(point.y).toBeLessThanOrEqual(geometry.floorMaxY);
          })
        );
      });

      it('runs the shelves along the right wall, and keeps what stands on them on the plank', () => {
        const shelf = getSurfaces('shelf', layout).find((surface) => surface.id === 'shelf-high')!;
        const left = snapToSurface('shelf', { x: shelf.xMin, y: shelf.yMin }, { layout, width: 6 }).point;
        const right = snapToSurface('shelf', { x: shelf.xMax, y: shelf.yMin }, { layout, width: 6 }).point;
        // lower to the right, like the baseboard, and not half off the plank's ends
        expect(right.y).toBeGreaterThan(left.y);
        expect(left.x).toBeCloseTo(shelf.xMin + 3);
        expect(right.x).toBeCloseTo(shelf.xMax - 3);
        // high on the wall: well above the furniture standing against it
        expect(shelf.yMin).toBeLessThan(geometry.defaults.desk.y - 40);
      });

      itWithMovableFurniture('puts every default mission object on the floor, the phone on the desk top', () => {
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

describe('a room with its furniture drawn in', () => {
  const profile = { ...baseProfile, themeId: 'starlight-rpg' } as LearnerProfile;
  const geometry = getRoomGeometry('starlight-rpg');
  const layout = getRoomLayout(profile);
  const baked = geometry.baked!;
  const inPicture = (point: { x: number; y: number }) => point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100;
  const findEntry = (p: LearnerProfile, key: string) => getPlacedRoomEntries(p).find((e) => e.key === key);

  it('has no sticker board: stickers go on the free walls and stand on the drawn shelves', () => {
    const ids = getSurfaces('board', layout).map((surface) => surface.id).sort();
    expect(ids).toEqual(['shelf-high', 'shelf-low', 'wall-left', 'wall-right']);
    const shelf = geometry.shelves.find((line) => line.id === 'shelf-low')!;
    const onShelf = snapToSurface('board', { x: shelf.xMin + 3, y: shelf.y - 1 }, { layout }).point;
    const plankY = shelf.y + (onShelf.x - (shelf.xMin + shelf.xMax) / 2) * shelf.tilt!;
    expect(onShelf.y).toBeLessThan(plankY);
    expect(onShelf.y).toBeGreaterThan(plankY - 6);
  });

  it('has the bed, the wardrobe and the desk in its picture, each with a tap area, a spot to stand on and a place for its name', () => {
    expect(getFixedFurniture(geometry).map((piece) => piece.id).sort()).toEqual(['bed', 'desk', 'wardrobe']);
    getFixedFurniture(geometry).forEach((piece) => {
      expect(piece.tapArea.length, piece.id).toBeGreaterThanOrEqual(3);
      piece.tapArea.forEach((point) => expect(inPicture(point), piece.id).toBe(true));
      // the avatar stands on the free floor, in front of the furniture
      expect(piece.standAt.y, piece.id).toBeGreaterThan(lineYAt(baked.freeFloorEdge, piece.standAt.x));
      expect(piece.bubbleAt.y, piece.id).toBeLessThan(piece.standAt.y);
    });
    expect(getFixedFurniture(getRoomGeometry('travel-journal'))).toEqual([]);
  });

  it('has no movable bed, wardrobe or desk, and no big piece can be turned', () => {
    const withSofa = placeRoomItemAt(profile, 'room-sofa', { x: 50, y: 90 }, NOW);
    const entries = getPlacedRoomEntries(withSofa);
    ['object:bed', 'object:wardrobe', 'object:desk'].forEach((key) => expect(entries.find((e) => e.key === key), key).toBeUndefined());
    expect(entries.every((entry) => !entry.canRotate)).toBe(true);
    expect(turnRoomItem(withSofa, 'room-sofa', NOW)).toBe(withSofa);
    expect(moveRoomObject(profile, 'bed', { x: 50, y: 90 }, NOW)).toBe(profile);
  });

  it('keeps floor items in front of the furniture, wherever they are dropped', () => {
    [0, 15, 30, 47, 66, 80, 95, 100].forEach((x) =>
      [0, 60, 100].forEach((y) => {
        const { point } = snapToSurface('floor', { x, y }, { layout, width: 8 });
        expect(point.y, `${x},${y}`).toBeGreaterThan(lineYAt(baked.freeFloorEdge, point.x));
      })
    );
  });

  it('keeps a wide item clear of the furniture all along its width, so the sofa never stands in the gap between the bed and the desk', () => {
    const width = getItemWidth({ id: 'room-sofa', slotKind: 'floor' });
    const { point } = snapToSurface('floor', { x: 67, y: 72 }, { layout, width });
    [-0.4, 0, 0.4].forEach((share) => {
      const x = point.x + share * width;
      expect(point.y, `x ${x}`).toBeGreaterThan(lineYAt(baked.freeFloorEdge, x));
    });
  });

  it('lets small things stand on the drawn desk top, and a book let go over the desk lands on it', () => {
    expect(isConvex(baked.deskTop)).toBe(true);
    const [deskTop] = getSurfaces('desk', layout);
    expect(deskTop.outline).toEqual(baked.deskTop);
    const phone = findEntry(profile, 'object:phone')!;
    expect(phone.item.slotKind).toBe('desk');
    expect(isInConvexPolygon(baked.deskTop, phone.point)).toBe(true);
    const overDesk = { x: (deskTop.xMin + deskTop.xMax) / 2, y: deskTop.yMin - 2 };
    const book = findEntry(moveRoomObject(profile, 'games-book', overDesk, NOW), 'object:games-book')!;
    expect(book.item.slotKind).toBe('desk');
    expect(isInConvexPolygon(baked.deskTop, book.point)).toBe(true);
  });

  it('keeps shelf items on the drawn shelves, along each shelf as it is drawn', () => {
    const shelves = getSurfaces('shelf', layout);
    geometry.shelves.forEach((line) => {
      const surface = shelves.find((candidate) => candidate.id === line.id)!;
      expect(surface.tilt ?? 0, line.id).toBe(line.tilt ?? 0);
      const { point } = snapToSurface('shelf', { x: line.xMax, y: line.y - 5 }, { layout, width: 6 });
      expect(point.x).toBeLessThanOrEqual(line.xMax);
    });
  });
});

/** Whether the corners, listed in order, turn the same way all round. */
function isConvex(corners: { x: number; y: number }[]): boolean {
  const turns = corners.map((a, i) => {
    const b = corners[(i + 1) % corners.length];
    const c = corners[(i + 2) % corners.length];
    return Math.sign((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x));
  });
  return turns.every((turn) => turn === turns[0]);
}

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
    const urban = { ...baseProfile, themeId: 'urban-night' } as LearnerProfile;
    const { cornerX } = getRoomGeometry('urban-night');
    const sofaOnRightWall = placeRoomItemAt(urban, 'room-sofa', { x: 75, y: 88 }, NOW);

    it('marks only furniture with a front and a side as turnable', () => {
      ['room-sofa', 'object:bed', 'object:wardrobe', 'object:desk'].forEach((key) =>
        expect(findEntry(key === 'room-sofa' ? sofaOnRightWall : urban, key)?.canRotate, key).toBe(true)
      );
      expect(findEntry(urban, 'object:phone')?.canRotate).toBe(false);
      expect(findEntry(placeRoomItemAt(urban, 'room-books', { x: 70, y: 40 }, NOW), 'room-books')?.canRotate).toBe(false);
    });

    it('knows which wall a big item stands against from where it stands', () => {
      expect(findEntry(sofaOnRightWall, 'room-sofa')?.isOnLeftWall).toBe(false);
      // by default the bed and the wardrobe stand along the left wall, the desk along the right one
      expect(findEntry(urban, 'object:bed')?.isOnLeftWall).toBe(true);
      expect(findEntry(urban, 'object:wardrobe')?.isOnLeftWall).toBe(true);
      expect(findEntry(urban, 'object:desk')?.isOnLeftWall).toBe(false);
    });

    it('turns an item where it stands: only the picture changes wall, and turning twice turns it back', () => {
      const before = findEntry(sofaOnRightWall, 'room-sofa')!;
      const turned = findEntry(turnRoomItem(sofaOnRightWall, 'room-sofa', NOW), 'room-sofa')!;
      expect(turned.isOnLeftWall).toBe(true);
      expect(turned.point.x).toBeCloseTo(before.point.x);
      expect(turned.point.x).toBeGreaterThan(cornerX);
      const back = findEntry(turnRoomItem(turnRoomItem(sofaOnRightWall, 'room-sofa', NOW), 'room-sofa', NOW), 'room-sofa')!;
      expect(back.isOnLeftWall).toBe(false);
    });

    it('never turns an item that is moved, even across the corner: only the learner turns it', () => {
      const movedSofa = placeRoomItemAt(sofaOnRightWall, 'room-sofa', { x: 20, y: 92 }, NOW);
      expect(findEntry(movedSofa, 'room-sofa')!.point.x).toBeLessThan(cornerX);
      expect(findEntry(movedSofa, 'room-sofa')!.isOnLeftWall).toBe(false);
      const movedDesk = moveRoomObject(urban, 'desk', { x: 20, y: 95 }, NOW);
      expect(findEntry(movedDesk, 'object:desk')!.isOnLeftWall).toBe(false);
      const turnedThenMoved = moveRoomObject(turnRoomItem(urban, 'object:desk', NOW), 'desk', { x: 85, y: 95 }, NOW);
      expect(findEntry(turnedThenMoved, 'object:desk')!.isOnLeftWall).toBe(true);
    });

    it('keeps a turned item on the floor, below the baseboard', () => {
      const geometry = getRoomGeometry('urban-night');
      ['room-sofa', 'object:bed', 'object:wardrobe', 'object:desk'].forEach((key) => {
        const profile = turnRoomItem(key === 'room-sofa' ? sofaOnRightWall : urban, key, NOW);
        const entry = findEntry(profile, key)!;
        expect(entry.point.y, key).toBeGreaterThanOrEqual(floorEdgeY(geometry, entry.point.x));
        expect(entry.item.slotKind, key).toBe('floor');
      });
    });

    it('turns the desk with what lies on it', () => {
      const turned = turnRoomItem(urban, 'object:desk', NOW);
      const desk = findEntry(turned, 'object:desk')!;
      expect(desk.isOnLeftWall).toBe(true);
      const phone = findEntry(turned, 'object:phone')!;
      expect(phone.item.slotKind).toBe('desk');
      expect(Math.abs(phone.point.x - desk.point.x)).toBeLessThan(9);
    });

    it('leaves items that cannot turn, and unknown keys, unchanged', () => {
      expect(turnRoomItem(urban, 'object:phone', NOW)).toBe(urban);
      expect(turnRoomItem(urban, 'nope', NOW)).toBe(urban);
    });
  });

  it('puts the book on the desk top when it is let go anywhere over the desk, even nearer the floor behind it', () => {
    const profile = { ...baseProfile, themeId: 'travel-journal' } as LearnerProfile;
    const layout = getRoomLayout(profile);
    const top = getDeskTopPoint(layout.deskPoint, layout.geometry, layout.deskShape);
    // over the back corner of the desk top, close to the baseboard behind the desk
    const overBackCorner = { x: layout.deskPoint.x - 9, y: top.y - 6 };
    const book = findEntry(moveRoomObject(profile, 'games-book', overBackCorner, NOW), 'object:games-book')!;
    expect(book.item.slotKind).toBe('desk');
    const [deskTop] = getSurfaces('desk', layout);
    expect(isInConvexPolygon(deskTop.area!, book.point)).toBe(true);
    expect(Math.abs(book.point.y - top.y)).toBeLessThan(8);
  });

  it('lets small things stand anywhere on the drawn desk top, but not off its edges', () => {
    const profile = { ...baseProfile, themeId: 'travel-journal' } as LearnerProfile;
    const layout = getRoomLayout(profile);
    const [deskTop] = getSurfaces('desk', layout);
    const inside = { x: (deskTop.xMin + deskTop.xMax) / 2, y: (deskTop.yMin + deskTop.yMax) / 2 };
    expect(snapToSurface('desk', inside, { layout }).point).toEqual(inside);
    const offTheEdge = snapToSurface('desk', { x: deskTop.xMax + 10, y: deskTop.yMin - 10 }, { layout }).point;
    expect(isInConvexPolygon(deskTop.area!, offTheEdge)).toBe(true);
    expect(isInConvexPolygon(deskTop.outline!, offTheEdge)).toBe(true);
  });

  it('outlines the drop zone on the desk as the drawn desk top, turned the way the desk is turned', () => {
    const profile = { ...baseProfile, themeId: 'travel-journal' } as LearnerProfile;
    const outlineOf = (p: LearnerProfile) => getSurfaces('desk', getRoomLayout(p))[0].outline!;
    const facingRight = outlineOf(profile);
    const turned = turnRoomItem(profile, 'object:desk', NOW);
    const facingLeft = outlineOf(turned);
    const deskX = getRoomLayout(turned).deskPoint.x;
    expect(facingRight).toHaveLength(4);
    // the back corner of the top is toward the corner: left of the middle against the right wall, right of it when turned
    expect(facingRight[1].x).toBeLessThan(getRoomLayout(profile).deskPoint.x);
    expect(facingLeft[1].x).toBeGreaterThan(deskX);
    const top = getDeskTopPoint(getRoomLayout(turned).deskPoint, getRoomGeometry('travel-journal'), getRoomLayout(turned).deskShape);
    expect(Math.min(...facingLeft.map((c) => c.y))).toBeLessThan(top.y);
    expect(Math.max(...facingLeft.map((c) => c.y))).toBeGreaterThan(top.y);
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
