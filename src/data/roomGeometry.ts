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
  y: number;
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
}

/** Interpolated baseboard y at `x`. */
export function floorEdgeY(geometry: RoomGeometry, x: number): number {
  const points = geometry.floorEdge;
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

/** Extra distance (scene %) between the baseboard and the feet of an item standing right at it. */
export const FLOOR_EDGE_CLEARANCE = 1.5;

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
    })),
    {
      id: 'floor',
      kind: 'floor',
      xMin: geometry.floorXMin,
      xMax: geometry.floorXMax,
      yMin: geometry.floorMinY,
      yMax: geometry.floorMaxY,
      ...(geometry.isLegacy ? {} : { minYAt: (x: number) => floorEdgeY(geometry, x) + FLOOR_EDGE_CLEARANCE }),
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

const FLOOR_MAX_Y = 94;
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
const FLOOR_MARGIN_X = 6;
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
    wallRight: { ...shelfX, yMin: 8, yMax: 20 },
    board: { xMin: cornerX + 26, xMax: 95, yMin: 16, yMax: 30 },
    shelves: [
      { id: 'shelf-high', ...shelfX, y: yCorner - 28 },
      { id: 'shelf-low', ...shelfX, y: yCorner - 13 },
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

const ROOM_GEOMETRY: Record<ThemeId, RoomGeometry> = {
  'cozy-studio': cornerRoom({ cornerX: 57.5, window: { xMin: 12, xMax: 50, yMin: 10, yMax: 63 }, edge: [71, 67, 80], sill: { xMin: 22, xMax: 46, y: 62.5 } }),
  'neon-pop': cornerRoom({ cornerX: 57.5, window: { xMin: 12, xMax: 45, yMin: 10, yMax: 66 }, edge: [88, 64, 82], sill: { xMin: 14, xMax: 38, y: 61 } }),
  'starlight-rpg': cornerRoom({ cornerX: 60, window: { xMin: 14, xMax: 46, yMin: 8, yMax: 72 }, edge: [88, 69, 78], sill: { xMin: 22, xMax: 43, y: 58 } }),
  'focus-desk': cornerRoom({ cornerX: 57, window: { xMin: 10, xMax: 52, yMin: 6, yMax: 71 }, edge: [90, 64.5, 75], sill: { xMin: 16, xMax: 44, y: 66 } }),
  'urban-night': cornerRoom({ cornerX: 57.5, window: { xMin: 10, xMax: 49, yMin: 4, yMax: 66 }, edge: [89, 63.5, 75], sill: { xMin: 14, xMax: 44, y: 63 } }),
  'travel-journal': cornerRoom({ cornerX: 55.5, window: { xMin: 8, xMax: 50, yMin: 2, yMax: 66 }, edge: [89, 63.5, 84], sill: { xMin: 25, xMax: 47, y: 56 } }),
};

/** The room of a theme; the original room for a missing or unknown theme. */
export function getRoomGeometry(themeId: ThemeId | undefined): RoomGeometry {
  return (themeId && ROOM_GEOMETRY[themeId]) || LEGACY_GEOMETRY;
}
