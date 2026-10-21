import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { playSfx } from '../../utils/sfx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Companion } from '../companion/Companion';
import { useAutoSpeakHebrew } from '../../hooks/useAutoSpeakHebrew';
import { HebrewSpeakButton } from './HebrewSpeakButton';
import { VibeAmount } from '../ui/VibeAmount';

interface FeedbackSheetProps {
  isCorrect: boolean;
  text: string;
  /** The step is done: show the next button instead of "try again" */
  showNext: boolean;
  nextLabel: string;
  onNext: () => void;
  /** Closes the sheet after a wrong answer so the learner can answer again */
  onTryAgain: () => void;
  tryAgainLabel: string;
  /** XP this answer adds to the mission total; floats off the sheet when above 0 */
  xpGain: number;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the feedback after its sound (Feature 47) */
  readsAloud?: boolean;
}

export const FEEDBACK_COMPANION_SIZE = 84;
/** How far the companion stands into the sheet; the rest of it stands above the sheet. */
const COMPANION_OVERLAP_PX = 14;

/**
 * Feature 25: drill feedback as a bottom sheet that slides up, with the companion cheering or
 * saying oops on its edge and the answer's XP floating off it. Replaces FeedbackBanner in the
 * mission runner; plays the same right / wrong sounds.
 */
export const FeedbackSheet: React.FC<FeedbackSheetProps> = ({
  isCorrect,
  text,
  showNext,
  nextLabel,
  onNext,
  onTryAgain,
  tryAgainLabel,
  xpGain,
  theme,
  readsAloud = false,
}) => {
  const actionRef = useRef<HTMLButtonElement>(null);
  // With reduced motion the XP stays put instead of floating away (and fading out).
  const isReducedMotion = usePrefersReducedMotion();
  useAutoSpeakHebrew(text, readsAloud);

  // A new message is a new answer: play its sound and move the focus to the sheet's button
  // (without scrolling the drill behind it).
  useEffect(() => {
    playSfx(isCorrect ? 'correct' : 'wrong');
    actionRef.current?.focus({ preventScroll: true });
  }, [isCorrect, text]);

  const sheetStyle = isCorrect
    ? 'bg-emerald-50 text-emerald-950 border-emerald-500'
    : 'bg-rose-50 text-rose-950 border-rose-500';

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center pointer-events-none">
      <div key={text} className="relative w-full max-w-3xl pointer-events-auto animate-sheet-up">
        <div className="absolute left-4" style={{ top: COMPANION_OVERLAP_PX - FEEDBACK_COMPANION_SIZE }}>
          <Companion theme={theme} pose={isCorrect ? 'cheer' : 'oops'} size={FEEDBACK_COMPANION_SIZE} hasShadow={false} />
        </div>
        {isCorrect && xpGain > 0 && (
          <span
            className={`absolute -top-9 right-6 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg ${isReducedMotion ? '' : 'animate-xp-float'}`}
            dir="ltr" lang="en"
            aria-hidden="true"
          >
            <VibeAmount amount={xpGain} hasPlus />
          </span>
        )}

        <div
          className={`rounded-t-3xl border-t-4 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] px-4 sm:px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-3.5 ${sheetStyle}`}
        >
          <div className="flex items-start gap-2.5 max-h-[38dvh] overflow-y-auto">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            {/* Announced as it appears; focus then moves to the button, which reads only its own name */}
            <p className="flex-1 text-sm md:text-base font-extrabold leading-relaxed" role="alert">
              <span className="sr-only">{isCorrect ? 'נכון! ' : 'לא נכון. '}</span>
              {text}
            </p>
            <HebrewSpeakButton text={text} label="הקשבה למשוב" />
          </div>

          {showNext ? (
            <button
              type="button"
              onClick={onNext}
              ref={actionRef}
              className="btn-chunky btn-chunky-correct w-full py-3.5 rounded-2xl bg-emerald-500 text-white text-base font-extrabold flex items-center justify-center gap-2"
            >
              <span>{nextLabel}</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onTryAgain}
              ref={actionRef}
              className="btn-chunky btn-chunky-wrong w-full py-3.5 rounded-2xl bg-white border-2 border-rose-500 text-rose-700 text-base font-extrabold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{tryAgainLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
