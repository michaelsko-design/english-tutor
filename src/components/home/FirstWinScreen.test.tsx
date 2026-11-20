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
  getNotificationPermission: vi.fn(),
}));
vi.mock('../../services/push/pushSubscription', () => push);

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../../services/analytics', () => analytics);

const parents = vi.hoisted(() => ({ listParentsOfChild: vi.fn(), createParentInvite: vi.fn() }));
vi.mock('../../services/parentService', () => parents);

const onUpdateProfile = vi.fn();
const onContinue = vi.fn();

beforeEach(() => {
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  Object.values(push).forEach((fn) => fn.mockReset());
  push.getReminderSupport.mockReturnValue('supported');
  push.isReminderOn.mockResolvedValue(false);
  push.enableReminder.mockResolvedValue({ ok: true });
  push.getNotificationPermission.mockReturnValue('default');
  parents.listParentsOfChild.mockReset().mockResolvedValue([]);
  parents.createParentInvite.mockReset().mockResolvedValue({ ok: true, value: { code: 'ABC123', invite: {} } });
  Object.defineProperty(navigator, 'share', { value: vi.fn().mockResolvedValue(undefined), configurable: true });
  onUpdateProfile.mockReset();
  onContinue.mockReset();
  analytics.trackEvent.mockReset();
});

function renderScreenWith(profile: ReturnType<typeof makeProfile>) {
  return render(
    <FirstWinScreen profile={profile} theme={TEST_THEME} streakDays={1} onUpdateProfile={onUpdateProfile} onContinue={onContinue} />
  );
}

function renderScreen(profile = makeProfile({ name: 'נועה' })) {
  render(
    <FirstWinScreen profile={profile} theme={TEST_THEME} streakDays={1} onUpdateProfile={onUpdateProfile} onContinue={onContinue} />
  );
  return userEvent.setup();
}

describe('FirstWinScreen', () => {
  it("tells a new learner about tomorrow's gift, and not one who already claimed it", async () => {
    const { unmount } = renderScreenWith(makeProfile({ name: 'נועה' }));
    expect(screen.getByText(/מחר מחכה לכם מתנה: 20/)).toBeInTheDocument();
    unmount();
    renderScreenWith(makeProfile({ name: 'נועה', hasClaimedWelcomeBack: true }));
    expect(screen.queryByText(/מחר מחכה לכם מתנה/)).not.toBeInTheDocument();
  });

  it('celebrates the first lesson and the first streak day', async () => {
    renderScreen();
    expect(screen.getByRole('heading', { name: /כל הכבוד/ })).toBeInTheDocument();
    expect(screen.getByText(/יום 1 ברצף/)).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' })).toBeInTheDocument();
  });

  it('offers the reminder as help for the streak, with no gift for turning it on, and goes on', async () => {
    const user = renderScreen();
    expect(await screen.findByText(/עוזרת לשמור על הרצף/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'תזכורת יומית' })).not.toHaveTextContent(/יהלומים|💎/);
    await user.click(await screen.findByRole('button', { name: 'כן, להפעיל תזכורת' }));

    expect(push.enableReminder).toHaveBeenCalledWith('child-1', expect.objectContaining({ isShabbatObserver: expect.any(Boolean) }));
    expect(onUpdateProfile).not.toHaveBeenCalled();
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in');
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in_firstwin');
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('remembers a "not now" and moves on to the parent share', async () => {
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    expect(push.enableReminder).not.toHaveBeenCalled();
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_ask_declined');
    expect(onUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ reminderDeclinedAtStr: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) }));
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
  });

  it('does not ask for the reminder when the browser already blocks notifications', async () => {
    push.getNotificationPermission.mockReturnValue('denied');
    renderScreen();
    expect(await screen.findByRole('button', { name: 'ממשיכים' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'כן, להפעיל תזכורת' })).not.toBeInTheDocument();
    expect(push.isReminderOn).not.toHaveBeenCalled();
  });

  it('shares the first win with a parent link and pays the gift once', async () => {
    const profile = makeProfile({ name: 'נועה', gradeId: 'grade-4' });
    const user = renderScreen(profile);
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    await user.click(await screen.findByRole('button', { name: 'שליחה להורים' }));

    expect(navigator.share).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.stringMatching(/נועה סיימה היום את המשימה הראשונה[\s\S]*ABC123[\s\S]*\?parent=ABC123$/) })
    );
    expect(analytics.trackEvent).toHaveBeenCalledWith('show_off_shared');
    expect(onUpdateProfile).toHaveBeenLastCalledWith(expect.objectContaining({ hasEarnedShowOffReward: true }));
    expect(screen.getByText(/נשלח!/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ממשיכים' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('does not pay the share gift twice', async () => {
    const user = renderScreen(makeProfile({ name: 'נועה', hasEarnedShowOffReward: true }));
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    onUpdateProfile.mockReset();
    expect(screen.queryByText(/מתנה על השליחה/)).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'שליחה להורים' }));
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('lets the learner skip the share', async () => {
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    await user.click(await screen.findByRole('button', { name: 'אולי אחר כך' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('shows a retry when the parent link cannot be made', async () => {
    parents.listParentsOfChild.mockRejectedValue(new Error('offline'));
    const user = renderScreen();
    await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו להכין את ההודעה');
    expect(screen.getByRole('button', { name: 'אולי אחר כך' })).toBeInTheDocument();
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
    await userEvent.setup().click(screen.getByRole('button', { name: 'ממשיכים' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
