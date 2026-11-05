/**
 * Every phrase the app can read aloud has a clip in the committed manifest, and the real player
 * finds it: no line falls back to the online voice or the device voice. `npm run tts:check` says the
 * same for the clips on disk; this fails `npm test` when a corpus change is committed without its clips.
 */
import { describe, expect, it, vi } from 'vitest';
import { createHybridTtsService, type HybridTtsDeps } from '../../src/services/tts/hybridTtsService';
import { getClipKey, HEBREW_VOICE, parseListenerGender } from '../../src/services/tts/ttsText';
import type { TextToSpeechService } from '../../src/services/tts/types';
import { readManifest } from './clipManifest';
import { collectCorpus, collectWholeLineHebrewCorpus } from './corpus';

const manifest = readManifest();
const ALL_LINES_TIMEOUT_MS = 120_000;

/** An <audio> stand-in that plays and ends at once. */
class FakeAudio extends EventTarget {
  src = '';
  paused = true;
  playbackRate = 1;
  defaultPlaybackRate = 1;

  play(): Promise<void> {
    this.paused = false;
    queueMicrotask(() => {
      this.dispatchEvent(new Event('playing'));
      queueMicrotask(() => {
        this.paused = true;
        this.dispatchEvent(new Event('ended'));
      });
    });
    return Promise.resolve();
  }

  pause(): void {
    this.paused = true;
  }
}

/** Speaks every Hebrew line of the corpus through the real player with this manifest; the lines that were not played from clips. */
async function playEveryHebrewLine(manifestData: unknown): Promise<{ unplayable: string[]; deviceCalls: number }> {
  let gender: 'girl' | 'boy' | null = null;
  const device: TextToSpeechService = { speak: vi.fn(async () => undefined), stop: vi.fn(), isReady: () => true };
  const urls: string[] = [];
  const deps: HybridTtsDeps = {
    device,
    getAudio: () => new FakeAudio() as unknown as HTMLAudioElement,
    fetch: (async (input: string | URL | Request) => {
      const url = String(input);
      urls.push(url);
      if (url === '/tts/manifest.json') return new Response(JSON.stringify(manifestData));
      return new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
    }) as typeof fetch,
    caches: null as unknown as CacheStorage,
    now: () => 0,
    isOnline: () => true,
    getListenerGender: () => gender,
  };
  const service = createHybridTtsService(deps);
  const unplayable: string[] = [];
  for (const phrase of collectWholeLineHebrewCorpus().filter((line) => line.speed === 'normal')) {
    const parsed = parseListenerGender(phrase.text);
    gender = parsed.gender;
    const before = urls.length;
    await service.speak(parsed.text, { lang: 'he' });
    const used = urls.slice(before).filter((url) => !url.endsWith('manifest.json'));
    if (used.length === 0 || used.some((url) => url.startsWith('/api/tts'))) unplayable.push(phrase.text.slice(0, 60));
  }
  return { unplayable, deviceCalls: vi.mocked(device.speak).mock.calls.length };
}

describe('clip coverage', () => {
  it('has a manifest', () => {
    expect(manifest).not.toBeNull();
  });

  it.each(['female', HEBREW_VOICE] as const)('lists every %s corpus phrase in the manifest', (voice) => {
    const listed = new Set(manifest?.voices[voice] ?? []);
    const missing = collectCorpus(voice).filter((phrase) => !listed.has(phrase.key));
    expect(missing.map((phrase) => phrase.text.slice(0, 60))).toEqual([]);
  });

  it(
    'plays every Hebrew line from clips, whichever way it is split, for a girl and a boy',
    async () => {
      const { unplayable, deviceCalls } = await playEveryHebrewLine(manifest);
      expect(deviceCalls).toBe(0);
      expect(unplayable).toEqual([]);
    },
    ALL_LINES_TIMEOUT_MS,
  );

  it(
    'notices a Hebrew line whose opener clip is missing',
    async () => {
      const withoutOpener = { ...manifest, voices: { ...manifest?.voices, [HEBREW_VOICE]: (manifest?.voices[HEBREW_VOICE] ?? []).filter((key) => key !== getClipKey('[to:girl] מעולה', 'normal')) } };
      const { unplayable } = await playEveryHebrewLine(withoutOpener);
      expect(unplayable.length).toBeGreaterThan(0);
    },
    ALL_LINES_TIMEOUT_MS,
  );
});
