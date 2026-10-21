import React, { useEffect, useRef } from 'react';
import { ROOM_OBJECTS, RoomObjectId, RoomSlotKind } from '../../data/room';
import { PlacedRoomEntry, getDepthScale, getSurfaces } from '../../data/roomPlacement';
import { WardrobeItem } from '../../data/wardrobe';
import { ThemeId } from '../../types/learner';
import { THEME_REGISTRY } from '../../themes/themeRegistry';
import { useArtStatus } from '../../hooks/useArtStatus';
import { DressedAvatar } from './DressedAvatar';
import { EmojiIcon } from '../art/EmojiIcon';
import { ItemIcon } from './ItemIcon';
import { useRoomItemDrag } from './useRoomItemDrag';
import {
  FURNITURE_PIECES,
  OBJECT_POSITIONS,
  OBJECT_SIZES,
  SCENE_PALETTES,
  SLOT_KIND_SIZES,
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
  onTapObject?: (objectId: RoomObjectId) => void;
  onMoveRequestHandled?: () => void;
}

const CENTERED = 'absolute -translate-x-1/2 -translate-y-1/2';
const ZONE_TOP_PAD_CQW = 8;

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
  onTapObject,
  onMoveRequestHandled,
}) => {
  const palette = SCENE_PALETTES[themeId] || SCENE_PALETTES['cozy-studio'];
  const isInteractive = Boolean(onTapEntry && onTapObject);
  const roomBgSrc = (THEME_REGISTRY[themeId] || THEME_REGISTRY['cozy-studio']).art.roomBg;
  const hasRoomArt = useArtStatus(roomBgSrc) === 'loaded';
  const sceneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const { drag, handlers, startKeyboardMove, getAnnouncement } = useRoomItemDrag({
    sceneRef,
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

  const dragKind = drag ? entries.find((entry) => entry.key === drag.key)?.item.slotKind ?? null : null;
  const zoneKind = placingKind ?? dragKind;

  const handleZoneClick = (event: React.MouseEvent, surfaceId: string) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    const surface = getSurfaces(zoneKind ?? 'floor').find((candidate) => candidate.id === surfaceId);
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
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden select-none shadow-inner border border-current/10"
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
      {FURNITURE_PIECES.map((piece) => (
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
            transform: `translate(-50%, -${piece.anchorY * 100}%)`,
            filter: 'drop-shadow(0 0.6cqw 0.5cqw rgba(59, 42, 90, 0.25))',
          }}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ))}

      {/* Drop zones: where the picked or dragged item can go */}
      {zoneKind &&
        getSurfaces(zoneKind).map((surface) => {
          const isStanding = STANDING_KINDS.includes(zoneKind);
          const height = surface.yMax - surface.yMin;
          const style: React.CSSProperties = {
            left: `${surface.xMin - 3}%`,
            width: `${surface.xMax - surface.xMin + 6}%`,
            top: isStanding ? `calc(${surface.yMin}% - ${ZONE_TOP_PAD_CQW}cqw)` : `${surface.yMin - 4}%`,
            height: isStanding ? `calc(${height}% + ${ZONE_TOP_PAD_CQW + 1}cqw)` : `${height + 8}%`,
          };
          const className = `absolute rounded-2xl border-[0.4cqw] border-dashed motion-safe:animate-pulse ${palette.highlightClass}`;
          return placingKind && isInteractive ? (
            <button
              key={surface.id}
              type="button"
              className={`${className} focus-visible:outline focus-visible:outline-2`}
              style={style}
              aria-label={`להניח כאן: ${SURFACE_LABELS_HE[surface.id] ?? ''}`}
              onClick={(event) => handleZoneClick(event, surface.id)}
            />
          ) : (
            <span key={surface.id} className={`${className} pointer-events-none`} style={style} aria-hidden="true" />
          );
        })}

      {/* Placed items */}
      {entries.map((entry) => {
        const kind = entry.item.slotKind;
        const isMoving = drag?.key === entry.key;
        const point = isMoving ? drag.point : entry.point;
        const isStanding = STANDING_KINDS.includes(kind);
        const size = SLOT_KIND_SIZES[kind] * getDepthScale(kind, point.y);
        const style: React.CSSProperties = {
          ...at(point),
          width: `${size * 1.25}cqw`,
          zIndex: isMoving ? 30 : Math.round(point.y),
          transform: isStanding ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)',
        };
        const body = (
          <>
            {isStanding && (
              <span
                className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/3 rounded-full bg-[#3B2A5A]/30 blur-[1px]"
                style={{ width: `${size}cqw`, height: `${size * 0.22}cqw` }}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative flex justify-center leading-none ${isMoving ? 'scale-110 drop-shadow-lg' : 'drop-shadow-sm'}`}
              style={{ fontSize: `${size}cqw` }}
            >
              <ItemIcon item={entry.item} size={`${size}cqw`} />
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

      {/* Mission objects */}
      {ROOM_OBJECTS.map((object) => {
        const style: React.CSSProperties = {
          ...at(OBJECT_POSITIONS[object.id]),
          fontSize: `${OBJECT_SIZES[object.id]}cqw`,
        };
        return isInteractive ? (
          <button
            key={object.id}
            type="button"
            onClick={() => onTapObject?.(object.id)}
            className={`${CENTERED} leading-none transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2`}
            style={style}
            aria-label={`${object.nameEn} · ${object.nameHe}`}
          >
            <EmojiIcon emoji={object.emoji} size={`${OBJECT_SIZES[object.id]}cqw`} />
          </button>
        ) : (
          <span key={object.id} className={`${CENTERED} leading-none`} style={style} aria-hidden="true">
            <EmojiIcon emoji={object.emoji} size={`${OBJECT_SIZES[object.id]}cqw`} />
          </span>
        );
      })}

      {/* Avatar */}
      <div
        className={`${CENTERED} pointer-events-none transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none`}
        style={at(avatarPos)}
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
          className="absolute -translate-x-1/2 -translate-y-full px-[2cqw] py-[1cqw] rounded-[2cqw] bg-white text-slate-800 shadow-lg text-center whitespace-nowrap pointer-events-none"
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
