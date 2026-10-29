import React, { useEffect, useId, useRef, useState } from 'react';
import { getWordRevealLimit, WordGloss } from '../../utils/hints';
import { Lightbulb } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useAutoSpeakHebrew } from '../../hooks/useAutoSpeakHebrew';
import { HebrewSpeakButton } from './HebrewSpeakButton';

interface HintPopoverProps {
  hintHe: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the hint as it opens (Feature 47) */
  readsAloud?: boolean;
  /** Sentence-builder: words the learner may tap to reveal a Hebrew translation (a couple at most) */
  hintWords?: WordGloss[];
  /** Words in the whole sentence: longer sentences allow a second reveal */
  sentenceWordCount?: number;
  /** Resets the revealed words when the step changes */
  stepId?: string;
}

interface RevealableWordsProps {
  words: WordGloss[];
  limit: number;
}

const RevealableWords: React.FC<RevealableWordsProps> = ({ words, limit }) => {
  const [revealed, setRevealed] = useState<string[]>([]);
  const left = limit - revealed.length;
  return (
    <div className="mt-3 pt-3 border-t border-amber-400/30 space-y-2">
      <p className="text-xs font-bold">
        {left > 0
          ? `לא בטוחים במילה? לחצו עליה כדי לראות מה היא אומרת (אפשר לגלות עוד ${left === 1 ? 'מילה אחת' : `${left} מילים`}).`
          : 'כל המילים שאפשר כבר נחשפו.'}
      </p>
      <ul className="flex flex-wrap gap-2">
        {words.map(({ wordEn, translationHe }) => {
          const isRevealed = revealed.includes(wordEn);
          return (
            <li key={wordEn}>
              <button
                type="button"
                disabled={!isRevealed && left <= 0}
                aria-pressed={isRevealed}
                onClick={() => setRevealed((prev) => (prev.includes(wordEn) ? prev : [...prev, wordEn]))}
                className="min-h-11 px-3 rounded-xl border border-amber-400/60 text-xs font-extrabold disabled:opacity-40"
              >
                <bdi dir="ltr" lang="en">{wordEn}</bdi>
                {isRevealed && <span> = {translationHe}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/**
 * The 💡 hint button for a runner's header. The hint opens in a popover only when tapped, and
 * closes on a second tap, a tap outside or Escape (which does not close the runner itself).
 */
export const HintPopover: React.FC<HintPopoverProps> = ({
  hintHe,
  isOpen,
  onToggle,
  theme,
  readsAloud = false,
  hintWords,
  sentenceWordCount = 0,
  stepId,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  useAutoSpeakHebrew(hintHe, readsAloud && isOpen, 0);

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) onToggle(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, onToggle]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape' || !isOpen) return;
    event.stopPropagation();
    onToggle(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`min-h-11 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
      >
        <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
        <span>{isOpen ? 'הסתרת הרמז' : 'רמז'}</span>
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role="note"
          aria-label="רמז"
          tabIndex={-1}
          className={`absolute z-30 top-full mt-2 end-0 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl border border-amber-400/50 shadow-xl text-sm font-semibold leading-relaxed outline-none ${theme.pageBgClass} ${
            prefersReducedMotion ? '' : 'animate-lesson-card'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="flex-1">{hintHe}</span>
            <HebrewSpeakButton text={hintHe} label="הקשבה לרמז" />
          </div>
          {hintWords && hintWords.length > 0 && (
            <RevealableWords key={stepId} words={hintWords} limit={getWordRevealLimit(sentenceWordCount)} />
          )}
        </div>
      )}
    </div>
  );
};
