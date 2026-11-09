import type { FlightGem, ScreenPoint } from '../services/diamondFlight';

/** Gems pop out of the reward and scatter */
export const BURST_MS = 320;
/** Then each arcs up and into the counter */
export const FLIGHT_MS = 680;
/** A gem just above the HUD when the counter can't be found */
const OFFSCREEN_TARGET_Y = -40;

export interface GemPose {
  x: number;
  y: number;
  scale: number;
  rotateDeg: number;
  opacity: number;
}

export type GemPhase = 'waiting' | 'burst' | 'flying' | 'landed';

const easeOutBack = (p: number): number => {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
};
const easeInOutCubic = (p: number): number => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clamp01 = (p: number): number => Math.min(1, Math.max(0, p));

/** Where a gem ends its burst: scattered around the source. */
export function getBurstEnd(source: ScreenPoint, gem: FlightGem): ScreenPoint {
  return {
    x: source.x + Math.cos(gem.burstAngle) * gem.burstDistance,
    y: source.y + Math.sin(gem.burstAngle) * gem.burstDistance,
  };
}

export function getGemPhase(gem: FlightGem, elapsedMs: number): GemPhase {
  const t = elapsedMs - gem.delayMs;
  if (t < 0) return 'waiting';
  if (t < BURST_MS) return 'burst';
  if (t < BURST_MS + FLIGHT_MS) return 'flying';
  return 'landed';
}

/** A point on the quadratic curve from `start` to `end`, bowed upward by `lift`. */
export function getArcPoint(start: ScreenPoint, end: ScreenPoint, lift: number, p: number): ScreenPoint {
  const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - lift };
  const q = 1 - p;
  return {
    x: q * q * start.x + 2 * q * p * control.x + p * p * end.x,
    y: q * q * start.y + 2 * q * p * control.y + p * p * end.y,
  };
}

/** The gem's position, size, spin and opacity at `elapsedMs` after its flight started. */
export function getGemPose(
  gem: FlightGem,
  source: ScreenPoint,
  target: ScreenPoint,
  elapsedMs: number
): GemPose {
  const t = elapsedMs - gem.delayMs;
  const burstEnd = getBurstEnd(source, gem);
  const phase = getGemPhase(gem, elapsedMs);
  if (phase === 'waiting') return { ...source, scale: 0, rotateDeg: 0, opacity: 0 };
  if (phase === 'burst') {
    const p = easeOutBack(clamp01(t / BURST_MS));
    return {
      x: source.x + (burstEnd.x - source.x) * p,
      y: source.y + (burstEnd.y - source.y) * p,
      scale: 0.3 + 0.9 * p,
      rotateDeg: 0,
      opacity: 1,
    };
  }
  if (phase === 'flying') {
    const p = easeInOutCubic(clamp01((t - BURST_MS) / FLIGHT_MS));
    const point = getArcPoint(burstEnd, target, gem.arcLift, p);
    return { ...point, scale: 1.2 - 0.6 * p, rotateDeg: gem.spinTurns * 360 * p, opacity: 1 };
  }
  return { ...target, scale: 0.6, rotateDeg: 0, opacity: 0 };
}

/** The full time of a flight: the last gem's stagger plus its burst and arc. */
export function getFlightDurationMs(gems: FlightGem[]): number {
  const lastDelay = gems.reduce((max, gem) => Math.max(max, gem.delayMs), 0);
  return lastDelay + BURST_MS + FLIGHT_MS;
}

/** The HUD gem counter's centre, or a point just above the screen when it isn't showing. */
export function getDiamondTargetPoint(doc: Document = document): ScreenPoint {
  const view = doc.defaultView;
  const width = view?.innerWidth ?? 0;
  const height = view?.innerHeight ?? 0;
  const fallback = { x: width / 2, y: OFFSCREEN_TARGET_Y };
  const element = doc.querySelector('[data-diamond-target]');
  if (!element) return fallback;
  const rect = element.getBoundingClientRect();
  const isOnScreen = rect.width > 0 && rect.bottom > 0 && rect.top < height && rect.right > 0 && rect.left < width;
  return isOnScreen ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : fallback;
}
