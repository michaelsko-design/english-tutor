import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FriendLookupEntry } from '../../data/friends';
import { TEST_THEME } from '../../test/fixtures';
import { AddFriendPanel } from './AddFriendPanel';

const lookupFriend = vi.hoisted(() => vi.fn());
vi.mock('../../services/friendsService', () => ({ lookupFriend }));

const ENTRY = { uid: 'u1', displayName: 'דנה', avatarEmoji: '🐱' } as FriendLookupEntry;
const onSend = vi.fn();

function setup(props: { initialQuery?: string; isBusy?: boolean } = {}) {
  render(<AddFriendPanel gender="girl" theme={TEST_THEME} isBusy={props.isBusy ?? false} initialQuery={props.initialQuery} onSend={onSend} />);
  return userEvent.setup();
}

const box = () => screen.getByLabelText('קוד חבר או שם משתמש');
const searchButton = () => screen.getByRole('button', { name: /חיפוש/ });

beforeEach(() => {
  lookupFriend.mockReset();
  onSend.mockClear();
});

describe('AddFriendPanel', () => {
  it('keeps the search button off until the text is a usable code or name', async () => {
    const user = setup();
    expect(searchButton()).toBeDisabled();
    await user.type(box(), 'K7MP2Q');
    expect(searchButton()).toBeEnabled();
  });

  it('shows a match and sends the request, then clears the form', async () => {
    lookupFriend.mockResolvedValue({ ok: true, value: [{ entry: ENTRY, via: 'code' }] });
    const user = setup();
    await user.type(box(), 'K7MP2Q');
    await user.click(searchButton());
    expect(await screen.findByText('לפי קוד חבר')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /שליחת בקשת חברות/ }));
    expect(onSend).toHaveBeenCalledWith(ENTRY);
    expect(box()).toHaveValue('');
    expect(screen.queryByText('דנה')).not.toBeInTheDocument();
  });

  it('labels a username match and disables sending while busy', async () => {
    lookupFriend.mockResolvedValue({ ok: true, value: [{ entry: ENTRY, via: 'username' }] });
    const user = setup({ isBusy: true });
    await user.type(box(), 'dana12');
    await user.click(searchButton());
    expect(await screen.findByText('לפי שם משתמש')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /שליחת בקשת חברות/ })).toBeDisabled();
  });

  it('says so when nobody matches', async () => {
    lookupFriend.mockResolvedValue({ ok: true, value: [] });
    const user = setup();
    await user.type(box(), 'K7MP2Q');
    await user.click(searchButton());
    expect(await screen.findByText(/לא מצאנו את הקוד או השם הזה/)).toBeInTheDocument();
  });

  it('shows a service error', async () => {
    lookupFriend.mockResolvedValue({ ok: false, errorHe: 'אין חיבור כרגע' });
    const user = setup();
    await user.type(box(), 'K7MP2Q');
    await user.click(searchButton());
    expect(await screen.findByText('אין חיבור כרגע')).toBeInTheDocument();
  });

  it('looks up an invite code once, right away', async () => {
    lookupFriend.mockResolvedValue({ ok: true, value: [{ entry: ENTRY, via: 'code' }] });
    setup({ initialQuery: 'K7MP2Q' });
    expect(await screen.findByText('דנה')).toBeInTheDocument();
    expect(lookupFriend).toHaveBeenCalledTimes(1);
    expect(lookupFriend).toHaveBeenCalledWith('K7MP2Q');
  });

  it('drops a result when the text changes while the search runs', async () => {
    let resolve: (v: unknown) => void = () => undefined;
    lookupFriend.mockReturnValue(new Promise((r) => { resolve = r; }));
    const user = setup();
    await user.type(box(), 'K7MP2Q');
    await user.click(searchButton());
    expect(screen.getByText('מחפשים...')).toBeInTheDocument();
    await user.type(box(), 'X');
    resolve({ ok: true, value: [{ entry: ENTRY, via: 'code' }] });
    await Promise.resolve();
    expect(screen.queryByText('דנה')).not.toBeInTheDocument();
  });
});
