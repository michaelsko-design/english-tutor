import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { RotateCcw } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { MagnetChange, toggleMagnet, toMagnetId } from '../../utils/magnetOrder';
import { playSfx } from '../../utils/sfx';
import {
  BankMagnet,
  MAGNET_BANK_ID,
  MAGNET_TRAY_ID,
  MagnetDragOverlay,
  MagnetDropZone,
  TrayMagnet,
  useMagnetDrag,
} from './magnetDrag';

interface SentenceBuilderDrillProps {
  scrambledWords: string[];
  targetSentenceHe?: string;
  selectedIndices: number[];
  isCompleted: boolean;
  /** A word was placed (tap or drop), taken back, or moved to another spot in the sentence */
  onChangeOrder: (nextIndices: number[], change: MagnetChange) => void;
  onReset: () => void;
  onCheck: () => void;
  theme: ThemeDefinition;
}

const CHIP_CLASS = 'px-3.5 py-2 rounded-xl text-sm font-extrabold';
const ZONE_OVER_CLASS = 'ring-2 ring-purple-400/70';

export const SentenceBuilderDrill: React.FC<SentenceBuilderDrillProps> = ({
  scrambledWords,
  targetSentenceHe,
  selectedIndices,
  isCompleted,
  onChangeOrder,
  onReset,
  onCheck,
  theme,
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
      <div className="space-y-4">
        {targetSentenceHe && (
          <div className="text-sm font-bold opacity-85">
            משפט היעד לתרגום: &ldquo;{targetSentenceHe}&rdquo;
          </div>
        )}

        {/* Assembled Sentence Tray */}
        <MagnetDropZone
          id={MAGNET_TRAY_ID}
          aria-label="המשפט"
          className="min-h-[68px] p-4 rounded-2xl border-2 border-dashed border-purple-400/60 bg-black/5 dark:bg-white/5 flex flex-wrap items-center gap-2 transition-shadow"
          overClassName={ZONE_OVER_CLASS}
          dir="ltr"
          lang="en"
        >
          <SortableContext items={placed.map(toMagnetId)} strategy={rectSortingStrategy}>
            {placed.length === 0 ? (
              <span className="text-xs opacity-60">
                Tap or drag the English words here in the correct order...
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
          {scrambledWords.map((word, idx) =>
            placed.includes(idx) ? (
              <button
                key={`bank-${idx}-${word}`}
                type="button"
                disabled
                className={`${CHIP_CLASS} transition-all opacity-30 scale-95 cursor-not-allowed bg-slate-400/20`}
              >
                {word}
              </button>
            ) : (
              <BankMagnet
                key={`bank-${idx}-${word}`}
                idx={idx}
                isDragDisabled={isCompleted}
                disabled={isCompleted}
                onClick={() => handleTap(idx)}
                className={`${CHIP_CLASS} transition-all ${theme.secondaryBtnClass}`}
              >
                {word}
              </BankMagnet>
            )
          )}
        </MagnetDropZone>

        <MagnetDragOverlay>
          {drag.activeIdx !== null && (
            <span className={`inline-block ${CHIP_CLASS} ${theme.primaryBtnClass}`}>
              {scrambledWords[drag.activeIdx]}
            </span>
          )}
        </MagnetDragOverlay>

        {!isCompleted && (
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onReset}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס מילים</span>
            </button>
            <button
              type="button"
              disabled={selectedIndices.length === 0}
              onClick={onCheck}
              className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-extrabold ${theme.primaryBtnClass} disabled:opacity-40`}
            >
              <span>בדיקת משפט ✓</span>
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );
};
