/**
 * Text rules shared by the read-aloud service, the /api/tts proxy and the clip render scripts
 * (scripts/tts/), so a phrase gets the same clip key everywhere.
 */
import type { VoicePreference } from '../../utils/ttsVoice';

export type TtsSpeed = 'normal' | 'slow';

/** The language a phrase is read in; Hebrew has one voice whatever the English voice choice is. */
export type TtsLang = 'en' | 'he';

/** A rendered clip voice: the two English voices and the Hebrew voice (public/tts/v<N>/<voice>/). */
export type ClipVoice = VoicePreference | 'he-female';

export const HEBREW_VOICE = 'he-female' satisfies ClipVoice;

export const TTS_VOICES: readonly ClipVoice[] = ['female', 'male', HEBREW_VOICE];

/**
 * The version of the rendered sound (voices and SSML in api/_lib/azureTts.ts). Clips and online
 * answers are cached forever, so bump this whenever the sound changes, then re-render: the new
 * clip folder and URLs make every cache fetch the new audio.
 */
export const TTS_AUDIO_VERSION = 1;
export const TTS_SPEEDS: readonly TtsSpeed[] = ['normal', 'slow'];

/** The longest text the online voice reads; longer text uses the device voice. */
export const MAX_TTS_CHARS = 200;

/** The longest text rendered as a clip (story passages are rendered too). */
export const MAX_CLIP_CHARS = 2000;

/** Read-aloud rates at or below this are rendered slowly (vault 0.65, voice drill 0.7, games 0.8). */
const SLOW_RATE_MAX = 0.8;

/** The rate a normal clip is rendered at; slower requests without a slow clip play it slower. */
export const CLIP_BASE_RATE = 0.95;

const EDGE_PUNCTUATION = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;
/** English text: Latin letters (café, naïve), digits, punctuation and the + of grammar formulas. */
const CLOUD_SPEAKABLE = /^[\p{Script=Latin}0-9 .,!?'’"“”\-–—:;()&%$/+]+$/u;

const HEBREW_LETTER = /[א-ת]/;
/** Hebrew text: Hebrew letters and points, Latin runs (an English word in an instruction), digits and punctuation. */
const HEBREW_SPEAKABLE = /^[֐-׿\p{Script=Latin}0-9 .,!?'’"“”״׳\-–—:;()&%/+…]+$/u;
/** An English run inside Hebrew text: Latin words joined by spaces, commas, periods or hyphens. */
const LATIN_RUN = /[A-Za-z][A-Za-z0-9'’]*(?:[ ,.-]+[A-Za-z0-9'’]+)*/g;

/** Blanks are read as "blank" and emoji are stripped so the voice doesn't read them out. */
export function toSpeakableText(text: string): string {
  return text
    .replace(/_{3,}/g, 'blank')
    .replace(/\p{Extended_Pictographic}|️|‍|⃣/gu, '')
    .trim();
}

/** Trims and collapses whitespace (NFC, so é has one spelling); the text that is actually sent to the voice. */
export function normalizeTtsText(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

export function isSingleWord(text: string): boolean {
  return !/\s/.test(normalizeTtsText(text));
}

/**
 * The text a clip is stored under. A single word is lowercased and loses its edge punctuation, so a
 * word chip ("school.") and a vocabulary word ("School") share one clip.
 */
export function getClipText(text: string): string {
  const normalized = normalizeTtsText(text);
  if (!isSingleWord(normalized)) return normalized;
  const bare = normalized.replace(EDGE_PUNCTUATION, '');
  return bare === 'I' ? bare : bare.toLowerCase();
}

/** Whether the online voice accepts the text: plain English, at most `maxChars` (MAX_TTS_CHARS). */
export function isCloudSpeakable(text: string, maxChars = MAX_TTS_CHARS): boolean {
  const normalized = normalizeTtsText(text);
  return (
    normalized.length > 0 &&
    normalized.length <= maxChars &&
    /[A-Za-z]/.test(normalized) &&
    CLOUD_SPEAKABLE.test(normalized)
  );
}

/** Whether the Hebrew voice accepts the text: it has Hebrew letters, at most `maxChars` (MAX_TTS_CHARS). */
export function isHebrewSpeakable(text: string, maxChars = MAX_TTS_CHARS): boolean {
  const normalized = normalizeTtsText(text);
  return (
    normalized.length > 0 &&
    normalized.length <= maxChars &&
    HEBREW_LETTER.test(normalized) &&
    HEBREW_SPEAKABLE.test(normalized)
  );
}

/** Whether a voice can read the text: Hebrew for the Hebrew voice, plain English for the others. */
export function isSpeakableBy(voice: ClipVoice, text: string, maxChars = MAX_TTS_CHARS): boolean {
  return voice === HEBREW_VOICE ? isHebrewSpeakable(text, maxChars) : isCloudSpeakable(text, maxChars);
}

export interface LangRun {
  lang: TtsLang;
  text: string;
}

/** Splits Hebrew text into Hebrew and English runs, so the multilingual voice reads "cat" in English. */
export function splitLangRuns(text: string): LangRun[] {
  const runs: LangRun[] = [];
  let last = 0;
  for (const match of text.matchAll(LATIN_RUN)) {
    const start = match.index ?? 0;
    if (start > last) runs.push({ lang: 'he', text: text.slice(last, start) });
    runs.push({ lang: 'en', text: match[0] });
    last = start + match[0].length;
  }
  if (last < text.length) runs.push({ lang: 'he', text: text.slice(last) });
  return runs.filter((run) => run.text.trim().length > 0);
}

export function getSpeedBucket(rate: number): TtsSpeed {
  return rate <= SLOW_RATE_MAX ? 'slow' : 'normal';
}

/** Slow clips exist only for single words; slow sentences play the normal clip slower. */
export function getClipSpeed(text: string, speed: TtsSpeed): TtsSpeed {
  return speed === 'slow' && isSingleWord(text) ? 'slow' : 'normal';
}

export function isTtsVoice(value: unknown): value is ClipVoice {
  return value === 'female' || value === 'male' || value === HEBREW_VOICE;
}

export function isTtsSpeed(value: unknown): value is TtsSpeed {
  return value === 'normal' || value === 'slow';
}

/** cyrb53: a fast 53-bit string hash, plenty to tell a few thousand phrases apart. */
function cyrb53(input: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** The file name (without extension) of a clip: the hash of its clip text and speed. */
export function getClipKey(text: string, speed: TtsSpeed): string {
  const clipText = getClipText(text);
  return cyrb53(`${getClipSpeed(clipText, speed)}|${clipText}`).toString(36);
}

/**
 * The one URL query the online voice accepts for a phrase. The server rejects any other spelling
 * (extra parameters, another order or encoding), so each phrase has one CDN cache entry.
 */
export function buildLiveTtsQuery(text: string, voice: ClipVoice, speed: TtsSpeed): string {
  return `?a=${TTS_AUDIO_VERSION}&v=${voice}&s=${speed}&t=${encodeQueryValue(normalizeTtsText(text))}`;
}

/**
 * encodeURIComponent leaves ! ' ( ) * as they are, but URL parsers (browsers, the Vercel runtime)
 * rewrite ' as %27. Encoding them all keeps the URL the client sends identical to the one the
 * server parses, so text like "I'm" passes the canonical check.
 */
function encodeQueryValue(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** The header carrying the learner's Firebase ID token to /api/tts (the CDN cache key ignores it). */
export const TTS_TOKEN_HEADER = 'X-Firebase-Token';
/** The header carrying the Firebase App Check token to /api/tts. */
export const APP_CHECK_HEADER = 'X-Firebase-AppCheck';
