import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { WelcomeBackCard } from './WelcomeBackCard';

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../../services/analytics', () => analytics);

const TODAY = '2026-11-10';

function setup(overrides: Record<string, unknown> = {}) {
  const onUpdateProfile = vi.fn();
  const base = makeProfile({});
  const profile = makeProfile({
    stats: { ...base.stats, totalActiveDays: 1, streakDays: 1, streakLastDateStr: '2026-11-09' },
    ...overrides,
  });
  render(<WelcomeBackCard profile={profile} theme={TEST_THEME} todayStr={TODAY} onUpdateProfile={onUpdateProfile} />);
  return { onUpdateProfile, user: userEvent.setup(), profile };
}

describe('WelcomeBackCard', () => {
  it('offers the 20-gem gift to a learner coming back after their first day', () => {
    setup();
    expect(screen.getByRole('region', { name: 'מתנת ברוכים השבים' })).toBeInTheDocument();
    expect(screen.getByText(/20 יהלומים/)).toBeInTheDocument();
  });

  it('claims the gift: pays the gems, marks it and counts it', async () => {
    const { onUpdateProfile, user, profile } = setup();
    await user.click(screen.getByRole('button', { name: 'לוקחים את המתנה' }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(onUpdateProfile.mock.calls[0][0]).toMatchObject({
      hasClaimedWelcomeBack: true,
      stats: { diamonds: profile.stats.diamonds + 20 },
    });
    expect(analytics.trackEvent).toHaveBeenCalledWith('welcome_back_claimed');
  });

  it('shows nothing once claimed', () => {
    setup({ hasClaimedWelcomeBack: true });
    expect(screen.queryByRole('region', { name: 'מתנת ברוכים השבים' })).not.toBeInTheDocument();
  });

  it('shows nothing on the first day', () => {
    setup({ stats: { ...makeProfile({}).stats, totalActiveDays: 1, streakLastDateStr: TODAY } });
    expect(screen.queryByRole('region', { name: 'מתנת ברוכים השבים' })).not.toBeInTheDocument();
  });
});
