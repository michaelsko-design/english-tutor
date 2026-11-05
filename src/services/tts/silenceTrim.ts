/**
 * Word clips are rendered with about 0.4 s of silence before the word and 0.9 s after it, which
 * made quickly tapped words sound a second or two apart. The queue plays only the spoken part.
 */

/** Seconds of the clip to play: from `startS` to `endS`. */
export interface SpeechBounds {
  startS: number;
  endS: number;
}

/** Samples quieter than this count as silence. */
const SILENCE_AMPLITUDE = 0.01;
/** Kept before the first and after the last loud sample, so the word's attack and fade stay natural. */
const LEAD_PAD_S = 0.05;
const TRAIL_PAD_S = 0.12;
/** A clip with less speech than this is left whole (an empty or odd file). */
const MIN_SPEECH_S = 0.08;

/** The spoken part of mono samples, or null when there is no clear speech to cut to. */
export function findSpeechBounds(samples: Float32Array, sampleRate: number): SpeechBounds | null {
  let first = 0;
  while (first < samples.length && Math.abs(samples[first]) < SILENCE_AMPLITUDE) first += 1;
  let last = samples.length - 1;
  while (last > first && Math.abs(samples[last]) < SILENCE_AMPLITUDE) last -= 1;
  if (first >= last || (last - first) / sampleRate < MIN_SPEECH_S) return null;
  const duration = samples.length / sampleRate;
  return {
    startS: Math.max(0, first / sampleRate - LEAD_PAD_S),
    endS: Math.min(duration, (last + 1) / sampleRate + TRAIL_PAD_S),
  };
}

/** Decodes the audio and finds its spoken part; null where decoding isn't available or fails. */
export async function measureSpeechBounds(audio: Blob): Promise<SpeechBounds | null> {
  if (typeof OfflineAudioContext === 'undefined') return null;
  try {
    const data = await audio.arrayBuffer();
    // Offline: needs no user gesture. Length and rate only size the (unused) render buffer.
    const decoded = await new OfflineAudioContext(1, 1, 44_100).decodeAudioData(data);
    return findSpeechBounds(decoded.getChannelData(0), decoded.sampleRate);
  } catch {
    return null;
  }
}
