/**
 * Cutting a clip rendered whole into the clips of its parts (hebrewLineParts): a shared opener, the
 * line's own text, a shared closer, said one after another. The shared parts have a clip of their own
 * already, so their length is known: each join is the pause nearest where that length puts it.
 */
import type { Silence } from './openerCut';

export interface Span {
  start: number;
  end: number;
}

/** Seconds of the neighbouring silence kept on each side of a cut. */
export const PART_CUT_MARGIN = 0.1;
/** How far a shared part may run from its own clip's length, as a share of that. */
export const PART_LENGTH_TOLERANCE = 0.35;
/** A short part may be off by this many seconds anyway. */
export const PART_LENGTH_SLACK = 0.2;
/** The line's own text is at least this long: shorter means a join fell in the wrong pause. */
export const MIN_OWN_PART = 0.3;
const MIN_SPEECH = 0.03;

/** The stretches of speech between the silences (a silence still open at the end runs to `duration`). */
export function speechRuns(silences: readonly Silence[], duration: number): Span[] {
  const runs: Span[] = [];
  let at = 0;
  for (const silence of silences) {
    if (silence.start - at > MIN_SPEECH) runs.push({ start: at, end: silence.start });
    at = Math.max(at, silence.end);
  }
  if (duration - at > MIN_SPEECH) runs.push({ start: at, end: duration });
  return runs;
}

/** How long the speech in a clip lasts, first sound to last. */
export function speechLength(runs: readonly Span[]): number {
  const first = runs[0];
  const last = runs[runs.length - 1];
  return first && last ? last.end - first.start : 0;
}

const nearestGap = (gaps: readonly Span[], target: number): Span | undefined =>
  [...gaps].sort((a, b) => Math.abs((a.start + a.end) / 2 - target) - Math.abs((b.start + b.end) / 2 - target))[0];

const isNear = (actual: number, expected: number): boolean => Math.abs(actual - expected) <= Math.max(expected * PART_LENGTH_TOLERANCE, PART_LENGTH_SLACK);

/**
 * The time range of each part in a clip of the parts said in a row. `known` is each part's speech
 * length from its own clip, null for the one part that is the line's own text. Null when a join has no
 * pause near where it should be.
 */
export function partRanges(runs: readonly Span[], known: readonly (number | null)[], duration: number): Span[] | null {
  const own = known.indexOf(null);
  if (known.length < 2 || own < 0 || known.lastIndexOf(null) !== own || runs.length < known.length) return null;
  const speechStart = (runs[0] as Span).start;
  const speechEnd = (runs[runs.length - 1] as Span).end;
  const gaps = runs.slice(1).map((run, index) => ({ start: (runs[index] as Span).end, end: run.start }));
  // Before the line's own text, each join follows the part before it; after it, each join precedes the part after it
  const joins: Span[] = [];
  let at = speechStart;
  for (const seconds of known.slice(0, own) as number[]) {
    const gap = nearestGap(gaps.filter((candidate) => candidate.start > at), at + seconds);
    if (!gap) return null;
    joins.push(gap);
    at = gap.end;
  }
  const tail: Span[] = [];
  at = speechEnd;
  for (const seconds of (known.slice(own + 1) as number[]).reverse()) {
    const gap = nearestGap(gaps.filter((candidate) => candidate.end < at), at - seconds);
    if (!gap) return null;
    tail.unshift(gap);
    at = gap.start;
  }
  const all = [...joins, ...tail];
  const bounds = [speechStart, ...all.flatMap((join) => [join.start, join.end]), speechEnd];
  const spoken = known.map((_, index) => ({ start: bounds[index * 2] as number, end: bounds[index * 2 + 1] as number }));
  const isOff = spoken.some((span, index) => {
    const seconds = known[index];
    const length = span.end - span.start;
    return seconds === null || seconds === undefined ? length < MIN_OWN_PART : !isNear(length, seconds);
  });
  if (isOff) return null;
  return spoken.map((span, index) => ({
    start: index === 0 ? 0 : Math.max(0, span.start - PART_CUT_MARGIN),
    end: index === spoken.length - 1 ? duration : Math.min(duration, span.end + PART_CUT_MARGIN),
  }));
}
