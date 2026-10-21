import { LearnerProfile } from '../types/learner';
import {
  RoomItem,
  RoomSlotKind,
  applyItemNamedReward,
  getOwnedRoomItems,
  getRoom,
  getRoomItemFor,
} from './room';

/**
 * Free placement in the room: items stand on surfaces (shelves, sill, desk, floor) or hang on the
 * wall and board, at any point of a surface. Pure; the scene and the drag handling live in
 * components/room/. Old slot-based placements keep working: a placement whose key is a slot id and
 * that has no saved position sits at the slot's default point (LEGACY_SLOT_POINTS).
 */

/** A point in the room scene, as a percentage of its width (x) and height (y). */
export interface ScenePoint {
  x: number;
  y: number;
}

/**
 * A region an item of `kind` can be put in. `yMin === yMax` is a line (a shelf plank): items stand
 * on it. Points are anchors: the feet of an item that stands (shelf, desk, floor), the centre of
 * one that hangs (wall, board).
 */
export interface RoomSurface {
  id: string;
  kind: RoomSlotKind;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const ROOM_SURFACES: RoomSurface[] = [
  { id: 'wall-left', kind: 'wall', xMin: 7, xMax: 30, yMin: 8, yMax: 17 },
  { id: 'wall-right', kind: 'wall', xMin: 70, xMax: 93, yMin: 8, yMax: 17 },
  { id: 'board', kind: 'board', xMin: 72, xMax: 88, yMin: 25, yMax: 34 },
  { id: 'shelf-high', kind: 'shelf', xMin: 8, xMax: 26, yMin: 30, yMax: 30 },
  { id: 'shelf-low', kind: 'shelf', xMin: 8, xMax: 26, yMin: 43, yMax: 43 },
  { id: 'window-sill', kind: 'shelf', xMin: 37, xMax: 53, yMin: 52, yMax: 52 },
  { id: 'desk-top', kind: 'desk', xMin: 58, xMax: 79, yMin: 55, yMax: 55 },
  { id: 'floor', kind: 'floor', xMin: 26, xMax: 90, yMin: 74, yMax: 92 },
];

/** Default point of each old fixed slot, so placements made before free placement keep their spot. */
export const LEGACY_SLOT_POINTS: Record<string, ScenePoint> = {
  'wall-left': { x: 13, y: 15 },
  'wall-right': { x: 80, y: 13 },
  'board-1': { x: 75, y: 30 },
  'board-2': { x: 80, y: 30 },
  'board-3': { x: 85, y: 30 },
  shelf: { x: 17, y: 43 },
  'window-sill': { x: 45, y: 52 },
  'desk-top': { x: 62, y: 55 },
  'floor-left': { x: 37, y: 76 },
  'floor-center': { x: 57, y: 85 },
  'floor-right': { x: 80, y: 90 },
};

/** How close (scene %) two items of a kind may stand before the drop is moved to free room. */
const ITEM_GAPS: Record<RoomSlotKind, ScenePoint> = {
  wall: { x: 7, y: 7 },
  board: { x: 6, y: 6 },
  shelf: { x: 6, y: 3 },
  desk: { x: 6, y: 3 },
  floor: { x: 9, y: 4 },
};

const FREE_SPOT_STEP = 1.5;
const FLOOR_SCALE_FAR = 0.85;
const FLOOR_SCALE_NEAR = 1.1;

export function getSurfaces(kind: RoomSlotKind): RoomSurface[] {
  return ROOM_SURFACES.filter((surface) => surface.kind === kind);
}

function clampToSurface(surface: RoomSurface, point: ScenePoint): ScenePoint {
  return {
    x: Math.min(surface.xMax, Math.max(surface.xMin, point.x)),
    y: Math.min(surface.yMax, Math.max(surface.yMin, point.y)),
  };
}

function distance(a: ScenePoint, b: ScenePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** The nearest point on any surface of `kind`, and which surface it is on. */
export function snapToSurface(kind: RoomSlotKind, point: ScenePoint): { surface: RoomSurface; point: ScenePoint } {
  const candidates = getSurfaces(kind).map((surface) => {
    const snapped = clampToSurface(surface, point);
    return { surface, point: snapped, gap: distance(snapped, point) };
  });
  const [nearest] = candidates.sort((a, b) => a.gap - b.gap);
  return { surface: nearest.surface, point: nearest.point };
}

/** Floor items are drawn a little smaller further back (higher up) in the room. */
export function getDepthScale(kind: RoomSlotKind, y: number): number {
  if (kind !== 'floor') return 1;
  const [floor] = getSurfaces('floor');
  const depth = (y - floor.yMin) / Math.max(1, floor.yMax - floor.yMin);
  return FLOOR_SCALE_FAR + (FLOOR_SCALE_NEAR - FLOOR_SCALE_FAR) * Math.min(1, Math.max(0, depth));
}

function isTaken(kind: RoomSlotKind, point: ScenePoint, others: ScenePoint[]): boolean {
  const gap = ITEM_GAPS[kind];
  return others.some((other) => Math.abs(other.x - point.x) < gap.x && Math.abs(other.y - point.y) < gap.y);
}

/** Every grid point of the surfaces of `kind`, in steps of FREE_SPOT_STEP. */
function gridPoints(kind: RoomSlotKind): ScenePoint[] {
  return getSurfaces(kind).flatMap((surface) => {
    const points: ScenePoint[] = [];
    for (let y = surface.yMin; y <= surface.yMax; y += FREE_SPOT_STEP) {
      for (let x = surface.xMin; x <= surface.xMax; x += FREE_SPOT_STEP) points.push({ x, y });
    }
    return points;
  });
}

/**
 * Where a dropped item ends up: the nearest surface point, moved to the closest free spot when
 * other items are in the way. With no free spot at all the item stays where it was dropped.
 */
export function findFreePoint(kind: RoomSlotKind, point: ScenePoint, others: ScenePoint[]): ScenePoint {
  const { point: snapped } = snapToSurface(kind, point);
  if (!isTaken(kind, snapped, others)) return snapped;
  const free = gridPoints(kind)
    .filter((candidate) => !isTaken(kind, candidate, others))
    .sort((a, b) => distance(a, snapped) - distance(b, snapped));
  return free[0] ?? snapped;
}

/** One keyboard step from `point`, kept on the surfaces of `kind`. */
export function stepPoint(kind: RoomSlotKind, point: ScenePoint, dx: number, dy: number): ScenePoint {
  return snapToSurface(kind, { x: point.x + dx, y: point.y + dy }).point;
}

/** Moves to the next (`direction` 1) or previous (-1) surface of the kind, keeping x as far as it fits. */
export function cycleSurface(kind: RoomSlotKind, point: ScenePoint, direction: 1 | -1): ScenePoint {
  const surfaces = [...getSurfaces(kind)].sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
  const current = surfaces.findIndex((surface) => surface.id === snapToSurface(kind, point).surface.id);
  const target = surfaces[(current + direction + surfaces.length) % surfaces.length];
  return clampToSurface(target, point);
}

export interface PlacedRoomEntry {
  /** The key in `room.placements` (a slot id for old placements, the item id for new ones) */
  key: string;
  item: RoomItem;
  point: ScenePoint;
}

/** Placed items with their points: the saved position, or the old slot's default. */
export function getPlacedRoomEntries(profile: LearnerProfile): PlacedRoomEntry[] {
  const room = getRoom(profile);
  return Object.entries(room.placements).flatMap(([key, itemId]) => {
    const item = getRoomItemFor(profile, itemId);
    const point = room.positions?.[key] ?? LEGACY_SLOT_POINTS[key];
    return item && point ? [{ key, item, point }] : [];
  });
}

/**
 * Puts an owned item at `point` (snapped to a surface of its kind and moved to free room). An item
 * that is already placed moves; its old key is dropped. Invalid moves return the profile unchanged.
 */
export function placeRoomItemAt(
  profile: LearnerProfile,
  itemId: string,
  point: ScenePoint,
  now: Date
): LearnerProfile {
  const item = getRoomItemFor(profile, itemId);
  if (!item || !getOwnedRoomItems(profile).some((owned) => owned.id === itemId)) return profile;

  const room = getRoom(profile);
  const others = getPlacedRoomEntries(profile)
    .filter((entry) => entry.item.id !== itemId && entry.item.slotKind === item.slotKind)
    .map((entry) => entry.point);
  const placements = Object.fromEntries(
    Object.entries(room.placements).filter(([, placedId]) => placedId !== itemId)
  );
  const positions = Object.fromEntries(
    Object.entries(room.positions ?? {}).filter(([key]) => key in placements)
  );
  return {
    ...profile,
    room: {
      ...room,
      placements: { ...placements, [itemId]: itemId },
      positions: { ...positions, [itemId]: findFreePoint(item.slotKind, point, others) },
      updatedAt: now.toISOString(),
    },
  };
}

/** The "name it to place it" result at a point: naming reward plus the placement, as one update. */
export function placeNamedRoomItemAt(
  profile: LearnerProfile,
  itemId: string,
  point: ScenePoint,
  now: Date
): { profile: LearnerProfile; xpEarned: number } {
  const placed = placeRoomItemAt(profile, itemId, point, now);
  if (placed === profile) return { profile, xpEarned: 0 };
  return applyItemNamedReward(placed, itemId);
}
