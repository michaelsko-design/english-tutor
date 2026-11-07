export const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90';

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Returns day info, short date, and whether the day is Friday or Saturday (Israel weekend/Shabbat) */
export function getDayInfo(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const dayIndex = d.getUTCDay();
  const weekday = WEEKDAYS[dayIndex];
  const isWeekend = dayIndex === 5 || dayIndex === 6;
  return { weekday, isWeekend, shortDate: dateStr.slice(5) };
}

export function percent(share: number | null): string {
  return share === null ? '–' : `${Math.round(share * 100)}%`;
}

export function gradeLabel(gradeId: string): string {
  return gradeId.replace('grade-', 'Grade ');
}
