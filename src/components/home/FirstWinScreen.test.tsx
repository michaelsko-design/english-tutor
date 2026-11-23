import { render, screen, within } from '@testing-library/react';
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

type User = ReturnType<typeof userEvent.setup>;
const openAsk = (user: User) => user.click(screen.getByRole('button', { name: 'ממשיכים' }));
async function declineAsk(user: User) {
  await openAsk(user);
  await user.click(await screen.findByRole('button', { name: 'לא עכשיו' }));
}

describe('FirstWinScreen', () => {
  it("tells a new learner about tomorrow's gift, and not one who already claimed it", async () => {
    const { unmount } = renderScreenWith(makeProfile({ name: 'נועה' }));
    expect(screen.getByText(/מחר מחכה לכם מתנה: 20/)).toBeInTheDocument();
    unmount();
    renderScreenWith(makeProfile({ name: 'נועה', hasClaimedWelcomeBack: true }));
    expect(screen.queryByText(/מחר מחכה לכם מתנה/)).not.toBeInTheDocument();
  });

  it('celebrates first, then opens the reminder ask screen', async () => {
    const user = renderScreen();
    expect(screen.getByRole('heading', { name: /כל הכבוד/ })).toBeInTheDocument();
    expect(screen.getByText(/יום 1 ברצף/)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await openAsk(user);
    const ask = await screen.findByRole('dialog', { name: /רוצה שאזכיר לך מחר/ });
    expect(ask).not.toHaveTextContent(/להורים:|יהלומים|💎/);
    expect(ask).toHaveTextContent(/עוזרת ללמוד טוב יותר ולשמור על הרצף/);
  });

  it('turns the reminder on with no gift, counts it as ask 1 and goes on to the parent share', async () => {
    const user = renderScreen();
    await openAsk(user);
    await user.click(await screen.findByRole('button', { name: 'כן, תזכירו לי' }));
    expect(push.enableReminder).toHaveBeenCalledWith('child-1', expect.objectContaining({ isShabbatObserver: expect.any(Boolean) }));
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in');
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_opt_in_firstwin');

    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'ממשיכים' }));
    const updated = onUpdateProfile.mock.calls[0][0];
    expect(updated).toMatchObject({ reminderAskCount: 1 });
    expect(updated.reminderDeclinedAtStr).toBeUndefined();
    expect(updated.stats.diamonds).toBe(makeProfile().stats.diamonds);
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('remembers a "not now" and moves on to the parent share', async () => {
    const user = renderScreen();
    await declineAsk(user);
    expect(push.enableReminder).not.toHaveBeenCalled();
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_ask_declined');
    expect(onUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ reminderAskCount: 1, reminderDeclinedAtStr: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) })
    );
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
  });

  it('skips the ask where it cannot work and goes straight to the parent share', async () => {
    push.getNotificationPermission.mockReturnValue('denied');
    const user = renderScreen();
    await openAsk(user);
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
    expect(push.isReminderOn).not.toHaveBeenCalled();
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('skips the ask when the reminder is already on', async () => {
    push.isReminderOn.mockResolvedValue(true);
    const user = renderScreen();
    await openAsk(user);
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
  });

  it('shows the install steps on iPhone outside the Home Screen app', async () => {
    push.getReminderSupport.mockReturnValue('needs-install');
    const user = renderScreen();
    await openAsk(user);
    expect(await screen.findByRole('list', { name: 'שלבי ההוספה למסך הבית' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'הבנתי' }));
    expect(await screen.findByRole('heading', { name: /שלחו להורים/ })).toBeInTheDocument();
  });

  it('shares the first win with a parent link and pays the gift once', async () => {
    const profile = makeProfile({ name: 'נועה', gradeId: 'grade-4' });
    const user = renderScreen(profile);
    await declineAsk(user);
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
    await declineAsk(user);
    onUpdateProfile.mockReset();
    expect(screen.queryByText(/מתנה על השליחה/)).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'שליחה להורים' }));
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('lets the learner skip the share', async () => {
    const user = renderScreen();
    await declineAsk(user);
    await user.click(await screen.findByRole('button', { name: 'אולי אחר כך' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('shows a retry when the parent link cannot be made', async () => {
    parents.listParentsOfChild.mockRejectedValue(new Error('offline'));
    const user = renderScreen();
    await declineAsk(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו להכין את ההודעה');
    expect(screen.getByRole('button', { name: 'אולי אחר כך' })).toBeInTheDocument();
  });

  it('does not ask a guest, who cannot receive reminders', async () => {
    firebase.auth.currentUser = { uid: 'guest-1', isAnonymous: true };
    const user = renderScreen();
    await openAsk(user);
    expect(push.enableReminder).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
