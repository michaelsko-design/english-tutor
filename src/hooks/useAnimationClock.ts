import { useCallback, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Milliseconds since mount, ticking every frame until `totalMs`. `skip` jumps to the end.
 * With reduced motion the clock starts at the end, so the final state shows at once.
 */
export function useAnimationClock(totalMs: number): { elapsedMs: number; skip: () => void } {
  const isReducedMotion = usePrefersReducedMotion();
  const [elapsedMs, setElapsedMs] = useState(() => (isReducedMotion ? Number.POSITIVE_INFINITY : 0));
  const isFinished = elapsedMs >= totalMs || isReducedMotion;

  useEffect(() => {
    if (isFinished) return;
    const startedAt = performance.now() - elapsedMs;
    let frameId = 0;
    const tick = (now: number) => {
      const next = now - startedAt;
      setElapsedMs(next >= totalMs ? Number.POSITIVE_INFINITY : next);
      if (next < totalMs) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
    // elapsedMs is read only to resume; restarting on every tick would reset the frame loop.
  }, [isFinished, totalMs]);

  const skip = useCallback(() => setElapsedMs(Number.POSITIVE_INFINITY), []);

  return { elapsedMs: isReducedMotion ? Number.POSITIVE_INFINITY : elapsedMs, skip };
}
