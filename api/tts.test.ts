import { describe, expect, it, vi } from 'vitest';
import { handleTtsRequest } from './tts';
import { buildLiveTtsQuery } from '../src/services/tts/ttsText';

const ENV = { AZURE_SPEECH_KEY: 'secret', AZURE_SPEECH_REGION: 'westeurope' };
const request = (query: string) => new Request(`https://app.test/api/tts?${query}`);
const canonical = (text: string, voice: 'female' | 'male' = 'female', speed: 'normal' | 'slow' = 'normal') =>
  new Request(`https://app.test/api/tts${buildLiveTtsQuery(text, voice, speed)}`);

describe('handleTtsRequest', () => {
  it('rejects text the online voice does not read', async () => {
    const fetchImpl = vi.fn();
    const response = await handleTtsRequest(request('a=1&v=female&s=normal&t=%D7%A9%D7%9C%D7%95%D7%9D'), ENV, fetchImpl);
    expect(response.status).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rejects an unknown voice or speed', async () => {
    expect((await handleTtsRequest(request('a=1&v=robot&s=normal&t=hi'), ENV)).status).toBe(400);
    expect((await handleTtsRequest(request('a=1&v=female&s=fast&t=hi'), ENV)).status).toBe(400);
  });

  it('rejects any spelling but the canonical one, so the CDN cache cannot be busted', async () => {
    const fetchImpl = vi.fn();
    for (const query of [
      'a=1&v=female&s=normal&t=hello&x=1',
      'v=female&a=1&s=normal&t=hello',
      'a=1&v=female&s=normal&t=hello%20%20world',
      'a=1&v=female&s=normal&t=hello+world',
      'a=0&v=female&s=normal&t=hello',
    ]) {
      expect((await handleTtsRequest(request(query), ENV, fetchImpl)).status).toBe(400);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('answers 503 without a key, and never caches it', async () => {
    const response = await handleTtsRequest(canonical('hello'), {});
    expect(response.status).toBe(503);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('returns cacheable MP3 audio', async () => {
    const fetchImpl = vi.fn(async () => new Response(new Uint8Array([9, 9]), { status: 200 }));
    const response = await handleTtsRequest(canonical('hello', 'male', 'slow'), ENV, fetchImpl as typeof fetch);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=31536000');
    expect((await response.arrayBuffer()).byteLength).toBe(2);
  });

  it('passes on a quota error and hides other failures', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const quota = vi.fn(async () => new Response('', { status: 429 }));
    expect((await handleTtsRequest(canonical('hello'), ENV, quota as typeof fetch)).status).toBe(429);
    const broken = vi.fn(async () => new Response('', { status: 500 }));
    expect((await handleTtsRequest(canonical('hello'), ENV, broken as typeof fetch)).status).toBe(502);
  });
});
