import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { WeekOneCard } from './WeekOneCard';

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../../services/analytics', () => analytics);

const entry = (dateStr: string, sessions: number, starsGained: number) => ({
  dateStr, sessions, voiceWords: 0, threeStarSessions: 0, xpEarned: 0, starsGained, missionStars: {}, firstCompletedIds: [],
});
const profile = makeProfile({
  createdAt: '2026-11-01T12:00:00',
  activityLog: [entry('2026-11-01', 1, 3), entry('2026-11-03', 2, 5)],
});

describe('WeekOneCard', () => {
  it('shows the first week once a week has passed, and marks it seen when closed', async () => {
    const onUpdateProfile = vi.fn();
    render(<WeekOneCard profile={profile} theme={TEST_THEME} todayStr="2026-11-08" onUpdateProfile={onUpdateProfile} />);
    expect(screen.getByText(/תרגלתם 2 ימים, סיימתם 3 משימות והרווחתם 8 כוכבים/)).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole('button', { name: /ממשיכים/ }));
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasSeenWeekOneSummary: true }));
    expect(analytics.trackEvent).toHaveBeenCalledWith('week_one_seen');
  });

  it('shows nothing before day 7', () => {
    const { container } = render(<WeekOneCard profile={profile} theme={TEST_THEME} todayStr="2026-11-05" onUpdateProfile={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
