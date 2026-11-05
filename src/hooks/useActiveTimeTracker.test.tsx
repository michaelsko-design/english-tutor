import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useActiveTimeTracker } from './useActiveTimeTracker';

const TICK_MS = 5_000;
const originalVisibility = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');

function setVisibility(state: 'visible' | 'hidden'): void {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
}

/** Advances in tick-sized steps, tapping the screen before each one so the learner never goes idle. */
function runActive(ticks: number): void {
  for (let i = 0; i < ticks; i += 1) {
    window.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(TICK_MS);
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
  if (originalVisibility) delete (document as unknown as Record<string, unknown>).visibilityState;
});

describe('useActiveTimeTracker', () => {
  it('counts active seconds and hands them over when the screen unmounts', () => {
    const onFlush = vi.fn();
    const { unmount } = renderHook(() => useActiveTimeTracker(onFlush));

    vi.advanceTimersByTime(15_000);
    expect(onFlush).not.toHaveBeenCalled();
    unmount();

    expect(onFlush).toHaveBeenCalledExactlyOnceWith(15);
  });

  it('stops counting once the learner has been idle for a minute', () => {
    const onFlush = vi.fn();
    const { unmount } = renderHook(() => useActiveTimeTracker(onFlush));

    vi.advanceTimersByTime(120_000);
    unmount();

    expect(onFlush).toHaveBeenCalledExactlyOnceWith(60);
  });

  it('keeps counting while the learner interacts', () => {
    const onFlush = vi.fn();
    const { unmount } = renderHook(() => useActiveTimeTracker(onFlush));

    vi.advanceTimersByTime(60_000);
    window.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(60_000);
    unmount();

    expect(onFlush).toHaveBeenCalledExactlyOnceWith(120);
  });

  it('writes a batch every five minutes of activity', () => {
    const onFlush = vi.fn();
    renderHook(() => useActiveTimeTracker(onFlush));

    runActive(60);

    expect(onFlush).toHaveBeenCalledExactlyOnceWith(300);
  });

  it('flushes when the tab is hidden and does not count while it stays hidden', () => {
    const onFlush = vi.fn();
    const { unmount } = renderHook(() => useActiveTimeTracker(onFlush));

    vi.advanceTimersByTime(10_000);
    setVisibility('hidden');
    expect(onFlush).toHaveBeenCalledExactlyOnceWith(10);

    vi.advanceTimersByTime(30_000);
    unmount();
    expect(onFlush).toHaveBeenCalledTimes(1);
  });

  it('treats coming back to the tab as an interaction', () => {
    const onFlush = vi.fn();
    const { unmount } = renderHook(() => useActiveTimeTracker(onFlush));

    setVisibility('hidden');
    vi.advanceTimersByTime(300_000);
    setVisibility('visible');
    vi.advanceTimersByTime(10_000);
    unmount();

    expect(onFlush).toHaveBeenCalledExactlyOnceWith(10);
  });

  it('flushes on pagehide and has nothing to send when nothing was counted', () => {
    const onFlush = vi.fn();
    const { unmount } = renderHook(() => useActiveTimeTracker(onFlush));

    window.dispatchEvent(new Event('pagehide'));
    expect(onFlush).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5_000);
    window.dispatchEvent(new Event('pagehide'));
    expect(onFlush).toHaveBeenCalledExactlyOnceWith(5);
    unmount();
    expect(onFlush).toHaveBeenCalledTimes(1);
  });

  it('calls the latest callback, and stops listening after unmount', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(({ cb }) => useActiveTimeTracker(cb), { initialProps: { cb: first } });

    vi.advanceTimersByTime(5_000);
    rerender({ cb: second });
    unmount();
    expect(second).toHaveBeenCalledExactlyOnceWith(5);

    vi.advanceTimersByTime(60_000);
    window.dispatchEvent(new Event('pagehide'));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
