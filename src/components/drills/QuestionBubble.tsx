import React from 'react';
import { Volume2 } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { toSpeakableText } from '../../services/tts/ttsText';

interface QuestionBubbleProps {
  questionEn: string;
  /** Text read aloud by the speaker button; defaults to `questionEn`. */
  readAloudText?: string;
  speakerAvatar?: string;
  speakerName?: string;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

export const QuestionBubble: React.FC<QuestionBubbleProps> = ({
  questionEn,
  readAloudText,
  speakerAvatar,
  speakerName,
  theme,
  onSpeakEnglish,
}) => (
  <div className={`p-4 md:p-5 rounded-2xl ${theme.cardBgClass} flex items-start justify-between gap-3`}>
    <div className="flex items-start gap-3">
      {speakerAvatar && (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${theme.primaryBtnClass}`}>
          {speakerAvatar}
        </div>
      )}
      <div>
        {speakerName && (
          <div className="text-xs font-bold opacity-75 mb-0.5">
            {speakerName}
          </div>
        )}
        <p className="text-base md:text-xl font-extrabold leading-snug" dir="ltr" lang="en">
          {questionEn}
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => onSpeakEnglish(toSpeakableText(readAloudText || questionEn), 0.92)}
      className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
      aria-label="השמעת השאלה"
      title="השמעת השאלה"
    >
      <Volume2 className="w-4 h-4" aria-hidden="true" />
    </button>
  </div>
);
