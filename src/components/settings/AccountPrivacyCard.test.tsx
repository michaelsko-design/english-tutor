import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteAccount } from '../../services/accountService';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { AccountPrivacyCard } from './AccountPrivacyCard';

// Overrides the setup's Firebase mock: the card shows its account actions only for a signed-in user
vi.mock('../../services/firebase', () => ({
  auth: { currentUser: { isAnonymous: false } },
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

vi.mock('firebase/auth', () => ({ signOut: vi.fn() }));

vi.mock('../../services/accountService', () => ({
  deleteAccount: vi.fn(),
  downloadProfileJson: vi.fn(),
  getAccountKind: () => 'password',
  hasGoogleLinked: () => false,
  linkGoogleToAccount: vi.fn(),
}));

const PIN = '246810';
const FRIEND_CODE = 'NOA-1234';

function renderCard() {
  const profile = makeProfile({ friendsHub: { friendCode: FRIEND_CODE } as never });
  render(<AccountPrivacyCard profile={profile} theme={TEST_THEME} />);
}

async function openDelete(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /מחיקת החשבון/ }));
  return screen.getByRole('button', { name: 'מחיקה לצמיתות' });
}

describe('AccountPrivacyCard: deleting the account', () => {
  beforeEach(() => {
    vi.mocked(deleteAccount).mockReset();
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
    vi.mocked(deleteAccount).mockResolvedValue({ ok: false, errorHe: 'הקוד הסודי שגוי.' });
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
