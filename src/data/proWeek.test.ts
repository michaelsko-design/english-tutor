import { describe, expect, it } from 'vitest';
import type { Entitlement } from './proGate';
import {
  PRO_WEEK_ENDED_SPOKEN_HE,
  PRO_WEEK_ON_SPOKEN_HE,
  getProWeekState,
} from './proWeek';
import { isHebrewSpeakable } from '../services/tts/ttsText';

const NOW = Date.UTC(2026, 10, 20);
const week = (periodEnd: number, source: Entitlement['source'] = 'trial'): Entitlement => ({
  plan: 'pro', status: 'active', source, periodEnd, billingPeriod: null,
});

describe('getProWeekState', () => {
  it('is on until the week ends, then ended (no grace days)', () => {
    expect(getProWeekState(week(NOW + 1), NOW)).toEqual({ kind: 'on', endsAt: NOW + 1 });
    expect(getProWeekState(week(NOW), NOW)).toEqual({ kind: 'ended', endsAt: NOW });
  });

  it('is nothing for other Pro or no Pro', () => {
    expect(getProWeekState(week(NOW + 1, 'subscription'), NOW)).toBeNull();
    expect(getProWeekState(null, NOW)).toBeNull();
  });
});

describe('the read-aloud lines', () => {
  it('are speakable Hebrew, calm, with no ask or offer', () => {
    for (const line of [PRO_WEEK_ON_SPOKEN_HE, PRO_WEEK_ENDED_SPOKEN_HE]) {
      expect(isHebrewSpeakable(line)).toBe(true);
      expect(line).not.toMatch(/לבקש|לשדרג|לקנות|נשארו|רק עוד/);
    }
  });
});
