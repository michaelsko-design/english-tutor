import { afterEach, describe, expect, it } from 'vitest';
import {
  clearPendingAccessCode,
  isAccessDeniedError,
  isCompleteAccessCode,
  normalizeAccessCode,
  readPendingAccessCode,
} from './accessService';

afterEach(() => {
  clearPendingAccessCode();
  window.history.replaceState(null, '', '/');
});

describe('access code helpers', () => {
  it('normalizes pasted codes: upper case, no spaces or dashes, at most 10 characters', () => {
    expect(normalizeAccessCode(' abcd-efgh 23 xx')).toBe('ABCDEFGH23');
  });

  it('knows a complete code', () => {
    expect(isCompleteAccessCode('ABCDEFGH23')).toBe(true);
    expect(isCompleteAccessCode('ABCDEFGH2')).toBe(false);
  });

  it('recognises only Firestore permission-denied as "not invited yet"', () => {
    expect(isAccessDeniedError({ code: 'permission-denied' })).toBe(true);
    expect(isAccessDeniedError({ code: 'unavailable' })).toBe(false);
    expect(isAccessDeniedError(new Error('offline'))).toBe(false);
    expect(isAccessDeniedError(null)).toBe(false);
  });
});

describe('pending access code', () => {
  it('takes the code from the link, removes it from the address bar and keeps it', () => {
    window.history.replaceState(null, '', '/?access=abcdefgh23&x=1');
    expect(readPendingAccessCode()).toBe('ABCDEFGH23');
    expect(window.location.search).toBe('?x=1');
    // A later visit (sign-up in between) still finds it
    expect(readPendingAccessCode()).toBe('ABCDEFGH23');
  });

  it('is gone once cleared', () => {
    window.history.replaceState(null, '', '/?access=ABCDEFGH23');
    readPendingAccessCode();
    clearPendingAccessCode();
    expect(readPendingAccessCode()).toBeNull();
  });
});
