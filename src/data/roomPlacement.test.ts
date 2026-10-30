import { describe, expect, it } from 'vitest';
import {
  LEGACY_SLOT_POINTS,
  cycleSurface,
  findFreePoint,
  getDepthScale,
  getFixedFurniture,
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
import { LearnerProfile, ThemeId } from '../types/learner';
import { floorEdgeY, getRoomGeometry, lineYAt } from './roomGeometry';
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

/** A profile without a theme gets the default theme's room (Cozy Studio). */
const layout = getRoomLayout(baseProfile);
const geometry = layout.geometry;
const options = { layout };
const shelfLine = (id: string) => geometry.shelves.find((shelf) => shelf.id === id)!;
const onShelf = (id: string, x: number) => {
  const shelf = shelfLine(id);
  return { x, y: shelf.y + (x - (shelf.xMin + shelf.xMax) / 2) * (shelf.tilt ?? 0) };
};
const deskMiddle = () => {
  const [deskTop] = getSurfaces('desk', layout);
  return { x: (deskTop.xMin + deskTop.xMax) / 2, y: (deskTop.yMin + deskTop.yMax) / 2 };
};

describe('surfaces', () => {
  it('gives every item kind at least one surface', () => {
    KINDS.forEach((kind) => expect(getSurfaces(kind, layout).length).toBeGreaterThan(0));
  });

  it('puts every old slot default on a surface of its kind', () => {
    ROOM_SLOTS.forEach((slot) => {
      const { surface } = snapToSurface(slot.kind, LEGACY_SLOT_POINTS[slot.id], options);
      expect(surface.kind, slot.id).toBe(slot.kind);
    });
  });
});

describe('themed room geometry', () => {
  const THEMES: ThemeId[] = ['cozy-studio', 'neon-pop', 'starlight-rpg', 'focus-desk', 'urban-night', 'travel-journal'];
  const themed = (themeId: ThemeId) => ({ ...baseProfile, themeId }) as LearnerProfile;

  it("gives a profile without a known theme the default theme's room", () => {
    expect(getRoomGeometry(undefined)).toBe(getRoomGeometry('cozy-studio'));
    expect(getRoomLayout({ ...baseProfile, themeId: 'retired-theme' } as unknown as LearnerProfile).geometry).toBe(
      getRoomGeometry('cozy-studio')
    );
  });

  THEMES.forEach((themeId) => {
    describe(themeId, () => {
      const geometry = getRoomGeometry(themeId);
      const layout = getRoomLayout(themed(themeId));

      it('has a baseboard line across the whole room, with the corner inside it', () => {
        expect(geometry.floorEdge[0].x).toBe(0);
        expect(geometry.floorEdge[geometry.floorEdge.length - 1].x).toBe(100);
        expect(geometry.cornerX).toBeGreaterThan(30);
        expect(geometry.cornerX).toBeLessThan(70);
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

      it('never lets a wall item hang over the window, and the shelves stay clear of it too', () => {
        const window = geometry.window!;
        const overlapsWindow = (b: { xMin: number; xMax: number; yMin: number; yMax: number }) =>
          b.xMax > window.xMin && b.xMin < window.xMax && b.yMax > window.yMin && b.yMin < window.yMax;
        getSurfaces('wall', layout).forEach((surface) => expect(overlapsWindow(surface), surface.id).toBe(false));
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

      it('runs the shelves along the right wall, and keeps what stands on them on the plank', () => {
        const shelf = getSurfaces('shelf', layout).find((surface) => surface.id === 'shelf-high')!;
        const left = snapToSurface('shelf', { x: shelf.xMin, y: shelf.yMin }, { layout, width: 6 }).point;
        const right = snapToSurface('shelf', { x: shelf.xMax, y: shelf.yMin }, { layout, width: 6 }).point;
        // lower to the right, like the baseboard, and not half off the plank's ends
        expect(right.y).toBeGreaterThan(left.y);
        expect(left.x).toBeCloseTo(shelf.xMin + 3);
        expect(right.x).toBeCloseTo(shelf.xMax - 3);
        // high on the wall: above the drawn desk top
        expect(shelf.yMin).toBeLessThan(Math.min(...geometry.baked.deskTop.map((corner) => corner.y)));
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
  const baked = geometry.baked;
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
  });

  it('has no movable bed, wardrobe or desk', () => {
    const entries = getPlacedRoomEntries(profile);
    ['object:bed', 'object:wardrobe', 'object:desk'].forEach((key) => expect(entries.find((e) => e.key === key), key).toBeUndefined());
    expect(moveRoomObject(profile, 'bed', { x: 50, y: 90 }, NOW)).toBe(profile);
    expect(moveRoomObject(profile, 'desk', { x: 50, y: 90 }, NOW)).toBe(profile);
  });

  it('ignores where the bed, wardrobe and desk were moved to and turned before they were drawn in', () => {
    const saved = {
      ...profile,
      room: {
        ...profile.room!,
        positions: { 'object:bed': { x: 30, y: 90 }, 'object:desk': { x: 40, y: 85 } },
        facings: { 'object:bed': 'left' as const },
      },
    };
    const entries = getPlacedRoomEntries(saved);
    expect(entries.map((entry) => entry.key).sort()).toEqual(['object:games-book', 'object:phone']);
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
    const x = 70;
    const snapped = snapToSurface('shelf', { x, y: shelfLine('shelf-high').y - 3 }, options);
    expect(snapped.surface.id).toBe('shelf-high');
    expect(snapped.point.x).toBe(x);
    expect(snapped.point.y).toBeCloseTo(onShelf('shelf-high', x).y);
  });

  it('picks the nearest shelf and clamps along it', () => {
    const sill = shelfLine('window-sill');
    const snapped = snapToSurface('shelf', { x: sill.xMin - 6, y: sill.y }, options);
    expect(snapped.surface.id).toBe('window-sill');
    expect(snapped.point.x).toBe(sill.xMin);
  });
});

describe('getDepthScale', () => {
  it('is larger near the viewer and 1 off the floor', () => {
    expect(getDepthScale('floor', 92, geometry)).toBeGreaterThan(getDepthScale('floor', 80, geometry));
    expect(getDepthScale('shelf', 43, geometry)).toBe(1);
  });
});

describe('findFreePoint', () => {
  it('moves a drop that lands on another item to the nearest free spot', () => {
    const spot = onShelf('shelf-low', 84);
    const point = findFreePoint('shelf', spot, [{ point: spot, width: 6 }], options);
    expect(Math.abs(point.x - spot.x)).toBeGreaterThanOrEqual(5);
    expect(snapToSurface('shelf', point, options).surface.id).toBe('shelf-low');
  });

  it('keeps the drop when nothing is in the way', () => {
    expect(findFreePoint('floor', { x: 50, y: 92 }, [{ point: { x: 80, y: 94 }, width: 9 }], options)).toEqual({ x: 50, y: 92 });
  });
});

describe('keyboard moves', () => {
  it('steps within the surface and stops at its edge', () => {
    const shelf = shelfLine('shelf-high');
    expect(stepPoint('shelf', onShelf('shelf-high', 70), 2, 0, options).x).toBe(72);
    expect(stepPoint('shelf', onShelf('shelf-high', shelf.xMax - 1), 2, 0, options).x).toBe(shelf.xMax);
  });

  it('cycles through the surfaces of a kind and wraps', () => {
    const high = onShelf('shelf-high', 70);
    const next = cycleSurface('shelf', high, 1, options);
    expect(snapToSurface('shelf', next, options).surface.id).toBe('shelf-low');
    const wrapped = cycleSurface('shelf', onShelf('window-sill', 35), 1, options);
    expect(snapToSurface('shelf', wrapped, options).surface.id).toBe('shelf-high');
    const back = cycleSurface('shelf', high, -1, options);
    expect(snapToSurface('shelf', back, options).surface.id).toBe('window-sill');
  });
});

describe('placeRoomItemAt', () => {
  it('places an owned item at a snapped point and saves the position', () => {
    const placed = placeRoomItemAt(baseProfile, 'room-books', { x: 70, y: 10 }, NOW);
    expect(placed.room?.placements).toEqual({ 'room-books': 'room-books' });
    expect(placed.room?.positions?.['room-books']?.x).toBe(70);
    expect(placed.room?.positions?.['room-books']?.y).toBeCloseTo(onShelf('shelf-high', 70).y);
    expect(placed.room?.updatedAt).toBe(NOW.toISOString());
    expect(baseProfile.room?.placements).toEqual({});
  });

  it('ignores items the learner does not own or that do not exist', () => {
    expect(placeRoomItemAt(baseProfile, 'room-lamp', { x: 60, y: 55 }, NOW)).toBe(baseProfile);
    expect(placeRoomItemAt(baseProfile, 'nope', { x: 60, y: 55 }, NOW)).toBe(baseProfile);
  });

  it('moves a placed item instead of duplicating it', () => {
    const first = placeRoomItemAt(baseProfile, 'room-books', onShelf('shelf-high', 70), NOW);
    const target = onShelf('shelf-low', 84);
    const moved = placeRoomItemAt(first, 'room-books', target, NOW);
    expect(Object.values(moved.room?.placements ?? {})).toEqual(['room-books']);
    expect(moved.room?.positions).toEqual({ 'room-books': target });
  });

  it('keeps two items on a shelf apart', () => {
    const first = placeRoomItemAt(baseProfile, 'room-books', onShelf('shelf-high', 70), NOW);
    const second = placeRoomItemAt(first, 'room-teddy', onShelf('shelf-high', 70), NOW);
    const [a, b] = getPlacedRoomEntries(second).map((entry) => entry.point);
    expect(Math.abs(a.x - b.x)).toBeGreaterThanOrEqual(6);
  });

  it('puts the item back in the inventory when removed', () => {
    const placed = placeRoomItemAt(baseProfile, 'room-books', onShelf('shelf-high', 70), NOW);
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

  it('shows old placements from their slot default, on a surface of their kind, without writing anything', () => {
    const entries = getPlacedRoomEntries(legacy).filter((e) => !e.key.startsWith('object:'));
    expect(entries.map((e) => e.item.id)).toEqual(['room-books', 'room-sofa']);
    expect(entries[0].point).toEqual(snapToSurface('shelf', LEGACY_SLOT_POINTS.shelf, { layout, width: entries[0].width }).point);
    expect(entries[1].point).toEqual(snapToSurface('floor', LEGACY_SLOT_POINTS['floor-left'], { layout, width: entries[1].width }).point);
    expect(legacy.room?.positions).toBeUndefined();
  });

  it('moves an old placement to a new key and position when dragged', () => {
    const target = onShelf('shelf-high', 70);
    const sofaBefore = getPlacedRoomEntries(legacy).find((e) => e.item.id === 'room-sofa')?.point;
    const moved = placeRoomItemAt(legacy, 'room-books', target, NOW);
    expect(moved.room?.placements).toEqual({ 'floor-left': 'room-sofa', 'room-books': 'room-books' });
    const entries = getPlacedRoomEntries(moved);
    expect(entries.find((e) => e.item.id === 'room-books')?.point).toEqual(target);
    expect(entries.find((e) => e.item.id === 'room-sofa')?.point).toEqual(sofaBefore);
  });

  it('skips a placement with an unknown key and no position', () => {
    const odd = { ...legacy, room: { ...legacy.room!, placements: { attic: 'room-books' } } };
    expect(getPlacedRoomEntries(odd).filter((e) => !e.key.startsWith('object:'))).toEqual([]);
  });
});

describe('placeNamedRoomItemAt', () => {
  it('rewards naming once and places the item', () => {
    const first = placeNamedRoomItemAt(baseProfile, 'room-books', onShelf('shelf-high', 70), NOW);
    expect(first.xpEarned).toBe(ROOM_NAMING_XP);
    expect(first.profile.room?.placements['room-books']).toBe('room-books');
    const again = placeNamedRoomItemAt(first.profile, 'room-books', onShelf('shelf-low', 84), NOW);
    expect(again.xpEarned).toBe(0);
  });

  it('does nothing for an item that cannot be placed', () => {
    expect(placeNamedRoomItemAt(baseProfile, 'room-lamp', { x: 60, y: 55 }, NOW)).toEqual({
      profile: baseProfile,
      xpEarned: 0,
    });
  });
});

describe('mission objects', () => {
  const findEntry = (profile: LearnerProfile, key: string) => getPlacedRoomEntries(profile).find((e) => e.key === key);

  it('lists the games book on the floor and the phone on the desk top', () => {
    expect(findEntry(baseProfile, 'object:games-book')?.item.slotKind).toBe('floor');
    const phone = findEntry(baseProfile, 'object:phone')!;
    expect(phone.item.slotKind).toBe('desk');
    expect(isInConvexPolygon(geometry.baked.deskTop, phone.point)).toBe(true);
  });

  it('moves the games book and saves its position', () => {
    const moved = moveRoomObject(baseProfile, 'games-book', { x: 50, y: 92 }, NOW);
    expect(findEntry(moved, 'object:games-book')?.point).toEqual({ x: 50, y: 92 });
    expect(moved.room?.updatedAt).toBe(NOW.toISOString());
  });

  it('moves objects and items through moveRoomEntry and ignores unknown keys', () => {
    expect(findEntry(moveRoomEntry(baseProfile, 'object:games-book', { x: 50, y: 94 }, NOW), 'object:games-book')?.point.y).toBe(94);
    expect(moveRoomEntry(baseProfile, 'nope', { x: 10, y: 10 }, NOW)).toBe(baseProfile);
    expect(moveRoomEntry(baseProfile, 'object:nope', { x: 10, y: 10 }, NOW)).toBe(baseProfile);
  });

  describe('the games book', () => {
    const deskTop = deskMiddle();
    const onDesk = moveRoomObject(baseProfile, 'games-book', deskTop, NOW);

    it('can be put on the desk top, where it counts as a desk item', () => {
      const entry = findEntry(onDesk, 'object:games-book')!;
      expect(entry.item.slotKind).toBe('desk');
      expect(isInConvexPolygon(geometry.baked.deskTop, entry.point)).toBe(true);
    });

    it('goes back to the floor when it is dropped there', () => {
      const entry = findEntry(moveRoomObject(onDesk, 'games-book', { x: 50, y: 92 }, NOW), 'object:games-book')!;
      expect(entry.item.slotKind).toBe('floor');
      expect(entry.point.y).toBe(92);
    });
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

  it('snaps to the nearest surface across several kinds', () => {
    const top = deskMiddle();
    expect(snapToSurface(['floor', 'desk'], { x: top.x, y: top.y - 1 }, options).surface.kind).toBe('desk');
    expect(snapToSurface(['floor', 'desk'], { x: 50, y: 92 }, options).surface.kind).toBe('floor');
  });

  it('keeps object positions when an item is placed or removed', () => {
    const moved = moveRoomObject(baseProfile, 'games-book', { x: 50, y: 92 }, NOW);
    const placed = placeRoomItemAt(moved, 'room-books', onShelf('shelf-high', 70), NOW);
    expect(findEntry(placed, 'object:games-book')?.point).toEqual({ x: 50, y: 92 });
    expect(findEntry(removeRoomItem(placed, 'room-books', NOW), 'object:games-book')?.point).toEqual({ x: 50, y: 92 });
  });
});

describe('item sizes', () => {
  it('gives furniture a believable relative scale', () => {
    const width = (id: string, kind: RoomSlotKind = 'floor') => getItemWidth({ id, slotKind: kind });
    expect(width('room-sofa')).toBeGreaterThan(width('room-plant'));
    expect(width('room-plant')).toBeGreaterThan(width('room-ball'));
    expect(width('room-lamp', 'desk')).toBeGreaterThan(width('object:phone', 'desk'));
  });
});
