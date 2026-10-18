import React from 'react';
import { BarChart3 } from 'lucide-react';
import { WeeklyReport } from '../../data/progressReport';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { WeekStrip } from './WeekStrip';

interface ProgressReportCardProps {
  report: WeeklyReport;
  todayStr: string;
  theme: ThemeDefinition;
  onOpenReport: () => void;
}

/** Dashboard entry point for the weekly parent / teacher report: this week at a glance. */
export const ProgressReportCard: React.FC<ProgressReportCardProps> = ({ report, todayStr, theme, onOpenReport }) => (
  <section aria-label="דוח התקדמות להורים ולמורים" className={`rounded-3xl p-4 sm:p-5 space-y-3 ${theme.cardBgClass}`} dir="rtl">
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${theme.primaryBtnClass}`}>
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-extrabold text-sm sm:text-base">📊 דוח התקדמות להורים ולמורים</h2>
          <p className={`text-xs ${theme.mutedTextClass}`}>
            השבוע: {report.activeDays === 1 ? 'יום תרגול אחד' : `${report.activeDays} ימי תרגול`} · {report.sessions} תרגולים · {report.starsGained} ⭐ חדשים
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenReport}
        className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm shrink-0 ${theme.secondaryBtnClass}`}
      >
        לדוח השבועי
      </button>
    </div>
    <WeekStrip days={report.days} todayStr={todayStr} isCompact />
  </section>
);
