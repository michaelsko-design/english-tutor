import { describe, expect, it } from 'vitest';
import { buildGoogleCalendarUrl, buildReminderIcs, getFirstReminderStart } from './reminderIcs';

const NOW = new Date(2026, 9, 27, 15, 30); // 27 Oct 2026, 15:30 local

describe('getFirstReminderStart', () => {
  it('uses today when the hour is still ahead', () => {
    expect(getFirstReminderStart(NOW, 18)).toEqual(new Date(2026, 9, 27, 18, 0));
  });

  it('uses tomorrow when the hour has passed', () => {
    expect(getFirstReminderStart(NOW, 9)).toEqual(new Date(2026, 9, 28, 9, 0));
  });
});

describe('buildReminderIcs', () => {
  const ics = buildReminderIcs(NOW, 18, 'https://app.example/');

  it('is a daily recurring event at the chosen local time', () => {
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('DTSTART:20261027T180000');
    expect(ics).toContain('DTEND:20261027T181000');
  });

  it('uses CRLF line breaks and a closed calendar', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });
});

describe('buildGoogleCalendarUrl', () => {
  it('links a daily recurring template', () => {
    const url = new URL(buildGoogleCalendarUrl(NOW, 18, 'https://app.example/'));
    expect(url.origin).toBe('https://calendar.google.com');
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY');
    expect(url.searchParams.get('dates')).toBe('20261027T180000/20261027T181000');
  });
});
