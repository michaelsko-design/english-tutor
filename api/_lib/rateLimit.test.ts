import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rateLimit';

describe('createRateLimiter', () => {
  it('allows up to the limit and then refuses within the window', () => {
    const isWithinLimit = createRateLimiter({ limit: 3, windowMs: 1000, nowMs: () => 0 });
    expect([1, 2, 3, 4].map(() => isWithinLimit('uid-a'))).toEqual([true, true, true, false]);
  });

  it('counts each key on its own', () => {
    const isWithinLimit = createRateLimiter({ limit: 1, windowMs: 1000, nowMs: () => 0 });
    expect(isWithinLimit('uid-a')).toBe(true);
    expect(isWithinLimit('uid-a')).toBe(false);
    expect(isWithinLimit('uid-b')).toBe(true);
  });

  it('starts a fresh window once the old one has passed', () => {
    let now = 0;
    const isWithinLimit = createRateLimiter({ limit: 1, windowMs: 1000, nowMs: () => now });
    expect(isWithinLimit('uid-a')).toBe(true);
    expect(isWithinLimit('uid-a')).toBe(false);
    now = 1000;
    expect(isWithinLimit('uid-a')).toBe(true);
  });
});
