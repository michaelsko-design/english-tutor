import React from 'react';
import { Gift } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { trackEvent } from '../../services/analytics';
import { applyWelcomeBack, isWelcomeBackDue, WELCOME_BACK_DIAMONDS } from '../../data/welcomeBack';
import { Button } from '../ui/Button';

interface WelcomeBackCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** The local calendar day, so a tab left open past midnight still gets the right answer */
  todayStr: string;
  onUpdateProfile: (updated: LearnerProfile) => void;
}

/**
 * Home: a one-time gift for a new learner who comes back after their first day (the second active
 * day, or later after a gap). It shows until claimed, never gates anything, and is not shown again.
 */
export const WelcomeBackCard: React.FC<WelcomeBackCardProps> = ({ profile, theme, todayStr, onUpdateProfile }) => {
  if (!isWelcomeBackDue(profile, todayStr)) return null;

  const handleClaim = () => {
    trackEvent('welcome_back_claimed');
    onUpdateProfile(applyWelcomeBack(profile));
  };

  return (
    <section
      aria-label="מתנת ברוכים השבים"
      className={`rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-amber-300/70 ${theme.cardBgClass}`}
    >
      <Gift className="w-7 h-7 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <h2 className="font-extrabold text-sm">ברוכים השבים! 🎁</h2>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
          מחכה לכם מתנה על שחזרתם ללמוד: {WELCOME_BACK_DIAMONDS} יהלומים 💎
        </p>
      </div>
      <Button theme={theme} size="sm" className="shrink-0" onClick={handleClaim}>
        לוקחים את המתנה
      </Button>
    </section>
  );
};
