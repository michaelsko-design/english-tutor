import {
  DEFAULT_VOICE_PREFERENCE,
  isDeviceVoiceAvailable,
  speakWithVoice,
  stopDeviceVoice,
} from '../../utils/ttsVoice';
import type { TextToSpeechService } from './types';

const DEFAULT_RATE = 0.95;

/** The browser's own speechSynthesis voice: the last fallback, and the only voice offline. */
export const deviceTtsService: TextToSpeechService = {
  speak(text, options = {}) {
    return speakWithVoice(
      text,
      options.rate ?? DEFAULT_RATE,
      options.voice ?? DEFAULT_VOICE_PREFERENCE,
      () => options.onPlaybackStart?.('device'),
      options.lang ?? 'en',
    );
  },
  stop: stopDeviceVoice,
  isReady: isDeviceVoiceAvailable,
};
