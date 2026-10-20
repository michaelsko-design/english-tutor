import type { VoicePreference } from '../../utils/ttsVoice';
import type { TtsLang } from './ttsText';

/** Which voice read the text: a rendered clip, the online Azure voice or the device's own voice. */
export type TtsEngine = 'clip' | 'live' | 'device';

export interface SpeakOptions {
  /** 1 is the normal speaking rate; the app uses 0.65 (slow word) to 0.95. */
  rate?: number;
  voice?: VoicePreference;
  /** 'he' reads with the Hebrew voice whatever `voice` is; English by default. */
  lang?: TtsLang;
  /** Called once when sound starts, with the engine that is playing it. */
  onPlaybackStart?: (engine: TtsEngine) => void;
}

export interface TextToSpeechService {
  /** Reads the text aloud, stopping anything still playing; resolves when it ends or is stopped. */
  speak(text: string, options?: SpeakOptions): Promise<void>;
  stop(): void;
  isReady(): boolean;
}
