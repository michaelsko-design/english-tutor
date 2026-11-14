/**
 * The soft launch's success gates: six rates with a target and, for most, a "rethink" line. The
 * owner dashboard shows each as a green, amber or red tile. These are first thresholds, to be
 * adjusted with real data (backlog: "Success gates tiles").
 */

/** A rate from fewer accounts than this says nothing yet */
export const MIN_GATE_SAMPLE = 20;

/** Days after sign-up within which an activated learner should reach the first Pro wall */
export const WALL_WINDOW_DAYS = 14;
/** The cancel rate is judged only on subscriptions at least this old ("after month 2") */
export const CANCEL_MIN_AGE_DAYS = 60;
export const CANCEL_WINDOW_DAYS = 30;

export type GateId = 'activation' | 'wall' | 'ask' | 'askToPaid' | 'activatedToPaid' | 'monthlyCancel';
export type GateStatus = 'green' | 'amber' | 'red' | 'no-data';

/** The counts the gates are computed from (`api/_lib/conversionFunnel.ts`) */
export interface GateCounts {
  signedUp: number;
  activated: number;
  /** Activated learners who signed up at least WALL_WINDOW_DAYS ago */
  activatedMature: number;
  /** Of those, the ones who reached the wall within WALL_WINDOW_DAYS of signing up */
  wallInWindow: number;
  reachedWall: number;
  /** Learners at the wall who sent an ask */
  askSent: number;
  /** Learners who sent an ask and now have a paid plan */
  paidAfterAsk: number;
  /** Activated learners with a paid plan */
  paidActivated: number;
  /** Paid plans at least CANCEL_MIN_AGE_DAYS old */
  cancelBase: number;
  /** Of those, cancelled in the last CANCEL_WINDOW_DAYS */
  cancelledRecently: number;
}

interface GateDefinition {
  id: GateId;
  label: string;
  /** `min`: the rate should be at least the target. `max`: it should stay under it. */
  direction: 'min' | 'max';
  target: number;
  /** Beyond this line the plan needs a rethink; null when the gate has only a target */
  rethink: number | null;
  numerator: (counts: GateCounts) => number;
  denominator: (counts: GateCounts) => number;
}

export const SUCCESS_GATES: readonly GateDefinition[] = [
  {
    id: 'activation',
    label: 'Activated, of sign-ups',
    direction: 'min',
    target: 0.3,
    rethink: 0.2,
    numerator: (c) => c.activated,
    denominator: (c) => c.signedUp,
  },
  {
    id: 'wall',
    label: `Reached the wall within ${WALL_WINDOW_DAYS} days, of activated`,
    direction: 'min',
    target: 0.4,
    rethink: null,
    numerator: (c) => c.wallInWindow,
    denominator: (c) => c.activatedMature,
  },
  {
    id: 'ask',
    label: 'Ask sent, of those at the wall',
    direction: 'min',
    target: 0.35,
    rethink: null,
    numerator: (c) => c.askSent,
    denominator: (c) => c.reachedWall,
  },
  {
    id: 'askToPaid',
    label: 'Paid, of asks sent',
    direction: 'min',
    target: 0.08,
    rethink: 0.04,
    numerator: (c) => c.paidAfterAsk,
    denominator: (c) => c.askSent,
  },
  {
    id: 'activatedToPaid',
    label: 'Paid, of activated',
    direction: 'min',
    target: 0.02,
    rethink: 0.01,
    numerator: (c) => c.paidActivated,
    denominator: (c) => c.activated,
  },
  {
    id: 'monthlyCancel',
    label: 'Monthly cancel rate (after month 2)',
    direction: 'max',
    target: 0.15,
    rethink: 0.25,
    numerator: (c) => c.cancelledRecently,
    denominator: (c) => c.cancelBase,
  },
];

export interface GateResult {
  id: GateId;
  label: string;
  direction: 'min' | 'max';
  target: number;
  rethink: number | null;
  /** The rate, 0 to 1; null while the sample is too small */
  value: number | null;
  numerator: number;
  /** How many accounts the rate is out of */
  sample: number;
  status: GateStatus;
}

function statusOf(gate: GateDefinition, value: number): GateStatus {
  if (gate.direction === 'min') {
    if (value >= gate.target) return 'green';
    return gate.rethink === null || value < gate.rethink ? 'red' : 'amber';
  }
  if (value < gate.target) return 'green';
  return gate.rethink === null || value > gate.rethink ? 'red' : 'amber';
}

export function evaluateGates(counts: GateCounts): GateResult[] {
  return SUCCESS_GATES.map((gate) => {
    const numerator = gate.numerator(counts);
    const sample = gate.denominator(counts);
    const base = { id: gate.id, label: gate.label, direction: gate.direction, target: gate.target, rethink: gate.rethink, numerator, sample };
    if (sample < MIN_GATE_SAMPLE) return { ...base, value: null, status: 'no-data' as const };
    const value = numerator / sample;
    return { ...base, value, status: statusOf(gate, value) };
  });
}
