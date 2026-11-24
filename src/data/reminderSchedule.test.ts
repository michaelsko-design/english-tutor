import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import { recordMissedWords } from './missedWords';
import { buildReminderMessage } from './reminderMessage';
import { REMINDER_HINTS, isReminderHint, isReminderHour, pickReminderHint } from './reminderSchedule';
import { getReminderWaiting, getUsualReminderHour } from './reminderWaiting';
import type { ActivityLogEntry } from '../types/learner';

const HOOK = 'הכלב, הביצה והדג מחכים לכם!';

describe('pickReminderHint', () => {
  it('names a different waiting thing on each of the next days', () => {
    const rotating = REMINDER_HINTS.filter((hint) => hint !== 'new-pack');
    const days = ['2026-11-23', '2026-11-24', '2026-11-25'].map((day) => pickReminderHint(rotating, day));
    expect(new Set(days).size).toBe(3);
  });

  it('names a new pack every day while it waits', () => {
    ['2026-11-23', '2026-11-24', '2026-11-25'].forEach((day) =>
      expect(pickReminderHint(['quick-review', 'new-pack', 'room-item'], day)).toBe('new-pack')
    );
  });

  it('keeps the only hint, and has none when nothing waits', () => {
    expect(pickReminderHint(['room-item'], '2026-11-23')).toBe('room-item');
    expect(pickReminderHint([], '2026-11-23')).toBeUndefined();
  });
});

describe('isReminderHour and isReminderHint', () => {
  it('accepts only the offered hours and hints', () => {
    expect(isReminderHour(17)).toBe(true);
    expect(isReminderHour(3)).toBe(false);
    expect(isReminderHour('17')).toBe(false);
    expect(isReminderHint('quick-review')).toBe(true);
    expect(isReminderHint('buy-pro')).toBe(false);
  });
});

describe('getReminderWaiting', () => {
  it('lists missed words, an earned room item and the next mission', () => {
    const profile = makeProfile({
      missedWords: recordMissedWords(undefined, ['cat', 'dog', 'sun'].map((wordEn) => ({ wordEn, translationHe: 'מילה' })), '2026-11-22'),
      unlockedRewardIds: ['room-lamp'],
    });
    const waiting = getReminderWaiting(profile, { storyHookHe: HOOK });
    expect(waiting.nextMissionHookHe).toBe(HOOK);
    expect(waiting.waitingHints).toEqual(['quick-review', 'room-item', 'next-mission']);
  });

  it('adds the new pack with its id', () => {
    const waiting = getReminderWaiting(makeProfile({ unlockedRewardIds: [], missedWords: undefined }), null, 'holidays-autumn');
    expect(waiting).toEqual({ waitingHints: ['new-pack'], newPackId: 'holidays-autumn' });
  });

  it('leaves out the starter plant, too few missed words and a missing mission', () => {
    const profile = makeProfile({ unlockedRewardIds: [], missedWords: undefined });
    expect(getReminderWaiting(profile, null)).toEqual({ waitingHints: [] });
  });
});

const day = (dateStr: string, sessionHours: Record<string, number>): ActivityLogEntry => ({
  dateStr,
  sessions: 1,
  voiceWords: 0,
  threeStarSessions: 0,
  xpEarned: 0,
  starsGained: 0,
  missionStars: {},
  firstCompletedIds: [],
  sessionHours,
});

describe('getUsualReminderHour', () => {
  const TODAY = '2026-11-23';

  it('is 15:00 for a learner with no play history', () => {
    expect(getUsualReminderHour(undefined, TODAY)).toBe(15);
    expect(getUsualReminderHour([day(TODAY, {})], TODAY)).toBe(15);
  });

  it('is the hour the learner most often plays in the last 4 weeks', () => {
    const log = [day('2026-11-20', { '18': 2, '16': 1 }), day('2026-11-22', { '18': 1, '17': 2 })];
    expect(getUsualReminderHour(log, TODAY)).toBe(18);
  });

  it('forgets play older than 4 weeks', () => {
    const log = [day('2026-10-01', { '19': 9 }), day('2026-11-22', { '16': 1 })];
    expect(getUsualReminderHour(log, TODAY)).toBe(16);
  });

  it('keeps morning and late play inside the reminder hours', () => {
    expect(getUsualReminderHour([day('2026-11-22', { '7': 3 })], TODAY)).toBe(14);
    expect(getUsualReminderHour([day('2026-11-22', { '22': 3 })], TODAY)).toBe(20);
  });

  it('breaks a tie toward the earlier hour', () => {
    expect(getUsualReminderHour([day('2026-11-22', { '19': 2, '17': 2 })], TODAY)).toBe(17);
  });
});

describe('buildReminderMessage with something waiting', () => {
  it('names the waiting thing in the learner\'s gender, and the mission hook as written', () => {
    expect(buildReminderMessage({ streakDays: 4, gender: 'girl', hint: 'quick-review' }, 'streak').body).toContain('בואי');
    expect(buildReminderMessage({ streakDays: 4, gender: 'boy', hint: 'room-item' }, 'comeback').body).toContain('בוא ');
    expect(buildReminderMessage({ streakDays: 4, hint: 'next-mission', nextMissionHookHe: HOOK }, 'streak').body).toBe(HOOK);
  });

  it("names a new pack by its title, in the learner's gender", () => {
    const girl = buildReminderMessage({ streakDays: 4, gender: 'girl', hint: 'new-pack', newPackTitleHe: 'חגי הסתיו והחורף' }, 'streak').body;
    const boy = buildReminderMessage({ streakDays: 4, gender: 'boy', hint: 'new-pack' }, 'comeback').body;
    expect(girl).toBe('חדש באפליקציה: חגי הסתיו והחורף! בואי לראות את המשימות החדשות.');
    expect(boy).toBe('משימות חדשות נוספו למפה שלך. בוא לראות!');
  });

  it('never warns about losing the streak or carries an offer', () => {
    const forbidden = /Pro|פרו|מנוי|מחיר|₪|הנחה|מבצע|לקנות|לשדרג|חינם|קופון|תאבד|יישבר|ייעלם/;
    REMINDER_HINTS.forEach((hint) =>
      (['girl', 'boy'] as const).forEach((gender) => {
        const { title, body } = buildReminderMessage({ streakDays: 4, gender, hint }, 'streak');
        expect(`${title} ${body}`).not.toMatch(forbidden);
      })
    );
  });
});
