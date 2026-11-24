import { describe, expect, it } from 'vitest';
import { partRanges, speechLength, speechRuns } from './partCut';

describe('speechRuns', () => {
  it('is the speech between the silences, up to the end', () => {
    expect(speechRuns([{ start: 0, end: 0.1 }, { start: 0.6, end: 0.9 }], 2)).toEqual([
      { start: 0.1, end: 0.6 },
      { start: 0.9, end: 2 },
    ]);
  });

  it('measures the speech, first sound to last', () => {
    expect(speechLength(speechRuns([{ start: 0, end: 0.1 }, { start: 0.6, end: 0.9 }, { start: 1.5, end: 2 }], 2))).toBeCloseTo(1.4);
  });
});

describe('partRanges', () => {
  // A 4 s clip: opener 0.5–1.2, a pause, the line 1.7–3.2 (with a short pause at 2.4), a pause, closer 3.6–4.1
  const silences = [
    { start: 0, end: 0.5 },
    { start: 1.2, end: 1.7 },
    { start: 2.4, end: 2.5 },
    { start: 3.2, end: 3.6 },
    { start: 4.1, end: 4.3 },
  ];
  const runs = speechRuns(silences, 4.3);

  it('cuts the shared opener and closer at the pauses nearest their own length, keeping a margin', () => {
    const ranges = partRanges(runs, [0.7, null, 0.5], 4.3);
    expect(ranges).toHaveLength(3);
    expect(ranges?.[0]).toEqual({ start: 0, end: expect.closeTo(1.3) });
    expect(ranges?.[1]).toEqual({ start: expect.closeTo(1.6), end: expect.closeTo(3.3) });
    expect(ranges?.[2]).toEqual({ start: expect.closeTo(3.5), end: 4.3 });
  });

  it('cuts a line with a closer only', () => {
    const ranges = partRanges(runs.slice(1), [null, 0.5], 4.3);
    expect(ranges?.[0]?.end).toBeCloseTo(3.3);
  });

  it('refuses a cut where a shared part would be far off its own length', () => {
    expect(partRanges(runs, [null, 1.0], 4.3)).toBeNull();
  });

  it('refuses a clip with fewer runs than parts, or without exactly one own part', () => {
    expect(partRanges(runs.slice(0, 1), [null, 0.5], 4.3)).toBeNull();
    expect(partRanges(runs, [0.7, 0.5], 4.3)).toBeNull();
  });
});
