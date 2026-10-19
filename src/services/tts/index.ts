import { getSharedAudio, onFirstGesture } from './audioUnlock';
import { deviceTtsService } from './deviceTtsService';
import { createHybridTtsService } from './hybridTtsService';
import type { TextToSpeechService } from './types';
import { auth } from '../firebase';

export type { SpeakOptions, TextToSpeechService, TtsEngine } from './types';

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

let service: (TextToSpeechService & { preload(): void }) | null = null;

/** The app's read-aloud service: rendered clip, then the online voice, then the device voice. */
export function getTtsService(): TextToSpeechService {
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
    service = created;
  }
  return service;
}
