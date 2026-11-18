import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackReminderDeclined, trackReminderResult } from './reminderOptIn';

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../analytics', () => analytics);

beforeEach(() => analytics.trackEvent.mockReset());

describe('trackReminderResult', () => {
  it('counts the total and the place on a successful opt-in', () => {
    trackReminderResult('settings', { ok: true });
    expect(analytics.trackEvent.mock.calls).toEqual([['reminder_opt_in'], ['reminder_opt_in_settings']]);
  });

  it.each([
    ['firstwin', 'reminder_opt_in_firstwin'],
    ['card', 'reminder_opt_in_card'],
    ['reask', 'reminder_opt_in_reask'],
  ] as const)('tags an opt-in from %s', (source, event) => {
    trackReminderResult(source, { ok: true });
    expect(analytics.trackEvent).toHaveBeenCalledWith(event);
  });

  it('counts a browser that refused permission', () => {
    trackReminderResult('card', { ok: false, errorHe: 'x', reason: 'denied' });
    expect(analytics.trackEvent.mock.calls).toEqual([['reminder_permission_denied']]);
  });

  it('counts nothing for any other failure', () => {
    trackReminderResult('card', { ok: false, errorHe: 'x', reason: 'failed' });
    expect(analytics.trackEvent).not.toHaveBeenCalled();
  });
});

describe('trackReminderDeclined', () => {
  it('counts a "not now"', () => {
    trackReminderDeclined();
    expect(analytics.trackEvent).toHaveBeenCalledWith('reminder_ask_declined');
  });
});
