import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestore = vi.hoisted(() => ({
  getDoc: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
}));
vi.mock('firebase/firestore', () => ({ doc: firestore.doc, getDoc: firestore.getDoc, onSnapshot: vi.fn() }));
vi.mock('./firebase', () => ({ db: {} }));

import { readEntitlementOnce } from './entitlementService';

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
