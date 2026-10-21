import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { RotateCcw } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { isEverySlotFilled, placeLetter, takeBackLetter, toSlots } from '../../utils/letterSlots';
import { playSfx } from '../../utils/sfx';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_TEXT } from '../SpeakIcon';
import { LetterSlot, useLetterSlotDrag } from './letterSlotDrag';
import { DraggableMagnet, MAGNET_BANK_ID, MagnetDragOverlay, MagnetDropZone } from './magnetDrag';
import { Button } from '../ui/Button';

interface SpellingMagnetDrillProps {
  /** The word or phrase to spell; spaces, hyphens and apostrophes are shown, not spelled */
  targetEn: string;
  /** The word's letters in shuffled order, one tile each */
  letterTiles: string[];
  translationHe?: string;
  /** The tile in each letter slot of the word, null for an open slot (an empty list means all open) */
  slots: (number | null)[];
  isCompleted: boolean;
  /** A letter was placed, moved, swapped or taken back */
  onChangeSlots: (next: (number | null)[]) => void;
  onReset: () => void;
  onCheck: () => void;
  /** What the listen button reads, and how fast */
  listenEn: string;
  listenRate: number;
  onSpeakEnglish: (text: string, rate?: number) => void;
  theme: ThemeDefinition;
}

const SPELLED_CHAR = /[A-Za-z0-9]/;
const SLOT_CLASS = 'w-9 h-11 rounded-xl flex transition-shadow';
const OPEN_SLOT_CLASS = 'border-2 border-dashed border-purple-400/50 bg-black/5 dark:bg-white/5';
const SLOT_OVER_CLASS = 'ring-2 ring-purple-400/80';
const ZONE_OVER_CLASS = 'ring-2 ring-purple-400/70';

/** Letter magnets: tap the letter tiles, or drag them into any slot, to spell the word you hear. */
export const SpellingMagnetDrill: React.FC<SpellingMagnetDrillProps> = ({
  targetEn,
  letterTiles,
  translationHe,
  slots,
  isCompleted,
  onChangeSlots,
  onReset,
  onCheck,
  listenEn,
  listenRate,
  onSpeakEnglish,
  theme,
}) => {
  const listenSpeech = useSpeechToggle(onSpeakEnglish, listenEn, listenRate);
  const slotCount = letterTiles.length;
  const filledSlots = toSlots(slots, slotCount);
  const drag = useLetterSlotDrag({
    slots: filledSlots,
    slotCount,
    isDisabled: isCompleted,
    getLabel: (idx) => letterTiles[idx] ?? '',
    bankLabelHe: 'האותיות',
    onChangeSlots,
  });

  const handleTapBank = (tileIdx: number) => {
    if (drag.shouldIgnoreClick()) return;
    playSfx('tap');
    onChangeSlots(placeLetter(filledSlots, slotCount, tileIdx));
  };

  const handleTapPlaced = (tileIdx: number) => {
    if (drag.shouldIgnoreClick()) return;
    playSfx('tap');
    onChangeSlots(takeBackLetter(filledSlots, slotCount, tileIdx));
  };

  // Lay out the word's letter slots, keeping spaces and punctuation fixed.
  let letterPos = 0;
  const slotElements = targetEn.split('').map((ch, charIdx) => {
    if (!SPELLED_CHAR.test(ch)) {
      return ch === ' ' ? (
        <span key={`gap-${charIdx}`} className="w-3" aria-hidden="true" />
      ) : (
        <span key={`fixed-${charIdx}`} className="text-lg font-extrabold opacity-70">
          {ch}
        </span>
      );
    }
    const pos = letterPos;
    letterPos += 1;
    const tileIdx = filledSlots[pos];
    return (
      <LetterSlot
        key={`slot-${pos}`}
        pos={pos}
        className={`${SLOT_CLASS} ${tileIdx === null || tileIdx === undefined ? OPEN_SLOT_CLASS : ''}`}
        overClassName={SLOT_OVER_CLASS}
      >
        {tileIdx !== null && tileIdx !== undefined && (
          <DraggableMagnet
            idx={tileIdx}
            isDragDisabled={isCompleted}
            isKeyboardDraggable
            disabled={isCompleted}
            onClick={() => handleTapPlaced(tileIdx)}
            aria-label={`letter ${letterTiles[tileIdx]}`}
            className={`w-full h-full rounded-xl text-lg font-extrabold ${theme.primaryBtnClass}`}
          >
            {letterTiles[tileIdx]}
          </DraggableMagnet>
        )}
      </LetterSlot>
    );
  });

  return (
    <DndContext {...drag.contextProps}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button theme={theme} variant="secondary" onClick={listenSpeech.toggle}>
            <SpeakIcon isSpeaking={listenSpeech.isSpeaking} />
            <span>{listenSpeech.isSpeaking ? STOP_SPEECH_TEXT : '🔊 האזנה למילה'}</span>
          </Button>
          {translationHe && (
            <span className="text-sm font-bold opacity-85">
              פירוש: &ldquo;{translationHe}&rdquo;
            </span>
          )}
        </div>

        {/* Letter slots */}
        <div
          aria-label="המילה"
          className="min-h-[68px] p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-wrap items-center justify-center gap-1.5"
          dir="ltr"
          lang="en"
        >
          {slotElements}
        </div>

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
            filledSlots.includes(idx) ? (
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
              <DraggableMagnet
                key={`tile-${idx}-${letter}`}
                idx={idx}
                isDragDisabled={isCompleted}
                disabled={isCompleted}
                onClick={() => handleTapBank(idx)}
                aria-label={`letter ${letter}`}
                className={`w-11 h-11 rounded-xl text-lg font-extrabold transition-all ${theme.secondaryBtnClass}`}
              >
                {letter}
              </DraggableMagnet>
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
            <Button theme={theme} variant="secondary" onClick={onReset}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס אותיות</span>
            </Button>
            <Button theme={theme} disabled={!isEverySlotFilled(filledSlots, slotCount)} onClick={onCheck}>
              בדיקת איות ✓
            </Button>
          </div>
        )}
      </div>
    </DndContext>
  );
};
