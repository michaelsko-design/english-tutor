/**
 * EnglishVibe Pro: prices and seats (docs/feature-pro-tier.md, "Pricing and seats"). The server
 * computes every charge from these; the parent's plan picker only shows them.
 */
import type { CompanionId, ThemeId } from '../types/learner';

export type BillingPeriod = 'monthly' | 'yearly';

export const BILLING_PERIODS: readonly BillingPeriod[] = ['monthly', 'yearly'];

/** Most children one subscription covers; families with more contact us */
export const MAX_PRO_SEATS = 4;

export type ProSeatCount = 1 | 2 | 3 | 4;

/**
 * VAT included, in agorot. Monthly: ₪39 for the first child and ₪25 for each more. Yearly: about
 * 9 months' price (3 months free), rounded down to end in 9.
 */
export const PRO_PRICES_AGOROT: Record<ProSeatCount, Record<BillingPeriod, number>> = {
  1: { monthly: 3900, yearly: 34900 },
  2: { monthly: 6400, yearly: 56900 },
  3: { monthly: 8900, yearly: 79900 },
  4: { monthly: 11400, yearly: 99900 },
};

/** The parent portal shows the plans on the dev server only, until checkout is wired to it */
export const IS_PRO_PLAN_VISIBLE = import.meta.env?.DEV === true;

/**
 * The free/Pro limits switch (docs/feature-pro-tier.md, "Tier boundaries"). Off until payments work
 * end to end: until then every learner plays everything, and the app reads no entitlements.
 */
export const PRO_GATING_ENABLED = false;

/** The core units each grade gives free learners; grades not listed use `DEFAULT_FREE_CORE_UNITS` */
export const FREE_CORE_UNITS_BY_GRADE: Readonly<Record<number, readonly number[]>> = {
  // Grade 1 has 10 units: the whole alphabet (1–4) and the first blending unit stay free
  1: [1, 2, 3, 4, 5],
};
export const DEFAULT_FREE_CORE_UNITS: readonly number[] = [1, 2];

/** One playful light theme and one grown-up dark one, with their own mascots */
export const FREE_THEME_IDS: readonly ThemeId[] = ['cozy-studio', 'urban-night'];
export const FREE_COMPANION_IDS: readonly CompanionId[] = ['mochi', 'kai'];

/** Active school word lists a free learner can keep (Pro: `MAX_ACTIVE_LISTS`) */
export const FREE_WORD_LISTS = 2;

/** Practice days of an exam plan a free learner can play */
export const FREE_EXAM_PREP_DAYS = 1;

/** Pro stays on this long after `periodEnd`, so a late renewal never locks a learner out */
export const PRO_GRACE_DAYS = 3;

/** A child can be put into a seat that another child left at most once in this many days */
export const SEAT_SWAP_COOLDOWN_DAYS = 30;

const MONTHS_PER_YEAR = 12;

export function isProSeatCount(children: number): children is ProSeatCount {
  return Number.isInteger(children) && children >= 1 && children <= MAX_PRO_SEATS;
}

/** The charge for this many children and period, in agorot, or null when no plan covers it. */
export function proPriceAgorot(children: number, period: BillingPeriod): number | null {
  return isProSeatCount(children) ? PRO_PRICES_AGOROT[children][period] : null;
}

export function isBillingPeriod(value: unknown): value is BillingPeriod {
  return value === 'monthly' || value === 'yearly';
}

export interface ProPriceQuote {
  /** What is charged each period */
  chargeAgorot: number;
  /** The charge spread over the months it covers */
  perMonthAgorot: number;
  /** Per month, per child */
  perChildMonthAgorot: number;
  /** What a year costs less than 12 monthly charges (0 on the monthly plan) */
  yearlySavingsAgorot: number;
}

/** Everything the plan picker shows for a choice, or null when no plan covers it. */
export function quoteProPrice(children: number, period: BillingPeriod): ProPriceQuote | null {
  if (!isProSeatCount(children)) return null;
  const { monthly, yearly } = PRO_PRICES_AGOROT[children];
  const chargeAgorot = period === 'monthly' ? monthly : yearly;
  const perMonthAgorot = period === 'monthly' ? monthly : yearly / MONTHS_PER_YEAR;
  return {
    chargeAgorot,
    perMonthAgorot,
    perChildMonthAgorot: perMonthAgorot / children,
    yearlySavingsAgorot: monthly * MONTHS_PER_YEAR - yearly,
  };
}
