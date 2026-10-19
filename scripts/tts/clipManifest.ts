/** Reads and writes public/tts/manifest.json, the clip keys rendered for each voice. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { TTS_AUDIO_VERSION, TTS_VOICES } from '../../src/services/tts/ttsText';
import type { ClipManifest } from '../../src/services/tts/clipManifestTypes';

export const TTS_PUBLIC_DIR = join(process.cwd(), 'public', 'tts');
export const MANIFEST_PATH = join(TTS_PUBLIC_DIR, 'manifest.json');

export function getVoiceDir(voice: string): string {
  return join(TTS_PUBLIC_DIR, `v${TTS_AUDIO_VERSION}`, voice);
}

/** The clip keys that exist on disk for a voice. */
export function listRenderedKeys(voice: string): Set<string> {
  const dir = getVoiceDir(voice);
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((name) => name.endsWith('.mp3'))
      .map((name) => name.slice(0, -'.mp3'.length)),
  );
}

/** Writes the manifest from the files on disk, keeping only keys that are still in the corpus. */
export function writeManifest(corpusKeys: ReadonlySet<string>): ClipManifest {
  const manifest: ClipManifest = { version: 1, voices: {} };
  for (const voice of TTS_VOICES) {
    const keys = [...listRenderedKeys(voice)].filter((key) => corpusKeys.has(key)).sort();
    if (keys.length > 0) manifest.voices[voice] = keys;
  }
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest)}\n`);
  return manifest;
}

export function readManifest(): ClipManifest | null {
  if (!existsSync(MANIFEST_PATH)) return null;
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as ClipManifest;
}
