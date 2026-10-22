import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { toSpeakableText } from '../../services/tts/ttsText';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_LABEL } from '../SpeakIcon';
import { HebrewSpeakButton } from './HebrewSpeakButton';
import { QuestionCardContent, splitBlanks } from './questionCard';

interface QuestionBubbleProps {
  content: QuestionCardContent;
  /** Text read aloud by the speaker button; defaults to the card text. English cards only. */
  readAloudText?: string;
  speakerAvatar?: string;
  speakerName?: string;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

const TEXT_SIZE_CLASS: Record<QuestionCardContent['size'], string> = {
  sentence: 'text-fluid-sentence sm:text-fluid-sentence-sm md:text-fluid-sentence-lg leading-snug',
  word: 'text-fluid-word md:text-fluid-word-lg leading-tight text-center',
  glyph: 'text-fluid-glyph md:text-fluid-glyph-lg leading-none text-center',
};

const BlankSlot: React.FC<{ text: string }> = ({ text }) => (
  <span
    className="inline-block align-middle w-[3.5em] h-[1.15em] mx-1 rounded-lg border-2 border-dashed border-purple-400/80 bg-purple-400/10"
  >
    <span className="sr-only">{text}</span>
  </span>
);

/** The central question card: the exercise itself, in the largest text on the screen. */
export const QuestionBubble: React.FC<QuestionBubbleProps> = ({
  content,
  readAloudText,
  speakerAvatar,
  speakerName,
  theme,
  onSpeakEnglish,
}) => {
  const isEnglish = content.lang === 'en';
  // An empty readAloudText means nothing to hear (a reading check); the card text is read otherwise
  const spokenText = toSpeakableText(readAloudText ?? content.text);
  const speech = useSpeechToggle(onSpeakEnglish, spokenText, 0.92);
  const label = speech.isSpeaking ? STOP_SPEECH_LABEL : 'השמעת השאלה';
  const isWord = content.size !== 'sentence';

  return (
    <div
      className={`p-3 sm:p-4 md:p-6 rounded-3xl border-2 border-current/15 ${theme.cardBgClass} flex items-start gap-3`}
    >
      {speakerAvatar && (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${theme.primaryBtnClass}`}>
          {speakerAvatar}
        </div>
      )}
      <div className={`flex-1 min-w-0 ${isWord ? 'py-2 short:py-0' : ''}`}>
        {speakerName && <div className="text-xs font-bold opacity-75 mb-1">{speakerName}</div>}
        <p
          className={`${TEXT_SIZE_CLASS[content.size]} font-black break-words`}
          dir={isEnglish ? 'ltr' : 'rtl'}
          lang={content.lang}
        >
          {splitBlanks(content.text).map((part, idx) =>
            part.isBlank ? <BlankSlot key={idx} text={part.text} /> : <React.Fragment key={idx}>{part.text}</React.Fragment>
          )}
        </p>
      </div>

      {!isEnglish && <HebrewSpeakButton text={content.text} label="השמעת השאלה" className={theme.secondaryBtnClass} />}
      {isEnglish && spokenText && (
        <button
          type="button"
          onClick={speech.toggle}
          className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
          aria-label={label}
          title={label}
        >
          <SpeakIcon isSpeaking={speech.isSpeaking} />
        </button>
      )}
    </div>
  );
};
