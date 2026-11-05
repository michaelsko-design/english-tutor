import { describe, expect, it } from 'vitest';
import { findSpeechBounds, measureSpeechBounds } from './silenceTrim';

const RATE = 1000;

/** Silence, then `speechS` seconds of a loud tone, then silence. */
function clip(leadS: number, speechS: number, trailS: number): Float32Array {
  const samples = new Float32Array(Math.round((leadS + speechS + trailS) * RATE));
  const from = Math.round(leadS * RATE);
  const to = from + Math.round(speechS * RATE);
  for (let i = from; i < to; i += 1) samples[i] = 0.5;
  return samples;
}

describe('findSpeechBounds', () => {
  it('cuts the silent lead-in and tail, keeping a little around the word', () => {
    const bounds = findSpeechBounds(clip(0.4, 0.5, 0.9), RATE);

    expect(bounds?.startS).toBeCloseTo(0.35, 2);
    expect(bounds?.endS).toBeCloseTo(1.02, 2);
  });

  it('never goes past the ends of a clip with no silence around the word', () => {
    const bounds = findSpeechBounds(clip(0, 0.5, 0), RATE);

    expect(bounds).toEqual({ startS: 0, endS: 0.5 });
  });

  it('returns null for a silent clip', () => {
    expect(findSpeechBounds(new Float32Array(2000), RATE)).toBeNull();
  });

  it('returns null when there is too little sound to be a word', () => {
    expect(findSpeechBounds(clip(0.4, 0.02, 0.9), RATE)).toBeNull();
  });
});

describe('measureSpeechBounds', () => {
  it('gives null where audio decoding is not available', async () => {
    expect(await measureSpeechBounds(new Blob([new Uint8Array([1])]))).toBeNull();
  });
});
