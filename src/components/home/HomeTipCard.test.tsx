import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { isHomeTipDismissed } from '../../data/homeTips';
import { HomeTipCard } from './HomeTipCard';

beforeEach(() => window.localStorage.clear());

function setup(stats: Record<string, number> = { missionsCompleted: 1, streakDays: 1, diamonds: 0 }, uid: string | null = 'kid-1') {
  const onOpenPlacement = vi.fn();
  const base = makeProfile({});
  const profile = makeProfile({ stats: { ...base.stats, ...stats } });
  render(<HomeTipCard profile={profile} uid={uid} theme={TEST_THEME} onOpenPlacement={onOpenPlacement} />);
  return { onOpenPlacement, user: userEvent.setup() };
}

describe('HomeTipCard', () => {
  it('shows the first useful tip', () => {
    setup();
    expect(screen.getByRole('region', { name: 'טיפ' })).toBeInTheDocument();
    expect(screen.getByText(/עד 3 כוכבים/)).toBeInTheDocument();
  });

  it('shows nothing before the learner has done anything', () => {
    setup({ missionsCompleted: 0, streakDays: 0, diamonds: 0 });
    expect(screen.queryByRole('region', { name: 'טיפ' })).not.toBeInTheDocument();
  });

  it('closes the tip for good, and the next one takes its place', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'הבנתי' }));
    expect(isHomeTipDismissed('kid-1', 'stars')).toBe(true);
    expect(screen.getByText(/רוצים שנתאים את הרמה/)).toBeInTheDocument();
  });

  it('opens the placement test from its tip and closes it', async () => {
    window.localStorage.setItem('english_tutor_home_tip_stars_kid-1', '1');
    const { user, onOpenPlacement } = setup();
    await user.click(screen.getByRole('button', { name: 'למבחן קצר' }));
    expect(onOpenPlacement).toHaveBeenCalledTimes(1);
    expect(isHomeTipDismissed('kid-1', 'placement')).toBe(true);
  });

  it('shows nothing without a signed-in learner to remember the tip for', () => {
    setup({ missionsCompleted: 1, streakDays: 1, diamonds: 0 }, null);
    expect(screen.queryByRole('region', { name: 'טיפ' })).not.toBeInTheDocument();
  });
});
