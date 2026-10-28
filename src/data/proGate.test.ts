import { describe, expect, it } from 'vitest';
import { FREE_WORD_LISTS, PRO_GRACE_DAYS } from '../config/proTier';
import type { ExamPlanDay } from '../types/learner';
import type { CurriculumUnit, MissionNode } from './curriculum/types';
import type { ReleasedPack } from './curriculum/packs/types';
import { MAX_ACTIVE_LISTS } from './customWordLists';
import {
  canOpenExamDay,
  canPlayMission,
  canUseCompanion,
  canUseTheme,
  getPackAccess,
  getPlayableUnits,
  getProAccess,
  hasFinishedFreeMissions,
  isFreeUnit,
  isPro,
  maxWordLists,
  parseEntitlement,
  resolveAllowedLook,
  type Entitlement,
} from './proGate';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 28);

const FREE = getProAccess(false, true);
const PRO = getProAccess(true, true);
const GATING_OFF = getProAccess(false, false);

function unit(grade: number, unitNumber: number, extra: Partial<CurriculumUnit> = {}): CurriculumUnit {
  const missions = [1, 2].map((m) => ({ id: `g${grade}-u${unitNumber}-m${m}` }) as MissionNode);
  return { unitNumber, titleEn: '', titleHe: '', subtitleHe: '', badgeEmoji: '', missions, ...extra };
}

const entitlement = (overrides: Partial<Entitlement> = {}): Entitlement => ({
  plan: 'pro',
  status: 'active',
  source: 'subscription',
  periodEnd: NOW + DAY_MS,
  billingPeriod: 'monthly',
  ...overrides,
});

describe('parseEntitlement', () => {
  it('reads a valid document and drops unknown fields', () => {
    const parsed = parseEntitlement({ ...entitlement(), payerParentUid: 'p1', updatedAt: 1 });
    expect(parsed).toEqual(entitlement());
  });

  it('refuses malformed documents', () => {
    expect(parseEntitlement(null)).toBeNull();
    expect(parseEntitlement({ ...entitlement(), plan: 'gold' })).toBeNull();
    expect(parseEntitlement({ ...entitlement(), status: 'paused' })).toBeNull();
    expect(parseEntitlement({ ...entitlement(), periodEnd: '2027' })).toBeNull();
  });

  it('keeps a comp grant without a billing period', () => {
    expect(parseEntitlement({ ...entitlement({ source: 'comp' }), billingPeriod: null })?.billingPeriod).toBeNull();
  });
});

describe('isPro', () => {
  it('is Pro until the period end plus the grace days', () => {
    const ent = entitlement({ periodEnd: NOW });
    expect(isPro(ent, NOW + PRO_GRACE_DAYS * DAY_MS - 1)).toBe(true);
    expect(isPro(ent, NOW + PRO_GRACE_DAYS * DAY_MS)).toBe(false);
  });

  it('keeps a canceled plan until its end, but never an expired one or no document', () => {
    expect(isPro(entitlement({ status: 'canceled' }), NOW)).toBe(true);
    expect(isPro(entitlement({ status: 'expired' }), NOW)).toBe(false);
    expect(isPro(null, NOW)).toBe(false);
  });
});

describe('missions', () => {
  const released: ReleasedPack[] = [
    { id: 'core-plus', releasedAt: '2026-12-01', access: 'pro' },
    { id: 'holidays', releasedAt: '2026-12-01', access: 'free' },
  ];

  it('gives units 1–2 of a grade free, and units 1–5 of grade 1', () => {
    expect([1, 2, 3, 4].map((n) => isFreeUnit(unit(5, n)))).toEqual([true, true, false, false]);
    expect([5, 6].map((n) => isFreeUnit(unit(1, n)))).toEqual([true, false]);
  });

  it('follows a released pack\'s access', () => {
    expect(isFreeUnit(unit(5, 21, { packId: 'core-plus' }), released)).toBe(false);
    expect(isFreeUnit(unit(5, 31, { packId: 'holidays' }), released)).toBe(true);
    expect(getPackAccess('core-plus', [])).toBe('free');
  });

  it('keeps missions that already have stars, and opens everything for Pro or with gating off', () => {
    const proUnit = unit(5, 3);
    expect(canPlayMission(proUnit, 'g5-u3-m1', {}, FREE)).toBe(false);
    expect(canPlayMission(proUnit, 'g5-u3-m1', { 'g5-u3-m1': 1 }, FREE)).toBe(true);
    expect(canPlayMission(proUnit, 'g5-u3-m1', {}, PRO)).toBe(true);
    expect(canPlayMission(proUnit, 'g5-u3-m1', {}, GATING_OFF)).toBe(true);
  });

  it('knows when a free learner has played every free mission', () => {
    const units = [1, 2, 3, 4].map((n) => unit(5, n));
    const freeDone = { 'g5-u1-m1': 1, 'g5-u1-m2': 2, 'g5-u2-m1': 3, 'g5-u2-m2': 1 };
    expect(getPlayableUnits(units, FREE).map((u) => u.unitNumber)).toEqual([1, 2]);
    expect(hasFinishedFreeMissions(units, freeDone, FREE)).toBe(true);
    expect(hasFinishedFreeMissions(units, { 'g5-u1-m1': 1 }, FREE)).toBe(false);
    expect(hasFinishedFreeMissions(units, freeDone, PRO)).toBe(false);
  });
});

describe('themes and mascots', () => {
  it('offers the two free themes and mascots to free learners', () => {
    expect(canUseTheme('cozy-studio', FREE)).toBe(true);
    expect(canUseTheme('neon-pop', FREE)).toBe(false);
    expect(canUseCompanion('kai', FREE)).toBe(true);
    expect(canUseCompanion('comet', FREE)).toBe(false);
    expect(canUseTheme('neon-pop', PRO)).toBe(true);
  });

  it('draws the free theme of the same brightness and a free mascot for a Pro choice', () => {
    expect(resolveAllowedLook('neon-pop', 'dj-beat', FREE)).toEqual({ themeId: 'urban-night', companionId: 'kai' });
    expect(resolveAllowedLook('travel-journal', undefined, FREE)).toEqual({ themeId: 'cozy-studio' });
    expect(resolveAllowedLook('cozy-studio', 'kai', FREE)).toEqual({ themeId: 'cozy-studio', companionId: 'kai' });
    expect(resolveAllowedLook('cozy-studio', undefined, FREE)).toEqual({ themeId: 'cozy-studio' });
  });

  it('keeps the saved look for Pro learners and with gating off', () => {
    expect(resolveAllowedLook('neon-pop', 'dj-beat', PRO)).toEqual({ themeId: 'neon-pop', companionId: 'dj-beat' });
    expect(resolveAllowedLook('starlight-rpg', undefined, GATING_OFF)).toEqual({ themeId: 'starlight-rpg' });
  });
});

describe('exam prep and word lists', () => {
  const day = (dayIndex: number, extra: Partial<ExamPlanDay> = {}): ExamPlanDay => ({
    dayIndex,
    dateStr: '2026-11-01',
    kind: 'practice',
    focus: [],
    ...extra,
  });

  it('opens the first practice day free, and every day of a plan made with Pro', () => {
    expect(canOpenExamDay({}, day(0), FREE)).toBe(true);
    expect(canOpenExamDay({}, day(1), FREE)).toBe(false);
    expect(canOpenExamDay({}, day(1, { kind: 'mock' }), FREE)).toBe(false);
    expect(canOpenExamDay({ madeWithPro: true }, day(3), FREE)).toBe(true);
    expect(canOpenExamDay({}, day(2, { completedAt: '2026-10-01T00:00:00Z' }), FREE)).toBe(true);
    expect(canOpenExamDay({}, day(4), PRO)).toBe(true);
  });

  it('limits free learners to fewer word lists', () => {
    expect(maxWordLists(FREE)).toBe(FREE_WORD_LISTS);
    expect(maxWordLists(PRO)).toBe(MAX_ACTIVE_LISTS);
    expect(maxWordLists(GATING_OFF)).toBe(MAX_ACTIVE_LISTS);
  });
});
