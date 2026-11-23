import { trackEvent } from '../analytics';
import type { ReminderResult } from './pushSubscription';

/** Where the daily reminder was offered, for the owner dashboard's growth counters */
export type ReminderAskSource = 'firstwin' | 'card' | 'settings' | 'reask' | 'ask2' | 'ask3' | 'installed';

/** The full-screen ask's sources (data/reminderAsk.ts; 'installed' is the first open of the iPhone app) */
export type ReminderAskScreenSource = 'firstwin' | 'ask2' | 'ask3' | 'installed';

const OPT_IN_EVENTS = {
  firstwin: 'reminder_opt_in_firstwin',
  card: 'reminder_opt_in_card',
  settings: 'reminder_opt_in_settings',
  reask: 'reminder_opt_in_reask',
  ask2: 'reminder_opt_in_ask2',
  ask3: 'reminder_opt_in_ask3',
  installed: 'reminder_opt_in_installed',
} as const;

/**
 * Counts the outcome of one "turn the reminder on" tap. A success counts the total
 * (`reminder_opt_in`, which the usage funnel reads) and the place it happened; a browser that
 * refused permission is counted on its own, so the dashboard can tell a block from a bug.
 */
export function trackReminderResult(source: ReminderAskSource, result: ReminderResult): void {
  if (result.ok) {
    trackEvent('reminder_opt_in');
    trackEvent(OPT_IN_EVENTS[source]);
    return;
  }
  if (result.reason === 'denied') trackEvent('reminder_permission_denied');
}

export const trackReminderDeclined = (): void => trackEvent('reminder_ask_declined');

/** The full-screen ask came up (the base the opt-ins per source are read against) */
export const trackReminderAskShown = (): void => trackEvent('reminder_ask_shown');
