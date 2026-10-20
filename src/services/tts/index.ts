import { getSharedAudio, onFirstGesture } from './audioUnlock';
import { deviceTtsService } from './deviceTtsService';
import { createHybridTtsService } from './hybridTtsService';
import { createSpeechStatus, type SpeechStatusService } from './speechStatus';
import { auth } from '../firebase';

export type { SpeakOptions, TextToSpeechService, TtsEngine } from './types';
export { DEFAULT_SPEECH_RATE, isSameSpeech, type CurrentSpeech } from './speechStatus';

declare global {
  interface Window {
    /** Dev builds only: text read aloud that had no rendered clip (add it to scripts/tts/corpus.ts). */
    __ttsMisses?: Set<string>;
  }
}

function recordClipMiss(text: string): void {
  if (!import.meta.env.DEV) return;
  window.__ttsMisses ??= new Set();
  window.__ttsMisses.add(text);
}

let service: SpeechStatusService | null = null;

/** The app's read-aloud service: rendered clip, then the online voice, then the device voice. */
export function getTtsService(): SpeechStatusService {
  if (!service) {
    const created = createHybridTtsService({
      device: deviceTtsService,
      getAudio: getSharedAudio,
      fetch: (input, init) => fetch(input, init),
      caches: typeof caches === 'undefined' ? null : caches,
      now: () => Date.now(),
      isOnline: () => typeof navigator === 'undefined' || navigator.onLine !== false,
      getAuthToken: async () => (auth?.currentUser ? auth.currentUser.getIdToken() : null),
      onClipMiss: recordClipMiss,
    });
    onFirstGesture(created.preload);
    service = createSpeechStatus(created);
    // Reading stops when the learner switches to another app or tab.
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') stopSpeech();
      });
    }
  }
  return service;
}

/** Stops whatever is being read aloud (a stop button, or leaving the screen that started it). */
export function stopSpeech(): void {
  service?.stop();
}
