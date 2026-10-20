import { useEffect } from 'react';
import { speakHebrew } from '../services/tts';

/** Lets a right / wrong sound finish before the voice starts. */
const AFTER_SOUND_MS = 450;

/**
 * Feature 47: reads Hebrew text by itself when it appears (feedback, a hint) for learners who
 * can't read yet. A later reading, or leaving the screen, stops it as usual.
 */
export function useAutoSpeakHebrew(text: string, isEnabled: boolean, delayMs = AFTER_SOUND_MS): void {
  useEffect(() => {
    if (!isEnabled || !text) return undefined;
    const timer = setTimeout(() => {
      void speakHebrew(text);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [text, isEnabled, delayMs]);
}
