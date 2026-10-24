import React, { useEffect, useState } from 'react';
import { Users, X } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { listParentsOfChild } from '../../services/parentService';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { ParentLinkCard } from '../settings/ParentLinkCard';
import { Button } from '../ui/Button';
import { dismissParentNudge, isParentNudgeDismissed } from './parentNudge';

interface ParentNudgeCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
}

/**
 * A small, closable home card inviting a parent to see the weekly report. It is optional: it shows
 * only for a signed-in (not guest) learner with no paired parent, never gates anything, and stays
 * away once closed on this device. The same invite is always in the settings.
 */
export const ParentNudgeCard: React.FC<ParentNudgeCardProps> = ({ profile, theme }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!uid || !profile.isOnboarded || isParentNudgeDismissed(uid)) return undefined;
    let isCancelled = false;
    listParentsOfChild(uid)
      .then((links) => {
        if (!isCancelled) setIsVisible(links.length === 0);
      })
      .catch(() => {
        // Offline or no access: no card, nothing is lost
      });
    return () => {
      isCancelled = true;
    };
  }, [uid, profile.isOnboarded]);

  if (!uid || !isVisible) return null;

  const close = () => {
    dismissParentNudge(uid);
    setIsVisible(false);
  };

  return (
    <>
      <section
        aria-label="הזמנת הורה"
        className={`relative rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-sky-300/60 ${theme.cardBgClass}`}
      >
        <Users className="w-7 h-7 shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0 space-y-0.5">
          <h2 className="font-extrabold text-sm">רוצים שהורה יקבל דוח שבועי?</h2>
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>לא חובה. אפשר גם להזמין אחר כך מההגדרות.</p>
        </div>
        <Button theme={theme} size="sm" className="shrink-0" onClick={() => setIsDialogOpen(true)}>
          להזמין הורה
        </Button>
        <button
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="min-w-11 min-h-11 -my-2 -ml-2 inline-flex items-center justify-center rounded-xl shrink-0 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>
      {isDialogOpen && (
        <ExamModalShell
          theme={theme}
          labelHe="הזמנת הורה"
          onClose={() => setIsDialogOpen(false)}
          header={<h2 className="font-extrabold text-base sm:text-lg">הזמנת הורה</h2>}
        >
          <div className="p-4">
            <ParentLinkCard profile={profile} theme={theme} />
          </div>
        </ExamModalShell>
      )}
    </>
  );
};
