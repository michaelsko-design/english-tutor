/**
 * The listening lab: a few flagged lines rendered in several ways, so the ways can be compared by ear
 * (the Compare tab of npm run tts:review:he) before any of them is applied to the whole corpus.
 *
 * - niqqud: the line as one clip, with the words from LAB_SPELLINGS in niqqud.
 * - sentences: one clip per sentence, joined into the one MP3 (a Hebrew sentence no longer follows an
 *   English one).
 * - sentences-niqqud: both.
 * - runs-niqqud: also a clip per English run, so each Hebrew piece is read alone.
 * A winning way is promoted: its words move to GEMINI_SPELLINGS, its split into the render.
 */
import { toGeminiText } from './geminiSpelling';

export type LabVariant = 'niqqud' | 'sentences' | 'sentences-niqqud' | 'runs-niqqud' | ModelVariant;
export const LAB_VARIANTS: readonly LabVariant[] = ['niqqud', 'sentences', 'sentences-niqqud', 'runs-niqqud'];

/**
 * Model lab: the line as one clip on a bigger TTS model than the render's (geminiTts.ts), plain and with niqqud,
 * so the model's effect on the accent can be heard apart from the text.
 */
export type ModelVariant = 'flash' | 'flash-niqqud' | 'pro25' | 'pro25-niqqud';
export const MODEL_LAB_MODELS: Readonly<Record<ModelVariant, string>> = {
  flash: 'gemini-3.8-flash-tts',
  'flash-niqqud': 'gemini-3.8-flash-tts',
  pro25: 'gemini-2.5-pro-preview-tts',
  'pro25-niqqud': 'gemini-2.5-pro-preview-tts',
};
export const MODEL_LAB_VARIANTS = Object.keys(MODEL_LAB_MODELS) as ModelVariant[];
const ALL_LAB_VARIANTS: readonly LabVariant[] = [...LAB_VARIANTS, ...MODEL_LAB_VARIANTS];
/** Silence between the clips of one line. */
export const LAB_GAP_MS = 180;
export const LAB_TAKE_PREFIX = 'lab-';

/** Words flagged by ear in the review (2026-10), in the form Gemini should read them. Now also in GEMINI_SPELLINGS, so every render applies them. */
export const LAB_SPELLINGS: Readonly<Record<string, string>> = {
  קראי: 'קִרְאִי',
  קראו: 'קִרְאוּ',
  וקראי: 'וְקִרְאִי',
  אמרו: 'אִמְרוּ',
  חשבו: 'חִשְׁבוּ',
  מטרייה: 'מִטְרִיָּה',
  דובי: 'דּוּבִי',
  לאוגר: 'לָאוֹגֶר',
  מצדף: 'מִצֶּדֶף',
  מעולה: 'מְעֻלָּה',
  מיטה: 'מִטָּה',
  לימון: 'לִימוֹן',
  תרנגולת: 'תַּרְנְגֹלֶת',
  זו: 'זוֹ',
};

const HEBREW_LETTER = '\\u05d0-\\u05ea';
const LATIN = /[A-Za-z]/;
const HEBREW = /[א-ת]/;
const SENTENCE_END = /[.!?:]["”')]*$/;
const DASH_ONLY = /^[—–-]+$/;

export function applyLabSpellings(text: string): string {
  const pattern = new RegExp(`(?<![${HEBREW_LETTER}])(${Object.keys(LAB_SPELLINGS).join('|')})(?![${HEBREW_LETTER}])`, 'g');
  return text.replace(pattern, (word) => LAB_SPELLINGS[word] ?? word);
}

type TokenKind = 'en' | 'he';
const kindOf = (token: string): TokenKind => (LATIN.test(token) && !HEBREW.test(token) ? 'en' : 'he');

/** Cuts a line at sentence ends and dashes, and with `isSplitByLanguage` also where English and Hebrew meet. */
export function splitLine(text: string, isSplitByLanguage: boolean): string[] {
  const segments: string[] = [];
  let current: string[] = [];
  let currentKind: TokenKind | null = null;
  const flush = () => {
    if (current.length > 0) segments.push(current.join(' '));
    current = [];
    currentKind = null;
  };
  for (const token of text.split(/\s+/).filter(Boolean)) {
    if (DASH_ONLY.test(token)) {
      flush();
      continue;
    }
    const hasWord = LATIN.test(token) || HEBREW.test(token) || /\d/.test(token);
    if (hasWord) {
      const kind = kindOf(token);
      if (isSplitByLanguage && currentKind && kind !== currentKind) flush();
      currentKind = kind;
    }
    if (hasWord || current.length > 0) current.push(token);
    if (SENTENCE_END.test(token)) flush();
  }
  flush();
  return segments;
}

/** The clips whose audio makes up `variant` of a line (Gemini text per clip). */
export function labSegments(variant: LabVariant, clipText: string): string[] {
  const spoken = toGeminiText(clipText);
  if (variant === 'flash' || variant === 'pro25') return [spoken];
  if (variant === 'niqqud' || variant === 'flash-niqqud' || variant === 'pro25-niqqud') return [applyLabSpellings(spoken)];
  if (variant === 'sentences') return splitLine(spoken, false);
  const voweled = applyLabSpellings(spoken);
  return splitLine(voweled, variant === 'runs-niqqud');
}

export type LabClass = 'mixed' | 'short' | 'other';

export function classifyLine(clipText: string): LabClass {
  const text = toGeminiText(clipText);
  if (LATIN.test(text)) return 'mixed';
  return text.split(/\s+/).filter(Boolean).length <= 3 ? 'short' : 'other';
}

/** Up to `perClass` flagged lines of each class, so the lab covers every kind of problem. */
export function pickLabKeys<T extends { key: string; text: string }>(flagged: readonly T[], perClass: number): T[] {
  const counts: Record<LabClass, number> = { mixed: 0, short: 0, other: 0 };
  return flagged.filter((item) => {
    const kind = classifyLine(item.text);
    if (counts[kind] >= perClass) return false;
    counts[kind] += 1;
    return true;
  });
}

/** The request key of one clip of a lab line: `<key>~<variant>~<index>~<count>`. */
export const labRequestKey = (key: string, variant: LabVariant, index: number, count: number): string => `${key}~${variant}~${index}~${count}`;

export function parseLabRequestKey(requestKey: string): { key: string; variant: LabVariant; index: number; count: number } | null {
  const [key, variant, index, count] = requestKey.split('~');
  if (!key || !ALL_LAB_VARIANTS.includes(variant as LabVariant)) return null;
  return { key, variant: variant as LabVariant, index: Number(index), count: Number(count) };
}
