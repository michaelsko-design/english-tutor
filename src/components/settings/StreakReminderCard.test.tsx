import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { StreakReminderCard } from './StreakReminderCard';

const firebase = vi.hoisted(() => ({ auth: { currentUser: { uid: 'child-1', isAnonymous: false } } }));
vi.mock('../../services/firebase', () => ({ auth: firebase.auth, isFirebaseConfigured: true, getAppCheckToken: async () => null }));

const push = vi.hoisted(() => ({
  getReminderSupport: vi.fn(),
  isReminderOn: vi.fn(),
  enableReminder: vi.fn(),
  disableReminder: vi.fn(),
  getNotificationPermission: vi.fn(),
}));
vi.mock('../../services/push/pushSubscription', () => push);

beforeEach(() => {
  Object.values(push).forEach((fn) => fn.mockReset());
  push.getReminderSupport.mockReturnValue('supported');
  push.isReminderOn.mockResolvedValue(false);
  push.enableReminder.mockResolvedValue({ ok: true });
  push.disableReminder.mockResolvedValue({ ok: true });
  push.getNotificationPermission.mockReturnValue('default');
});

function renderCard() {
  render(<StreakReminderCard profile={makeProfile()} theme={TEST_THEME} />);
}

describe('StreakReminderCard', () => {
  it('says the reminder helps keep the streak, offers no gift, and turns reminders on', async () => {
    const user = userEvent.setup();
    renderCard();

    expect(screen.getByText(/עוזרת לשמור על הרצף/)).toBeInTheDocument();
    expect(screen.queryByText(/מתנה|יהלומים/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'הפעלת תזכורות' }));

    expect(push.enableReminder).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('button', { name: 'כיבוי תזכורות' })).toBeInTheDocument();
  });
});

describe('StreakReminderCard on iPhone outside the Home Screen app', () => {
  it('shows the three install steps instead of the switch', () => {
    push.getReminderSupport.mockReturnValue('needs-install');
    renderCard();

    expect(screen.getByRole('list', { name: 'שלבי ההוספה למסך הבית' }).children).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'הפעלת תזכורות' })).not.toBeInTheDocument();
  });
});

describe('StreakReminderCard with notifications blocked', () => {
  it('explains how to allow notifications instead of offering a switch that cannot work', () => {
    push.getNotificationPermission.mockReturnValue('denied');
    renderCard();

    expect(screen.getByText(/ההתראות חסומות בדפדפן הזה/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'הפעלת תזכורות' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /קובץ ליומן/ })).toBeInTheDocument();
  });

  it('still lets a learner whose reminder is on turn it off', async () => {
    push.getNotificationPermission.mockReturnValue('denied');
    push.isReminderOn.mockResolvedValue(true);
    renderCard();

    expect(await screen.findByRole('button', { name: 'כיבוי תזכורות' })).toBeInTheDocument();
    expect(screen.queryByText(/ההתראות חסומות בדפדפן הזה/)).not.toBeInTheDocument();
  });
});
