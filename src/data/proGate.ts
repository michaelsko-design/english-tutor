import {
  DEFAULT_FREE_CORE_UNITS,
  FREE_COMPANION_IDS,
  FREE_CORE_UNITS_BY_GRADE,
  FREE_EXAM_PREP_DAYS,
  FREE_THEME_IDS,
  FREE_WORD_LISTS,
  PRO_GATING_ENABLED,
  PRO_GRACE_DAYS,
  isBillingPeriod,
  type BillingPeriod,
} from '../config/proTier';
import type { CompanionId, ExamPlanDay, ExamPrepPlan, ThemeId } from '../types/learner';
import { THEME_BASES, isThemeId, resolveTheme, type ThemeDefinition } from '../themes/themeRegistry';
import { getCompanion } from '../themes/companionRegistry';
import { RELEASED_CONTENT_PACKS } from './curriculum/packs/registry';
import type { PackAccess, ReleasedPack } from './curriculum/packs/types';
import type { CurriculumUnit } from './curriculum/types';
import { MAX_ACTIVE_LISTS } from './customWordLists';

/**
 * EnglishVibe Pro gating (docs/feature-pro-tier.md, "Gating layer"): pure decisions from the
 * learner's entitlement. The screens only read them; the existing progress locks stay as they are.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type EntitlementStatus = 'active' | 'past_due' | 'canceled' | 'expired';
export type EntitlementSource = 'subscription' | 'comp' | 'coupon';

const ENTITLEMENT_STATUSES: readonly EntitlementStatus[] = ['active', 'past_due', 'canceled', 'expired'];
const ENTITLEMENT_SOURCES: readonly EntitlementSource[] = ['subscription', 'comp', 'coupon'];

/** The learner app's view of `entitlements/{uid}` (only the server writes it) */
export interface Entitlement {
  plan: 'pro';
  status: EntitlementStatus;
  source: EntitlementSource;
  /** Pro until this time (ms), plus `PRO_GRACE_DAYS` */
  periodEnd: number;
  billingPeriod: BillingPeriod | null;
}

/** An entitlement document (or a cached copy), or null when it is missing or malformed. */
export function parseEntitlement(data: unknown): Entitlement | null {
  if (!data || typeof data !== 'object') return null;
  const doc = data as Record<string, unknown>;
  const { status, source, periodEnd, billingPeriod } = doc;
  if (doc.plan !== 'pro') return null;
  if (!ENTITLEMENT_STATUSES.includes(status as EntitlementStatus)) return null;
  if (!ENTITLEMENT_SOURCES.includes(source as EntitlementSource)) return null;
  if (typeof periodEnd !== 'number' || !Number.isFinite(periodEnd)) return null;
  return {
    plan: 'pro',
    status: status as EntitlementStatus,
    source: source as EntitlementSource,
    periodEnd,
    billingPeriod: isBillingPeriod(billingPeriod) ? billingPeriod : null,
  };
}

/** Pro now: not expired, and before the period's end plus a few days' grace. No document means free. */
export function isPro(entitlement: Entitlement | null, nowMs: number): boolean {
  if (!entitlement || entitlement.status === 'expired') return false;
  return nowMs < entitlement.periodEnd + PRO_GRACE_DAYS * DAY_MS;
}

/** What the learner may open: Pro, or everything while gating is switched off */
export interface ProAccess {
  isPro: boolean;
  isGatingOn: boolean;
}

export function getProAccess(isProNow: boolean, isGatingOn: boolean = PRO_GATING_ENABLED): ProAccess {
  return { isPro: isProNow, isGatingOn };
}

/** Pro, or gating switched off: nothing is held back. */
export function hasFullAccess(access: ProAccess): boolean {
  return access.isPro || !access.isGatingOn;
}

export function getFreeCoreUnits(gradeNumber: number): readonly number[] {
  return FREE_CORE_UNITS_BY_GRADE[gradeNumber] ?? DEFAULT_FREE_CORE_UNITS;
}

/** Who plays a pack. A pack shown before its release (the packs preview) counts as free. */
export function getPackAccess(packId: string, released: readonly ReleasedPack[] = RELEASED_CONTENT_PACKS): PackAccess {
  return released.find((pack) => pack.id === packId)?.access ?? 'free';
}

/** The grade of a unit, from its mission ids (g7-u3-m2 → 7), or null when they don't say. */
const gradeOfUnit = (unit: CurriculumUnit): number | null => {
  const match = unit.missions[0]?.id.match(/^g(\d+)-u\d+/);
  return match ? Number(match[1]) : null;
};

/** A unit every learner plays: one of the grade's free core units, or a unit of a free pack. */
export function isFreeUnit(unit: CurriculumUnit, released: readonly ReleasedPack[] = RELEASED_CONTENT_PACKS): boolean {
  if (unit.packId) return getPackAccess(unit.packId, released) === 'free';
  const grade = gradeOfUnit(unit);
  return grade === null || getFreeCoreUnits(grade).includes(unit.unitNumber);
}

/** Whether a learner can play a mission: Pro, a free unit, or a mission that already has stars. */
export function canPlayMission(
  unit: CurriculumUnit,
  missionId: string,
  progress: Record<string, number>,
  access: ProAccess
): boolean {
  return hasFullAccess(access) || isFreeUnit(unit) || (progress[missionId] || 0) > 0;
}

/** The units a learner can play missions in now (the next-mission suggestion only looks here). */
export function getPlayableUnits(units: CurriculumUnit[], access: ProAccess): CurriculumUnit[] {
  return hasFullAccess(access) ? units : units.filter((unit) => isFreeUnit(unit));
}

/** A free learner has finished every free mission of the grade, and Pro units are still ahead. */
export function hasFinishedFreeMissions(
  units: CurriculumUnit[],
  progress: Record<string, number>,
  access: ProAccess
): boolean {
  if (hasFullAccess(access)) return false;
  const playable = getPlayableUnits(units, access);
  if (playable.length === units.length) return false;
  return playable.every((unit) => unit.missions.every((mission) => (progress[mission.id] || 0) > 0));
}

export function canUseTheme(themeId: ThemeId, access: ProAccess): boolean {
  return hasFullAccess(access) || FREE_THEME_IDS.includes(themeId);
}

export function canUseCompanion(companionId: CompanionId, access: ProAccess): boolean {
  return hasFullAccess(access) || FREE_COMPANION_IDS.includes(companionId);
}

export interface LearnerLook {
  themeId: ThemeId;
  /** Unset: the theme's own mascot */
  companionId?: CompanionId;
}

/**
 * The look to draw: the saved one when it is allowed, else the free theme of the same brightness and
 * a free mascot. The saved choice itself is never changed, so renewing Pro brings it back.
 */
export function resolveAllowedLook(themeId: string | undefined, companionId: string | undefined, access: ProAccess): LearnerLook {
  const savedTheme: ThemeId = isThemeId(themeId) ? themeId : FREE_THEME_IDS[0];
  const allowedTheme = canUseTheme(savedTheme, access)
    ? savedTheme
    : FREE_THEME_IDS.find((id) => THEME_BASES[id].isDark === THEME_BASES[savedTheme].isDark) ?? FREE_THEME_IDS[0];
  const mascot = getCompanion(companionId, THEME_BASES[allowedTheme].defaultCompanionId).id;
  if (canUseCompanion(mascot, access)) return { themeId: allowedTheme, ...(companionId ? { companionId: mascot } : {}) };
  const themeMascot = THEME_BASES[allowedTheme].defaultCompanionId;
  return { themeId: allowedTheme, companionId: canUseCompanion(themeMascot, access) ? themeMascot : FREE_COMPANION_IDS[0] };
}

/** The theme the learner's screens draw with (their saved look, when it is allowed). */
export function resolveLearnerTheme(themeId: string | undefined, companionId: string | undefined, access: ProAccess): ThemeDefinition {
  const look = resolveAllowedLook(themeId, companionId, access);
  return resolveTheme(look.themeId, look.companionId);
}

/**
 * Whether an exam-prep day can be played: Pro, a plan made while Pro, a day already played, or the
 * plan's first practice days (the free taste).
 */
export function canOpenExamDay(plan: Pick<ExamPrepPlan, 'madeWithPro'>, day: ExamPlanDay, access: ProAccess): boolean {
  if (hasFullAccess(access) || plan.madeWithPro || day.completedAt) return true;
  return day.kind === 'practice' && day.dayIndex < FREE_EXAM_PREP_DAYS;
}

/** How many active word lists the learner can keep. Lists above the limit stay; only adding stops. */
export function maxWordLists(access: ProAccess): number {
  return hasFullAccess(access) ? MAX_ACTIVE_LISTS : FREE_WORD_LISTS;
}
