import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { writeAccountRole } from '../../services/accountRole';
import { getAccountKind } from '../../services/accountService';
import { hasLearnerProfile, isParentAccount, markParentAccount } from '../../services/parentService';
import { ParentPortal } from './ParentPortal';

const firebase = vi.hoisted(() => ({ auth: {} as object | null }));
vi.mock('../../services/firebase', () => ({
  get auth() {
    return firebase.auth;
  },
  googleProvider: {},
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('../../services/accountService', () => ({ getAccountKind: vi.fn() }));
vi.mock('../../services/accountRole', () => ({ writeAccountRole: vi.fn() }));
vi.mock('../../services/parentService', () => ({
  hasLearnerProfile: vi.fn(),
  isParentAccount: vi.fn(),
  markParentAccount: vi.fn(),
}));
vi.mock('./ParentHome', () => ({
  ParentHome: ({ initialCode, onSignOut }: { initialCode: string | null; onSignOut: () => void }) => (
    <div>
      <p>בית ההורים {initialCode ?? 'ללא קוד'}</p>
      <button type="button" onClick={onSignOut}>יציאה מהבית</button>
    </div>
  ),
}));

const PARENT = { uid: 'parent-1' };
let emitAuth: (user: unknown) => void;

function renderPortal(initialCode: string | null = null) {
  render(<ParentPortal initialCode={initialCode} />);
}
const signIn = (user: unknown) => act(async () => { emitAuth(user); });

beforeEach(() => {
  firebase.auth = {};
  [onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, writeAccountRole, getAccountKind,
    hasLearnerProfile, isParentAccount, markParentAccount].forEach((fn) => vi.mocked(fn).mockReset());
  vi.mocked(onAuthStateChanged).mockImplementation(((_auth: unknown, next: (user: unknown) => void) => {
    emitAuth = next;
    return () => undefined;
  }) as never);
  vi.mocked(getAccountKind).mockReturnValue('google' as never);
  vi.mocked(hasLearnerProfile).mockResolvedValue(false);
  vi.mocked(isParentAccount).mockResolvedValue(false);
  vi.mocked(markParentAccount).mockResolvedValue(undefined);
});

describe('ParentPortal signed out', () => {
  it('shows loading until Firebase reports who is signed in', () => {
    renderPortal();

    expect(screen.getByRole('status')).toHaveTextContent('טוענים');
  });

  it('invites the parent to sign in with Google and shows the code from the link', async () => {
    renderPortal('ABCD2345');
    await signIn(null);

    expect(screen.getByRole('heading', { name: 'אזור הורים' })).toBeInTheDocument();
    expect(screen.getByText('ABCD2345')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'חזרה לאפליקציה' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: 'כניסה עם Google' })).toBeEnabled();
  });

  it('cannot sign in when Firebase is not configured', async () => {
    firebase.auth = null;
    renderPortal();

    expect(await screen.findByRole('button', { name: 'כניסה עם Google' })).toBeDisabled();
  });

  it('signs in with the Google popup', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockResolvedValue({} as never);
    renderPortal();
    await signIn(null);

    await user.click(screen.getByRole('button', { name: 'כניסה עם Google' }));

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])('says nothing when the parent closes the popup (%s)', async (code) => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockRejectedValue({ code });
    renderPortal();
    await signIn(null);

    await user.click(screen.getByRole('button', { name: 'כניסה עם Google' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an error for any other sign-in failure', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockRejectedValue({ code: 'auth/internal-error' });
    renderPortal();
    await signIn(null);

    await user.click(screen.getByRole('button', { name: 'כניסה עם Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו להתחבר עם Google');
  });

  it('redirects when the popup is blocked, and explains when that fails too', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithPopup).mockRejectedValue({ code: 'auth/popup-blocked' });
    vi.mocked(signInWithRedirect).mockResolvedValueOnce(undefined as never);
    renderPortal();
    await signIn(null);

    await user.click(screen.getByRole('button', { name: 'כניסה עם Google' }));
    expect(signInWithRedirect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.mocked(signInWithRedirect).mockRejectedValueOnce(new Error('no'));
    await user.click(screen.getByRole('button', { name: 'כניסה עם Google' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('הדפדפן חסם');
  });
});

describe('ParentPortal signed in', () => {
  it('marks a new Google account as a parent and opens the parent home with the code', async () => {
    renderPortal('ABCD2345');
    await signIn(PARENT);

    expect(await screen.findByText('בית ההורים ABCD2345')).toBeInTheDocument();
    expect(markParentAccount).toHaveBeenCalledWith('parent-1');
    expect(writeAccountRole).toHaveBeenCalledWith('parent-1', 'parent');
  });

  it('lets a Google account that is both a learner and a marked parent in', async () => {
    vi.mocked(hasLearnerProfile).mockResolvedValue(true);
    vi.mocked(isParentAccount).mockResolvedValue(true);
    renderPortal();
    await signIn(PARENT);

    expect(await screen.findByText(/בית ההורים/)).toBeInTheDocument();
  });

  it('turns away a Google account that is a learner account', async () => {
    vi.mocked(hasLearnerProfile).mockResolvedValue(true);
    renderPortal();
    await signIn(PARENT);

    expect(await screen.findByRole('alert')).toHaveTextContent('משמש כחשבון של לומד');
    expect(writeAccountRole).toHaveBeenCalledWith('parent-1', 'learner');
    expect(markParentAccount).not.toHaveBeenCalled();
  });

  it('turns away a username learner account', async () => {
    vi.mocked(getAccountKind).mockReturnValue('username' as never);
    renderPortal();
    await signIn(PARENT);

    expect(await screen.findByRole('alert')).toHaveTextContent('מחוברים כרגע לחשבון של לומד');
    expect(hasLearnerProfile).not.toHaveBeenCalled();
  });

  it('asks to try again when the account check fails', async () => {
    vi.mocked(hasLearnerProfile).mockRejectedValue(new Error('offline'));
    renderPortal();
    await signIn(PARENT);

    expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו לבדוק את החשבון');
  });

  it('signs out from the refusal screen and forgets the role', async () => {
    const user = userEvent.setup();
    vi.mocked(getAccountKind).mockReturnValue('username' as never);
    renderPortal();
    await signIn(PARENT);

    await user.click(await screen.findByRole('button', { name: 'התנתקות' }));

    expect(writeAccountRole).toHaveBeenLastCalledWith('parent-1', null);
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('signs out from the parent home', async () => {
    const user = userEvent.setup();
    renderPortal();
    await signIn(PARENT);

    await user.click(await screen.findByRole('button', { name: 'יציאה מהבית' }));

    expect(writeAccountRole).toHaveBeenLastCalledWith('parent-1', null);
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
