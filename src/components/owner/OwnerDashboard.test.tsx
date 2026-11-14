import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OwnerStats } from '../../services/ownerStatsService';

type AuthListener = (user: unknown) => void;
const firebaseMock = vi.hoisted(() => ({
  listener: null as null | ((user: unknown) => void),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../../services/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, listener: AuthListener) => {
    firebaseMock.listener = listener;
    return () => {};
  },
  signInWithPopup: (...args: unknown[]) => firebaseMock.signInWithPopup(...args),
  signOut: (...args: unknown[]) => firebaseMock.signOut(...args),
}));

const mockFetchOwnerStats = vi.fn();
vi.mock('../../services/ownerStatsService', () => ({
  fetchOwnerStats: () => mockFetchOwnerStats(),
}));

vi.mock('../../services/ownerTestUsersService', () => ({
  fetchTestUsers: async () => ({ ok: true, users: [] }),
  addTestUser: async () => ({ ok: true, users: [] }),
  removeTestUser: async () => ({ ok: true, users: [] }),
}));

import { OwnerDashboard } from './OwnerDashboard';

const mockStats: OwnerStats = {
  generatedAt: '2026-10-31T15:00:00Z',
  totals: {
    registered: 120,
    guests: 30,
    pro: 24,
    onboarded: 100,
  },
  active: {
    last1d: 25,
    last7d: 85,
    last30d: 110,
  },
  averages: {
    windowDays: 28,
    missionsPerActiveDay: 3.5,
    minutesPerActiveDay: 14.2,
    trackedShare: 0.82,
  },
  byGrade: [
    {
      gradeId: 'grade-1',
      users: 40,
      proUsers: 10,
      missionsPerActiveUser7d: 5.2,
    },
    {
      gradeId: 'grade-2',
      users: 50,
      proUsers: 12,
      missionsPerActiveUser7d: 6.8,
    },
    {
      gradeId: 'grade-3',
      users: 30,
      proUsers: 2,
      missionsPerActiveUser7d: 4.1,
    },
  ],
  daily: [
    {
      dateStr: '2026-10-24', // Friday
      activeUsers: 15,
      missions: 45,
      activeMinutes: 180,
    },
    {
      dateStr: '2026-10-25', // Saturday
      activeUsers: 12,
      missions: 35,
      activeMinutes: 150,
    },
    {
      dateStr: '2026-10-26', // Sunday
      activeUsers: 28,
      missions: 95,
      activeMinutes: 380,
    },
  ],
  parents: {
    withChildren: 18,
    links: 25,
    avgKidsPerParent: 1.39,
  },
  reminders: {
    subscribers: 48,
    windowDays: 14,
    sent: 110,
    practised: 44,
    conversionRate: 0.4,
    byKind: {
      streak: { sent: 70, practised: 32 },
      comeback: { sent: 40, practised: 12 },
    },
    daily: [
      { dateStr: '2026-10-24', sent: 12, practised: 5 },
      { dateStr: '2026-10-25', sent: 10, practised: 4 },
      { dateStr: '2026-10-26', sent: 15, practised: 7 },
    ],
  },
  excludedTestUsers: 2,
};

const mockGoogleUser = {
  uid: 'owner-uid',
  isAnonymous: false,
  providerData: [{ providerId: 'google.com' }],
};

beforeEach(() => {
  firebaseMock.listener = null;
  firebaseMock.signInWithPopup.mockReset();
  firebaseMock.signOut.mockReset();
  mockFetchOwnerStats.mockReset();
  window.history.replaceState(null, '', window.location.pathname);
});

describe('OwnerDashboard', () => {
  it('renders Google sign-in prompt when not authenticated with Google', async () => {
    render(<OwnerDashboard />);
    // simulate anonymous / non-google user
    firebaseMock.listener?.(null);

    expect(await screen.findByText("Owner Verification Required")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  it('triggers Google popup sign-in on button click', async () => {
    render(<OwnerDashboard />);
    firebaseMock.listener?.(null);

    const button = await screen.findByRole('button', { name: /Sign in with Google/i });
    fireEvent.click(button);

    expect(firebaseMock.signInWithPopup).toHaveBeenCalledTimes(1);
  });

  async function renderReady() {
    mockFetchOwnerStats.mockResolvedValue({ ok: true, stats: mockStats });
    render(<OwnerDashboard />);
    firebaseMock.listener?.(mockGoogleUser);
    expect(await screen.findByText('EnglishVibe · Owner Command')).toBeInTheDocument();
    await screen.findByRole('tablist');
  }

  it('opens on the Overview tab with KPIs and the activity chart', async () => {
    await renderReady();
    expect(screen.getByText('Live Aggregates')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');

    expect(screen.getAllByText('Total Learners')[0]).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('30 guests')).toBeInTheDocument();
    expect(screen.getByText('Pro Subscribers')).toBeInTheDocument();
    expect(screen.getByText('20% of registered')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Daily Learning Activity')).toBeInTheDocument();
    expect(screen.getByText('14-Day Missions:')).toBeInTheDocument();
    expect(screen.getByText('175')).toBeInTheDocument();

    // Other tabs' content is not rendered
    expect(screen.queryByText('Learners by Grade')).not.toBeInTheDocument();
    expect(screen.getByText(/2 test accounts excluded/)).toBeInTheDocument();
  });

  it('shows grades and families on the Learners tab', async () => {
    await renderReady();
    fireEvent.click(screen.getByRole('tab', { name: 'Learners' }));

    expect(screen.getByText('Learners by Grade')).toBeInTheDocument();
    expect(screen.getByText('Grade 1')).toBeInTheDocument();
    expect(screen.getByText('Grade 3')).toBeInTheDocument();
    expect(screen.getByText('Top Velocity: Grade 2')).toBeInTheDocument();
    expect(screen.getByText('Family & Parent Ecosystem')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('1.39')).toBeInTheDocument();
  });

  it('shows the reminder engine on the Engagement tab', async () => {
    await renderReady();
    fireEvent.click(screen.getByRole('tab', { name: 'Engagement' }));

    expect(screen.getByText('Streak Reminder Engine')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('Rescue Rate')).toBeInTheDocument();
    expect(screen.getByText('Keep your streak')).toBeInTheDocument();
    expect(screen.getByText('Come back')).toBeInTheDocument();
  });

  it('shows the tester lists on the Testers tab', async () => {
    await renderReady();
    fireEvent.click(screen.getByRole('tab', { name: 'Testers' }));

    expect(await screen.findByRole('heading', { name: /^Test accounts/ })).toBeInTheDocument();
    expect(window.location.hash).toBe('#testers');
  });

  it('opens the tab named in the URL hash', async () => {
    window.location.hash = '#learners';
    await renderReady();
    expect(screen.getByRole('tab', { name: 'Learners' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Learners by Grade')).toBeInTheDocument();
  });

  it('falls back to Overview for an unknown hash', async () => {
    window.location.hash = '#nonsense';
    await renderReady();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('moves between tabs with the arrow keys', async () => {
    await renderReady();
    const overview = screen.getByRole('tab', { name: 'Overview' });
    fireEvent.keyDown(overview, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Funnel' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Funnel' }), { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('pins the header, with Refresh inside it, and keeps the tab after refreshing', async () => {
    await renderReady();
    const header = screen.getByTestId('owner-header');
    expect(header.className).toContain('sticky');
    expect(header).toContainElement(screen.getByRole('button', { name: /Refresh/i }));

    fireEvent.click(screen.getByRole('tab', { name: 'Learners' }));
    fireEvent.click(screen.getByRole('button', { name: /Refresh/i }));
    await waitFor(() => expect(mockFetchOwnerStats).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('tab', { name: 'Learners' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Learners by Grade')).toBeInTheDocument();
  });

  it('allows manual refresh', async () => {
    mockFetchOwnerStats.mockResolvedValue({ ok: true, stats: mockStats });

    render(<OwnerDashboard />);
    firebaseMock.listener?.(mockGoogleUser);

    expect(await screen.findByText('EnglishVibe · Owner Command')).toBeInTheDocument();
    expect(mockFetchOwnerStats).toHaveBeenCalledTimes(1);

    const refreshBtn = screen.getByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(mockFetchOwnerStats).toHaveBeenCalledTimes(2);
    });
  });

  it('displays error message when stats fetch fails', async () => {
    mockFetchOwnerStats.mockResolvedValue({ ok: false, message: 'This account is not the owner.' });

    render(<OwnerDashboard />);
    firebaseMock.listener?.(mockGoogleUser);

    expect(await screen.findByRole('alert')).toHaveTextContent('This account is not the owner.');
  });
});
