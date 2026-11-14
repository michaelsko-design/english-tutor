/**
 * Product analytics events: a fixed allow-list of anonymous counters. Nothing here carries learner
 * text, names or free-form values; an event outside the list is dropped before it is stored.
 */

import type { MarketingSource } from '../../config/marketingSources';

export const ANALYTICS_EVENTS = [
  'session_start',
  'onboarding_view',
  'onboarding_done',
  'greeting_done',
  'first_lesson_done',
  'reminder_opt_in',
  'welcome_back_claimed',
  'week_one_seen',
  'tour_done',
  'tour_skipped',
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
  // The conversion funnel: a locked Pro stop was opened, and "ask a parent" was sent
  'pro_wall_view',
  'pro_ask_sent',
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

/**
 * The steps before an account exists. They can't be tied to a learner (there is no uid yet), so they
 * are counted by the anonymous funnel counter (a method of the owner-stats function) into one document per day, not per learner.
 */
export const FUNNEL_EVENTS = [
  'gate_view',
  'signup_started',
  'signup_basics_done',
  'consent_ticked',
  'signup_done',
  'signup_name_taken',
  'signup_error',
  // A parent opened a parent link (no account yet either); the second one is a link from a Pro ask
  'parent_link_open',
  'parent_pro_link_open',
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

const FUNNEL_EVENT_SET: ReadonlySet<string> = new Set(FUNNEL_EVENTS);

export const isFunnelEvent = (name: unknown): name is FunnelEvent => typeof name === 'string' && FUNNEL_EVENT_SET.has(name);

/** The pre-account steps that are also counted per source tag (`?src=`) */
export const FUNNEL_SOURCE_EVENTS = ['gate_view', 'signup_done'] as const satisfies readonly FunnelEvent[];
export type FunnelSourceEvent = (typeof FUNNEL_SOURCE_EVENTS)[number];

export const isFunnelSourceEvent = (name: unknown): name is FunnelSourceEvent =>
  typeof name === 'string' && (FUNNEL_SOURCE_EVENTS as readonly string[]).includes(name);

/** The `funnelDaily` field that counts a step for one source, e.g. `signup_done__wa_family` (no dashes: a plain field path) */
export const funnelSourceKey = (event: FunnelSourceEvent, src: MarketingSource): string => `${event}__${src.replace(/-/g, '_')}`;

export const FUNNEL_DAILY_COLLECTION = 'funnelDaily';
