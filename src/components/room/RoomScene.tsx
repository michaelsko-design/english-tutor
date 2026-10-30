import React, { useEffect, useMemo, useRef } from 'react';
import { RoomSlotKind } from '../../data/room';
import { RoomSprite, getArtId, getDeskShape, getRoomSprite } from '../../data/roomArt';
import {
  FLOOR_EDGE_CLEARANCE,
  FixedFurniture,
  FixedFurnitureId,
  getRoomGeometry,
  getWallSlope,
} from '../../data/roomGeometry';
import {
  DESK_OBJECT_ID,
  OBJECT_KEY_PREFIX,
  PlacedRoomEntry,
  RoomSurface,
  getDepthScale,
  getEntryMoveKinds,
  getFixedFurniture,
  getSurfaces,
} from '../../data/roomPlacement';
import { WardrobeItem } from '../../data/wardrobe';
import { ThemeId } from '../../types/learner';
import { resolveTheme } from '../../themes/themeRegistry';
import { useArtStatus } from '../../hooks/useArtStatus';
import { DressedAvatar } from './DressedAvatar';
import { ItemIcon } from './ItemIcon';
import { IconBounds, ROOM_ICON_BOUNDS } from '../../data/roomIconBounds';
import { useRoomItemDrag } from './useRoomItemDrag';
import {
  SCENE_PALETTES,
  getFurniturePieces,
  STANDING_KINDS,
  SURFACE_LABELS_HE,
  ScenePoint,
} from './roomLayout';

export interface SceneBubble {
  at: ScenePoint;
  textEn: string;
  textHe: string;
}

interface RoomSceneProps {
  themeId: ThemeId;
  avatarEmoji: string;
  /** What the avatar wears (see getWornItems) */
  worn?: WardrobeItem[];
  /** Placed items with their points (see getPlacedRoomEntries) */
  entries: PlacedRoomEntry[];
  avatarPos: ScenePoint;
  isAvatarFacingLeft?: boolean;
  /** The kind of the item picked from the inventory: its surfaces show as drop zones */
  placingKind?: RoomSlotKind | null;
  bubble?: SceneBubble | null;
  /** The placement key of an item to start moving with the keyboard (the "move" button) */
  moveRequestKey?: string | null;
  /** Without handlers the scene is a picture (the dashboard card preview). */
  onPlaceAt?: (point: ScenePoint) => void;
  onTapEntry?: (key: string) => void;
  onMoveEntry?: (key: string, point: ScenePoint) => void;
  onMoveRequestHandled?: () => void;
  /** A tap on furniture drawn into the room picture (bed, wardrobe, desk) */
  onTapFixed?: (piece: FixedFurniture) => void;
}

/** Names of the furniture drawn into the room picture, for its tap buttons. */
const FIXED_FURNITURE_NAMES: Record<FixedFurnitureId, { en: string; he: string }> = {
  bed: { en: 'bed', he: 'מיטה' },
  wardrobe: { en: 'wardrobe', he: 'ארון' },
  desk: { en: 'desk', he: 'שולחן' },
};
/** The tap areas of drawn-in furniture lie over the room picture and under everything placed in the room. */
const FIXED_TAP_Z_INDEX = 5;

/** A picture drawn to its box edges (the desk), and the padding most icons are drawn with. */
const FULL_BOUNDS: IconBounds = { left: 0.04, right: 0.96, top: 0, bottom: 1 };
const DEFAULT_BOUNDS: IconBounds = { left: 0.074, right: 0.926, top: 0.074, bottom: 0.926 };
const SHADOW_WIDTH_OF_FOOTPRINT = 0.7;
const SHADOW_HEIGHT_OF_WIDTH = 0.13;

function getBounds(item: { emoji: string; imageUrl?: string }, isDesk: boolean): IconBounds {
  if (isDesk) return FULL_BOUNDS;
  return ROOM_ICON_BOUNDS[item.emoji.replace('️', '')] ?? DEFAULT_BOUNDS;
}

const CENTERED = 'absolute -translate-x-1/2 -translate-y-1/2';
/** Items of these kinds hang or stand on a wall: on the left wall their picture (drawn for the right wall) is mirrored. */
const LEFT_WALL_KINDS: RoomSlotKind[] = ['wall', 'shelf', 'board'];

/**
 * A themed picture placed so that the body of the object (not the whole picture, which also holds
 * its baked shadow) is `bodyWidth` wide and its feet (standing) or its middle (hanging) are at `point`.
 */
function spriteStyle(
  point: ScenePoint,
  bounds: { left: number; right: number; top: number; bottom: number },
  aspect: number,
  bodyWidth: number,
  isStanding: boolean,
  zIndex: number
): React.CSSProperties {
  const pictureWidth = bodyWidth / (bounds.right - bounds.left);
  const anchorX = (bounds.left + bounds.right) / 2;
  const anchorY = isStanding ? bounds.bottom : (bounds.top + bounds.bottom) / 2;
  return {
    ...at(point),
    width: `${pictureWidth}cqw`,
    zIndex,
    height: `${pictureWidth / aspect}cqw`,
    transform: `translate(-${anchorX * 100}%, -${anchorY * 100}%)`,
  };
}
const ZONE_TOP_PAD_CQW = 8;
/** A CSS vertical shear for a slope (pixels down per pixel to the right), or nothing for none. */
function shearTransform(shear = 0): string {
  return shear ? ` skewY(${Math.atan(shear)}rad)` : '';
}

/** A picture's shear and mirror, sheared about its anchor (the feet of what stands), so its feet stay put. */
function spriteTransform(sprite: RoomSprite, isStanding: boolean): React.CSSProperties {
  const { bounds } = sprite;
  const anchorY = isStanding ? bounds.bottom : (bounds.top + bounds.bottom) / 2;
  return {
    transform: `${shearTransform(sprite.shear)}${sprite.isMirrored ? ' scaleX(-1)' : ''}`.trim(),
    transformOrigin: `${((bounds.left + bounds.right) / 2) * 100}% ${anchorY * 100}%`,
  };
}

/** An item being moved is drawn over everything in the room (items are stacked by their feet y, up to 100). */
const MOVING_Z_INDEX = 200;
/** Drop zones on the floor lie under everything that stands there. */
const ZONE_Z_INDEX = 25;
/** The floor outline follows the baseboard in steps this wide (scene %), and reaches the picture's edges. */
const OUTLINE_STEP = 2;

/**
 * The outline of a corner room's floor, as scene points: along the baseboard (where an item's feet can
 * stand, less the clearance) and down to the bottom of the picture. Null for any other surface.
 */
function getFloorOutline(surface: RoomSurface): ScenePoint[] | null {
  const { minYAt } = surface;
  if (!minYAt) return null;
  const xs = Array.from({ length: Math.ceil(100 / OUTLINE_STEP) + 1 }, (_, i) => Math.min(100, i * OUTLINE_STEP));
  return [...xs.map((x) => ({ x, y: minYAt(x) - FLOOR_EDGE_CLEARANCE })), { x: 100, y: 100 }, { x: 0, y: 100 }];
}

function at(point: ScenePoint): React.CSSProperties {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

/** The drawn room: wall and floor picture, furniture, placed items, mission objects and the avatar. */
export const RoomScene: React.FC<RoomSceneProps> = ({
  themeId,
  avatarEmoji,
  worn = [],
  entries,
  avatarPos,
  isAvatarFacingLeft = false,
  placingKind = null,
  bubble,
  moveRequestKey = null,
  onPlaceAt,
  onTapEntry,
  onMoveEntry,
  onMoveRequestHandled,
  onTapFixed,
}) => {
  const palette = SCENE_PALETTES[themeId] || SCENE_PALETTES['cozy-studio'];
  const isInteractive = Boolean(onTapEntry);
  const geometry = getRoomGeometry(themeId);
  const roomBgSrc = geometry.baked?.roomPicture ?? resolveTheme(themeId).art.roomCorner;
  const hasRoomArt = useArtStatus(roomBgSrc) === 'loaded';
  const sceneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const furniture = getFurniturePieces(geometry, themeId);
  const deskShape = getDeskShape(themeId);
  const layout = useMemo(() => {
    const desk = entries.find((entry) => entry.key === `${OBJECT_KEY_PREFIX}${DESK_OBJECT_ID}`);
    return { deskPoint: desk?.point ?? geometry.defaults.desk, geometry, deskShape, isDeskOnLeftWall: desk?.isOnLeftWall, themeId };
  }, [entries, geometry, deskShape, themeId]);
  const { drag, handlers, startKeyboardMove, getAnnouncement } = useRoomItemDrag({
    sceneRef,
    layout,
    onMove: (key, point) => onMoveEntry?.(key, point),
    onTap: (key) => onTapEntry?.(key),
  });

  useEffect(() => {
    if (!moveRequestKey) return;
    const entry = entries.find((candidate) => candidate.key === moveRequestKey);
    if (entry) {
      itemRefs.current[entry.key]?.focus();
      startKeyboardMove(entry);
    }
    onMoveRequestHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveRequestKey]);

  // What lies on a movable desk stands on it, just above its feet; on a drawn-in desk it is stacked like the rest
  const deskItemZIndex = (point: ScenePoint) => (geometry.baked ? Math.round(point.y) : Math.round(layout.deskPoint.y) + 1);

  const dragged = drag ? entries.find((entry) => entry.key === drag.key) : undefined;
  const zoneKinds = placingKind ? [placingKind] : dragged ? getEntryMoveKinds(dragged.key, dragged.item) : [];
  const zoneSurfaces = zoneKinds.flatMap((kind) => getSurfaces(kind, layout));

  const handleZoneClick = (event: React.MouseEvent, surfaceId: string) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    const surface = zoneSurfaces.find((candidate) => candidate.id === surfaceId);
    if (!rect || !surface) return;
    const isPointer = event.detail > 0 && rect.width > 0 && rect.height > 0;
    onPlaceAt?.(
      isPointer
        ? { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }
        : { x: (surface.xMin + surface.xMax) / 2, y: (surface.yMin + surface.yMax) / 2 }
    );
  };

  return (
    <div
      ref={sceneRef}
      className="relative isolate w-full aspect-[4/3] rounded-3xl overflow-hidden select-none shadow-inner border border-current/10"
      style={{ containerType: 'inline-size' }}
      dir="ltr" lang="en"
    >
      {/* Wall, baseboard and floor: the generated room picture, or the drawn fallback */}
      {hasRoomArt ? (
        <img
          src={roomBgSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <div className={`absolute inset-x-0 top-0 h-[60%] ${palette.wallClass}`} />
          <div className={`absolute inset-x-0 top-[60%] h-[1.5%] ${palette.baseboardClass}`} />
          <div className={`absolute inset-x-0 bottom-0 h-[38.5%] ${palette.floorClass}`} />
          <div
            className={`absolute left-[35%] top-[14%] w-[30%] h-[38%] rounded-lg border-[0.8cqw] ${palette.windowClass} flex items-center justify-center text-[5cqw]`}
            aria-hidden="true"
          >
            {palette.windowView}
          </div>
        </>
      )}

      {/* Shelves, sill, desk and sticker board */}
      {furniture.map((piece) => (
        <img
          key={piece.id}
          src={piece.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute h-auto pointer-events-none"
          style={{
            ...at(piece),
            width: `${piece.width}cqw`,
            transform: `translate(-${(piece.anchorX ?? 0.5) * 100}%, -${piece.anchorY * 100}%)${shearTransform(piece.shear)}${piece.isMirrored ? ' scaleX(-1)' : ''}`,            filter: 'drop-shadow(0 0.6cqw 0.5cqw rgba(59, 42, 90, 0.25))',
          }}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ))}

      {/* Furniture drawn into the room picture: tap areas over it */}
      {isInteractive &&
        getFixedFurniture(geometry).map((piece) => {
          const name = FIXED_FURNITURE_NAMES[piece.id];
          const points = piece.tapArea.map((point) => `${point.x},${point.y}`).join(' ');
          return (
            <button
              key={piece.id}
              type="button"
              data-fixed={piece.id}
              className="group absolute inset-0 pointer-events-none focus:outline-none"
              style={{ zIndex: FIXED_TAP_Z_INDEX }}
              aria-label={`${name.en} · ${name.he}`}
              onClick={() => onTapFixed?.(piece)}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polygon
                  points={points}
                  className="pointer-events-auto cursor-pointer fill-transparent stroke-transparent group-focus-visible:stroke-white"
                  strokeWidth={4}
                  strokeDasharray="10 7"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </button>
          );
        })}

      {/* Drop zones: where the picked or dragged item can go */}
      {zoneSurfaces.map((surface) => {
        const outline = surface.outline ?? getFloorOutline(surface);
        if (outline) {
          const points = outline.map((point) => `${point.x},${point.y}`).join(' ');
          const zoneClass = 'absolute inset-0 motion-safe:animate-pulse';
          const zoneStyle: React.CSSProperties = {
            clipPath: `polygon(${outline.map((point) => `${point.x}% ${point.y}%`).join(', ')})`,
            // the desk top is drawn on the desk, with what lies on it on top (same z, later in the scene)
            zIndex: surface.kind === 'desk' && !geometry.baked ? Math.round(layout.deskPoint.y) + 1 : ZONE_Z_INDEX,
          };
          const drawing = (
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon
                points={points}
                className={palette.outlineClass}
                strokeWidth={6}
                strokeDasharray="10 7"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          );
          return placingKind && isInteractive ? (
            <button
              key={surface.id}
              type="button"
              data-zone={surface.id}
              className={`${zoneClass} focus-visible:outline focus-visible:outline-2`}
              style={zoneStyle}
              aria-label={`להניח כאן: ${SURFACE_LABELS_HE[surface.id] ?? ''}`}
              onClick={(event) => handleZoneClick(event, surface.id)}
            >
              {drawing}
            </button>
          ) : (
            <span key={surface.id} data-zone={surface.id} className={`${zoneClass} pointer-events-none`} style={zoneStyle} aria-hidden="true">
              {drawing}
            </span>
          );
        }
        const isStanding = STANDING_KINDS.includes(surface.kind);
        const height = surface.yMax - surface.yMin;
        const style: React.CSSProperties = {
          left: `${surface.xMin - 3}%`,
          width: `${surface.xMax - surface.xMin + 6}%`,
          top: isStanding ? `calc(${surface.yMin}% - ${ZONE_TOP_PAD_CQW}cqw)` : `${surface.yMin - 4}%`,
          height: isStanding ? `calc(${height}% + ${ZONE_TOP_PAD_CQW + 1}cqw)` : `${height + 8}%`,
        };
        const className = `absolute z-[25] rounded-2xl border-[0.4cqw] border-dashed motion-safe:animate-pulse ${palette.highlightClass}`;
        return placingKind && isInteractive ? (
          <button
            key={surface.id}
            type="button"
            data-zone={surface.id}
            className={`${className} focus-visible:outline focus-visible:outline-2`}
            style={style}
            aria-label={`להניח כאן: ${SURFACE_LABELS_HE[surface.id] ?? ''}`}
            onClick={(event) => handleZoneClick(event, surface.id)}
          />
        ) : (
          <span key={surface.id} data-zone={surface.id} className={`${className} pointer-events-none`} style={style} aria-hidden="true" />
        );
      })}

      {/* Placed items */}
      {entries.map((entry) => {
        const kind = entry.item.slotKind;
        const isMoving = drag?.key === entry.key;
        const point = isMoving ? drag.point : entry.point;
        const isStanding = STANDING_KINDS.includes(kind);
        const size = entry.width * getDepthScale(kind, point.y, geometry);
        const isDesk = entry.key === `${OBJECT_KEY_PREFIX}${DESK_OBJECT_ID}`;
        // A drawn sticker shows its own picture; the desk has an image URL too but is a themed picture
        const sprite = entry.item.imageUrl && !isDesk
          ? null
          : getRoomSprite(themeId, getArtId(entry.key, entry.item.id), {
              // a big piece keeps its facing until it is turned; a wall picture follows the wall while dragged
              isOnLeftWall: entry.canRotate ? entry.isOnLeftWall : LEFT_WALL_KINDS.includes(kind) && point.x < geometry.cornerX,
              canMirror: LEFT_WALL_KINDS.includes(kind),
              isFlatOnWall: kind === 'wall',
              wallSlope: getWallSlope(geometry, entry.canRotate ? entry.isOnLeftWall : point.x < geometry.cornerX),
            });
        const baseBounds = getBounds(entry.item, isDesk);
        // Without a themed picture the emoji icon mirrors on the left wall, feet and shadow with it
        const bounds = entry.isOnLeftWall
          ? { ...baseBounds, left: 1 - baseBounds.right, right: 1 - baseBounds.left }
          : baseBounds;
        // The picture's box is bigger than the drawn object: the feet are the object's visible bottom
        const padBottom = (1 - bounds.bottom) * size;
        const footprint = (bounds.right - bounds.left) * size;
        const zIndex = isMoving ? MOVING_Z_INDEX : kind === 'desk' ? deskItemZIndex(point) : Math.round(point.y);
        const style: React.CSSProperties = sprite
          ? spriteStyle(point, sprite.bounds, sprite.aspect, size, isStanding, zIndex)
          : {
              ...at(point),
              width: `${size * 1.25}cqw`,
              zIndex,
              ...(isDesk ? { width: `${size}cqw` } : {}),
              transform: isStanding ? `translate(-50%, calc(-100% + ${padBottom}cqw))` : 'translate(-50%, -50%)',
            };
        const body = sprite ? (
          <img
            // a new picture (a turned piece) swaps at once instead of sliding from the old picture's shear
            key={sprite.url}
            src={sprite.url}
            alt=""
            draggable={false}
            className={`block w-full h-auto motion-safe:transition-transform motion-safe:duration-300 ${isMoving ? 'drop-shadow-lg' : ''}`}
            style={sprite.isMirrored || sprite.shear ? spriteTransform(sprite, isStanding) : undefined}
          />
        ) : (
          <>
            {isStanding && (
              <span
                className="absolute -translate-x-1/2 rounded-full bg-[#3B2A5A]/30 blur-[1px]"
                style={{
                  left: `${((bounds.left + bounds.right) / 2) * 100}%`,
                  // centred on the feet: the object's bottom edge overlaps the top half of the shadow
                  bottom: `${padBottom - (footprint * SHADOW_WIDTH_OF_FOOTPRINT * SHADOW_HEIGHT_OF_WIDTH) * 0.35}cqw`,
                  width: `${footprint * SHADOW_WIDTH_OF_FOOTPRINT}cqw`,
                  height: `${footprint * SHADOW_WIDTH_OF_FOOTPRINT * SHADOW_HEIGHT_OF_WIDTH}cqw`,
                }}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative flex justify-center leading-none ${isMoving ? 'scale-110 drop-shadow-lg' : 'drop-shadow-sm'}`}
              style={{ fontSize: `${size}cqw`, ...(isDesk ? {} : { height: `${size}cqw` }) }}
            >
              <span
                className={`${isDesk ? 'block w-full' : 'inline-flex'} motion-safe:transition-transform motion-safe:duration-300`}
                style={entry.isOnLeftWall ? { transform: 'scaleX(-1)' } : undefined}
              >
                {isDesk ? (
                  <img src={entry.item.imageUrl} alt="" draggable={false} className="block w-full h-auto" />
                ) : (
                  <ItemIcon item={entry.item} size={`${size}cqw`} />
                )}
              </span>
            </span>
          </>
        );
        const baseClass = `absolute flex justify-center ${isMoving ? '' : 'motion-safe:transition-[left,top] motion-safe:duration-150'}`;
        return isInteractive ? (
          <button
            key={entry.key}
            ref={(element) => {
              itemRefs.current[entry.key] = element;
            }}
            type="button"
            className={`${baseClass} touch-none cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            style={style}
            aria-label={`${entry.item.nameEn} · ${entry.item.nameHe}`}
            aria-describedby="room-move-hint"
            onPointerDown={(event) => handlers.onPointerDown(event, entry)}
            onPointerMove={(event) => handlers.onPointerMove(event, entry)}
            onPointerUp={() => handlers.onPointerUp(entry)}
            onPointerCancel={handlers.onPointerCancel}
            onClick={() => handlers.onClick(entry)}
            onKeyDown={(event) => handlers.onKeyDown(event, entry)}
            onBlur={() => handlers.onBlur(entry)}
          >
            {body}
          </button>
        ) : (
          <span key={entry.key} className={baseClass} style={style} aria-hidden="true">
            {body}
          </span>
        );
      })}

      {/* Avatar */}
      <div
        className={`${CENTERED} pointer-events-none transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none`}
        style={{ ...at(avatarPos), zIndex: Math.round(avatarPos.y) + 1 }}
        aria-hidden="true"
      >
        <div className="drop-shadow-md" style={{ transform: isAvatarFacingLeft ? 'scaleX(-1)' : undefined }}>
          <DressedAvatar
            avatarEmoji={avatarEmoji}
            worn={worn}
            fontSize={worn.some((item) => item.isHumanOnly) ? '7.5cqw' : '10cqw'}
          />
        </div>
      </div>

      {/* Speech bubble */}
      {bubble && (
        <div
          className="absolute z-[210] -translate-x-1/2 -translate-y-full px-[2cqw] py-[1cqw] rounded-[2cqw] bg-white text-slate-800 shadow-lg text-center whitespace-nowrap pointer-events-none"
          style={{ left: `${Math.min(80, Math.max(20, bubble.at.x))}%`, top: `${Math.max(14, bubble.at.y - 8)}%` }}
          role="status"
        >
          <div className="font-extrabold text-[3.6cqw] leading-tight">{bubble.textEn}</div>
          <div className="font-bold text-[2.6cqw] opacity-75 leading-tight" dir="rtl">
            {bubble.textHe}
          </div>
        </div>
      )}

      {isInteractive && (
        <>
          <p id="room-move-hint" className="sr-only" dir="rtl" lang="he">
            לגרור כדי להזיז. במקלדת: חצים להזזה, PageUp ו-PageDown למעבר בין מקומות, Enter להנחה, Escape לביטול.
          </p>
          <p className="sr-only" role="status" aria-live="assertive" dir="rtl" lang="he">
            {getAnnouncement(entries)}
          </p>
        </>
      )}
    </div>
  );
};
