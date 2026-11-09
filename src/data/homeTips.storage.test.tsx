import { beforeEach, describe, expect, it } from 'vitest';
import { dismissHomeTip, isHomeTipDismissed } from './homeTips';

describe('home tip storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('remembers a closed tip per learner on this device', () => {
    expect(isHomeTipDismissed('kid-1', 'stars')).toBe(false);
    dismissHomeTip('kid-1', 'stars');
    expect(isHomeTipDismissed('kid-1', 'stars')).toBe(true);
    expect(isHomeTipDismissed('kid-1', 'shop')).toBe(false);
    expect(isHomeTipDismissed('kid-2', 'stars')).toBe(false);
  });
});
