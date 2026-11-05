import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePendingInvite } from './usePendingInvite';

const KEY = 'english_tutor_pending_friend_invite';
const CODE = 'ABCD2345';

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('usePendingInvite', () => {
  it('returns no code when there is no invite', () => {
    const { result } = renderHook(() => usePendingInvite());

    expect(result.current[0]).toBeNull();
  });

  it('reads the code from the invite link, keeps it, and takes it out of the address bar', () => {
    window.history.replaceState(null, '', `/?invite=${CODE.toLowerCase()}&utm=x#top`);

    const { result } = renderHook(() => usePendingInvite());

    expect(result.current[0]).toBe(CODE);
    expect(sessionStorage.getItem(KEY)).toBe(CODE);
    expect(window.location.search).toBe('?utm=x');
    expect(window.location.hash).toBe('#top');
  });

  it('finds the kept code again after the address was cleaned', () => {
    sessionStorage.setItem(KEY, CODE);

    const { result } = renderHook(() => usePendingInvite());

    expect(result.current[0]).toBe(CODE);
  });

  it('ignores a malformed code', () => {
    window.history.replaceState(null, '', '/?invite=nope');

    const { result } = renderHook(() => usePendingInvite());

    expect(result.current[0]).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('forgets the code once it has been shown', () => {
    sessionStorage.setItem(KEY, CODE);
    const { result } = renderHook(() => usePendingInvite());

    act(() => result.current[1]());

    expect(result.current[0]).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('still clears the screen state when storage is unavailable', () => {
    sessionStorage.setItem(KEY, CODE);
    const { result } = renderHook(() => usePendingInvite());
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    act(() => result.current[1]());

    expect(result.current[0]).toBeNull();
  });

  it('returns no code when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { result } = renderHook(() => usePendingInvite());

    expect(result.current[0]).toBeNull();
  });
});
