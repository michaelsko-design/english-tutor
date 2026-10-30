import { afterEach, describe, expect, it, vi } from 'vitest';
import { getClipUrl } from './clipManifestTypes';
import { getClipRevisionQuery } from './clipRevisions';

describe('clip revisions', () => {
  it('adds the revision to the URL of a re-rendered clip, so devices fetch the new take', () => {
    expect(getClipUrl('he-female', 'lt3qmr46kb')).toBe('/tts/v4/he-female/lt3qmr46kb.mp3?r=2');
  });

  it('leaves the URL of every other clip as it is', () => {
    expect(getClipUrl('he-female', 'nosuchclip')).toBe('/tts/v4/he-female/nosuchclip.mp3');
    expect(getClipRevisionQuery('female', 'lt3qmr46kb')).toBe('');
  });
});

describe('clip base URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('prefixes the clip URL with VITE_TTS_CLIP_BASE_URL, ignoring a trailing slash', async () => {
    vi.stubEnv('VITE_TTS_CLIP_BASE_URL', 'https://pub-test.r2.dev/');
    vi.resetModules();
    const { getClipUrl: getRemoteClipUrl } = await import('./clipManifestTypes');
    expect(getRemoteClipUrl('he-female', 'lt3qmr46kb')).toBe(
      'https://pub-test.r2.dev/tts/v4/he-female/lt3qmr46kb.mp3?r=2',
    );
  });
});
