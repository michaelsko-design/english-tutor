import React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiamondFlightLayer } from './DiamondFlightLayer';
import { getDiamondFlightState, launchDiamondFlight, resetDiamondFlights } from '../../services/diamondFlight';
import { useShownDiamonds } from '../../hooks/useDiamondFlight';

let isReducedMotion = false;
vi.mock('../../hooks/usePrefersReducedMotion', () => ({ usePrefersReducedMotion: () => isReducedMotion }));

const ShownBalance: React.FC<{ balance: number }> = ({ balance }) => (
  <span data-testid="shown">{useShownDiamonds(balance)}</span>
);

describe('DiamondFlightLayer', () => {
  let now = 0;
  let frames: FrameRequestCallback[] = [];

  const runFrames = (untilMs: number, stepMs = 50) => {
    while (now < untilMs) {
      now += stepMs;
      const due = frames;
      frames = [];
      act(() => due.forEach((frame) => frame(now)));
    }
  };

  beforeEach(() => {
    resetDiamondFlights();
    isReducedMotion = false;
    now = 0;
    frames = [];
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frames.push(cb);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
  });

  afterEach(() => {
    act(() => resetDiamondFlights());
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('flies the gems and lets the counter reach the full balance', () => {
    const { getByTestId } = render(
      <>
        <button type="button" data-diamond-target>
          gems
        </button>
        <ShownBalance balance={130} />
        <DiamondFlightLayer />
      </>
    );
    act(() => {
      launchDiamondFlight(30, { x: 100, y: 400 });
    });
    expect(getByTestId('shown').textContent).toBe('100');
    expect(document.querySelectorAll('[aria-hidden="true"] img').length).toBeGreaterThan(0);

    runFrames(3000);
    expect(getDiamondFlightState().pendingAmount).toBe(0);
    expect(getByTestId('shown').textContent).toBe('130');
  });

  it('counts some gems before the last one lands', () => {
    const { getByTestId } = render(
      <>
        <ShownBalance balance={20} />
        <DiamondFlightLayer />
      </>
    );
    act(() => {
      launchDiamondFlight(12, null);
    });
    runFrames(1100);
    const shown = Number(getByTestId('shown').textContent);
    expect(shown).toBeGreaterThan(8);
    expect(shown).toBeLessThan(20);
  });

  it('skips the flight with reduced motion', () => {
    isReducedMotion = true;
    const { getByTestId } = render(
      <>
        <ShownBalance balance={50} />
        <DiamondFlightLayer />
      </>
    );
    act(() => {
      launchDiamondFlight(10, { x: 0, y: 0 });
    });
    expect(getDiamondFlightState().pendingAmount).toBe(0);
    expect(getByTestId('shown').textContent).toBe('50');
  });
});
