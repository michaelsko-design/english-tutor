/**
 * The diamonds that fly from a reward to the HUD gem counter. A reward "holds" its diamonds
 * (the HUD keeps showing the old balance) and then "releases" them from a point on the screen;
 * the flight layer animates the gems and lands them one by one, and each landing lets the HUD
 * count up by that gem's share. Purely visual: the profile already holds the new balance.
 */

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface FlightGem {
  id: number;
  /** How many diamonds this gem carries (the gems of a flight add up to its amount) */
  value: number;
  delayMs: number;
  /** Burst direction, in radians, and how far the gem scatters before it flies */
  burstAngle: number;
  burstDistance: number;
  /** How high the arc rises above the straight line, in px */
  arcLift: number;
  /** Turns the gem spins on its way */
  spinTurns: number;
}

export interface DiamondFlight {
  id: string;
  amount: number;
  /** Diamonds already landed in the counter */
  landed: number;
  status: 'held' | 'flying';
  from: ScreenPoint | null;
  gems: FlightGem[];
}

export interface DiamondFlightState {
  flights: DiamondFlight[];
  /** Diamonds in the balance that the HUD should not show yet */
  pendingAmount: number;
}

export const MAX_GEMS = 12;
export const GEM_STAGGER_MS = 70;
/** A held flight that nobody releases flies from the screen centre after this */
export const HOLD_TIMEOUT_MS = 5000;
/** A flight still running after this is ended, so the HUD can't stay below the real balance */
export const SAFETY_RELEASE_MS = 5000;

const MIN_BURST_PX = 30;
const BURST_RANGE_PX = 50;
const MIN_ARC_LIFT_PX = 60;
const ARC_LIFT_RANGE_PX = 120;

const EMPTY_STATE: DiamondFlightState = { flights: [], pendingAmount: 0 };

let state: DiamondFlightState = EMPTY_STATE;
let nextFlightNumber = 1;
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

/** Splits an amount into at most MAX_GEMS gems whose values add up to it. */
export function getGemPlan(amount: number, random: () => number = Math.random): FlightGem[] {
  const total = Math.max(0, Math.floor(amount));
  const count = Math.min(total, MAX_GEMS);
  if (count === 0) return [];
  const base = Math.floor(total / count);
  const extra = total - base * count;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    value: base + (i < extra ? 1 : 0),
    delayMs: i * GEM_STAGGER_MS,
    burstAngle: (i / count) * Math.PI * 2 + random() * 0.6,
    burstDistance: MIN_BURST_PX + random() * BURST_RANGE_PX,
    arcLift: MIN_ARC_LIFT_PX + random() * ARC_LIFT_RANGE_PX,
    spinTurns: random() < 0.5 ? -1 : 1,
  }));
}

function sumPending(flights: DiamondFlight[]): number {
  return flights.reduce((sum, f) => sum + Math.max(0, f.amount - f.landed), 0);
}

function setFlights(flights: DiamondFlight[]): void {
  state = { flights, pendingAmount: sumPending(flights) };
  listeners.forEach((listener) => listener());
}

function startTimer(id: string, ms: number, onTimeout: () => void): void {
  clearTimer(id);
  timers.set(id, setTimeout(onTimeout, ms));
}

function clearTimer(id: string): void {
  const timer = timers.get(id);
  if (timer !== undefined) clearTimeout(timer);
  timers.delete(id);
}

export function subscribeDiamondFlights(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDiamondFlightState(): DiamondFlightState {
  return state;
}

/** Keeps `amount` out of the HUD until it is released; returns the flight id, or null for nothing. */
export function holdDiamonds(amount: number): string | null {
  const gems = getGemPlan(amount);
  if (gems.length === 0) return null;
  const id = `flight-${nextFlightNumber++}`;
  const flight: DiamondFlight = { id, amount: Math.floor(amount), landed: 0, status: 'held', from: null, gems };
  setFlights([...state.flights, flight]);
  startTimer(id, HOLD_TIMEOUT_MS, () => startFlight(id, null));
  return id;
}

function startFlight(id: string, from: ScreenPoint | null): void {
  if (!state.flights.some((f) => f.id === id && f.status === 'held')) return;
  setFlights(state.flights.map((f) => (f.id === id ? { ...f, status: 'flying' as const, from } : f)));
  startTimer(id, SAFETY_RELEASE_MS, () => finishFlight(id));
}

/** Sends every held flight on its way from `from` (null: the screen centre). */
export function releaseHeldDiamonds(from: ScreenPoint | null): void {
  state.flights.filter((f) => f.status === 'held').forEach((f) => startFlight(f.id, from));
}

/** Holds and releases at once: for a reward whose screen is still showing. */
export function launchDiamondFlight(amount: number, from: ScreenPoint | null): string | null {
  const id = holdDiamonds(amount);
  if (id) startFlight(id, from);
  return id;
}

/** A gem reached the counter: the HUD may show its value now. */
export function landGem(id: string, value: number): void {
  if (!state.flights.some((f) => f.id === id)) return;
  setFlights(state.flights.map((f) => (f.id === id ? { ...f, landed: Math.min(f.amount, f.landed + value) } : f)));
}

/** Ends a flight; anything not landed yet shows in the HUD at once. */
export function finishFlight(id: string): void {
  clearTimer(id);
  if (!state.flights.some((f) => f.id === id)) return;
  setFlights(state.flights.filter((f) => f.id !== id));
}

/** The centre of an element, for the start of a flight. */
export function getElementCenter(element: Element | null | undefined): ScreenPoint | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** For tests: drops every flight and timer. */
export function resetDiamondFlights(): void {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
  setFlights([]);
}
