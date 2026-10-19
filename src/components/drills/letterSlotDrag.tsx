import React, { useState } from 'react';
import {
  closestCenter,
  closestCorners,
  CollisionDetection,
  DndContextProps,
  DragEndEvent,
  DragStartEvent,
  KeyboardCode,
  KeyboardCoordinateGetter,
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import { dropLetter, fromSlotId, LetterSlots, takeBackLetter, toSlotId, toSlots } from '../../utils/letterSlots';
import { fromMagnetId } from '../../utils/magnetOrder';
import { playSfx } from '../../utils/sfx';
import {
  buildMagnetAnnouncements,
  MAGNET_BANK_ID,
  MAGNET_SCREEN_READER_INSTRUCTIONS,
  useDragClickGuard,
  useMagnetSensors,
} from './magnetDrag';

// Drag-and-drop for the letter magnets: every letter of the word has its own slot, and a letter
// can be dropped into any slot, with open slots left between letters.

/** Arrow keys jump to the nearest slot (or the bank) in that direction. */
const slotKeyboardCoordinates: KeyboardCoordinateGetter = (event, { context }) => {
  const { active, collisionRect, droppableRects, droppableContainers, over } = context;
  const isInDirection = (rect: { left: number; top: number }): boolean => {
    if (!collisionRect) return false;
    switch (event.code) {
      case KeyboardCode.Right:
        return rect.left > collisionRect.left;
      case KeyboardCode.Left:
        return rect.left < collisionRect.left;
      case KeyboardCode.Down:
        return rect.top > collisionRect.top;
      case KeyboardCode.Up:
        return rect.top < collisionRect.top;
      default:
        return false;
    }
  };
  const isArrow = [KeyboardCode.Right, KeyboardCode.Left, KeyboardCode.Down, KeyboardCode.Up].includes(
    event.code as KeyboardCode
  );
  if (!isArrow) return undefined;
  event.preventDefault();
  if (!active || !collisionRect) return undefined;
  const candidates = droppableContainers.getEnabled().filter((entry) => {
    const rect = droppableRects.get(entry.id);
    return Boolean(rect) && entry.id !== over?.id && isInDirection(rect!);
  });
  const [closest] = closestCorners({
    active,
    collisionRect,
    droppableRects,
    droppableContainers: candidates,
    pointerCoordinates: null,
  });
  const rect = closest ? droppableRects.get(closest.id) : undefined;
  return rect ? { x: rect.left, y: rect.top } : undefined;
};

/** The slot under the pointer, else the bank, else the slot the dragged letter covers most. */
const slotCollision: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) return closestCenter(args);
  const hits = pointerWithin(args);
  const slotHit = hits.find((hit) => fromSlotId(hit.id) !== null);
  if (slotHit) return [slotHit];
  const bankHit = hits.find((hit) => hit.id === MAGNET_BANK_ID);
  if (bankHit) return [bankHit];
  const slotContainers = args.droppableContainers.filter((container) => fromSlotId(container.id) !== null);
  return rectIntersection({ ...args, droppableContainers: slotContainers }).slice(0, 1);
};

const isSameSlots = (a: LetterSlots, b: LetterSlots): boolean => a.every((value, pos) => value === b[pos]);

interface UseLetterSlotDragOptions {
  slots: LetterSlots;
  slotCount: number;
  isDisabled: boolean;
  /** The letter on a tile, for screen-reader announcements */
  getLabel: (idx: number) => string;
  bankLabelHe: string;
  onChangeSlots: (next: (number | null)[]) => void;
}

export interface LetterSlotDrag {
  activeIdx: number | null;
  contextProps: DndContextProps;
  shouldIgnoreClick: () => boolean;
}

export function useLetterSlotDrag({
  slots,
  slotCount,
  isDisabled,
  getLabel,
  bankLabelHe,
  onChangeSlots,
}: UseLetterSlotDragOptions): LetterSlotDrag {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const clickGuard = useDragClickGuard();
  const sensors = useMagnetSensors(slotKeyboardCoordinates);

  const finishDrag = () => {
    clickGuard.markDragEnd();
    setActiveIdx(null);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const idx = fromMagnetId(active.id);
    if (idx === null || isDisabled) return;
    clickGuard.markDragStart();
    setActiveIdx(idx);
    playSfx('tap');
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const idx = fromMagnetId(active.id);
    finishDrag();
    // Dropped outside the drill: everything stays where it was.
    if (idx === null || !over || isDisabled) return;
    const pos = fromSlotId(over.id);
    const next =
      over.id === MAGNET_BANK_ID
        ? takeBackLetter(slots, slotCount, idx)
        : pos !== null
          ? dropLetter(slots, slotCount, idx, pos)
          : null;
    if (!next || isSameSlots(next, toSlots(slots, slotCount))) return;
    playSfx('tap');
    onChangeSlots(next);
  };

  const labelOf = (id: UniqueIdentifier): string => {
    if (id === MAGNET_BANK_ID) return bankLabelHe;
    const pos = fromSlotId(id);
    if (pos !== null) return `משבצת ${pos + 1}`;
    const idx = fromMagnetId(id);
    return idx === null ? '' : getLabel(idx);
  };

  return {
    activeIdx,
    contextProps: {
      sensors,
      collisionDetection: slotCollision,
      onDragStart: handleDragStart,
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

interface LetterSlotProps {
  pos: number;
  className: string;
  /** Added while a letter is dragged over the slot */
  overClassName: string;
  children?: React.ReactNode;
}

/** One letter slot of the word: a drop target that holds a placed letter or stays open. */
export function LetterSlot({ pos, className, overClassName, children }: LetterSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: toSlotId(pos) });
  return (
    <span ref={setNodeRef} className={`${className} ${isOver ? overClassName : ''}`}>
      {children}
    </span>
  );
}
