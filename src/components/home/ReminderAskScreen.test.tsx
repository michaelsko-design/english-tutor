import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ReminderAskScreen } from './ReminderAskScreen';
import type { ReminderAskScreenSource } from '../../services/push/reminderOptIn';

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

function renderScreen(source: ReminderAskScreenSource = 'ask2', profile = makeProfile({ gender: 'girl' })) {
  render(<ReminderAskScreen profile={profile} theme={TEST_THEME} source={source} onUpdateProfile={onUpdateProfile} onClose={onClose} />);
  return userEvent.setup();
}

describe('ReminderAskScreen', () => {
  it('speaks to the child, shows the real message and asks the browser only after "yes"', async () => {
    const user = renderScreen();
    expect(await screen.findByRole('dialog')).toHaveTextContent('רוצה שאזכיר לך מחר?');
    expect(screen.getByText(/עוזרת ללמוד טוב יותר ולשמור על הרצף/)).toBeInTheDocument();
    expect(screen.queryByText(/להורים:/)).not.toBeInTheDocument();
    expect(push.enableReminder).not.toHaveBeenCalled();
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_ask_shown');

    await user.click(screen.getByRole('button', { name: 'כן, תזכירו לי' }));
    expect(push.enableReminder).toHaveBeenCalled();
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in_ask2');
    expect(await screen.findByText(/נתראה מחר/)).toBeInTheDocument();
    expect(screen.queryByText(/יהלומים/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ממשיכים' }));
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ reminderAskCount: 1, reminderLastAskedAtStr: expect.any(String) }));
    expect(onUpdateProfile.mock.calls[0][0].reminderDeclinedAtStr).toBeUndefined();
    expect(onClose).toHaveBeenCalled();
  });

  it('counts the source of the ask', async () => {
    const user = renderScreen('installed');
    await user.click(await screen.findByRole('button', { name: 'כן, תזכירו לי' }));
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in_installed');
  });

  it('records "not now" as an ask and a decline', async () => {
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_ask_declined');
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ reminderAskCount: 1, reminderDeclinedAtStr: expect.any(String) }));
    expect(onClose).toHaveBeenCalled();
  });

  it('the close button counts as "not now"', async () => {
    const user = renderScreen();
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ reminderDeclinedAtStr: expect.any(String) }));
  });

  it('explains how to unblock when the browser refuses', async () => {
    push.enableReminder.mockResolvedValue({ ok: false, errorHe: 'x', reason: 'denied' });
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'כן, תזכירו לי' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('סמל המנעול');
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_permission_denied');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('stays open with the reason when something else fails', async () => {
    push.enableReminder.mockResolvedValue({ ok: false, errorHe: 'לא הצלחנו', reason: 'failed' });
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'כן, תזכירו לי' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו');
    expect(screen.getByRole('button', { name: 'כן, תזכירו לי' })).toBeEnabled();
  });

  it('shows the three install steps on iPhone outside the Home Screen app', async () => {
    push.getReminderSupport.mockReturnValue('needs-install');
    const user = renderScreen();
    expect(await screen.findByRole('list', { name: 'שלבי ההוספה למסך הבית' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'הבנתי' }));
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ reminderAskCount: 1 }));
  });

  it('closes without counting an ask when the reminder is already on, blocked or the learner is a guest', async () => {
    push.isReminderOn.mockResolvedValue(true);
    renderScreen();
    await vi.waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    onClose.mockReset();
    push.getNotificationPermission.mockReturnValue('denied');
    renderScreen();
    expect(onClose).toHaveBeenCalled();

    onClose.mockReset();
    push.getNotificationPermission.mockReturnValue('default');
    firebase.auth.currentUser = { uid: 'guest', isAnonymous: true };
    renderScreen();
    expect(onClose).toHaveBeenCalled();
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });
});
