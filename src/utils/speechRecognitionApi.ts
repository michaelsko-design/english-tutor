/**
 * Minimal types for the Web Speech recognition API, which TypeScript's DOM library does not ship
 * (Chrome and Edge expose it, some under a `webkit` prefix). Only what the app uses is described.
 */

export interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

export interface SpeechRecognitionEventLike {
  results?: ArrayLike<ArrayLike<SpeechRecognitionAlternativeLike>>;
}

export interface SpeechRecognitionErrorEventLike {
  error?: string;
}

export interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  /** The service began listening (fallback for browsers without onaudiostart). */
  onstart?: (() => void) | null;
  /** The microphone began recording: from here on, speech is heard. */
  onaudiostart?: (() => void) | null;
  start: () => void;
  abort: () => void;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechWindow {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

/** The browser's recognition constructor, or undefined when it has none. */
export function getSpeechRecognitionApi(): SpeechRecognitionConstructor | undefined {
  const speechWindow = window as unknown as SpeechWindow;
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
}
