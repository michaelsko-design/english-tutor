import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import type { LearnerProfile } from '../types/learner';
import {
  getReminderAskCount,
  isReminderAskDue,
  isReminderCardDue,
  MAX_REMINDER_ASKS,
  practisedDays,
  recordReminderAsk,
} from './reminderAsk';

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

describe('getReminderAskCount', () => {
  it('derives the count of a profile from before the count existed', () => {
    expect(getReminderAskCount(profileWith({}))).toBe(0);
    expect(getReminderAskCount(profileWith({ reminderDeclinedAtStr: '2026-11-18' }))).toBe(1);
    expect(getReminderAskCount(profileWith({ reminderDeclinedAtStr: '2026-11-18', hasSeenReminderReask: true }))).toBe(2);
    expect(getReminderAskCount(profileWith({ reminderAskCount: 1, hasSeenReminderReask: true }))).toBe(1);
  });
});

describe('isReminderAskDue', () => {
  it('asks a learner who comes back on a second day, whether or not they declined before', () => {
    expect(isReminderAskDue(profileWith({}, { totalActiveDays: 2 }), TODAY)).toBe(true);
    expect(isReminderAskDue(profileWith({ reminderDeclinedAtStr: '2026-11-18' }, { totalActiveDays: 2 }), TODAY)).toBe(true);
  });

  it('waits for the second day of practice', () => {
    expect(isReminderAskDue(profileWith({}, { totalActiveDays: 1, streakDays: 1, streakLastDateStr: TODAY }), TODAY)).toBe(false);
  });

  it('never asks twice on one day', () => {
    expect(isReminderAskDue(profileWith({ reminderDeclinedAtStr: TODAY }, { totalActiveDays: 5 }), TODAY)).toBe(false);
    expect(isReminderAskDue(profileWith({ reminderAskCount: 1, reminderLastAskedAtStr: TODAY }, { totalActiveDays: 5 }), TODAY)).toBe(false);
  });

  it('asks a third time only after 5 days and a 3-day streak', () => {
    const asked = (lastStr: string) => ({ reminderAskCount: 2, reminderLastAskedAtStr: lastStr });
    const streak3 = { totalActiveDays: 6, streakDays: 3, streakLastDateStr: TODAY };
    expect(isReminderAskDue(profileWith(asked('2026-11-15'), streak3), TODAY)).toBe(true);
    expect(isReminderAskDue(profileWith(asked('2026-11-17'), streak3), TODAY)).toBe(false);
    expect(isReminderAskDue(profileWith(asked('2026-11-10'), { totalActiveDays: 6, streakDays: 1, streakLastDateStr: TODAY }), TODAY)).toBe(false);
  });

  it(`stops after ${MAX_REMINDER_ASKS} asks`, () => {
    const streak = { totalActiveDays: 20, streakDays: 10, streakLastDateStr: TODAY };
    expect(isReminderAskDue(profileWith({ reminderAskCount: MAX_REMINDER_ASKS, reminderLastAskedAtStr: '2026-10-01' }, streak), TODAY)).toBe(false);
  });
});

describe('isReminderCardDue', () => {
  it('waits for the second day of practice', () => {
    expect(isReminderCardDue(profileWith({ reminderAskCount: 3, reminderLastAskedAtStr: '2026-11-01' }, { totalActiveDays: 1 }), TODAY)).toBe(false);
  });

  it('stays away while the full-screen ask is due and on the day of an ask', () => {
    expect(isReminderCardDue(profileWith({}, { totalActiveDays: 2 }), TODAY)).toBe(false);
    expect(isReminderCardDue(profileWith({ reminderAskCount: 2, reminderLastAskedAtStr: TODAY }, { totalActiveDays: 3 }), TODAY)).toBe(false);
  });

  it('shows between asks and after the last one', () => {
    expect(isReminderCardDue(profileWith({ reminderAskCount: 2, reminderLastAskedAtStr: '2026-11-18' }, { totalActiveDays: 3 }), TODAY)).toBe(true);
    expect(isReminderCardDue(profileWith({ reminderAskCount: 3, reminderLastAskedAtStr: '2026-11-01' }, { totalActiveDays: 9 }), TODAY)).toBe(true);
  });
});

describe('recordReminderAsk', () => {
  it('counts the ask and keeps the decline day only for a "not now"', () => {
    const declined = recordReminderAsk(profileWith({}), TODAY, true);
    expect(declined).toMatchObject({ reminderAskCount: 1, reminderLastAskedAtStr: TODAY, reminderDeclinedAtStr: TODAY });
    const accepted = recordReminderAsk(profileWith({ reminderAskCount: 1 }), TODAY, false);
    expect(accepted.reminderAskCount).toBe(2);
    expect(accepted.reminderDeclinedAtStr).toBeUndefined();
  });

  it('does not change the profile it was given', () => {
    const profile = profileWith({});
    recordReminderAsk(profile, TODAY, true);
    expect(profile.reminderAskCount).toBeUndefined();
  });
});
