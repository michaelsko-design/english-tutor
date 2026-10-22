import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_TEXT } from '../SpeakIcon';
import { Button } from '../ui/Button';

interface PassageBoxProps {
  passageEn: string;
  passageHe?: string;
  showHebrew: boolean;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  className?: string;
}

export const PassageBox: React.FC<PassageBoxProps> = ({
  passageEn,
  passageHe,
  showHebrew,
  theme,
  onSpeakEnglish,
  className = '',
}) => {
  const speech = useSpeechToggle(onSpeakEnglish, passageEn, 0.92);
  return (
    <div className={`p-3 sm:p-4 md:p-5 rounded-2xl ${theme.cardBgClass} space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold uppercase tracking-wider opacity-75">
          📖 Reading Passage · קטע קריאה
        </span>
        <Button theme={theme} variant="secondary" size="sm" onClick={speech.toggle}>
          <SpeakIcon isSpeaking={speech.isSpeaking} className="w-3.5 h-3.5" />
          {speech.isSpeaking ? <span>{STOP_SPEECH_TEXT}</span> : <span dir="ltr" lang="en">Listen to Story 🔊</span>}
        </Button>
      </div>
      {/* Short screens: the passage scrolls in its own box, so the question and answers stay on screen */}
      <div
        className="text-sm md:text-base font-medium leading-relaxed short:max-h-[28dvh] short:overflow-y-auto"
        role="region"
        aria-label="קטע הקריאה"
        tabIndex={0}
      >
        <p dir="ltr" lang="en">
          {passageEn}
        </p>
      </div>
      {showHebrew && passageHe && (
        <p className={`text-xs ${theme.mutedTextClass} pt-1 border-t border-current/10`}>
          {passageHe}
        </p>
      )}
    </div>
  );
};
