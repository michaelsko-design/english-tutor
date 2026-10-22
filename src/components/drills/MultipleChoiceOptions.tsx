import React from 'react';
import { Check, X } from 'lucide-react';
import { MultipleChoiceOption } from '../../data/missionExercises';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { getTextLang } from '../../utils/bidi';
import { OptionSpeakButton } from './OptionSpeakButton';

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
  /** Reads an English option; with it every option gets a 🔊 that only listens (Feature 47) */
  onSpeakEnglish?: (text: string, rate?: number) => void;
}

const CORRECT_STYLE = 'bg-emerald-500/20 border-2 border-emerald-500 btn-chunky-correct';
const WRONG_STYLE = 'bg-rose-500/20 border-2 border-rose-500 btn-chunky-wrong';

/**
 * Chunky answer buttons (Feature 25): a pressed edge, the answer text only, and a check or a
 * cross once picked. The picked right answer bounces and a wrong one shakes.
 */
export const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  options,
  selectedIdx,
  onSelect,
  theme,
  revealCorrect = false,
  onSpeakEnglish,
}) => {
  const isLocked = revealCorrect && selectedIdx !== null;

  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt, idx) => {
        const isPicked = selectedIdx === idx;
        const isRevealed = isLocked && !isPicked && opt.isCorrect;
        const isShownCorrect = (isPicked && opt.isCorrect) || isRevealed;
        const isShownWrong = isPicked && !opt.isCorrect;

        let stateStyle = theme.cardBgClass;
        if (isShownCorrect) stateStyle = CORRECT_STYLE;
        else if (isShownWrong) stateStyle = WRONG_STYLE;
        const motionStyle = isPicked ? (opt.isCorrect ? 'animate-answer-bounce' : 'animate-answer-shake') : '';

        const lang = getTextLang(opt.textEn);
        // A letter or a picture (grade 1's letters and blending steps) is shown very large
        const isGlyph = !/\p{L}{2}/u.test(opt.textEn);
        // A picture (drawn emoji, hidden from screen readers) is named by the word it shows
        const pictureWordEn = opt.speakEn && !/\p{L}/u.test(opt.textEn) ? opt.speakEn : null;

        return (
          <div key={opt.textEn} className="flex items-stretch gap-2">
            <OptionSpeakButton
              text={opt.speakEn ?? opt.textEn}
              onSpeakEnglish={onSpeakEnglish}
              className={theme.secondaryBtnClass}
            />
            <button
              type="button"
              disabled={isLocked}
              onClick={() => onSelect(idx)}
              dir="auto"
              className={`btn-chunky flex-1 min-w-0 text-start px-4 py-3.5 min-h-[56px] rounded-2xl flex items-center justify-between gap-3 ${stateStyle} ${motionStyle}`}
            >
              <span
                className={`font-extrabold leading-snug ${isGlyph ? 'text-4xl md:text-5xl w-full text-center' : 'text-base md:text-lg'}`}
                lang={lang}
              >
                {opt.textEn}
              </span>
              {pictureWordEn && (
                <span className="sr-only" lang="en">
                  {pictureWordEn}
                </span>
              )}
              {isShownCorrect && (
                <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
                  <span className="sr-only">תשובה נכונה</span>
                </span>
              )}
              {isShownWrong && (
                <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <X className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
                  <span className="sr-only">תשובה שגויה</span>
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
