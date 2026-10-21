import { getClipRevisionQuery } from './clipRevisions';
import { getAudioVersion, type ClipVoice } from './ttsText';

/** public/tts/manifest.json: the clip keys rendered for each voice (scripts/tts/renderClips.ts). */
export interface ClipManifest {
  version: 1;
  voices: Partial<Record<ClipVoice, string[]>>;
}

export const CLIP_MANIFEST_URL = '/tts/manifest.json';

export function getClipUrl(voice: ClipVoice, key: string): string {
  return `/tts/v${getAudioVersion(voice)}/${voice}/${key}.mp3${getClipRevisionQuery(voice, key)}`;
}
