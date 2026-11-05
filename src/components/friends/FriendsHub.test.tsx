import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FriendLink } from '../../data/friends';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { FriendsHub } from './FriendsHub';

const hubData = vi.hoisted(() => ({
  value: {
    status: 'ready',
    friendships: { accepted: [] as unknown[], incoming: [] as unknown[], outgoing: [] as unknown[] },
    profiles: {},
    errorHe: '',
    contests: [] as unknown[],
  },
}));

vi.mock('../../hooks/useFriendsHub', () => ({ useFriendsHub: () => hubData.value }));
vi.mock('../../services/friendsService', () => ({
  createContestDoc: vi.fn(),
  respondToContest: vi.fn(),
  submitContestResult: vi.fn(),
}));
vi.mock('./FriendsScreen', () => ({
  FriendsScreen: ({ initialInviteCode, onClose }: { initialInviteCode?: string; onClose: () => void }) => (
    <button type="button" onClick={onClose}>{`screen:${initialInviteCode ?? 'none'}`}</button>
  ),
}));
vi.mock('./ContestRunner', () => ({ ContestRunner: () => null }));
vi.mock('./ContestResultView', () => ({ ContestResultView: () => null }));

const USER = { uid: 'me', email: 'me@x.test', displayName: 'נועה', isAnonymous: false };
const ON = { friendsHub: { isEnabled: true } as never };
const onUpdateProfile = vi.fn();
const onInviteHandled = vi.fn();

function setup(opts: { profile?: Parameters<typeof makeProfile>[0]; user?: typeof USER | null; invite?: string | null } = {}) {
  const { container } = render(
    <FriendsHub
      profile={makeProfile(opts.profile ?? ON)}
      authUser={opts.user === undefined ? USER : opts.user}
      theme={TEST_THEME}
      avatarEmoji="🦊"
      onUpdateProfile={onUpdateProfile}
      onSpeakEnglish={vi.fn()}
      pendingInviteCode={opts.invite ?? null}
      onInviteHandled={onInviteHandled}
    />
  );
  return { container, user: userEvent.setup() };
}

const friend = (uid: string): FriendLink => ({
  friendshipId: `f-${uid}`,
  friendUid: uid,
  fallbackName: 'דנה',
  fallbackAvatar: '🐱',
  createdAt: '2026-11-01T00:00:00.000Z',
});

beforeEach(() => {
  hubData.value = { status: 'ready', friendships: { accepted: [], incoming: [], outgoing: [] }, profiles: {}, errorHe: '', contests: [] };
  onUpdateProfile.mockClear();
  onInviteHandled.mockClear();
});

describe('FriendsHub', () => {
  it('renders nothing when the hub is turned off', () => {
    expect(setup({ profile: { friendsHub: { isEnabled: false } as never } }).container).toBeEmptyDOMElement();
  });

  it('renders nothing for a guest account or without a user', () => {
    expect(setup({ user: { ...USER, isAnonymous: true } }).container).toBeEmptyDOMElement();
    expect(setup({ user: null }).container).toBeEmptyDOMElement();
  });

  it('shows the dock tile and opens and closes the friends screen', async () => {
    const { user } = setup();
    const tile = screen.getByRole('button', { name: 'חברים' });
    await user.click(tile);
    await user.click(await screen.findByRole('button', { name: 'screen:none' }));
    expect(screen.queryByRole('button', { name: /screen:/ })).not.toBeInTheDocument();
  });

  it('marks the tile with waiting friend requests', () => {
    hubData.value.friendships.incoming = [friend('a'), friend('b')];
    setup();
    expect(screen.getByRole('button', { name: /2 בקשות חברות מחכות/ })).toBeInTheDocument();
  });

  it('says one request in the singular', () => {
    hubData.value.friendships.incoming = [friend('a')];
    setup();
    expect(screen.getByRole('button', { name: /בקשת חברות אחת מחכה/ })).toBeInTheDocument();
  });

  it('opens the hub with the invite code from a link, once', async () => {
    setup({ invite: 'ABC123' });
    expect(await screen.findByRole('button', { name: 'screen:ABC123' })).toBeInTheDocument();
    expect(onInviteHandled).toHaveBeenCalledTimes(1);
  });

  it('ignores an invite link for a guest account', () => {
    setup({ user: { ...USER, isAnonymous: true }, invite: 'ABC123' });
    expect(onInviteHandled).not.toHaveBeenCalled();
  });
});
