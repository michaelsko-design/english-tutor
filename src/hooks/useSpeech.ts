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
  return { isSpeaking, toggle: () => toggleSpeech(isSpeaking, onSpeak, text, rate) };}

/** The reading a button press just cut off, until the end of that press (see useStopSpeechOnButtonPress). */
let stoppedByPress: CurrentSpeech | null = null;

export function toggleSpeech(isSpeaking: boolean, onSpeak: SpeakFn, text: string, rate = DEFAULT_SPEECH_RATE): void {
  // Pressing a 🔊 button that is reading right now stops it: the press already did, so don't start it again
  if (isSpeaking || isSameSpeech(stoppedByPress, text, rate)) stopSpeech();
  else onSpeak(text, rate);
}

/** Reading stops when the screen that uses this closes (leaving a mission mid-sentence). */
export function useStopSpeechOnLeave(): void {
  useEffect(() => stopSpeech, []);
}

/** Reading stops when `key` changes (the next question or page opens), before the new screen reads itself. */
export function useStopSpeechOnChange(key: string | number): void {
  useEffect(() => {
    stopSpeech();
  }, [key]);
}

/**
 * Any button press stops the reading in progress (e.g. "next" while the answer is still being read).
 * Runs in the capture phase, so it precedes the button's own handler, which may start a new reading.
 * Mount once, high in the app.
 */
export function useStopSpeechOnButtonPress(): void {
  useEffect(() => {
    const onPress = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('button, [role="button"]')) return;
      const current = getTtsService().getCurrent();
      if (!current) return;
      stoppedByPress = current;
      setTimeout(() => {
        stoppedByPress = null;
      }, 0);
      stopSpeech();
    };
    document.addEventListener('click', onPress, true);
    return () => document.removeEventListener('click', onPress, true);
  }, []);
}
