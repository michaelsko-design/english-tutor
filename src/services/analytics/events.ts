/**
 * Product analytics events: a fixed allow-list of anonymous counters. Nothing here carries learner
 * text, names or free-form values; an event outside the list is dropped before it is stored.
 */

export const ANALYTICS_EVENTS = [
  'session_start',
  'onboarding_done',
  'placement_done',
  'mission_finish',
  'mission_finish_tier_explorer',
  'mission_finish_tier_challenger',
  'mission_finish_tier_master',
  'mission_three_stars',
  'mission_start',
  'mission_abandon',
  'hint_used',
  'tts_error',
  'feature_exam_prep',
  'feature_word_lists',
  'feature_friends',
  'feature_progress_report',
  'feature_room',
  'feature_shop',
  'feature_settings',
] as const;

/** The "feature opened" counters, in the order the owner dashboard lists them */
export const FEATURE_EVENTS = [
  'feature_exam_prep',
  'feature_word_lists',
  'feature_friends',
  'feature_progress_report',
  'feature_room',
  'feature_shop',
  'feature_settings',
] as const satisfies readonly (typeof ANALYTICS_EVENTS)[number][];

export type FeatureEvent = (typeof FEATURE_EVENTS)[number];

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

const EVENT_SET: ReadonlySet<string> = new Set(ANALYTICS_EVENTS);

export function isAnalyticsEvent(name: string): name is AnalyticsEvent {
  return EVENT_SET.has(name);
}

/** Collection names, shared with firestore.rules and the owner API */
export const ANALYTICS_DAILY_COLLECTION = 'analyticsDaily';
export const CLIENT_ERRORS_COLLECTION = 'clientErrors';
/** One document per learner, day, mission and tier: how often it was opened and left unfinished */
export const MISSION_STRUGGLE_COLLECTION = 'missionStruggle';

export const MISSION_TIERS = ['explorer', 'challenger', 'master'] as const;
export type MissionTier = (typeof MISSION_TIERS)[number];

export const isMissionTier = (value: string): value is MissionTier => (MISSION_TIERS as readonly string[]).includes(value);

/** Curriculum ids only (letters, digits, `_`, `.`, `-`); the same shape firestore.rules accepts */
export const MISSION_ID_PATTERN = /^[A-Za-z0-9_.-]{1,60}$/;
export const isMissionId = (value: string): boolean => MISSION_ID_PATTERN.test(value);

/** Largest counter a single day document may hold (matches firestore.rules `isCount`) */
export const MAX_DAILY_COUNT = 1_000_000;
