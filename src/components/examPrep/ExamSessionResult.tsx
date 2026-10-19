import React from 'react';
import {
  EXAM_READY_SCORE,
  EXAM_REPEAT_REWARD_XP,
  EXAM_SESSION_REWARD_DIAMONDS,
  EXAM_SESSION_REWARD_XP,
  EXAM_SKILLS,
  EXAM_SKILL_META,
  ExamAnswer,
  MOCK_EXAM_REWARD_DIAMONDS,
  MOCK_EXAM_REWARD_XP,
  getConfidenceTips,
  getWeakSkills,
  summarizeAnswers,
} from '../../data/examPrep';
import { ExamPlanDay, ExamPrepPlan, LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface ExamSessionResultProps {
  plan: ExamPrepPlan;
  day: ExamPlanDay;
  answers: readonly ExamAnswer[];
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  onSave: () => void;
  onSaveAndRetry: () => void;
}

/** Score, per-skill breakdown, rewards and confidence tips at the end of a session. */
export const ExamSessionResult: React.FC<ExamSessionResultProps> = ({
  plan,
  day,
  answers,
  gender,
  learnerName,
  theme,
  onSave,
  onSaveAndRetry,
}) => {
  const isGirl = gender === 'girl';
  const isMock = day.kind === 'mock';
  const summary = summarizeAnswers(answers);
  const weakSkills = getWeakSkills(summary);
  const isReady = summary.scorePercent >= EXAM_READY_SCORE;
  const isFirst = !day.completedAt;
  const earnsCertificate = isMock && isReady && !plan.certificateEarnedAt;
  const xp = isFirst ? (isMock ? MOCK_EXAM_REWARD_XP : EXAM_SESSION_REWARD_XP) : EXAM_REPEAT_REWARD_XP;
  const diamonds = isFirst ? (isMock ? MOCK_EXAM_REWARD_DIAMONDS : EXAM_SESSION_REWARD_DIAMONDS) : 0;
  const tips = getConfidenceTips(plan.skills, weakSkills, gender);

  const headline = isMock
    ? isReady
      ? isGirl
        ? `${learnerName}, את מוכנה למבחן! 🎉`
        : `${learnerName}, אתה מוכן למבחן! 🎉`
      : isGirl
      ? 'כמעט שם! עוד קצת תרגול ואת שם 💪'
      : 'כמעט שם! עוד קצת תרגול ואתה שם 💪'
    : isGirl
    ? `כל הכבוד, ${learnerName}! עוד יום של הכנה מאחורייך ✅`
    : `כל הכבוד, ${learnerName}! עוד יום של הכנה מאחוריך ✅`;

  return (
    <div className="p-5 sm:p-7 space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl" aria-hidden="true">
          {isMock ? (isReady ? '🏆' : '📚') : '⭐'}
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">{headline}</h2>
        <p className="text-4xl font-extrabold" dir="ltr" lang="en">
          {summary.scorePercent}%
        </p>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
          {summary.correctCount} תשובות נכונות מתוך {summary.totalQuestions}
          {isMock && !isReady && ` · צריך ${EXAM_READY_SCORE}% לתעודה`}
        </p>
      </div>

      <div className="space-y-2">
        {EXAM_SKILLS.filter((s) => summary.bySkill[s]).map((skill) => {
          const s = summary.bySkill[skill]!;
          const percent = Math.round((s.correct / s.total) * 100);
          return (
            <div key={skill} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>
                  {EXAM_SKILL_META[skill].emoji} {EXAM_SKILL_META[skill].labelHe}
                </span>
                <span dir="ltr" lang="en">
                  {s.correct}/{s.total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${percent >= EXAM_READY_SCORE ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-4 rounded-2xl space-y-2 ${theme.cardBgClass}`}>
        <h3 className="font-extrabold text-sm">💡 טיפים לביטחון במבחן</h3>
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold text-center">
        🎁 <span dir="ltr" lang="en">+{xp} XP</span>
        {diamonds > 0 && (
          <>
            {' · '}
            <span dir="ltr" lang="en">+{diamonds} 💎</span>
          </>
        )}
        {earnsCertificate && ' · 🏅 תעודת "מוכנים למבחן"'}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={onSave}
          className={`flex-1 py-3.5 rounded-2xl font-extrabold text-base ${theme.primaryBtnClass}`}
        >
          {earnsCertificate ? 'לתעודה שלי 🏅' : 'שמירה וחזרה לתוכנית'}
        </button>
        {isMock && !isReady && (
          <button
            type="button"
            onClick={onSaveAndRetry}
            className={`py-3.5 px-4 rounded-2xl font-extrabold text-sm ${theme.secondaryBtnClass}`}
          >
            {isGirl ? 'נסי סימולציה חדשה 🔄' : 'נסה סימולציה חדשה 🔄'}
          </button>
        )}
      </div>
    </div>
  );
};
