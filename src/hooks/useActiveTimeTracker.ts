import { useEffect, useRef } from 'react';

const TICK_MS = 5_000;
/** No tap, key or scroll for this long and the learner counts as away. */
const IDLE_AFTER_MS = 60_000;
/** Seconds collected before they are written to the profile (one save per flush). */
const FLUSH_AFTER_SECONDS = 300;
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Counts how long the app is in active use (tab visible, learner interacted in the last minute)
 * and hands the seconds to `onFlush` in batches. Owner analytics only: nothing here is shown to
 * the learner, and `onFlush` stores the time in `activityLog[].activeSeconds`.
 */
export function useActiveTimeTracker(onFlush: (seconds: number) => void): void {
  const onFlushRef = useRef(onFlush);
  onFlushRef.current = onFlush;

  useEffect(() => {
    let pendingSeconds = 0;
    let lastInteractionAt = Date.now();

    const flush = () => {
      if (pendingSeconds <= 0) return;
      const seconds = pendingSeconds;
      pendingSeconds = 0;
      onFlushRef.current(seconds);
    };
    const markInteraction = () => {
      lastInteractionAt = Date.now();
    };
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastInteractionAt > IDLE_AFTER_MS) return;
      pendingSeconds += TICK_MS / 1000;
      if (pendingSeconds >= FLUSH_AFTER_SECONDS) flush();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
      else markInteraction();
    };

    const timerId = window.setInterval(tick, TICK_MS);
    INTERACTION_EVENTS.forEach((name) =>
      window.addEventListener(name, markInteraction, { passive: true, capture: true })
    );
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      window.clearInterval(timerId);
      INTERACTION_EVENTS.forEach((name) => window.removeEventListener(name, markInteraction, true));
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
}
