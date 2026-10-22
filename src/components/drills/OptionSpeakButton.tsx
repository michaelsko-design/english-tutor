import React from 'react';
import { speakHebrew } from '../../services/tts';
import { toSpeakableText } from '../../services/tts/ttsText';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { useReadsHebrewAloud } from '../../data/hebrewAudio';
import { getTextLang } from '../../utils/bidi';
import { SpeakIcon, STOP_SPEECH_LABEL } from '../SpeakIcon';

/** The rate an option is read at, the same as the drills' answers (one rendered clip each) */
const OPTION_SPEAK_RATE = 0.95;

const readHebrew = (text: string, rate?: number) => {
  void speakHebrew(text, rate);
};
const noSpeech = () => undefined;

interface OptionSpeakButtonProps {
  /** The option text: English is read in the learner's voice, Hebrew (a word's meaning) in the Hebrew voice */
  text: string;
  onSpeakEnglish?: (text: string, rate?: number) => void;
  className: string;
  /** Hebrew text shows for every grade (the placement gate) */
  isHebrewAlways?: boolean;
}

/**
 * Feature 47: a 🔊 beside an answer option for learners who can't read it yet. It only listens;
 * answering is the option button itself. Nothing shows for a picture-only option.
 */
export const OptionSpeakButton: React.FC<OptionSpeakButtonProps> = ({ text, onSpeakEnglish, className, isHebrewAlways = false }) => {
  const readsHebrew = useReadsHebrewAloud() || isHebrewAlways;
  const spokenText = toSpeakableText(text);
  const speak = getTextLang(text) === 'en' ? onSpeakEnglish : readsHebrew ? readHebrew : undefined;
  const speech = useSpeechToggle(speak ?? noSpeech, spokenText, OPTION_SPEAK_RATE);
  if (!spokenText || !speak) return null;
  const label = speech.isSpeaking ? STOP_SPEECH_LABEL : 'הקשבה לתשובה';
  return (
    <button
      type="button"
      onClick={speech.toggle}
      className={`min-w-12 rounded-2xl flex items-center justify-center shrink-0 ${className}`}
      aria-label={`${label}: ${text}`}
      title={label}
    >
      <SpeakIcon isSpeaking={speech.isSpeaking} className="w-5 h-5" />
    </button>
  );
};
