import React from 'react';
import { CalendarDays, Play } from 'lucide-react';
import { daysBetween, getNextSession, isExamPast } from '../../data/examPrep';
import { ExamPrepPlan, LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { describeDayFocus, getCountdownHe, getStartLabel } from './examPrepFormat';

interface ExamPrepCardProps {
  /** The active (non-archived) plan, if any */
  plan: ExamPrepPlan | undefined;
  gender: LearnerGender;
  theme: ThemeDefinition;
  todayStr: string;
  onCreatePlan: () => void;
  onOpenPlan: () => void;
  onStartDay: (dayIndex: number) => void;
  onShowCertificate: () => void;
  onArchive: () => void;
}

/** Dashboard entry point for exam prep: create a plan, or continue today's session. */
export const ExamPrepCard: React.FC<ExamPrepCardProps> = ({
  plan,
  gender,
  theme,
  todayStr,
  onCreatePlan,
  onOpenPlan,
  onStartDay,
  onShowCertificate,
  onArchive,
}) => {
  const isGirl = gender === 'girl';
  const cardClass = `rounded-3xl p-4 sm:p-5 ${theme.cardBgClass}`;

  if (!plan) {
    return (
      <section aria-label="הכנה למבחן" className={`${cardClass} flex flex-col sm:flex-row sm:items-center gap-3`}>
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${theme.primaryBtnClass}`}>
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base">יש לך מבחן באנגלית בקרוב? 📅</h2>
            <p className={`text-xs ${theme.mutedTextClass}`}>
              {isGirl
                ? 'בחרי תאריך ונושאים, ונבנה לך תוכנית הכנה עם סימולציית מבחן.'
                : 'בחר תאריך ונושאים, ונבנה לך תוכנית הכנה עם סימולציית מבחן.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCreatePlan}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm shrink-0 ${theme.secondaryBtnClass}`}
        >
          הכנה למבחן 🎯
        </button>
      </section>
    );
  }

  const daysLeft = daysBetween(todayStr, plan.examDateStr);
  const doneCount = plan.days.filter((d) => d.completedAt).length;
  const nextDay = getNextSession(plan, todayStr);

  if (isExamPast(plan, todayStr)) {
    return (
      <section aria-label="הכנה למבחן" className={`${cardClass} space-y-3`}>
        <h2 className="font-extrabold text-sm sm:text-base">איך היה המבחן? 🍀</h2>
        <p className={`text-xs ${theme.mutedTextClass}`}>
          השלמת {doneCount} מתוך {plan.days.length} שלבי הכנה. כל הכבוד על ההשקעה!
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCreatePlan} className={`px-4 py-2 rounded-xl font-extrabold text-xs ${theme.primaryBtnClass}`}>
            📅 מבחן חדש
          </button>
          {plan.certificateEarnedAt && (
            <button type="button" onClick={onShowCertificate} className={`px-4 py-2 rounded-xl font-extrabold text-xs ${theme.secondaryBtnClass}`}>
              🏅 התעודה שלי
            </button>
          )}
          <button type="button" onClick={onArchive} className={`px-4 py-2 rounded-xl font-bold text-xs ${theme.secondaryBtnClass}`}>
            סיום
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="הכנה למבחן" className={`${cardClass} space-y-3 border-2 border-purple-400/50`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-xs font-extrabold">
            📅 הכנה למבחן
          </span>
          <h2 className="font-extrabold text-base sm:text-lg">{getCountdownHe(daysLeft)}</h2>
        </div>
        <span className="text-xs font-extrabold shrink-0 pt-1" dir="ltr" lang="en">
          {doneCount}/{plan.days.length} ✅
        </span>
      </div>

      <p className="text-xs sm:text-sm font-bold">
        {nextDay
          ? `${nextDay.dateStr < todayStr ? 'להשלמה: ' : 'היום: '}${describeDayFocus(nextDay)}`
          : plan.certificateEarnedAt
          ? 'סיימת את התוכנית וקיבלת תעודה! 🏅'
          : 'סיימת את התרגול להיום ✅ נתראה מחר!'}
      </p>

      <div className="flex flex-wrap gap-2">
        {nextDay && (
          <button
            type="button"
            onClick={() => onStartDay(nextDay.dayIndex)}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-1.5 ${theme.primaryBtnClass}`}
          >
            <Play className="w-4 h-4 fill-current" />
            {getStartLabel(nextDay, gender)}
          </button>
        )}
        <button type="button" onClick={onOpenPlan} className={`px-4 py-2.5 rounded-2xl font-bold text-sm ${theme.secondaryBtnClass}`}>
          לתוכנית המלאה
        </button>
      </div>
    </section>
  );
};
