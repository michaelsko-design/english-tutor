import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { playSfx } from '../../utils/sfx';
import { Companion } from '../companion/Companion';

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
}) => {
  const actionRef = useRef<HTMLButtonElement>(null);

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
            className="absolute -top-9 right-6 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg animate-xp-float"
            dir="ltr"
            aria-hidden="true"
          >
            +{xpGain} XP
          </span>
        )}

        <div
          className={`rounded-t-3xl border-t-4 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] px-4 sm:px-6 pt-4 pb-5 space-y-3.5 ${sheetStyle}`}
          dir="rtl"
        >
          <div className="flex items-start gap-2.5 max-h-[38vh] overflow-y-auto" role="status" aria-live="polite">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <p className="text-sm md:text-base font-extrabold leading-relaxed">{text}</p>
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
