/**
 * What the review pages know about each Hebrew clip beside its mark: the text Gemini was given, where
 * in the app it is heard, and the whole lines a cut clip is part of. Used by the local review server
 * (reviewHebrewClips.ts) and by the snapshot the phone page reads (reviewCloudSnapshot.ts).
 */
import { getClipKey, getClipText, HEBREW_CLOSERS, HEBREW_OPENERS, HEBREW_SHARED_MIDDLES, HEBREW_VOICE, parseListenerGender } from '../../src/services/tts/ttsText';
import { collectCorpus } from './corpus';
import type { CorpusPhrase } from './corpusBuilder';
import { toGeminiText } from './geminiSpelling';
import { buildReviewPlaces } from './hebrewReviewOrder';
import { buildWholeLines, type LinePart, type WholeLine } from './wholeLines';

export interface CutLine {
  /** The whole line as the app asks for it, with its [to:girl] / [to:boy] tag when it has one. */
  text: string;
  /** The same line as Gemini was given it (niqqud on the gendered words). */
  spoken: string;
  parts: LinePart[];
  /** Who the line is said to: its tag, else its closer (נסי girl, נסה boy, נסו everyone). */
  listener: 'girl' | 'boy' | 'all';
}

export interface CatalogEntry {
  /** The text exactly as Gemini was given it: niqqud on the words that read by the listener's gender. */
  spoken: string;
  group: string;
  where: string;
  rank: number;
  /** The whole lines a cut clip is heard in. */
  lines?: readonly CutLine[];
}

export interface ReviewCatalog {
  phrases: CorpusPhrase[];
  wholeLines: WholeLine[];
  describe(phrase: CorpusPhrase): CatalogEntry;
}

const LAST_RANK = Number.MAX_SAFE_INTEGER;
const OPENER_RANK = -1;

/** The shared openers and closers ("מעולה!", "נסי שוב!", …) are heard in hundreds of lines, so they get their own group, first in the walk. */
const OPENER_TEXTS: ReadonlySet<string> = new Set(
  [...HEBREW_OPENERS, ...HEBREW_SHARED_MIDDLES, ...HEBREW_CLOSERS].map((part) => getClipText(part)),
);
const isOpenerClip = (text: string): boolean => OPENER_TEXTS.has(getClipText(text.replace(/^\[to:(?:girl|boy)\] /, '')));

function listenerOf(text: string): CutLine['listener'] {
  const { gender, text: plain } = parseListenerGender(text);
  if (gender) return gender;
  if (plain.endsWith('נסי שוב!')) return 'girl';
  if (plain.endsWith('נסה שוב!')) return 'boy';
  return 'all';
}

/**
 * Each cut clip with every line it is heard in (often a girl's and a boy's line share it, and only
 * the closer differs), so its cut is judged as the app plays it and the full line can be read.
 */
function groupCutLines(phrases: readonly CorpusPhrase[], wholeLines: readonly WholeLine[]): ReadonlyMap<string, readonly CutLine[]> {
  const textByKey = new Map(phrases.map((phrase) => [phrase.key, phrase.text]));
  const closerKeys = new Set(HEBREW_CLOSERS.map((closer) => getClipKey(getClipText(closer), 'normal')));

  /** A line's own clip, cut from its whole clip before a shared closer (tts:cut:he:parts). */
  const cutOwnPart = (parts: readonly LinePart[]): LinePart | null => {
    const own = parts[parts.length - 2];
    const last = parts[parts.length - 1];
    if (!own || !last || own.voice !== 'he' || !closerKeys.has(last.key)) return null;
    return isOpenerClip(textByKey.get(own.key) ?? '') ? null : own;
  };

  return wholeLines.reduce((map, line) => {
    const own = cutOwnPart(line.parts);
    if (!own) return map;
    const cutLine: CutLine = { text: line.text, spoken: toGeminiText(line.text), parts: line.parts, listener: listenerOf(line.text) };
    return map.set(own.key, [...(map.get(own.key) ?? []), cutLine]);
  }, new Map<string, readonly CutLine[]>());
}

export function buildReviewCatalog(): ReviewCatalog {
  const phrases = collectCorpus(HEBREW_VOICE);
  const places = buildReviewPlaces();
  const wholeLines = buildWholeLines();
  const cutLinesByKey = groupCutLines(phrases, wholeLines);
  const describe = (phrase: CorpusPhrase): CatalogEntry => {
    const isOpener = isOpenerClip(phrase.text);
    const place = places.get(phrase.key);
    return {
      spoken: toGeminiText(phrase.text),
      group: isOpener ? 'opener' : (place?.group ?? 'other'),
      where: isOpener ? 'opener' : (place?.label ?? ''),
      rank: isOpener ? OPENER_RANK : (place?.rank ?? LAST_RANK),
      lines: cutLinesByKey.get(phrase.key),
    };
  };
  return { phrases, wholeLines, describe };
}

/** The walk order: general lines, core units, the Pro tail, then the packs; unplaced lines last. */
export const byWalkOrder = (a: { rank: number; text: string }, b: { rank: number; text: string }): number =>
  a.rank - b.rank || a.text.localeCompare(b.text);
