import React, { RefObject, useRef, useState } from 'react';
import {
  PlacedRoomEntry,
  ScenePoint,
  cycleSurface,
  snapToSurface,
  stepPoint,
} from '../../data/roomPlacement';
import { SURFACE_LABELS_HE } from './roomLayout';

export interface DragState {
  key: string;
  /** Where the item is shown while it is moved (already on a surface) */
  point: ScenePoint;
  source: 'pointer' | 'keyboard';
}

interface Press {
  key: string;
  startX: number;
  startY: number;
  /** Pointer position minus the item's anchor, so the item does not jump under the finger */
  offset: ScenePoint;
  isDragging: boolean;
}

interface UseRoomItemDragOptions {
  sceneRef: RefObject<HTMLElement | null>;
  onMove: (key: string, point: ScenePoint) => void;
  onTap: (key: string) => void;
}

/** Pointer travel (px) before a press becomes a drag, so a tap still taps. */
const DRAG_THRESHOLD_PX = 6;
const KEY_STEP = 2;
const KEY_STEP_BIG = 6;
/** A click right after a drag ends is the drag's own release, not a tap. */
const CLICK_AFTER_DRAG_MS = 350;

/**
 * Moving placed items in the room: a mouse or touch drag, or the keyboard (arrow keys, PageUp /
 * PageDown to change surface, Enter to drop, Escape to cancel). The dragged item always shows on
 * a surface of its kind; the drop is committed through `onMove`.
 */
export function useRoomItemDrag({ sceneRef, onMove, onTap }: UseRoomItemDragOptions) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const press = useRef<Press | null>(null);
  const suppressClickUntil = useRef(0);

  const toScene = (clientX: number, clientY: number): ScenePoint | null => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return { x: ((clientX - rect.left) / rect.width) * 100, y: ((clientY - rect.top) / rect.height) * 100 };
  };

  const finish = (entry: PlacedRoomEntry, point: ScenePoint) => {
    suppressClickUntil.current = performance.now() + CLICK_AFTER_DRAG_MS;
    setDrag(null);
    onMove(entry.key, point);
  };

  const onPointerDown = (event: React.PointerEvent, entry: PlacedRoomEntry) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const pointer = toScene(event.clientX, event.clientY);
    if (!pointer) return;
    press.current = {
      key: entry.key,
      startX: event.clientX,
      startY: event.clientY,
      offset: { x: pointer.x - entry.point.x, y: pointer.y - entry.point.y },
      isDragging: false,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The pointer is already gone (or synthetic): the drag still follows move events on the item.
    }
  };

  const onPointerMove = (event: React.PointerEvent, entry: PlacedRoomEntry) => {
    const current = press.current;
    if (!current || current.key !== entry.key) return;
    if (!current.isDragging) {
      const travelled = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
      if (travelled < DRAG_THRESHOLD_PX) return;
      current.isDragging = true;
    }
    const pointer = toScene(event.clientX, event.clientY);
    if (!pointer) return;
    const raw = { x: pointer.x - current.offset.x, y: pointer.y - current.offset.y };
    setDrag({ key: entry.key, point: snapToSurface(entry.item.slotKind, raw).point, source: 'pointer' });
  };

  const onPointerUp = (entry: PlacedRoomEntry) => {
    const current = press.current;
    press.current = null;
    if (current?.isDragging && drag?.key === entry.key) finish(entry, drag.point);
    else if (current?.isDragging) setDrag(null);
  };

  const onPointerCancel = () => {
    press.current = null;
    setDrag(null);
  };

  const onClick = (entry: PlacedRoomEntry) => {
    if (performance.now() < suppressClickUntil.current) return;
    onTap(entry.key);
  };

  const getKeyboardTarget = (entry: PlacedRoomEntry, event: React.KeyboardEvent): ScenePoint | null => {
    const kind = entry.item.slotKind;
    const point = drag?.key === entry.key ? drag.point : entry.point;
    const step = event.shiftKey ? KEY_STEP_BIG : KEY_STEP;
    const isLine = snapToSurface(kind, point).surface.yMin === snapToSurface(kind, point).surface.yMax;
    switch (event.key) {
      case 'ArrowLeft':
        return stepPoint(kind, point, -step, 0);
      case 'ArrowRight':
        return stepPoint(kind, point, step, 0);
      case 'ArrowUp':
        return isLine ? cycleSurface(kind, point, -1) : stepPoint(kind, point, 0, -step);
      case 'ArrowDown':
        return isLine ? cycleSurface(kind, point, 1) : stepPoint(kind, point, 0, step);
      case 'PageUp':
        return cycleSurface(kind, point, -1);
      case 'PageDown':
        return cycleSurface(kind, point, 1);
      default:
        return null;
    }
  };

  const onKeyDown = (event: React.KeyboardEvent, entry: PlacedRoomEntry) => {
    const isKeyboardDrag = drag?.key === entry.key && drag.source === 'keyboard';
    if (isKeyboardDrag && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      finish(entry, drag.point);
      return;
    }
    if (isKeyboardDrag && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setDrag(null);
      return;
    }
    const target = getKeyboardTarget(entry, event);
    if (!target) return;
    event.preventDefault();
    setDrag({ key: entry.key, point: target, source: 'keyboard' });
  };

  const onBlur = (entry: PlacedRoomEntry) => {
    if (drag?.key === entry.key && drag.source === 'keyboard') setDrag(null);
  };

  /** Starts a keyboard move of `entry` (the "move" button), as if its first arrow key was pressed. */
  const startKeyboardMove = (entry: PlacedRoomEntry) => setDrag({ key: entry.key, point: entry.point, source: 'keyboard' });

  const getAnnouncement = (entries: PlacedRoomEntry[]): string => {
    const moving = drag && entries.find((entry) => entry.key === drag.key);
    if (!moving || drag.source !== 'keyboard') return '';
    const surface = snapToSurface(moving.item.slotKind, drag.point).surface;
    return `${moving.item.nameHe}: ${SURFACE_LABELS_HE[surface.id] ?? ''}`;
  };

  return {
    drag,
    getAnnouncement,
    startKeyboardMove,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClick, onKeyDown, onBlur },
  };
}
