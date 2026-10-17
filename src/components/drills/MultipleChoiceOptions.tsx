import React from 'react';
import { MultipleChoiceOption } from '../../data/missionExercises';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface MultipleChoiceOptionsProps {
  options: MultipleChoiceOption[];
  selectedIdx: number | null;
  onSelect: (idx: number) => void;
  theme: ThemeDefinition;
  /**
   * Mock-exam mode: once any option is picked, also highlight the correct
   * option and disable every option so the answer is locked in.
   */
  revealCorrect?: boolean;
}

export const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  options,
  selectedIdx,
  onSelect,
  theme,
  revealCorrect = false,
}) => {
  const isLocked = revealCorrect && selectedIdx !== null;

  return (
    <div className="grid grid-cols-1 gap-2.5">
      {options.map((opt, idx) => {
        const isPicked = selectedIdx === idx;
        const isRevealed = isLocked && !isPicked && opt.isCorrect;
        let borderStyle = theme.cardBgClass;
        if (isPicked) {
          borderStyle = opt.isCorrect
            ? 'bg-emerald-500/20 border-2 border-emerald-500'
            : 'bg-rose-500/20 border-2 border-rose-500';
        } else if (isRevealed) {
          borderStyle = 'bg-emerald-500/20 border-2 border-emerald-500';
        }

        return (
          <button
            key={opt.textEn}
            type="button"
            disabled={isLocked}
            onClick={() => onSelect(idx)}
            className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between gap-3 ${borderStyle}`}
          >
            <span className="font-extrabold text-sm md:text-base" dir="ltr">
              {opt.textEn}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 shrink-0">
              {isPicked
                ? opt.isCorrect
                  ? '✅ Correct'
                  : revealCorrect
                  ? '❌ Wrong'
                  : '❌ Try Again'
                : isRevealed
                ? '✅ Correct'
                : 'Select'}
            </span>
          </button>
        );
      })}
    </div>
  );
};
