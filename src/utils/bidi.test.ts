import { describe, expect, it } from 'vitest';
import { formatGainLtr, isolateLtr } from './bidi';

describe('isolateLtr', () => {
  it('wraps the text in a left-to-right isolate', () => {
    expect(isolateLtr('+10 XP')).toBe('\u2066+10 XP\u2069');
  });
});

describe('formatGainLtr', () => {
  it('puts the plus sign in front of the amount and isolates it', () => {
    expect(formatGainLtr(5, 'XP')).toBe('\u2066+5 XP\u2069');
    expect(formatGainLtr(2, '💎')).toBe('\u2066+2 💎\u2069');
  });
});
