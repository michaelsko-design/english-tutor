import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { dismissHomeTip, getActiveHomeTip, HomeTipId, isHomeTipDismissed } from '../../data/homeTips';
import { Button } from '../ui/Button';

interface HomeTipCardProps {
  profile: LearnerProfile;
  /** The signed-in learner a closed tip is remembered for on this device; no tips without one */
  uid: string | null;
  theme: ThemeDefinition;
  onOpenPlacement: () => void;
}

/**
 * Home: one short first-use tip at a time (stars, the placement test, the shop, the streak), each
 * shown when it becomes useful. It replaces the app tour at first launch; the tour is still on the ❓
 * button. A tip is closed for good on this device and never blocks anything.
 */
export const HomeTipCard: React.FC<HomeTipCardProps> = ({ profile, uid, theme, onOpenPlacement }) => {
  // Tips closed in this visit (storage is the memory across visits, this makes the card react at once)
  const [closedNow, setClosedNow] = useState<readonly HomeTipId[]>([]);
  if (!uid) return null;

  const tip = getActiveHomeTip(profile, (id) => closedNow.includes(id) || isHomeTipDismissed(uid, id));
  if (!tip) return null;

  const close = () => {
    dismissHomeTip(uid, tip.id);
    setClosedNow((ids) => [...ids, tip.id]);
  };

  const handleAction = () => {
    close();
    onOpenPlacement();
  };

  return (
    <section
      aria-label="טיפ"
      className={`relative rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-sky-300/60 ${theme.cardBgClass}`}
    >
      <Lightbulb className="w-7 h-7 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <h2 className="font-extrabold text-sm">{tip.titleHe}</h2>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>{tip.bodyHe}</p>
      </div>
      {tip.action ? (
        <Button theme={theme} size="sm" className="shrink-0" onClick={handleAction}>
          {tip.action.labelHe}
        </Button>
      ) : (
        <Button theme={theme} size="sm" variant="secondary" className="shrink-0" onClick={close}>
          הבנתי
        </Button>
      )}
      {tip.action && (
        <button
          type="button"
          onClick={close}
          aria-label="הבנתי"
          className="min-w-11 min-h-11 -my-2 -ml-2 inline-flex items-center justify-center rounded-xl shrink-0 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </section>
  );
};
