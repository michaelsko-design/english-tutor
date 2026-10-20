import { useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_SPEECH_RATE, getTtsService, isSameSpeech, stopSpeech, type CurrentSpeech } from '../services/tts';

type SpeakFn = (text: string, rate?: number) => void;

/** The text being read aloud right now, or null; re-renders when a reading starts or ends. */
export function useCurrentSpeech(): CurrentSpeech | null {
  const service = getTtsService();
  return useSyncExternalStore(service.subscribe, service.getCurrent);
}

/**
 * A 🔊 button that reads its text, and while that text is being read, stops it instead.
 * For a list of buttons, use useCurrentSpeech once and toggleSpeech per button.
 */
export function useSpeechToggle(onSpeak: SpeakFn, text: string, rate = DEFAULT_SPEECH_RATE) {
  const isSpeaking = isSameSpeech(useCurrentSpeech(), text, rate);
  return { isSpeaking, toggle: () => toggleSpeech(isSpeaking, onSpeak, text, rate) };
}

export function toggleSpeech(isSpeaking: boolean, onSpeak: SpeakFn, text: string, rate = DEFAULT_SPEECH_RATE): void {
  if (isSpeaking) stopSpeech();
  else onSpeak(text, rate);
}

/** Reading stops when the screen that uses this closes (leaving a mission mid-sentence). */
export function useStopSpeechOnLeave(): void {
  useEffect(() => stopSpeech, []);
}
