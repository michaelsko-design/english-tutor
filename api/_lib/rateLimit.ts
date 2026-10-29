/**
 * A fixed-window counter per key, kept in the memory of one function instance. Vercel runs several
 * instances and recycles them, so this is a brake on a script hammering one endpoint, not an exact
 * quota; a Vercel WAF rate rule is the hard limit.
 */

/** Keys kept before expired windows are swept, so a flood of new keys can't grow the map forever */
const MAX_TRACKED_KEYS = 5_000;

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  nowMs?: () => number;
}

interface Window {
  startedAtMs: number;
  count: number;
}

/** Returns a function that counts one use of `key` and says whether it is still within the limit. */
export function createRateLimiter({ limit, windowMs, nowMs = Date.now }: RateLimiterOptions): (key: string) => boolean {
  const windows = new Map<string, Window>();

  const sweepExpired = (now: number): void => {
    for (const [key, window] of windows) {
      if (now - window.startedAtMs >= windowMs) windows.delete(key);
    }
  };

  return function isWithinLimit(key: string): boolean {
    const now = nowMs();
    if (windows.size >= MAX_TRACKED_KEYS) sweepExpired(now);
    const current = windows.get(key);
    if (!current || now - current.startedAtMs >= windowMs) {
      windows.set(key, { startedAtMs: now, count: 1 });
      return true;
    }
    current.count += 1;
    return current.count <= limit;
  };
}
