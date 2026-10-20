import { describe, expect, it, vi } from 'vitest';
import { AzureTtsError, buildSsml, escapeXml, readAzureConfig, synthesize } from './azureTts';

describe('escapeXml', () => {
  it('escapes every XML special character', () => {
    expect(escapeXml(`Tom & "Jerry" <it's>`)).toBe('Tom &amp; &quot;Jerry&quot; &lt;it&apos;s&gt;');
  });
});

describe('buildSsml', () => {
  it('uses the voice, the speed and a leading break', () => {
    const ssml = buildSsml('Hi & bye', 'male', 'slow');
    expect(ssml).toContain('<voice name="en-US-GuyNeural">');
    expect(ssml).toContain('<break time="200ms"/>');
    expect(ssml).toContain('<prosody rate="-30%">Hi &amp; bye</prosody>');
  });

  it('reads Hebrew with the multilingual voice and switches to English for English words', () => {
    const ssml = buildSsml('מעולה! cat פירושו "חתול".', 'he-female', 'normal');
    expect(ssml).toContain('xml:lang="he-IL"><voice name="en-US-AvaMultilingualNeural">');
    expect(ssml).toContain('<lang xml:lang="he-IL"><prosody rate="-8%">מעולה! </prosody></lang>');
    expect(ssml).toContain('<lang xml:lang="en-US"><prosody rate="-8%">cat</prosody></lang>');
    // Quotes are escaped after splitting, so "quot" is never read as an English word
    expect(ssml).toContain('&quot;חתול&quot;.');
    expect(ssml).not.toContain('<lang xml:lang="en-US"><prosody rate="-8%">quot');
  });
});

describe('readAzureConfig', () => {
  it('needs both a key and a plain region name', () => {
    expect(readAzureConfig({ AZURE_SPEECH_KEY: 'k', AZURE_SPEECH_REGION: 'westeurope' })).toEqual({
      key: 'k',
      region: 'westeurope',
    });
    expect(readAzureConfig({ AZURE_SPEECH_KEY: 'k' })).toBeNull();
    expect(readAzureConfig({ AZURE_SPEECH_KEY: 'k', AZURE_SPEECH_REGION: 'evil.com/x' })).toBeNull();
  });
});

describe('synthesize', () => {
  const config = { key: 'secret', region: 'westeurope' };

  it('posts SSML to the region endpoint and returns the audio', async () => {
    const fetchImpl = vi.fn(async () => new Response(new Uint8Array([1, 2, 3]), { status: 200 }));
    const audio = await synthesize('cat', 'female', 'normal', config, 1000, fetchImpl as typeof fetch);
    expect(audio.byteLength).toBe(3);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1');
    expect((init.headers as Record<string, string>)['Ocp-Apim-Subscription-Key']).toBe('secret');
  });

  it("throws Azure's status on failure", async () => {
    const fetchImpl = vi.fn(async () => new Response('', { status: 429 }));
    await expect(synthesize('cat', 'female', 'normal', config, 1000, fetchImpl as typeof fetch)).rejects.toMatchObject(
      new AzureTtsError('Azure TTS failed with status 429', 429),
    );
  });
});
