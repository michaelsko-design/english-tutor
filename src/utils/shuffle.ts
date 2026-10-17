/**
 * Small deterministic (seeded) shuffle helpers.
 * A seeded shuffle keeps the order stable across React re-renders while still
 * varying it between missions, steps, tiers and mission attempts.
 */

function hashString(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a new array shuffled with a Fisher–Yates pass driven by `seed`. */
export function seededShuffle<T>(items: readonly T[], seed: string | number): T[] {
  const rand = mulberry32(hashString(String(seed)));
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles `items` but guarantees the result differs from the original order
 * (when that is possible, i.e. at least two distinct items).
 */
export function seededShuffleNotIdentity(
  items: readonly string[],
  seed: string | number,
  forbiddenKey?: string
): string[] {
  const avoid = forbiddenKey ?? items.join('\u0000');
  for (let attempt = 0; attempt < 16; attempt++) {
    const shuffled = seededShuffle(items, `${seed}#${attempt}`);
    if (shuffled.join('\u0000') !== avoid) return shuffled;
  }
  return [...items].reverse();
}
