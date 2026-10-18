import React from 'react';
import { RotateCcw, Volume2 } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { playSfx } from '../../utils/sfx';

interface SpellingMagnetDrillProps {
  /** The word or phrase to spell; spaces, hyphens and apostrophes are shown, not spelled */
  targetEn: string;
  /** The word's letters in shuffled order, one tile each */
  letterTiles: string[];
  translationHe?: string;
  selectedIndices: number[];
  isCompleted: boolean;
  onToggleTile: (tileIdx: number) => void;
  onReset: () => void;
  onCheck: () => void;
  onListen: () => void;
  theme: ThemeDefinition;
}

const SPELLED_CHAR = /[A-Za-z0-9]/;

/** Letter magnets: tap the letter tiles in order to spell the word you hear. */
export const SpellingMagnetDrill: React.FC<SpellingMagnetDrillProps> = ({
  targetEn,
  letterTiles,
  translationHe,
  selectedIndices,
  isCompleted,
  onToggleTile,
  onReset,
  onCheck,
  onListen,
  theme,
}) => {
  // Lay the picked letters into the word's letter slots, keeping spaces and punctuation fixed.
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
    const tileIdx = selectedIndices[letterPos];
    letterPos += 1;
    return tileIdx === undefined ? (
      <span
        key={`slot-${idx}`}
        className="w-9 h-11 rounded-xl border-2 border-dashed border-purple-400/50 bg-black/5 dark:bg-white/5"
      />
    ) : (
      <button
        key={`slot-${idx}`}
        type="button"
        disabled={isCompleted}
        onClick={() => {
          playSfx('tap');
          onToggleTile(tileIdx);
        }}
        className={`w-9 h-11 rounded-xl text-lg font-extrabold ${theme.primaryBtnClass}`}
      >
        {letterTiles[tileIdx]}
      </button>
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3" dir="rtl">
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
      <div className="min-h-[68px] p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
        {slots}
      </div>

      {/* Letter tiles */}
      <div className="flex flex-wrap items-center justify-center gap-2" dir="ltr">
        {letterTiles.map((letter, idx) => {
          const isUsed = selectedIndices.includes(idx);
          return (
            <button
              key={`tile-${idx}-${letter}`}
              type="button"
              disabled={isUsed || isCompleted}
              onClick={() => {
                playSfx('tap');
                onToggleTile(idx);
              }}
              aria-label={`letter ${letter}`}
              className={`w-11 h-11 rounded-xl text-lg font-extrabold transition-all ${
                isUsed ? 'opacity-30 scale-95 cursor-not-allowed bg-slate-400/20' : theme.secondaryBtnClass
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {!isCompleted && (
        <div className="flex items-center gap-2.5 pt-1" dir="rtl">
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
  );
};
