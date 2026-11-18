import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ASK_RESEND_AFTER_MS,
  buildProAskMessageHe,
  buildProAskUrl,
  dismissAskResend,
  getProSheetSpokenHe,
  getProSheetTitleHe,
  getUnansweredAsk,
  hasAskedToday,
  readLastAsk,
  rememberAsk,
} from './proAsk';
import { isHebrewSpeakable } from '../services/tts/ttsText';

describe('buildProAskUrl', () => {
  it('carries a new pairing code, or only opens the portal for a paired parent', () => {
    expect(buildProAskUrl('https://app.example/', 'ABCD2345')).toBe('https://app.example/?parent=ABCD2345&pro=1');
    expect(buildProAskUrl('https://app.example', null)).toBe('https://app.example/?parent&pro=1');
  });
});

describe('buildProAskMessageHe', () => {
  it('speaks as the learner, by gender, with the link last', () => {
    const message = buildProAskMessageHe('נועה', 'girl', 'https://x');
    expect(message).toContain('כאן נועה');
    expect(message).toContain('לומדת');
    expect(message.endsWith('https://x')).toBe(true);
    expect(buildProAskMessageHe(' ', 'boy', 'https://x')).toContain('לומד ');
  });
});

describe('one ask a day', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('remembers today\'s ask per learner', () => {
    expect(hasAskedToday('u1', '2026-10-28')).toBe(false);
    rememberAsk('u1', '2026-10-28');
    expect(hasAskedToday('u1', '2026-10-28')).toBe(true);
    expect(hasAskedToday('u1', '2026-10-29')).toBe(false);
    expect(hasAskedToday('u2', '2026-10-28')).toBe(false);
  });

  it('still reads an ask stored by an older version (the day only)', () => {
    localStorage.setItem('english_tutor_pro_ask_u1', '2026-10-28');
    expect(hasAskedToday('u1', '2026-10-28')).toBe(true);
    expect(readLastAsk('u1')).toMatchObject({ dateStr: '2026-10-28', focus: 'missions', resends: 0 });
  });

  it('ignores a broken stored value', () => {
    localStorage.setItem('english_tutor_pro_ask_u1', '{not json');
    expect(readLastAsk('u1')).toBeNull();
    expect(hasAskedToday('u1', '2026-10-28')).toBe(false);
  });
});

describe('sending an unanswered ask again', () => {
  const ASKED_AT = Date.UTC(2026, 10, 1, 12);
  const LATER = ASKED_AT + ASK_RESEND_AFTER_MS;

  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('offers the resend 48 hours after the ask, with the same focus', () => {
    rememberAsk('u1', '2026-11-01', { focus: 'exam', nowMs: ASKED_AT });
    expect(getUnansweredAsk('u1', LATER - 1, false)).toBeNull();
    expect(getUnansweredAsk('u1', LATER, false)).toMatchObject({ focus: 'exam' });
  });

  it('never offers it once Pro is on, or with no ask', () => {
    rememberAsk('u1', '2026-11-01', { nowMs: ASKED_AT });
    expect(getUnansweredAsk('u1', LATER, true)).toBeNull();
    expect(getUnansweredAsk('u2', LATER, false)).toBeNull();
  });

  it('allows two resends per ask, and a new ask starts over', () => {
    rememberAsk('u1', '2026-11-01', { nowMs: ASKED_AT });
    rememberAsk('u1', '2026-11-03', { isResend: true, nowMs: LATER });
    expect(getUnansweredAsk('u1', LATER + ASK_RESEND_AFTER_MS, false)).not.toBeNull();
    rememberAsk('u1', '2026-11-05', { isResend: true, nowMs: LATER + ASK_RESEND_AFTER_MS });
    expect(getUnansweredAsk('u1', LATER + 3 * ASK_RESEND_AFTER_MS, false)).toBeNull();

    rememberAsk('u1', '2026-11-10', { nowMs: LATER + 4 * ASK_RESEND_AFTER_MS });
    expect(readLastAsk('u1')?.resends).toBe(0);
  });

  it('stays away after the card is closed, until the next ask', () => {
    rememberAsk('u1', '2026-11-01', { nowMs: ASKED_AT });
    dismissAskResend('u1', LATER);
    expect(getUnansweredAsk('u1', LATER + ASK_RESEND_AFTER_MS, false)).toBeNull();
    rememberAsk('u1', '2026-11-04', { nowMs: LATER + 1 });
    expect(getUnansweredAsk('u1', LATER + 1 + ASK_RESEND_AFTER_MS, false)).not.toBeNull();
  });
});

describe('the Pro sheet read aloud', () => {
  it('starts with the heading, by gender, and fits one Hebrew clip with no English in it', () => {
    for (const gender of ['girl', 'boy'] as const) {
      const spoken = getProSheetSpokenHe(gender);
      expect(spoken.startsWith(getProSheetTitleHe(gender))).toBe(true);
      expect(spoken).not.toMatch(/[A-Za-z]/);
      expect(isHebrewSpeakable(spoken)).toBe(true);
    }
    expect(getProSheetTitleHe('girl')).toContain('בואי');
    expect(getProSheetTitleHe('boy')).toContain('בוא ');
  });
});
