import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestore = vi.hoisted(() => ({
  deleteDoc: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  commit: vi.fn(),
  batchSet: vi.fn(),
  batchDelete: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  deleteDoc: firestore.deleteDoc,
  doc: firestore.doc,
  getDoc: firestore.getDoc,
  setDoc: firestore.setDoc,
  writeBatch: () => ({ set: firestore.batchSet, delete: firestore.batchDelete, commit: firestore.commit }),
}));
vi.mock('./firebase', () => ({ db: {} }));

import { PARENT_CODE_DAYS } from '../data/parentLink';
import { claimParentCode, createParentInvite, previewParentCode } from './parentService';

const NOW = new Date('2026-03-04T10:00:00.000Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const CODE = 'ABCD2345';

function inviteSnapshot(overrides: Record<string, unknown> = {}) {
  return {
    exists: () => true,
    data: () => ({
      childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', expiresAtMs: NOW.getTime() + DAY_MS, ...overrides,
    }),
  };
}

beforeEach(() => {
  Object.values(firestore).forEach((fn) => fn.mockClear());
  firestore.deleteDoc.mockResolvedValue(undefined);
  firestore.setDoc.mockResolvedValue(undefined);
  firestore.commit.mockResolvedValue(undefined);
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  });
});

describe('claimParentCode', () => {
  it('rejects a malformed code without reading anything', async () => {
    const result = await claimParentCode('parent-1', 'nope', NOW);

    expect(result.ok).toBe(false);
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('rejects a missing or expired code', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    expect((await claimParentCode('parent-1', CODE, NOW)).ok).toBe(false);

    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot({ expiresAtMs: NOW.getTime() - 1 }));
    expect((await claimParentCode('parent-1', CODE, NOW)).ok).toBe(false);
    expect(firestore.commit).not.toHaveBeenCalled();
  });

  it('does not let an account claim its own code', async () => {
    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot({ childUid: 'parent-1' }));

    expect((await claimParentCode('parent-1', CODE, NOW)).ok).toBe(false);
    expect(firestore.commit).not.toHaveBeenCalled();
  });

  it('creates the link and deletes the code in one batch, accepting a pasted code', async () => {
    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot());

    const result = await claimParentCode('parent-1', ' abcd-2345 ', NOW);

    expect(result).toMatchObject({ ok: true, value: { parentUid: 'parent-1', childUid: 'child-1', inviteCode: CODE } });
    expect(firestore.batchSet).toHaveBeenCalledWith(
      { path: 'parentLinks/parent-1_child-1' },
      expect.objectContaining({ childName: 'נועה', linkedAt: NOW.toISOString() })
    );
    expect(firestore.batchDelete).toHaveBeenCalledWith({ path: `parentInvites/${CODE}` });
    expect(firestore.commit).toHaveBeenCalledTimes(1);
  });

  it('turns a failed write into a Hebrew error', async () => {
    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot());
    firestore.commit.mockRejectedValue({ code: 'unavailable' });

    const result = await claimParentCode('parent-1', CODE, NOW);

    expect(result).toEqual({ ok: false, errorHe: 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.' });
  });
});

describe('previewParentCode', () => {
  it('returns the learner the code belongs to', async () => {
    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot());

    expect(await previewParentCode(CODE, NOW)).toMatchObject({ ok: true, value: { childName: 'נועה' } });
  });
});

describe('createParentInvite', () => {
  it('writes an invite that lasts a week', async () => {
    const result = await createParentInvite('child-1', 'נועה', '🐱', NOW);

    expect(result.ok).toBe(true);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: expect.stringMatching(/^parentInvites\/[A-Z2-9]{8}$/) }),
      { childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', expiresAtMs: NOW.getTime() + PARENT_CODE_DAYS * DAY_MS }
    );
  });

  it('tries another code when one is already taken', async () => {
    firestore.setDoc.mockRejectedValueOnce({ code: 'permission-denied' }).mockResolvedValue(undefined);

    const result = await createParentInvite('child-1', 'נועה', '🐱', NOW);

    expect(result.ok).toBe(true);
    expect(firestore.setDoc).toHaveBeenCalledTimes(2);
  });

  it('deletes the previous code when it makes a new one', async () => {
    const first = await createParentInvite('child-1', 'נועה', '🐱', NOW);
    const second = await createParentInvite('child-1', 'נועה', '🐱', NOW);

    expect(first.ok && second.ok).toBe(true);
    if (first.ok) {
      expect(firestore.deleteDoc).toHaveBeenCalledWith({ path: `parentInvites/${first.value.code}` });
    }
  });

  it('shortens a long name to what the rules accept', async () => {
    await createParentInvite('child-1', 'א'.repeat(60), '🐱', NOW);

    expect(firestore.setDoc.mock.calls[0][1]).toMatchObject({ childName: 'א'.repeat(24) });
  });
});
