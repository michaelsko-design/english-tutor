import { describe, expect, it } from 'vitest';
import { inflectHebrew } from '../utils/hebrewGender';
import { buildReminderMessage, type ReminderKind } from './reminderMessage';

const KINDS: ReminderKind[] = ['streak', 'comeback'];
const GENDERS = ['girl', 'boy'] as const;
const allMessages = () => [
  ...KINDS.flatMap((kind) => GENDERS.map((gender) => buildReminderMessage({ streakDays: 4, gender }, kind))),
  ...GENDERS.map((gender) => buildReminderMessage({ streakDays: 4, gender, hint: 'friend-contest' }, 'streak')),
];

describe('buildReminderMessage', () => {
  it('puts the streak count in the streak message', () => {
    expect(buildReminderMessage({ streakDays: 4, gender: 'girl' }, 'streak').body).toContain('4 ימים');
  });

  it('names a one-day streak without a count', () => {
    const body = buildReminderMessage({ streakDays: 1, gender: 'boy' }, 'streak').body;
    expect(body).toBe('המשך כך! הרצף שלך מחכה לך. תרגל קצת היום ותשמור עליו.');
  });

  it('addresses each gender in its own form', () => {
    expect(buildReminderMessage({ streakDays: 2, gender: 'girl' }, 'comeback').body).toContain('בואי');
    expect(buildReminderMessage({ streakDays: 2, gender: 'boy' }, 'comeback').body).toContain('בוא ');
  });

  it('girl text is already inflected for a girl', () => {
    const body = buildReminderMessage({ streakDays: 3, gender: 'girl' }, 'streak').body;
    expect(inflectHebrew(body, 'girl')).toBe(body);
  });

  // Legal guard (Spam Law §30A): a reminder is a service message, never an advert
  it('never carries Pro, prices or offers', () => {
    const forbidden = /Pro|פרו|מנוי|מחיר|₪|הנחה|מבצע|לקנות|לשדרג|חינם|קופון/;
    allMessages().forEach(({ title, body }) => {
      expect(title).not.toMatch(forbidden);
      expect(body).not.toMatch(forbidden);
    });
  });
});
