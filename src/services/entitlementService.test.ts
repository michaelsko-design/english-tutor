import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestore = vi.hoisted(() => ({
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
}));
vi.mock('firebase/firestore', () => ({ doc: firestore.doc, getDoc: firestore.getDoc, onSnapshot: firestore.onSnapshot }));
vi.mock('./firebase', () => ({ db: {} }));

import { readCachedEntitlement, readEntitlementOnce, watchEntitlement } from './entitlementService';

const ENTITLEMENT = { plan: 'pro', status: 'active', source: 'comp', billingPeriod: null, periodEnd: 4102444800000, updatedAt: 1 };

describe('readEntitlementOnce', () => {
  beforeEach(() => firestore.getDoc.mockReset());

  it("reads the learner's entitlement", async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ENTITLEMENT });
    expect(await readEntitlementOnce('kid1')).toMatchObject({ status: 'active', source: 'comp' });
    expect(firestore.doc).toHaveBeenCalledWith({}, 'entitlements', 'kid1');
  });

  it('gives null when there is none or the read fails', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false, data: () => undefined });
    expect(await readEntitlementOnce('kid1')).toBeNull();
    firestore.getDoc.mockRejectedValueOnce(new Error('offline'));
    expect(await readEntitlementOnce('kid1')).toBeNull();
  });
});

/** The node test runner has no localStorage: a small in-memory one stands in. */
function memoryStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => void items.delete(key),
    setItem: (key, value) => void items.set(key, String(value)),
  };
}

/** Delivers one snapshot to the listener the last `watchEntitlement` call registered. */
function deliver(data: unknown): void {
  const onNext = firestore.onSnapshot.mock.calls[firestore.onSnapshot.mock.calls.length - 1]?.[1] as (snapshot: unknown) => void;
  onNext({ exists: () => data !== undefined, data: () => data });
}

describe('watchEntitlement', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage());
    firestore.onSnapshot.mockReset().mockReturnValue(() => undefined);
  });

  it("follows the learner's own entitlement and keeps it on the device", () => {
    const onChange = vi.fn();
    watchEntitlement('kid1', onChange, vi.fn());
    expect(firestore.onSnapshot.mock.calls[0][0]).toEqual({ path: 'entitlements/kid1' });

    deliver(ENTITLEMENT);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }));
    expect(readCachedEntitlement('kid1')).toMatchObject({ status: 'active' });
  });

  it('treats a missing document as free and forgets the cached plan', () => {
    localStorage.setItem('english_tutor_entitlement_kid1', JSON.stringify(ENTITLEMENT));
    const onChange = vi.fn();
    watchEntitlement('kid1', onChange, vi.fn());

    deliver(undefined);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(readCachedEntitlement('kid1')).toBeNull();
  });

  it('keeps nothing on the device for the parent portal', () => {
    watchEntitlement('kid1', vi.fn(), vi.fn(), { shouldCache: false });
    deliver(ENTITLEMENT);
    expect(readCachedEntitlement('kid1')).toBeNull();
  });

  it('ignores a cached value that is broken or not an entitlement, and keeps accounts apart', () => {
    localStorage.setItem('english_tutor_entitlement_kid1', '{not json');
    expect(readCachedEntitlement('kid1')).toBeNull();
    localStorage.setItem('english_tutor_entitlement_kid1', JSON.stringify({ plan: 'pro', status: 'forever' }));
    expect(readCachedEntitlement('kid1')).toBeNull();
    localStorage.setItem('english_tutor_entitlement_kid1', JSON.stringify(ENTITLEMENT));
    expect(readCachedEntitlement('kid2')).toBeNull();
  });
});
