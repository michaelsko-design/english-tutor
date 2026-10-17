import { describe, expect, it } from 'vitest';
import {
  FINDING_WORD_COUNT,
  GameWord,
  SEARCH_WORD_COUNT,
  buildCrossword,
  buildCrosswordPuzzle,
  buildFindingPuzzle,
  buildSearchPuzzle,
  buildLetterStream,
  buildScramble,
  buildWordSearch,
  getBestGameScore,
  getEntryCells,
  getGameWords,
  getLineCells,
  getSearchDirections,
  isGameUnlocked,
  matchSelection,
  recordGameResult,
  scorePercent,
} from './wordGames';
import { ROOM_ACTIVITY_REPEAT_XP, ROOM_ACTIVITY_XP } from './roomActivities';
import { LearnerProfile } from '../types/learner';

const NOW = new Date(2026, 9, 17, 10, 0);

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Ido',
  age: 10,
  gender: 'boy',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 12,
    maxPossibleStars: 36,
    diamonds: 0,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-16',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

const WORDS: GameWord[] = ['CAT', 'TABLE', 'APPLE', 'GARDEN', 'ROBOT', 'PENCIL', 'TRAIN', 'LEMON'].map((word) => ({
  word,
  he: word.toLowerCase(),
}));

const readCells = (grid: string[][], cells: [number, number][]) => cells.map(([r, c]) => grid[r][c]).join('');

describe('getGameWords', () => {
  it('gives at least ten single upper-case words of 3–8 letters with meanings', () => {
    (['grade-1', 'grade-5', 'grade-12'] as const).forEach((gradeId) => {
      const words = getGameWords({ ...baseProfile, gradeId });
      expect(words.length).toBeGreaterThanOrEqual(10);
      words.forEach((w) => {
        expect(w.word).toMatch(/^[A-Z]{3,8}$/);
        expect(w.he).toBeTruthy();
      });
      expect(new Set(words.map((w) => w.word)).size).toBe(words.length);
    });
  });

  it('puts the learner’s own word-list words first', () => {
    const withList: LearnerProfile = {
      ...baseProfile,
      customWordLists: [
        {
          id: 'l1',
          title: 'Test',
          createdAt: '2026-10-01T00:00:00.000Z',
          items: [
            { id: 'i1', textEn: 'zebra', translationHe: 'זברה', kind: 'word' },
            { id: 'i2', textEn: 'ice cream', translationHe: 'גלידה', kind: 'word' },
          ],
        },
      ],
    };
    const words = getGameWords(withList);
    expect(words[0]).toMatchObject({ word: 'ZEBRA', he: 'זברה' });
    expect(words.map((w) => w.word)).not.toContain('ICE CREAM');
  });
});

describe('isGameUnlocked', () => {
  it('unlocks games by total stars', () => {
    expect(isGameUnlocked(baseProfile, 'scramble')).toBe(true);
    expect(isGameUnlocked(baseProfile, 'search')).toBe(true);
    expect(isGameUnlocked(baseProfile, 'crossword')).toBe(false);
    expect(isGameUnlocked({ ...baseProfile, stats: { ...baseProfile.stats, stars: 40 } }, 'finding')).toBe(true);
  });
});

describe('buildScramble', () => {
  it('shuffles each word’s letters into a different order', () => {
    buildScramble(WORDS, 3).forEach(({ word, letterTiles }) => {
      expect([...letterTiles].sort().join('')).toBe(word.word.split('').sort().join(''));
      expect(letterTiles.join('')).not.toBe(word.word);
    });
  });
});

describe('buildWordSearch', () => {
  it('places every word along a straight line in the allowed directions and fills the grid', () => {
    const words = WORDS.slice(0, 5);
    const puzzle = buildWordSearch(words, 8, getSearchDirections('challenger'), 11);
    expect(puzzle.grid).toHaveLength(8);
    puzzle.grid.forEach((row) => row.forEach((letter) => expect(letter).toMatch(/^[A-Z]$/)));
    expect(puzzle.placed).toHaveLength(5);
    puzzle.placed.forEach((p) => {
      expect(readCells(puzzle.grid, p.cells)).toBe(p.word.word);
      expect(getLineCells(p.cells[0], p.cells[p.cells.length - 1])).toEqual(p.cells);
    });
  });

  it('only goes right and down for Explorer', () => {
    const puzzle = buildWordSearch(WORDS.slice(0, 5), 8, getSearchDirections('explorer'), 4);
    puzzle.placed.forEach(({ cells }) => {
      const [r0, c0] = cells[0];
      const [r1, c1] = cells[1];
      expect([r1 - r0, c1 - c0]).toSatisfy(([dr, dc]: number[]) => (dr === 0 && dc === 1) || (dr === 1 && dc === 0));
    });
  });

  it('is the same for the same seed', () => {
    const dirs = getSearchDirections('master');
    expect(buildWordSearch(WORDS, 8, dirs, 9)).toEqual(buildWordSearch(WORDS, 8, dirs, 9));
  });
});

describe('matchSelection', () => {
  const puzzle = buildWordSearch(WORDS.slice(0, 4), 8, getSearchDirections('master'), 2);
  const target = puzzle.placed[0];

  it('finds a word selected from either end', () => {
    const first = target.cells[0];
    const last = target.cells[target.cells.length - 1];
    expect(matchSelection(puzzle.placed, first, last)?.word.word).toBe(target.word.word);
    expect(matchSelection(puzzle.placed, last, first)?.word.word).toBe(target.word.word);
  });

  it('rejects a partial word and a crooked line', () => {
    expect(matchSelection(puzzle.placed, target.cells[0], target.cells[1])).toBeNull();
    expect(getLineCells([0, 0], [1, 2])).toBeNull();
  });
});

describe('buildLetterStream', () => {
  it('hides every word in one row with letters around it', () => {
    const words = WORDS.slice(0, 4);
    const puzzle = buildLetterStream(words, 5);
    expect(puzzle.grid).toHaveLength(1);
    expect(puzzle.placed.map((p) => p.word.word)).toEqual(words.map((w) => w.word));
    puzzle.placed.forEach((p) => expect(readCells(puzzle.grid, p.cells)).toBe(p.word.word));
    expect(puzzle.grid[0].length).toBeGreaterThan(words.reduce((sum, w) => sum + w.word.length, 0));
  });
});

describe('buildCrossword', () => {
  it('places crossing words that agree on every shared letter', () => {
    const puzzle = buildCrossword(WORDS, 5, 1);
    expect(puzzle.entries.length).toBeGreaterThanOrEqual(3);
    const board = new Map<string, string>();
    puzzle.entries.forEach((entry) => {
      getEntryCells(entry).forEach(([r, c], i) => {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(puzzle.height);
        expect(c).toBeLessThan(puzzle.width);
        const key = `${r},${c}`;
        if (board.has(key)) expect(board.get(key)).toBe(entry.word.word[i]);
        board.set(key, entry.word.word[i]);
      });
    });
    const totalLetters = puzzle.entries.reduce((sum, e) => sum + e.word.word.length, 0);
    expect(board.size).toBeLessThan(totalLetters);
  });

  it('numbers clues in reading order and shares a number for one start cell', () => {
    const { entries } = buildCrossword(WORDS, 5, 7);
    const starts = entries.map((e) => [e.row, e.col]);
    const sorted = [...starts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(starts).toEqual(sorted);
    entries.forEach((e, i) => {
      if (i > 0 && e.row === entries[i - 1].row && e.col === entries[i - 1].col) expect(e.number).toBe(entries[i - 1].number);
    });
  });
});

describe('puzzles from real grade words', () => {
  it('fit all search words and at least four crossword words for every grade', () => {
    (['grade-1', 'grade-4', 'grade-8', 'grade-12'] as const).forEach((gradeId) => {
      const words = getGameWords({ ...baseProfile, gradeId });
      for (let seed = 0; seed < 25; seed++) {
        expect(buildSearchPuzzle(words, 'explorer', seed).placed).toHaveLength(SEARCH_WORD_COUNT);
        expect(buildCrosswordPuzzle(words, seed).entries.length).toBeGreaterThanOrEqual(4);
        expect(buildFindingPuzzle(words, seed).placed).toHaveLength(FINDING_WORD_COUNT);
      }
    });
  });
});

describe('recordGameResult', () => {
  it('keeps the best score and rewards the first game of the day', () => {
    const first = recordGameResult(baseProfile, 'scramble', 80, NOW);
    expect(first.xpEarned).toBe(ROOM_ACTIVITY_XP);
    expect(getBestGameScore(first.profile, 'scramble')).toBe(80);

    const second = recordGameResult(first.profile, 'scramble', 60, NOW);
    expect(second.xpEarned).toBe(ROOM_ACTIVITY_REPEAT_XP);
    expect(getBestGameScore(second.profile, 'scramble')).toBe(80);

    expect(recordGameResult(second.profile, 'search', 100, NOW).isFullReward).toBe(true);
  });

  it('scores first-try answers as a percentage', () => {
    expect(scorePercent(4, 5)).toBe(80);
    expect(scorePercent(0, 0)).toBe(0);
  });
});
