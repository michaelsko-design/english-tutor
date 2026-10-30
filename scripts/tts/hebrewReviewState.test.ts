import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  candidatePath,
  clipPath,
  decideCandidate,
  keysToRegenerate,
  listReviewItems,
  listUndoable,
  loadState,
  markClip,
  saveState,
  undoDecision,
  wordingFixes,
  type ReviewDirs,
} from './hebrewReviewState';

const PHRASES = [
  { key: 'a', text: 'שלום', speed: 'normal' as const },
  { key: 'b', text: 'להתראות', speed: 'normal' as const },
  { key: 'c', text: 'תודה', speed: 'slow' as const },
];

let root = '';
let dirs: ReviewDirs;

const write = (path: string, content: string) => writeFileSync(path, content);
const phases = (state = loadState(dirs.statePath)) => Object.fromEntries(listReviewItems(PHRASES, state, dirs).map((item) => [item.key, item.phase]));

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'he-review-'));
  dirs = { clipDir: join(root, 'clips'), candidateDir: join(root, 'cand'), undoDir: join(root, 'undo'), statePath: join(root, 'review.json') };
  mkdirSync(dirs.clipDir);
  mkdirSync(dirs.candidateDir);
  write(clipPath(dirs, 'a'), 'audio-a');
  write(clipPath(dirs, 'b'), 'audio-b');
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('hebrew review state', () => {
  it('starts with every rendered clip pending and a clip-less line missing', () => {
    expect(phases()).toEqual({ a: 'pending', b: 'pending', c: 'missing' });
  });

  it('remembers marks across a save and load', () => {
    let state = markClip(dirs, {}, 'a', 'good');
    state = markClip(dirs, state, 'b', 'regenerate');
    saveState(dirs.statePath, state);
    expect(phases()).toEqual({ a: 'good', b: 'regenerate', c: 'missing' });
    expect(keysToRegenerate(listReviewItems(PHRASES, loadState(dirs.statePath), dirs))).toEqual(['b']);
  });

  it('keeps the previous marks in a backup file on every save', () => {
    saveState(dirs.statePath, markClip(dirs, {}, 'a', 'good'));
    saveState(dirs.statePath, markClip(dirs, loadState(dirs.statePath), 'b', 'good'));
    expect(Object.keys(loadState(`${dirs.statePath}.bak`))).toEqual(['a']);
    expect(Object.keys(loadState(dirs.statePath))).toEqual(['a', 'b']);
  });

  it('takes a mark back', () => {
    const state = markClip(dirs, markClip(dirs, {}, 'a', 'good'), 'a', null);
    expect(phases(state).a).toBe('pending');
  });

  it('brings a clip back for review when its audio changed', () => {
    const state = markClip(dirs, {}, 'a', 'good');
    write(clipPath(dirs, 'a'), 'audio-a-rerendered');
    expect(phases(state).a).toBe('pending');
  });

  it('puts a clip with a waiting new take in compare', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    expect(phases(state).b).toBe('compare');
  });

  it('keeps the original until the new take is chosen, then replaces it', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    const result = decideCandidate(dirs, state, 'b', 'new');
    expect(result.isReplaced).toBe(true);
    expect(readFileSync(clipPath(dirs, 'b'), 'utf8')).toBe('audio-b2');
    expect(existsSync(candidatePath(dirs, 'b'))).toBe(false);
    expect(phases(result.state).b).toBe('good');
  });

  it('keeps the old clip untouched when it is better', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    const result = decideCandidate(dirs, state, 'b', 'old');
    expect(result.isReplaced).toBe(false);
    expect(readFileSync(clipPath(dirs, 'b'), 'utf8')).toBe('audio-b');
    expect(phases(result.state).b).toBe('good');
  });

  it('queues another regeneration and drops the new take', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    const result = decideCandidate(dirs, state, 'b', 'again');
    expect(readFileSync(clipPath(dirs, 'b'), 'utf8')).toBe('audio-b');
    expect(existsSync(candidatePath(dirs, 'b'))).toBe(false);
    expect(phases(result.state).b).toBe('regenerate');
  });

  it('keeps the reasons and note of a regenerate mark, also through another round', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate', { reasons: ['wrong-gender'], note: '  said it to a boy  ' });
    const itemOf = (current: typeof state) => listReviewItems(PHRASES, current, dirs).find((entry) => entry.key === 'b');
    expect(itemOf(state)).toMatchObject({ reasons: ['wrong-gender'], note: 'said it to a boy' });
    write(candidatePath(dirs, 'b'), 'audio-b2');
    const again = decideCandidate(dirs, state, 'b', 'again').state;
    expect(itemOf(again)).toMatchObject({ phase: 'regenerate', reasons: ['wrong-gender'], note: 'said it to a boy' });
  });

  it('keeps a bad-wording line out of the regenerate batch and lists it for rewording', () => {
    let state = markClip(dirs, {}, 'a', 'regenerate', { reasons: ['bad-wording'], note: 'use אמרי' });
    state = markClip(dirs, state, 'b', 'regenerate', { reasons: ['noise'], note: '' });
    const items = listReviewItems(PHRASES, state, dirs);
    expect(keysToRegenerate(items)).toEqual(['b']);
    expect(wordingFixes(items)).toEqual([{ key: 'a', text: 'שלום', note: 'use אמרי' }]);
  });

  it('drops the reasons once the clip is good', () => {
    const marked = markClip(dirs, {}, 'b', 'regenerate', { reasons: ['noise'], note: 'x' });
    const state = markClip(dirs, marked, 'b', 'good');
    expect(listReviewItems(PHRASES, state, dirs).find((entry) => entry.key === 'b')).toMatchObject({ reasons: [], note: '' });
  });

  it('lists every waiting take and applies the chosen one', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    write(candidatePath(dirs, 'b', 'lab-split'), 'audio-b-split');
    expect(listReviewItems(PHRASES, state, dirs).find((item) => item.key === 'b')).toMatchObject({ phase: 'compare', takes: ['lab-split', 'new'] });
    const result = decideCandidate(dirs, state, 'b', 'new', 'lab-split');
    expect(readFileSync(clipPath(dirs, 'b'), 'utf8')).toBe('audio-b-split');
    expect(existsSync(candidatePath(dirs, 'b'))).toBe(false);
    expect(existsSync(candidatePath(dirs, 'b', 'lab-split'))).toBe(false);
    expect(result.isReplaced).toBe(true);
  });

  it('refuses a take that is not waiting', () => {
    const state = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    expect(() => decideCandidate(dirs, state, 'b', 'new', 'lab-split')).toThrow(/No take/);
  });

  it('undoes a replacement: the old clip, the waiting takes and the mark come back', () => {
    const marked = markClip(dirs, {}, 'b', 'regenerate', { reasons: ['noise'], note: 'hiss' });
    write(candidatePath(dirs, 'b'), 'audio-b2');
    write(candidatePath(dirs, 'b', 'lab-split'), 'audio-b-split');
    const decided = decideCandidate(dirs, marked, 'b', 'new', 'lab-split');
    expect(listUndoable(dirs).map((entry) => entry.key)).toEqual(['b']);
    const undone = undoDecision(dirs, decided.state, 'b');
    expect(undone.wasReplaced).toBe(true);
    expect(readFileSync(clipPath(dirs, 'b'), 'utf8')).toBe('audio-b');
    expect(readFileSync(candidatePath(dirs, 'b'), 'utf8')).toBe('audio-b2');
    expect(readFileSync(candidatePath(dirs, 'b', 'lab-split'), 'utf8')).toBe('audio-b-split');
    expect(listReviewItems(PHRASES, undone.state, dirs).find((item) => item.key === 'b')).toMatchObject({ phase: 'compare', reasons: ['noise'], note: 'hiss' });
    expect(listUndoable(dirs)).toEqual([]);
  });

  it('undoes keeping the old clip without touching the clip', () => {
    const marked = markClip(dirs, {}, 'b', 'regenerate');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    const decided = decideCandidate(dirs, marked, 'b', 'old');
    const undone = undoDecision(dirs, decided.state, 'b');
    expect(undone.wasReplaced).toBe(false);
    expect(readFileSync(clipPath(dirs, 'b'), 'utf8')).toBe('audio-b');
    expect(phases(undone.state).b).toBe('compare');
  });

  it('lists the newest decision first and refuses an undo without one', () => {
    const marked = markClip(dirs, markClip(dirs, {}, 'a', 'regenerate'), 'b', 'regenerate');
    write(candidatePath(dirs, 'a'), 'audio-a2');
    write(candidatePath(dirs, 'b'), 'audio-b2');
    const first = decideCandidate(dirs, marked, 'a', 'old');
    decideCandidate(dirs, first.state, 'b', 'old');
    expect(listUndoable(dirs)[0]?.key).toBe('b');
    expect(() => undoDecision(dirs, {}, 'c')).toThrow(/Nothing to undo/);
  });

  it('refuses to decide without a new take', () => {
    expect(() => decideCandidate(dirs, {}, 'a', 'new')).toThrow(/No new take/);
  });
});
