/**
 * A daily practice reminder for the learner's own calendar: an .ics file with a recurring event
 * (works with Apple/Google/Outlook calendars) and a Google Calendar link. Pure string builders.
 */

/** The same daily time as the push cron (15:00 Israel time) */
export const CALENDAR_REMINDER_HOUR = 15;
const REMINDER_TITLE_HE = 'זמן לתרגל אנגלית ב-EnglishVibe 🔥';
const REMINDER_DURATION_MIN = 10;
const MS_PER_MINUTE = 60_000;
const ICS_LINE_BREAK = '\r\n';

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Floating local time (no zone), so the reminder stays at the same clock time all year. */
function formatLocal(date: Date): string {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** First occurrence: today at the hour, or tomorrow when that hour has passed. */
export function getFirstReminderStart(now: Date, hour: number): Date {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0);
  if (start.getTime() <= now.getTime()) start.setDate(start.getDate() + 1);
  return start;
}

export function buildReminderIcs(now: Date, hour: number, appUrl: string): string {
  const start = getFirstReminderStart(now, hour);
  const end = new Date(start.getTime() + REMINDER_DURATION_MIN * MS_PER_MINUTE);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EnglishVibe//Streak reminder//HE',
    'BEGIN:VEVENT',
    `UID:streak-reminder-${hour}@englishvibe`,
    `DTSTAMP:${formatLocal(now)}`,
    `DTSTART:${formatLocal(start)}`,
    `DTEND:${formatLocal(end)}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${escapeIcsText(REMINDER_TITLE_HE)}`,
    `DESCRIPTION:${escapeIcsText(appUrl)}`,
    `URL:${appUrl}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(REMINDER_TITLE_HE)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join(ICS_LINE_BREAK);
}

export function buildGoogleCalendarUrl(now: Date, hour: number, appUrl: string): string {
  const start = getFirstReminderStart(now, hour);
  const end = new Date(start.getTime() + REMINDER_DURATION_MIN * MS_PER_MINUTE);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: REMINDER_TITLE_HE,
    dates: `${formatLocal(start)}/${formatLocal(end)}`,
    details: appUrl,
    recur: 'RRULE:FREQ=DAILY',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadReminderIcs(now: Date, hour: number, appUrl: string): void {
  const blob = new Blob([buildReminderIcs(now, hour, appUrl)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'englishvibe-reminder.ics';
  link.click();
  URL.revokeObjectURL(url);
}
