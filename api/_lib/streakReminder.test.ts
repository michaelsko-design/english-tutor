import { describe, expect, it } from 'vitest';
import {
  buildReminderMessage,
  getIsraelToday,
  getReminderKind,
  isPushServiceEndpoint,
  isReminderDue,
  type ReminderSubscriber,
} from './streakReminder';

const base: ReminderSubscriber = {
  id: 'u1',
  streakDays: 5,
  streakLastDateStr: '2026-10-26', // Monday
  isShabbatObserver: false,
};
const tuesday = '2026-10-27';

describe('getIsraelToday', () => {
  it('uses Israel standard time in winter and daylight time in summer', () => {
    expect(getIsraelToday(Date.UTC(2026, 0, 15, 22, 30))).toBe('2026-01-16');
    expect(getIsraelToday(Date.UTC(2026, 6, 15, 12, 0))).toBe('2026-07-15');
  });
});

describe('isReminderDue', () => {
  it('reminds a learner who has not practised today', () => {
    expect(isReminderDue(base, tuesday)).toBe(true);
  });

  it('still reminds a broken streak, a learner with no streak and one who never practised', () => {
    expect(isReminderDue({ ...base, streakLastDateStr: '2026-10-20' }, tuesday)).toBe(true);
    expect(isReminderDue({ ...base, streakDays: 0 }, tuesday)).toBe(true);
    expect(isReminderDue({ ...base, streakDays: 0, streakLastDateStr: undefined }, tuesday)).toBe(true);
  });

  it('skips a learner who already practised today', () => {
    expect(isReminderDue({ ...base, streakLastDateStr: '2026-10-27' }, tuesday)).toBe(false);
  });

  it('skips Friday and Shabbat for Shabbat observers only', () => {
    const friday = '2026-10-30';
    const lastThursday = { ...base, streakLastDateStr: '2026-10-29' };
    expect(isReminderDue({ ...lastThursday, isShabbatObserver: true }, friday)).toBe(false);
    expect(isReminderDue(lastThursday, friday)).toBe(true);
  });
});

describe('getReminderKind', () => {
  it('asks to keep a live streak going', () => {
    expect(getReminderKind(base, tuesday)).toBe('streak');
  });

  it('keeps the streak alive across Shabbat for observers on Sunday', () => {
    const sunday = '2026-11-01';
    const lastThursday = { ...base, streakLastDateStr: '2026-10-29' };
    expect(getReminderKind({ ...lastThursday, isShabbatObserver: true }, sunday)).toBe('streak');
    expect(getReminderKind(lastThursday, sunday)).toBe('comeback');
  });

  it('asks to come back when the streak broke, is zero, or never started', () => {
    expect(getReminderKind({ ...base, streakLastDateStr: '2026-10-24' }, tuesday)).toBe('comeback');
    expect(getReminderKind({ ...base, streakDays: 0 }, tuesday)).toBe('comeback');
    expect(getReminderKind({ ...base, streakLastDateStr: undefined }, tuesday)).toBe('comeback');
  });
});

describe('buildReminderMessage', () => {
  it('addresses a girl and a boy differently, with the streak length', () => {
    const girl = buildReminderMessage({ ...base, gender: 'girl' }, 'streak').body;
    const boy = buildReminderMessage({ ...base, gender: 'boy' }, 'streak').body;
    expect(girl).toContain('המשיכי');
    expect(boy).toContain('המשך');
    expect(boy).toContain('5 ימים');
  });

  it('invites a lapsed learner back for 5 minutes, by gender', () => {
    expect(buildReminderMessage({ ...base, gender: 'girl' }, 'comeback').body).toContain('בואי נחזור');
    expect(buildReminderMessage({ ...base, gender: 'boy' }, 'comeback').body).toContain('בוא נחזור');
    expect(buildReminderMessage(base, 'comeback').body).toContain('5 דקות');
  });
});

describe('isPushServiceEndpoint', () => {
  it.each([
    'https://fcm.googleapis.com/fcm/send/abc:APA91b',
    'https://updates.push.services.mozilla.com/wpush/v2/gAAAA',
    'https://web.push.apple.com/QGuQyavXutnMH',
    'https://wns2-par02p.notify.windows.com/w/?token=BQYAAA',
  ])('accepts the browser push service %s', (endpoint) => {
    expect(isPushServiceEndpoint(endpoint)).toBe(true);
  });

  it.each([
    'http://fcm.googleapis.com/fcm/send/abc',
    'https://tarpit.example/hang',
    'https://fcm.googleapis.com.evil.example/x',
    'https://evil.example/fcm.googleapis.com/x',
    'https://user@fcm.googleapis.com/x',
    'https://fcm.googleapis.com:8443/x',
    'not a url',
  ])('refuses %s', (endpoint) => {
    expect(isPushServiceEndpoint(endpoint)).toBe(false);
  });
});
