import React from 'react';
import { Volume2 } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface PassageBoxProps {
  passageEn: string;
  passageHe?: string;
  showHebrew: boolean;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

export const PassageBox: React.FC<PassageBoxProps> = ({
  passageEn,
  passageHe,
  showHebrew,
  theme,
  onSpeakEnglish,
}) => (
  <div className={`p-4 md:p-5 rounded-2xl ${theme.cardBgClass} space-y-2.5`}>
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-extrabold uppercase tracking-wider opacity-75">
        📖 Reading Passage · קטע קריאה
      </span>
      <button
        type="button"
        onClick={() => onSpeakEnglish(passageEn, 0.92)}
        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>Listen to Story 🔊</span>
      </button>
    </div>
    <p className="text-sm md:text-base font-bold leading-relaxed" dir="ltr">
      {passageEn}
    </p>
    {showHebrew && passageHe && (
      <p className={`text-xs ${theme.mutedTextClass} pt-1 border-t border-current/10`} dir="rtl">
        {passageHe}
      </p>
    )}
  </div>
);
