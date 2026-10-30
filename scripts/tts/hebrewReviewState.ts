/**
 * The review marks of the Hebrew clips (see reviewHebrewClips.ts). A mark is tied to the audio it was
 * given to (a fingerprint), so a clip that was replaced or newly rendered is pending again while the
 * approved ones never come back.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CorpusPhrase } from './corpusBuilder';

export type ReviewStatus = 'good' | 'regenerate';
export type ReviewDecision = 'new' | 'old' | 'again';
/** missing: no clip on disk. compare: marked for regenerate and a new take is waiting. */
export type ReviewPhase = 'pending' | 'good' | 'regenerate' | 'compare' | 'missing';

/** Why a clip was marked for regenerate; chosen on the review page. */
export const REVIEW_REASONS = ['wrong-gender', 'english-accent', 'mispronounced', 'letter-name', 'cut-off', 'too-fast', 'too-slow', 'noise', 'bad-wording'] as const;
export type ReviewReason = (typeof REVIEW_REASONS)[number];
export const MAX_NOTE_LENGTH = 300;

export interface ReviewDetail {
  reasons: readonly ReviewReason[];
  note: string;
}

export interface ReviewEntry {
  status: ReviewStatus;
  reasons?: readonly ReviewReason[];
  note?: string;
  /** Fingerprint of the clip file when it was judged. */
  fp: string;
  at: string;
}

export type ReviewState = Readonly<Record<string, ReviewEntry>>;

export interface ReviewDirs {
  clipDir: string;
  candidateDir: string;
  /** What each compare decision replaced, kept so the decision can be undone. */
  undoDir: string;
  statePath: string;
}

export interface ReviewItem {
  key: string;
  text: string;
  speed: CorpusPhrase['speed'];
  phase: ReviewPhase;
  /** The waiting new takes: 'new' (a regeneration) and 'lab-…' (listening-lab variants). */
  takes: readonly string[];
  reasons: readonly ReviewReason[];
  note: string;
}

export const clipPath = (dirs: ReviewDirs, key: string): string => join(dirs.clipDir, `${key}.mp3`);
export const DEFAULT_TAKE = 'new';
const TAKE_FILE = /^([a-z0-9]+)(?:.([a-z0-9-]+))?.mp3$/;
export const isTakeName = (take: string): boolean => /^[a-z0-9-]+$/.test(take);

export const candidatePath = (dirs: ReviewDirs, key: string, take: string = DEFAULT_TAKE): string =>
  join(dirs.candidateDir, take === DEFAULT_TAKE ? `${key}.mp3` : `${key}.${take}.mp3`);

/** The waiting new takes of every clip, from one read of the candidates folder. */
export function readTakes(dirs: ReviewDirs): ReadonlyMap<string, readonly string[]> {
  const takes = new Map<string, string[]>();
  if (!existsSync(dirs.candidateDir)) return takes;
  for (const name of readdirSync(dirs.candidateDir)) {
    const match = TAKE_FILE.exec(name);
    if (match) takes.set(match[1] as string, [...(takes.get(match[1] as string) ?? []), match[2] ?? DEFAULT_TAKE].sort());
  }
  return takes;
}

export function fingerprintFile(path: string): string | null {
  if (!existsSync(path)) return null;
  const bytes = readFileSync(path);
  return `${bytes.length}-${createHash('sha1').update(bytes).digest('hex').slice(0, 16)}`;
}

export function loadState(statePath: string): ReviewState {
  if (!existsSync(statePath)) return {};
  return JSON.parse(readFileSync(statePath, 'utf8')) as ReviewState;
}

/** Writes through a temp file so stopping mid-write can't corrupt the marks. */
export function saveState(statePath: string, state: ReviewState): void {
  const sorted = Object.fromEntries(Object.entries(state).sort(([a], [b]) => a.localeCompare(b)));
  const temp = `${statePath}.tmp`;
  // The marks are hours of listening: keep the previous version beside the file
  if (existsSync(statePath)) copyFileSync(statePath, `${statePath}.bak`);
  writeFileSync(temp, `${JSON.stringify(sorted, null, 2)}\n`);
  renameSync(temp, statePath);
}

function phaseOf(entry: ReviewEntry | undefined, fp: string | null, hasCandidate: boolean): ReviewPhase {
  if (!fp) return 'missing';
  if (!entry || entry.fp !== fp) return 'pending';
  if (entry.status === 'good') return 'good';
  return hasCandidate ? 'compare' : 'regenerate';
}

/** The corpus lines in corpus order, each with where it stands in the review. */
export function listReviewItems(phrases: readonly CorpusPhrase[], state: ReviewState, dirs: ReviewDirs): ReviewItem[] {
  const takesByKey = readTakes(dirs);
  return phrases.map((phrase) => {
    const entry = state[phrase.key];
    const takes = takesByKey.get(phrase.key) ?? [];
    const isMarked = entry?.status === 'regenerate';
    return {
      key: phrase.key,
      text: phrase.text,
      speed: phrase.speed,
      phase: phaseOf(entry, fingerprintFile(clipPath(dirs, phrase.key)), takes.length > 0),
      takes,
      reasons: isMarked ? (entry.reasons ?? []) : [],
      note: isMarked ? (entry.note ?? '') : '',
    };
  });
}

function withEntry(state: ReviewState, key: string, entry: ReviewEntry | null): ReviewState {
  const rest = Object.fromEntries(Object.entries(state).filter(([existing]) => existing !== key));
  return entry ? { ...rest, [key]: entry } : rest;
}

const today = (): string => new Date().toISOString().slice(0, 10);

/** Marks a clip as judged on the audio it has now; `null` takes the mark back. */
export function markClip(
  dirs: ReviewDirs,
  state: ReviewState,
  key: string,
  status: ReviewStatus | null,
  detail?: ReviewDetail,
): ReviewState {
  if (status === null) return withEntry(state, key, null);
  const fp = fingerprintFile(clipPath(dirs, key));
  if (!fp) throw new Error(`No clip for ${key}.`);
  const note = detail?.note.trim() ?? '';
  const why = status === 'regenerate' && detail ? { ...(detail.reasons.length > 0 && { reasons: detail.reasons }), ...(note && { note }) } : {};
  return withEntry(state, key, { status, ...why, fp, at: today() });
}

interface UndoMeta {
  at: string;
  decision: 'replaced' | 'kept';
  takes: readonly string[];
  /** The review entry before the decision (null: there was none). */
  entry: ReviewEntry | null;
}

const undoFolder = (dirs: ReviewDirs, key: string): string => join(dirs.undoDir, key);
const undoTakePath = (dirs: ReviewDirs, key: string, take: string): string => join(undoFolder(dirs, key), `take-${take}.mp3`);

/** Keeps what a decision is about to change (the original clip, the waiting takes, the mark), so it can be undone. */
function stashDecision(dirs: ReviewDirs, state: ReviewState, key: string, waiting: readonly string[], isReplacing: boolean): void {
  rmSync(undoFolder(dirs, key), { recursive: true, force: true });
  mkdirSync(undoFolder(dirs, key), { recursive: true });
  if (isReplacing) copyFileSync(clipPath(dirs, key), join(undoFolder(dirs, key), 'clip.mp3'));
  for (const take of waiting) copyFileSync(candidatePath(dirs, key, take), undoTakePath(dirs, key, take));
  const meta: UndoMeta = { at: new Date().toISOString(), decision: isReplacing ? 'replaced' : 'kept', takes: waiting, entry: state[key] ?? null };
  writeFileSync(join(undoFolder(dirs, key), 'meta.json'), JSON.stringify(meta));
}

/** Clips whose last compare decision can still be undone, newest first. */
export function listUndoable(dirs: ReviewDirs): { key: string; at: string }[] {
  if (!existsSync(dirs.undoDir)) return [];
  return readdirSync(dirs.undoDir)
    .filter((key) => existsSync(join(undoFolder(dirs, key), 'meta.json')))
    .map((key) => ({ key, at: (JSON.parse(readFileSync(join(undoFolder(dirs, key), 'meta.json'), 'utf8')) as UndoMeta).at }))
    .sort((a, b) => b.at.localeCompare(a.at));
}

/**
 * Takes back the last compare decision of a clip: the original audio, the waiting takes and the mark
 * come back. `wasReplaced` says the clip file had been replaced, so its revision must be taken back too.
 */
export function undoDecision(dirs: ReviewDirs, state: ReviewState, key: string): { state: ReviewState; wasReplaced: boolean } {
  const metaPath = join(undoFolder(dirs, key), 'meta.json');
  if (!existsSync(metaPath)) throw new Error(`Nothing to undo for ${key}.`);
  const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as UndoMeta;
  const wasReplaced = meta.decision === 'replaced';
  if (wasReplaced) copyFileSync(join(undoFolder(dirs, key), 'clip.mp3'), clipPath(dirs, key));
  for (const take of meta.takes) copyFileSync(undoTakePath(dirs, key, take), candidatePath(dirs, key, take));
  rmSync(undoFolder(dirs, key), { recursive: true, force: true });
  return { state: withEntry(state, key, meta.entry), wasReplaced };
}

/**
 * Settles a clip whose new takes are waiting. `new` replaces the original with the chosen take; `old`
 * keeps the original; `again` keeps it and leaves the clip marked for the next batch. Every waiting
 * take is dropped; the original is never touched unless `new` is chosen.
 */
export function decideCandidate(
  dirs: ReviewDirs,
  state: ReviewState,
  key: string,
  decision: ReviewDecision,
  take: string = DEFAULT_TAKE,
): { state: ReviewState; isReplaced: boolean } {
  const waiting = readTakes(dirs).get(key) ?? [];
  if (waiting.length === 0) throw new Error(`No new take for ${key}.`);
  if (decision === 'new' && !waiting.includes(take)) throw new Error(`No take ${take} for ${key}.`);
  stashDecision(dirs, state, key, waiting, decision === 'new');
  if (decision === 'new') copyFileSync(candidatePath(dirs, key, take), clipPath(dirs, key));
  for (const waitingTake of waiting) unlinkSync(candidatePath(dirs, key, waitingTake));
  const status: ReviewStatus = decision === 'again' ? 'regenerate' : 'good';
  // Asking again keeps what was wrong with the clip
  const previous = state[key];
  const detail = decision === 'again' && previous ? { reasons: previous.reasons ?? [], note: previous.note ?? '' } : undefined;
  return { state: markClip(dirs, state, key, status, detail), isReplaced: decision === 'new' };
}

/**
 * Keys marked for regenerate that have no new take yet: what the next batch renders. A line marked
 * 'bad-wording' is left out: another take of the same text can't fix it, its text has to be changed
 * (and that new text is a new clip).
 */
export function keysToRegenerate(items: readonly ReviewItem[]): string[] {
  return items.filter((item) => item.phase === 'regenerate' && !item.reasons.includes('bad-wording')).map((item) => item.key);
}

/** The lines marked 'bad-wording' with the note on what to change: the list to hand over for rewording. */
export function wordingFixes(items: readonly ReviewItem[]): { key: string; text: string; note: string }[] {
  return items.filter((item) => item.reasons.includes('bad-wording')).map(({ key, text, note }) => ({ key, text, note }));
}
