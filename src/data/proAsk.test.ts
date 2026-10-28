import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildProAskMessageHe, buildProAskUrl, hasAskedToday, rememberAsk } from './proAsk';

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
});
