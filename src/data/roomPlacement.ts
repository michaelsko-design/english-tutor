import { LearnerProfile } from '../types/learner';
import { Box, FixedFurniture, RoomGeometry, getFixedSurfaces, getRoomGeometry } from './roomGeometry';
import { clampToConvexPolygon, shrinkPolygon } from './scenePolygon';
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
 * walls, at any point of a surface. The bed, wardrobe and desk are drawn into the room picture and
 * stay put; the sofa, chair and the mission objects (phone, games book) are placed like any item.
 * Pure; the scene and the drag handling live in components/room/. Old slot-based placements keep working: a
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
  /** Floor only: the smallest feet y at `x` for an item `width` wide (in front of the drawn furniture) */
  minYAt?: (x: number, width?: number) => number;
  /**
   * A line (a shelf plank) that runs along a sloping wall: scene % down per % to the right. `yMin`
   * (= `yMax`) is its height in the middle.
   */
  tilt?: number;
  /** Desk top only: the drawn desk; whatever is let go over it lands on the top, not on the floor behind */
  catchArea?: Box;
  /** Desk top only: the corners of the drawn top, to outline it as a drop zone */
  outline?: ScenePoint[];
  /** Desk top only: where on the top an item's feet can stand (the box above is its bounds) */
  area?: ScenePoint[];
}

/** What the room looks like: its theme's geometry. */
export interface RoomLayoutContext {
  geometry: RoomGeometry;
}

export const SCENE_ASPECT = 4 / 3;

export const OBJECT_KEY_PREFIX = 'object:';

const fixedSurfacesCache = new WeakMap<RoomGeometry, RoomSurface[]>();

function fixedSurfacesOf(geometry: RoomGeometry): RoomSurface[] {
  const cached = fixedSurfacesCache.get(geometry);
  if (cached) return cached;
  const surfaces = getFixedSurfaces(geometry);
  fixedSurfacesCache.set(geometry, surfaces);
  return surfaces;
}

/** Item width per id, in container-width units (the depth scale is applied on top). */
const ITEM_WIDTHS: Record<string, number> = {
  'object:games-book': 7,
  'object:phone': 5.5,
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

/** Small things on the desk stand within this share of its drawn top, so they do not hang over its edges. */
const DESK_AREA_SHARE = 0.7;
/** Let go this far (scene %) above or below the desk top and an item still lands on it. */
const DESK_CATCH_ABOVE = 4;
const DESK_CATCH_BELOW = 5;
/** A sticker standing on a drawn-in shelf: its centre this far (scene % of height) above the plank. */
const STICKER_ABOVE_SHELF = 3.5;

const FLOOR_SCALE_FAR = 0.85;
const FLOOR_SCALE_NEAR = 1.1;

/** Floor items are drawn a little smaller further back (higher up) in the room. */
export function getDepthScale(kind: RoomSlotKind, y: number, geometry: RoomGeometry): number {
  if (kind !== 'floor') return 1;
  const depth = (y - geometry.floorMinY) / (geometry.floorMaxY - geometry.floorMinY);
  return FLOOR_SCALE_FAR + (FLOOR_SCALE_NEAR - FLOOR_SCALE_FAR) * Math.min(1, Math.max(0, depth));
}

/** The desk drawn into the room picture: small things stand anywhere on its drawn top. */
function getDeskTop(deskTop: ScenePoint[]): RoomSurface {
  const area = shrinkPolygon(deskTop, DESK_AREA_SHARE);
  const xs = area.map((corner) => corner.x);
  const ys = area.map((corner) => corner.y);
  const topYs = deskTop.map((corner) => corner.y);
  const topXs = deskTop.map((corner) => corner.x);
  const catchArea = {
    xMin: Math.min(...topXs),
    xMax: Math.max(...topXs),
    yMin: Math.min(...topYs) - DESK_CATCH_ABOVE,
    yMax: Math.max(...topYs) + DESK_CATCH_BELOW,
  };
  return {
    id: 'desk-top',
    kind: 'desk',
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
    catchArea,
    outline: deskTop,
    area,
  };
}

export function getSurfaces(kind: RoomSlotKind, layout: RoomLayoutContext): RoomSurface[] {
  if (kind === 'desk') return [getDeskTop(layout.geometry.baked.deskTop)];
  if (kind === 'board') return getStickerSurfaces(layout.geometry);
  return fixedSurfacesOf(layout.geometry).filter((surface) => surface.kind === kind);
}

/** The room has no sticker board: stickers go on the free walls and stand on the shelves (same ids, so the same Hebrew names). */
function getStickerSurfaces(geometry: RoomGeometry): RoomSurface[] {
  const walls = fixedSurfacesOf(geometry)
    .filter((surface) => surface.kind === 'wall')
    .map((surface) => ({ ...surface, kind: 'board' as const }));
  const shelves = geometry.shelves
    .filter((shelf) => shelf.id !== 'window-sill')
    .map((shelf) => {
      const y = shelf.y - STICKER_ABOVE_SHELF;
      return { id: shelf.id, kind: 'board' as const, xMin: shelf.xMin, xMax: shelf.xMax, yMin: y, yMax: y, tilt: shelf.tilt ?? 0 };
    });
  return [...walls, ...shelves];
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
  // the middle of the first desk's top
  'desk-top': { x: 62, y: 66 },
  'floor-left': { x: 37, y: 76 },
  'floor-center': { x: 57, y: 85 },
  'floor-right': { x: 80, y: 90 },
};

/** Where the mission objects stand until they are moved (the phone lies on the desk). */
function getDefaultObjectPoint(objectId: string, layout: RoomLayoutContext): ScenePoint {
  const { gamesBookHome, baked } = layout.geometry;
  const top = getPolygonMiddle(baked.deskTop);
  const points: Record<string, ScenePoint> = {
    'games-book': gamesBookHome,
    phone: { x: top.x + 4, y: top.y },
  };
  return points[objectId] ?? { x: 50, y: 85 };
}

/** The mission objects that can be moved (the bed and wardrobe are drawn into the room picture). */
const OBJECT_KINDS: Record<string, RoomSlotKind> = {
  'games-book': 'floor',
  phone: 'desk',
};

/** Surfaces an object may also stand on besides its own kind: the games book can lie on the desk. */
const OBJECT_EXTRA_KINDS: Record<string, RoomSlotKind[]> = { 'games-book': ['desk'] };

/** Every kind of surface a mission object can be put on (its own first). */
export function getObjectMoveKinds(objectId: string): RoomSlotKind[] {
  const own = OBJECT_KINDS[objectId];
  return own ? [own, ...(OBJECT_EXTRA_KINDS[objectId] ?? [])] : [];
}

/** The kinds the entry can be moved between: placed items have one, some mission objects two. */
export function getEntryMoveKinds(key: string, item: Pick<RoomItem, 'slotKind'>): RoomSlotKind[] {
  const kinds = isObjectKey(key) ? getObjectMoveKinds(getObjectIdFromKey(key)) : [];
  return kinds.length > 0 ? kinds : [item.slotKind];
}

const ON_SURFACE_TOLERANCE = 0.75;

function isOnSurface(surface: RoomSurface, point: ScenePoint): boolean {
  return distance(point, clampToSurface(surface, point, {})) <= ON_SURFACE_TOLERANCE;
}

/** The kind of surface an object stands on at `point`: an object that has extra kinds follows its position. */
function getObjectKindAt(objectId: string, point: ScenePoint, layout: RoomLayoutContext): RoomSlotKind {
  const [own, ...extras] = getObjectMoveKinds(objectId);
  const extra = extras.find((kind) => getSurfaces(kind, layout).some((surface) => isOnSurface(surface, point)));
  return extra ?? own;
}

const OBJECT_ITEMS: RoomItem[] = ROOM_OBJECTS.filter((object) => object.id in OBJECT_KINDS).map((object) => ({
  id: object.id,
  emoji: object.emoji,
  nameEn: object.nameEn,
  nameHe: object.nameHe,
  slotKind: OBJECT_KINDS[object.id],
}));

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
  layout: RoomLayoutContext;
  /** Width of the item being placed (keeps it inside the room, clear of the drawn furniture and apart from the rest) */
  width?: number;
}

function clampToSurface(surface: RoomSurface, point: ScenePoint, options: { width?: number }): ScenePoint {
  if (surface.area) return clampToConvexPolygon(surface.area, point);
  const width = options.width ?? 0;
  // Things stand fully on the floor and on a shelf plank, not half off its end
  const edge = surface.kind === 'floor' ? width / 2 + FLOOR_EDGE_MARGIN : surface.tilt !== undefined ? width / 2 : 0;
  const inset = Math.min(edge, (surface.xMax - surface.xMin) / 2);
  const x = Math.min(surface.xMax - inset, Math.max(surface.xMin + inset, point.x));
  if (surface.tilt) return { x, y: surface.yMin + (x - (surface.xMin + surface.xMax) / 2) * surface.tilt };
  // The whole width of the item stands clear of the drawn furniture
  const yMin = Math.max(surface.yMin, surface.minYAt?.(x, width) ?? surface.yMin);
  return { x, y: Math.min(surface.yMax, Math.max(yMin, point.y)) };
}

function distance(a: ScenePoint, b: ScenePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** One kind of surface, or several (an item that may stand on more than one, like the games book). */
export type KindSpec = RoomSlotKind | readonly RoomSlotKind[];

function surfacesOf(kinds: KindSpec, layout: RoomLayoutContext): RoomSurface[] {
  const list: readonly RoomSlotKind[] = typeof kinds === 'string' ? [kinds] : kinds;
  return list.flatMap((kind) => getSurfaces(kind, layout));
}

function isInBox(box: Box, point: ScenePoint): boolean {
  return point.x >= box.xMin && point.x <= box.xMax && point.y >= box.yMin && point.y <= box.yMax;
}

/** The nearest point on any surface of `kind`, and which surface it is on (a surface that catches the point wins). */
export function snapToSurface(
  kind: KindSpec,
  point: ScenePoint,
  options: PlacementOptions
): { surface: RoomSurface; point: ScenePoint } {
  const candidates = surfacesOf(kind, options.layout).map((surface) => {
    const snapped = clampToSurface(surface, point, options);
    const isCaught = surface.catchArea !== undefined && isInBox(surface.catchArea, point);
    return { surface, point: snapped, gap: isCaught ? -1 : distance(snapped, point) };
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
        points.push(clampToSurface(surface, { x, y }, options));
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
  options: PlacementOptions
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
  kind: KindSpec,
  point: ScenePoint,
  dx: number,
  dy: number,
  options: PlacementOptions
): ScenePoint {
  return snapToSurface(kind, { x: point.x + dx, y: point.y + dy }, options).point;
}

/** Moves to the next (`direction` 1) or previous (-1) surface of the kind, keeping x as far as it fits. */
export function cycleSurface(
  kind: KindSpec,
  point: ScenePoint,
  direction: 1 | -1,
  options: PlacementOptions
): ScenePoint {
  const surfaces = surfacesOf(kind, options.layout).sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
  const current = surfaces.findIndex((surface) => surface.id === snapToSurface(kind, point, options).surface.id);
  const target = surfaces[(current + direction + surfaces.length) % surfaces.length];
  return clampToSurface(target, point, options);
}

export interface PlacedRoomEntry {
  /** The key in `room.placements` (slot id or item id), or `object:<id>` for the mission objects and the desk */
  key: string;
  item: RoomItem;
  point: ScenePoint;
  /** Width in container-width units, before the depth scale */
  width: number;
}

/** The bed, wardrobe and desk drawn into the room picture. */
export function getFixedFurniture(geometry: RoomGeometry): FixedFurniture[] {
  return geometry.baked.pieces;
}

function getPolygonMiddle(corners: ScenePoint[]): ScenePoint {
  return {
    x: corners.reduce((sum, corner) => sum + corner.x, 0) / corners.length,
    y: corners.reduce((sum, corner) => sum + corner.y, 0) / corners.length,
  };
}

export function isObjectKey(key: string): boolean {
  return key.startsWith(OBJECT_KEY_PREFIX);
}

export function getObjectIdFromKey(key: string): string {
  return key.slice(OBJECT_KEY_PREFIX.length);
}

/**
 * A saved point put back inside the room of the theme the learner has now (another theme, or a new
 * room picture, can leave it outside).
 */
function settle(kinds: KindSpec, point: ScenePoint, options: PlacementOptions): ScenePoint {
  return snapToSurface(kinds, point, options).point;
}

/** The room of the learner's theme. */
export function getRoomLayout(profile: LearnerProfile): RoomLayoutContext {
  return { geometry: getRoomGeometry(profile.themeId) };
}

/** Every thing in the room that can be moved: placed items and the mission objects. */
export function getPlacedRoomEntries(profile: LearnerProfile): PlacedRoomEntry[] {
  const room = getRoom(profile);
  const layout = getRoomLayout(profile);
  const items = Object.entries(room.placements).flatMap(([key, itemId]) => {
    const item = getRoomItemFor(profile, itemId);
    const saved = room.positions?.[key] ?? LEGACY_SLOT_POINTS[key];
    if (!item || !saved) return [];
    const width = getItemWidth(item);
    const point = settle(item.slotKind, saved, { layout, width });
    return [{ key, item, point, width }];
  });
  const objects = OBJECT_ITEMS.map((base) => {
    const key = `${OBJECT_KEY_PREFIX}${base.id}`;
    const saved = room.positions?.[key] ?? getDefaultObjectPoint(base.id, layout);
    const point = settle(getObjectMoveKinds(base.id), saved, { layout, width: getItemWidth({ id: key, slotKind: base.slotKind }) });
    const slotKind = getObjectKindAt(base.id, point, layout);
    const item = slotKind === base.slotKind ? base : { ...base, slotKind };
    return { key, item, point, width: getItemWidth({ id: key, slotKind }) };
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

  const placedKeys = Object.entries(getRoom(profile).placements)
    .filter(([, placedId]) => placedId === itemId)
    .map(([key]) => key);
  const entries = getPlacedRoomEntries(profile);
  const layout = getRoomLayout(profile);
  const room = getRoom(profile);
  const others = occupantsOf(entries, item.slotKind, placedKeys[0] ?? itemId);
  const placements = Object.fromEntries(
    Object.entries(room.placements).filter(([, placedId]) => placedId !== itemId)
  );
  const positions = Object.fromEntries(
    Object.entries(room.positions ?? {}).filter(([key]) => key in placements || isObjectKey(key))
  );
  const options = { layout, width: getItemWidth(item) };
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

/** Moves a mission object (the phone or the games book). */
export function moveRoomObject(
  profile: LearnerProfile,
  objectId: string,
  point: ScenePoint,
  now: Date
): LearnerProfile {
  const kinds = getObjectMoveKinds(objectId);
  if (kinds.length === 0) return profile;
  const key = `${OBJECT_KEY_PREFIX}${objectId}`;
  const entries = getPlacedRoomEntries(profile);
  const current = entries.find((entry) => entry.key === key);
  if (!current) return profile;

  const layout = getRoomLayout(profile);
  const room = getRoom(profile);
  const optionsFor = (kind: RoomSlotKind) => ({ layout, width: getItemWidth({ id: key, slotKind: kind }) });
  // An object with several kinds ends up on the surface the drop snaps to (over the desk: its top)
  const { kind } = snapToSurface(kinds, point, optionsFor(kinds[0])).surface;
  const target = findFreePoint(kind, point, occupantsOf(entries, kind, key), optionsFor(kind));
  return {
    ...profile,
    room: {
      ...room,
      positions: { ...room.positions, [key]: target },
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
