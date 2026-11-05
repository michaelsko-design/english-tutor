import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FriendLink } from '../../data/friends';
import type { FriendsHubData } from '../../hooks/useFriendsHub';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { FriendsScreen } from './FriendsScreen';

const svc = vi.hoisted(() => ({
  acceptFriendRequest: vi.fn(),
  deleteFriendship: vi.fn(),
  sendFriendRequest: vi.fn(),
  sendReaction: vi.fn(),
}));
vi.mock('../../services/friendsService', () => svc);
vi.mock('./AddFriendPanel', () => ({
  AddFriendPanel: ({ onSend, initialQuery }: { onSend: (t: unknown) => void; initialQuery?: string }) => (
    <div>
      <span>{`query:${initialQuery ?? ''}`}</span>
      <button type="button" onClick={() => onSend({ uid: 'new', displayName: 'גל', avatarEmoji: '🐶' })}>send-new</button>
      <button type="button" onClick={() => onSend({ uid: 'me', displayName: 'אני', avatarEmoji: '🐶' })}>send-self</button>
      <button type="button" onClick={() => onSend({ uid: 'f1', displayName: 'דנה', avatarEmoji: '🐱' })}>send-friend</button>
    </div>
  ),
}));
vi.mock('./FriendCard', () => ({
  FriendCard: ({ friend, onReact, onRemove, children }: { friend: FriendLink; onReact: (e: string) => void; onRemove: () => void; children?: React.ReactNode }) => (
    <li>
      <span>{friend.fallbackName}</span>
      <button type="button" onClick={() => onReact('👍')}>react</button>
      <button type="button" onClick={onRemove}>remove</button>
      {children}
    </li>
  ),
}));
vi.mock('./MyFriendCodePanel', () => ({ MyFriendCodePanel: () => null }));

const link = (uid: string, name: string): FriendLink => ({
  friendshipId: `fs-${uid}`,
  friendUid: uid,
  fallbackName: name,
  fallbackAvatar: '🙂',
  createdAt: '2026-11-01T00:00:00.000Z',
});

const ME = { uid: 'me', email: 'm@x.test', displayName: 'נועה', avatarEmoji: '🦊' };
const onClose = vi.fn();

function setup(over: Omit<Partial<FriendsHubData>, 'friendships'> & { friendships?: Partial<FriendsHubData['friendships']> } = {}, extras: { contestError?: string; invite?: string } = {}) {
  const hub = {
    status: 'ready',
    profiles: {},
    errorHe: '',
    contests: [],
    ...over,
    friendships: { accepted: [], incoming: [], outgoing: [], ...over.friendships },
  } as unknown as FriendsHubData;
  render(
    <FriendsScreen
      profile={makeProfile({ gender: 'boy' })}
      me={ME}
      hub={hub}
      theme={TEST_THEME}
      initialInviteCode={extras.invite}
      contestErrorHe={extras.contestError}
      renderFriendExtras={() => <span>extras</span>}
      onClose={onClose}
    />
  );
  return userEvent.setup();
}

beforeEach(() => {
  Object.values(svc).forEach((f) => f.mockReset().mockResolvedValue({ ok: true, data: undefined }));
  onClose.mockClear();
});

describe('FriendsScreen', () => {
  it('shows the empty state, the loading state and hub errors', () => {
    setup({ status: 'loading', errorHe: 'שגיאת רשת' });
    expect(screen.getByText('טוען חברים...')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('שגיאת רשת');
  });

  it('invites a first friend when the list is empty', () => {
    setup();
    expect(screen.getByText(/עדיין אין חברים/)).toBeInTheDocument();
  });

  it('shows a contest error and passes the invite code on', () => {
    setup({}, { contestError: 'האתגר נכשל', invite: 'ABC' });
    expect(screen.getByRole('alert')).toHaveTextContent('האתגר נכשל');
    expect(screen.getByText('query:ABC')).toBeInTheDocument();
  });

  it('accepts and declines incoming requests', async () => {
    const user = setup({ friendships: { incoming: [link('a', 'רן')] } });
    await user.click(screen.getByRole('button', { name: 'אשר' }));
    expect(svc.acceptFriendRequest).toHaveBeenCalledWith('fs-a');
    expect(await screen.findByRole('status')).toHaveTextContent('אתה ורן חברים עכשיו');
    await user.click(screen.getByRole('button', { name: 'לא תודה' }));
    expect(svc.deleteFriendship).toHaveBeenCalledWith('fs-a');
  });

  it('reacts to and removes a friend, with the extras rendered', async () => {
    const user = setup({ friendships: { accepted: [link('f1', 'דנה')] } });
    expect(screen.getByText('extras')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'react' }));
    expect(svc.sendReaction).toHaveBeenCalledWith('fs-f1', 'me', '👍');
    expect(await screen.findByRole('status')).toHaveTextContent('העידוד 👍 נשלח');
    await user.click(screen.getByRole('button', { name: 'remove' }));
    expect(svc.deleteFriendship).toHaveBeenCalledWith('fs-f1');
  });

  it('cancels an outgoing request', async () => {
    const user = setup({ friendships: { outgoing: [link('o', 'שי')] } });
    await user.click(screen.getByRole('button', { name: 'ביטול הבקשה לשי' }));
    expect(svc.deleteFriendship).toHaveBeenCalledWith('fs-o');
  });

  it('sends a new request and says so', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'send-new' }));
    expect(svc.sendFriendRequest).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('status')).toHaveTextContent('הבקשה נשלחה לגל');
  });

  it('refuses your own code and a friend you already have', async () => {
    const user = setup({ friendships: { accepted: [link('f1', 'דנה')] } });
    await user.click(screen.getByRole('button', { name: 'send-self' }));
    expect(await screen.findByRole('status')).toHaveTextContent('זה הקוד שלך');
    await user.click(screen.getByRole('button', { name: 'send-friend' }));
    expect(await screen.findByText(/כבר ברשימת החברים/)).toBeInTheDocument();
    expect(svc.sendFriendRequest).not.toHaveBeenCalled();
  });

  it('shows the service error when a request fails', async () => {
    svc.sendFriendRequest.mockResolvedValue({ ok: false, errorHe: 'אין חיבור' });
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'send-new' }));
    expect(await screen.findByRole('status')).toHaveTextContent('אין חיבור');
  });
});
