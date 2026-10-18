import { ActivityLogEntry, LearnerProfile, SUPPORTED_GRADES } from '../types/learner';
import { CURRICULUM_BY_GRADE, MissionNode } from './curriculum';
import { addDays, parseDateStr } from './examPrep';
import { countCompletedMissions } from './milestones';

/**
 * Weekly progress report for parents and teachers (Feature 9).
 *
 * Weeks run Sunday to Saturday (the Israeli school week). Weekly numbers come from the
 * profile's `activityLog`; the overall numbers come from `missionProgress` and `stats`.
 */

/** How many weeks back the report can show; matches the 84 days the activity log keeps. */
export const MAX_REPORT_WEEKS = 12;
/** A mission's words count as mastered once the mission has this many stars. */
export const MASTERED_WORD_MIN_STARS = 3;
/** New words listed in the shared text; the rest are summed up as "ועוד N". */
export const SHARE_TEXT_MAX_WORDS = 10;

const FRIDAY = 5;
const SATURDAY = 6;

export type ReportDayStatus = 'active' | 'missed' | 'shabbat' | 'future';

export interface ReportDay {
  dateStr: string;
  status: ReportDayStatus;
  sessions: number;
}

export interface MasteredWord {
  wordEn: string;
  translationHe: string;
  emoji?: string;
}

export interface OverallProgress {
  level: number;
  streakDays: number;
  missionsCompleted: number;
  totalStars: number;
  /** Average stars of the completed missions, one decimal (0 when none) */
  averageStars: number;
  gradeStarsEarned: number;
  gradeStarsPossible: number;
  gradeStarPercent: number;
  masteredWordCount: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  isCurrentWeek: boolean;
  days: ReportDay[];
  activeDays: number;
  sessions: number;
  xpEarned: number;
  voiceWords: number;
  threeStarSessions: number;
  starsGained: number;
  newMissionsCompleted: number;
  /** Words of the missions that reached 3 stars this week */
  newMasteredWords: MasteredWord[];
  /** The first day the activity log has; earlier days have no weekly data */
  trackingStartDateStr?: string;
  overall: OverallProgress;
}

/** The Sunday that starts the week of a YYYY-MM-DD date. */
export function getWeekStart(dateStr: string): string {
  return addDays(dateStr, -parseDateStr(dateStr).getDay());
}

export function getWeekDays(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

/** Week starts the report can show, newest first: this week back to the log's first week. */
export function getAvailableWeeks(profile: LearnerProfile, todayStr: string): string[] {
  const currentWeek = getWeekStart(todayStr);
  const firstDay = profile.activityLog?.[0]?.dateStr;
  const firstWeek = firstDay && firstDay < currentWeek ? getWeekStart(firstDay) : currentWeek;
  const weeks: string[] = [];
  for (let week = currentWeek; week >= firstWeek && weeks.length < MAX_REPORT_WEEKS; week = addDays(week, -7)) {
    weeks.push(week);
  }
  return weeks;
}

let missionsById: Map<string, MissionNode> | null = null;

/** Every mission of every grade by id; built once, on first use. */
function getMissionsById(): Map<string, MissionNode> {
  if (!missionsById) {
    const missions = Object.values(CURRICULUM_BY_GRADE).flatMap((pack) =>
      pack.units.flatMap((unit) => unit.missions)
    );
    missionsById = new Map(missions.map((mission) => [mission.id, mission]));
  }
  return missionsById;
}

/** The vocabulary of the given missions, without repeated words. */
export function collectMissionWords(missionIds: string[]): MasteredWord[] {
  const byWord = new Map<string, MasteredWord>();
  for (const missionId of missionIds) {
    for (const item of getMissionsById().get(missionId)?.vocabulary || []) {
      const key = item.wordEn.trim().toLowerCase();
      if (!byWord.has(key)) {
        byWord.set(key, { wordEn: item.wordEn, translationHe: item.translationHe, emoji: item.emoji });
      }
    }
  }
  return Array.from(byWord.values());
}

function getMasteredMissionIds(progress: Record<string, number>): string[] {
  return Object.entries(progress)
    .filter(([, stars]) => stars >= MASTERED_WORD_MIN_STARS)
    .map(([missionId]) => missionId);
}

/** Words of the missions with 3 stars, across all grades; the dashboard and the report both show it. */
export function countMasteredWords(progress: Record<string, number>): number {
  return collectMissionWords(getMasteredMissionIds(progress)).length;
}

export function getOverallProgress(profile: LearnerProfile): OverallProgress {
  const progress = profile.missionProgress || {};
  const missionsCompleted = countCompletedMissions(progress);
  const totalStars = Object.values(progress).reduce((sum, stars) => sum + Math.max(0, stars), 0);
  const gradeMissions = (CURRICULUM_BY_GRADE[profile.gradeId]?.units || []).flatMap((unit) => unit.missions);
  const gradeStarsEarned = gradeMissions.reduce((sum, mission) => sum + (progress[mission.id] || 0), 0);
  const gradeStarsPossible = gradeMissions.length * 3;
  return {
    level: profile.stats.level,
    streakDays: profile.stats.streakDays,
    missionsCompleted,
    totalStars,
    averageStars: missionsCompleted > 0 ? Math.round((totalStars / missionsCompleted) * 10) / 10 : 0,
    gradeStarsEarned,
    gradeStarsPossible,
    gradeStarPercent: gradeStarsPossible > 0 ? Math.round((gradeStarsEarned / gradeStarsPossible) * 100) : 0,
    masteredWordCount: countMasteredWords(progress),
  };
}

/** A day counts as practice with a finished session or words said aloud (e.g. the Vocabulary Vault). */
function isPracticeDay(entry: ActivityLogEntry | undefined): boolean {
  return Boolean(entry && (entry.sessions > 0 || entry.voiceWords > 0));
}

function getDayStatus(
  dateStr: string,
  isPractised: boolean,
  todayStr: string,
  isShabbatObserver: boolean
): ReportDayStatus {
  if (isPractised) return 'active';
  if (dateStr > todayStr) return 'future';
  const weekday = parseDateStr(dateStr).getDay();
  if (isShabbatObserver && (weekday === FRIDAY || weekday === SATURDAY)) return 'shabbat';
  return 'missed';
}

export function buildWeeklyReport(profile: LearnerProfile, weekStart: string, todayStr: string): WeeklyReport {
  const weekDays = getWeekDays(weekStart);
  const weekEnd = weekDays[6];
  const log = profile.activityLog || [];
  const weekEntries = log.filter((entry) => entry.dateStr >= weekStart && entry.dateStr <= weekEnd);
  const isShabbatObserver = profile.isShabbatObserver ?? true;
  const days = weekDays.map((dateStr) => {
    const dayEntry = weekEntries.find((entry) => entry.dateStr === dateStr);
    return {
      dateStr,
      sessions: dayEntry?.sessions || 0,
      status: getDayStatus(dateStr, isPracticeDay(dayEntry), todayStr, isShabbatObserver),
    };
  });
  const sum = (pick: (entry: (typeof weekEntries)[number]) => number): number =>
    weekEntries.reduce((total, entry) => total + pick(entry), 0);
  const newMissionIds = new Set(weekEntries.flatMap((entry) => entry.firstCompletedIds));
  const masteredThisWeek = weekEntries.flatMap((entry) =>
    getMasteredMissionIds(entry.missionStars)
  );

  return {
    weekStart,
    weekEnd,
    isCurrentWeek: weekStart === getWeekStart(todayStr),
    days,
    activeDays: days.filter((day) => day.status === 'active').length,
    sessions: sum((entry) => entry.sessions),
    xpEarned: sum((entry) => entry.xpEarned),
    voiceWords: sum((entry) => entry.voiceWords),
    threeStarSessions: sum((entry) => entry.threeStarSessions),
    starsGained: sum((entry) => entry.starsGained),
    newMissionsCompleted: newMissionIds.size,
    newMasteredWords: collectMissionWords(masteredThisWeek),
    trackingStartDateStr: log[0]?.dateStr,
    overall: getOverallProgress(profile),
  };
}

/** "יום אחד" / "N ימים": Hebrew puts the number after the noun for one. */
export function formatDayCountHe(days: number): string {
  return days === 1 ? 'יום אחד' : `${days} ימים`;
}

/** d/m, the way dates are written in Israel. */
export function formatShortDateHe(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  return `${day}/${month}`;
}

export function getGradeLabelHe(profile: LearnerProfile): string {
  return SUPPORTED_GRADES.find((grade) => grade.id === profile.gradeId)?.labelHe || '';
}

/** Plain-text summary for WhatsApp or the share sheet, about the learner in the third person. */
export function buildWeeklyReportTextHe(report: WeeklyReport, profile: LearnerProfile): string {
  const isGirl = profile.gender === 'girl';
  const name = profile.name.trim() || (isGirl ? 'הלומדת' : 'הלומד');
  const practised = isGirl ? 'תרגלה' : 'תרגל';
  const words = report.newMasteredWords;
  const { overall } = report;

  const activityLine =
    report.activeDays > 0
      ? `🔥 ${name} ${practised} ${formatDayCountHe(report.activeDays)} מתוך 7`
      : `🔥 ${name} עוד לא ${practised} בשבוע הזה`;
  const lines = [
    `📊 דוח התקדמות שבועי באנגלית – ${name} (${getGradeLabelHe(profile)})`,
    `🗓️ שבוע ${formatShortDateHe(report.weekStart)}–${formatShortDateHe(report.weekEnd)}`,
    '',
    activityLine,
    `✅ תרגולים שהושלמו: ${report.sessions}`,
    `🆕 משימות חדשות שהושלמו: ${report.newMissionsCompleted}`,
    `⭐ כוכבים חדשים: ${report.starsGained}`,
    `🎤 מילים שנאמרו בקול: ${report.voiceWords}`,
    `✨ נקודות ניסיון (XP): ${report.xpEarned}`,
    '',
    '📈 התקדמות כללית',
    `רמה ${overall.level} · רצף של ${formatDayCountHe(overall.streakDays)}`,
    `משימות שהושלמו: ${overall.missionsCompleted} · ממוצע ${overall.averageStars} כוכבים מתוך 3`,
    `כוכבי הכיתה: ${overall.gradeStarsEarned} מתוך ${overall.gradeStarsPossible} (${overall.gradeStarPercent}%)`,
    `מילים שנשלטו: ${overall.masteredWordCount}`,
  ];
  if (words.length > 0) {
    lines.push('', `📚 מילים חדשות שנשלטו השבוע (${words.length}):`);
    lines.push(...words.slice(0, SHARE_TEXT_MAX_WORDS).map((word) => `${word.wordEn} – ${word.translationHe}`));
    if (words.length > SHARE_TEXT_MAX_WORDS) lines.push(`ועוד ${words.length - SHARE_TEXT_MAX_WORDS} מילים`);
  }
  return lines.join('\n');
}
