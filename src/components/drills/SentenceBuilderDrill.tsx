import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { playSfx } from '../../utils/sfx';

interface SentenceBuilderDrillProps {
  scrambledWords: string[];
  targetSentenceHe?: string;
  selectedIndices: number[];
  isCompleted: boolean;
  onToggleWord: (wordIdx: number) => void;
  onReset: () => void;
  onCheck: () => void;
  theme: ThemeDefinition;
}

export const SentenceBuilderDrill: React.FC<SentenceBuilderDrillProps> = ({
  scrambledWords,
  targetSentenceHe,
  selectedIndices,
  isCompleted,
  onToggleWord,
  onReset,
  onCheck,
  theme,
}) => (
  <div className="space-y-4">
    {targetSentenceHe && (
      <div className="text-sm font-bold opacity-85">
        משפט היעד לתרגום: &ldquo;{targetSentenceHe}&rdquo;
      </div>
    )}

    {/* Assembled Sentence Tray */}
    <div
      className={`min-h-[68px] p-4 rounded-2xl border-2 border-dashed border-purple-400/60 bg-black/5 dark:bg-white/5 flex flex-wrap items-center gap-2`}
      dir="ltr"
    >
      {selectedIndices.length === 0 ? (
        <span className="text-xs opacity-60">
          Tap the English words below in the correct order...
        </span>
      ) : (
        selectedIndices.map((wordIdx) => (
          <button
            key={`picked-${wordIdx}`}
            type="button"
            onClick={() => {
              playSfx('tap');
              onToggleWord(wordIdx);
            }}
            className={`px-3.5 py-2 rounded-xl text-sm font-extrabold ${theme.primaryBtnClass}`}
          >
            {scrambledWords[wordIdx]}
          </button>
        ))
      )}
    </div>

    {/* Word Bank Tiles */}
    <div className="flex flex-wrap items-center gap-2" dir="ltr">
      {scrambledWords.map((word, idx) => {
        const isUsed = selectedIndices.includes(idx);
        return (
          <button
            key={`bank-${idx}-${word}`}
            type="button"
            disabled={isUsed || isCompleted}
            onClick={() => {
              playSfx('tap');
              onToggleWord(idx);
            }}
            className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
              isUsed
                ? 'opacity-30 scale-95 cursor-not-allowed bg-slate-400/20'
                : theme.secondaryBtnClass
            }`}
          >
            {word}
          </button>
        );
      })}
    </div>

    {!isCompleted && (
      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={onReset}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>איפוס מילים</span>
        </button>
        <button
          type="button"
          disabled={selectedIndices.length === 0}
          onClick={onCheck}
          className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-extrabold ${theme.primaryBtnClass} disabled:opacity-40`}
        >
          <span>בדיקת משפט ✓</span>
        </button>
      </div>
    )}
  </div>
);
