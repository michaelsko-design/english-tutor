import { describe, expect, it } from 'vitest';
import { firstPause, isTypicalOpener, median, openerLength, openerRange, parseSilences, restStart } from './openerCut';

const LOG = `
[silencedetect @ 0x1] silence_start: 0
[silencedetect @ 0x1] silence_end: 0.516 | silence_duration: 0.516
[silencedetect @ 0x1] silence_start: 1.19175
[silencedetect @ 0x1] silence_end: 1.521125 | silence_duration: 0.329
[silencedetect @ 0x1] silence_start: 4.0`;

describe('opener cut', () => {
  it('reads the silences and finds the pause after the opener', () => {
    const silences = parseSilences(LOG);
    expect(silences).toHaveLength(2);
    expect(firstPause(silences)).toEqual({ leadEnd: 0.516, start: 1.19175, end: 1.521125 });
  });

  it('finds no pause when the clip has no opening silence or no second silence', () => {
    expect(firstPause([{ start: 0.4, end: 0.9 }, { start: 2, end: 2.3 }])).toBeNull();
    expect(firstPause([{ start: 0, end: 0.5 }])).toBeNull();
  });

  it('cuts the opener and the rest around the pause, keeping a little silence', () => {
    const pause = { leadEnd: 0.5, start: 1.2, end: 1.5 };
    expect(openerRange(pause)).toEqual({ from: 0.4, to: 1.3 });
    expect(restStart(pause)).toBeCloseTo(1.4);
    expect(openerLength(pause)).toBeCloseTo(0.7);
  });

  it('accepts an opener of the usual length and rejects one that is far off', () => {
    expect(median([0.7, 0.9, 0.8])).toBe(0.8);
    expect(isTypicalOpener(0.85, 0.8)).toBe(true);
    expect(isTypicalOpener(2.5, 0.8)).toBe(false);
  });
});
