// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LearnerProfile } from '../types/learner';

const mocks = vi.hoisted(() => ({
  auth: { currentUser: null as unknown },
  linkWithCredential: vi.fn(),
  linkWithPopup: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
  reauthenticateWithPopup: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
  readEntitlementOnce: vi.fn(),
  loadAllStickerImages: vi.fn(),
}));

vi.mock('./firebase', () => ({ auth: mocks.auth, db: {}, googleProvider: { id: 'google' } }));
vi.mock('./parentService', () => ({ deleteLearnerParentData: vi.fn() }));
vi.mock('./stickerImages', () => ({ deleteAllStickerImages: vi.fn(), loadAllStickerImages: mocks.loadAllStickerImages }));
vi.mock('./entitlementService', () => ({ readEntitlementOnce: mocks.readEntitlementOnce }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  EmailAuthProvider: { credential: (email: string, pin: string) => ({ email, pin }) },
  GoogleAuthProvider: vi.fn(),
  deleteUser: vi.fn(),
  linkWithCredential: mocks.linkWithCredential,
  linkWithPopup: mocks.linkWithPopup,
  reauthenticateWithCredential: mocks.reauthenticateWithCredential,
  reauthenticateWithPopup: mocks.reauthenticateWithPopup,
  updatePassword: mocks.updatePassword,
  updateProfile: mocks.updateProfile,
}));

const account = await import('./accountService');

const PASSWORD_USER = { uid: 'u1', email: 'noa@peachnote.tutor.local', isAnonymous: false, providerData: [{ providerId: 'password' }] };
const LINKED_USER = { ...PASSWORD_USER, providerData: [{ providerId: 'password' }, { providerId: 'google.com' }] };
const GUEST = { uid: 'g1', email: null, isAnonymous: true, providerData: [] };
const GOOGLE_USER = { uid: 'u2', email: 'a@gmail.com', isAnonymous: false, providerData: [{ providerId: 'google.com' }] };

const signIn = (user: unknown) => {
  mocks.auth.currentUser = user;
};
const fail = (code: string) => Object.assign(new Error(code), { code });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.currentUser = null;
  mocks.readEntitlementOnce.mockResolvedValue(null);
});

describe('getAccountKind and hasGoogleLinked', () => {
  it('tells guest, google and password accounts apart', () => {
    expect(account.getAccountKind(GUEST as never)).toBe('guest');
    expect(account.getAccountKind(GOOGLE_USER as never)).toBe('google');
    expect(account.getAccountKind(PASSWORD_USER as never)).toBe('password');
    expect(account.hasGoogleLinked(LINKED_USER as never)).toBe(true);
    expect(account.hasGoogleLinked(PASSWORD_USER as never)).toBe(false);
  });
});

describe('changePin', () => {
  it('only works for a username + PIN account', async () => {
    signIn(GOOGLE_USER);
    expect((await account.changePin('123456', '654321')).ok).toBe(false);
    signIn(null);
    expect((await account.changePin('123456', '654321')).ok).toBe(false);
  });

  it('rejects a new PIN under 6 characters and an empty current PIN without Google', async () => {
    signIn(PASSWORD_USER);
    expect(await account.changePin('123456', '123')).toEqual({ ok: false, errorHe: 'הקוד החדש צריך לפחות 6 תווים.' });
    expect(await account.changePin('  ', '654321')).toEqual({ ok: false, errorHe: 'צריך לכתוב את הקוד הסודי הנוכחי.' });
    expect(mocks.updatePassword).not.toHaveBeenCalled();
  });

  it('proves the current PIN, then updates it', async () => {
    signIn(PASSWORD_USER);
    expect(await account.changePin(' 123456 ', ' 654321 ')).toEqual({ ok: true });
    expect(mocks.reauthenticateWithCredential).toHaveBeenCalledWith(PASSWORD_USER, { email: PASSWORD_USER.email, pin: '123456' });
    expect(mocks.updatePassword).toHaveBeenCalledWith(PASSWORD_USER, '654321');
  });

  it('lets a learner who forgot the PIN prove ownership with the linked Google account', async () => {
    signIn(LINKED_USER);
    expect(await account.changePin('', '654321')).toEqual({ ok: true });
    expect(mocks.reauthenticateWithPopup).toHaveBeenCalled();
    expect(mocks.reauthenticateWithCredential).not.toHaveBeenCalled();
  });

  it('reports a wrong current PIN in Hebrew', async () => {
    signIn(PASSWORD_USER);
    mocks.reauthenticateWithCredential.mockRejectedValueOnce(fail('auth/invalid-credential'));
    expect(await account.changePin('000000', '654321')).toEqual({ ok: false, errorHe: 'הקוד הסודי לא נכון.' });
    expect(mocks.updatePassword).not.toHaveBeenCalled();
  });
});

describe('saveGuestWithGoogle', () => {
  it('only works for a guest', async () => {
    signIn(PASSWORD_USER);
    expect((await account.saveGuestWithGoogle()).ok).toBe(false);
  });

  it('links Google to the guest', async () => {
    signIn(GUEST);
    expect(await account.saveGuestWithGoogle()).toEqual({ ok: true });
    expect(mocks.linkWithPopup).toHaveBeenCalledWith(GUEST, { id: 'google' });
  });

  it.each([
    ['auth/popup-closed-by-user', 'החלון נסגר'],
    ['auth/popup-blocked', 'חסם את החלון'],
    ['auth/network-request-failed', 'אין חיבור'],
    ['auth/weird', 'משהו השתבש'],
  ])('maps %s to a Hebrew message', async (code, text) => {
    signIn(GUEST);
    mocks.linkWithPopup.mockRejectedValueOnce(fail(code));
    const result = await account.saveGuestWithGoogle();
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errorHe).toContain(text);
  });
});

describe('linkGoogleToAccount', () => {
  it('needs a signed-in, non-guest account', async () => {
    signIn(GUEST);
    expect((await account.linkGoogleToAccount()).ok).toBe(false);
  });

  it('is a no-op when Google is already linked', async () => {
    signIn(LINKED_USER);
    expect(await account.linkGoogleToAccount()).toEqual({ ok: true });
    expect(mocks.linkWithPopup).not.toHaveBeenCalled();
  });

  it('links Google, and explains when that Google account belongs to another learner', async () => {
    signIn(PASSWORD_USER);
    expect(await account.linkGoogleToAccount()).toEqual({ ok: true });
    mocks.linkWithPopup.mockRejectedValueOnce(fail('auth/credential-already-in-use'));
    const taken = await account.linkGoogleToAccount();
    expect(taken.ok === false && taken.errorHe).toContain('חשבון אחר');
    mocks.linkWithPopup.mockRejectedValueOnce(fail('auth/popup-blocked'));
    expect((await account.linkGoogleToAccount()).ok).toBe(false);
  });
});

describe('saveGuestWithUsername', () => {
  it('validates the guest, the username and the PIN length', async () => {
    signIn(PASSWORD_USER);
    expect((await account.saveGuestWithUsername('noa', '123456', 'נועה')).ok).toBe(false);
    signIn(GUEST);
    expect((await account.saveGuestWithUsername(' ', '123456', 'נועה')).ok).toBe(false);
    expect((await account.saveGuestWithUsername('noa', '123', 'נועה')).ok).toBe(false);
    expect(mocks.linkWithCredential).not.toHaveBeenCalled();
  });

  it('links the credential and sets the display name', async () => {
    signIn(GUEST);
    mocks.linkWithCredential.mockResolvedValueOnce({ user: { uid: 'g1' } });
    expect(await account.saveGuestWithUsername('Noa', ' 123456 ', ' נועה ')).toEqual({ ok: true });
    expect(mocks.linkWithCredential).toHaveBeenCalledWith(GUEST, { email: 'noa@peachnote.tutor.local', pin: '123456' });
    expect(mocks.updateProfile).toHaveBeenCalledWith({ uid: 'g1' }, { displayName: 'נועה' });
  });

  it('skips the display name when empty, and reports a taken username', async () => {
    signIn(GUEST);
    mocks.linkWithCredential.mockResolvedValueOnce({ user: {} });
    await account.saveGuestWithUsername('noa', '123456', '  ');
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    mocks.linkWithCredential.mockRejectedValueOnce(fail('auth/email-already-in-use'));
    const taken = await account.saveGuestWithUsername('noa', '123456', '');
    expect(taken.ok === false && taken.errorHe).toContain('תפוס');
  });
});

describe('downloadProfileJson', () => {
  const profile = { name: 'נועה/א', room: { drawnStickers: [{ id: 's1' }, { id: 's2', archivedAt: 5 }] } } as unknown as LearnerProfile;
  let blobs: Blob[];
  let link: HTMLAnchorElement;

  beforeEach(() => {
    blobs = [];
    URL.createObjectURL = vi.fn((blob: Blob) => (blobs.push(blob), 'blob:x'));
    URL.revokeObjectURL = vi.fn();
    link = document.createElement('a');
    link.click = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue(link);
  });

  it('downloads the profile with the sticker pictures and the Pro status put back in', async () => {
    signIn(PASSWORD_USER);
    mocks.readEntitlementOnce.mockResolvedValue({ plan: 'pro' });
    mocks.loadAllStickerImages.mockResolvedValue({ s1: 'data:a', s2: 'data:b' });
    await account.downloadProfileJson(profile);
    const data = JSON.parse(await blobs[0].text());
    expect(data.proEntitlement).toEqual({ plan: 'pro' });
    expect(data.room.drawnStickers[0].imageDataUrl).toBe('data:a');
    expect(data.room.drawnStickers[1].imageDataUrl).toBeUndefined();
    expect(link.download).toBe('englishvibe-נועה_א.json');
    expect(link.click).toHaveBeenCalled();
  });

  it('still downloads when the sticker pictures cannot be loaded or nobody is signed in', async () => {
    mocks.loadAllStickerImages.mockRejectedValue(new Error('offline'));
    await account.downloadProfileJson(profile);
    expect(JSON.parse(await blobs[0].text()).room.drawnStickers[0].imageDataUrl).toBeUndefined();
    expect(mocks.readEntitlementOnce).not.toHaveBeenCalled();
  });
});
