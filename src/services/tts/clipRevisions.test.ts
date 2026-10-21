import { describe, expect, it } from 'vitest';
import { getClipUrl } from './clipManifestTypes';
import { getClipRevisionQuery } from './clipRevisions';

describe('clip revisions', () => {
  it('adds the revision to the URL of a re-rendered clip, so devices fetch the new take', () => {
    expect(getClipUrl('he-female', 'lt3qmr46kb')).toBe('/tts/v3/he-female/lt3qmr46kb.mp3?r=2');
  });

  it('leaves the URL of every other clip as it is', () => {
    expect(getClipUrl('he-female', 'nosuchclip')).toBe('/tts/v3/he-female/nosuchclip.mp3');
    expect(getClipRevisionQuery('female', 'lt3qmr46kb')).toBe('');
  });
});
