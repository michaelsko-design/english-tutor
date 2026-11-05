import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FriendLink, PublicProfile } from '../../data/friends';
import { TEST_THEME } from '../../test/fixtures';
import { FriendCard } from './FriendCard';

const LINK: FriendLink = {
  friendshipId: 'f1',
  friendUid: 'u1',
  fallbackName: 'דנה',
  fallbackAvatar: '🐱',
  createdAt: '2026-11-01T00:00:00.000Z',
};
const PROFILE: PublicProfile = { displayName: 'דנה כהן', avatarEmoji: '🦊', level: 7, streakDays: 4, stars: 31, missionsCompleted: 12 };

const onReact = vi.fn();
const onRemove = vi.fn();

function setup(opts: { friend?: FriendLink; profile?: PublicProfile | null | undefined; isBusy?: boolean; gender?: 'girl' | 'boy' } = {}) {
  render(
    <ul>
      <FriendCard
        friend={opts.friend ?? LINK}
        publicProfile={'profile' in opts ? opts.profile : PROFILE}
        gender={opts.gender ?? 'girl'}
        theme={TEST_THEME}
        isBusy={opts.isBusy ?? false}
        onReact={onReact}
        onRemove={onRemove}
      >
        <span>extra-actions</span>
      </FriendCard>
    </ul>
  );
  return userEvent.setup();
}

beforeEach(() => {
  onReact.mockClear();
  onRemove.mockClear();
});

describe('FriendCard', () => {
  it('shows the public profile with level and stats, and the extra actions', () => {
    setup();
    expect(screen.getByText('דנה כהן')).toBeInTheDocument();
    expect(screen.getByText('Lv.7')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText('משימות הושלמו')).toBeInTheDocument();
    expect(screen.getByText('extra-actions')).toBeInTheDocument();
  });

  it('falls back to the saved name while the profile loads', () => {
    setup({ profile: undefined });
    expect(screen.getByText('דנה')).toBeInTheDocument();
    expect(screen.getByText('טוען...')).toBeInTheDocument();
  });

  it('says the progress is unavailable when the friend turned the hub off', () => {
    setup({ profile: null });
    expect(screen.getByText('ההתקדמות לא זמינה כרגע')).toBeInTheDocument();
    expect(screen.queryByText('ימי רצף')).not.toBeInTheDocument();
  });

  it('sends a reaction and marks the one already sent', async () => {
    const user = setup({ friend: { ...LINK, myReaction: { emoji: '🔥' } as never } });
    expect(screen.getByRole('button', { name: 'אש' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'כוכב' }));
    expect(onReact).toHaveBeenCalledWith('⭐');
  });

  it('shows the reaction the friend sent', () => {
    setup({ friend: { ...LINK, theirReaction: { emoji: '🎉' } as never } });
    expect(screen.getByRole('img', { name: /עידוד מדנה כהן: 🎉/ })).toBeInTheDocument();
  });

  it('asks before removing, and removes only on confirm', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'הסרת דנה כהן מהחברים' }));
    await user.click(screen.getByRole('button', { name: 'ביטול' }));
    expect(onRemove).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'הסרת דנה כהן מהחברים' }));
    await user.click(screen.getByRole('button', { name: 'כן, להסיר' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables actions while busy and uses masculine copy for a boy', () => {
    setup({ isBusy: true, gender: 'boy' });
    expect(screen.getByRole('button', { name: 'אש' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'הסרת דנה כהן מהחברים' })).toBeDisabled();
    expect(screen.getByText('שלח עידוד:')).toBeInTheDocument();
  });
});
