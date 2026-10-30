import { ThemeId } from '../types/learner';

import type { RoomSurface, ScenePoint } from './roomPlacement';

/**
 * Where things can go in each theme's room picture (public/art/<theme>/room-baked.webp, with the bed,
 * wardrobe, desk and shelves drawn in): the corner where the two walls meet, the baseboard line that
 * separates wall from floor, the drawn furniture and the zones for hanging items, shelves and the
 * window sill. All numbers are scene percentages, read off the pictures. Pure data; placement lives
 * in roomPlacement.ts.
 */

export interface Box {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface ShelfLine {
  id: 'shelf-high' | 'shelf-low' | 'window-sill';
  xMin: number;
  xMax: number;
  /** Height of the line in the middle */
  y: number;
  /** How the drawn shelf runs, % down per % to the right (none: level) */
  tilt?: number;
}

export type FixedFurnitureId = 'bed' | 'wardrobe' | 'desk';

/** A piece of furniture drawn into the room picture: it cannot be moved, only tapped. */
export interface FixedFurniture {
  id: FixedFurnitureId;
  /** The drawn piece, as a polygon (scene %), the area that answers a tap */
  tapArea: ScenePoint[];
  /** Where the avatar stops when it walks to the piece */
  standAt: ScenePoint;
  /** Where its name shows, just above it */
  bubbleAt: ScenePoint;
}

/** A room picture with its big furniture and shelves drawn in (see scripts/art/renderBakedRoom.mjs). */
export interface BakedFurniture {
  /** The room picture, which replaces the empty room */
  roomPicture: string;
  pieces: FixedFurniture[];
  /**
   * The front of the furniture along the floor, left to right, with the baseboard in the gaps:
   * the feet of everything that stands on the floor stay below it
   */
  freeFloorEdge: ScenePoint[];
  /** The drawn desk top (a convex polygon, in order) */
  deskTop: ScenePoint[];
}

export interface RoomGeometry {
  /** Where the two walls meet (x, %) */
  cornerX: number;
  /** The baseboard line, left to right (x from 0 to 100): floor items stand below it */
  floorEdge: ScenePoint[];
  /** Feet y of an item standing at the very back of the floor (smallest depth scale) */
  floorMinY: number;
  /** Feet y of an item at the very front (largest depth scale) */
  floorMaxY: number;
  floorXMin: number;
  floorXMax: number;
  /** The window with its curtains: nothing hangs over it (the left wall is mostly window) */
  window?: Box;
  /** Where wall items hang on the left wall, beside the window; none when the window leaves no room */
  wallLeft: Box | null;
  wallRight: Box;
  shelves: ShelfLine[];
  /** Where the games book lies until it is moved */
  gamesBookHome: ScenePoint;
  avatarHome: ScenePoint;
  /** The bed, wardrobe, desk and shelves drawn into the room picture */
  baked: BakedFurniture;
}

/** Interpolated baseboard y at `x`. */
export function floorEdgeY(geometry: RoomGeometry, x: number): number {
  return lineYAt(geometry.floorEdge, x);
}

/** The y of a line through `points` (listed left to right) at `x`; level beyond its ends. */
export function lineYAt(points: ScenePoint[], x: number): number {
  if (x <= points[0].x) return points[0].y;
  for (let i = 1; i < points.length; i += 1) {
    if (x <= points[i].x) {
      const from = points[i - 1];
      const to = points[i];
      return from.y + ((to.y - from.y) * (x - from.x)) / (to.x - from.x);
    }
  }
  return points[points.length - 1].y;
}

/** The scene is 4:3: a run of 1% across is this many times as long as a rise of 1% up. */
const SCENE_WIDTH_OVER_HEIGHT = 4 / 3;

/**
 * How a wall runs in the scene, as pixels down per pixel to the right: the slope of its baseboard.
 * Things that hang flat on it (shelves, the board, frames) are drawn along this line.
 */
export function getWallSlope(geometry: RoomGeometry, isOnLeftWall: boolean): number {
  const points = geometry.floorEdge;
  const corner = { x: geometry.cornerX, y: floorEdgeY(geometry, geometry.cornerX) };
  const end = isOnLeftWall ? points[0] : points[points.length - 1];
  if (end.x === corner.x) return 0;
  return (end.y - corner.y) / (end.x - corner.x) / SCENE_WIDTH_OVER_HEIGHT;
}

/** Extra distance (scene %) between the baseboard and the feet of an item standing right at it. */
export const FLOOR_EDGE_CLEARANCE = 1.5;

/** An item's drawn body is a little narrower than its width: this share of it must stand clear of the furniture. */
const FREE_FLOOR_BODY_SHARE = 0.8;
const FREE_FLOOR_SAMPLES = 8;

/**
 * The smallest feet y at `x` in front of drawn-in furniture for an item `width` wide: the free floor line
 * is followed across the item's body, so a wide item never stands in a narrow gap between two pieces.
 */
function getFreeFloorMinY(freeFloorEdge: ScenePoint[], x: number, width: number): number {
  const half = (width * FREE_FLOOR_BODY_SHARE) / 2;
  const samples = Array.from({ length: FREE_FLOOR_SAMPLES + 1 }, (_, i) => x - half + (2 * half * i) / FREE_FLOOR_SAMPLES);
  return Math.max(...samples.map((sampleX) => lineYAt(freeFloorEdge, sampleX))) + FLOOR_EDGE_CLEARANCE;
}

/** The smallest feet y at `x` for an item `width` wide: in front of the furniture drawn into the room. */
export function getFloorMinY(geometry: RoomGeometry, x: number, width = 0): number {
  return getFreeFloorMinY(geometry.baked.freeFloorEdge, x, width);
}

/** The fixed surfaces of a room: the free walls, the drawn shelves and sill, and the floor (the desk top and stickers, see getSurfaces). */
export function getFixedSurfaces(geometry: RoomGeometry): RoomSurface[] {
  const { wallLeft, wallRight } = geometry;
  return [
    ...(wallLeft ? [{ id: 'wall-left', kind: 'wall' as const, ...wallLeft }] : []),
    { id: 'wall-right', kind: 'wall', ...wallRight },
    ...geometry.shelves.map((shelf) => ({
      id: shelf.id,
      kind: 'shelf' as const,
      xMin: shelf.xMin,
      xMax: shelf.xMax,
      yMin: shelf.y,
      yMax: shelf.y,
      ...(shelf.tilt !== undefined ? { tilt: shelf.tilt } : {}),
    })),
    {
      id: 'floor',
      kind: 'floor',
      xMin: geometry.floorXMin,
      xMax: geometry.floorXMax,
      yMin: geometry.floorMinY,
      yMax: geometry.floorMaxY,
      minYAt: (x: number, width?: number) => getFloorMinY(geometry, x, width),
    },
  ];
}

/** The floor runs to the bottom of the picture: feet can stand almost there. */
const FLOOR_MAX_Y = 98;
const FLOOR_MARGIN_X = 2;

interface BakedRoom {
  cornerX: number;
  window: Box;
  /** Baseboard y at the left edge, at the corner and at the right edge */
  edge: [number, number, number];
  wallLeft: Box | null;
  wallRight: Box;
  shelves: ShelfLine[];
  baked: BakedFurniture;
  gamesBook: ScenePoint;
  avatarHome: ScenePoint;
}

/**
 * A room whose picture has the bed, wardrobe, desk and shelves drawn in, all in the same places in
 * every theme: the bed in the back corner along the window wall, the wardrobe at the far left, the
 * desk at the far right under the shelves. Every number is read off the picture.
 */
function bakedRoom({ cornerX, window, edge: [yLeft, yCorner, yRight], wallLeft, wallRight, shelves, baked, gamesBook, avatarHome }: BakedRoom): RoomGeometry {
  return {
    cornerX,
    floorEdge: [
      { x: 0, y: yLeft },
      { x: cornerX, y: yCorner },
      { x: 100, y: yRight },
    ],
    floorMinY: Math.min(yLeft, yCorner, yRight) + FLOOR_EDGE_CLEARANCE,
    floorMaxY: FLOOR_MAX_Y,
    floorXMin: FLOOR_MARGIN_X,
    floorXMax: 100 - FLOOR_MARGIN_X,
    window,
    wallLeft,
    wallRight,
    shelves,
    gamesBookHome: gamesBook,
    avatarHome,
    baked,
  };
}

const ROOM_GEOMETRY: Record<ThemeId, RoomGeometry> = {
  'cozy-studio': bakedRoom({
    cornerX: 51,
    window: { xMin: 23, xMax: 46, yMin: 11, yMax: 52 },
    edge: [81, 63, 78.5],
    wallLeft: { xMin: 8, xMax: 17, yMin: 10.5, yMax: 14.5 },
    wallRight: { xMin: 87, xMax: 93, yMin: 17, yMax: 25 },
    shelves: [
      { id: 'shelf-high', xMin: 59.5, xMax: 79.5, y: 25.2, tilt: 0.035 },
      { id: 'shelf-low', xMin: 73.5, xMax: 95, y: 36.6, tilt: 0.045 },
      { id: 'window-sill', xMin: 30.5, xMax: 40, y: 48.3 },
    ],
    baked: {
      roomPicture: '/art/cozy-studio/room-baked.webp',
      pieces: [
        {
          id: 'wardrobe',
          tapArea: [{ x: 0, y: 22 }, { x: 26, y: 22 }, { x: 26, y: 77 }, { x: 10, y: 85 }, { x: 4, y: 85 }, { x: 0, y: 84 }],
          standAt: { x: 29, y: 89 },
          bubbleAt: { x: 13, y: 20 },
        },
        {
          id: 'bed',
          tapArea: [{ x: 25.5, y: 60 }, { x: 36, y: 57 }, { x: 42, y: 53.5 }, { x: 51, y: 53 }, { x: 51, y: 45 }, { x: 57, y: 38 }, { x: 64, y: 38 }, { x: 69.5, y: 45 }, { x: 69.5, y: 58 }, { x: 65, y: 69 }, { x: 40, y: 82.5 }, { x: 37, y: 82 }, { x: 25.5, y: 74 }],
          standAt: { x: 48, y: 87 },
          bubbleAt: { x: 52, y: 37 },
        },
        {
          id: 'desk',
          tapArea: [{ x: 65, y: 55 }, { x: 75, y: 52.3 }, { x: 99.5, y: 57.3 }, { x: 99.5, y: 61 }, { x: 98, y: 80 }, { x: 91, y: 84.5 }, { x: 88, y: 84.5 }, { x: 66, y: 76 }, { x: 65, y: 57 }],
          standAt: { x: 70, y: 89 },
          bubbleAt: { x: 82, y: 51 },
        },
      ],
      freeFloorEdge: [
        { x: 0, y: 83 },
        { x: 5, y: 85 },
        { x: 10, y: 84.5 },
        { x: 25.5, y: 77.5 },
        { x: 25.5, y: 74 },
        { x: 39, y: 82.5 },
        { x: 65, y: 69.5 },
        { x: 67, y: 76.5 },
        { x: 90, y: 84.5 },
        { x: 92, y: 81 },
        { x: 97, y: 79.5 },
        { x: 100, y: 79 },
      ],
      deskTop: [{ x: 65.3, y: 55.5 }, { x: 75, y: 52.8 }, { x: 98.8, y: 57.5 }, { x: 90.1, y: 60.3 }],
    },
    gamesBook: { x: 55, y: 90 },
    avatarHome: { x: 50, y: 92 },
  }),
  'neon-pop': bakedRoom({
    cornerX: 50.5,
    window: { xMin: 25, xMax: 43.5, yMin: 9.5, yMax: 45.5 },
    edge: [74, 47, 71.5],
    wallLeft: { xMin: 6, xMax: 21, yMin: 19, yMax: 25 },
    wallRight: { xMin: 87, xMax: 95, yMin: 21, yMax: 30 },
    shelves: [
      { id: 'shelf-high', xMin: 65, xMax: 82.5, y: 24.1, tilt: 0.32 },
      { id: 'shelf-low', xMin: 77.5, xMax: 95.5, y: 38.1, tilt: 0.28 },
      { id: 'window-sill', xMin: 28, xMax: 41, y: 43 },
    ],
    baked: {
      roomPicture: '/art/neon-pop/room-baked.webp',
      pieces: [
        {
          id: 'wardrobe',
          tapArea: [{ x: 3, y: 34 }, { x: 10, y: 30 }, { x: 18, y: 28 }, { x: 24.5, y: 31.5 }, { x: 24.5, y: 72 }, { x: 10, y: 80 }, { x: 3, y: 76 }],
          standAt: { x: 27, y: 83 },
          bubbleAt: { x: 14, y: 27 },
        },
        {
          id: 'bed',
          tapArea: [{ x: 26.5, y: 50 }, { x: 30, y: 48 }, { x: 42, y: 44 }, { x: 49, y: 38 }, { x: 49, y: 33 }, { x: 51, y: 32 }, { x: 64.5, y: 38 }, { x: 65, y: 57 }, { x: 41, y: 72 }, { x: 26.5, y: 63 }],
          standAt: { x: 47, y: 80 },
          bubbleAt: { x: 50, y: 30 },
        },
        {
          id: 'desk',
          tapArea: [{ x: 68, y: 52 }, { x: 77, y: 47.5 }, { x: 97.5, y: 56.5 }, { x: 97, y: 73 }, { x: 89, y: 79.5 }, { x: 87, y: 79.5 }, { x: 70, y: 70 }, { x: 68, y: 55 }],
          standAt: { x: 72, y: 85 },
          bubbleAt: { x: 83, y: 47 },
        },
      ],
      freeFloorEdge: [
        { x: 0, y: 75 },
        { x: 3.5, y: 75.5 },
        { x: 10, y: 80 },
        { x: 24.5, y: 72.5 },
        { x: 25, y: 61.5 },
        { x: 26.5, y: 63 },
        { x: 41, y: 72.5 },
        { x: 65, y: 57.5 },
        { x: 66.5, y: 55 },
        { x: 68.5, y: 55 },
        { x: 70.5, y: 70 },
        { x: 88.5, y: 79.5 },
        { x: 95.5, y: 75 },
        { x: 100, y: 71.5 },
      ],
      deskTop: [{ x: 69, y: 52.8 }, { x: 77, y: 48.4 }, { x: 96.2, y: 56.8 }, { x: 88.6, y: 61.8 }],
    },
    gamesBook: { x: 55, y: 90 },
    avatarHome: { x: 50, y: 92 },
  }),
  'starlight-rpg': bakedRoom({
    cornerX: 55,
    window: { xMin: 21, xMax: 43, yMin: 14, yMax: 48 },
    edge: [72, 66, 80.5],
    wallLeft: { xMin: 11, xMax: 18, yMin: 17, yMax: 25 },
    wallRight: { xMin: 58, xMax: 66, yMin: 33, yMax: 37 },
    shelves: [
      { id: 'shelf-high', xMin: 71, xMax: 87, y: 29.8, tilt: 0.067 },
      { id: 'shelf-low', xMin: 78, xMax: 94, y: 42, tilt: 0.072 },
      { id: 'window-sill', xMin: 28, xMax: 41, y: 47.5 },
    ],
    baked: {
      roomPicture: '/art/starlight-rpg/room-baked.webp',
      pieces: [
        {
          id: 'wardrobe',
          tapArea: [{ x: 4.5, y: 36 }, { x: 10, y: 32 }, { x: 25, y: 31.5 }, { x: 25.5, y: 40 }, { x: 25.5, y: 75 }, { x: 11, y: 81 }, { x: 4.5, y: 78 }],
          standAt: { x: 31, y: 86 },
          bubbleAt: { x: 15, y: 31 },
        },
        {
          id: 'bed',
          tapArea: [{ x: 28, y: 54 }, { x: 40, y: 52 }, { x: 51, y: 42 }, { x: 60, y: 41 }, { x: 66, y: 44 }, { x: 66, y: 67 }, { x: 42, y: 78 }, { x: 28, y: 71 }],
          standAt: { x: 47, y: 85 },
          bubbleAt: { x: 47, y: 41 },
        },
        {
          id: 'desk',
          tapArea: [{ x: 70.5, y: 58.5 }, { x: 78, y: 55.5 }, { x: 95.5, y: 60.5 }, { x: 95, y: 77 }, { x: 88, y: 82 }, { x: 72, y: 75.5 }],
          standAt: { x: 67, y: 87 },
          bubbleAt: { x: 83, y: 55 },
        },
      ],
      freeFloorEdge: [
        { x: 0, y: 82 },
        { x: 4, y: 82 },
        { x: 5, y: 79 },
        { x: 11, y: 81.5 },
        { x: 25, y: 76 },
        { x: 28.5, y: 71.5 },
        { x: 41.5, y: 77.5 },
        { x: 65, y: 70 },
        { x: 72.4, y: 74.5 },
        { x: 87.6, y: 81 },
        { x: 93.3, y: 77 },
        { x: 96.5, y: 80 },
        { x: 100, y: 81 },
      ],
      deskTop: [{ x: 70.7, y: 59.1 }, { x: 78, y: 56.1 }, { x: 94.9, y: 61 }, { x: 88.4, y: 66 }],
    },
    gamesBook: { x: 58, y: 88 },
    avatarHome: { x: 50, y: 91 },
  }),
  'focus-desk': bakedRoom({
    cornerX: 58.75,
    window: { xMin: 30.5, xMax: 53, yMin: 14, yMax: 49 },
    edge: [76.6, 62.5, 79.7],
    wallLeft: { xMin: 7, xMax: 24, yMin: 13, yMax: 21 },
    wallRight: { xMin: 87, xMax: 95, yMin: 17, yMax: 27 },
    shelves: [
      { id: 'shelf-high', xMin: 63, xMax: 81, y: 25, tilt: 0.02 },
      { id: 'shelf-low', xMin: 76.5, xMax: 96, y: 37.4, tilt: 0.08 },
      { id: 'window-sill', xMin: 32.5, xMax: 51.5, y: 46 },
    ],
    baked: {
      roomPicture: '/art/focus-desk/room-baked.webp',
      pieces: [
        {
          id: 'wardrobe',
          tapArea: [{ x: 4, y: 26 }, { x: 9, y: 24.5 }, { x: 26, y: 24.5 }, { x: 28, y: 27 }, { x: 28, y: 75.5 }, { x: 12, y: 81.5 }, { x: 9, y: 81.5 }, { x: 4, y: 76 }],
          standAt: { x: 24, y: 84 },
          bubbleAt: { x: 16, y: 22 },
        },
        {
          id: 'bed',
          tapArea: [{ x: 30.5, y: 56 }, { x: 34, y: 53 }, { x: 47, y: 51 }, { x: 57.5, y: 47 }, { x: 58, y: 41.5 }, { x: 60, y: 40.5 }, { x: 70.5, y: 43 }, { x: 71.5, y: 45.5 }, { x: 71.5, y: 54 }, { x: 66.5, y: 55 }, { x: 66.5, y: 65 }, { x: 44, y: 76.5 }, { x: 41, y: 76.5 }, { x: 30.5, y: 69 }],
          standAt: { x: 50, y: 84 },
          bubbleAt: { x: 64, y: 37 },
        },
        {
          id: 'desk',
          tapArea: [{ x: 66.5, y: 55 }, { x: 76.7, y: 52.3 }, { x: 98, y: 58.8 }, { x: 98, y: 61 }, { x: 97.2, y: 78.6 }, { x: 88, y: 84.3 }, { x: 86.4, y: 84 }, { x: 85.6, y: 70 }, { x: 77.5, y: 70 }, { x: 67.3, y: 73.8 }, { x: 66.3, y: 57 }],
          standAt: { x: 76, y: 86 },
          bubbleAt: { x: 85, y: 52 },
        },
      ],
      freeFloorEdge: [
        { x: 0, y: 76.6 },
        { x: 4, y: 75.8 },
        { x: 9, y: 81.8 },
        { x: 12, y: 81.8 },
        { x: 28, y: 76 },
        { x: 28.5, y: 70 },
        { x: 30.5, y: 69.4 },
        { x: 31, y: 69.5 },
        { x: 41, y: 77 },
        { x: 44, y: 77 },
        { x: 66.5, y: 65.3 },
        { x: 67, y: 74 },
        { x: 86.4, y: 84.5 },
        { x: 88, y: 84.8 },
        { x: 97.2, y: 79 },
        { x: 100, y: 79.7 },
      ],
      deskTop: [{ x: 67.5, y: 55.5 }, { x: 76.7, y: 53 }, { x: 97, y: 59.3 }, { x: 88, y: 64.3 }],
    },
    gamesBook: { x: 55, y: 90 },
    avatarHome: { x: 50, y: 92 },
  }),
  'urban-night': bakedRoom({
    cornerX: 53,
    window: { xMin: 24, xMax: 48.5, yMin: 10.5, yMax: 49.5 },
    edge: [76.6, 56.5, 76.2],
    wallLeft: { xMin: 4, xMax: 18, yMin: 13, yMax: 22 },
    wallRight: { xMin: 87, xMax: 95, yMin: 19, yMax: 30 },
    shelves: [
      { id: 'shelf-high', xMin: 68, xMax: 84, y: 25.8, tilt: 0.23 },
      { id: 'shelf-low', xMin: 77.5, xMax: 94, y: 37.8, tilt: 0.26 },
      { id: 'window-sill', xMin: 28, xMax: 46, y: 47.2, tilt: -0.2 },
    ],
    baked: {
      roomPicture: '/art/urban-night/room-baked.webp',
      pieces: [
        {
          id: 'wardrobe',
          tapArea: [{ x: 4, y: 29.5 }, { x: 10, y: 26.5 }, { x: 20, y: 26 }, { x: 26.8, y: 28 }, { x: 26.8, y: 73 }, { x: 13, y: 80.5 }, { x: 10, y: 80.5 }, { x: 4, y: 76.5 }],
          standAt: { x: 29, y: 85 },
          bubbleAt: { x: 15, y: 24 },
        },
        {
          id: 'bed',
          tapArea: [{ x: 27, y: 55.5 }, { x: 32, y: 52 }, { x: 41.5, y: 50 }, { x: 50, y: 47 }, { x: 51.5, y: 41 }, { x: 55, y: 37.5 }, { x: 60, y: 36 }, { x: 64, y: 38 }, { x: 66.5, y: 44 }, { x: 66, y: 64 }, { x: 42, y: 75 }, { x: 39, y: 75 }, { x: 27, y: 68 }],
          standAt: { x: 48, y: 82 },
          bubbleAt: { x: 58, y: 33 },
        },
        {
          id: 'desk',
          tapArea: [{ x: 64.5, y: 52 }, { x: 74.3, y: 48.5 }, { x: 96.5, y: 55.5 }, { x: 96.5, y: 58.5 }, { x: 94.5, y: 75 }, { x: 87.5, y: 79.5 }, { x: 85, y: 79.5 }, { x: 84.8, y: 62 }, { x: 66.5, y: 69 }, { x: 64.5, y: 54.5 }],
          standAt: { x: 75, y: 86 },
          bubbleAt: { x: 85, y: 47 },
        },
      ],
      freeFloorEdge: [
        { x: 0, y: 76.6 },
        { x: 4, y: 76.5 },
        { x: 10, y: 80.8 },
        { x: 13, y: 80.8 },
        { x: 26.8, y: 74.5 },
        { x: 27, y: 68.3 },
        { x: 39, y: 75.3 },
        { x: 42, y: 75.3 },
        { x: 65.5, y: 64.3 },
        { x: 66, y: 70.8 },
        { x: 85, y: 80 },
        { x: 87.5, y: 80 },
        { x: 94.5, y: 75.2 },
        { x: 100, y: 76.2 },
      ],
      deskTop: [{ x: 65.5, y: 53 }, { x: 74.3, y: 49.6 }, { x: 95, y: 56.3 }, { x: 86, y: 59.3 }],
    },
    gamesBook: { x: 55, y: 90 },
    avatarHome: { x: 50, y: 92 },
  }),
  'travel-journal': bakedRoom({
    cornerX: 49.8,
    window: { xMin: 22.5, xMax: 45.5, yMin: 14.5, yMax: 49 },
    edge: [68.8, 51.8, 72],
    wallLeft: null,
    wallRight: { xMin: 53, xMax: 65, yMin: 23, yMax: 33 },
    shelves: [
      { id: 'shelf-high', xMin: 67.5, xMax: 85, y: 27.2, tilt: 0.03 },
      { id: 'shelf-low', xMin: 76, xMax: 95.5, y: 37.8, tilt: 0.06 },
      { id: 'window-sill', xMin: 29, xMax: 40, y: 41.9, tilt: -0.05 },
    ],
    baked: {
      roomPicture: '/art/travel-journal/room-baked.webp',
      pieces: [
        {
          id: 'wardrobe',
          tapArea: [{ x: 1.5, y: 28 }, { x: 7, y: 26.6 }, { x: 22.8, y: 26.8 }, { x: 22.8, y: 72.3 }, { x: 8.2, y: 78.3 }, { x: 6, y: 78.3 }, { x: 1.5, y: 73 }],
          standAt: { x: 16, y: 84 },
          bubbleAt: { x: 12, y: 24 },
        },
        {
          id: 'bed',
          tapArea: [{ x: 23, y: 52 }, { x: 26, y: 49.5 }, { x: 42, y: 47 }, { x: 48.8, y: 44 }, { x: 49.2, y: 38.8 }, { x: 50.5, y: 38.5 }, { x: 55, y: 39.5 }, { x: 62, y: 40.5 }, { x: 62, y: 59.5 }, { x: 35.3, y: 71.8 }, { x: 32.6, y: 71.8 }, { x: 32.6, y: 68.5 }, { x: 23, y: 64.5 }],
          standAt: { x: 42, y: 79 },
          bubbleAt: { x: 55, y: 35 },
        },
        {
          id: 'desk',
          tapArea: [{ x: 69.8, y: 51.7 }, { x: 77.9, y: 48.2 }, { x: 98, y: 52.8 }, { x: 98, y: 55 }, { x: 96.8, y: 72.5 }, { x: 91, y: 77.5 }, { x: 89, y: 77.5 }, { x: 72.5, y: 69.5 }, { x: 70.8, y: 69.5 }, { x: 69.8, y: 53.5 }],
          standAt: { x: 80, y: 85 },
          bubbleAt: { x: 88, y: 46 },
        },
      ],
      freeFloorEdge: [
        { x: 0, y: 72.5 },
        { x: 1.5, y: 72.5 },
        { x: 6, y: 78.5 },
        { x: 8.2, y: 78.5 },
        { x: 22.8, y: 72.5 },
        { x: 23.4, y: 64.5 },
        { x: 32.6, y: 72 },
        { x: 35.3, y: 72 },
        { x: 60.5, y: 59.3 },
        { x: 61, y: 56.4 },
        { x: 70.3, y: 60.3 },
        { x: 70.8, y: 69.6 },
        { x: 89, y: 77.6 },
        { x: 91, y: 77.6 },
        { x: 96.8, y: 72.6 },
        { x: 100, y: 72.4 },
      ],
      deskTop: [{ x: 70.5, y: 51.8 }, { x: 77.9, y: 48.8 }, { x: 97, y: 53 }, { x: 90.7, y: 56.8 }],
    },
    gamesBook: { x: 55, y: 90 },
    avatarHome: { x: 50, y: 92 },
  }),
};

/** A missing or unknown theme gets the default theme's room. */
const FALLBACK_THEME: ThemeId = 'cozy-studio';

/** The room of a theme. */
export function getRoomGeometry(themeId: ThemeId | undefined): RoomGeometry {
  return (themeId && ROOM_GEOMETRY[themeId]) || ROOM_GEOMETRY[FALLBACK_THEME];
}
