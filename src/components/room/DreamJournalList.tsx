import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { DreamEntry } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface DreamJournalListProps {
  entries: DreamEntry[];
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

const COLLAPSED_COUNT = 3;

/** The saved dreams, newest first, each with a read-aloud button. */
export const DreamJournalList: React.FC<DreamJournalListProps> = ({ entries, theme, onSpeakEnglish }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (entries.length === 0) return null;
  const shown = isExpanded ? entries : entries.slice(0, COLLAPSED_COUNT);

  return (
    <div className="space-y-2">
      <h4 className="font-extrabold text-xs">📔 היומן שלי ({entries.length})</h4>
      <ul className="space-y-1.5">
        {shown.map((entry) => (
          <li key={entry.id} className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 flex items-start gap-2">
            <button
              type="button"
              onClick={() => onSpeakEnglish(entry.textEn, 0.9)}
              className={`p-1.5 rounded-lg shrink-0 ${theme.secondaryBtnClass}`}
              aria-label="הקראת החלום"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-bold" dir="ltr">
                {entry.textEn}
              </p>
              <p className={`text-xs ${theme.mutedTextClass}`}>{entry.textHe}</p>
              {entry.noteHe && <p className={`text-xs italic ${theme.mutedTextClass}`}>✍️ {entry.noteHe}</p>}
              <p className={`text-xs ${theme.mutedTextClass}`}>{new Date(entry.createdAt).toLocaleDateString('he-IL')}</p>
            </div>
          </li>
        ))}
      </ul>
      {entries.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-xs font-bold underline underline-offset-2 ${theme.accentTextClass}`}
        >
          {isExpanded ? 'הצגת פחות' : `כל ${entries.length} החלומות`}
        </button>
      )}
    </div>
  );
};
