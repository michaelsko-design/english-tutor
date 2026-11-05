import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WIDE_LAYOUT_QUERY, useIsWideLayout, useMediaQuery } from './useMediaQuery';

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(initial: boolean) {
  const state = { matches: initial };
  const listeners = new Set<() => void>();
  const matchMedia = vi.fn((media: string) => ({
    get matches() {
      return state.matches;
    },
    media,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  }));
  window.matchMedia = matchMedia as never;
  const setMatches = (next: boolean) => {
    state.matches = next;
    listeners.forEach((fn) => fn());
  };
  return { matchMedia, listeners, setMatches };
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('useMediaQuery', () => {
  it('returns the current match and follows changes', () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 1px)'));
    expect(result.current).toBe(false);

    act(() => media.setMatches(true));
    expect(result.current).toBe(true);
  });

  it('stops listening on unmount', () => {
    const media = mockMatchMedia(true);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 1px)'));
    expect(media.listeners.size).toBe(1);
    unmount();
    expect(media.listeners.size).toBe(0);
  });

  it('is false where matchMedia is missing', () => {
    window.matchMedia = undefined as never;
    const { result } = renderHook(() => useMediaQuery('(min-width: 1px)'));
    expect(result.current).toBe(false);
  });
});

describe('useIsWideLayout', () => {
  it('asks for wide landscape screens', () => {
    const media = mockMatchMedia(true);
    const { result } = renderHook(() => useIsWideLayout());
    expect(result.current).toBe(true);
    expect(media.matchMedia).toHaveBeenCalledWith(WIDE_LAYOUT_QUERY);
    expect(WIDE_LAYOUT_QUERY).toContain('orientation: landscape');
  });
});
