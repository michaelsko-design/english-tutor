import React, { useEffect } from 'react';
import { celebrate } from '../../utils/celebrate';
import { ExamPrepPlan, LearnerProfile, SUPPORTED_GRADES } from '../../types/learner';
import { EXAM_SKILL_META } from '../../data/examPrep';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from './ExamModalShell';
import { formatExamDate } from './examPrepFormat';

interface ExamReadyCertificateProps {
  plan: ExamPrepPlan;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onClose: () => void;
}

/** The "Exam Ready" certificate, earned by passing the mock exam. */
export const ExamReadyCertificate: React.FC<ExamReadyCertificateProps> = ({
  plan,
  profile,
  theme,
  onClose,
}) => {
  const isGirl = profile.gender === 'girl';
  const gradeLabel = SUPPORTED_GRADES.find((g) => g.id === plan.gradeId)?.labelHe ?? '';

  useEffect(() => {
    celebrate('big');
  }, []);

  return (
    <ExamModalShell theme={theme} labelHe="תעודת מוכנות למבחן" onClose={onClose} maxWidthClass="max-w-lg">
      <div className="p-5 sm:p-7">
        <div className="rounded-3xl border-4 border-double border-amber-400 bg-amber-400/10 p-5 sm:p-7 text-center space-y-4">
          <div className="text-5xl animate-float" aria-hidden="true">
            🏅
          </div>
          <div className="space-y-1">
            <p className="text-xs font-extrabold tracking-[0.2em] uppercase opacity-75" dir="ltr" lang="en">
              Exam Ready Certificate
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold">תעודת &quot;מוכנים למבחן&quot;</h2>
          </div>
          <p className="text-sm sm:text-base leading-relaxed">
            מוענקת בגאווה ל
            <span className="block text-2xl font-extrabold my-1">{profile.name}</span>
            {gradeLabel} · על הכנה מצוינת למבחן באנגלית
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {plan.skills.map((s) => (
              <span key={s} className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeClass}`}>
                {EXAM_SKILL_META[s].emoji} {EXAM_SKILL_META[s].labelHe}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
              ציון בסימולציה
              <div className="text-xl font-extrabold" dir="ltr" lang="en">
                {plan.bestMockScore ?? 0}%
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
              תאריך המבחן
              <div className="text-base font-extrabold">{formatExamDate(plan.examDateStr)}</div>
            </div>
          </div>
          <p className={`text-sm font-extrabold ${theme.accentTextClass}`}>
            {isGirl ? 'בהצלחה במבחן! את מוכנה 💪🍀' : 'בהצלחה במבחן! אתה מוכן 💪🍀'}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`mt-4 w-full py-3.5 rounded-2xl font-extrabold text-base ${theme.primaryBtnClass}`}
        >
          {isGirl ? 'יאללה, אני מוכנה! 🚀' : 'יאללה, אני מוכן! 🚀'}
        </button>
      </div>
    </ExamModalShell>
  );
};
