import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth';
import { saveGuestWithGoogle, saveGuestWithUsername } from '../services/accountService';
import { TEST_THEME } from '../test/fixtures';
import type { AuthUserSummary } from '../types/learner';
import { AuthModal } from './AuthModal';

// The basic username sign-in cases are in AuthModal.test.tsx; this file covers Google, guests and signed-in views.
vi.mock('../services/firebase', () => ({
  auth: { currentUser: null },
  googleProvider: {},
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInAnonymously: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('../services/accountService', () => ({
  saveGuestWithGoogle: vi.fn(),
  saveGuestWithUsername: vi.fn(),
}));

const PIN = '246810';
const REAL_USER: AuthUserSummary = { uid: 'u1', displayName: null, email: 'noa12@peachnote.tutor.local', isAnonymous: false };
const GUEST: AuthUserSummary = { uid: 'guest-uid-123', displayName: null, email: null, isAnonymous: true };

interface GateProps {
  isMandatory?: boolean;
  authUser?: AuthUserSummary | null;
  onSignOut?: () => Promise<void>;
}

function renderGate({ isMandatory = true, authUser = null, onSignOut = async () => {} }: GateProps = {}) {
  render(
    <AuthModal
      authUser={authUser}
      syncStatus="local-only"
      gender="girl"
      learnerName="נועה"
      theme={TEST_THEME}
      isMandatory={isMandatory}
      onClose={isMandatory ? undefined : vi.fn()}
      onSignOut={onSignOut}
    />
  );
}

/** Opens the new-account or sign-in form ("חדש/ה כאן" / "כבר רשום/ה"), fills it and submits */
async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  username: string,
  pin: string,
  mode: 'new' | 'existing' = 'existing'
) {
  await user.click(screen.getByRole('button', { name: mode === 'new' ? /חדש\/ה כאן/ : /כבר רשום\/ה/ }));
  if (username) await user.type(screen.getByLabelText(/שם משתמש/), username);
  await user.type(screen.getByLabelText(/^סיסמה/), pin);
  await user.click(screen.getByRole('button', { name: mode === 'new' ? /יצירת חשבון/ : /^כניסה$/ }));
}

beforeEach(() => {
  [
    signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup,
    signInWithRedirect, signInAnonymously, saveGuestWithGoogle, saveGuestWithUsername,
  ].forEach((fn) => vi.mocked(fn).mockReset());
});

describe('AuthModal username form', () => {
  it('asks for a username before calling Firebase', async () => {
    const user = userEvent.setup();
    renderGate();

    await fillAndSubmit(user, '', PIN);

    expect(screen.getByText(/צריך לכתוב שם משתמש/)).toBeInTheDocument();
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('names the new account after the learner', async () => {
    const user = userEvent.setup();
    const created = { user: { uid: 'new-user' } };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(created as never);
    renderGate();

    await fillAndSubmit(user, 'noa12', PIN, 'new');

    expect(updateProfile).toHaveBeenCalledWith(created.user, { displayName: 'נועה' });
    expect(await screen.findByText(/החשבון נוצר/)).toBeInTheDocument();
  });

  it('offers to sign in with a taken username, keeping what was typed', async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({ code: 'auth/email-already-in-use' });
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as never);
    renderGate();

    await fillAndSubmit(user, 'noa12', PIN, 'new');
    expect(await screen.findByText(/השם הזה כבר תפוס/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'לכניסה עם השם הזה' }));

    expect(screen.queryByText(/השם הזה כבר תפוס/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^כניסה$/ }));
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'noa12@peachnote.tutor.local', PIN);
  });

  it('shows a general message for any other sign-in failure', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({ code: 'auth/network-request-failed' });
    renderGate();

    await fillAndSubmit(user, 'noa12', PIN);

    expect(await screen.findByText(/משהו השתבש בכניסה/)).toBeInTheDocument();
  });

  it('clears an old error when the learner goes back', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({ code: 'auth/wrong-password' });
    renderGate();
    await fillAndSubmit(user, 'noa12', PIN);
    expect(await screen.findByText(/לא נכונים/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'חזרה' }));

    expect(screen.queryByText(/לא נכונים/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /חדש\/ה כאן/ })).toBeInTheDocument();
  });
});

describe('AuthModal Google sign-in', () => {
  const clickGoogle = (user: ReturnType<typeof userEvent.setup>) =>
    user.click(screen.getByRole('button', { name: /כניסה עם Google/ }));

  it('confirms a successful sign-in', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockResolvedValue({} as never);
    renderGate();

    await clickGoogle(user);

    expect(await screen.findByText(/התחברת בהצלחה עם Google/)).toBeInTheDocument();
  });

  it('falls back to a redirect when the popup is blocked', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockRejectedValue({ code: 'auth/popup-blocked' });
    vi.mocked(signInWithRedirect).mockResolvedValue(undefined as never);
    renderGate();

    await clickGoogle(user);

    expect(signInWithRedirect).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/הדפדפן חסם/)).not.toBeInTheDocument();
  });

  it('explains a blocked popup when the redirect fails too', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockRejectedValue({ code: 'auth/popup-blocked' });
    vi.mocked(signInWithRedirect).mockRejectedValue(new Error('no'));
    renderGate();

    await clickGoogle(user);

    expect(await screen.findByText(/הדפדפן חסם את חלון ההתחברות/)).toBeInTheDocument();
  });

  it.each([
    ['auth/popup-closed-by-user', /נסגר לפני סיום/],
    ['auth/cancelled-popup-request', /נסגר לפני סיום/],
    ['auth/unauthorized-domain', /טרם אושר ב-Firebase Auth/],
    ['auth/internal-error', /לא הצלחנו להתחבר עם Google/],
  ])('explains %s', async (code, message) => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockRejectedValue({ code });
    renderGate();

    await clickGoogle(user);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });
});

describe('AuthModal around the form', () => {
  it('starts on the child tab, with the ways for a child to sign in', () => {
    renderGate({ isMandatory: true });

    expect(screen.getByRole('tab', { name: /ילד\/ה/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /כניסה עם Google/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Guest Cloud/ })).not.toBeInTheDocument();
  });

  it('sends a parent to the parent area, with no way to sign in here', async () => {
    const user = userEvent.setup();
    renderGate({ isMandatory: true });

    await user.click(screen.getByRole('tab', { name: /הורה/ }));

    expect(screen.getByRole('link', { name: 'לאזור ההורים' })).toHaveAttribute('href', '/?parent');
    expect(screen.queryByRole('button', { name: /כניסה עם Google/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /חדש\/ה כאן/ })).not.toBeInTheDocument();
  });

  it('the cloud panel has no child / parent switch', () => {
    renderGate({ isMandatory: false });

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /כניסה עם Google/ })).toBeInTheDocument();
  });

  it('opens the privacy notice', async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole('button', { name: /פרטיות ומידע להורים/ }));

    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(1);
  });

  it('starts a guest account from the cloud panel', async () => {
    const user = userEvent.setup();
    vi.mocked(signInAnonymously).mockResolvedValue({} as never);
    renderGate({ isMandatory: false });

    await user.click(screen.getByRole('button', { name: /Guest Cloud/ }));

    expect(await screen.findByText(/חשבון אורח הופעל/)).toBeInTheDocument();
  });

  it('says so when a guest account cannot be started', async () => {
    const user = userEvent.setup();
    vi.mocked(signInAnonymously).mockRejectedValue(new Error('no'));
    renderGate({ isMandatory: false });

    await user.click(screen.getByRole('button', { name: /Guest Cloud/ }));

    expect(await screen.findByText(/לא ניתן להפעיל חשבון אורח/)).toBeInTheDocument();
  });
});

describe('AuthModal when already signed in', () => {
  it('shows the username and signs out', async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn(async () => {});
    renderGate({ isMandatory: false, authUser: REAL_USER, onSignOut });

    expect(screen.getByText(/Logged in as: noa12/)).toBeInTheDocument();
    expect(screen.getByText('Cloud Account')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /התנתקות מהחשבון/ }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('reports a failed sign-out', async () => {
    const user = userEvent.setup();
    renderGate({
      isMandatory: false,
      authUser: REAL_USER,
      onSignOut: async () => {
        throw new Error('no');
      },
    });

    await user.click(screen.getByRole('button', { name: /התנתקות מהחשבון/ }));

    expect(await screen.findByText(/אירעה שגיאה בהתנתקות/)).toBeInTheDocument();
  });
});

describe('AuthModal as a guest', () => {
  it('warns, and makes the learner confirm before signing out', async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn(async () => {});
    renderGate({ isMandatory: false, authUser: GUEST, onSignOut });
    expect(screen.getByText(/זה חשבון אורח/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /התנתקות מהחשבון/ }));
    expect(onSignOut).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/נמחק בהתנתקות/);

    await user.click(screen.getByRole('button', { name: /להתנתק בכל זאת/ }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('saves the account with Google and keeps the progress', async () => {
    const user = userEvent.setup();
    vi.mocked(saveGuestWithGoogle).mockResolvedValue({ ok: true, value: undefined } as never);
    renderGate({ isMandatory: false, authUser: GUEST });

    await user.click(screen.getByRole('button', { name: /שמירה עם חשבון Google/ }));

    expect(await screen.findByText(/החשבון נשמר/)).toBeInTheDocument();
    expect(screen.queryByText(/זה חשבון אורח/)).not.toBeInTheDocument();
  });

  it('saves the account with a username and PIN', async () => {
    const user = userEvent.setup();
    vi.mocked(saveGuestWithUsername).mockResolvedValue({ ok: true, value: undefined } as never);
    renderGate({ isMandatory: false, authUser: GUEST });

    await user.type(screen.getByLabelText(/או שם משתמש באנגלית/), 'noa12');
    await user.type(screen.getByLabelText(/וקוד סודי \(לפחות 6 תווים\)/), PIN);
    await user.click(screen.getByRole('button', { name: /שמירה עם שם משתמש וקוד סודי/ }));

    expect(saveGuestWithUsername).toHaveBeenCalledWith('noa12', PIN, 'נועה');
    expect(await screen.findByText(/החשבון נשמר/)).toBeInTheDocument();
  });

  it('shows why saving failed and stays a guest', async () => {
    const user = userEvent.setup();
    vi.mocked(saveGuestWithGoogle).mockResolvedValue({ ok: false, errorHe: 'החשבון כבר קיים' } as never);
    renderGate({ isMandatory: false, authUser: GUEST });

    await user.click(screen.getByRole('button', { name: /שמירה עם חשבון Google/ }));

    expect(await screen.findByText('החשבון כבר קיים')).toBeInTheDocument();
    expect(screen.getByText(/זה חשבון אורח/)).toBeInTheDocument();
  });
});
