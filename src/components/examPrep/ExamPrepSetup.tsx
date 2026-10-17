import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
  EXAM_MAX_DAYS_AHEAD,
  EXAM_SKILLS,
  EXAM_SKILL_META,
  addDays,
  buildExamPlan,
  getStudyDates,
  getUnitOptions,
  toLocalDateStr,
} from '../../data/examPrep';
import { ExamPrepPlan, ExamSkill, LearnerProfile, SUPPORTED_GRADES } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from './ExamModalShell';

interface ExamPrepSetupProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onCreate: (plan: ExamPrepPlan) => void;
  onClose: () => void;
}

const DEFAULT_DAYS_AHEAD = 4;

function toggle<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

/** Step 1 of exam prep: exam date, units and skills, with a live preview of the plan. */
export const ExamPrepSetup: React.FC<ExamPrepSetupProps> = ({ profile, theme, onCreate, onClose }) => {
  const isGirl = profile.gender === 'girl';
  const todayStr = toLocalDateStr(new Date());
  const maxDateStr = addDays(todayStr, EXAM_MAX_DAYS_AHEAD);
  const units = getUnitOptions(profile.gradeId);
  const gradeLabel = SUPPORTED_GRADES.find((g) => g.id === profile.gradeId)?.labelHe ?? '';
  const hasActivePlan = Boolean(profile.examPrep && !profile.examPrep.archivedAt);

  const [examDateStr, setExamDateStr] = useState(() => addDays(todayStr, DEFAULT_DAYS_AHEAD));
  const [unitNumbers, setUnitNumbers] = useState<number[]>([]);
  const [skills, setSkills] = useState<ExamSkill[]>([...EXAM_SKILLS]);

  const studyDates = getStudyDates(todayStr, examDateStr, profile.isShabbatObserver !== false);
  const isDateValid = studyDates.length > 0;
  const isCrashCourse = studyDates.length === 1;
  const canCreate = isDateValid && unitNumbers.length > 0 && skills.length > 0;

  const previewText = !isDateValid
    ? `אפשר לבחור תאריך מהיום ועד ${EXAM_MAX_DAYS_AHEAD} ימים קדימה`
    : isCrashCourse
    ? '⚡ קורס בזק ליום אחד: חזרה כללית + סימולציית מבחן'
    : `📅 ${studyDates.length - 1} ימי תרגול + סימולציית מבחן ביום האחרון`;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate(
      buildExamPlan({
        gradeId: profile.gradeId,
        examDateStr,
        unitNumbers,
        skills,
        todayStr,
        isShabbatObserver: profile.isShabbatObserver !== false,
        createdAt: new Date().toISOString(),
      })
    );
  };

  const chipClass = (isOn: boolean) =>
    `p-3 rounded-2xl text-start transition-all border-2 ${
      isOn ? 'border-purple-500 bg-purple-500/15' : `${theme.cardBgClass} border-transparent opacity-80`
    }`;

  return (
    <ExamModalShell
      theme={theme}
      labelHe="הכנה למבחן"
      onClose={onClose}
      header={<span className="font-extrabold text-sm" dir="rtl">📅 הכנה למבחן · {gradeLabel}</span>}
    >
      <div className="p-4 sm:p-6 space-y-5" dir="rtl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold">
            {isGirl ? 'יש לך מבחן באנגלית? בואי נתכונן! 💪' : 'יש לך מבחן באנגלית? בוא נתכונן! 💪'}
          </h2>
          <p className={`text-sm ${theme.mutedTextClass}`}>
            {isGirl
              ? 'ספרי לנו מתי המבחן ועל מה הוא, ונבנה לך תוכנית תרגול קצרה לכל יום.'
              : 'ספר לנו מתי המבחן ועל מה הוא, ונבנה לך תוכנית תרגול קצרה לכל יום.'}
          </p>
        </div>

        <section className="space-y-2" aria-labelledby="exam-date-label">
          <label id="exam-date-label" htmlFor="exam-date" className="font-extrabold text-sm flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> 1. מתי המבחן?
          </label>
          <input
            id="exam-date"
            type="date"
            value={examDateStr}
            min={todayStr}
            max={maxDateStr}
            onChange={(e) => setExamDateStr(e.target.value)}
            className={`w-full sm:w-60 px-3 py-2.5 rounded-xl font-bold outline-none ${theme.inputBgClass}`}
            dir="ltr"
          />
          <p role="status" className={`text-xs font-bold ${isDateValid ? theme.accentTextClass : 'text-rose-600'}`}>
            {previewText}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-sm">2. {isGirl ? 'אילו יחידות במבחן? (בחרי אחת או יותר)' : 'אילו יחידות במבחן? (בחר אחת או יותר)'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {units.map((u) => {
              const isOn = unitNumbers.includes(u.unitNumber);
              return (
                <button
                  key={u.unitNumber}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => setUnitNumbers(toggle(unitNumbers, u.unitNumber))}
                  className={chipClass(isOn)}
                >
                  <div className="font-extrabold text-sm">
                    {u.badgeEmoji} יחידה {u.unitNumber}: {u.titleHe}
                  </div>
                  <div className={`text-[11px] mt-0.5 line-clamp-2 ${theme.mutedTextClass}`} dir="ltr">
                    {u.topics.join(' · ')}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-extrabold text-sm">3. {isGirl ? 'מה צריך לתרגל?' : 'מה צריך לתרגל?'}</h3>
          <div className="grid grid-cols-2 gap-2">
            {EXAM_SKILLS.map((skill) => {
              const meta = EXAM_SKILL_META[skill];
              const isOn = skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => setSkills(toggle(skills, skill))}
                  className={chipClass(isOn)}
                >
                  <div className="font-extrabold text-sm">
                    {meta.emoji} {meta.labelHe}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${theme.mutedTextClass}`}>{meta.descriptionHe}</div>
                </button>
              );
            })}
          </div>
        </section>

        {hasActivePlan && (
          <p className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40">
            ⚠️ התוכנית החדשה תחליף את תוכנית ההכנה הנוכחית.
          </p>
        )}

        <button
          type="button"
          disabled={!canCreate}
          onClick={handleCreate}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-base ${theme.primaryBtnClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          בניית התוכנית שלי 🚀
        </button>
      </div>
    </ExamModalShell>
  );
};
