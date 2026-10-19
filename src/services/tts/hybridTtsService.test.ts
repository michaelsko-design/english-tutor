import { describe, expect, it, vi } from 'vitest';
import { createHybridTtsService, LIVE_CACHE_NAME, type HybridTtsDeps } from './hybridTtsService';
import { getClipKey } from './ttsText';
import type { TextToSpeechService, TtsEngine } from './types';

/** An <audio> stand-in: play() starts on the next tick and ends right after. */
class FakeAudio extends EventTarget {
  src = '';
  paused = true;
  playbackRate = 1;
  defaultPlaybackRate = 1;
  shouldReject = false;
  played: string[] = [];

  play(): Promise<void> {
    if (this.shouldReject) return Promise.reject(new Error('NotAllowedError'));
    this.paused = false;
    this.played.push(this.src);
    setTimeout(() => {
      this.dispatchEvent(new Event('playing'));
      setTimeout(() => {
        this.paused = true;
        this.dispatchEvent(new Event('ended'));
      }, 0);
    }, 0);
    return Promise.resolve();
  }

  pause(): void {
    this.paused = true;
  }
}

class FakeCaches {
  readonly stores = new Map<string, Map<string, Response>>();

  async open(name: string) {
    const store = this.stores.get(name) ?? new Map<string, Response>();
    this.stores.set(name, store);
    return {
      match: async (url: string) => store.get(url)?.clone(),
      put: async (url: string, response: Response) => {
        store.set(url, response);
      },
    };
  }
}

const manifestWith = (keys: string[]) => new Response(JSON.stringify({ version: 1, voices: { female: keys } }));
const mp3 = () => new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
const html = () => new Response('<!doctype html>', { status: 200, headers: { 'Content-Type': 'text/html' } });

function setup(
  options: { clipKeys?: string[]; liveStatus?: number; manifestFails?: number; clipsAreHtml?: boolean; authToken?: string } = {}
) {
  let manifestFailures = options.manifestFails ?? 0;
  const audio = new FakeAudio();
  const caches = new FakeCaches();
  const device: TextToSpeechService = {
    speak: vi.fn(async (_text, opts) => opts?.onPlaybackStart?.('device')),
    stop: vi.fn(),
    isReady: () => true,
  };
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url === '/tts/manifest.json') {
      if (manifestFailures > 0) {
        manifestFailures -= 1;
        throw new TypeError('Failed to fetch');
      }
      return manifestWith(options.clipKeys ?? []);
    }
    if (url.startsWith('/tts/')) return options.clipsAreHtml ? html() : mp3();
    if (url.startsWith('/api/tts')) return options.liveStatus ? new Response('', { status: options.liveStatus }) : mp3();
    throw new Error(`unexpected ${url}`);
  });
  let now = 1_000;
  const deps: HybridTtsDeps = {
    device,
    getAudio: () => audio as unknown as HTMLAudioElement,
    fetch: fetchMock as unknown as typeof fetch,
    caches: caches as unknown as CacheStorage,
    now: () => now,
    isOnline: () => true,
    ...(options.authToken ? { getAuthToken: async () => options.authToken ?? null } : {}),
  };
  const advance = (ms: number) => {
    now += ms;
  };
  return { service: createHybridTtsService(deps), audio, caches, device, fetchMock, advance };
}

const engineOf = async (service: TextToSpeechService, text: string, rate = 0.95) => {
  let engine: TtsEngine | null = null;
  await service.speak(text, { voice: 'female', rate, onPlaybackStart: (e) => (engine = e) });
  return engine;
};

const liveCalls = (fetchMock: ReturnType<typeof setup>['fetchMock']) =>
  fetchMock.mock.calls.filter(([url]) => String(url).startsWith('/api/tts')).length;

describe('hybrid read-aloud service', () => {
  it('plays a rendered clip when the manifest has it', async () => {
    const { service, fetchMock, device } = setup({ clipKeys: [getClipKey('school', 'normal')] });
    expect(await engineOf(service, 'School.')).toBe('clip');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/^\/tts\/v\d+\/female\/.+\.mp3$/), expect.anything());
    expect(device.speak).not.toHaveBeenCalled();
  });

  it('plays a slow clip at full rate and a normal clip slower for a slow sentence', async () => {
    const sentence = 'I like my school.';
    const { service, audio } = setup({ clipKeys: [getClipKey('cat', 'slow'), getClipKey(sentence, 'normal')] });
    await engineOf(service, 'cat', 0.65);
    expect(audio.playbackRate).toBe(1);
    await engineOf(service, sentence, 0.7);
    expect(audio.playbackRate).toBeCloseTo(0.7 / 0.95);
  });

  it('uses the online voice for other English text and caches it', async () => {
    const { service, fetchMock, caches } = setup();
    expect(await engineOf(service, 'My own word list sentence')).toBe('live');
    expect(caches.stores.get(LIVE_CACHE_NAME)?.size).toBe(1);
    expect(await engineOf(service, 'My own word list sentence')).toBe('live');
    expect(liveCalls(fetchMock)).toBe(1);
  });

  it('sends the signed-in learner’s token with an online voice request', async () => {
    const { service, fetchMock } = setup({ authToken: 'id-token' });
    await engineOf(service, 'My own word list sentence');
    const liveCall = fetchMock.mock.calls.find(([url]) => String(url).startsWith('/api/tts')) as unknown[];
    expect(liveCall[1]).toMatchObject({ headers: { 'X-Firebase-Token': 'id-token' } });
  });

  it('uses the device voice for text the online voice does not read', async () => {
    const { service, fetchMock } = setup();
    expect(await engineOf(service, 'שלום')).toBe('device');
    expect(liveCalls(fetchMock)).toBe(0);
  });

  it('pauses the online voice for 10 minutes after a quota error', async () => {
    const { service, fetchMock, advance } = setup({ liveStatus: 429 });
    expect(await engineOf(service, 'first try')).toBe('device');
    expect(await engineOf(service, 'second try')).toBe('device');
    expect(liveCalls(fetchMock)).toBe(1);
    advance(10 * 60_000 + 1);
    await engineOf(service, 'third try');
    expect(liveCalls(fetchMock)).toBe(2);
  });

  it('falls back to the device voice when the browser blocks playback', async () => {
    const { service, audio } = setup({ clipKeys: [getClipKey('cat', 'normal')] });
    audio.shouldReject = true;
    expect(await engineOf(service, 'cat')).toBe('device');
  });

  it('tries the manifest again after a failed load', async () => {
    const { service } = setup({ clipKeys: [getClipKey('cat', 'normal')], manifestFails: 1 });
    expect(await engineOf(service, 'cat')).toBe('live');
    expect(await engineOf(service, 'cat')).toBe('clip');
  });

  it("ignores a dev server's HTML page in place of a clip", async () => {
    const { service } = setup({ clipKeys: [getClipKey('cat', 'normal')], clipsAreHtml: true });
    expect(await engineOf(service, 'cat')).toBe('live');
  });

  it('finishes when the system pauses the audio (a phone call)', async () => {
    const { service, audio } = setup({ clipKeys: [getClipKey('cat', 'normal')] });
    audio.play = function play(this: FakeAudio) {
      this.paused = false;
      setTimeout(() => {
        this.dispatchEvent(new Event('playing'));
        this.paused = true;
        this.dispatchEvent(new Event('pause'));
      }, 0);
      return Promise.resolve();
    };
    await expect(service.speak('cat', { voice: 'female' })).resolves.toBeUndefined();
  });

  it('a new speak stops the previous one before it plays', async () => {
    const { service, audio } = setup({ clipKeys: [getClipKey('cat', 'normal'), getClipKey('dog', 'normal')] });
    const first = service.speak('cat', { voice: 'female' });
    const second = service.speak('dog', { voice: 'female' });
    await Promise.all([first, second]);
    expect(audio.played).toHaveLength(1);
  });

  it('stop() cancels a speak that is still loading', async () => {
    const { service, audio, device } = setup({ clipKeys: [getClipKey('cat', 'normal')] });
    const pending = service.speak('cat', { voice: 'female' });
    service.stop();
    await pending;
    expect(audio.played).toHaveLength(0);
    expect(device.speak).not.toHaveBeenCalled();
  });
});
