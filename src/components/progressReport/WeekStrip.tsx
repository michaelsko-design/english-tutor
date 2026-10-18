import React from 'react';
import { ReportDay, ReportDayStatus, formatShortDateHe } from '../../data/progressReport';

const DAY_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

const STATUS_META: Record<ReportDayStatus, { icon: string; labelHe: string; className: string }> = {
  active: { icon: '🔥', labelHe: 'היה תרגול', className: 'bg-orange-500/20 border-orange-400/50' },
  missed: { icon: '·', labelHe: 'לא היה תרגול', className: 'bg-black/5 dark:bg-white/5 border-current/10 opacity-70' },
  shabbat: { icon: '🛡️', labelHe: 'שבת, הרצף מוגן', className: 'bg-emerald-500/10 border-emerald-400/40' },
  future: { icon: '', labelHe: 'עוד לא הגיע', className: 'border-dashed border-current/20 opacity-50' },
};

interface WeekStripProps {
  days: ReportDay[];
  todayStr: string;
  isCompact?: boolean;
}

/** Sunday-to-Saturday row of the week's practice days. */
export const WeekStrip: React.FC<WeekStripProps> = ({ days, todayStr, isCompact = false }) => (
  <ol className="grid grid-cols-7 gap-1 sm:gap-1.5" aria-label="ימי התרגול בשבוע">
    {days.map((day, index) => {
      const meta = STATUS_META[day.status];
      const isToday = day.dateStr === todayStr;
      return (
        <li
          key={day.dateStr}
          className={`rounded-xl border text-center ${isCompact ? 'py-1' : 'py-1.5'} ${meta.className} ${
            isToday ? 'ring-2 ring-purple-400/70' : ''
          }`}
          aria-label={`${DAY_LETTERS[index]} ${formatShortDateHe(day.dateStr)}: ${meta.labelHe}${
            day.sessions > 0 ? ` (${day.sessions} תרגולים)` : ''
          }`}
        >
          <span className="block text-[10px] sm:text-[11px] font-extrabold" aria-hidden="true">
            {DAY_LETTERS[index]}
          </span>
          <span className={`block leading-none ${isCompact ? 'text-sm h-4' : 'text-base sm:text-lg h-5 sm:h-6'}`} aria-hidden="true">
            {meta.icon}
          </span>
          {!isCompact && (
            <span className="block text-[10px] font-bold opacity-70" aria-hidden="true">
              {formatShortDateHe(day.dateStr)}
            </span>
          )}
        </li>
      );
    })}
  </ol>
);
