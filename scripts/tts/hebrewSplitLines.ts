/**
 * Hebrew lines rendered in pieces: each English run, and each sentence, as its own Gemini clip, joined
 * into the line's one MP3. Said inside a Hebrew clip, English words and letter names came out in a
 * Hebrew accent; said alone they did not (owner, by ear, 2026-11-28).
 *
 * Only lines the owner marked bad are split (owner's choice, 2026-11-28): the lines already approved as
 * one clip keep their audio. `regenerate` renders a marked line that has pieces as the take 'split';
 * choosing that take in the review records the line in hebrewSplitLines.json, so a later render of
 * that line (submit after redo, a new voice version) splits it again instead of falling back to one clip.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { labSegments } from './geminiLab';
import { joinPcm, trimLeadingSilence, trimTrailingSilence, type Pcm } from './geminiTts';

/** Line key → line text (the text only so the file can be read by a person). */
export type SplitLines = Readonly<Record<string, string>>;

export const SPLIT_LINES_PATH = join(process.cwd(), 'scripts', 'tts', 'hebrewSplitLines.json');
/** The review take of a line rendered in pieces. */
export const SPLIT_TAKE = 'split';
/** Each piece's own quiet is cut to this at a join, so the pieces follow as one line does. */
const EDGE_MS = 40;
/** Between pieces of one sentence: 180 ms sounded slow ("robot מתחיל באות R", 2026-11-28). */
const PIECE_GAP_MS = 40;
/** After a sentence: the Z line needed 250 ms more between "זוֹ האות זֶד." and "זֶד כמו" (2026-11-28). */
const SENTENCE_GAP_MS = 290;
const SENTENCE_END = /[.!?]["”')]*$/;

export function loadSplitLines(path: string = SPLIT_LINES_PATH): SplitLines {
  if (!existsSync(path)) return {};
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(`${path} is not a key → text map.`);
  return parsed as SplitLines;
}

export function saveSplitLines(lines: SplitLines, path: string = SPLIT_LINES_PATH): void {
  const sorted = Object.fromEntries(Object.entries(lines).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(path, `${JSON.stringify(sorted, null, 2)}\n`);
}

/** The line after a take was chosen: rendered in pieces when the split take won, as one clip otherwise. */
export function withChosenTake(lines: SplitLines, key: string, text: string, take: string): SplitLines {
  const rest = Object.fromEntries(Object.entries(lines).filter(([lineKey]) => lineKey !== key));
  return take === SPLIT_TAKE ? { ...rest, [key]: text } : rest;
}

/** The Gemini text of each piece of a line. */
export const splitPieces = (clipText: string): string[] => labSegments('runs-niqqud', clipText);

/** A line `regenerate` renders in pieces: English inside Hebrew (a Hebrew-only line stays one clip). */
export function canSplit(clipText: string): boolean {
  const pieces = splitPieces(clipText);
  return pieces.length > 1 && pieces.some((piece) => /[A-Za-z]/.test(piece));
}

/** Joins the rendered pieces of a line, a longer pause after a sentence than inside one. */
export function stitchPieces(pieces: readonly Pcm[], texts: readonly string[]): Pcm {
  const trimmed = pieces.map((pcm, index) => {
    const tailCut = index < pieces.length - 1 ? trimTrailingSilence(pcm, EDGE_MS) : pcm;
    return index > 0 ? trimLeadingSilence(tailCut, EDGE_MS) : tailCut;
  });
  const gaps = texts.slice(0, -1).map((text) => (SENTENCE_END.test(text) ? SENTENCE_GAP_MS : PIECE_GAP_MS));
  return joinPcm(trimmed, gaps);
}
