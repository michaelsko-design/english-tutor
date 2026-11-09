import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import { inflectHebrew } from '../utils/hebrewGender';
import { getActiveHomeTip, HOME_TIPS } from './homeTips';

const withStats = (stats: Record<string, number | string>, extra: Record<string, unknown> = {}) => {
  const base = makeProfile({});
  return makeProfile({ stats: { ...base.stats, ...stats }, ...extra });
};
const none = () => false;

describe('getActiveHomeTip', () => {
  it('shows nothing to a learner who has done nothing yet', () => {
    const fresh = withStats({ missionsCompleted: 0, streakDays: 0, diamonds: 0 });
    expect(getActiveHomeTip(fresh, none)).toBeNull();
  });

  it('explains the stars after the first mission', () => {
    const tip = getActiveHomeTip(withStats({ missionsCompleted: 1, streakDays: 1, diamonds: 0 }, { placementResult: undefined }), none);
    expect(tip?.id).toBe('stars');
  });

  it('then offers the placement test, once, to a learner who has not taken it', () => {
    const profile = withStats({ missionsCompleted: 1, streakDays: 1, diamonds: 0 });
    const tip = getActiveHomeTip(profile, (id) => id === 'stars');
    expect(tip?.id).toBe('placement');
    expect(tip?.action?.kind).toBe('placement');
  });

  it('does not offer the placement test to a learner who has taken it', () => {
    const profile = withStats(
      { missionsCompleted: 1, streakDays: 1, diamonds: 0 },
      { placementResult: { recommendedGradeId: 'grade-4', recommendedTier: 'explorer', correctCount: 5, totalCount: 10, completedAt: '2026-11-05T10:00:00.000Z' } }
    );
    expect(getActiveHomeTip(profile, (id) => id === 'stars')?.id).not.toBe('placement');
  });

  it('points to the shop when the learner has gems to spend', () => {
    const profile = withStats({ missionsCompleted: 1, streakDays: 1, diamonds: 80 });
    const dismissed = new Set(['stars', 'placement']);
    expect(getActiveHomeTip(profile, (id) => dismissed.has(id))?.id).toBe('shop');
  });

  it('explains the streak to a learner who has one, even without a finished mission (grades 1–2)', () => {
    const profile = withStats({ missionsCompleted: 0, streakDays: 1, diamonds: 50 });
    expect(getActiveHomeTip(profile, none)?.id).toBe('streak');
  });

  it('shows one tip at a time, and nothing once every tip was closed', () => {
    const profile = withStats({ missionsCompleted: 2, streakDays: 2, diamonds: 90 });
    const ids = HOME_TIPS.map((tip) => tip.id);
    const seen = new Set<string>();
    for (let step = 0; step < ids.length; step += 1) {
      const tip = getActiveHomeTip(profile, (id) => seen.has(id));
      expect(tip).not.toBeNull();
      seen.add(tip!.id);
    }
    expect(getActiveHomeTip(profile, (id) => seen.has(id))).toBeNull();
  });
});

describe('home tip copy', () => {
  it('is gender-neutral plural Hebrew, unchanged by inflection', () => {
    for (const tip of HOME_TIPS) {
      for (const text of [tip.titleHe, tip.bodyHe, tip.action?.labelHe ?? '']) {
        expect(inflectHebrew(text, 'boy'), tip.id).toBe(text);
        expect(inflectHebrew(text, 'girl'), tip.id).toBe(text);
      }
    }
  });
});
