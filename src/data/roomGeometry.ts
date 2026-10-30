import { ThemeId } from '../types/learner';

import type { RoomSurface, ScenePoint } from './roomPlacement';

/**
 * Where things can go in each theme's room picture (public/art/<theme>/room-corner.webp): the
 * corner where the two walls meet, the baseboard line that separates wall from floor, and the
 * zones for hanging items, shelves, the sticker board and the window sill. All numbers are scene
 * percentages, read off the pictures. Pure data; placement lives in roomPlacement.ts.
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
  /** A shelf drawn into the room picture: how it runs, % down per % to the right (else it follows the right wall) */
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
  /** The original room every theme shared before the corner rooms; kept as the fallback */
  isLegacy?: boolean;
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
  board: Box;
  shelves: ShelfLine[];
  /** Where the movable objects stand until they are moved */
  defaults: { desk: ScenePoint; bed: ScenePoint; wardrobe: ScenePoint; gamesBook: ScenePoint };
  avatarHome: ScenePoint;
  /** The bed, wardrobe, desk and shelves are part of the room picture (none: they are movable pictures) */
  baked?: BakedFurniture;
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

/**
 * The legs of a big piece (bed, desk, wardrobe, sofa, chair) drawn for the left wall, relative to its
 * feet (the front leg, the bottom middle of the picture), in shares of its width: the back leg by the
 * wall, the far back leg and the far front leg. Measured off the pictures; the right-wall pictures
 * are the mirror image.
 */
export interface FurnitureLeg {
  dx: number;
  dy: number;
}

/** A desk, wardrobe, sofa or chair: its long side runs along the wall. */
export const FURNITURE_LEGS: FurnitureLeg[] = [
  { dx: -0.45, dy: -0.16 },
  { dx: 0.18, dy: -0.43 },
  { dx: 0.42, dy: -0.29 },
];

/** The bed: its headboard is against the wall, so it reaches out from it. */
export const BED_LEGS: FurnitureLeg[] = [
  { dx: -0.44, dy: -0.34 },
  { dx: -0.06, dy: -0.52 },
  { dx: 0.45, dy: -0.22 },
];

/**
 * A big piece standing on the floor: how wide it is, whether its back is to the left wall, its legs,
 * and the shear it is drawn with to lie along its wall (pixels down per pixel to the right).
 */
export interface FurnitureFootprint {
  width: number;
  isOnLeftWall: boolean;
  legs?: FurnitureLeg[];
  shear?: number;
}

/**
 * The smallest feet y at `x`: just below the baseboard, or, for a big piece, low enough that all its
 * legs stand on the floor (its back leg is higher up the picture than its feet).
 */
export function getFloorMinY(geometry: RoomGeometry, x: number, footprint?: FurnitureFootprint): number {
  // In a room with its furniture drawn in, the floor starts in front of the furniture, all along the item's width
  if (geometry.baked) return getFreeFloorMinY(geometry.baked.freeFloorEdge, x, footprint?.width ?? 0);
  const atFeet = floorEdgeY(geometry, x) + FLOOR_EDGE_CLEARANCE;
  if (!footprint || footprint.width <= 0) return atFeet;
  const { width, shear = 0, legs = FURNITURE_LEGS } = footprint;
  const side = footprint.isOnLeftWall ? 1 : -1;
  return legs.reduce((minY, leg) => {
    const dx = side * leg.dx * width;
    // the shear lifts or lowers a leg by how far it is from the feet
    const legAboveFeet = -leg.dy * width - shear * dx * SCENE_WIDTH_OVER_HEIGHT;
    return Math.max(minY, floorEdgeY(geometry, x + dx) + FLOOR_EDGE_CLEARANCE + legAboveFeet);
  }, atFeet);
}

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

/** The surfaces of a room (the desk top depends on the desk, see getSurfaces). */
export function getFixedSurfaces(geometry: RoomGeometry): RoomSurface[] {
  const { wallLeft, wallRight, board } = geometry;
  return [
    ...(wallLeft ? [{ id: 'wall-left', kind: 'wall' as const, ...wallLeft }] : []),
    { id: 'wall-right', kind: 'wall', ...wallRight },
    { id: 'board', kind: 'board', ...board },
    ...geometry.shelves.map((shelf) => ({
      id: shelf.id,
      kind: 'shelf' as const,
      xMin: shelf.xMin,
      xMax: shelf.xMax,
      yMin: shelf.y,
      yMax: shelf.y,
      // The shelves on the right wall run along it (drawn-in shelves as drawn); the sill is part of the room picture, level
      ...(shelf.tilt !== undefined
        ? { tilt: shelf.tilt }
        : geometry.isLegacy || shelf.id === 'window-sill'
          ? {}
          : { tilt: getWallSlope(geometry, false) * SCENE_WIDTH_OVER_HEIGHT }),
    })),
    {
      id: 'floor',
      kind: 'floor',
      xMin: geometry.floorXMin,
      xMax: geometry.floorXMax,
      yMin: geometry.floorMinY,
      yMax: geometry.floorMaxY,
      ...(geometry.isLegacy ? {} : { minYAt: (x: number, footprint?: FurnitureFootprint) => getFloorMinY(geometry, x, footprint) }),
    },
  ];
}

/** The one room all themes shared before the corner rooms (and the fallback for an unknown theme). */
export const LEGACY_GEOMETRY: RoomGeometry = {
  isLegacy: true,
  cornerX: 50,
  floorEdge: [
    { x: 0, y: 62 },
    { x: 100, y: 62 },
  ],
  floorMinY: 74,
  floorMaxY: 92,
  floorXMin: 8,
  floorXMax: 92,
  wallLeft: { xMin: 7, xMax: 30, yMin: 8, yMax: 17 },
  wallRight: { xMin: 70, xMax: 93, yMin: 8, yMax: 17 },
  board: { xMin: 72, xMax: 88, yMin: 25, yMax: 34 },
  shelves: [
    { id: 'shelf-high', xMin: 8, xMax: 26, y: 30 },
    { id: 'shelf-low', xMin: 8, xMax: 26, y: 43 },
    { id: 'window-sill', xMin: 37, xMax: 53, y: 52 },
  ],
  defaults: {
    desk: { x: 66, y: 80 },
    bed: { x: 17, y: 82 },
    wardrobe: { x: 85, y: 80 },
    gamesBook: { x: 40, y: 91 },
  },
  avatarHome: { x: 50, y: 68 },
};

interface CornerRoom {
  cornerX: number;
  /** The window with its curtains, as drawn in the room picture */
  window: Box;
  /** Baseboard y at the left edge, at the corner and at the right edge */
  edge: [number, number, number];
  /** The window sill line under the window */
  sill: { xMin: number; xMax: number; y: number };
}

/** The floor runs to the bottom of the picture: feet can stand almost there. */
const FLOOR_MAX_Y = 98;
/** A hanging item is about this wide: its centre stays this far from the window's edge. */
const WALL_ITEM_CLEARANCE = 5;
const WALL_LEFT_X_MIN = 3;
/** Narrower than this and the strip beside the window is no place to hang anything. */
const WALL_LEFT_MIN_SPAN = 3;

/** The strip of the left wall beside the window where wall items can hang, or null when there is none. */
function getWallLeft(window: Box): Box | null {
  const xMax = window.xMin - WALL_ITEM_CLEARANCE;
  return xMax - WALL_LEFT_X_MIN >= WALL_LEFT_MIN_SPAN ? { xMin: WALL_LEFT_X_MIN, xMax, yMin: 10, yMax: 30 } : null;
}
const FLOOR_MARGIN_X = 2;
/** How far (scene %) above the baseboard at the corner the shelf planks hang */
const SHELF_HIGH_ABOVE_CORNER = 44;
const SHELF_LOW_ABOVE_CORNER = 29;
const BED_X = 21;
const WARDROBE_FROM_CORNER = 11;

/**
 * A corner room: shelves, the board and a hanging zone on the plain right wall, a hanging zone on
 * the left wall, the sill under the window, big furniture standing along the walls.
 */
function cornerRoom({ cornerX, window, edge: [yLeft, yCorner, yRight], sill }: CornerRoom): RoomGeometry {
  const floorEdge = [
    { x: 0, y: yLeft },
    { x: cornerX, y: yCorner },
    { x: 100, y: yRight },
  ];
  const partial = { floorEdge } as RoomGeometry;
  const edgeAt = (x: number) => floorEdgeY(partial, x);
  const stand = (x: number, depth: number): ScenePoint => ({ x, y: Math.min(FLOOR_MAX_Y - 2, edgeAt(x) + depth) });
  const shelfX = { xMin: cornerX + 4, xMax: cornerX + 22 };
  const deskX = cornerX + 19;
  return {
    cornerX,
    floorEdge,
    floorMinY: Math.min(yLeft, yCorner, yRight) + FLOOR_EDGE_CLEARANCE,
    floorMaxY: FLOOR_MAX_Y,
    floorXMin: FLOOR_MARGIN_X,
    floorXMax: 100 - FLOOR_MARGIN_X,
    window,
    wallLeft: getWallLeft(window),
    // The shelves take the wall high up by the corner: things hang beside them, under the board
    wallRight: { xMin: cornerX + 26, xMax: 95, yMin: 40, yMax: 46 },
    board: { xMin: cornerX + 26, xMax: 95, yMin: 16, yMax: 30 },
    shelves: [
      { id: 'shelf-high', ...shelfX, y: yCorner - SHELF_HIGH_ABOVE_CORNER },
      { id: 'shelf-low', ...shelfX, y: yCorner - SHELF_LOW_ABOVE_CORNER },
      { id: 'window-sill', ...sill },
    ],
    // The right wall is only about 40% wide: the desk takes it, the bed and the wardrobe stand along the left wall
    defaults: {
      desk: stand(deskX, 14),
      bed: stand(BED_X, 12),
      wardrobe: stand(cornerX - WARDROBE_FROM_CORNER, 12),
      gamesBook: stand(cornerX + 8, 24),
    },
    avatarHome: stand(cornerX - 6, 26),
  };
}

interface BakedRoom {
  cornerX: number;
  window: Box;
  /** Baseboard y at the left edge, at the corner and at the right edge */
  edge: [number, number, number];
  wallLeft: Box | null;
  wallRight: Box;
  board: Box;
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
function bakedRoom({ cornerX, window, edge: [yLeft, yCorner, yRight], wallLeft, wallRight, board, shelves, baked, gamesBook, avatarHome }: BakedRoom): RoomGeometry {
  const pieceAt = (id: FixedFurnitureId) => baked.pieces.find((piece) => piece.id === id)?.standAt ?? avatarHome;
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
    board,
    shelves,
    // The fixed pieces are not placed, but the old defaults stay filled for code that reads them
    defaults: { desk: pieceAt('desk'), bed: pieceAt('bed'), wardrobe: pieceAt('wardrobe'), gamesBook },
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
    board: { xMin: 86, xMax: 92, yMin: 10, yMax: 12 },
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
  'neon-pop': cornerRoom({ cornerX: 57.5, window: { xMin: 12, xMax: 45, yMin: 10, yMax: 66 }, edge: [88, 64, 82], sill: { xMin: 14, xMax: 38, y: 61 } }),
  'starlight-rpg': bakedRoom({
    cornerX: 55,
    window: { xMin: 21, xMax: 43, yMin: 14, yMax: 48 },
    edge: [72, 66, 80.5],
    wallLeft: { xMin: 11, xMax: 18, yMin: 17, yMax: 25 },
    wallRight: { xMin: 58, xMax: 66, yMin: 33, yMax: 37 },
    board: { xMin: 75, xMax: 83, yMin: 13.5, yMax: 15.5 },
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
  'focus-desk': cornerRoom({ cornerX: 57, window: { xMin: 10, xMax: 52, yMin: 6, yMax: 71 }, edge: [90, 64.5, 75], sill: { xMin: 16, xMax: 44, y: 66 } }),
  'urban-night': cornerRoom({ cornerX: 57.5, window: { xMin: 10, xMax: 49, yMin: 4, yMax: 66 }, edge: [89, 63.5, 75], sill: { xMin: 14, xMax: 44, y: 63 } }),
  'travel-journal': cornerRoom({ cornerX: 55.5, window: { xMin: 8, xMax: 50, yMin: 2, yMax: 66 }, edge: [89, 63.5, 84], sill: { xMin: 25, xMax: 47, y: 56 } }),
};

/** The room of a theme; the original room for a missing or unknown theme. */
export function getRoomGeometry(themeId: ThemeId | undefined): RoomGeometry {
  return (themeId && ROOM_GEOMETRY[themeId]) || LEGACY_GEOMETRY;
}
