import React from 'react';
import { ROOM_OBJECTS, ROOM_SLOTS, RoomItem, RoomObjectId } from '../../data/room';
import { WardrobeItem } from '../../data/wardrobe';
import { ThemeId } from '../../types/learner';
import { DressedAvatar } from './DressedAvatar';
import { ItemIcon } from './ItemIcon';
import {
  OBJECT_POSITIONS,
  OBJECT_SIZES,
  SCENE_PALETTES,
  SLOT_KIND_SIZES,
  SLOT_POSITIONS,
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
  /** Slot id -> placed item (see getPlacedRoomItems) */
  placedItems: Record<string, RoomItem>;
  avatarPos: ScenePoint;
  isAvatarFacingLeft?: boolean;
  /** Empty or filled slots the selected item can go to */
  highlightedSlotIds?: string[];
  bubble?: SceneBubble | null;
  /** Without handlers the scene is a picture (the dashboard card preview). */
  onTapSlot?: (slotId: string) => void;
  onTapObject?: (objectId: RoomObjectId) => void;
}

function at(point: ScenePoint): React.CSSProperties {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

/** The drawn room: wall, floor, furniture outlines, placed items, mission objects and the avatar. */
export const RoomScene: React.FC<RoomSceneProps> = ({
  themeId,
  avatarEmoji,
  worn = [],
  placedItems,
  avatarPos,
  isAvatarFacingLeft = false,
  highlightedSlotIds = [],
  bubble,
  onTapSlot,
  onTapObject,
}) => {
  const palette = SCENE_PALETTES[themeId] || SCENE_PALETTES['cozy-studio'];
  const isInteractive = Boolean(onTapSlot && onTapObject);
  const centered = 'absolute -translate-x-1/2 -translate-y-1/2';

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden select-none shadow-inner border border-current/10"
      style={{ containerType: 'inline-size' }}
      dir="ltr"
    >
      {/* Wall, baseboard and floor */}
      <div className={`absolute inset-x-0 top-0 h-[60%] ${palette.wallClass}`} />
      <div className={`absolute inset-x-0 top-[60%] h-[1.5%] ${palette.baseboardClass}`} />
      <div className={`absolute inset-x-0 bottom-0 h-[38.5%] ${palette.floorClass}`} />

      {/* Window, shelf, sticker board and desk outlines */}
      <div
        className={`absolute left-[34%] top-[8%] w-[20%] h-[26%] rounded-lg border-[0.8cqw] ${palette.windowClass} flex items-center justify-center text-[5cqw]`}
        aria-hidden="true"
      >
        {palette.windowView}
      </div>
      <div className={`absolute left-[32%] top-[34%] w-[24%] h-[2%] rounded-sm border ${palette.furnitureClass}`} />
      <div className={`absolute left-[6%] top-[42%] w-[22%] h-[2.2%] rounded-sm border ${palette.furnitureClass}`} />
      <div className={`absolute left-[59%] top-[26%] w-[26%] h-[15%] rounded-lg border-[0.5cqw] ${palette.boardClass}`} />
      <div className={`absolute left-[55%] top-[55%] w-[26%] h-[3%] rounded-md border ${palette.furnitureClass}`} />
      <div className={`absolute left-[57%] top-[58%] w-[1.5%] h-[12%] ${palette.furnitureClass}`} />
      <div className={`absolute left-[77.5%] top-[58%] w-[1.5%] h-[12%] ${palette.furnitureClass}`} />

      {/* Placed items and empty highlighted slots */}
      {ROOM_SLOTS.map((slot) => {
        const item = placedItems[slot.id];
        const isHighlighted = highlightedSlotIds.includes(slot.id);
        if (!item && !isHighlighted) return null;


        const highlightRing = isHighlighted
          ? `rounded-full border-[0.4cqw] border-dashed animate-pulse ${palette.highlightClass}`
          : '';
        const size = SLOT_KIND_SIZES[slot.kind];
        const content = item ? <ItemIcon item={item} size={`${size}cqw`} /> : '+';
        const sizeStyle: React.CSSProperties = {
          ...at(SLOT_POSITIONS[slot.id]),
          fontSize: `${size}cqw`,
          width: `${size * 1.5}cqw`,
          height: `${size * 1.5}cqw`,
        };
        const className = `${centered} flex items-center justify-center leading-none ${highlightRing}`;

        return isInteractive ? (
          <button
            key={slot.id}
            type="button"
            onClick={() => onTapSlot?.(slot.id)}
            className={`${className} transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2`}
            style={sizeStyle}
            aria-label={item ? `${item.nameEn} · ${item.nameHe}` : 'מקום פנוי'}
          >
            {content}
          </button>
        ) : (
          <span key={slot.id} className={className} style={sizeStyle} aria-hidden="true">
            {content}
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
            className={`${centered} leading-none transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2`}
            style={style}
            aria-label={`${object.nameEn} · ${object.nameHe}`}
          >
            {object.emoji}
          </button>
        ) : (
          <span key={object.id} className={`${centered} leading-none`} style={style} aria-hidden="true">
            {object.emoji}
          </span>
        );
      })}

      {/* Avatar */}
      <div
        className={`${centered} pointer-events-none transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none`}
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
    </div>
  );
};
