import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import {
  EXAM_READY_SCORE,
  EXAM_SKILL_META,
  ExamDayStatus,
  daysBetween,
  getDayStatus,
  getNextSession,
  isMockUnlocked,
} from '../../data/examPrep';
import { ExamPlanDay, ExamPrepPlan, LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from './ExamModalShell';
import { describeDayFocus, formatExamDate, getCountdownHe, getStartLabel } from './examPrepFormat';

interface ExamPrepPlanViewProps {
  plan: ExamPrepPlan;
  gender: LearnerGender;
  theme: ThemeDefinition;
  todayStr: string;
  onStartDay: (dayIndex: number) => void;
  onShowCertificate: () => void;
  onNewPlan: () => void;
  onArchive: () => void;
  onClose: () => void;
}

const STATUS_BADGE: Record<ExamDayStatus, { label: string; className: string }> = {
  done: { label: '✅ בוצע', className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  today: { label: '⭐ היום', className: 'bg-amber-400 text-slate-950' },
  missed: { label: '⏳ להשלמה', className: 'bg-rose-500/15 text-rose-700 dark:text-rose-300' },
  upcoming: { label: 'בהמשך', className: 'bg-black/10 dark:bg-white/10' },
};

/** The study plan timeline: countdown, every day's material, and its start button. */
export const ExamPrepPlanView: React.FC<ExamPrepPlanViewProps> = ({
  plan,
  gender,
  theme,
  todayStr,
  onStartDay,
  onShowCertificate,
  onNewPlan,
  onArchive,
  onClose,
}) => {
  const isGirl = gender === 'girl';
  const daysLeft = daysBetween(todayStr, plan.examDateStr);
  const doneCount = plan.days.filter((d) => d.completedAt).length;
  const nextDay = getNextSession(plan, todayStr);
  const mockUnlocked = isMockUnlocked(plan, todayStr);

  const canStart = (day: ExamPlanDay) =>
    day.kind === 'mock' ? mockUnlocked : Boolean(day.completedAt) || day.dateStr <= todayStr;

  return (
    <ExamModalShell
      theme={theme}
      labelHe="תוכנית ההכנה למבחן"
      onClose={onClose}
      header={
        <div className="flex items-center gap-2">
          <div
            role="progressbar"
            aria-label="התקדמות בתוכנית"
            aria-valuemin={0}
            aria-valuemax={plan.days.length}
            aria-valuenow={doneCount}
            className="flex-1 h-2.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-l from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all"
              style={{ width: `${Math.round((doneCount / plan.days.length) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-extrabold shrink-0" dir="ltr" lang="en">
            {doneCount}/{plan.days.length}
          </span>
        </div>
      }
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div className="space-y-1.5">
          <p className={`text-xs font-bold ${theme.accentTextClass}`}>
            מבחן ב{formatExamDate(plan.examDateStr)}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold">{getCountdownHe(daysLeft)}</h2>
          <div className="flex flex-wrap gap-1.5">
            {plan.unitNumbers.map((u) => (
              <span key={u} className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeClass}`}>
                יחידה {u}
              </span>
            ))}
            {plan.skills.map((s) => (
              <span key={s} className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeClass}`}>
                {EXAM_SKILL_META[s].emoji} {EXAM_SKILL_META[s].labelHe}
              </span>
            ))}
          </div>
        </div>

        {plan.certificateEarnedAt && (
          <button
            type="button"
            onClick={onShowCertificate}
            className="w-full p-3 rounded-2xl bg-amber-400/20 border-2 border-amber-400 font-extrabold text-sm flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5 text-amber-500" />
            {isGirl ? 'את מוכנה למבחן! לתעודה שלך 🏅' : 'אתה מוכן למבחן! לתעודה שלך 🏅'}
          </button>
        )}

        <ol className="space-y-2">
          {plan.days.map((day) => {
            const status = getDayStatus(day, todayStr);
            const badge = STATUS_BADGE[status];
            const isNext = nextDay?.dayIndex === day.dayIndex;
            const startable = canStart(day);
            return (
              <li
                key={day.dayIndex}
                className={`p-3 rounded-2xl flex items-center gap-3 ${theme.cardBgClass} ${
                  isNext ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-extrabold">{formatExamDate(day.dateStr)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${badge.className}`}>
                      {badge.label}
                    </span>
                    {day.scorePercent !== undefined && (
                      <span className="text-xs font-bold opacity-80" dir="ltr" lang="en">
                        {day.scorePercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold">{describeDayFocus(day)}</p>
                </div>
                {startable ? (
                  <button
                    type="button"
                    onClick={() => onStartDay(day.dayIndex)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 ${
                      day.completedAt ? theme.secondaryBtnClass : theme.primaryBtnClass
                    }`}
                  >
                    {day.completedAt ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {getStartLabel(day, gender)}
                      </span>
                    ) : (
                      getStartLabel(day, gender)
                    )}
                  </button>
                ) : (
                  <span
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${theme.mutedTextClass}`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {day.kind === 'mock' ? 'אחרי התרגולים' : 'בקרוב'}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {plan.bestMockScore !== undefined && !plan.certificateEarnedAt && (
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
            הציון הכי טוב בסימולציה: <span dir="ltr" lang="en">{plan.bestMockScore}%</span> · צריך{' '}
            <span dir="ltr" lang="en">{EXAM_READY_SCORE}%</span> לתעודת &quot;מוכנים למבחן&quot;
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button type="button" onClick={onNewPlan} className={`text-xs font-bold underline ${theme.accentTextClass}`}>
            📅 תכנון מבחן חדש
          </button>
          <button type="button" onClick={onArchive} className={`text-xs font-bold underline ${theme.mutedTextClass}`}>
            {daysLeft < 0 ? 'סיום והסרת התוכנית' : 'הסרת התוכנית'}
          </button>
        </div>
      </div>
    </ExamModalShell>
  );
};
