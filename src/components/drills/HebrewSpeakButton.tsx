import React from 'react';
import { speakHebrew } from '../../services/tts';
import { toSpeakableText } from '../../services/tts/ttsText';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_LABEL } from '../SpeakIcon';

interface HebrewSpeakButtonProps {
  text: string;
  /** Screen-reader name, e.g. "הקשבה להוראה" */
  label?: string;
  className?: string;
}

const readHebrew = (text: string, rate?: number) => {
  void speakHebrew(text, rate);
};

/** Feature 47: a 🔊 that reads Hebrew text aloud (an instruction, a hint, feedback); a stop square while it reads. */
export const HebrewSpeakButton: React.FC<HebrewSpeakButtonProps> = ({ text, label = 'הקשבה', className = '' }) => {
  const speech = useSpeechToggle(readHebrew, toSpeakableText(text));
  const name = speech.isSpeaking ? STOP_SPEECH_LABEL : label;
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        speech.toggle();
      }}
      className={`min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl shrink-0 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 ${className}`}
      aria-label={name}
      title={name}
    >
      <SpeakIcon isSpeaking={speech.isSpeaking} className="w-5 h-5" />
    </button>
  );
};
