import { LearnerProfile } from '../types/learner';
import {
  ROOM_OBJECTS,
  RoomItem,
  RoomSlotKind,
  applyItemNamedReward,
  getOwnedRoomItems,
  getRoom,
  getRoomItemFor,
} from './room';

/**
 * Free placement in the room: items stand on surfaces (shelves, sill, desk, floor) or hang on the
 * wall and board, at any point of a surface. Furniture and the mission objects (bed, wardrobe,
 * phone, games book, desk) are placed the same way and can be moved like any item. Pure; the scene
 * and the drag handling live in components/room/. Old slot-based placements keep working: a
 * placement whose key is a slot id and that has no saved position sits at the slot's default point
 * (LEGACY_SLOT_POINTS).
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

/** Where the movable desk is: its top is a surface for the small items (kind `desk`). */
export interface RoomLayoutContext {
  deskPoint: ScenePoint;
}

export const SCENE_ASPECT = 4 / 3;
/** The scene's pictures are 4:3, so a height in container-width units is this many % of the height. */
const CQW_TO_HEIGHT_PERCENT = SCENE_ASPECT;

export const OBJECT_KEY_PREFIX = 'object:';
export const DESK_OBJECT_ID = 'desk';

/** Fixed surfaces (the desk top depends on the desk, see getSurfaces). */
export const ROOM_SURFACES: RoomSurface[] = [
  { id: 'wall-left', kind: 'wall', xMin: 7, xMax: 30, yMin: 8, yMax: 17 },
  { id: 'wall-right', kind: 'wall', xMin: 70, xMax: 93, yMin: 8, yMax: 17 },
  { id: 'board', kind: 'board', xMin: 72, xMax: 88, yMin: 25, yMax: 34 },
  { id: 'shelf-high', kind: 'shelf', xMin: 8, xMax: 26, yMin: 30, yMax: 30 },
  { id: 'shelf-low', kind: 'shelf', xMin: 8, xMax: 26, yMin: 43, yMax: 43 },
  { id: 'window-sill', kind: 'shelf', xMin: 37, xMax: 53, yMin: 52, yMax: 52 },
  { id: 'floor', kind: 'floor', xMin: 8, xMax: 92, yMin: 74, yMax: 92 },
];

/** Item width per id, in container-width units (the depth scale is applied on top). */
const ITEM_WIDTHS: Record<string, number> = {
  'object:bed': 24,
  'object:wardrobe': 15,
  'object:games-book': 7,
  'object:phone': 5.5,
  'object:desk': 28,
  'room-sofa': 20,
  'room-chair': 8,
  'room-plant': 7,
  'room-ball': 5,
  'room-drum': 8,
  'room-picture': 9,
  'room-mirror': 8,
  'room-kite': 8,
  'room-computer': 8,
};

const KIND_WIDTHS: Record<RoomSlotKind, number> = { wall: 7, board: 6, shelf: 6.5, desk: 6, floor: 9 };

export function getItemWidth(item: Pick<RoomItem, 'id' | 'slotKind'>): number {
  return ITEM_WIDTHS[item.id] ?? KIND_WIDTHS[item.slotKind];
}

/** The desk picture: its width, its height/width ratio and how far down the picture the top line is. */
const DESK_ASPECT = 153 / 264;
const DESK_TOP_ANCHOR = 0.3;
const DESK_TOP_HALF_WIDTH = 9;
export const DEFAULT_DESK_POINT: ScenePoint = { x: 66, y: 80 };

const FLOOR_SCALE_FAR = 0.85;
const FLOOR_SCALE_NEAR = 1.1;
const FLOOR_Y_MIN = 74;
const FLOOR_Y_MAX = 92;

/** Floor items are drawn a little smaller further back (higher up) in the room. */
export function getDepthScale(kind: RoomSlotKind, y: number): number {
  if (kind !== 'floor') return 1;
  const depth = (y - FLOOR_Y_MIN) / (FLOOR_Y_MAX - FLOOR_Y_MIN);
  return FLOOR_SCALE_FAR + (FLOOR_SCALE_NEAR - FLOOR_SCALE_FAR) * Math.min(1, Math.max(0, depth));
}

/** Scene point of the middle of the desk top, for a desk standing with its feet at `desk`. */
export function getDeskTopPoint(desk: ScenePoint): ScenePoint {
  const width = getItemWidth({ id: 'object:desk', slotKind: 'floor' }) * getDepthScale('floor', desk.y);
  const heightPercent = width * DESK_ASPECT * CQW_TO_HEIGHT_PERCENT;
  return { x: desk.x, y: desk.y - heightPercent * (1 - DESK_TOP_ANCHOR) };
}

export const DEFAULT_LAYOUT: RoomLayoutContext = { deskPoint: DEFAULT_DESK_POINT };

export function getSurfaces(kind: RoomSlotKind, layout: RoomLayoutContext = DEFAULT_LAYOUT): RoomSurface[] {
  if (kind === 'desk') {
    const top = getDeskTopPoint(layout.deskPoint);
    return [{ id: 'desk-top', kind, xMin: top.x - DESK_TOP_HALF_WIDTH, xMax: top.x + DESK_TOP_HALF_WIDTH, yMin: top.y, yMax: top.y }];
  }
  return ROOM_SURFACES.filter((surface) => surface.kind === kind);
}

/** Default point of each old fixed slot, so placements made before free placement keep their spot. */
export const LEGACY_SLOT_POINTS: Record<string, ScenePoint> = {
  'wall-left': { x: 13, y: 15 },
  'wall-right': { x: 80, y: 13 },
  'board-1': { x: 75, y: 30 },
  'board-2': { x: 80, y: 30 },
  'board-3': { x: 85, y: 30 },
  shelf: { x: 17, y: 43 },
  'window-sill': { x: 45, y: 52 },
  'desk-top': { x: 62, y: getDeskTopPoint(DEFAULT_DESK_POINT).y },
  'floor-left': { x: 37, y: 76 },
  'floor-center': { x: 57, y: 85 },
  'floor-right': { x: 80, y: 90 },
};

/** Where the mission objects and the desk stand until they are moved (the phone lies on the desk). */
function getDefaultObjectPoint(objectId: string, layout: RoomLayoutContext): ScenePoint {
  const top = getDeskTopPoint(layout.deskPoint);
  const points: Record<string, ScenePoint> = {
    bed: { x: 17, y: 82 },
    wardrobe: { x: 85, y: 80 },
    'games-book': { x: 40, y: 91 },
    phone: { x: top.x + 4, y: top.y },
    [DESK_OBJECT_ID]: DEFAULT_DESK_POINT,
  };
  return points[objectId] ?? { x: 50, y: 85 };
}

const OBJECT_KINDS: Record<string, RoomSlotKind> = {
  bed: 'floor',
  wardrobe: 'floor',
  'games-book': 'floor',
  phone: 'desk',
  [DESK_OBJECT_ID]: 'floor',
};

const OBJECT_ITEMS: RoomItem[] = [
  ...ROOM_OBJECTS.map((object) => ({
    id: object.id,
    emoji: object.emoji,
    nameEn: object.nameEn,
    nameHe: object.nameHe,
    slotKind: OBJECT_KINDS[object.id],
  })),
  { id: DESK_OBJECT_ID, emoji: '', nameEn: 'desk', nameHe: 'שולחן', slotKind: 'floor', imageUrl: '/art/room/desk.webp' },
];

/** How close (scene %, vertically) two items of a kind may stand; horizontally it follows their widths. */
const ITEM_GAPS_Y: Record<RoomSlotKind, number> = { wall: 7, board: 6, shelf: 3, desk: 3, floor: 4 };
const GAP_FACTOR = 0.45;
const FREE_SPOT_STEP = 1.5;
const FLOOR_EDGE_MARGIN = 3;

/** An item already standing on a surface: where, and how wide it is. */
export interface Occupant {
  point: ScenePoint;
  width: number;
}

export interface PlacementOptions {
  layout?: RoomLayoutContext;
  /** Width of the item being placed (keeps big furniture inside the room and apart from the rest) */
  width?: number;
}

function clampToSurface(surface: RoomSurface, point: ScenePoint, width: number): ScenePoint {
  const inset = surface.kind === 'floor' ? Math.min(width / 2 + FLOOR_EDGE_MARGIN, (surface.xMax - surface.xMin) / 2) : 0;
  return {
    x: Math.min(surface.xMax - inset, Math.max(surface.xMin + inset, point.x)),
    y: Math.min(surface.yMax, Math.max(surface.yMin, point.y)),
  };
}

function distance(a: ScenePoint, b: ScenePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** The nearest point on any surface of `kind`, and which surface it is on. */
export function snapToSurface(
  kind: RoomSlotKind,
  point: ScenePoint,
  options: PlacementOptions = {}
): { surface: RoomSurface; point: ScenePoint } {
  const candidates = getSurfaces(kind, options.layout).map((surface) => {
    const snapped = clampToSurface(surface, point, options.width ?? 0);
    return { surface, point: snapped, gap: distance(snapped, point) };
  });
  const [nearest] = candidates.sort((a, b) => a.gap - b.gap);
  return { surface: nearest.surface, point: nearest.point };
}

function isTaken(kind: RoomSlotKind, point: ScenePoint, width: number, others: Occupant[]): boolean {
  return others.some(
    (other) =>
      Math.abs(other.point.x - point.x) < ((width + other.width) * GAP_FACTOR) &&
      Math.abs(other.point.y - point.y) < ITEM_GAPS_Y[kind]
  );
}

/** Every grid point of the surfaces of `kind`, in steps of FREE_SPOT_STEP. */
function gridPoints(kind: RoomSlotKind, options: PlacementOptions): ScenePoint[] {
  return getSurfaces(kind, options.layout).flatMap((surface) => {
    const points: ScenePoint[] = [];
    for (let y = surface.yMin; y <= surface.yMax; y += FREE_SPOT_STEP) {
      for (let x = surface.xMin; x <= surface.xMax; x += FREE_SPOT_STEP) {
        points.push(clampToSurface(surface, { x, y }, options.width ?? 0));
      }
    }
    return points;
  });
}

/**
 * Where a dropped item ends up: the nearest surface point, moved to the closest free spot when
 * other items are in the way. With no free spot at all the item stays where it was dropped.
 */
export function findFreePoint(
  kind: RoomSlotKind,
  point: ScenePoint,
  others: Occupant[],
  options: PlacementOptions = {}
): ScenePoint {
  const width = options.width ?? KIND_WIDTHS[kind];
  const { point: snapped } = snapToSurface(kind, point, options);
  if (!isTaken(kind, snapped, width, others)) return snapped;
  const free = gridPoints(kind, options)
    .filter((candidate) => !isTaken(kind, candidate, width, others))
    .sort((a, b) => distance(a, snapped) - distance(b, snapped));
  return free[0] ?? snapped;
}

/** One keyboard step from `point`, kept on the surfaces of `kind`. */
export function stepPoint(
  kind: RoomSlotKind,
  point: ScenePoint,
  dx: number,
  dy: number,
  options: PlacementOptions = {}
): ScenePoint {
  return snapToSurface(kind, { x: point.x + dx, y: point.y + dy }, options).point;
}

/** Moves to the next (`direction` 1) or previous (-1) surface of the kind, keeping x as far as it fits. */
export function cycleSurface(
  kind: RoomSlotKind,
  point: ScenePoint,
  direction: 1 | -1,
  options: PlacementOptions = {}
): ScenePoint {
  const surfaces = [...getSurfaces(kind, options.layout)].sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
  const current = surfaces.findIndex((surface) => surface.id === snapToSurface(kind, point, options).surface.id);
  const target = surfaces[(current + direction + surfaces.length) % surfaces.length];
  return clampToSurface(target, point, options.width ?? 0);
}

export interface PlacedRoomEntry {
  /** The key in `room.placements` (slot id or item id), or `object:<id>` for the mission objects and the desk */
  key: string;
  item: RoomItem;
  point: ScenePoint;
  /** Width in container-width units, before the depth scale */
  width: number;
}

export function isObjectKey(key: string): boolean {
  return key.startsWith(OBJECT_KEY_PREFIX);
}

export function getObjectIdFromKey(key: string): string {
  return key.slice(OBJECT_KEY_PREFIX.length);
}

/** The desk the learner moved to (or the default), which the desk-top surface follows. */
export function getRoomLayout(profile: LearnerProfile): RoomLayoutContext {
  const saved = getRoom(profile).positions?.[`${OBJECT_KEY_PREFIX}${DESK_OBJECT_ID}`];
  return { deskPoint: saved ?? DEFAULT_DESK_POINT };
}

/** Every thing in the room that can be moved: placed items, the mission objects and the desk. */
export function getPlacedRoomEntries(profile: LearnerProfile): PlacedRoomEntry[] {
  const room = getRoom(profile);
  const layout = getRoomLayout(profile);
  const items = Object.entries(room.placements).flatMap(([key, itemId]) => {
    const item = getRoomItemFor(profile, itemId);
    const point = room.positions?.[key] ?? LEGACY_SLOT_POINTS[key];
    return item && point ? [{ key, item, point, width: getItemWidth(item) }] : [];
  });
  const objects = OBJECT_ITEMS.map((item) => {
    const key = `${OBJECT_KEY_PREFIX}${item.id}`;
    return {
      key,
      item,
      point: room.positions?.[key] ?? getDefaultObjectPoint(item.id, layout),
      width: getItemWidth({ id: key, slotKind: item.slotKind }),
    };
  });
  return [...items, ...objects];
}

function occupantsOf(entries: PlacedRoomEntry[], kind: RoomSlotKind, exceptKey: string): Occupant[] {
  return entries
    .filter((entry) => entry.key !== exceptKey && entry.item.slotKind === kind)
    .map((entry) => ({ point: entry.point, width: entry.width }));
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
  const placedKeys = Object.entries(room.placements)
    .filter(([, placedId]) => placedId === itemId)
    .map(([key]) => key);
  const others = occupantsOf(getPlacedRoomEntries(profile), item.slotKind, placedKeys[0] ?? itemId);
  const placements = Object.fromEntries(
    Object.entries(room.placements).filter(([, placedId]) => placedId !== itemId)
  );
  const positions = Object.fromEntries(
    Object.entries(room.positions ?? {}).filter(([key]) => key in placements || isObjectKey(key))
  );
  const options = { layout: getRoomLayout(profile), width: getItemWidth(item) };
  return {
    ...profile,
    room: {
      ...room,
      placements: { ...placements, [itemId]: itemId },
      positions: { ...positions, [itemId]: findFreePoint(item.slotKind, point, others, options) },
      updatedAt: now.toISOString(),
    },
  };
}

/** Moves a mission object or the desk. Moving the desk carries what lies on it. */
export function moveRoomObject(
  profile: LearnerProfile,
  objectId: string,
  point: ScenePoint,
  now: Date
): LearnerProfile {
  const kind = OBJECT_KINDS[objectId];
  if (!kind) return profile;
  const key = `${OBJECT_KEY_PREFIX}${objectId}`;
  const entries = getPlacedRoomEntries(profile);
  const current = entries.find((entry) => entry.key === key);
  if (!current) return profile;

  const width = getItemWidth({ id: key, slotKind: kind });
  const target = findFreePoint(kind, point, occupantsOf(entries, kind, key), {
    layout: getRoomLayout(profile),
    width,
  });
  const room = getRoom(profile);
  const carried =
    objectId === DESK_OBJECT_ID
      ? Object.fromEntries(
          entries
            .filter((entry) => entry.item.slotKind === 'desk')
            .map((entry) => [entry.key, { x: entry.point.x + target.x - current.point.x, y: entry.point.y + target.y - current.point.y }])
        )
      : {};
  return {
    ...profile,
    room: {
      ...room,
      positions: { ...room.positions, ...carried, [key]: target },
      updatedAt: now.toISOString(),
    },
  };
}

/** Moves whatever the entry is: a placed item or a mission object. */
export function moveRoomEntry(
  profile: LearnerProfile,
  key: string,
  point: ScenePoint,
  now: Date
): LearnerProfile {
  if (isObjectKey(key)) return moveRoomObject(profile, getObjectIdFromKey(key), point, now);
  const itemId = getRoom(profile).placements[key];
  return itemId ? placeRoomItemAt(profile, itemId, point, now) : profile;
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
