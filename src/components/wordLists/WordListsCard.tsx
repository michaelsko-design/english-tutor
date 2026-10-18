import React, { useState } from 'react';
import { ClipboardList, Play, Trash2 } from 'lucide-react';
import { MAX_ACTIVE_LISTS } from '../../data/customWordLists';
import { CustomWordList, LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface WordListsCardProps {
  /** Active lists, newest first */
  lists: CustomWordList[];
  canAdd: boolean;
  gender: LearnerGender;
  theme: ThemeDefinition;
  onImport: () => void;
  onPractice: (listId: string) => void;
  onDelete: (listId: string) => void;
}

const COLLAPSED_COUNT = 3;

/** Dashboard entry point for school word lists: import a list or practise a saved one. */
export const WordListsCard: React.FC<WordListsCardProps> = ({
  lists,
  canAdd,
  gender,
  theme,
  onImport,
  onPractice,
  onDelete,
}) => {
  const isGirl = gender === 'girl';
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const cardClass = `rounded-3xl p-4 sm:p-5 ${theme.cardBgClass}`;

  if (lists.length === 0) {
    return (
      <section aria-label="רשימות המילים שלי" className={`${cardClass} flex flex-col sm:flex-row sm:items-center gap-3`}>
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${theme.primaryBtnClass}`}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base">קיבלת רשימת מילים מהמורה? 📋</h2>
            <p className={`text-xs ${theme.mutedTextClass}`}>
              {isGirl
                ? 'הדביקי אותה כאן ונתרגל איות, הגייה ובניית משפטים.'
                : 'הדבק אותה כאן ונתרגל איות, הגייה ובניית משפטים.'}
            </p>
          </div>
        </div>
        <button type="button" onClick={onImport} className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm shrink-0 ${theme.secondaryBtnClass}`}>
          ייבוא רשימה 📋
        </button>
      </section>
    );
  }

  const shown = isExpanded ? lists : lists.slice(0, COLLAPSED_COUNT);

  return (
    <section aria-label="רשימות המילים שלי" className={`${cardClass} space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-extrabold text-base sm:text-lg">📋 רשימות המילים שלי</h2>
        <button
          type="button"
          onClick={onImport}
          disabled={!canAdd}
          className={`px-3.5 py-2 rounded-xl font-extrabold text-xs ${theme.secondaryBtnClass} disabled:opacity-40`}
        >
          + רשימה חדשה
        </button>
      </div>
      {!canAdd && (
        <p className={`text-xs ${theme.mutedTextClass}`}>
          אפשר לשמור עד {MAX_ACTIVE_LISTS} רשימות. {isGirl ? 'מחקי' : 'מחק'} רשימה ישנה כדי להוסיף חדשה.
        </p>
      )}

      <ul className="space-y-2">
        {shown.map((list) => (
          <li key={list.id} className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm truncate">{list.title}</p>
              <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
                {list.items.length} פריטים
                {list.bestScore !== undefined && ` · שיא ${list.bestScore}%`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onPractice(list.id)}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 shrink-0 ${theme.primaryBtnClass}`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              תרגול
            </button>
            {confirmingId === list.id ? (
              <button
                type="button"
                onClick={() => {
                  setConfirmingId(null);
                  onDelete(list.id);
                }}
                onBlur={() => setConfirmingId(null)}
                className="px-3 py-2 rounded-xl font-extrabold text-xs shrink-0 bg-rose-500 text-white"
              >
                למחוק?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingId(list.id)}
                aria-label={`מחיקת ${list.title}`}
                title="מחיקה"
                className={`p-2 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {lists.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-xs font-bold underline underline-offset-2 ${theme.accentTextClass}`}
        >
          {isExpanded ? 'הצגת פחות' : `הצגת כל ${lists.length} הרשימות`}
        </button>
      )}
    </section>
  );
};
