import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  HOLD_TIMEOUT_MS,
  MAX_GEMS,
  SAFETY_RELEASE_MS,
  finishFlight,
  getDiamondFlightState,
  getGemPlan,
  holdDiamonds,
  landGem,
  launchDiamondFlight,
  releaseHeldDiamonds,
  resetDiamondFlights,
  subscribeDiamondFlights,
} from './diamondFlight';

const sumValues = (amount: number) => getGemPlan(amount).reduce((sum, gem) => sum + gem.value, 0);

describe('getGemPlan', () => {
  it('splits the amount into gems that add up to it', () => {
    expect(sumValues(7)).toBe(7);
    expect(sumValues(25)).toBe(25);
    expect(sumValues(101)).toBe(101);
  });

  it('shows one gem per diamond up to the cap', () => {
    expect(getGemPlan(5)).toHaveLength(5);
    expect(getGemPlan(40)).toHaveLength(MAX_GEMS);
  });

  it('plans nothing for zero or a negative amount', () => {
    expect(getGemPlan(0)).toEqual([]);
    expect(getGemPlan(-3)).toEqual([]);
  });

  it('staggers the gems one after another', () => {
    const delays = getGemPlan(4).map((gem) => gem.delayMs);
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(new Set(delays).size).toBe(4);
  });
});

describe('diamond flights', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetDiamondFlights();
  });
  afterEach(() => {
    resetDiamondFlights();
    vi.useRealTimers();
  });

  it('launches nothing for a reward without diamonds', () => {
    expect(launchDiamondFlight(0, { x: 1, y: 1 })).toBeNull();
    expect(getDiamondFlightState().flights).toEqual([]);
  });

  it('keeps the launched diamonds pending until they land', () => {
    const id = launchDiamondFlight(10, { x: 50, y: 60 });
    expect(id).not.toBeNull();
    expect(getDiamondFlightState().pendingAmount).toBe(10);
    expect(getDiamondFlightState().flights[0]).toMatchObject({ status: 'flying', from: { x: 50, y: 60 } });

    landGem(id!, 4);
    expect(getDiamondFlightState().pendingAmount).toBe(6);
    landGem(id!, 6);
    expect(getDiamondFlightState().pendingAmount).toBe(0);
  });

  it('shows whatever has not landed when the flight finishes', () => {
    const id = launchDiamondFlight(8, null);
    landGem(id!, 3);
    finishFlight(id!);
    expect(getDiamondFlightState()).toEqual({ flights: [], pendingAmount: 0 });
  });

  it('holds diamonds until the reward screen releases them', () => {
    holdDiamonds(5);
    expect(getDiamondFlightState().flights[0].status).toBe('held');
    expect(getDiamondFlightState().pendingAmount).toBe(5);

    releaseHeldDiamonds({ x: 10, y: 20 });
    expect(getDiamondFlightState().flights[0]).toMatchObject({ status: 'flying', from: { x: 10, y: 20 } });
  });

  it('flies a held flight from the center when nothing releases it', () => {
    holdDiamonds(5);
    vi.advanceTimersByTime(HOLD_TIMEOUT_MS);
    expect(getDiamondFlightState().flights[0]).toMatchObject({ status: 'flying', from: null });
  });

  it('ends a flight that never lands, so the HUD catches up', () => {
    launchDiamondFlight(5, null);
    vi.advanceTimersByTime(SAFETY_RELEASE_MS);
    expect(getDiamondFlightState().pendingAmount).toBe(0);
  });

  it('never lands more than the flight carries', () => {
    const id = launchDiamondFlight(3, null);
    landGem(id!, 10);
    expect(getDiamondFlightState().pendingAmount).toBe(0);
  });

  it('notifies subscribers on every change', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeDiamondFlights(listener);
    const id = launchDiamondFlight(2, null);
    finishFlight(id!);
    unsubscribe();
    launchDiamondFlight(2, null);
    // hold + start + finish
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
