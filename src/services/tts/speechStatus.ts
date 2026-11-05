/**
 * Which text is being read aloud right now, so a 🔊 button can turn into a stop button while its
 * own text plays. It wraps the read-aloud service: a reading counts from the tap (while the clip
 * loads too) until it ends or is stopped.
 */
import type { SpeakOptions, TextToSpeechService } from './types';

/** The rate speak() uses when none is given (the same default as the service and the dashboard). */
export const DEFAULT_SPEECH_RATE = 0.95;

/** Words waiting behind the one playing; more taps than this drop the oldest waiting word. */
const MAX_QUEUED_READINGS = 12;

export interface CurrentSpeech {
  text: string;
  rate: number;
}

export interface SpeechPart {
  text: string;
  options?: SpeakOptions;
}

export interface SpeechStatusService extends TextToSpeechService {
  /**
   * Reads the parts one after another (the Hebrew instruction, then the English question). Any
   * other speak or a stop ends the sequence, so a tap on a 🔊 isn't followed by the next part.
   */
  speakSequence(parts: readonly SpeechPart[]): Promise<void>;
  /**
   * Reads the text after whatever queued reading is playing (word chips tapped quickly are read one
   * by one). Any speak, speakSequence or stop empties the queue. Keeps at most MAX_QUEUED_READINGS waiting.
   */
  enqueue(text: string, options?: SpeakOptions): void;
  getCurrent(): CurrentSpeech | null;
  /** Calls the listener whenever a reading starts or ends; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

/** Whether the current reading is this text at this rate (a slow and a normal button differ). */
export function isSameSpeech(current: CurrentSpeech | null, text: string, rate = DEFAULT_SPEECH_RATE): boolean {
  return current !== null && current.text === text && current.rate === rate;
}

export function createSpeechStatus(service: TextToSpeechService): SpeechStatusService {
  let current: CurrentSpeech | null = null;
  /** Counts every speak and stop, so a sequence knows when something else took over. */
  let generation = 0;
  const listeners = new Set<() => void>();

  const setCurrent = (next: CurrentSpeech | null) => {
    if (next === current) return;
    current = next;
    listeners.forEach((listener) => listener());
  };

  const play = async (text: string, options: SpeakOptions = {}) => {
    generation += 1;
    const reading: CurrentSpeech = { text, rate: options.rate ?? DEFAULT_SPEECH_RATE };
    setCurrent(reading);
    try {
      await service.speak(text, options);
    } finally {
      // A newer reading may have started meanwhile; only this one's own end clears it.
      if (current === reading) setCurrent(null);
    }
  };

  /** Pending queued readings; any speak or stop empties it and ends the running drain. */
  const queue: SpeechPart[] = [];
  let isDraining = false;
  /** Bumped when speak/stop cancels the queue, so a drain that was running knows it is stale. */
  let queueEpoch = 0;

  const cancelQueue = () => {
    queue.length = 0;
    isDraining = false;
    queueEpoch += 1;
  };

  const drain = async () => {
    const epoch = queueEpoch;
    isDraining = true;
    while (queue.length > 0) {
      const part = queue.shift() as SpeechPart;
      try {
        await play(part.text, part.options);
      } catch {
        // A word that fails to play must not block the ones queued behind it.
      }
      if (epoch !== queueEpoch) return;
    }
    isDraining = false;
  };

  const speak = async (text: string, options: SpeakOptions = {}) => {
    cancelQueue();
    await play(text, options);
  };

  return {
    speak,
    enqueue(text, options) {
      queue.push({ text, options });
      while (queue.length > MAX_QUEUED_READINGS) queue.shift();
      // Load the clip now, while the word before it plays, so the words run together
      service.prefetch?.(text, options);
      // Idle, or a plain reading is playing (the new word takes over, as before): start a drain.
      if (!isDraining) void drain();
    },
    async speakSequence(parts) {
      for (const part of parts) {
        const reading = speak(part.text, part.options);
        // speak() counts itself before its first await, so this is this part's own generation
        const mine = generation;
        await reading;
        if (generation !== mine) return;
      }
    },
    stop() {
      cancelQueue();
      generation += 1;
      service.stop();
      setCurrent(null);
    },
    isReady: () => service.isReady(),
    getCurrent: () => current,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
