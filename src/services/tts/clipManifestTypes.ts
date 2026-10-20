import { TTS_AUDIO_VERSION, type ClipVoice } from './ttsText';

/** public/tts/manifest.json: the clip keys rendered for each voice (scripts/tts/renderClips.ts). */
export interface ClipManifest {
  version: 1;
  voices: Partial<Record<ClipVoice, string[]>>;
}

export const CLIP_MANIFEST_URL = '/tts/manifest.json';

export function getClipUrl(voice: ClipVoice, key: string): string {
  return `/tts/v${TTS_AUDIO_VERSION}/${voice}/${key}.mp3`;
}
