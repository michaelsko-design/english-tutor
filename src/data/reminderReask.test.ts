import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import type { LearnerProfile } from '../types/learner';
import { isReminderCardDue, markReminderReaskSeen, practisedDays, shouldReaskReminder } from './reminderReask';

const TODAY = '2026-11-20';

function profileWith(overrides: Partial<LearnerProfile>, stats: Partial<LearnerProfile['stats']> = {}): LearnerProfile {
  const base = makeProfile();
  return { ...base, ...overrides, stats: { ...base.stats, ...stats } };
}

describe('practisedDays', () => {
  it('takes the live streak or the total days, whichever is larger', () => {
    expect(practisedDays(profileWith({}, { streakDays: 3, streakLastDateStr: TODAY, totalActiveDays: 2 }), TODAY)).toBe(3);
    expect(practisedDays(profileWith({}, { streakDays: 0, totalActiveDays: 4 }), TODAY)).toBe(4);
  });
});

describe('shouldReaskReminder', () => {
  const declined = { reminderDeclinedAtStr: '2026-11-18' };

  it('asks again on a later day once the learner practised on two days', () => {
    expect(shouldReaskReminder(profileWith(declined, { totalActiveDays: 2 }), TODAY)).toBe(true);
  });

  it('waits for the second day of practice', () => {
    expect(shouldReaskReminder(profileWith(declined, { totalActiveDays: 1, streakDays: 1, streakLastDateStr: TODAY }), TODAY)).toBe(false);
  });

  it('never asks again on the day of the "not now"', () => {
    expect(shouldReaskReminder(profileWith({ reminderDeclinedAtStr: TODAY }, { totalActiveDays: 5 }), TODAY)).toBe(false);
  });

  it('asks only once, and only a learner who declined', () => {
    expect(shouldReaskReminder(profileWith({ ...declined, hasSeenReminderReask: true }, { totalActiveDays: 3 }), TODAY)).toBe(false);
    expect(shouldReaskReminder(profileWith({}, { totalActiveDays: 3 }), TODAY)).toBe(false);
  });
});

describe('isReminderCardDue', () => {
  it('waits for the second day of practice', () => {
    expect(isReminderCardDue(profileWith({}, { totalActiveDays: 1 }), TODAY)).toBe(false);
    expect(isReminderCardDue(profileWith({}, { totalActiveDays: 2 }), TODAY)).toBe(true);
  });

  it('after a "not now", waits until the second ask was shown', () => {
    expect(isReminderCardDue(profileWith({ reminderDeclinedAtStr: '2026-11-18' }, { totalActiveDays: 3 }), TODAY)).toBe(false);
    expect(
      isReminderCardDue(profileWith({ reminderDeclinedAtStr: '2026-11-18', hasSeenReminderReask: true }, { totalActiveDays: 3 }), TODAY)
    ).toBe(true);
  });
});

describe('markReminderReaskSeen', () => {
  it('sets the flag without changing the original', () => {
    const profile = makeProfile();
    expect(markReminderReaskSeen(profile).hasSeenReminderReask).toBe(true);
    expect(profile.hasSeenReminderReask).toBeUndefined();
  });
});
