import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountResult } from '../../services/accountService';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { AccountPrivacyCard } from './AccountPrivacyCard';

// Overrides the setup's Firebase mock: the card shows its account actions only for a signed-in user
vi.mock('../../services/firebase', () => ({
  auth: { currentUser: { isAnonymous: false } },
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

vi.mock('firebase/auth', () => ({ signOut: vi.fn() }));

const changePin = vi.fn<(currentPin: string, newPin: string) => Promise<AccountResult>>();

vi.mock('../../services/accountService', () => ({
  MIN_PIN_LENGTH: 6,
  changePin: (currentPin: string, newPin: string) => changePin(currentPin, newPin),
  downloadProfileJson: vi.fn(),
  getAccountKind: () => 'password',
  hasGoogleLinked: () => false,
  linkGoogleToAccount: vi.fn(),
}));

const PIN = '246810';
const FRIEND_CODE = 'NOA-1234';
const onSignOut = vi.fn(async () => {});
const deleteAccount = vi.fn<(friendCode: string | undefined, pin: string) => Promise<AccountResult>>();

function renderCard() {
  const profile = makeProfile({ friendsHub: { friendCode: FRIEND_CODE } as never });
  render(
    <AccountPrivacyCard profile={profile} theme={TEST_THEME} onSignOut={onSignOut} onDeleteAccount={deleteAccount} />
  );
}

async function openDelete(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /מחיקת החשבון/ }));
  return screen.getByRole('button', { name: 'מחיקה לצמיתות' });
}

describe('AccountPrivacyCard: signing out', () => {
  it('signs out through onSignOut, which saves the waiting changes first', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'התנתקות מהחשבון' }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});

describe('AccountPrivacyCard: changing the PIN', () => {
  beforeEach(() => {
    changePin.mockReset();
  });

  it('needs both PINs, then changes it and confirms', async () => {
    const user = userEvent.setup();
    changePin.mockResolvedValue({ ok: true });
    renderCard();

    await user.click(screen.getByRole('button', { name: 'החלפת קוד סודי' }));
    const save = screen.getByRole('button', { name: 'שמירת הקוד החדש' });
    expect(save).toBeDisabled();
    await user.type(screen.getByLabelText(/הקוד הסודי הנוכחי/), PIN);
    await user.type(screen.getByLabelText(/הקוד הסודי החדש/), '135790');
    await user.click(save);

    expect(changePin).toHaveBeenCalledWith(PIN, '135790');
    expect(await screen.findByRole('status')).toHaveTextContent('הקוד הסודי הוחלף.');
  });

  it('shows the error and keeps the form when the change fails', async () => {
    const user = userEvent.setup();
    changePin.mockResolvedValue({ ok: false, errorHe: 'הקוד הסודי לא נכון.' });
    renderCard();

    await user.click(screen.getByRole('button', { name: 'החלפת קוד סודי' }));
    await user.type(screen.getByLabelText(/הקוד הסודי הנוכחי/), PIN);
    await user.type(screen.getByLabelText(/הקוד הסודי החדש/), '135790');
    await user.click(screen.getByRole('button', { name: 'שמירת הקוד החדש' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('הקוד הסודי לא נכון.');
  });
});

describe('AccountPrivacyCard: deleting the account', () => {
  beforeEach(() => {
    deleteAccount.mockReset();
  });

  it('stays disabled until the confirm word and a 6-character PIN are typed', async () => {
    const user = userEvent.setup();
    renderCard();
    const confirm = await openDelete(user);

    expect(confirm).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: /כדי לאשר/ }), 'מחיקה');
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText(/הקוד הסודי של החשבון/), '12345');
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText(/הקוד הסודי של החשבון/), '6');
    expect(confirm).toBeEnabled();
  });

  it('deletes with the friend code and PIN, and shows the error when it fails', async () => {
    const user = userEvent.setup();
    deleteAccount.mockResolvedValue({ ok: false, errorHe: 'הקוד הסודי שגוי.' });
    renderCard();
    const confirm = await openDelete(user);

    await user.type(screen.getByRole('textbox', { name: /כדי לאשר/ }), 'מחיקה');
    await user.type(screen.getByLabelText(/הקוד הסודי של החשבון/), PIN);
    await user.click(confirm);

    expect(deleteAccount).toHaveBeenCalledWith(FRIEND_CODE, PIN);
    expect(await screen.findByRole('alert')).toHaveTextContent('הקוד הסודי שגוי.');
    expect(confirm).toBeEnabled();
  });

  it('cancel closes the confirmation and clears what was typed', async () => {
    const user = userEvent.setup();
    renderCard();
    await openDelete(user);
    await user.type(screen.getByRole('textbox', { name: /כדי לאשר/ }), 'מחיקה');

    await user.click(screen.getByRole('button', { name: 'ביטול' }));
    await openDelete(user);

    expect(screen.getByRole('textbox', { name: /כדי לאשר/ })).toHaveValue('');
    expect(deleteAccount).not.toHaveBeenCalled();
  });

  it('opens the privacy notice dialog', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: /פרטיות ומידע/ }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
