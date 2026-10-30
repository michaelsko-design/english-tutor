import React, { useEffect, useId, useRef } from 'react';
import { Languages, Lightbulb } from 'lucide-react';
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
  /** Sentence-builder: translations the learner may still reveal from the word bank (icons next to the words) */
  translationsLeft?: number;
}

const TranslateInstruction: React.FC<{ left: number }> = ({ left }) => (
  <p className="mt-3 pt-3 border-t border-amber-400/30 text-xs font-bold flex items-start gap-2">
    <Languages className="w-4 h-4 shrink-0 text-amber-500" aria-hidden="true" />
    <span>
      {left > 0
        ? `אפשר לתרגם ${left === 1 ? 'מילה אחת' : `${left} מילים`}. לחצו על סמל התרגום שליד המילה שבבנק המילים.`
        : 'כל המילים שאפשר כבר תורגמו.'}
    </span>
  </p>
);

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
  translationsLeft,
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
      const target = event.target as Element;
      // The translate icons in the word bank belong to the hint: tapping one keeps it open
      if (wrapperRef.current?.contains(target) || target.closest?.('[data-hint-target]')) return;
      onToggle(false);
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
          {translationsLeft !== undefined && <TranslateInstruction left={translationsLeft} />}
        </div>
      )}
    </div>
  );
};
