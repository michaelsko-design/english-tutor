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
}));
vi.mock('../../services/push/pushSubscription', () => push);

const onEnabled = vi.fn();

beforeEach(() => {
  Object.values(push).forEach((fn) => fn.mockReset());
  onEnabled.mockReset();
  push.getReminderSupport.mockReturnValue('supported');
  push.isReminderOn.mockResolvedValue(false);
  push.enableReminder.mockResolvedValue({ ok: true });
  push.disableReminder.mockResolvedValue({ ok: true });
});

function renderCard(hasEarnedReminderReward?: boolean) {
  render(
    <StreakReminderCard profile={makeProfile({ hasEarnedReminderReward })} theme={TEST_THEME} onEnabled={onEnabled} />
  );
}

describe('StreakReminderCard gift', () => {
  it('names the gift and reports when reminders are turned on', async () => {
    const user = userEvent.setup();
    renderCard();

    expect(screen.getByText(/מתנה: 10 יהלומים/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'הפעלת תזכורות' }));

    expect(onEnabled).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/מתנה/)).not.toBeInTheDocument();
  });

  it('does not mention the gift once it was paid, and turning off pays nothing', async () => {
    push.isReminderOn.mockResolvedValue(true);
    const user = userEvent.setup();
    renderCard(true);

    expect(screen.queryByText(/מתנה/)).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'כיבוי תזכורות' }));

    expect(onEnabled).not.toHaveBeenCalled();
  });
});
