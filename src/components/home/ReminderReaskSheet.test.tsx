import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ReminderReaskSheet } from './ReminderReaskSheet';

const firebase = vi.hoisted(() => ({ auth: { currentUser: { uid: 'child-1', isAnonymous: false } as { uid: string; isAnonymous: boolean } } }));
vi.mock('../../services/firebase', () => ({ auth: firebase.auth, isFirebaseConfigured: true, getAppCheckToken: async () => null }));

const push = vi.hoisted(() => ({
  getReminderSupport: vi.fn(),
  isReminderOn: vi.fn(),
  enableReminder: vi.fn(),
  getNotificationPermission: vi.fn(),
}));
vi.mock('../../services/push/pushSubscription', () => push);

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../../services/analytics', () => analytics);

const onUpdateProfile = vi.fn();
const onClose = vi.fn();

beforeEach(() => {
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  Object.values(push).forEach((fn) => fn.mockReset());
  push.getReminderSupport.mockReturnValue('supported');
  push.isReminderOn.mockResolvedValue(false);
  push.enableReminder.mockResolvedValue({ ok: true });
  push.getNotificationPermission.mockReturnValue('default');
  analytics.trackEvent.mockReset();
  onUpdateProfile.mockReset();
  onClose.mockReset();
});

function renderSheet(profile = makeProfile({ reminderDeclinedAtStr: '2026-11-01' })) {
  render(<ReminderReaskSheet profile={profile} theme={TEST_THEME} onUpdateProfile={onUpdateProfile} onClose={onClose} />);
  return userEvent.setup();
}

describe('ReminderReaskSheet', () => {
  it('turns the reminder on, pays the gift and is never shown again', async () => {
    const user = renderSheet();
    await user.click(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' }));

    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in_reask');
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasEarnedReminderReward: true, hasSeenReminderReask: true }));
    expect(onClose).toHaveBeenCalled();
  });

  it('records a second "not now" and is never shown again', async () => {
    const user = renderSheet();
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));

    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_ask_declined');
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasSeenReminderReask: true, reminderDeclinedAtStr: expect.any(String) }));
    expect(onClose).toHaveBeenCalled();
  });

  it('stays open with the reason when the browser refuses', async () => {
    push.enableReminder.mockResolvedValue({ ok: false, errorHe: 'ההתראות חסומות', reason: 'denied' });
    const user = renderSheet();
    await user.click(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('ההתראות חסומות');
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_permission_denied');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows the Home Screen step on iPhone', async () => {
    push.getReminderSupport.mockReturnValue('needs-install');
    const user = renderSheet();
    await user.click(await screen.findByRole('button', { name: 'הבנתי' }));
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasSeenReminderReask: true }));
  });

  it('closes quietly, marked as shown, when the reminder is already on or blocked', async () => {
    push.isReminderOn.mockResolvedValue(true);
    renderSheet();
    await vi.waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ hasSeenReminderReask: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    onClose.mockReset();
    push.getNotificationPermission.mockReturnValue('denied');
    renderSheet();
    expect(onClose).toHaveBeenCalled();
  });
});
