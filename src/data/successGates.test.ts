import { describe, expect, it } from 'vitest';
import { MIN_GATE_SAMPLE, evaluateGates, type GateCounts, type GateId } from './successGates';

const EMPTY: GateCounts = {
  signedUp: 0,
  activated: 0,
  activatedMature: 0,
  wallInWindow: 0,
  reachedWall: 0,
  askSent: 0,
  paidAfterAsk: 0,
  paidActivated: 0,
  cancelBase: 0,
  cancelledRecently: 0,
};

const gate = (counts: Partial<GateCounts>, id: GateId) => {
  const result = evaluateGates({ ...EMPTY, ...counts }).find((g) => g.id === id);
  if (!result) throw new Error(`no gate ${id}`);
  return result;
};

describe('evaluateGates', () => {
  it('returns the six gates in order', () => {
    expect(evaluateGates(EMPTY).map((g) => g.id)).toEqual(['activation', 'wall', 'ask', 'askToPaid', 'activatedToPaid', 'monthlyCancel']);
  });

  it('shows no data while the sample is under the minimum', () => {
    const result = gate({ signedUp: MIN_GATE_SAMPLE - 1, activated: 10 }, 'activation');
    expect(result).toMatchObject({ status: 'no-data', value: null, sample: MIN_GATE_SAMPLE - 1 });
  });

  it('is green at the target, amber between the lines and red under the rethink line', () => {
    expect(gate({ signedUp: 100, activated: 30 }, 'activation').status).toBe('green');
    expect(gate({ signedUp: 100, activated: 25 }, 'activation').status).toBe('amber');
    expect(gate({ signedUp: 100, activated: 20 }, 'activation').status).toBe('amber');
    expect(gate({ signedUp: 100, activated: 19 }, 'activation').status).toBe('red');
  });

  it('a gate with no rethink line is red under its target', () => {
    expect(gate({ activatedMature: 50, wallInWindow: 20 }, 'wall').status).toBe('green');
    expect(gate({ activatedMature: 50, wallInWindow: 19 }, 'wall').status).toBe('red');
    expect(gate({ reachedWall: 100, askSent: 34 }, 'ask').status).toBe('red');
  });

  it('judges the paid gates on their own bases', () => {
    expect(gate({ askSent: 100, paidAfterAsk: 8 }, 'askToPaid')).toMatchObject({ status: 'green', value: 0.08 });
    expect(gate({ askSent: 100, paidAfterAsk: 3 }, 'askToPaid').status).toBe('red');
    expect(gate({ activated: 200, paidActivated: 3 }, 'activatedToPaid').status).toBe('amber');
  });

  it('the cancel rate is good when low', () => {
    expect(gate({ cancelBase: 100, cancelledRecently: 14 }, 'monthlyCancel').status).toBe('green');
    expect(gate({ cancelBase: 100, cancelledRecently: 20 }, 'monthlyCancel').status).toBe('amber');
    expect(gate({ cancelBase: 100, cancelledRecently: 26 }, 'monthlyCancel').status).toBe('red');
  });
});
