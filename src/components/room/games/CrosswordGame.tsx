import React, { useState } from 'react';
import { CrosswordEntry, CrosswordPuzzle, getEntryCells, scorePercent } from '../../../data/wordGames';
import { LearnerGender } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { Button } from '../../ui/Button';

interface CrosswordGameProps {
  puzzle: CrosswordPuzzle;
  gender: LearnerGender;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (score: number) => void;
}

const entryId = (entry: CrosswordEntry) => `${entry.number}-${entry.direction}`;

/** Crossword (תשבץ): Hebrew clues, English answers. Words solved without a miss or a reveal count. */
export const CrosswordGame: React.FC<CrosswordGameProps> = ({ puzzle, gender, theme, onSpeakEnglish, onFinish }) => {
  const isGirl = gender === 'girl';
  const [activeId, setActiveId] = useState(entryId(puzzle.entries[0]));
  const [typed, setTyped] = useState('');
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  const active = puzzle.entries.find((entry) => entryId(entry) === activeId) as CrosswordEntry;
  const isDone = puzzle.entries.every((entry) => solved[entryId(entry)]);
  const firstTry = puzzle.entries.filter((entry) => solved[entryId(entry)] && !missed[entryId(entry)]).length;

  // Letters of solved words, plus which cells belong to the active word and where clue numbers go.
  const letters = new Map<string, string>();
  const used = new Set<string>();
  const numbers = new Map<string, number>();
  puzzle.entries.forEach((entry) => {
    numbers.set(`${entry.row},${entry.col}`, entry.number);
    getEntryCells(entry).forEach(([r, c], i) => {
      used.add(`${r},${c}`);
      if (solved[entryId(entry)]) letters.set(`${r},${c}`, entry.word.word[i]);
    });
  });
  const activeCells = new Set(getEntryCells(active).map(([r, c]) => `${r},${c}`));

  const select = (entry: CrosswordEntry, keepMessage = false) => {
    setActiveId(entryId(entry));
    setTyped('');
    if (!keepMessage) setMessage(null);
  };

  const goToNextUnsolved = (justSolved: string) => {
    const next = puzzle.entries.find((entry) => entryId(entry) !== justSolved && !solved[entryId(entry)]);
    if (next) select(next, true);
  };

  const markSolved = (isMiss: boolean) => {
    const id = entryId(active);
    setSolved({ ...solved, [id]: true });
    if (isMiss) setMissed({ ...missed, [id]: true });
    onSpeakEnglish(active.word.word.toLowerCase(), 0.9);
    goToNextUnsolved(id);
  };

  const handleCheck = () => {
    if (typed.trim().toUpperCase() === active.word.word) {
      setMessage(`נכון! ${active.word.word} ✓`);
      markSolved(false);
    } else {
      setMissed({ ...missed, [entryId(active)]: true });
      setMessage(isGirl ? 'עוד לא — בדקי את מספר האותיות ונסי שוב' : 'עוד לא — בדוק את מספר האותיות ונסה שוב');
    }
  };

  const handleReveal = () => {
    setMessage(`התשובה: ${active.word.word}`);
    markSolved(true);
  };

  const clueGroups: { title: string; direction: CrosswordEntry['direction'] }[] = [
    { title: 'מאוזן · Across →', direction: 'across' },
    { title: 'מאונך · Down ↓', direction: 'down' },
  ];

  return (
    <div className="space-y-3">
      <div
        className="grid gap-0.5 mx-auto"
        style={{ gridTemplateColumns: `repeat(${puzzle.width}, minmax(0, 2.1rem))`, width: 'fit-content', maxWidth: '100%' }}
        dir="ltr" lang="en"
      >
        {Array.from({ length: puzzle.height * puzzle.width }, (_, i) => {
          const key = `${Math.floor(i / puzzle.width)},${i % puzzle.width}`;
          if (!used.has(key)) return <span key={key} className="aspect-square" />;
          return (
            <span
              key={key}
              className={`relative aspect-square rounded-md border flex items-center justify-center text-sm font-extrabold ${
                activeCells.has(key) ? 'border-fuchsia-500 bg-fuchsia-500/15' : 'border-current/20 bg-white/70 dark:bg-white/10'
              }`}
            >
              {numbers.has(key) && <span className="absolute top-0 left-0.5 text-xs leading-none font-bold opacity-70">{numbers.get(key)}</span>}
              {letters.get(key) ?? ''}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {clueGroups.map((group) => (
          <div key={group.direction} className="space-y-1">
            <h4 className="text-xs font-extrabold opacity-80">{group.title}</h4>
            {puzzle.entries
              .filter((entry) => entry.direction === group.direction)
              .map((entry) => (
                <button
                  key={entryId(entry)}
                  type="button"
                  onClick={() => select(entry)}
                  disabled={solved[entryId(entry)]}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold ${
                    entryId(entry) === activeId ? theme.primaryBtnClass : theme.secondaryBtnClass
                  } disabled:opacity-60`}
                >
                  {entry.number}. {entry.word.emoji} {entry.word.he} ({entry.word.word.length})
                  {solved[entryId(entry)] && <span dir="ltr" lang="en"> ✓ {entry.word.word}</span>}
                </button>
              ))}
          </div>
        ))}
      </div>

      {!isDone && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value.replace(/[^A-Za-z]/g, '').slice(0, active.word.word.length))}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            aria-label={`התשובה ל־${active.number}: ${active.word.he}`}
            placeholder={`${active.number}. ${active.word.he}`}
            className={`flex-1 min-w-[8rem] px-3 py-2 rounded-xl text-sm font-extrabold uppercase tracking-widest ${theme.inputBgClass}`}
            dir="ltr" lang="en"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
          <Button theme={theme} size="sm" onClick={handleCheck}>
            בדיקה ✓
          </Button>
          <Button theme={theme} variant="secondary" size="sm" onClick={handleReveal}>
            גילוי
          </Button>
        </div>
      )}

      {message && (
        <p className="text-xs font-bold text-center" role="status">
          {message}
        </p>
      )}

      {isDone && (
        <div className="text-center">
          <Button theme={theme} onClick={() => onFinish(scorePercent(firstTry, puzzle.entries.length))}>
            פתרת את התשבץ! סיום 🎉
          </Button>
        </div>
      )}
    </div>
  );
};
