import type { LearnerProfile } from '../types/learner';
import { daysBetween } from '../utils/dates';

/**
 * Parents pay for a date: when a learner has a school exam coming, or school word lists, the Pro ask
 * and the parent's checkout lead with that instead of "all units". The same small summary goes into
 * the report snapshot a paired parent reads (data/parentLink.ts), so it never carries more than a
 * date and a count.
 */
export interface ExamPitch {
  /** The exam day (YYYY-MM-DD), when an active plan has one today or later */
  examDateStr?: string;
  /** School word lists the learner keeps (not deleted) */
  listCount: number;
}

/** The learner's exam and school lists, or null when there is neither. */
export function getExamPitch(profile: LearnerProfile, todayStr: string): ExamPitch | null {
  const plan = profile.examPrep;
  const examDateStr = plan && !plan.archivedAt && plan.examDateStr >= todayStr ? plan.examDateStr : undefined;
  const listCount = (profile.customWordLists ?? []).filter((list) => !list.archivedAt).length;
  if (!examDateStr && listCount === 0) return null;
  return { ...(examDateStr ? { examDateStr } : {}), listCount };
}

/** A pitch read back from a snapshot, still useful today: an exam day already past is dropped. */
export function currentExamPitch(pitch: ExamPitch | undefined, todayStr: string): ExamPitch | null {
  if (!pitch) return null;
  const examDateStr = pitch.examDateStr && pitch.examDateStr >= todayStr ? pitch.examDateStr : undefined;
  if (!examDateStr && pitch.listCount === 0) return null;
  return { ...(examDateStr ? { examDateStr } : {}), listCount: pitch.listCount };
}

/** "12.12", the way an Israeli school writes an exam day */
export function formatExamDateHe(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${Number(day)}.${Number(month)}`;
}

function daysLeftHe(examDateStr: string, todayStr: string): string {
  const days = daysBetween(todayStr, examDateStr);
  if (days <= 0) return 'היום';
  if (days === 1) return 'מחר';
  return `עוד ${days} ימים`;
}

/** The learner's first perk line in the Pro sheet: the exam with its day, or the school lists */
export function buildExamPerkHe(pitch: ExamPitch, todayStr: string): string {
  if (pitch.examDateStr) {
    return `המבחן ב-${formatExamDateHe(pitch.examDateStr)} (${daysLeftHe(pitch.examDateStr, todayStr)}): הכנה מלאה, עם סימולציה ותעודה`;
  }
  return pitch.listCount === 1 ? 'רשימת המילים מבית הספר, ועוד רשימות' : `${pitch.listCount} רשימות המילים מבית הספר, ועוד רשימות`;
}

/** The line the ask message adds for the parent, in the learner's voice ("רוצה" is the same for a girl and a boy) */
export function buildExamAskLineHe(pitch: ExamPitch): string {
  if (pitch.examDateStr) return `יש לי מבחן באנגלית ב-${formatExamDateHe(pitch.examDateStr)}, ואני רוצה להתכונן אליו עם התוכנית המלאה.`;
  return 'אני רוצה לתרגל את רשימות המילים מבית הספר.';
}

/** The checkout headline for a parent: the soonest exam of the children being paid for */
export function buildExamHeadlineHe(childName: string, pitch: ExamPitch, todayStr: string): string {
  const name = childName.trim();
  if (pitch.examDateStr) {
    const forWhom = name ? ` של ${name}` : '';
    return `להתכונן למבחן באנגלית${forWhom} ב-${formatExamDateHe(pitch.examDateStr)} (${daysLeftHe(pitch.examDateStr, todayStr)})`;
  }
  return name ? `לתרגל עם ${name} את רשימות המילים מבית הספר` : 'לתרגל את רשימות המילים מבית הספר';
}

/** Of the children being paid for, the one to headline: the soonest exam, otherwise the first with school lists. */
export function pickExamLead(children: ReadonlyArray<{ name: string; pitch: ExamPitch | null }>): { name: string; pitch: ExamPitch } | null {
  const withPitch = children.filter((child): child is { name: string; pitch: ExamPitch } => child.pitch !== null);
  const withExam = withPitch
    .filter((child) => child.pitch.examDateStr)
    .sort((a, b) => (a.pitch.examDateStr as string).localeCompare(b.pitch.examDateStr as string));
  return withExam[0] ?? withPitch[0] ?? null;
}
