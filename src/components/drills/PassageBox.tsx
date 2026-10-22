import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_TEXT } from '../SpeakIcon';
import { Button } from '../ui/Button';

interface PassageBoxProps {
  passageEn: string;
  passageHe?: string;
  /** The Hebrew translation can be opened (the easiest tier); it starts hidden, like a clue */
  canRevealHebrew: boolean;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  className?: string;
}

export const PassageBox: React.FC<PassageBoxProps> = ({
  passageEn,
  passageHe,
  canRevealHebrew,
  theme,
  onSpeakEnglish,
  className = '',
}) => {
  const speech = useSpeechToggle(onSpeakEnglish, passageEn, 0.92);
  const [isHebrewShown, setIsHebrewShown] = useState(false);
  const hasTranslation = canRevealHebrew && Boolean(passageHe);

  return (
    <div className={`p-3 sm:p-4 md:p-5 rounded-2xl ${theme.cardBgClass} space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold uppercase tracking-wider opacity-75">
          📖 Reading Passage · קטע קריאה
        </span>
        <Button theme={theme} variant="secondary" size="sm" className="whitespace-nowrap" onClick={speech.toggle}>
          <SpeakIcon isSpeaking={speech.isSpeaking} className="w-3.5 h-3.5" />
          {speech.isSpeaking ? <span>{STOP_SPEECH_TEXT}</span> : <span dir="ltr" lang="en">Listen to Story</span>}
        </Button>
      </div>
      {/* Short wide screens: the passage scrolls in its own box, so the question and answers stay
          on screen (phones show the passage on its own screen first) */}
      <div
        className="text-sm md:text-base font-medium leading-relaxed space-y-2 sm:short:max-h-[28dvh] sm:short:overflow-y-auto"
        role="region"
        aria-label="קטע הקריאה"
        tabIndex={0}
      >
        <p dir="ltr" lang="en">
          {passageEn}
        </p>
        {hasTranslation && isHebrewShown && (
          <p id="passage-translation" className={`text-xs ${theme.mutedTextClass} pt-1 border-t border-current/10`}>
            {passageHe}
          </p>
        )}
      </div>
      {hasTranslation && (
        <button
          type="button"
          onClick={() => setIsHebrewShown((isShown) => !isShown)}
          aria-expanded={isHebrewShown}
          aria-controls="passage-translation"
          className={`min-h-11 px-3 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <Languages className="w-4 h-4" aria-hidden="true" />
          <span>{isHebrewShown ? 'הסתרת התרגום' : 'רמז: הצגת תרגום לעברית'}</span>
        </button>
      )}
    </div>
  );
};
