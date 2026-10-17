import React from 'react';
import { Cell } from '../../../data/wordGames';
import { ThemeDefinition } from '../../../themes/themeRegistry';

interface LetterGridProps {
  grid: string[][];
  /** "row,col" keys of letters in words already found */
  foundCells: Set<string>;
  /** The first tapped letter of the current selection */
  selectedStart: Cell | null;
  theme: ThemeDefinition;
  /** A single long row wraps onto several lines (Hidden Words) */
  isStream?: boolean;
  onTapCell: (cell: Cell) => void;
}

export const cellKey = ([row, col]: Cell) => `${row},${col}`;

/** Tap the first and the last letter of a word to select it. */
export const LetterGrid: React.FC<LetterGridProps> = ({ grid, foundCells, selectedStart, theme, isStream = false, onTapCell }) => {
  const renderCell = (letter: string, cell: Cell) => {
    const key = cellKey(cell);
    const isFound = foundCells.has(key);
    const isStart = selectedStart !== null && cellKey(selectedStart) === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onTapCell(cell)}
        aria-label={`${letter}${isFound ? ' (נמצא)' : ''}`}
        aria-pressed={isStart}
        className={`aspect-square rounded-lg text-sm sm:text-base font-extrabold flex items-center justify-center transition-colors ${
          isStart
            ? 'bg-fuchsia-500 text-white scale-110'
            : isFound
              ? 'bg-emerald-500/80 text-white'
              : theme.secondaryBtnClass
        } ${isStream ? 'w-8 sm:w-9' : ''}`}
      >
        {letter}
      </button>
    );
  };

  if (isStream) {
    return (
      <div className="flex flex-wrap justify-center gap-1" dir="ltr">
        {grid[0].map((letter, col) => renderCell(letter, [0, col]))}
      </div>
    );
  }

  return (
    <div
      className="grid gap-1 mx-auto w-full max-w-sm"
      style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 1}, minmax(0, 1fr))` }}
      dir="ltr"
    >
      {grid.flatMap((row, r) => row.map((letter, c) => renderCell(letter, [r, c])))}
    </div>
  );
};
