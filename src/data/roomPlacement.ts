import { LearnerProfile } from '../types/learner';
import { DeskShape, LEGACY_DESK_SHAPE, getDeskShape } from './roomArt';
import { LEGACY_GEOMETRY, RoomGeometry, floorEdgeY, getFixedSurfaces, getRoomGeometry } from './roomGeometry';
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
  /** Floor only: the smallest feet y at `x` (the baseboard line, which is not level in a corner room) */
  minYAt?: (x: number) => number;
}

/** What the room looks like: where its desk is (its top is a surface for small items) and its theme's geometry. */
export interface RoomLayoutContext {
  deskPoint: ScenePoint;
  geometry: RoomGeometry;
  /** What the theme's desk picture looks like, which puts the desk top at the right height */
  deskShape: DeskShape;
}

export const SCENE_ASPECT = 4 / 3;
/** The scene's pictures are 4:3, so a height in container-width units is this many % of the height. */
const CQW_TO_HEIGHT_PERCENT = SCENE_ASPECT;

export const OBJECT_KEY_PREFIX = 'object:';
export const DESK_OBJECT_ID = 'desk';

/** Fixed surfaces of the original room (the desk top depends on the desk, see getSurfaces). */
export const ROOM_SURFACES: RoomSurface[] = getFixedSurfaces(LEGACY_GEOMETRY);

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
  'object:bed': 24,
  'object:wardrobe': 18,
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

const DESK_TOP_HALF_WIDTH = 9;
export const DEFAULT_DESK_POINT: ScenePoint = LEGACY_GEOMETRY.defaults.desk;

const FLOOR_SCALE_FAR = 0.85;
const FLOOR_SCALE_NEAR = 1.1;

/** Floor items are drawn a little smaller further back (higher up) in the room. */
export function getDepthScale(kind: RoomSlotKind, y: number, geometry: RoomGeometry = LEGACY_GEOMETRY): number {
  if (kind !== 'floor') return 1;
  const depth = (y - geometry.floorMinY) / (geometry.floorMaxY - geometry.floorMinY);
  return FLOOR_SCALE_FAR + (FLOOR_SCALE_NEAR - FLOOR_SCALE_FAR) * Math.min(1, Math.max(0, depth));
}

/** Scene point of the middle of the desk top, for a desk standing with its feet at `desk`. */
export function getDeskTopPoint(
  desk: ScenePoint,
  geometry: RoomGeometry = LEGACY_GEOMETRY,
  shape: DeskShape = LEGACY_DESK_SHAPE
): ScenePoint {
  const width = getItemWidth({ id: 'object:desk', slotKind: 'floor' }) * getDepthScale('floor', desk.y, geometry);
  const heightPercent = width * shape.heightOverWidth * CQW_TO_HEIGHT_PERCENT;
  return { x: desk.x, y: desk.y - heightPercent * shape.topAboveFeet };
}

export const DEFAULT_LAYOUT: RoomLayoutContext = {
  deskPoint: DEFAULT_DESK_POINT,
  geometry: LEGACY_GEOMETRY,
  deskShape: LEGACY_DESK_SHAPE,
};

export function getSurfaces(kind: RoomSlotKind, layout: RoomLayoutContext = DEFAULT_LAYOUT): RoomSurface[] {
  if (kind === 'desk') {
    const top = getDeskTopPoint(layout.deskPoint, layout.geometry, layout.deskShape);
    return [{ id: 'desk-top', kind, xMin: top.x - DESK_TOP_HALF_WIDTH, xMax: top.x + DESK_TOP_HALF_WIDTH, yMin: top.y, yMax: top.y }];
  }
  return fixedSurfacesOf(layout.geometry).filter((surface) => surface.kind === kind);
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
  const { defaults } = layout.geometry;
  const top = getDeskTopPoint(layout.deskPoint, layout.geometry, layout.deskShape);
  const points: Record<string, ScenePoint> = {
    bed: defaults.bed,
    wardrobe: defaults.wardrobe,
    'games-book': defaults.gamesBook,
    phone: { x: top.x + 4, y: top.y },
    [DESK_OBJECT_ID]: defaults.desk,
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
  return (
    point.x >= surface.xMin - ON_SURFACE_TOLERANCE &&
    point.x <= surface.xMax + ON_SURFACE_TOLERANCE &&
    point.y >= surface.yMin - ON_SURFACE_TOLERANCE &&
    point.y <= surface.yMax + ON_SURFACE_TOLERANCE
  );
}

/** The kind of surface an object stands on at `point`: an object that has extra kinds follows its position. */
function getObjectKindAt(objectId: string, point: ScenePoint, layout: RoomLayoutContext): RoomSlotKind {
  const [own, ...extras] = getObjectMoveKinds(objectId);
  const extra = extras.find((kind) => getSurfaces(kind, layout).some((surface) => isOnSurface(surface, point)));
  return extra ?? own;
}

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
  const x = Math.min(surface.xMax - inset, Math.max(surface.xMin + inset, point.x));
  const yMin = Math.max(surface.yMin, surface.minYAt?.(x) ?? surface.yMin);
  return { x, y: Math.min(surface.yMax, Math.max(yMin, point.y)) };
}

function distance(a: ScenePoint, b: ScenePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** One kind of surface, or several (an item that may stand on more than one, like the games book). */
export type KindSpec = RoomSlotKind | readonly RoomSlotKind[];

function surfacesOf(kinds: KindSpec, layout?: RoomLayoutContext): RoomSurface[] {
  const list: readonly RoomSlotKind[] = typeof kinds === 'string' ? [kinds] : kinds;
  return list.flatMap((kind) => getSurfaces(kind, layout));
}

/** The nearest point on any surface of `kind`, and which surface it is on. */
export function snapToSurface(
  kind: KindSpec,
  point: ScenePoint,
  options: PlacementOptions = {}
): { surface: RoomSurface; point: ScenePoint } {
  const candidates = surfacesOf(kind, options.layout).map((surface) => {
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
  kind: KindSpec,
  point: ScenePoint,
  dx: number,
  dy: number,
  options: PlacementOptions = {}
): ScenePoint {
  return snapToSurface(kind, { x: point.x + dx, y: point.y + dy }, options).point;
}

/** Moves to the next (`direction` 1) or previous (-1) surface of the kind, keeping x as far as it fits. */
export function cycleSurface(
  kind: KindSpec,
  point: ScenePoint,
  direction: 1 | -1,
  options: PlacementOptions = {}
): ScenePoint {
  const surfaces = surfacesOf(kind, options.layout).sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
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
  /** Stands against the left wall (left of the corner): a big item then shows its left-wall picture */
  isOnLeftWall: boolean;
  /** Has a front and a side, and stands against a wall: it can be turned to the other wall */
  canRotate: boolean;
}

/** Furniture that can be turned to face the other wall: room items by id, mission objects as `object:<id>`. */
const ROTATABLE_KEYS = new Set(['room-sofa', 'room-chair', 'object:bed', 'object:wardrobe', 'object:desk']);

export function isObjectKey(key: string): boolean {
  return key.startsWith(OBJECT_KEY_PREFIX);
}

export function getObjectIdFromKey(key: string): string {
  return key.slice(OBJECT_KEY_PREFIX.length);
}

/**
 * A saved point put back inside the room of the theme the learner has now (another theme, or a new
 * room picture, can leave it outside). The original room keeps points exactly as saved.
 */
function settle(kinds: KindSpec, point: ScenePoint, layout: RoomLayoutContext, width: number): ScenePoint {
  return layout.geometry.isLegacy ? point : snapToSurface(kinds, point, { layout, width }).point;
}

/** The theme's room and the desk the learner moved to (or the default), which the desk-top surface follows. */
export function getRoomLayout(profile: LearnerProfile): RoomLayoutContext {
  const geometry = getRoomGeometry(profile.themeId);
  const saved = getRoom(profile).positions?.[`${OBJECT_KEY_PREFIX}${DESK_OBJECT_ID}`];
  const deskShape = getDeskShape(profile.themeId);
  const roomOnly: RoomLayoutContext = { deskPoint: geometry.defaults.desk, geometry, deskShape };
  const deskWidth = getItemWidth({ id: `${OBJECT_KEY_PREFIX}${DESK_OBJECT_ID}`, slotKind: 'floor' });
  return { ...roomOnly, deskPoint: saved ? settle('floor', saved, roomOnly, deskWidth) : geometry.defaults.desk };
}

/** Every thing in the room that can be moved: placed items, the mission objects and the desk. */
export function getPlacedRoomEntries(profile: LearnerProfile): PlacedRoomEntry[] {
  const room = getRoom(profile);
  const layout = getRoomLayout(profile);
  const { cornerX } = layout.geometry;
  const items = Object.entries(room.placements).flatMap(([key, itemId]) => {
    const item = getRoomItemFor(profile, itemId);
    const saved = room.positions?.[key] ?? LEGACY_SLOT_POINTS[key];
    if (!item || !saved) return [];
    const width = getItemWidth(item);
    const canRotate = ROTATABLE_KEYS.has(itemId);
    const point = settle(item.slotKind, saved, layout, width);
    return [{ key, item, point, width, isOnLeftWall: canRotate && point.x < cornerX, canRotate }];
  });
  const objects = OBJECT_ITEMS.map((base) => {
    const key = `${OBJECT_KEY_PREFIX}${base.id}`;
    const saved = base.id === DESK_OBJECT_ID ? layout.deskPoint : room.positions?.[key] ?? getDefaultObjectPoint(base.id, layout);
    const point = settle(getObjectMoveKinds(base.id), saved, layout, getItemWidth({ id: key, slotKind: base.slotKind }));
    const slotKind = getObjectKindAt(base.id, point, layout);
    const item = slotKind === base.slotKind ? base : { ...base, slotKind };
    const canRotate = ROTATABLE_KEYS.has(key);
    return { key, item, point, width: getItemWidth({ id: key, slotKind }), isOnLeftWall: canRotate && point.x < cornerX, canRotate };
  });
  return [...items, ...objects];
}

/**
 * Where an item against one wall stands against the other: the same distance along the wall, the same
 * distance from the baseboard. The walls meet at the corner, so the point is mirrored across it.
 */
export function getOtherWallPoint(point: ScenePoint, geometry: RoomGeometry): ScenePoint {
  if (geometry.isLegacy) return { x: 100 - point.x, y: point.y };
  const { cornerX } = geometry;
  const isOnRightWall = point.x >= cornerX;
  const along = isOnRightWall ? (point.x - cornerX) / (100 - cornerX) : (cornerX - point.x) / cornerX;
  const x = isOnRightWall ? cornerX - along * cornerX : cornerX + along * (100 - cornerX);
  return { x, y: floorEdgeY(geometry, x) + (point.y - floorEdgeY(geometry, point.x)) };
}

/**
 * Turns a big item (sofa, chair, bed, wardrobe, desk) to the other wall: it moves to the matching spot
 * against that wall and shows the picture for that wall. An item that is not turned to a wall would
 * float away from it, so the picture always follows the wall it stands against (see isOnLeftWall).
 */
export function turnRoomItem(profile: LearnerProfile, key: string, now: Date): LearnerProfile {
  const entry = getPlacedRoomEntries(profile).find((candidate) => candidate.key === key);
  if (!entry?.canRotate) return profile;
  return moveRoomEntry(profile, key, getOtherWallPoint(entry.point, getRoomLayout(profile).geometry), now);
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
  const kinds = getObjectMoveKinds(objectId);
  if (kinds.length === 0) return profile;
  const key = `${OBJECT_KEY_PREFIX}${objectId}`;
  const entries = getPlacedRoomEntries(profile);
  const current = entries.find((entry) => entry.key === key);
  if (!current) return profile;

  // An object with several kinds ends up on whichever of its surfaces the drop is nearest to
  const layout = getRoomLayout(profile);
  const [target] = kinds
    .map((kind) =>
      findFreePoint(kind, point, occupantsOf(entries, kind, key), {
        layout,
        width: getItemWidth({ id: key, slotKind: kind }),
      })
    )
    .sort((a, b) => distance(a, point) - distance(b, point));
  const room = getRoom(profile);
  // What lies on the desk stays on its top, which moves a little less than the desk's feet (depth scale)
  const topShiftY = getDeskTopPoint(target, layout.geometry, layout.deskShape).y -
    getDeskTopPoint(current.point, layout.geometry, layout.deskShape).y;
  const carried =
    objectId === DESK_OBJECT_ID
      ? Object.fromEntries(
          entries
            .filter((entry) => entry.item.slotKind === 'desk')
            .map((entry) => [entry.key, { x: entry.point.x + target.x - current.point.x, y: entry.point.y + topShiftY }])
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
