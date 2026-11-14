/**
 * Where a family came from: the `?src=` tag on every marketing link, template and QR code, plus an
 * optional campaign (`?c=`). The list is fixed so the counters, the rules and the dashboard stay
 * bounded; a tag outside it is counted as `other`, a link with no tag as `direct`.
 * The same list is in firestore.rules (`signups`).
 */
export const MARKETING_SOURCES = [
  'direct',
  'landing',
  'wa-family',
  'wa-teachers',
  'wa-parents',
  'wa-students',
  'qr',
  'ig',
  'fb',
  'tiktok',
  'ad',
  'other',
] as const;

export type MarketingSource = (typeof MARKETING_SOURCES)[number];

export const SOURCE_PARAM = 'src';
export const CAMPAIGN_PARAM = 'c';

export const DIRECT_SOURCE: MarketingSource = 'direct';
export const OTHER_SOURCE: MarketingSource = 'other';

/** Lower-case letters, digits and dashes; the same shape firestore.rules accepts */
export const CAMPAIGN_PATTERN = /^[a-z0-9-]{1,24}$/;

const SOURCE_SET: ReadonlySet<string> = new Set(MARKETING_SOURCES);

export const isMarketingSource = (value: unknown): value is MarketingSource => typeof value === 'string' && SOURCE_SET.has(value);

/** A missing tag is `direct`; a tag that is not on the list is `other`. */
export function normalizeSource(raw: string | null | undefined): MarketingSource {
  const value = raw?.trim().toLowerCase();
  if (!value) return DIRECT_SOURCE;
  return isMarketingSource(value) ? value : OTHER_SOURCE;
}

/** The campaign as typed in the link, or null when it is missing or has another shape. */
export function normalizeCampaign(raw: string | null | undefined): string | null {
  const value = raw?.trim().toLowerCase();
  return value && CAMPAIGN_PATTERN.test(value) ? value : null;
}
