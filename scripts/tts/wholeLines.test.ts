import { describe, expect, it } from 'vitest';
import { getClipKey } from '../../src/services/tts/ttsText';
import { buildWholeLines, partsOfLine } from './wholeLines';

describe('partsOfLine', () => {
  it('is the opener clip then the rest, both in the girl form for a girl', () => {
    const parts = partsOfLine('[to:girl] מעולה! בנית את המילה cat');
    expect(parts?.[0]).toEqual({ voice: 'he', key: getClipKey('[to:girl] מעולה', 'normal') });
    expect(parts?.[1].voice).toBe('he');
  });

  it('reads an English-only rest with the English voice', () => {
    const parts = partsOfLine('כל הכבוד! "The king has a gold crown."');
    expect(parts?.[1]).toEqual({ voice: 'en', key: getClipKey('The king has a gold crown.', 'normal') });
  });

  it('is the line, then the shared closer', () => {
    const parts = partsOfLine('[to:boy] כמעט. אמור את המילה לאט ונסה שוב!');
    expect(parts).toEqual([
      { voice: 'he', key: getClipKey('כמעט.', 'normal') },
      { voice: 'he', key: getClipKey('אמור את המילה לאט ונסה שוב!', 'normal') },
    ]);
  });

  it('is the English lead word, the shared middle, then the closer', () => {
    const parts = partsOfLine('[to:boy] card היא מילה אחרת מהרשימה. נסה שוב!');
    expect(parts).toEqual([
      { voice: 'he', key: getClipKey('card', 'normal') },
      { voice: 'he', key: '1rvtrnh60e' },
      { voice: 'he', key: getClipKey('נסה שוב!', 'normal') },
    ]);
  });

  it('is null for a line without an opener or a closer', () => {
    expect(partsOfLine('שלום לכולם')).toBeNull();
  });
});

const CORPUS_TIMEOUT_MS = 60_000;

describe('buildWholeLines', () => {
  it('finds the lines of the corpus said in parts', () => {
    const lines = buildWholeLines();
    expect(lines.length).toBeGreaterThan(100);
    expect(lines.every((line) => line.parts.length >= 2 && line.parts.length <= 3)).toBe(true);
    // Builds the whole Hebrew corpus: about 2 s alone, much longer while the full suite runs
  }, CORPUS_TIMEOUT_MS);
});
