import React, { useState } from 'react';
import { Cell, PlacedWord, WordSearchPuzzle, matchSelection, scorePercent } from '../../../data/wordGames';
import { LearnerGender } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { LetterGrid, cellKey } from './LetterGrid';

interface WordHuntGameProps {
  puzzle: WordSearchPuzzle;
  /** Word Search lists the English words; Hidden Words gives only the Hebrew clue */
  showEnglishList: boolean;
  isStream: boolean;
  gender: LearnerGender;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (score: number) => void;
}

/**
 * Word Search (תפזורת) and Hidden Words: tap the first and last letter of a word. The score is the
 * share of words found, minus a little for each wrong selection.
 */
export const WordHuntGame: React.FC<WordHuntGameProps> = ({
  puzzle,
  showEnglishList,
  isStream,
  gender,
  theme,
  onSpeakEnglish,
  onFinish,
}) => {
  const isGirl = gender === 'girl';
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const isFound = (p: PlacedWord) => foundWords.includes(p.word.word);
  const foundCells = new Set(puzzle.placed.filter(isFound).flatMap((p) => p.cells.map(cellKey)));
  const isDone = foundWords.length === puzzle.placed.length;
  const finalScore = Math.max(0, scorePercent(foundWords.length, puzzle.placed.length) - mistakes * 5);

  const handleTapCell = (cell: Cell) => {
    if (isDone) return;
    if (!start) {
      setStart(cell);
      setMessage(isGirl ? 'עכשיו הקישי על האות האחרונה של המילה' : 'עכשיו הקש על האות האחרונה של המילה');
      return;
    }
    if (cellKey(start) === cellKey(cell)) {
      setStart(null);
      setMessage(null);
      return;
    }
    const match = matchSelection(puzzle.placed, start, cell);
    setStart(null);
    if (match && !isFound(match)) {
      onSpeakEnglish(match.word.word.toLowerCase(), 0.9);
      setFoundWords([...foundWords, match.word.word]);
      setMessage(`מצאת: ${match.word.word} = ${match.word.he} ${match.word.emoji ?? ''}`);
    } else if (!match) {
      setMistakes(mistakes + 1);
      setMessage(isGirl ? 'זו לא מילה מהרשימה — נסי שוב 🔍' : 'זו לא מילה מהרשימה — נסה שוב 🔍');
    }
  };

  return (
    <div className="space-y-3">
      <ul className="flex flex-wrap gap-1.5">
        {puzzle.placed.map((p) => {
          const isWordFound = isFound(p);
          return (
            <li
              key={p.word.word}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 ${
                isWordFound ? 'bg-emerald-500/20 line-through decoration-2' : 'bg-black/5 dark:bg-white/5'
              }`}
            >
              <span>
                {p.word.emoji} {p.word.he}
              </span>
              {(showEnglishList || isWordFound) && (
                <span dir="ltr" className="font-extrabold">
                  {p.word.word}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <LetterGrid
        grid={puzzle.grid}
        foundCells={foundCells}
        selectedStart={start}
        theme={theme}
        isStream={isStream}
        onTapCell={handleTapCell}
      />

      <p className="text-xs font-bold text-center min-h-[1rem]" role="status">
        {isDone ? 'מצאת את כל המילים! 🎉' : message}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {isDone ? (
          <button type="button" onClick={() => onFinish(finalScore)} className={`px-6 py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass}`}>
            סיום ({finalScore}%) 🎉
          </button>
        ) : (
          <button type="button" onClick={() => onFinish(finalScore)} className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.secondaryBtnClass}`}>
            סיימתי לחפש ({foundWords.length}/{puzzle.placed.length})
          </button>
        )}
      </div>
    </div>
  );
};
