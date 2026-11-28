import { afterEach, describe, expect, it, vi } from 'vitest';
import { getClipUrl } from './clipManifestTypes';
import { CLIP_REVISIONS, getClipRevisionQuery } from './clipRevisions';

// A clip re-rendered after it shipped; its revision rises with each redo, so it is read from the table
const REVISED_KEY = 'lt3qmr46kb';
const REVISION = CLIP_REVISIONS[`he-female/${REVISED_KEY}`];

describe('clip revisions', () => {
  it('adds the revision to the URL of a re-rendered clip, so devices fetch the new take', () => {
    expect(REVISION).toBeGreaterThan(1);
    expect(getClipUrl('he-female', REVISED_KEY)).toBe(`/tts/v4/he-female/${REVISED_KEY}.mp3?r=${REVISION}`);
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
    expect(getRemoteClipUrl('he-female', REVISED_KEY)).toBe(`https://pub-test.r2.dev/tts/v4/he-female/${REVISED_KEY}.mp3?r=${REVISION}`);
  });
});
