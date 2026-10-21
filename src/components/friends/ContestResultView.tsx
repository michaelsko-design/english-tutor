import React from 'react';
import { ContestResult, getScorePercent } from '../../data/contests';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { formatDuration } from './ContestRunner';
import { Button } from '../ui/Button';
import { VibeAmount } from '../ui/VibeAmount';

interface ContestResultViewProps {
  result: ContestResult;
  friendName: string;
  isSaving: boolean;
  /** XP the finish gave; null while saving or when saving failed */
  xpEarned: number | null;
  isFullReward: boolean;
  errorHe: string | null;
  theme: ThemeDefinition;
  onDone: () => void;
}

/** Feature 19: the learner's contest score; the winner is shown on the friend's card once both played. */
export const ContestResultView: React.FC<ContestResultViewProps> = ({
  result,
  friendName,
  isSaving,
  xpEarned,
  isFullReward,
  errorHe,
  theme,
  onDone,
}) => {
  const percent = getScorePercent(result);

  return (
    <ExamModalShell theme={theme} labelHe="תוצאת האתגר" maxWidthClass="max-w-md">
      <div className="p-5 sm:p-7 space-y-4 text-center">
        <div className="text-5xl" aria-hidden="true">{percent >= 70 ? '🏆' : '⚔️'}</div>
        <h2 className="text-xl font-black">סיימת את האתגר!</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-2xl p-3 ${theme.cardBgClass}`}>
            <p className="text-2xl font-black">
              {result.correctCount}/{result.totalCount}
            </p>
            <p className={`text-xs font-bold ${theme.mutedTextClass}`}>תשובות נכונות</p>
          </div>
          <div className={`rounded-2xl p-3 ${theme.cardBgClass}`}>
            <p className="text-2xl font-black" dir="ltr" lang="en">{formatDuration(result.timeMs)}</p>
            <p className={`text-xs font-bold ${theme.mutedTextClass}`}>זמן</p>
          </div>
        </div>

        {isSaving ? (
          <p className={`text-sm font-bold ${theme.mutedTextClass}`} role="status">
            שומרים את התוצאה...
          </p>
        ) : errorHe ? (
          <p role="alert" className="rounded-xl px-3 py-2 text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
            {errorHe}
          </p>
        ) : (
          <>
            {xpEarned !== null && (
              <p className="inline-block px-4 py-1.5 rounded-full text-sm font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <VibeAmount amount={xpEarned} hasPlus />{isFullReward ? ' · נספר כמשימה של היום! 🎯' : ''}
              </p>
            )}
            <p className={`text-xs ${theme.mutedTextClass}`}>
              התוצאה של {friendName} תופיע בכרטיס החבר עד חצות, ואז נדע מי ניצח. על ניצחון מקבלים יהלומים 💎, ועל השתתפות יש פרס קטן.
            </p>
          </>
        )}

        <Button theme={theme} size="lg" className="w-full" onClick={onDone} disabled={isSaving}>
          חזרה למרכז החברים 👫
        </Button>
      </div>
    </ExamModalShell>
  );
};
