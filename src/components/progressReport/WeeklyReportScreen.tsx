import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import {
  WeeklyReport,
  buildWeeklyReport,
  buildWeeklyReportTextHe,
  formatShortDateHe,
  getAvailableWeeks,
  getGradeLabelHe,
} from '../../data/progressReport';
import { LearnerProfile } from '../../types/learner';
import { TIER_CONFIG, ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { ShareTextActions } from '../ShareTextActions';
import { WeekStrip } from './WeekStrip';

interface WeeklyReportScreenProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  todayStr: string;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onClose: () => void;
}

interface StatTileProps {
  emoji: string;
  labelHe: string;
  value: React.ReactNode;
}

const StatTile: React.FC<StatTileProps> = ({ emoji, labelHe, value }) => (
  <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 text-xs font-bold">
    <span aria-hidden="true">{emoji}</span> {labelHe}
    <div className="text-xl font-extrabold" dir="ltr">
      {value}
    </div>
  </div>
);

const sectionClass = 'rounded-3xl p-4 space-y-3';

/** The tracking note for a week the activity log doesn't fully cover. */
function getTrackingNoteHe(report: WeeklyReport): string | null {
  const start = report.trackingStartDateStr;
  if (!start) return '📌 הדוח השבועי סופר פעילות מהיום והלאה.';
  if (start > report.weekStart) return `📌 הדוח השבועי סופר פעילות החל מ-${formatShortDateHe(start)}.`;
  return null;
}

/** Feature 9: the full weekly report, with week navigation and a shareable text summary. */
export const WeeklyReportScreen: React.FC<WeeklyReportScreenProps> = ({
  profile,
  theme,
  todayStr,
  onSpeakEnglish,
  onClose,
}) => {
  const weeks = getAvailableWeeks(profile, todayStr);
  const [weekIndex, setWeekIndex] = useState(0);
  const safeIndex = Math.min(weekIndex, weeks.length - 1);
  const report = buildWeeklyReport(profile, weeks[safeIndex], todayStr);
  const { overall } = report;
  const isGirl = profile.gender === 'girl';
  const trackingNote = getTrackingNoteHe(report);
  const weekLabel = `${formatShortDateHe(report.weekStart)}–${formatShortDateHe(report.weekEnd)}`;

  const header = (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-extrabold text-sm sm:text-base truncate">
        📊 <span className="sm:hidden">דוח שבועי</span>
        <span className="hidden sm:inline">דוח התקדמות שבועי</span>
      </h2>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setWeekIndex(safeIndex + 1)}
          disabled={safeIndex >= weeks.length - 1}
          className={`p-2 rounded-xl disabled:opacity-40 ${theme.secondaryBtnClass}`}
          aria-label="השבוע הקודם"
          title="השבוע הקודם"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs font-extrabold min-w-[5.5rem] text-center" aria-live="polite">
          {report.isCurrentWeek ? 'השבוע' : weekLabel}
        </span>
        <button
          type="button"
          onClick={() => setWeekIndex(safeIndex - 1)}
          disabled={safeIndex === 0}
          className={`p-2 rounded-xl disabled:opacity-40 ${theme.secondaryBtnClass}`}
          aria-label="השבוע הבא"
          title="השבוע הבא"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <ExamModalShell theme={theme} labelHe="דוח התקדמות שבועי" onClose={onClose} header={header}>
      <div className="p-3.5 sm:p-5 space-y-4">
        <div>
          <p className="font-extrabold text-base sm:text-lg">
            {profile.name || (isGirl ? 'הלומדת' : 'הלומד')} · {getGradeLabelHe(profile)}
          </p>
          <p className={`text-xs ${theme.mutedTextClass}`}>
            שבוע {weekLabel} · רמת קושי: {TIER_CONFIG[profile.preferredTier].badgeEmoji}{' '}
            {TIER_CONFIG[profile.preferredTier].labelHe}
          </p>
          {trackingNote && <p className={`mt-1 text-xs font-bold ${theme.accentTextClass}`}>{trackingNote}</p>}
        </div>

        <section aria-label="השבוע" className={`${sectionClass} ${theme.cardBgClass}`}>
          <h3 className="font-extrabold text-sm">🗓️ הפעילות בשבוע</h3>
          <WeekStrip days={report.days} todayStr={todayStr} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <StatTile emoji="🔥" labelHe="ימי תרגול" value={`${report.activeDays}/7`} />
            <StatTile emoji="✅" labelHe="תרגולים" value={report.sessions} />
            <StatTile emoji="🆕" labelHe="משימות חדשות" value={report.newMissionsCompleted} />
            <StatTile emoji="⭐" labelHe="כוכבים חדשים" value={report.starsGained} />
            <StatTile emoji="🎤" labelHe="מילים בקול" value={report.voiceWords} />
            <StatTile emoji="✨" labelHe="XP" value={report.xpEarned} />
          </div>
        </section>

        <section aria-label="התקדמות כללית" className={`${sectionClass} ${theme.cardBgClass}`}>
          <h3 className="font-extrabold text-sm">📈 התקדמות כללית</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatTile emoji="🏆" labelHe="רמה" value={overall.level} />
            <StatTile emoji="🔥" labelHe="רצף ימים" value={overall.streakDays} />
            <StatTile emoji="🎯" labelHe="משימות" value={overall.missionsCompleted} />
            <StatTile emoji="📚" labelHe="מילים שנשלטו" value={overall.masteredWordCount} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold">
              ⭐ דירוג שליטה: ממוצע {overall.averageStars} כוכבים מתוך 3 למשימה
            </p>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-2.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden"
                role="progressbar"
                aria-label={`כוכבי ${getGradeLabelHe(profile)}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={overall.gradeStarPercent}
              >
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${overall.gradeStarPercent}%` }} />
              </div>
              <span className="text-xs font-extrabold shrink-0" dir="ltr">
                {overall.gradeStarsEarned}/{overall.gradeStarsPossible} ⭐
              </span>
            </div>
            <p className={`text-xs ${theme.mutedTextClass}`}>כוכבים שנאספו במשימות של {getGradeLabelHe(profile)}</p>
          </div>
        </section>

        <section aria-label="מילים שנשלטו השבוע" className={`${sectionClass} ${theme.cardBgClass}`}>
          <h3 className="font-extrabold text-sm">📚 מילים חדשות שנשלטו השבוע ({report.newMasteredWords.length})</h3>
          {report.newMasteredWords.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {report.newMasteredWords.map((word) => (
                <li key={word.wordEn}>
                  <button
                    type="button"
                    onClick={() => onSpeakEnglish(word.wordEn)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${theme.badgeClass}`}
                    aria-label={`השמעת ${word.wordEn}: ${word.translationHe}`}
                  >
                    {word.emoji && <span aria-hidden="true">{word.emoji}</span>}
                    <span dir="ltr">{word.wordEn}</span>
                    <span className="opacity-75">– {word.translationHe}</span>
                    <Volume2 className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-xs ${theme.mutedTextClass}`}>
              עוד אין מילים חדשות השבוע. המילים של משימה נחשבות שנשלטו כשהמשימה מקבלת 3 כוכבים.
            </p>
          )}
        </section>

        <section aria-label="שיתוף הדוח" className={`${sectionClass} ${theme.cardBgClass}`}>
          <h3 className="font-extrabold text-sm">📤 שיתוף הדוח</h3>
          <p className={`text-xs ${theme.mutedTextClass}`}>
            אפשר לשלוח את סיכום השבוע להורים או למורה בוואטסאפ או בכל אפליקציה אחרת.
          </p>
          <ShareTextActions
            key={report.weekStart}
            text={buildWeeklyReportTextHe(report, profile)}
            shareTitle="דוח התקדמות שבועי באנגלית"
            shareLabel="שיתוף הדוח"
            copyLabel="העתקת הדוח"
            copiedLabel="הדוח הועתק ✓"
            copyFailedLabel="לא הצלחנו להעתיק את הדוח."
            theme={theme}
          />
        </section>
      </div>
    </ExamModalShell>
  );
};
