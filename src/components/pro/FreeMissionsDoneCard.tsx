import React from 'react';
import { PARENTS_AREA_LABEL_HE } from '../../data/proAsk';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { Button } from '../ui/Button';

interface FreeMissionsDoneCardProps {
  theme: ThemeDefinition;
  onOpenParentInfo: () => void;
}

/**
 * A free learner finished every free mission of the grade: says, plainly, that the next units are in
 * Pro, with the parents' info (data/proAsk.ts: no ask to buy, by law).
 */
export const FreeMissionsDoneCard: React.FC<FreeMissionsDoneCardProps> = ({ theme, onOpenParentInfo }) => (
  <section aria-label="סיימת את המשימות החינמיות" className={`rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-violet-400/70 ${theme.cardBgClass}`}>
    <span className="text-3xl leading-none shrink-0" aria-hidden="true">
      👑
    </span>
    <div className="flex-1 min-w-0 space-y-0.5">
      <h2 className="font-extrabold text-sm">סיימת את כל המשימות החינמיות! 🎉</h2>
      <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
        היחידות הבאות כלולות במסלול <bdi dir="ltr" lang="en">Pro</bdi>. מידע להורים באזור ההורים.
      </p>
    </div>
    <Button theme={theme} size="sm" variant="secondary" className="shrink-0" onClick={onOpenParentInfo}>
      {PARENTS_AREA_LABEL_HE}
    </Button>
  </section>
);
