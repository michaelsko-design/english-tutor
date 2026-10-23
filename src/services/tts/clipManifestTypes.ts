import { getClipRevisionQuery } from './clipRevisions';
import { getAudioVersion, type ClipVoice } from './ttsText';

/** public/tts/manifest.json: the clip keys rendered for each voice (scripts/tts/renderClips.ts). */
export interface ClipManifest {
  version: 1;
  voices: Partial<Record<ClipVoice, string[]>>;
}

/** The manifest ships with the app; only the mp3 clips can live on another origin (a Cloudflare R2 bucket). */
export const CLIP_MANIFEST_URL = '/tts/manifest.json';

/** Origin serving the clips (VITE_TTS_CLIP_BASE_URL, no trailing slash); empty = the app's own /tts/. */
const CLIP_BASE_URL = (import.meta.env.VITE_TTS_CLIP_BASE_URL ?? '').trim().replace(/\/+$/, '');

export function getClipUrl(voice: ClipVoice, key: string): string {
  return `${CLIP_BASE_URL}/tts/v${getAudioVersion(voice)}/${voice}/${key}.mp3${getClipRevisionQuery(voice, key)}`;
}
