import type { VoicePreference } from '../../utils/ttsVoice';
import { TTS_AUDIO_VERSION } from './ttsText';

/** public/tts/manifest.json: the clip keys rendered for each voice (scripts/tts/renderClips.ts). */
export interface ClipManifest {
  version: 1;
  voices: Partial<Record<VoicePreference, string[]>>;
}

export const CLIP_MANIFEST_URL = '/tts/manifest.json';

export function getClipUrl(voice: VoicePreference, key: string): string {
  return `/tts/v${TTS_AUDIO_VERSION}/${voice}/${key}.mp3`;
}
