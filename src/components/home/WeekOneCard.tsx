import React from 'react';
import { PartyPopper } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { trackEvent } from '../../services/analytics';
import { getWeekOneSummary, markWeekOneSeen } from '../../data/weekOne';
import { formatDayCountHe } from '../../data/progressReport';
import { Button } from '../ui/Button';

interface WeekOneCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** The local calendar day, so a tab left open past midnight still gets the right answer */
  todayStr: string;
  onUpdateProfile: (updated: LearnerProfile) => void;
}

/**
 * Home: a one-time look back at the first week (days practiced, missions, stars, the streak), once
 * the learner is a week in. Closing it marks it seen for good, on every device.
 */
export const WeekOneCard: React.FC<WeekOneCardProps> = ({ profile, theme, todayStr, onUpdateProfile }) => {
  const summary = getWeekOneSummary(profile, todayStr);
  if (!summary) return null;

  const handleClose = () => {
    trackEvent('week_one_seen');
    onUpdateProfile(markWeekOneSeen(profile));
  };

  return (
    <section aria-label="סיכום השבוע הראשון" className={`rounded-2xl px-3.5 py-3 space-y-2 ring-2 ring-sky-300/70 ${theme.cardBgClass}`}>
      <div className="flex items-center gap-2">
        <PartyPopper className="w-6 h-6 shrink-0" aria-hidden="true" />
        <h2 className="font-extrabold text-sm">שבוע ראשון! 🎉</h2>
      </div>
      <p className="text-sm font-bold">
        בשבוע הראשון תרגלתם {formatDayCountHe(summary.activeDays)}, סיימתם {summary.missions} משימות והרווחתם {summary.stars} כוכבים ⭐
      </p>
      {summary.streakDays > 0 && (
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>הרצף עכשיו: {formatDayCountHe(summary.streakDays)} 🔥 ממשיכים!</p>
      )}
      <Button theme={theme} size="sm" onClick={handleClose}>
        איזה כיף, ממשיכים
      </Button>
    </section>
  );
};
