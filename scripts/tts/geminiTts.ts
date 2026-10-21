/**
 * Gemini text-to-speech for the Hebrew clips (scripts/tts/renderGeminiBatch.ts): it reads Hebrew by
 * context, where Azure misread unvoweled words. Render-time only; the online voice (/api/tts) stays
 * Azure. Gemini returns 24 kHz WAV, encoded here to the same 48 kbps mono MP3 as the Azure clips,
 * with the same leading silence.
 */
import { Mp3Encoder } from '@breezystack/lamejs';

/** Chosen by ear in AI Studio (2026-10): voice Kira, given only the text to read. */
export const GEMINI_TTS_MODEL = 'gemini-3.8-flash-lite-tts';
export const GEMINI_TTS_VOICE = 'Kira';
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const MP3_KBPS = 48;
/** Silence before the speech, as in the Azure clips: a phone or Bluetooth speaker that wakes up late doesn't cut the first sound. */
const LEADING_SILENCE_MS = 200;
const MP3_FRAME_SAMPLES = 1152;
const DEFAULT_SAMPLE_RATE = 24000;

export class GeminiTtsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'GeminiTtsError';
  }
}

interface Pcm {
  samples: Int16Array;
  sampleRate: number;
}

/** The 16-bit mono samples of a WAV file, or of headerless PCM at `fallbackRate`. */
export function readPcm(bytes: Buffer, fallbackRate: number): Pcm {
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF') {
    const copy = Buffer.from(bytes);
    return { samples: new Int16Array(copy.buffer, copy.byteOffset, copy.length >> 1), sampleRate: fallbackRate };
  }
  let offset = 12;
  let sampleRate = fallbackRate;
  while (offset + 8 <= bytes.length) {
    const id = bytes.subarray(offset, offset + 4).toString('ascii');
    const size = bytes.readUInt32LE(offset + 4);
    if (id === 'fmt ') {
      const channels = bytes.readUInt16LE(offset + 10);
      const bits = bytes.readUInt16LE(offset + 22);
      if (channels !== 1 || bits !== 16) throw new GeminiTtsError(`Unexpected WAV: ${channels} channels, ${bits} bits`, 0);
      sampleRate = bytes.readUInt32LE(offset + 12);
    }
    if (id === 'data') {
      const data = Buffer.from(bytes.subarray(offset + 8, offset + 8 + size));
      return { samples: new Int16Array(data.buffer, data.byteOffset, data.length >> 1), sampleRate };
    }
    offset += 8 + size + (size % 2);
  }
  throw new GeminiTtsError('WAV without a data chunk', 0);
}

export function encodeMp3({ samples, sampleRate }: Pcm): Buffer {
  const silence = new Int16Array(Math.round((sampleRate * LEADING_SILENCE_MS) / 1000));
  const all = new Int16Array(silence.length + samples.length);
  all.set(samples, silence.length);
  const encoder = new Mp3Encoder(1, sampleRate, MP3_KBPS);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < all.length; i += MP3_FRAME_SAMPLES) {
    chunks.push(encoder.encodeBuffer(all.subarray(i, i + MP3_FRAME_SAMPLES)));
  }
  chunks.push(encoder.flush());
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

/**
 * One TTS request: only the text to read (an instruction in it would be read aloud) and the voice.
 * No languageCode: by ear (2026-10), he-IL gave pure Hebrew an English accent.
 */
export function buildGeminiRequest(text: string) {
  return {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: GEMINI_TTS_VOICE } } },
    },
  };
}

export interface GeminiResponse {
  candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[];
  error?: { message?: string };
}

/** The MP3 of a Gemini answer, or null when it holds no audio. */
export function responseToMp3(body: GeminiResponse): Buffer | null {
  const audio = body.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData;
  if (!audio?.data) return null;
  const rate = Number(/rate=(\d+)/.exec(audio.mimeType ?? '')?.[1] ?? DEFAULT_SAMPLE_RATE);
  return encodeMp3(readPcm(Buffer.from(audio.data, 'base64'), rate));
}

/** Reads `text` with Gemini and returns MP3 bytes (one request; a full render goes through the batch API). */
export async function synthesizeGemini(text: string, apiKey: string, timeoutMs: number): Promise<Buffer> {
  const response = await fetch(`${GEMINI_API_BASE}/models/${GEMINI_TTS_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGeminiRequest(text)),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = (await response.json().catch(() => ({}))) as GeminiResponse;
  if (!response.ok) throw new GeminiTtsError(body.error?.message ?? `Gemini TTS ${response.status}`, response.status);
  const mp3 = responseToMp3(body);
  if (!mp3) throw new GeminiTtsError('Gemini returned no audio', 502);
  return mp3;
}
