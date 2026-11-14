/**
 * First-touch attribution: the `?src=` (and `?c=`) tag of the first tagged link a device opened.
 * It is kept on the device until the account is created, then stored once with the account
 * (`services/signupService.ts`). Only allow-listed words are kept, never the URL.
 */
import {
  CAMPAIGN_PARAM,
  DIRECT_SOURCE,
  SOURCE_PARAM,
  isMarketingSource,
  normalizeCampaign,
  normalizeSource,
  type MarketingSource,
} from '../config/marketingSources';

export const ATTRIBUTION_STORAGE_KEY = 'english_tutor_attribution';

export interface Attribution {
  src: MarketingSource;
  campaign: string | null;
}

export const DIRECT_ATTRIBUTION: Attribution = { src: DIRECT_SOURCE, campaign: null };

type AttributionStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** The tag in a link's query string, or null when the link carries none. */
export function readAttribution(search: string): Attribution | null {
  const params = new URLSearchParams(search);
  if (!params.has(SOURCE_PARAM)) return null;
  return { src: normalizeSource(params.get(SOURCE_PARAM)), campaign: normalizeCampaign(params.get(CAMPAIGN_PARAM)) };
}

function defaultStorage(): AttributionStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    // Storage is blocked (private mode, site data off): attribution is skipped
    return null;
  }
}

function parseStored(raw: string | null): Attribution | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as { src?: unknown; campaign?: unknown };
    if (!isMarketingSource(value.src)) return null;
    return { src: value.src, campaign: normalizeCampaign(typeof value.campaign === 'string' ? value.campaign : null) };
  } catch {
    return null;
  }
}

/** The tag this device first arrived with; `direct` when it never opened a tagged link. */
export function getStoredAttribution(storage: AttributionStorage | null = defaultStorage()): Attribution {
  try {
    return parseStored(storage?.getItem(ATTRIBUTION_STORAGE_KEY) ?? null) ?? DIRECT_ATTRIBUTION;
  } catch {
    return DIRECT_ATTRIBUTION;
  }
}

/** Keeps the link's tag if the device has none yet (the first tag wins). Returns what is stored. */
export function captureAttribution(search: string, storage: AttributionStorage | null = defaultStorage()): Attribution {
  const stored = getStoredAttribution(storage);
  const fromLink = readAttribution(search);
  if (!fromLink || stored.src !== DIRECT_SOURCE || !storage) return stored;
  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(fromLink));
  } catch {
    // A full or blocked storage: the tag still counts for this page load
  }
  return fromLink;
}
