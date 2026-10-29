import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Entitlement } from '../data/proGate';
import { useEntitlement, useLearnerProAccess } from './useProAccess';

const { readCachedEntitlement, watchEntitlement } = vi.hoisted(() => ({
  readCachedEntitlement: vi.fn(),
  watchEntitlement: vi.fn(),
}));
vi.mock('../services/entitlementService', () => ({ readCachedEntitlement, watchEntitlement }));

const DAY_MS = 24 * 60 * 60 * 1000;
const unsubscribe = vi.fn();

function entitlement(overrides: Partial<Entitlement> = {}): Entitlement {
  return {
    plan: 'pro',
    status: 'active',
    source: 'subscription',
    periodEnd: Date.now() + 30 * DAY_MS,
    billingPeriod: 'monthly',
    ...overrides,
  };
}

/** Pushes a live value through the listener the hook registered last. */
function emitLive(value: Entitlement | null): void {
  const onChange = watchEntitlement.mock.calls[watchEntitlement.mock.calls.length - 1]?.[1] as (e: Entitlement | null) => void;
  act(() => onChange(value));
}

beforeEach(() => {
  readCachedEntitlement.mockReturnValue(null);
  watchEntitlement.mockReturnValue(unsubscribe);
});

describe('useEntitlement', () => {
  it('reads nothing while gating is off', () => {
    const { result } = renderHook(() => useEntitlement('kid', false));
    expect(result.current).toBeNull();
    expect(watchEntitlement).not.toHaveBeenCalled();
    expect(readCachedEntitlement).not.toHaveBeenCalled();
  });

  it('reads nothing without a signed-in learner', () => {
    const { result } = renderHook(() => useEntitlement(undefined, true));
    expect(result.current).toBeNull();
    expect(watchEntitlement).not.toHaveBeenCalled();
  });

  it('shows the cached value first, then the live one', () => {
    const cached = entitlement({ periodEnd: 1 });
    readCachedEntitlement.mockReturnValue(cached);
    const { result } = renderHook(() => useEntitlement('kid', true));
    expect(result.current).toBe(cached);

    const live = entitlement();
    emitLive(live);
    expect(result.current).toBe(live);
  });

  it('never shows one learner the entitlement of the account before', () => {
    const { result, rerender } = renderHook(({ uid }) => useEntitlement(uid, true), { initialProps: { uid: 'paying-kid' } });
    emitLive(entitlement());

    rerender({ uid: 'other-kid' });
    expect(result.current).toBeNull();
    expect(readCachedEntitlement).toHaveBeenLastCalledWith('other-kid');
    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('useLearnerProAccess', () => {
  it('opens everything while gating is off', () => {
    const { result } = renderHook(() => useLearnerProAccess('kid', false));
    expect(result.current).toEqual({ isPro: false, isGatingOn: false });
  });

  it('is not Pro while the live value is still loading and nothing is cached', () => {
    const { result } = renderHook(() => useLearnerProAccess('kid', true));
    expect(result.current).toEqual({ isPro: false, isGatingOn: true });
  });

  it('is Pro for an active plan and drops it when the plan expires', () => {
    const { result } = renderHook(() => useLearnerProAccess('kid', true));
    emitLive(entitlement());
    expect(result.current.isPro).toBe(true);

    emitLive(entitlement({ status: 'expired' }));
    expect(result.current.isPro).toBe(false);
  });

  it('is not Pro once the period and its grace days are over', () => {
    const { result } = renderHook(() => useLearnerProAccess('kid', true));
    emitLive(entitlement({ periodEnd: Date.now() - 365 * DAY_MS }));
    expect(result.current.isPro).toBe(false);
  });
});
