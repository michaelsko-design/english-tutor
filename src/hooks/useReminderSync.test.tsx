import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import type { AuthUserSummary, LearnerProfile } from '../types/learner';
import { getReminderFacts, useReminderSync } from './useReminderSync';

const { syncReminder } = vi.hoisted(() => ({ syncReminder: vi.fn() }));
vi.mock('../services/push/pushSubscription', () => ({ syncReminder }));

const SYNC_DELAY_MS = 15_000;
const USER: AuthUserSummary = { uid: 'u1', displayName: null, email: null, isAnonymous: false };
const ONBOARDED: LearnerProfile = {
  ...DEFAULT_PROFILE,
  isOnboarded: true,
  stats: { ...DEFAULT_PROFILE.stats, streakDays: 3, streakLastDateStr: '2026-03-03' },
};

interface Props {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  isSynced: boolean;
}
const render = (props: Partial<Props> = {}) =>
  renderHook((p: Props) => useReminderSync(p), {
    initialProps: { authUser: USER, profile: ONBOARDED, isSynced: true, ...props },
  });

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getReminderFacts', () => {
  it('takes the streak facts from the profile and treats a missing Shabbat setting as on', () => {
    expect(getReminderFacts({ ...ONBOARDED, isShabbatObserver: undefined })).toEqual({
      streakDays: 3,
      streakLastDateStr: '2026-03-03',
      isShabbatObserver: true,
      gender: ONBOARDED.gender,
    });
    expect(getReminderFacts({ ...ONBOARDED, isShabbatObserver: false }).isShabbatObserver).toBe(false);
  });
});

describe('useReminderSync', () => {
  it('sends the facts once, after the delay', () => {
    render();

    vi.advanceTimersByTime(SYNC_DELAY_MS - 1);
    expect(syncReminder).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);

    expect(syncReminder).toHaveBeenCalledExactlyOnceWith('u1', getReminderFacts(ONBOARDED));
  });

  it.each([
    ['signed out', { authUser: null }],
    ['a guest', { authUser: { ...USER, isAnonymous: true } }],
    ['the cloud profile has not loaded', { isSynced: false }],
    ['the learner is not onboarded', { profile: { ...ONBOARDED, isOnboarded: false } }],
  ])('sends nothing when %s', (_label, props) => {
    render(props);

    vi.advanceTimersByTime(SYNC_DELAY_MS * 2);

    expect(syncReminder).not.toHaveBeenCalled();
  });

  it('does not resend unchanged facts, but sends changed ones', () => {
    const { rerender } = render();
    vi.advanceTimersByTime(SYNC_DELAY_MS);

    rerender({ authUser: USER, isSynced: true, profile: { ...ONBOARDED, name: 'renamed' } });
    vi.advanceTimersByTime(SYNC_DELAY_MS);
    expect(syncReminder).toHaveBeenCalledTimes(1);

    const practised = { ...ONBOARDED, stats: { ...ONBOARDED.stats, streakDays: 4, streakLastDateStr: '2026-03-04' } };
    rerender({ authUser: USER, isSynced: true, profile: practised });
    vi.advanceTimersByTime(SYNC_DELAY_MS);
    expect(syncReminder).toHaveBeenLastCalledWith('u1', expect.objectContaining({ streakDays: 4 }));
    expect(syncReminder).toHaveBeenCalledTimes(2);
  });

  it('drops a pending send when the facts change again before the delay', () => {
    const { rerender } = render();
    vi.advanceTimersByTime(SYNC_DELAY_MS - 1000);

    const practised = { ...ONBOARDED, stats: { ...ONBOARDED.stats, streakDays: 4 } };
    rerender({ authUser: USER, isSynced: true, profile: practised });
    vi.advanceTimersByTime(SYNC_DELAY_MS);

    expect(syncReminder).toHaveBeenCalledExactlyOnceWith('u1', expect.objectContaining({ streakDays: 4 }));
  });

  it('sends again for a different account on the same device', () => {
    const { rerender } = render();
    vi.advanceTimersByTime(SYNC_DELAY_MS);

    rerender({ authUser: { ...USER, uid: 'u2' }, isSynced: true, profile: ONBOARDED });
    vi.advanceTimersByTime(SYNC_DELAY_MS);

    expect(syncReminder).toHaveBeenLastCalledWith('u2', expect.anything());
    expect(syncReminder).toHaveBeenCalledTimes(2);
  });

  it('cancels the pending send on unmount', () => {
    const { unmount } = render();

    unmount();
    vi.advanceTimersByTime(SYNC_DELAY_MS * 2);

    expect(syncReminder).not.toHaveBeenCalled();
  });
});
