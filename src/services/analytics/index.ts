import { db, isFirebaseConfigured } from '../firebase';
import { toLocalDateStr } from '../../utils/dates';
import { createAnalytics, type AnalyticsContext, type MissionSignal } from './analyticsService';
import { detectDevice } from './deviceInfo';
import { createErrorReporter } from './errorReporter';
import type { ProficiencyTier } from '../../types/learner';
import type { AnalyticsEvent } from './events';

/** Off in unit tests (tests mock Firestore) and when Firebase is not configured */
const isEnabled = (): boolean => isFirebaseConfigured && !import.meta.env.VITEST;

/** The build's commit id (the mode where the define is missing, e.g. a tool that skips vite.config) */
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : import.meta.env.MODE;

const analytics = createAnalytics({
  getDb: () => (isEnabled() ? db : null),
  today: () => toLocalDateStr(new Date()),
});

let currentUid: string | null = null;
/** Detected once: a device doesn't change during a session */
const device: string | undefined = detectDevice();

const reportError = createErrorReporter({
  getDb: () => (isEnabled() ? db : null),
  getUid: () => currentUid,
  today: () => toLocalDateStr(new Date()),
  appVersion: APP_VERSION,
  getDevice: () => device,
});

export const trackEvent = (name: AnalyticsEvent): void => analytics.track(name);

/** A mission opened (`start`) or closed unfinished (`abandon`), with the tier at that moment */
export const trackMissionSignal = (missionId: string, tier: ProficiencyTier, signal: MissionSignal): void =>
  analytics.trackMission(missionId, tier, signal);
const TIER_EVENTS = {
  explorer: 'mission_finish_tier_explorer',
  challenger: 'mission_finish_tier_challenger',
  master: 'mission_finish_tier_master',
} as const;

/** A finished mission: the total, the tier played, and whether it earned all three stars */
export function trackMissionFinish(tier: ProficiencyTier, stars: 1 | 2 | 3): void {
  trackEvent('mission_finish');
  trackEvent(TIER_EVENTS[tier]);
  if (stars === 3) trackEvent('mission_three_stars');
}

export const reportRenderError = (error: unknown): void => void reportError(error, 'render');

/** Called when the signed-in learner (or their grade) changes; `null` on sign-out */
export function setAnalyticsContext(context: AnalyticsContext | null): void {
  currentUid = context?.uid ?? null;
  analytics.setContext(context ? { ...context, ...(device ? { device } : {}) } : null);
}

if (typeof window !== 'undefined' && !import.meta.env.VITEST) {
  window.addEventListener('error', (event) => void reportError(event.error ?? event.message, 'window'));
  window.addEventListener('unhandledrejection', (event) => void reportError(event.reason, 'promise'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void analytics.flush();
  });
}
