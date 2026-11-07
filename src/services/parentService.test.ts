import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestore = vi.hoisted(() => ({
  deleteDoc: vi.fn<(...args: unknown[]) => unknown>(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
  getDoc: vi.fn<(...args: unknown[]) => unknown>(),
  getDocs: vi.fn<(...args: unknown[]) => unknown>(),
  setDoc: vi.fn<(...args: unknown[]) => unknown>(),
  commit: vi.fn(),
  batchSet: vi.fn(),
  batchDelete: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: firestore.getDocs,
  query: vi.fn(),
  where: vi.fn(),
  deleteDoc: firestore.deleteDoc,
  doc: firestore.doc,
  getDoc: firestore.getDoc,
  setDoc: firestore.setDoc,
  writeBatch: () => ({ set: firestore.batchSet, delete: firestore.batchDelete, commit: firestore.commit }),
}));
const firebase = vi.hoisted(() => ({
  db: {} as object | null,
  auth: { currentUser: { getIdToken: async () => 'id-token' } as { getIdToken: () => Promise<string> } | null },
  getAppCheckToken: vi.fn(async () => 'ac-token' as string | null),
}));
vi.mock('./firebase', () => ({
  get db() {
    return firebase.db;
  },
  auth: firebase.auth,
  getAppCheckToken: firebase.getAppCheckToken,
}));

import { PARENT_CODE_DAYS } from '../data/parentLink';
import {
  claimParentCode,
  createParentInvite,
  deleteLearnerParentData,
  deleteParentAccountData,
  getActiveParentInvite,
  hasLearnerProfile,
  isParentAccount,
  listChildrenOfParent,
  listParentsOfChild,
  loadReportSnapshot,
  markParentAccount,
  previewParentCode,
  publishReportSnapshot,
  resetChildPin,
  unlinkParent,
  withdrawParentInvite,
} from './parentService';

const NOW = new Date('2026-03-04T10:00:00.000Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const CODE = 'ABCD2345';

interface FakeSnapshot {
  exists: () => boolean;
  data?: () => unknown;
}

function inviteSnapshot(overrides: Record<string, unknown> = {}): FakeSnapshot {
  return {
    exists: () => true,
    data: () => ({
      childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', expiresAtMs: NOW.getTime() + DAY_MS, ...overrides,
    }),
  };
}

beforeEach(() => {
  firebase.db = {};
  Object.values(firestore).forEach((fn) => fn.mockClear());
  firestore.getDoc.mockReset();
  firestore.getDocs.mockReset();
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

  it('logs, and still succeeds, when the previous code cannot be deleted', async () => {
    const warned = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await createParentInvite('child-1', 'נועה', '🐱', NOW);
    firestore.deleteDoc.mockRejectedValueOnce({ code: 'unavailable' });

    const second = await createParentInvite('child-1', 'נועה', '🐱', NOW);

    expect(second.ok).toBe(true);
    expect(warned).toHaveBeenCalledWith(expect.stringContaining('invite'), expect.anything());
    warned.mockRestore();
  });

  it('shortens a long name to what the rules accept', async () => {
    await createParentInvite('child-1', 'א'.repeat(60), '🐱', NOW);

    expect(firestore.setDoc.mock.calls[0][1]).toMatchObject({ childName: 'א'.repeat(24) });
  });
});

describe('resetChildPin', () => {
  const okResponse = (status = 200) => vi.fn(async () => new Response('{}', { status }));

  it('sends the PIN with the parent token and the App Check token', async () => {
    const fetchMock = okResponse();
    vi.stubGlobal('fetch', fetchMock);

    const result = await resetChildPin('child-1', ' 246810 ');

    expect(result.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/parent-reset-pin');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ 'X-Firebase-Token': 'id-token', 'X-Firebase-AppCheck': 'ac-token' });
    expect(JSON.parse(init.body as string)).toEqual({ childUid: 'child-1', newPin: '246810' });
  });

  it('does not call the server for a short PIN or without a signed-in parent', async () => {
    const fetchMock = okResponse();
    vi.stubGlobal('fetch', fetchMock);

    expect((await resetChildPin('child-1', '12345')).ok).toBe(false);
    firebase.auth.currentUser = null;
    expect((await resetChildPin('child-1', '246810')).ok).toBe(false);
    firebase.auth.currentUser = { getIdToken: async () => 'id-token' };
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('explains the server refusals in Hebrew', async () => {
    vi.stubGlobal('fetch', okResponse(409));
    expect(await resetChildPin('child-1', '246810')).toEqual({ ok: false, errorHe: expect.stringContaining('Google') });

    vi.stubGlobal('fetch', okResponse(403));
    expect(await resetChildPin('child-1', '246810')).toEqual({ ok: false, errorHe: expect.stringContaining('הרשאה') });

    vi.stubGlobal('fetch', okResponse(500));
    expect((await resetChildPin('child-1', '246810')).ok).toBe(false);
  });

  it('reports no connection when the request cannot be sent', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));

    expect(await resetChildPin('child-1', '246810')).toEqual({ ok: false, errorHe: expect.stringContaining('אין חיבור') });
  });

  it.each([
    [401, 'להתחבר מחדש'],
    [404, 'לא מצאנו'],
    [503, 'עדיין לא זמינה'],
  ])('explains a %s answer from the server', async (status, fragment) => {
    vi.stubGlobal('fetch', okResponse(status));

    expect(await resetChildPin('child-1', '246810')).toEqual({ ok: false, errorHe: expect.stringContaining(fragment) });
  });

  it('sends no App Check header when there is no App Check token', async () => {
    firebase.getAppCheckToken.mockResolvedValueOnce(null);
    const fetchMock = okResponse();
    vi.stubGlobal('fetch', fetchMock);

    await resetChildPin('child-1', '246810');

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.headers).not.toHaveProperty('X-Firebase-AppCheck');
  });
});

const ACTIVE_CODE_KEY = 'english_tutor_parent_code_child-1';
const link = (parentUid: string, linkedAt: string) => ({
  parentUid, childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', inviteCode: CODE, linkedAt,
});
const linkDocs = (...links: ReturnType<typeof link>[]) => ({ docs: links.map((l) => ({ data: () => l })) });

describe('getActiveParentInvite', () => {
  it('returns null without reading anything when no code was made on this device', async () => {
    expect(await getActiveParentInvite('child-1', NOW)).toBeNull();
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('returns the stored code while it is still valid', async () => {
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot());

    expect(await getActiveParentInvite('child-1', NOW)).toMatchObject({ code: CODE, invite: { childUid: 'child-1' } });
  });

  it.each([
    ['expired', inviteSnapshot({ expiresAtMs: NOW.getTime() - 1 })],
    ['made for another learner', inviteSnapshot({ childUid: 'child-2' })],
    ['already claimed', { exists: () => false } as FakeSnapshot],
  ])('returns null when the stored code is %s', async (_label, snapshot) => {
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.getDoc.mockResolvedValueOnce(snapshot);

    expect(await getActiveParentInvite('child-1', NOW)).toBeNull();
  });

  it('returns null offline, and without a database', async () => {
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.getDoc.mockRejectedValueOnce({ code: 'unavailable' });
    expect(await getActiveParentInvite('child-1', NOW)).toBeNull();

    firebase.db = null;
    expect(await getActiveParentInvite('child-1', NOW)).toBeNull();
  });
});

describe('createParentInvite failures', () => {
  it('fails in Hebrew without a database', async () => {
    firebase.db = null;

    expect((await createParentInvite('child-1', 'נועה', '🐱', NOW)).ok).toBe(false);
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('gives up when every code it tries is refused', async () => {
    firestore.setDoc.mockRejectedValue({ code: 'permission-denied' });

    const result = await createParentInvite('child-1', 'נועה', '🐱', NOW);

    expect(result.ok).toBe(false);
    expect(firestore.setDoc).toHaveBeenCalledTimes(3);
    expect(localStorage.getItem(ACTIVE_CODE_KEY)).toBeNull();
  });

  it('reports no connection when the write cannot reach the server', async () => {
    firestore.setDoc.mockRejectedValue({ code: 'unavailable' });

    expect(await createParentInvite('child-1', 'נועה', '🐱', NOW)).toEqual({
      ok: false,
      errorHe: 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.',
    });
  });

  it('remembers the new code on this device and falls back to a generic name', async () => {
    const result = await createParentInvite('child-1', '   ', '🐱', NOW);

    expect(result.ok && localStorage.getItem(ACTIVE_CODE_KEY)).toBe(result.ok ? result.value.code : null);
    expect(firestore.setDoc.mock.calls[0][1]).toMatchObject({ childName: 'לומד/ת' });
  });
});

describe('withdrawParentInvite', () => {
  it('deletes the stored code and forgets it', async () => {
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);

    await withdrawParentInvite('child-1');

    expect(firestore.deleteDoc).toHaveBeenCalledWith({ path: `parentInvites/${CODE}` });
    expect(localStorage.getItem(ACTIVE_CODE_KEY)).toBeNull();
  });

  it('does nothing when there is no code, and survives a failed delete', async () => {
    await withdrawParentInvite('child-1');
    expect(firestore.deleteDoc).not.toHaveBeenCalled();

    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.deleteDoc.mockRejectedValueOnce({ code: 'unavailable' });
    await expect(withdrawParentInvite('child-1')).resolves.toBeUndefined();
  });

  it('logs a failed delete of the code, which still expires on its own', async () => {
    const warned = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.deleteDoc.mockRejectedValueOnce({ code: 'unavailable' });

    await withdrawParentInvite('child-1');

    expect(warned).toHaveBeenCalledWith(expect.stringContaining('invite'), expect.anything());
    warned.mockRestore();
  });
});

describe('listing links', () => {
  it('lists the parents of a learner, oldest link first', async () => {
    firestore.getDocs.mockResolvedValueOnce(linkDocs(link('p2', '2026-03-02'), link('p1', '2026-03-01')));

    const links = await listParentsOfChild('child-1');

    expect(links.map((l) => l.parentUid)).toEqual(['p1', 'p2']);
  });

  it('lists the children of a parent', async () => {
    firestore.getDocs.mockResolvedValueOnce(linkDocs(link('p1', '2026-03-01')));

    expect(await listChildrenOfParent('p1')).toHaveLength(1);
  });

  it('returns an empty list without a database', async () => {
    firebase.db = null;

    expect(await listParentsOfChild('child-1')).toEqual([]);
    expect(firestore.getDocs).not.toHaveBeenCalled();
  });
});

describe('unlinkParent', () => {
  const pair = { parentUid: 'parent-1', childUid: 'child-1' };

  it('deletes the link document', async () => {
    expect(await unlinkParent(pair)).toEqual({ ok: true, value: undefined });
    expect(firestore.deleteDoc).toHaveBeenCalledWith({ path: 'parentLinks/parent-1_child-1' });
  });

  it('turns a failed delete into a Hebrew error', async () => {
    firestore.deleteDoc.mockRejectedValueOnce({ code: 'unavailable' });

    expect(await unlinkParent(pair)).toEqual({ ok: false, errorHe: expect.stringContaining('אין חיבור') });
  });

  it('fails without a database', async () => {
    firebase.db = null;

    expect((await unlinkParent(pair)).ok).toBe(false);
  });
});

describe('parent account marker', () => {
  it('marks a new parent account once', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    await markParentAccount('parent-1', NOW);
    expect(firestore.setDoc).toHaveBeenCalledWith({ path: 'parents/parent-1' }, { createdAt: NOW.toISOString() });

    firestore.setDoc.mockClear();
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true });
    await markParentAccount('parent-1', NOW);
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('answers whether an account is a parent and whether it has a learner profile', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => true }).mockResolvedValueOnce({ exists: () => false });

    expect(await isParentAccount('parent-1')).toBe(true);
    expect(await hasLearnerProfile('parent-1')).toBe(false);
  });

  it('treats a refused learner read (account not allowed while access is closed) as no learner profile', async () => {
    firestore.getDoc.mockRejectedValueOnce(Object.assign(new Error('denied'), { code: 'permission-denied' }));
    expect(await hasLearnerProfile('parent-1')).toBe(false);

    firestore.getDoc.mockRejectedValueOnce(Object.assign(new Error('offline'), { code: 'unavailable' }));
    await expect(hasLearnerProfile('parent-1')).rejects.toThrow('offline');
  });

  it('is inert without a database', async () => {
    firebase.db = null;

    await markParentAccount('parent-1', NOW);
    expect(await isParentAccount('parent-1')).toBe(false);
    expect(await hasLearnerProfile('parent-1')).toBe(false);
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});

describe('report snapshot', () => {
  const snapshot = { name: 'נועה' } as never;

  it('publishes and loads the snapshot', async () => {
    await publishReportSnapshot('child-1', snapshot);
    expect(firestore.setDoc).toHaveBeenCalledWith({ path: 'reportSnapshots/child-1' }, snapshot);

    firestore.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => snapshot });
    expect(await loadReportSnapshot('child-1')).toBe(snapshot);
  });

  it('loads null when there is none, and does nothing without a database', async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    expect(await loadReportSnapshot('child-1')).toBeNull();

    firebase.db = null;
    await publishReportSnapshot('child-1', snapshot);
    expect(await loadReportSnapshot('child-1')).toBeNull();
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});

describe('data deletion', () => {
  it('removes everything a learner has for parents', async () => {
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.getDocs.mockResolvedValueOnce(linkDocs(link('p1', '2026-03-01'), link('p2', '2026-03-02')));

    await deleteLearnerParentData('child-1');

    const deleted = firestore.deleteDoc.mock.calls.map(([ref]) => (ref as { path: string }).path);
    expect(deleted).toEqual(expect.arrayContaining([
      'parentLinks/p1_child-1', 'parentLinks/p2_child-1', `parentInvites/${CODE}`, 'reportSnapshots/child-1',
    ]));
    expect(localStorage.getItem(ACTIVE_CODE_KEY)).toBeNull();
  });

  it('logs a failed delete of the invite code and carries on deleting', async () => {
    const warned = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(ACTIVE_CODE_KEY, CODE);
    firestore.getDocs.mockResolvedValueOnce(linkDocs());
    firestore.deleteDoc.mockRejectedValueOnce({ code: 'unavailable' });

    await deleteLearnerParentData('child-1');

    expect(warned).toHaveBeenCalledWith(expect.stringContaining('invite'), expect.anything());
    expect(firestore.deleteDoc).toHaveBeenCalledWith({ path: 'reportSnapshots/child-1' });
    warned.mockRestore();
  });

  it('still removes the snapshot when the learner has no links or code', async () => {
    firestore.getDocs.mockResolvedValueOnce(linkDocs());

    await deleteLearnerParentData('child-1');

    expect(firestore.deleteDoc).toHaveBeenCalledTimes(1);
    expect(firestore.deleteDoc).toHaveBeenCalledWith({ path: 'reportSnapshots/child-1' });
  });

  it('removes a parent account\'s links and marker', async () => {
    firestore.getDocs.mockResolvedValueOnce(linkDocs(link('p1', '2026-03-01')));

    await deleteParentAccountData('p1');

    const deleted = firestore.deleteDoc.mock.calls.map(([ref]) => (ref as { path: string }).path);
    expect(deleted).toEqual(['parentLinks/p1_child-1', 'parents/p1']);
  });

  it('does nothing without a database', async () => {
    firebase.db = null;

    await deleteLearnerParentData('child-1');
    await deleteParentAccountData('p1');

    expect(firestore.deleteDoc).not.toHaveBeenCalled();
  });
});

describe('code preview and claim edge cases', () => {
  it.each([
    ['is malformed', 'nope', undefined],
    ['is missing', CODE, { exists: () => false } as FakeSnapshot],
    ['has expired', CODE, inviteSnapshot({ expiresAtMs: NOW.getTime() - 1 })],
  ])('refuses a preview when the code %s', async (_label, code, snapshot) => {
    if (snapshot) firestore.getDoc.mockResolvedValueOnce(snapshot);

    expect((await previewParentCode(code, NOW)).ok).toBe(false);
  });

  it('turns a failed preview read into a Hebrew error', async () => {
    firestore.getDoc.mockRejectedValueOnce({ code: 'unavailable' });

    expect(await previewParentCode(CODE, NOW)).toEqual({ ok: false, errorHe: expect.stringContaining('אין חיבור') });
  });

  it('refuses a preview and a claim without a database', async () => {
    firebase.db = null;

    expect((await previewParentCode(CODE, NOW)).ok).toBe(false);
    expect((await claimParentCode('parent-1', CODE, NOW)).ok).toBe(false);
  });

  it('keeps the parent label on the link when one is given', async () => {
    firestore.getDoc.mockResolvedValueOnce(inviteSnapshot());

    const result = await claimParentCode('parent-1', CODE, NOW, 'p***@example.com');

    expect(result).toMatchObject({ ok: true, value: { parentLabel: 'p***@example.com' } });
  });
});
