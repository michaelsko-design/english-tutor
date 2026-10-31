import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import { applyReminderReward, REMINDER_REWARD_DIAMONDS } from './reminderReward';

describe('applyReminderReward', () => {
  it('pays the diamonds once and marks the profile', () => {
    const profile = makeProfile();
    const paid = applyReminderReward(profile);

    expect(paid.stats.diamonds).toBe(profile.stats.diamonds + REMINDER_REWARD_DIAMONDS);
    expect(paid.hasEarnedReminderReward).toBe(true);
    expect(profile.hasEarnedReminderReward).toBeUndefined();
  });

  it('pays nothing the second time', () => {
    const paid = applyReminderReward(makeProfile());

    expect(applyReminderReward(paid)).toBe(paid);
  });
});
