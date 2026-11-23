import React from 'react';
import { Timer } from 'lucide-react';
import type { MissedWord } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { Button } from '../ui/Button';
import { useHomeCardTurn } from './HomeCardSlot';

interface QuickReviewCardProps {
  /** Today's review words (data/missedWords.ts `getQuickReviewWords`); the card hides when empty */
  words: MissedWord[];
  theme: ThemeDefinition;
  onStart: () => void;
}

/**
 * Home: a short, optional review of words missed on the first try. Shown once a day while at least
 * a few words wait; nothing is lost by skipping it (no countdown, no streak warning).
 */
export const QuickReviewCard: React.FC<QuickReviewCardProps> = ({ words, theme, onStart }) => {
  const isMyTurn = useHomeCardTurn('quick-review', words.length > 0);
  if (!isMyTurn) return null;

  return (
    <section
      aria-label="חזרה של דקה"
      className={`rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-sky-300/70 ${theme.cardBgClass}`}
    >
      <Timer className="w-7 h-7 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <h2 className="font-extrabold text-sm">חזרה של דקה ⏱️</h2>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
          {words.length} מילים שהתבלבלנו בהן לאחרונה. דקה אחת והן יושבות טוב יותר.
        </p>
      </div>
      <Button theme={theme} size="sm" className="shrink-0" onClick={onStart}>
        מתחילים
      </Button>
    </section>
  );
};
