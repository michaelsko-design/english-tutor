import { describe, expect, it } from 'vitest';
import type { ReviewCatalog } from './hebrewReviewCatalog';
import { buildSnapshot } from './reviewCloudSnapshot';

const PARTS = [
  { key: 'own', voice: 'he' as const },
  { key: 'rest', voice: 'en' as const },
];
const catalog: ReviewCatalog = {
  phrases: [
    { key: 'own', text: '[to:girl] בנית', speed: 'normal' },
    { key: 'gone', text: 'תודה', speed: 'normal' },
    { key: 'stale', text: 'שלום', speed: 'slow' },
  ],
  wholeLines: [],
  describe: (phrase) => ({
    spoken: phrase.key === 'own' ? 'בָּנִית.' : phrase.text,
    group: 'core',
    where: 'g1 u1',
    rank: 1,
    lines: phrase.key === 'own' ? [{ text: 'x', spoken: 'בָּנִית. The king.', parts: PARTS, listener: 'girl' as const }] : undefined,
  }),
};

const clips: Record<string, { fp: string; md5: string }> = {
  'he:own': { fp: 'fp-own', md5: 'md5-own' },
  'he:stale': { fp: 'fp-stale', md5: 'md5-new' },
  'en:rest': { fp: 'fp-rest', md5: 'md5-rest' },
};
const etags = new Map([
  ['tts/he/own.mp3', 'md5-own'],
  ['tts/he/stale.mp3', 'md5-old'],
  ['tts/en/rest.mp3', 'md5-rest'],
]);

const build = (remote = etags) =>
  buildSnapshot({
    catalog,
    clipBaseUrl: 'https://clips.example/',
    inspect: (voice, key) => clips[`${voice}:${key}`] ?? null,
    objectPath: (voice, key) => `tts/${voice}/${key}.mp3`,
    remoteEtags: remote,
    hasTake: (key) => key === 'own',
  });

describe('buildSnapshot', () => {
  it('lists only the clips whose online audio is the PC audio, and counts the rest', () => {
    const { snapshot, skipped } = build();
    expect(snapshot.items.map((item) => item.key)).toEqual(['own']);
    expect(skipped).toEqual({ missing: 1, notUploaded: 1, lines: 0 });
  });

  it('gives each clip and line part its bucket path, versioned by fingerprint', () => {
    const { snapshot } = build();
    expect(snapshot.clipBaseUrl).toBe('https://clips.example');
    expect(snapshot.items[0]).toEqual({
      key: 'own',
      spoken: 'בָּנִית.',
      plain: 'בנית',
      gender: 'girl',
      speed: 'normal',
      group: 'core',
      where: 'g1 u1',
      fp: 'fp-own',
      path: 'tts/he/own.mp3?fp=fp-own',
      hasTake: true,
      lines: [{ spoken: 'בָּנִית. The king.', listener: 'girl', parts: ['tts/he/own.mp3?fp=fp-own', 'tts/en/rest.mp3?fp=fp-rest'] }],
    });
  });

  it('leaves out a whole line with a part that is not online', () => {
    const { snapshot, skipped } = build(new Map([...etags].filter(([path]) => !path.includes('rest'))));
    expect(snapshot.items[0]?.lines).toEqual([]);
    expect(skipped.lines).toBe(1);
  });
});
