import React, { useEffect, useRef, useState } from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { letterToken } from '../../services/tts/ttsText';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Button } from '../ui/Button';

interface SoundTilesProps {
  /** The word's sounds in order ("sh", "i", "p") */
  tiles: string[];
  word: string;
  /** Whether the ➡️ button may read the word (hidden in Master's reading check) */
  canSlide: boolean;
  onSpeakEnglish: (text: string, rate?: number) => void;
  theme: ThemeDefinition;
}

/** How long each tile lights before the next one, while sliding */
const TILE_STEP_MS = 450;
/** The slow rate the slid word is read at (single words have a slow clip) */
const SLIDE_RATE = 0.7;

/**
 * Feature 48: a word as letter tiles, for grade 1's blending steps. Tapping a tile says its
 * letter's name; ➡️ lights the tiles one by one, left to right, then reads the word slowly, so the
 * learner sees the letters join into the word they hear.
 */
export const SoundTiles: React.FC<SoundTilesProps> = ({ tiles, word, canSlide, onSpeakEnglish, theme }) => {
  const [litCount, setLitCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  // A new word starts dark
  useEffect(() => setLitCount(0), [word]);

  const handleSlide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (prefersReducedMotion) {
      setLitCount(tiles.length);
      onSpeakEnglish(word, SLIDE_RATE);
      return;
    }
    const lightNext = (count: number) => {
      setLitCount(count);
      if (count >= tiles.length) {
        onSpeakEnglish(word, SLIDE_RATE);
        return;
      }
      timerRef.current = setTimeout(() => lightNext(count + 1), TILE_STEP_MS);
    };
    lightNext(1);
  };

  return (
    <div className={`p-4 md:p-6 rounded-3xl border-2 border-current/15 ${theme.cardBgClass} space-y-4`}>
      <div className="flex justify-center gap-2.5" dir="ltr" lang="en">
        {tiles.map((tile, idx) => {
          const isLit = idx < litCount;
          return (
            <button
              key={`${tile}-${idx}`}
              type="button"
              onClick={() => onSpeakEnglish(letterToken(tile))}
              aria-label={`האות ${tile}`}
              className={`min-w-16 h-20 px-3 rounded-2xl text-5xl font-black flex items-center justify-center border-b-4 transition-colors ${
                isLit ? 'bg-amber-300 text-slate-950 border-amber-500' : 'bg-white/80 dark:bg-white/10 border-black/15'
              }`}
            >
              {tile}
            </button>
          );
        })}
      </div>
      {canSlide && (
        <div className="flex justify-center">
          <Button theme={theme} variant="secondary" size="lg" onClick={handleSlide}>
            <span aria-hidden="true">➡️</span>
            <span>מחברים את האותיות</span>
          </Button>
        </div>
      )}
    </div>
  );
};
