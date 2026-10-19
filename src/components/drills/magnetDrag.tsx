import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Active,
  Announcements,
  closestCenter,
  CollisionDetection,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardCoordinateGetter,
  KeyboardSensor,
  MouseSensor,
  Over,
  pointerWithin,
  TouchSensor,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  addMagnet,
  describeMagnetChange,
  fromMagnetId,
  MagnetChange,
  moveMagnet,
  removeMagnet,
  toMagnetId,
} from '../../utils/magnetOrder';
import { playSfx } from '../../utils/sfx';

// Drag-and-drop for the magnet drills (word chips and letter tiles), on top of the tap controls.

export const MAGNET_TRAY_ID = 'magnet-zone-tray';
export const MAGNET_BANK_ID = 'magnet-zone-bank';

/** A mouse drag starts after this many pixels, so a click stays a click. */
const MOUSE_DRAG_DISTANCE_PX = 5;
/** A touch drag starts after a short hold, so a quick swipe still scrolls the page. */
const TOUCH_DRAG_DELAY_MS = 150;
const TOUCH_DRAG_TOLERANCE_PX = 8;
/** The click a browser fires right after a drop is not a tap. */
const CLICK_AFTER_DRAG_MS = 300;

/** Space picks up and drops; Enter stays a tap (add or take back). */
const KEYBOARD_CODES = { start: ['Space'], cancel: ['Escape'], end: ['Space'] };

/** The magnet a drop over a chip in the tray lands after it, judged by the dragged chip's centre. */
const isAfterOver = (active: Active, over: Over): boolean => {
  const rect = active.rect.current.translated;
  if (!rect) return false;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  if (centerY > over.rect.top + over.rect.height) return true;
  if (centerY < over.rect.top) return false;
  return centerX > over.rect.left + over.rect.width / 2;
};

/** A chip under the pointer wins; over the tray's gaps the nearest chip; the keyboard moves between all zones. */
const magnetCollision: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) return closestCenter(args);
  const hits = pointerWithin(args);
  const chip = hits.find((hit) => fromMagnetId(hit.id) !== null);
  if (chip) return [chip];
  if (hits.some((hit) => hit.id === MAGNET_TRAY_ID)) {
    const chips = args.droppableContainers.filter((container) => fromMagnetId(container.id) !== null);
    const nearest = chips.length > 0 ? closestCenter({ ...args, droppableContainers: chips }) : [];
    return nearest.length > 0 ? [nearest[0]] : hits.filter((hit) => hit.id === MAGNET_TRAY_ID);
  }
  return hits.filter((hit) => hit.id === MAGNET_BANK_ID);
};

interface UseMagnetDragOptions {
  order: number[];
  isDisabled: boolean;
  /** The English text of a magnet, for screen-reader announcements */
  getLabel: (idx: number) => string;
  trayLabelHe: string;
  bankLabelHe: string;
  onChangeOrder: (next: number[], change: MagnetChange) => void;
}

export interface MagnetDrag {
  /** The order to show: the live preview while dragging, the saved order otherwise */
  order: number[];
  activeIdx: number | null;
  contextProps: DndContextProps;
  /** True for the click a browser fires at the end of a drag */
  shouldIgnoreClick: () => boolean;
}

/** Mouse, touch (after a short hold) and keyboard sensors shared by the magnet drills. */
export function useMagnetSensors(coordinateGetter: KeyboardCoordinateGetter) {
  return useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: MOUSE_DRAG_DISTANCE_PX } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: TOUCH_DRAG_DELAY_MS, tolerance: TOUCH_DRAG_TOLERANCE_PX },
    }),
    useSensor(KeyboardSensor, { coordinateGetter, keyboardCodes: KEYBOARD_CODES })
  );
}

/** Tells a real tap from the click a browser fires at the end of a drag. */
export function useDragClickGuard() {
  const isDraggingRef = useRef(false);
  const lastDragEndRef = useRef(0);
  return {
    markDragStart: () => {
      isDraggingRef.current = true;
    },
    markDragEnd: () => {
      isDraggingRef.current = false;
      lastDragEndRef.current = performance.now();
    },
    shouldIgnoreClick: () => isDraggingRef.current || performance.now() - lastDragEndRef.current < CLICK_AFTER_DRAG_MS,
  };
}

/** Hebrew screen-reader announcements; `labelOf` names a magnet or a drop zone. */
export const buildMagnetAnnouncements = (labelOf: (id: UniqueIdentifier) => string): Announcements => ({
  onDragStart: ({ active }) => `הרמת את ${labelOf(active.id)}`,
  onDragOver: ({ active, over }) =>
    over ? `${labelOf(active.id)} מעל ${labelOf(over.id)}` : `${labelOf(active.id)} מחוץ לתרגיל`,
  onDragEnd: ({ active, over }) =>
    over ? `שחררת את ${labelOf(active.id)} ליד ${labelOf(over.id)}` : `שחררת את ${labelOf(active.id)} מחוץ לתרגיל`,
  onDragCancel: () => 'ההזזה בוטלה',
});

export const MAGNET_SCREEN_READER_INSTRUCTIONS = {
  draggable: 'רווח מרים את המגנט, החיצים מזיזים אותו ורווח נוסף משחרר אותו. Escape מבטל, ו-Enter מוסיף אותו או מחזיר אותו.',
};

export function useMagnetDrag({
  order,
  isDisabled,
  getLabel,
  trayLabelHe,
  bankLabelHe,
  onChangeOrder,
}: UseMagnetDragOptions): MagnetDrag {
  const [preview, setPreview] = useState<number[] | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const clickGuard = useDragClickGuard();
  const sensors = useMagnetSensors(sortableKeyboardCoordinates);

  const currentOrder = preview ?? order;

  const finishDrag = () => {
    clickGuard.markDragEnd();
    setPreview(null);
    setActiveIdx(null);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const idx = fromMagnetId(active.id);
    if (idx === null || isDisabled) return;
    clickGuard.markDragStart();
    setActiveIdx(idx);
    setPreview(order);
    playSfx('tap');
  };

  // Moving between the bank and the tray changes the preview; moves inside the tray are shown by the sortable list.
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const idx = fromMagnetId(active.id);
    if (idx === null || !over) return;
    const overIdx = fromMagnetId(over.id);
    const isOverTray = over.id === MAGNET_TRAY_ID || (overIdx !== null && currentOrder.includes(overIdx));
    const isPlaced = currentOrder.includes(idx);
    if (!isOverTray) {
      if (isPlaced) setPreview(removeMagnet(currentOrder, idx));
      return;
    }
    if (isPlaced) return;
    if (overIdx === null) {
      setPreview(addMagnet(currentOrder, idx));
      return;
    }
    const overPos = currentOrder.indexOf(overIdx);
    setPreview(addMagnet(currentOrder, idx, isAfterOver(active, over) ? overPos + 1 : overPos));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const idx = fromMagnetId(active.id);
    const finalOrder = currentOrder;
    finishDrag();
    // Dropped outside the drill: everything goes back where it was.
    if (idx === null || !over || isDisabled) return;
    const overIdx = fromMagnetId(over.id);
    const next =
      overIdx !== null && overIdx !== idx && finalOrder.includes(idx) && finalOrder.includes(overIdx)
        ? moveMagnet(finalOrder, idx, finalOrder.indexOf(overIdx))
        : finalOrder;
    const change = describeMagnetChange(order, next, idx);
    if (!change) return;
    playSfx('tap');
    onChangeOrder(next, change);
  };

  const labelOf = (id: UniqueIdentifier): string => {
    if (id === MAGNET_TRAY_ID) return trayLabelHe;
    if (id === MAGNET_BANK_ID) return bankLabelHe;
    const idx = fromMagnetId(id);
    return idx === null ? '' : getLabel(idx);
  };

  return {
    order: currentOrder,
    activeIdx,
    contextProps: {
      sensors,
      collisionDetection: magnetCollision,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDragCancel: finishDrag,
      accessibility: {
        announcements: buildMagnetAnnouncements(labelOf),
        screenReaderInstructions: MAGNET_SCREEN_READER_INSTRUCTIONS,
      },
    },
    shouldIgnoreClick: clickGuard.shouldIgnoreClick,
  };
}

export type MagnetButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  idx: number;
  isDragDisabled: boolean;
};

export const DRAG_SOURCE_OPACITY = 0.35;
export const MAGNET_ROLE_DESCRIPTION_HE = 'מגנט שאפשר לגרור';

/** A placed magnet: tap to take it back, drag to move it inside the tray or back to the bank. */
export function TrayMagnet({ idx, isDragDisabled, style, ...buttonProps }: MagnetButtonProps) {
  const isReducedMotion = usePrefersReducedMotion();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: toMagnetId(idx),
    disabled: isDragDisabled,
    attributes: { roleDescription: MAGNET_ROLE_DESCRIPTION_HE },
    ...(isReducedMotion ? { transition: null } : {}),
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      {...buttonProps}
      style={{
        ...style,
        transform: CSS.Translate.toString(transform),
        transition: isReducedMotion ? undefined : transition,
        opacity: isDragging ? DRAG_SOURCE_OPACITY : undefined,
        touchAction: 'manipulation',
      }}
    />
  );
}

type DraggableMagnetProps = MagnetButtonProps & {
  /** Space picks it up. Off for bank magnets: there Enter and Space are a tap that places it. */
  isKeyboardDraggable?: boolean;
};

/** A draggable magnet that isn't in a sortable list: a bank chip, or a letter placed in a slot. */
export function DraggableMagnet({ idx, isDragDisabled, isKeyboardDraggable = false, style, ...buttonProps }: DraggableMagnetProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: toMagnetId(idx),
    disabled: isDragDisabled,
    attributes: { roleDescription: MAGNET_ROLE_DESCRIPTION_HE },
  });
  const activeListeners = isKeyboardDraggable
    ? listeners
    : Object.fromEntries(Object.entries(listeners ?? {}).filter(([eventName]) => eventName !== 'onKeyDown'));
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...activeListeners}
      {...buttonProps}
      style={{ ...style, opacity: isDragging ? DRAG_SOURCE_OPACITY : undefined, touchAction: 'manipulation' }}
    />
  );
}

interface MagnetDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  /** Added while a magnet is dragged over the zone */
  overClassName?: string;
}

export function MagnetDropZone({ id, className = '', overClassName = '', ...divProps }: MagnetDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <div ref={setNodeRef} className={`${className} ${isOver ? overClassName : ''}`} {...divProps} />;
}

/**
 * The chip under the finger while dragging. It is rendered on <body>: a `backdrop-filter` ancestor
 * (the mission runner's overlay) would make its `position: fixed` scroll with the drill.
 */
export function MagnetDragOverlay({ children }: { children: React.ReactNode }) {
  const isReducedMotion = usePrefersReducedMotion();
  return createPortal(
    <DragOverlay dropAnimation={isReducedMotion ? null : undefined}>
      {children ? (
        <div dir="ltr" lang="en" className="cursor-grabbing scale-110 drop-shadow-xl">
          {children}
        </div>
      ) : null}
    </DragOverlay>,
    document.body
  );
}
