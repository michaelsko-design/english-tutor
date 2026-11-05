/**
 * Cutting the clips rendered whole into an opener clip and a rest clip (see HEBREW_OPENERS): the
 * opener is followed by a pause, so the first pause after the opening silence is where it ends.
 */

export interface Silence {
  start: number;
  end: number;
}

export interface Pause {
  /** The opening silence ends here: the opener starts. */
  leadEnd: number;
  /** The pause after the opener. */
  start: number;
  end: number;
}

/** The silences ffmpeg's silencedetect printed (`silence_start: 0`, `silence_end: 0.60 | silence_duration: …`). */
export function parseSilences(log: string): Silence[] {
  const silences: Silence[] = [];
  let start: number | null = null;
  for (const line of log.split(/\r?\n/)) {
    const startMatch = /silence_start: (-?[\d.]+)/.exec(line);
    if (startMatch) start = Math.max(0, Number(startMatch[1]));
    const endMatch = /silence_end: ([\d.]+)/.exec(line);
    if (endMatch && start !== null) {
      silences.push({ start, end: Number(endMatch[1]) });
      start = null;
    }
  }
  return silences;
}

/** Every pause after the opening silence; empty when the clip has no opening silence or no pause. */
export function pausesAfterLead(silences: readonly Silence[]): Pause[] {
  const [lead, ...pauses] = silences;
  if (!lead || lead.start > 0.05) return [];
  return pauses.map((pause) => ({ leadEnd: lead.end, start: pause.start, end: pause.end }));
}

/** The opening silence and the first pause after the opener; null when the clip has no such pause. */
export const firstPause = (silences: readonly Silence[]): Pause | null => pausesAfterLead(silences)[0] ?? null;

/** The pause that ends the opener: the one whose opener length is closest to the usual length (and typical), if any. */
export function pauseNearUsual(pauses: readonly Pause[], usual: number): Pause | null {
  const best = [...pauses].sort((a, b) => Math.abs(openerLength(a) - usual) - Math.abs(openerLength(b) - usual))[0];
  return best && isTypicalOpener(openerLength(best), usual) ? best : null;
}

export const median = (values: readonly number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? (sorted[middle] as number) : ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2;
};

/** How far the opener's length may differ from its usual length (a different split point means a missed pause). */
export const OPENER_LENGTH_TOLERANCE = 0.3;

/** The opener's spoken length in this clip (opening silence to the pause). */
export const openerLength = (pause: Pause): number => pause.start - pause.leadEnd;

export const isTypicalOpener = (length: number, usual: number): boolean => Math.abs(length - usual) <= usual * OPENER_LENGTH_TOLERANCE;

/** Seconds of the neighbouring silence kept on each side of a cut. */
export const CUT_MARGIN = 0.1;

export function openerRange(pause: Pause): { from: number; to: number } {
  return { from: Math.max(0, pause.leadEnd - CUT_MARGIN), to: pause.start + CUT_MARGIN };
}

export const restStart = (pause: Pause): number => Math.max(0, pause.end - CUT_MARGIN);
