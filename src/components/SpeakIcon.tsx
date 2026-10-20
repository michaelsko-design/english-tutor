import React from 'react';
import { Square, Volume2 } from 'lucide-react';

/** Screen-reader label of a 🔊 button while its text is being read (a tap stops it). */
export const STOP_SPEECH_LABEL = 'עצירת ההקראה';
/** The short visible text for a 🔊 button with a caption while it reads. */
export const STOP_SPEECH_TEXT = 'עצירה';

interface SpeakIconProps {
  isSpeaking: boolean;
  className?: string;
}

/** Feature 41: the speaker icon, or a stop square while the button's own text is being read. */
export const SpeakIcon: React.FC<SpeakIconProps> = ({ isSpeaking, className = 'w-4 h-4' }) =>
  isSpeaking ? (
    <Square className={className} fill="currentColor" aria-hidden="true" />
  ) : (
    <Volume2 className={className} aria-hidden="true" />
  );
