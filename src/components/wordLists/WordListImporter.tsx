import React, { useMemo, useState } from 'react';
import {
  MAX_ITEMS_PER_LIST,
  MAX_TITLE_LENGTH,
  MIN_ITEMS_PER_LIST,
  createWordList,
  defaultListTitle,
  parseWordListText,
} from '../../data/customWordLists';
import { CustomWordList, LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';

interface WordListImporterProps {
  gender: LearnerGender;
  theme: ThemeDefinition;
  onSave: (list: CustomWordList) => void;
  onClose: () => void;
}

const PLACEHOLDER = ['1. window - חלון', '2. blanket - שמיכה', '3. pillow', 'I sleep in my bed every night.'].join('\n');

/** Paste a school worksheet word list, preview how it was read, and save it. */
export const WordListImporter: React.FC<WordListImporterProps> = ({ gender, theme, onSave, onClose }) => {
  const isGirl = gender === 'girl';
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const parsed = useMemo(() => parseWordListText(text), [text]);
  const wordCount = parsed.items.filter((i) => i.kind === 'word').length;
  const sentenceCount = parsed.items.length - wordCount;
  const canSave = parsed.items.length >= MIN_ITEMS_PER_LIST;

  const handleSave = () => {
    if (!canSave) return;
    onSave(createWordList(title, parsed.items, new Date()));
  };

  return (
    <ExamModalShell theme={theme} labelHe="ייבוא רשימת מילים" onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="p-5 sm:p-7 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold">📋 ייבוא רשימת מילים מבית הספר</h2>
          <p className={`text-xs sm:text-sm ${theme.mutedTextClass}`}>
            {isGirl
              ? 'העתיקי את הרשימה מהדף של המורה: מילה או משפט בכל שורה. אפשר להוסיף תרגום אחרי מקף.'
              : 'העתק את הרשימה מהדף של המורה: מילה או משפט בכל שורה. אפשר להוסיף תרגום אחרי מקף.'}
          </p>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-extrabold">שם הרשימה</span>
          <input
            type="text"
            value={title}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={defaultListTitle(new Date())}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-bold bg-black/5 dark:bg-white/10 border border-current/15 outline-none focus:border-purple-400`}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-extrabold">המילים מהדף</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={7}
            dir="auto"
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold [unicode-bidi:plaintext] bg-black/5 dark:bg-white/10 border border-current/15 outline-none focus:border-purple-400 resize-y"
          />
        </label>

        {parsed.items.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-extrabold">
              נמצאו {parsed.items.length} פריטים ({wordCount} מילים, {sentenceCount} משפטים) · עד {MAX_ITEMS_PER_LIST}
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="תצוגה מקדימה">
              {parsed.items.map((item) => (
                <li
                  key={item.textEn}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.cardBgClass}`}
                >
                  <span aria-hidden="true">{item.kind === 'word' ? '🔤' : '🧩'}</span>
                  <span dir="ltr">{item.textEn}</span>
                  {item.translationHe && (
                    <span className="opacity-75">
                      · {item.translationHe}
                      {item.isTranslationFromBank && (
                        <span title="התרגום נלקח ממאגר המילים של משרד החינוך"> 📚</span>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {parsed.items.some((i) => i.isTranslationFromBank) && (
              <p className={`text-xs ${theme.mutedTextClass}`}>📚 = תרגום ממאגר המילים של משרד החינוך</p>
            )}
          </div>
        )}

        {parsed.skipped.length > 0 && (
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 space-y-1">
            <p className="text-xs font-extrabold">שורות שלא נכנסו לרשימה:</p>
            <ul className="space-y-0.5 text-xs">
              {parsed.skipped.map((s, idx) => (
                <li key={`${s.line}-${idx}`}>
                  <span dir="auto" className="font-bold">
                    {s.line}
                  </span>{' '}
                  — {s.reasonHe}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-base ${theme.primaryBtnClass} disabled:opacity-40`}
        >
          {canSave ? 'שמירת הרשימה ✓' : `צריך לפחות ${MIN_ITEMS_PER_LIST} מילים או משפטים`}
        </button>
      </div>
    </ExamModalShell>
  );
};
