import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { RotateCcw, Volume2 } from 'lucide-react';
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

interface SpellingMagnetDrillProps {
  /** The word or phrase to spell; spaces, hyphens and apostrophes are shown, not spelled */
  targetEn: string;
  /** The word's letters in shuffled order, one tile each */
  letterTiles: string[];
  translationHe?: string;
  selectedIndices: number[];
  isCompleted: boolean;
  /** A letter was placed (tap or drop), taken back, or moved to another slot */
  onChangeOrder: (nextIndices: number[], change: MagnetChange) => void;
  onReset: () => void;
  onCheck: () => void;
  onListen: () => void;
  theme: ThemeDefinition;
}

const SPELLED_CHAR = /[A-Za-z0-9]/;
const ZONE_OVER_CLASS = 'ring-2 ring-purple-400/70';

/** Letter magnets: tap or drag the letter tiles into order to spell the word you hear. */
export const SpellingMagnetDrill: React.FC<SpellingMagnetDrillProps> = ({
  targetEn,
  letterTiles,
  translationHe,
  selectedIndices,
  isCompleted,
  onChangeOrder,
  onReset,
  onCheck,
  onListen,
  theme,
}) => {
  const drag = useMagnetDrag({
    order: selectedIndices,
    isDisabled: isCompleted,
    getLabel: (idx) => letterTiles[idx] ?? '',
    trayLabelHe: 'המילה',
    bankLabelHe: 'האותיות',
    onChangeOrder,
  });
  const placed = drag.order;

  const handleTap = (tileIdx: number) => {
    if (drag.shouldIgnoreClick()) return;
    playSfx('tap');
    const { order, change } = toggleMagnet(selectedIndices, tileIdx);
    onChangeOrder(order, change);
  };

  // Lay the placed letters into the word's letter slots, keeping spaces and punctuation fixed.
  let letterPos = 0;
  const slots = targetEn.split('').map((ch, idx) => {
    if (!SPELLED_CHAR.test(ch)) {
      return ch === ' ' ? (
        <span key={`gap-${idx}`} className="w-3" aria-hidden="true" />
      ) : (
        <span key={`fixed-${idx}`} className="text-lg font-extrabold opacity-70">
          {ch}
        </span>
      );
    }
    const tileIdx = placed[letterPos];
    letterPos += 1;
    return tileIdx === undefined ? (
      <span
        key={`slot-${idx}`}
        className="w-9 h-11 rounded-xl border-2 border-dashed border-purple-400/50 bg-black/5 dark:bg-white/5"
      />
    ) : (
      <TrayMagnet
        key={`tile-${tileIdx}`}
        idx={tileIdx}
        isDragDisabled={isCompleted}
        disabled={isCompleted}
        onClick={() => handleTap(tileIdx)}
        aria-label={`letter ${letterTiles[tileIdx]}`}
        className={`w-9 h-11 rounded-xl text-lg font-extrabold ${theme.primaryBtnClass}`}
      >
        {letterTiles[tileIdx]}
      </TrayMagnet>
    );
  });

  return (
    <DndContext {...drag.contextProps}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onListen}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
          >
            <Volume2 className="w-4 h-4" />
            <span>🔊 האזנה למילה</span>
          </button>
          {translationHe && (
            <span className="text-sm font-bold opacity-85">
              פירוש: &ldquo;{translationHe}&rdquo;
            </span>
          )}
        </div>

        {/* Letter slots */}
        <MagnetDropZone
          id={MAGNET_TRAY_ID}
          aria-label="המילה"
          className="min-h-[68px] p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-wrap items-center justify-center gap-1.5 transition-shadow"
          overClassName={ZONE_OVER_CLASS}
          dir="ltr"
          lang="en"
        >
          <SortableContext items={placed.map(toMagnetId)} strategy={rectSortingStrategy}>
            {slots}
          </SortableContext>
        </MagnetDropZone>

        {/* Letter tiles */}
        <MagnetDropZone
          id={MAGNET_BANK_ID}
          aria-label="האותיות"
          className="flex flex-wrap items-center justify-center gap-2 rounded-2xl transition-shadow"
          overClassName={ZONE_OVER_CLASS}
          dir="ltr"
          lang="en"
        >
          {letterTiles.map((letter, idx) =>
            placed.includes(idx) ? (
              <button
                key={`tile-${idx}-${letter}`}
                type="button"
                disabled
                aria-label={`letter ${letter}`}
                className="w-11 h-11 rounded-xl text-lg font-extrabold transition-all opacity-30 scale-95 cursor-not-allowed bg-slate-400/20"
              >
                {letter}
              </button>
            ) : (
              <BankMagnet
                key={`tile-${idx}-${letter}`}
                idx={idx}
                isDragDisabled={isCompleted}
                disabled={isCompleted}
                onClick={() => handleTap(idx)}
                aria-label={`letter ${letter}`}
                className={`w-11 h-11 rounded-xl text-lg font-extrabold transition-all ${theme.secondaryBtnClass}`}
              >
                {letter}
              </BankMagnet>
            )
          )}
        </MagnetDropZone>

        <MagnetDragOverlay>
          {drag.activeIdx !== null && (
            <span
              className={`w-11 h-11 rounded-xl text-lg font-extrabold flex items-center justify-center ${theme.primaryBtnClass}`}
            >
              {letterTiles[drag.activeIdx]}
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
              <span>איפוס אותיות</span>
            </button>
            <button
              type="button"
              disabled={selectedIndices.length < letterTiles.length}
              onClick={onCheck}
              className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-extrabold ${theme.primaryBtnClass} disabled:opacity-40`}
            >
              בדיקת איות ✓
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );
};
