import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Languages, RotateCcw } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { MagnetChange, toggleMagnet, toMagnetId } from '../../utils/magnetOrder';
import { playSfx } from '../../utils/sfx';
import {
  DraggableMagnet,
  MAGNET_BANK_ID,
  MAGNET_TRAY_ID,
  MagnetDragOverlay,
  MagnetDropZone,
  TrayMagnet,
  useMagnetDrag,
} from './magnetDrag';
import { Button } from '../ui/Button';
import { StickyActionBar } from './StickyActionBar';

interface SentenceBuilderDrillProps {
  scrambledWords: string[];
  selectedIndices: number[];
  isCompleted: boolean;
  /** A word was placed (tap or drop), taken back, or moved to another spot in the sentence */
  onChangeOrder: (nextIndices: number[], change: MagnetChange) => void;
  onReset: () => void;
  onCheck: () => void;
  theme: ThemeDefinition;
  /** Hint help: while the hint is open, translate icons sit next to the words that can be translated */
  wordHelp?: {
    isActive: boolean;
    canReveal: (word: string) => boolean;
    revealedGlossFor: (word: string) => string | undefined;
    onReveal: (word: string) => void;
  };
}

const CHIP_CLASS = 'min-h-11 px-4 py-2 rounded-xl text-base font-extrabold';
const ZONE_OVER_CLASS = 'ring-2 ring-purple-400/70';

export const SentenceBuilderDrill: React.FC<SentenceBuilderDrillProps> = ({
  scrambledWords,
  selectedIndices,
  isCompleted,
  onChangeOrder,
  onReset,
  onCheck,
  theme,
  wordHelp,
}) => {
  const drag = useMagnetDrag({
    order: selectedIndices,
    isDisabled: isCompleted,
    getLabel: (idx) => scrambledWords[idx] ?? '',
    trayLabelHe: 'המשפט',
    bankLabelHe: 'בנק המילים',
    onChangeOrder,
  });
  const placed = drag.order;

  const handleTap = (wordIdx: number) => {
    if (drag.shouldIgnoreClick()) return;
    playSfx('tap');
    const { order, change } = toggleMagnet(selectedIndices, wordIdx);
    onChangeOrder(order, change);
  };

  return (
    <DndContext {...drag.contextProps}>
      <div className="space-y-3 sm:space-y-4">
        {/* Assembled Sentence Tray */}
        <MagnetDropZone
          id={MAGNET_TRAY_ID}
          aria-label="המשפט"
          className="min-h-[56px] p-3 sm:min-h-[68px] sm:p-4 rounded-2xl border-2 border-dashed border-purple-400/60 bg-black/5 dark:bg-white/5 flex flex-wrap items-center gap-2 transition-shadow"
          overClassName={ZONE_OVER_CLASS}
          dir="ltr"
          lang="en"
        >
          <SortableContext items={placed.map(toMagnetId)} strategy={rectSortingStrategy}>
            {placed.length === 0 ? (
              <span className="text-sm opacity-60" dir="rtl" lang="he">
                כאן ייבנה המשפט באנגלית…
              </span>
            ) : (
              placed.map((wordIdx) => (
                <TrayMagnet
                  key={`picked-${wordIdx}`}
                  idx={wordIdx}
                  isDragDisabled={isCompleted}
                  onClick={() => handleTap(wordIdx)}
                  className={`${CHIP_CLASS} ${theme.primaryBtnClass}`}
                >
                  {scrambledWords[wordIdx]}
                </TrayMagnet>
              ))
            )}
          </SortableContext>
        </MagnetDropZone>

        {/* Word Bank Tiles */}
        <MagnetDropZone
          id={MAGNET_BANK_ID}
          aria-label="בנק המילים"
          className="flex flex-wrap items-center gap-2 rounded-2xl transition-shadow"
          overClassName={ZONE_OVER_CLASS}
          dir="ltr"
          lang="en"
        >
          {scrambledWords.map((word, idx) => (
            <div key={`bank-${idx}-${word}`} className="relative flex flex-col items-center">
              {placed.includes(idx) ? (
                <button
                  type="button"
                  disabled
                  className={`${CHIP_CLASS} transition-all opacity-30 scale-95 cursor-not-allowed bg-slate-400/20`}
                >
                  {word}
                </button>
              ) : (
                <DraggableMagnet
                  idx={idx}
                  isDragDisabled={isCompleted}
                  disabled={isCompleted}
                  onClick={() => handleTap(idx)}
                  className={`${CHIP_CLASS} transition-all ${theme.secondaryBtnClass}`}
                >
                  {word}
                </DraggableMagnet>
              )}
              {wordHelp && !isCompleted && wordHelp.isActive && wordHelp.canReveal(word) && (
                <button
                  type="button"
                  data-hint-target
                  onClick={() => wordHelp.onReveal(word)}
                  aria-label={`תרגום המילה ${word}`}
                  className="absolute -top-2 -end-2 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-amber-400 text-slate-900 shadow-md ring-2 ring-white/70"
                >
                  <Languages className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              {wordHelp?.revealedGlossFor(word) && (
                <span dir="rtl" lang="he" className="mt-0.5 text-xs font-bold text-amber-500">
                  {wordHelp.revealedGlossFor(word)}
                </span>
              )}
            </div>
          ))}
        </MagnetDropZone>

        <MagnetDragOverlay>
          {drag.activeIdx !== null && (
            <span className={`inline-block ${CHIP_CLASS} ${theme.primaryBtnClass}`}>
              {scrambledWords[drag.activeIdx]}
            </span>
          )}
        </MagnetDragOverlay>

        {!isCompleted && (
          <StickyActionBar theme={theme} className="justify-between">
            <Button theme={theme} size="lg" disabled={selectedIndices.length === 0} onClick={onCheck}>
              <span>בדיקת משפט ✓</span>
            </Button>
            <Button theme={theme} variant="secondary" onClick={onReset}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס מילים</span>
            </Button>
          </StickyActionBar>
        )}
      </div>
    </DndContext>
  );
};
