import { GradeId, LearnerProfile, ProficiencyTier } from '../types/learner';
import { seededShuffle, seededShuffleNotIdentity } from '../utils/shuffle';
import { CURRICULUM_BY_GRADE } from './curriculum';
import { getActiveLists } from './customWordLists';
import { ROOM_ITEMS, getRoom } from './room';
import { RoomActivityId, RoomActivityReward, applyRoomActivityReward } from './roomActivities';

/**
 * Feature 12, phase 5 — 📖 Games Book: word games built from the learner's grade vocabulary and
 * their school word lists. Games unlock with total stars. All generators are pure and seeded.
 */

export type WordGameId = 'scramble' | 'search' | 'crossword' | 'finding';

export interface WordGameInfo {
  id: WordGameId;
  emoji: string;
  titleEn: string;
  titleHe: string;
  descriptionHe: string;
  starsRequired: number;
  activityId: RoomActivityId;
}

export const WORD_GAMES: WordGameInfo[] = [
  { id: 'scramble', emoji: '🔀', titleEn: 'Word Scramble', titleHe: 'מילים מבולבלות', descriptionHe: 'מסדרים את האותיות למילה הנכונה', starsRequired: 0, activityId: 'game-scramble' },
  { id: 'search', emoji: '🔍', titleEn: 'Word Search', titleHe: 'תפזורת', descriptionHe: 'מוצאים את המילים בטבלת האותיות', starsRequired: 10, activityId: 'game-search' },
  { id: 'crossword', emoji: '✏️', titleEn: 'Crossword', titleHe: 'תשבץ', descriptionHe: 'כותבים באנגלית את התשובות לרמזים בעברית', starsRequired: 25, activityId: 'game-crossword' },
  { id: 'finding', emoji: '🕵️', titleEn: 'Hidden Words', titleHe: 'מילים מוסתרות', descriptionHe: 'מוצאים מילים באנגלית שמסתתרות בשורת אותיות — לפי הרמז בעברית', starsRequired: 40, activityId: 'game-finding' },
];

export interface GameWord {
  /** Upper-case letters only */
  word: string;
  he: string;
  emoji?: string;
}

export const SCRAMBLE_ROUND_SIZE = 5;
export const SEARCH_WORD_COUNT = 5;
export const CROSSWORD_WORD_COUNT = 5;
export const FINDING_WORD_COUNT = 4;
export const SEARCH_GRID_SIZE = 9;
/** Crossword words are tried from a bigger pool so enough of them cross. */
const CROSSWORD_CANDIDATES = 16;
const SEARCH_MAX_LENGTH = 7;
const MIN_WORDS = 10;
const LETTERS = 'ABCDEFGHIJKLMNOPRSTUW';

export function getWordGame(gameId: WordGameId): WordGameInfo {
  return WORD_GAMES.find((game) => game.id === gameId) as WordGameInfo;
}

export function isGameUnlocked(profile: LearnerProfile, gameId: WordGameId): boolean {
  return (profile.stats.stars || 0) >= getWordGame(gameId).starsRequired;
}

function gradeWords(gradeId: GradeId): GameWord[] {
  const pack = CURRICULUM_BY_GRADE[gradeId];
  if (!pack) return [];
  return pack.units.flatMap((unit) =>
    unit.missions.flatMap((mission) =>
      mission.vocabulary.map((item) => ({ word: item.wordEn.toUpperCase(), he: item.translationHe, emoji: item.emoji }))
    )
  );
}

/** Nearby grades first, so a grade with few single words borrows from its neighbours. */
function gradesByDistance(gradeId: GradeId): GradeId[] {
  const grade = Number(gradeId.replace('grade-', ''));
  return Array.from({ length: 12 }, (_, i) => i + 1)
    .sort((a, b) => Math.abs(a - grade) - Math.abs(b - grade) || a - b)
    .map((g) => `grade-${g}` as GradeId);
}

/**
 * Single words of 3–8 letters with a Hebrew meaning: the learner's word lists and grade vocabulary,
 * then nearby grades and the room's item names until there are enough.
 */
export function getGameWords(profile: LearnerProfile): GameWord[] {
  const fromLists: GameWord[] = getActiveLists(profile).flatMap((list) =>
    list.items
      .filter((item) => item.kind === 'word' && item.translationHe)
      .map((item) => ({ word: item.textEn.toUpperCase(), he: item.translationHe as string }))
  );
  const fromRoom: GameWord[] = ROOM_ITEMS.map((item) => ({ word: item.nameEn.toUpperCase(), he: item.nameHe, emoji: item.emoji }));

  const seen = new Set<string>();
  const result: GameWord[] = [];
  const add = (words: GameWord[]) =>
    words.forEach((word) => {
      if (!/^[A-Z]{3,8}$/.test(word.word) || !word.he || seen.has(word.word)) return;
      seen.add(word.word);
      result.push(word);
    });

  add(fromLists);
  for (const gradeId of gradesByDistance(profile.gradeId)) {
    if (result.length >= MIN_WORDS && gradeId !== profile.gradeId) break;
    add(gradeWords(gradeId));
  }
  if (result.length < MIN_WORDS) add(fromRoom);
  return result;
}

export function pickWords(words: GameWord[], count: number, seed: string | number): GameWord[] {
  return seededShuffle(words, `pick-${seed}`).slice(0, count);
}

/* ---------- Word Scramble ---------- */

export interface ScrambleRound {
  word: GameWord;
  letterTiles: string[];
}

export function buildScramble(words: GameWord[], seed: string | number): ScrambleRound[] {
  return pickWords(words, SCRAMBLE_ROUND_SIZE, seed).map((word) => ({
    word,
    letterTiles: seededShuffleNotIdentity(word.word.split(''), `${seed}-${word.word}`),
  }));
}

/* ---------- Word Search & Hidden Words ---------- */

export type Cell = [row: number, col: number];

export interface PlacedWord {
  word: GameWord;
  cells: Cell[];
}

export interface WordSearchPuzzle {
  grid: string[][];
  placed: PlacedWord[];
}

/** Seeded pseudo-random numbers in [0, 1). */
function makeRandom(seed: string | number): () => number {
  let state = 0;
  for (const ch of String(seed)) state = (Math.imul(state, 31) + ch.charCodeAt(0)) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Explorer: right and down. Challenger adds diagonals. Master also reads backwards. */
export function getSearchDirections(tier: ProficiencyTier): Cell[] {
  const forward: Cell[] = [[0, 1], [1, 0]];
  const diagonal: Cell[] = [[1, 1], [-1, 1]];
  const backward: Cell[] = [[0, -1], [-1, 0], [-1, -1], [1, -1]];
  if (tier === 'explorer') return forward;
  if (tier === 'challenger') return [...forward, ...diagonal];
  return [...forward, ...diagonal, ...backward];
}

export function buildWordSearch(words: GameWord[], size: number, directions: Cell[], seed: string | number): WordSearchPuzzle {
  const random = makeRandom(`search-${seed}`);
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array<string | null>(size).fill(null));
  const placed: PlacedWord[] = [];
  const longestFirst = [...words].sort((a, b) => b.word.length - a.word.length);

  // Every start cell and direction, in a seeded order: a word is left out only if it can't fit anywhere.
  const spots = directions.flatMap((dir) =>
    Array.from({ length: size * size }, (_, i): [Cell, Cell] => [dir, [Math.floor(i / size), i % size]])
  );

  for (const word of longestFirst) {
    const order = seededShuffle(spots, `${seed}-${word.word}`);
    for (const [[dr, dc], [row, col]] of order) {
      const cells: Cell[] = word.word.split('').map((_, i) => [row + dr * i, col + dc * i]);
      const fits = cells.every(
        ([r, c], i) => r >= 0 && r < size && c >= 0 && c < size && (grid[r][c] === null || grid[r][c] === word.word[i])
      );
      if (!fits) continue;
      cells.forEach(([r, c], i) => (grid[r][c] = word.word[i]));
      placed.push({ word, cells });
      break;
    }
  }

  const filled = grid.map((row) => row.map((letter) => letter ?? LETTERS[Math.floor(random() * LETTERS.length)]));
  return { grid: filled, placed };
}

/** The cells on the straight line from `start` to `end`, or null if they are not in a line. */
export function getLineCells(start: Cell, end: Cell): Cell[] | null {
  const dr = end[0] - start[0];
  const dc = end[1] - start[1];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  return Array.from({ length: steps + 1 }, (_, i): Cell => [start[0] + Math.sign(dr) * i, start[1] + Math.sign(dc) * i]);
}

/** The placed word whose cells are exactly the selected line (in either direction). */
export function matchSelection(placed: PlacedWord[], start: Cell, end: Cell): PlacedWord | null {
  const line = getLineCells(start, end);
  if (!line) return null;
  const key = (cells: Cell[]) => cells.map(([r, c]) => `${r},${c}`).join(';');
  const selected = key(line);
  const reversed = key([...line].reverse());
  return placed.find((p) => key(p.cells) === selected || key(p.cells) === reversed) ?? null;
}

/** Hidden Words: the words sit in one long row of letters with random letters between them. */
export function buildLetterStream(words: GameWord[], seed: string | number): WordSearchPuzzle {
  const random = makeRandom(`stream-${seed}`);
  const filler = () => Array.from({ length: 1 + Math.floor(random() * 3) }, () => LETTERS[Math.floor(random() * LETTERS.length)]);
  const letters: string[] = [...filler()];
  const placed: PlacedWord[] = [];
  for (const word of words) {
    const start = letters.length;
    letters.push(...word.word.split(''));
    placed.push({ word, cells: word.word.split('').map((_, i): Cell => [0, start + i]) });
    letters.push(...filler());
  }
  return { grid: [letters], placed };
}

/** A word search for the tier: shorter words when there are enough, so all five fit. */
export function buildSearchPuzzle(words: GameWord[], tier: ProficiencyTier, seed: string | number): WordSearchPuzzle {
  const short = words.filter((w) => w.word.length <= SEARCH_MAX_LENGTH);
  const pool = short.length >= SEARCH_WORD_COUNT ? short : words;
  return buildWordSearch(pickWords(pool, SEARCH_WORD_COUNT, seed), SEARCH_GRID_SIZE, getSearchDirections(tier), seed);
}

export function buildFindingPuzzle(words: GameWord[], seed: string | number): WordSearchPuzzle {
  return buildLetterStream(pickWords(words, FINDING_WORD_COUNT, seed), seed);
}

/* ---------- Crossword ---------- */

export type CrosswordDirection = 'across' | 'down';

export interface CrosswordEntry {
  number: number;
  word: GameWord;
  row: number;
  col: number;
  direction: CrosswordDirection;
}

export interface CrosswordPuzzle {
  width: number;
  height: number;
  entries: CrosswordEntry[];
}

interface Placement {
  word: GameWord;
  row: number;
  col: number;
  direction: CrosswordDirection;
}

function placementCells(p: Placement): Cell[] {
  return p.word.word.split('').map((_, i): Cell => (p.direction === 'across' ? [p.row, p.col + i] : [p.row + i, p.col]));
}

/**
 * Whether `candidate` fits: crossing letters agree, it only crosses words running the other way,
 * and it doesn't touch other words side by side.
 */
function canPlace(letters: Map<string, string>, directions: Map<string, CrosswordDirection>, candidate: Placement): boolean {
  const cells = placementCells(candidate);
  const [dr, dc] = candidate.direction === 'across' ? [0, 1] : [1, 0];
  const at = (r: number, c: number) => letters.get(`${r},${c}`);
  const [firstR, firstC] = cells[0];
  const [lastR, lastC] = cells[cells.length - 1];
  if (at(firstR - dr, firstC - dc) || at(lastR + dr, lastC + dc)) return false;

  let crossings = 0;
  for (let i = 0; i < cells.length; i++) {
    const [r, c] = cells[i];
    const existing = at(r, c);
    if (existing) {
      if (existing !== candidate.word.word[i] || directions.get(`${r},${c}`) === candidate.direction) return false;
      crossings++;
      continue;
    }
    // A new letter must not sit right next to another word's letter (sideways).
    if (at(r + dc, c + dr) || at(r - dc, c - dr)) return false;
  }
  return crossings > 0 && crossings < cells.length;
}

/**
 * Greedy crossword: the longest word goes across, and each next word crosses a letter already on
 * the board. Words that can't cross anything are left out.
 */
export function buildCrossword(words: GameWord[], maxWords: number, seed: string | number): CrosswordPuzzle {
  const ordered = seededShuffle(words, `cross-${seed}`).sort((a, b) => b.word.length - a.word.length);
  const placements: Placement[] = [];
  const letters = new Map<string, string>();
  const directions = new Map<string, CrosswordDirection>();
  const put = (p: Placement) => {
    placements.push(p);
    placementCells(p).forEach(([r, c], i) => {
      letters.set(`${r},${c}`, p.word.word[i]);
      directions.set(`${r},${c}`, p.direction);
    });
  };

  for (const word of ordered) {
    if (placements.length >= maxWords) break;
    if (placements.length === 0) {
      put({ word, row: 0, col: 0, direction: 'across' });
      continue;
    }
    let done = false;
    for (const existing of placements) {
      if (done) break;
      const direction: CrosswordDirection = existing.direction === 'across' ? 'down' : 'across';
      const existingCells = placementCells(existing);
      for (let i = 0; i < existing.word.word.length && !done; i++) {
        for (let j = 0; j < word.word.length && !done; j++) {
          if (existing.word.word[i] !== word.word[j]) continue;
          const [r, c] = existingCells[i];
          const candidate: Placement =
            direction === 'down' ? { word, row: r - j, col: c, direction } : { word, row: r, col: c - j, direction };
          if (canPlace(letters, directions, candidate)) {
            put(candidate);
            done = true;
          }
        }
      }
    }
  }

  const allCells = placements.flatMap(placementCells);
  const minRow = Math.min(...allCells.map(([r]) => r));
  const minCol = Math.min(...allCells.map(([, c]) => c));
  const shifted = placements
    .map((p) => ({ ...p, row: p.row - minRow, col: p.col - minCol }))
    .sort((a, b) => a.row - b.row || a.col - b.col);

  const numbers = new Map<string, number>();
  const entries = shifted.map((p) => {
    const key = `${p.row},${p.col}`;
    if (!numbers.has(key)) numbers.set(key, numbers.size + 1);
    return { number: numbers.get(key) as number, word: p.word, row: p.row, col: p.col, direction: p.direction };
  });

  return {
    width: Math.max(...allCells.map(([, c]) => c)) - minCol + 1,
    height: Math.max(...allCells.map(([r]) => r)) - minRow + 1,
    entries,
  };
}

export function buildCrosswordPuzzle(words: GameWord[], seed: string | number): CrosswordPuzzle {
  return buildCrossword(pickWords(words, CROSSWORD_CANDIDATES, seed), CROSSWORD_WORD_COUNT, seed);
}

export function getEntryCells(entry: CrosswordEntry): Cell[] {
  return placementCells(entry);
}

/* ---------- Scores & rewards ---------- */

export function scorePercent(firstTryCorrect: number, total: number): number {
  return total > 0 ? Math.round((firstTryCorrect / total) * 100) : 0;
}

export function getBestGameScore(profile: LearnerProfile, gameId: WordGameId): number | undefined {
  return getRoom(profile).gameBestScores?.[gameId];
}

/**
 * Saves the best score and gives the game's daily room-activity reward. A game ended with nothing
 * solved (0%) earns nothing, so tapping "finish" right away can't collect the daily reward.
 */
export function recordGameResult(
  profile: LearnerProfile,
  gameId: WordGameId,
  score: number,
  now: Date
): RoomActivityReward | null {
  if (score <= 0) return null;
  const room = getRoom(profile);
  const best = Math.max(room.gameBestScores?.[gameId] ?? 0, score);
  const withScore: LearnerProfile = {
    ...profile,
    room: { ...room, gameBestScores: { ...(room.gameBestScores || {}), [gameId]: best } },
  };
  return applyRoomActivityReward(withScore, getWordGame(gameId).activityId, 0, now);
}
