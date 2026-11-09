import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import { applyWelcomeBack, isWelcomeBackDue, WELCOME_BACK_DIAMONDS } from './welcomeBack';

const TODAY = '2026-11-10';
const YESTERDAY = '2026-11-09';

const afterFirstDay = (overrides: Record<string, unknown> = {}) =>
  makeProfile({
    stats: { ...makeProfile({}).stats, totalActiveDays: 1, streakDays: 1, streakLastDateStr: YESTERDAY },
    ...overrides,
  });

describe('isWelcomeBackDue', () => {
  it('is due when a learner who played one day returns on a later day', () => {
    expect(isWelcomeBackDue(afterFirstDay(), TODAY)).toBe(true);
  });

  it('is due after a longer gap too, since that is when a welcome back matters most', () => {
    expect(isWelcomeBackDue(afterFirstDay(), '2026-11-20')).toBe(true);
  });

  it('is not due on the day of the first lesson or mission itself', () => {
    expect(isWelcomeBackDue(afterFirstDay(), YESTERDAY)).toBe(false);
  });

  it('is not due for a learner who has not finished a first day yet', () => {
    const fresh = makeProfile({ stats: { ...makeProfile({}).stats, totalActiveDays: 0 } });
    expect(isWelcomeBackDue(fresh, TODAY)).toBe(false);
  });

  it('is not due for learners with more than one active day: it is a new-learner gift', () => {
    const regular = makeProfile({ stats: { ...makeProfile({}).stats, totalActiveDays: 12, streakLastDateStr: YESTERDAY } });
    expect(isWelcomeBackDue(regular, TODAY)).toBe(false);
  });

  it('is not due again once claimed', () => {
    expect(isWelcomeBackDue(afterFirstDay({ hasClaimedWelcomeBack: true }), TODAY)).toBe(false);
  });
});

describe('applyWelcomeBack', () => {
  it('pays the gems once and marks the gift as claimed', () => {
    const profile = afterFirstDay();
    const paid = applyWelcomeBack(profile);
    expect(paid.stats.diamonds).toBe(profile.stats.diamonds + WELCOME_BACK_DIAMONDS);
    expect(paid.hasClaimedWelcomeBack).toBe(true);
    expect(profile.hasClaimedWelcomeBack).toBeUndefined();
  });

  it('never pays twice', () => {
    const paid = applyWelcomeBack(afterFirstDay());
    expect(applyWelcomeBack(paid)).toBe(paid);
  });

  it('is 20 gems', () => {
    expect(WELCOME_BACK_DIAMONDS).toBe(20);
  });
});
