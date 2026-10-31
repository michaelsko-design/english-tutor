import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ReminderNudgeCard } from './ReminderNudgeCard';
import { isReminderNudgeDismissed } from './reminderNudge';

const firebase = vi.hoisted(() => ({ auth: { currentUser: { uid: 'child-1', isAnonymous: false } as { uid: string; isAnonymous: boolean } } }));
vi.mock('../../services/firebase', () => ({
  auth: firebase.auth,
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

const push = vi.hoisted(() => ({
  getReminderSupport: vi.fn(),
  isReminderOn: vi.fn(),
  enableReminder: vi.fn(),
}));
vi.mock('../../services/push/pushSubscription', () => push);

beforeEach(() => {
  window.localStorage.clear();
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  Object.values(push).forEach((fn) => fn.mockReset());
  push.getReminderSupport.mockReturnValue('supported');
  push.isReminderOn.mockResolvedValue(false);
  push.enableReminder.mockResolvedValue({ ok: true });
  onUpdateProfile.mockReset();
});

const onUpdateProfile = vi.fn();

function renderCard(isOnboarded = true) {
  render(<ReminderNudgeCard profile={makeProfile({ isOnboarded })} theme={TEST_THEME} onUpdateProfile={onUpdateProfile} />);
}

describe('ReminderNudgeCard', () => {
  it('turns the reminder on and goes away', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(await screen.findByRole('button', { name: 'להפעיל תזכורת' }));

    expect(push.enableReminder).toHaveBeenCalledWith('child-1', expect.objectContaining({ isShabbatObserver: expect.any(Boolean) }));
    expect(screen.queryByRole('region', { name: 'תזכורת יומית' })).not.toBeInTheDocument();
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasEarnedReminderReward: true }));
  });

  it('shows the reason when the browser blocks notifications', async () => {
    push.enableReminder.mockResolvedValue({ ok: false, errorHe: 'ההתראות חסומות' });
    const user = userEvent.setup();
    renderCard();

    await user.click(await screen.findByRole('button', { name: 'להפעיל תזכורת' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('ההתראות חסומות');
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('stays away after it is closed on this device', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(await screen.findByRole('button', { name: 'סגירה' }));

    expect(screen.queryByRole('region', { name: 'תזכורת יומית' })).not.toBeInTheDocument();
    expect(isReminderNudgeDismissed('child-1')).toBe(true);
  });

  it('explains the Home Screen install on iPhone without a switch', async () => {
    push.getReminderSupport.mockReturnValue('needs-install');
    renderCard();

    expect(await screen.findByText(/מסך הבית/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'להפעיל תזכורת' })).not.toBeInTheDocument();
  });

  it('does not show when already on, unsupported, a guest, before onboarding, or closed', async () => {
    push.isReminderOn.mockResolvedValue(true);
    renderCard();
    await vi.waitFor(() => expect(push.isReminderOn).toHaveBeenCalled());
    expect(screen.queryByRole('region', { name: 'תזכורת יומית' })).not.toBeInTheDocument();

    push.isReminderOn.mockClear();
    push.getReminderSupport.mockReturnValue('unsupported');
    renderCard();
    firebase.auth.currentUser = { uid: 'guest-1', isAnonymous: true };
    renderCard();
    firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
    push.getReminderSupport.mockReturnValue('supported');
    renderCard(false);
    window.localStorage.setItem('english_tutor_reminder_nudge_dismissed_child-1', '1');
    renderCard();

    expect(push.isReminderOn).not.toHaveBeenCalled();
  });
});
