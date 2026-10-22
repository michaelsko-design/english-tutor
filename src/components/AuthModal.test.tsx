import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { TEST_THEME } from '../test/fixtures';
import { AuthModal } from './AuthModal';

// A stand-in auth object, so the form doesn't take the "Firebase is off" early exit
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

function renderGate(props: { isMandatory?: boolean; onClose?: () => void } = {}) {
  render(
    <AuthModal
      authUser={null}
      syncStatus="local-only"
      gender="girl"
      learnerName="נועה"
      theme={TEST_THEME}
      isMandatory={props.isMandatory ?? true}
      onClose={props.onClose}
      onSignOut={async () => {}}
    />
  );
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, username: string, pin: string) {
  await user.type(screen.getByLabelText(/Username or Email/), username);
  await user.type(screen.getByLabelText(/קוד סודי \/ סיסמה/), pin);
  await user.click(screen.getByRole('button', { name: /התחברות וסנכרון|יצירת חשבון/ }));
}

describe('AuthModal', () => {
  beforeEach(() => {
    vi.mocked(signInWithEmailAndPassword).mockReset();
    vi.mocked(createUserWithEmailAndPassword).mockReset();
  });

  it('signs a username in with its internal sign-in address', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as never);
    renderGate();

    await fillAndSubmit(user, 'Noa12', PIN);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'noa12@peachnote.tutor.local',
      PIN
    );
    expect(await screen.findByText(/ברוכה השבה!/)).toBeInTheDocument();
  });

  it('creates a new account in register mode', async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: {} } as never);
    renderGate();

    await user.click(screen.getByRole('button', { name: 'פתיחת חשבון חדש' }));
    await fillAndSubmit(user, 'noa12', PIN);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'noa12@peachnote.tutor.local',
      PIN
    );
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('rejects a PIN shorter than 6 characters without calling Firebase', async () => {
    const user = userEvent.setup();
    renderGate();

    await fillAndSubmit(user, 'noa12', '123');

    expect(screen.getByText(/חייבים להכיל לפחות 6 תווים/)).toBeInTheDocument();
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('shows a wrong-PIN message when Firebase rejects the credentials', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({ code: 'auth/invalid-credential' });
    renderGate();

    await fillAndSubmit(user, 'noa12', PIN);

    expect(await screen.findByText(/הקוד הסודי אינם נכונים/)).toBeInTheDocument();
  });

  it('the mandatory sign-in gate cannot be closed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderGate({ isMandatory: true, onClose });

    await user.keyboard('{Escape}');

    expect(screen.getByRole('dialog', { name: 'התחברות' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'סגירה' })).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('the cloud panel closes with Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderGate({ isMandatory: false, onClose });

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
