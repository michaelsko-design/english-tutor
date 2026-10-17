import { EXAM_SKILL_META, parseDateStr } from '../../data/examPrep';
import { ExamPlanDay, LearnerGender } from '../../types/learner';

/** Display helpers shared by the exam-prep screens. */

const HEBREW_DATE = new Intl.DateTimeFormat('he-IL', {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
});

export function formatExamDate(dateStr: string): string {
  return HEBREW_DATE.format(parseDateStr(dateStr));
}

export function getCountdownHe(daysLeft: number): string {
  if (daysLeft < 0) return 'המבחן כבר עבר';
  if (daysLeft === 0) return 'המבחן היום! בהצלחה 🍀';
  if (daysLeft === 1) return 'המבחן מחר!';
  return `עוד ${daysLeft} ימים למבחן`;
}

export function describeDayFocus(day: ExamPlanDay): string {
  if (day.kind === 'mock') return '🎓 סימולציית מבחן';
  if (day.focus.length === 0) return '🔁 חזרה כללית על כל החומר';
  return day.focus
    .map((f) => `${EXAM_SKILL_META[f.skill].emoji} ${EXAM_SKILL_META[f.skill].labelHe} · יח׳ ${f.unitNumber}`)
    .join(' | ');
}

export function getStartLabel(day: ExamPlanDay, gender: LearnerGender): string {
  const isGirl = gender === 'girl';
  if (day.completedAt) return isGirl ? 'תרגלי שוב' : 'תרגל שוב';
  if (day.kind === 'mock') return isGirl ? 'התחילי סימולציה' : 'התחל סימולציה';
  return isGirl ? 'התחילי' : 'התחל';
}
