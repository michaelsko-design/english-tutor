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

  it('is null for a line without an opener', () => {
    expect(partsOfLine('שלום לכולם')).toBeNull();
  });
});

describe('buildWholeLines', () => {
  it('finds the lines of the corpus that start with an opener', () => {
    const lines = buildWholeLines();
    expect(lines.length).toBeGreaterThan(100);
    expect(lines.every((line) => line.parts.length === 2)).toBe(true);
  });
});
