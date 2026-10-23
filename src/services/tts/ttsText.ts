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
 * The version of the rendered English sound (voices and SSML in api/_lib/azureTts.ts). Clips and online
 * answers are cached forever, so bump this whenever the sound changes, then re-render: the new
 * clip folder and URLs make every cache fetch the new audio.
 */
export const TTS_AUDIO_VERSION = 1;

/**
 * The Hebrew voice's own sound version, so its clips can be re-rendered without the English ones.
 * 2: Azure, with misread words spelled out in IPA (api/_lib/hebrewPronunciation.ts).
 * 3: rendered with Gemini, which reads Hebrew by context (scripts/tts/geminiTts.ts).
 */
export const HEBREW_AUDIO_VERSION = 3;

export function getAudioVersion(voice: ClipVoice): number {
  return voice === HEBREW_VOICE ? HEBREW_AUDIO_VERSION : TTS_AUDIO_VERSION;
}

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

const HEBREW_LETTER = /[\u05d0-\u05ea]/;
/** What the Hebrew voice calls the \ud83d\udd0a in an instruction ("\u05dc\u05d7\u05e6\u05d9 \u05e2\u05dc \ud83d\udd0a"), instead of guessing a word for it */
const SPEAKER_BUTTON_HE = '\u05db\u05e4\u05ea\u05d5\u05e8 \u05d4\u05e8\u05de\u05e7\u05d5\u05dc';
/** Hebrew text: Hebrew letters and points, Latin runs (an English word in an instruction), digits and punctuation. */
const HEBREW_SPEAKABLE = /^[\u0590-\u05ff\p{Script=Latin}0-9 .,!?'’"“”״׳\-–—:;()&%/+…]+$/u;
/** An English run inside Hebrew text: Latin words joined by spaces, commas, periods or hyphens. */
const LATIN_RUN = /[A-Za-z][A-Za-z0-9'’]*(?:[ ,.-]+[A-Za-z0-9'’]+)*/g;

/**
 * A letter's name as a clip ("bee" for B, "es aitch" for sh): written `[letter:b]`, rendered with
 * <say-as interpret-as="characters">, so a lone "a" isn't read as the article "uh".
 */
const LETTER_TOKEN = /^\[letter:([a-z]{1,2})\]$/;

export function letterToken(letter: string): string {
  return `[letter:${letter.toLowerCase()}]`;
}

/** The letters of a letter token ("SH"), or null for other text. */
export function parseLetterToken(text: string): string | null {
  const match = LETTER_TOKEN.exec(text.trim());
  return match ? match[1].toUpperCase() : null;
}

/** Letter names a device voice gets as a word, where its own reading differs from the taught one (Z: "zed", not "zee"). */
const SPOKEN_LETTER_NAMES: Readonly<Record<string, string>> = { Z: 'Zed' };

/** The text the online and device voices read for a phrase: a letter token becomes its capital letters (Z: "Zed"). */
export function toPlainSpeech(text: string): string {
  const letters = parseLetterToken(text);
  return letters ? (SPOKEN_LETTER_NAMES[letters] ?? letters) : text;
}

/** Whom the Hebrew voice addresses: the learner's gender. */
export type ListenerGender = 'girl' | 'boy';

/**
 * Hebrew words said to the learner that are written the same for a girl and a boy but read
 * differently ("בנית": banit / banita). A line with one gets a clip per gender, and the voice says
 * the word in the learner's form (api/_lib/hebrewPronunciation.ts spells out both).
 */
export const LISTENER_GENDERED_WORDS = ['בנית', 'שמעת', 'ששמעת', 'קראת', 'סיימת', 'דילגת', 'אותך', 'שלך'] as const;

const LISTENER_GENDERED = new RegExp(`(?<![\\u05d0-\\u05ea])(?:${LISTENER_GENDERED_WORDS.join('|')})(?![\\u05d0-\\u05ea])`);
const LISTENER_TOKEN = /^\[to:(girl|boy)\] /;

/** The Hebrew text tagged with the learner's gender (`[to:girl] …`) when a word in it reads by gender. */
export function addListenerGender(text: string, gender: ListenerGender | null): string {
  if (!gender || LISTENER_TOKEN.test(text) || !LISTENER_GENDERED.test(text)) return text;
  return `[to:${gender}] ${text}`;
}

/** The gender a tagged Hebrew text is said to, and the text without its tag. */
export function parseListenerGender(text: string): { gender: ListenerGender | null; text: string } {
  const match = LISTENER_TOKEN.exec(text);
  return match ? { gender: match[1] as ListenerGender, text: text.slice(match[0].length) } : { gender: null, text };
}

/** Blanks are read as "blank" and emoji are stripped so the voice doesn't read them out. */
export function toSpeakableText(text: string): string {
  return text
    // Bidi isolates and marks from isolateEnglishRuns aren't spoken, and must not change a clip key
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/_{3,}/g, 'blank')
    .replace(/🔊/gu, HEBREW_LETTER.test(text) ? SPEAKER_BUTTON_HE : '')
    .replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}|️|‍|⃣/gu, '')
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
  if (parseLetterToken(normalized)) return normalized;
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
  const normalized = parseListenerGender(normalizeTtsText(text)).text;
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
  return `?a=${getAudioVersion(voice)}&v=${voice}&s=${speed}&t=${encodeQueryValue(normalizeTtsText(text))}`;
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
