import { describe, expect, it } from 'vitest';
import {
  buildReminderMessage,
  getIsraelHour,
  getIsraelToday,
  getReminderKind,
  getReminderNewPackId,
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

describe('getIsraelHour', () => {
  it('reads the Israel hour in winter (UTC+2), summer (UTC+3) and at midnight', () => {
    expect(getIsraelHour(Date.UTC(2026, 10, 23, 13, 59))).toBe(15);
    expect(getIsraelHour(Date.UTC(2026, 6, 1, 13, 10))).toBe(16);
    expect(getIsraelHour(Date.UTC(2026, 10, 23, 22, 30))).toBe(0);
  });
});

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

describe('getReminderNewPackId', () => {
  const RELEASED = [{ id: 'holidays-autumn' as const, releasedAt: '2026-11-25', access: 'free' as const, newUntil: '2026-12-12' }];

  it('takes the pack the app synced', () => {
    expect(getReminderNewPackId({ waitingHints: ['new-pack'], newPackId: 'holidays-autumn' }, '2026-11-26', [])).toBe('holidays-autumn');
  });

  it('names a new free pack to a learner whose app has not written since it shipped', () => {
    expect(getReminderNewPackId({ waitingHints: [], updatedAt: '2026-11-20T12:00:00.000Z' }, '2026-11-30', RELEASED)).toBe('holidays-autumn');
  });

  it('leaves it to the app once the app wrote after the release, and stops after the new window', () => {
    expect(getReminderNewPackId({ waitingHints: [], updatedAt: '2026-11-26T12:00:00.000Z' }, '2026-11-30', RELEASED)).toBeUndefined();
    expect(getReminderNewPackId({ waitingHints: [], updatedAt: '2026-11-20T12:00:00.000Z' }, '2026-12-13', RELEASED)).toBeUndefined();
  });

  it('never names a Pro pack or a pack some grades lack on its own', () => {
    const pro = [{ ...RELEASED[0], access: 'pro' as const }];
    const someGrades = [{ id: 'core-3' as const, releasedAt: '2026-11-25', access: 'free' as const }];
    const old = { waitingHints: [], updatedAt: '2026-11-20T12:00:00.000Z' };
    expect(getReminderNewPackId(old, '2026-11-30', pro)).toBeUndefined();
    expect(getReminderNewPackId(old, '2026-11-30', someGrades)).toBeUndefined();
  });
});
