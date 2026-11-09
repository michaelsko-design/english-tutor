import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { FirstWinScreen } from './FirstWinScreen';

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

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../../services/analytics', () => analytics);

const onUpdateProfile = vi.fn();
const onContinue = vi.fn();

beforeEach(() => {
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  Object.values(push).forEach((fn) => fn.mockReset());
  push.getReminderSupport.mockReturnValue('supported');
  push.isReminderOn.mockResolvedValue(false);
  push.enableReminder.mockResolvedValue({ ok: true });
  onUpdateProfile.mockReset();
  onContinue.mockReset();
  analytics.trackEvent.mockReset();
});

function renderScreen(profile = makeProfile({ name: 'נועה' })) {
  render(
    <FirstWinScreen profile={profile} theme={TEST_THEME} streakDays={1} onUpdateProfile={onUpdateProfile} onContinue={onContinue} />
  );
  return userEvent.setup();
}

describe('FirstWinScreen', () => {
  it('celebrates the first lesson and the first streak day', async () => {
    renderScreen();
    expect(screen.getByRole('heading', { name: /כל הכבוד/ })).toBeInTheDocument();
    expect(screen.getByText(/יום 1 ברצף/)).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' })).toBeInTheDocument();
  });

  it('turns the reminder on, pays the one-time gift and goes on', async () => {
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' }));

    expect(push.enableReminder).toHaveBeenCalledWith('child-1', expect.objectContaining({ isShabbatObserver: expect.any(Boolean) }));
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasEarnedReminderReward: true }));
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in');
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('goes on without a reminder when the learner says not now', async () => {
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    expect(push.enableReminder).not.toHaveBeenCalled();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('stays, with the reason, when the browser blocks notifications', async () => {
    push.enableReminder.mockResolvedValue({ ok: false, errorHe: 'ההתראות חסומות' });
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('ההתראות חסומות');
    expect(onContinue).not.toHaveBeenCalled();
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('only celebrates when the reminder is already on', async () => {
    push.isReminderOn.mockResolvedValue(true);
    renderScreen();
    expect(await screen.findByRole('button', { name: 'ממשיכים' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'כן, להפעיל תזכורת' })).not.toBeInTheDocument();
  });

  it('does not hold the learner when it cannot tell whether the reminder is on', async () => {
    push.isReminderOn.mockRejectedValue(new Error('offline'));
    renderScreen();
    expect(await screen.findByRole('button', { name: 'ממשיכים' })).toBeInTheDocument();
  });

  it('only celebrates where reminders are impossible', async () => {
    push.getReminderSupport.mockReturnValue('unsupported');
    renderScreen();
    expect(await screen.findByRole('button', { name: 'ממשיכים' })).toBeInTheDocument();
    expect(screen.queryByText(/תזכורת קטנה/)).not.toBeInTheDocument();
  });

  it('explains the Home Screen step on iPhone instead of asking', async () => {
    push.getReminderSupport.mockReturnValue('needs-install');
    renderScreen();
    expect(await screen.findByText(/Add to Home Screen/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'כן, להפעיל תזכורת' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ממשיכים' })).toBeInTheDocument();
  });

  it('does not ask a guest, who cannot receive reminders', async () => {
    firebase.auth.currentUser = { uid: 'guest-1', isAnonymous: true };
    renderScreen();
    expect(await screen.findByRole('button', { name: 'ממשיכים' })).toBeInTheDocument();
    expect(push.enableReminder).not.toHaveBeenCalled();
  });
});
