import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  auth: { currentUser: null as unknown },
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  deleteUser: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
  deleteLearnerParentData: vi.fn(),
  deleteAllStickerImages: vi.fn(),
}));

vi.mock('./firebase', () => ({ auth: mocks.auth, db: {}, googleProvider: {} }));
vi.mock('./parentService', () => ({ deleteLearnerParentData: mocks.deleteLearnerParentData }));
vi.mock('./stickerImages', () => ({ deleteAllStickerImages: mocks.deleteAllStickerImages, loadAllStickerImages: vi.fn() }));
vi.mock('./entitlementService', () => ({ readEntitlementOnce: vi.fn() }));
vi.mock('firebase/firestore', () => ({
  collection: (_db: unknown, name: string) => name,
  doc: (_db: unknown, ...path: string[]) => ({ path: path.join('/') }),
  query: (name: string) => name,
  where: vi.fn(),
  deleteDoc: mocks.deleteDoc,
  getDoc: mocks.getDoc,
  getDocs: mocks.getDocs,
}));
vi.mock('firebase/auth', () => ({
  EmailAuthProvider: { credential: (email: string, pin: string) => ({ email, pin }) },
  GoogleAuthProvider: vi.fn(),
  deleteUser: mocks.deleteUser,
  linkWithCredential: vi.fn(),
  linkWithPopup: vi.fn(),
  reauthenticateWithCredential: mocks.reauthenticateWithCredential,
  reauthenticateWithPopup: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
}));

const { deleteAccount } = await import('./accountService');

const USER = {
  uid: 'kid1',
  email: 'noa@peachnote.tutor.local',
  isAnonymous: false,
  providerData: [{ providerId: 'password' }],
};

const deletedPaths = () => mocks.deleteDoc.mock.calls.map(([ref]) => (ref as { path: string }).path);

beforeEach(() => {
  mocks.auth.currentUser = USER;
  mocks.deleteDoc.mockReset().mockResolvedValue(undefined);
  mocks.getDocs.mockReset().mockResolvedValue({ docs: [] });
  mocks.getDoc.mockReset().mockResolvedValue({ exists: () => false, data: () => undefined });
  mocks.deleteUser.mockReset().mockResolvedValue(undefined);
  mocks.reauthenticateWithCredential.mockReset().mockResolvedValue(undefined);
  mocks.deleteLearnerParentData.mockReset().mockResolvedValue(undefined);
  mocks.deleteAllStickerImages.mockReset().mockResolvedValue(undefined);
});

describe('deleteAccount', () => {
  it("deletes the learner's own documents, the streak reminder included, before the sign-in", async () => {
    expect(await deleteAccount(undefined, '123456')).toEqual({ ok: true });

    expect(deletedPaths()).toEqual(
      expect.arrayContaining(['learners/kid1', 'publicProfiles/kid1', 'friendCodeOwners/kid1', 'pushSubscriptions/kid1'])
    );
    expect(mocks.deleteAllStickerImages).toHaveBeenCalledWith('kid1');
    expect(mocks.deleteLearnerParentData).toHaveBeenCalledWith('kid1');
    // The rules need the signed-in learner, so every document goes before the account itself
    expect(mocks.deleteUser.mock.invocationCallOrder[0]).toBeGreaterThan(
      Math.max(...mocks.deleteDoc.mock.invocationCallOrder)
    );
  });

  it('deletes the friendships and contests shared with friends, and the username', async () => {
    const shared = (id: string) => ({ ref: { path: id } });
    mocks.getDocs
      .mockResolvedValueOnce({ docs: [shared('friendships/a_kid1')] })
      .mockResolvedValueOnce({ docs: [shared('contests/c1')] });
    mocks.getDoc.mockImplementation(async (ref: { path: string }) =>
      ref.path === 'usernames/noa' ? { exists: () => true, data: () => ({ uid: 'kid1' }) } : { exists: () => false, data: () => undefined }
    );

    await deleteAccount(undefined, '123456');
    expect(deletedPaths()).toEqual(expect.arrayContaining(['friendships/a_kid1', 'contests/c1', 'usernames/noa']));
  });

  it('never deletes a friend code that now belongs to someone else', async () => {
    mocks.getDoc.mockImplementation(async (ref: { path: string }) =>
      ref.path === 'friendCodes/ABC234' ? { exists: () => true, data: () => ({ uid: 'other' }) } : { exists: () => false, data: () => undefined }
    );
    await deleteAccount('ABC234', '123456');
    expect(deletedPaths()).not.toContain('friendCodes/ABC234');
  });

  it('deletes nothing when the PIN is wrong', async () => {
    mocks.reauthenticateWithCredential.mockRejectedValue({ code: 'auth/wrong-password' });

    expect(await deleteAccount(undefined, 'wrong1')).toEqual({ ok: false, errorHe: 'הקוד הסודי לא נכון.' });
    expect(mocks.deleteDoc).not.toHaveBeenCalled();
    expect(mocks.deleteUser).not.toHaveBeenCalled();
  });

  it('leaves the reminder alone for a guest, whom the rules give none', async () => {
    mocks.auth.currentUser = { uid: 'guest1', email: null, isAnonymous: true, providerData: [] };
    expect(await deleteAccount(undefined, '')).toEqual({ ok: true });
    expect(deletedPaths()).toContain('learners/guest1');
    expect(deletedPaths()).not.toContain('pushSubscriptions/guest1');
  });

  it('needs a signed-in account', async () => {
    mocks.auth.currentUser = null;
    expect((await deleteAccount(undefined, '123456')).ok).toBe(false);
    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });
});
