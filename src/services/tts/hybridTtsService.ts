/**
 * Read-aloud in three tiers (docs/tts-evaluation.md):
 * 1. a clip rendered once with Azure Neural (public/tts/, listed in the manifest),
 * 2. the online Azure voice through /api/tts for any other English text, kept in CacheStorage,
 * 3. the device's own voice when offline, over quota, too slow or for other text.
 * Each new speak() stops the previous one, since learners tap word chips quickly.
 */
import { DEFAULT_VOICE_PREFERENCE } from '../../utils/ttsVoice';
import { CLIP_MANIFEST_URL, getClipUrl, type ClipManifest } from './clipManifestTypes';
import {
  APP_CHECK_HEADER,
  HEBREW_VOICE,
  isSpeakableBy,
  type ClipVoice,
  TTS_TOKEN_HEADER,
  buildLiveTtsQuery,
  CLIP_BASE_RATE,
  getClipKey,
  getClipSpeed,
  getSpeedBucket,
  normalizeTtsText,
  toSpeakableText,
} from './ttsText';
import type { SpeakOptions, TextToSpeechService, TtsEngine } from './types';

export const LIVE_CACHE_NAME = 'englishvibe-tts-live-v1';
const LIVE_TIMEOUT_MS = 3_000;
const MANIFEST_TIMEOUT_MS = 5_000;
/** The live cache keeps the newest answers; older ones are fetched again (from the CDN) if needed. */
const LIVE_CACHE_MAX_ENTRIES = 300;
const LIVE_PAUSE_MS = 10 * 60_000;
const DEFAULT_RATE = 0.95;
const MIN_PLAYBACK_RATE = 0.5;

export interface HybridTtsDeps {
  device: TextToSpeechService;
  getAudio: () => HTMLAudioElement | null;
  fetch: typeof fetch;
  /** CacheStorage, or null where it isn't available (insecure origin, old browser). */
  caches: CacheStorage | null;
  now: () => number;
  isOnline: () => boolean;
  /** The signed-in learner's Firebase ID token; /api/tts serves only signed-in learners. */
  getAuthToken?: () => Promise<string | null>;
  /** The Firebase App Check token (null when App Check isn't set up); proves the request comes from the real app. */
  getAppCheckToken?: () => Promise<string | null>;
  /** Called with text that had no rendered clip (dev builds record these to find corpus gaps). */
  onClipMiss?: (text: string) => void;
}

interface Playable {
  src: string;
  engine: TtsEngine;
  playbackRate: number;
  revoke?: () => void;
}

/** A dev server answers a missing file with its HTML page, so only real audio counts. */
function isAudioResponse(response: Response): boolean {
  return response.ok && (response.headers.get('Content-Type') ?? '').startsWith('audio/');
}

export function createHybridTtsService(deps: HybridTtsDeps): TextToSpeechService & { preload(): void } {
  let manifestPromise: Promise<Map<ClipVoice, Set<string>> | null> | null = null;
  let requestId = 0;
  let abortController: AbortController | null = null;
  let revokeCurrent: (() => void) | undefined;
  let livePausedUntil = 0;
  let finishCurrent: (() => void) | undefined;

  const fetchManifest = async (): Promise<Map<ClipVoice, Set<string>> | null> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), MANIFEST_TIMEOUT_MS);
    try {
      const response = await deps.fetch(CLIP_MANIFEST_URL, { signal: controller.signal });
      if (!response.ok) return null;
      const manifest = (await response.json()) as ClipManifest;
      if (!manifest?.voices) return null;
      const byVoice = new Map<ClipVoice, Set<string>>();
      Object.entries(manifest.voices).forEach(([voice, keys]) => byVoice.set(voice as ClipVoice, new Set(keys)));
      return byVoice;
    } finally {
      clearTimeout(timer);
    }
  };

  const loadManifest = () => {
    manifestPromise ??= fetchManifest().catch(() => {
      // Offline, slow or broken: no clips for now, and the next speak tries again.
      manifestPromise = null;
      return null;
    });
    return manifestPromise;
  };

  const stopPlayback = () => {
    abortController?.abort();
    abortController = null;
    const audio = deps.getAudio();
    if (audio && !audio.paused) audio.pause();
    revokeCurrent?.();
    revokeCurrent = undefined;
    finishCurrent?.();
    finishCurrent = undefined;
    deps.device.stop();
  };

  /** Loads audio with fetch() into an object URL; Safari won't play media a service worker answers without byte ranges. */
  const toPlayable = async (url: string, engine: TtsEngine, playbackRate: number, signal: AbortSignal): Promise<Playable | null> => {
    const response = await deps.fetch(url, { signal });
    if (!isAudioResponse(response)) return null;
    const objectUrl = URL.createObjectURL(await response.blob());
    return { src: objectUrl, engine, playbackRate, revoke: () => URL.revokeObjectURL(objectUrl) };
  };

  const trimLiveCache = async (cache: Cache) => {
    const keys = await cache.keys();
    // keys() lists entries in the order they were added, so the oldest go first.
    await Promise.all(keys.slice(0, Math.max(0, keys.length - LIVE_CACHE_MAX_ENTRIES)).map((key) => cache.delete(key)));
  };

  const findClip = async (text: string, voice: ClipVoice, rate: number, signal: AbortSignal): Promise<Playable | null> => {
    const clips = (await loadManifest())?.get(voice);
    const speed = getClipSpeed(text, getSpeedBucket(rate));
    const key = getClipKey(text, speed);
    if (!clips?.has(key)) {
      // A voice with no clips at all (male) isn't a gap in the corpus.
      if (clips) deps.onClipMiss?.(text);
      return null;
    }
    return toPlayable(getClipUrl(voice, key), 'clip', speed === 'slow' ? 1 : rate / CLIP_BASE_RATE, signal);
  };

  const fetchLive = async (text: string, voice: ClipVoice, rate: number, signal: AbortSignal): Promise<Playable | null> => {
    if (!isSpeakableBy(voice, text) || deps.now() < livePausedUntil || !deps.isOnline()) return null;
    const speed = getClipSpeed(text, getSpeedBucket(rate));
    const url = `/api/tts${buildLiveTtsQuery(text, voice, speed)}`;
    const playbackRate = speed === 'slow' ? 1 : rate / CLIP_BASE_RATE;
    const cache = deps.caches ? await deps.caches.open(LIVE_CACHE_NAME).catch(() => null) : null;
    const cached = await cache?.match(url);
    let response = cached;
    if (!response) {
      const [token, appCheckToken] = await Promise.all([
        deps.getAuthToken?.().catch(() => null),
        deps.getAppCheckToken?.().catch(() => null),
      ]);
      const headers: Record<string, string> = {
        ...(token ? { [TTS_TOKEN_HEADER]: token } : {}),
        ...(appCheckToken ? { [APP_CHECK_HEADER]: appCheckToken } : {}),
      };
      response = await deps.fetch(url, { signal, ...(Object.keys(headers).length > 0 ? { headers } : {}) });
      if (response.status === 429 || response.status === 503) livePausedUntil = deps.now() + LIVE_PAUSE_MS;
      if (!isAudioResponse(response)) return null;
      // Storing is best effort: a full or blocked cache just means fetching again next time.
      if (cache) {
        await cache
          .put(url, response.clone())
          .then(() => trimLiveCache(cache))
          .catch(() => undefined);
      }
    }
    const objectUrl = URL.createObjectURL(await response.blob());
    return { src: objectUrl, engine: 'live', playbackRate, revoke: () => URL.revokeObjectURL(objectUrl) };
  };

  const play = (audio: HTMLAudioElement, playable: Playable, onStart?: (engine: TtsEngine) => void): Promise<boolean> =>
    new Promise((resolve) => {
      revokeCurrent = playable.revoke;
      let hasStarted = false;
      let isDone = false;
      const finish = (didPlay: boolean) => {
        if (isDone) return;
        isDone = true;
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('playing', onPlaying);
        audio.removeEventListener('pause', onPause);
        // A late finish of an older play must not drop the handle of a newer one.
        if (finishCurrent === stopThis) finishCurrent = undefined;
        resolve(didPlay);
      };
      const stopThis = () => finish(true);
      const onEnded = () => finish(true);
      const onError = () => finish(hasStarted);
      const onPlaying = () => {
        if (hasStarted) return;
        hasStarted = true;
        onStart?.(playable.engine);
      };
      // A call, Siri or a lost Bluetooth speaker pauses the audio without "ended". A pause from
      // before this clip started belongs to the previous one, so it is ignored.
      const onPause = () => {
        if (hasStarted && !audio.ended) finish(true);
      };
      finishCurrent = stopThis;
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      audio.addEventListener('playing', onPlaying);
      audio.addEventListener('pause', onPause);
      audio.src = playable.src;
      // Loading a new src resets playbackRate to defaultPlaybackRate, so both are set after it.
      const playbackRate = Math.max(MIN_PLAYBACK_RATE, Math.min(1, playable.playbackRate));
      audio.defaultPlaybackRate = playbackRate;
      audio.playbackRate = playbackRate;
      audio.play().catch(() => finish(false));
    });

  const speak = async (rawText: string, options: SpeakOptions = {}): Promise<void> => {
    stopPlayback();
    requestId += 1;
    const id = requestId;
    const text = normalizeTtsText(toSpeakableText(rawText));
    if (!text) return;
    const voice = options.voice ?? DEFAULT_VOICE_PREFERENCE;
    const rate = options.rate ?? DEFAULT_RATE;
    const lang = options.lang ?? 'en';
    const clipVoice: ClipVoice = lang === 'he' ? HEBREW_VOICE : voice;
    const controller = new AbortController();
    abortController = controller;
    const isCurrent = () => id === requestId;

    const audio = deps.getAudio();
    if (audio) {
      let playable: Playable | null;
      // The online voice gets LIVE_TIMEOUT_MS; a slower answer is dropped for the device voice.
      const timer = setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS);
      try {
        playable = (await findClip(text, clipVoice, rate, controller.signal)) ??
          (await fetchLive(text, clipVoice, rate, controller.signal));
      } catch {
        // A timeout, an abort or a network error falls through to the device voice.
        playable = null;
      } finally {
        clearTimeout(timer);
      }
      if (!isCurrent()) {
        playable?.revoke?.();
        return;
      }
      if (playable) {
        const didPlay = await play(audio, playable, options.onPlaybackStart);
        if (didPlay || !isCurrent()) return;
      }
    }
    if (!isCurrent()) return;
    await deps.device.speak(text, { rate, voice, lang, onPlaybackStart: options.onPlaybackStart });
  };

  return {
    speak,
    stop: () => {
      requestId += 1;
      stopPlayback();
    },
    isReady: () => deps.getAudio() !== null || deps.device.isReady(),
    preload: () => {
      void loadManifest();
    },
  };
}
