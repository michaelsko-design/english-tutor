import { useEffect, useRef, useState } from 'react';
import { countUpValue } from '../utils/rewardFeedback';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const DEFAULT_COUNT_UP_MS = 700;

/**
 * Shows `value`, counting from the previous value when it changes (the first render shows it
 * at once). With reduced motion the number jumps straight to the new value.
 */
export function useCountUp(value: number, durationMs = DEFAULT_COUNT_UP_MS): number {
  const isReducedMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    if (isReducedMotion) {
      shownRef.current = value;
      setShown(value);
      return;
    }

    const startedAt = performance.now();
    let frameId = 0;
    const tick = (now: number) => {
      const next = countUpValue(from, value, (now - startedAt) / durationMs);
      shownRef.current = next;
      setShown(next);
      if (next !== value) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs, isReducedMotion]);

  return shown;
}
