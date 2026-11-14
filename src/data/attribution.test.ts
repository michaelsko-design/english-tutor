import { describe, expect, it } from 'vitest';
import { ATTRIBUTION_STORAGE_KEY, DIRECT_ATTRIBUTION, captureAttribution, getStoredAttribution, readAttribution } from './attribution';
import { normalizeCampaign, normalizeSource } from '../config/marketingSources';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe('marketing sources', () => {
  it('keeps a listed source, lower-cased', () => {
    expect(normalizeSource('landing')).toBe('landing');
    expect(normalizeSource(' WA-Family ')).toBe('wa-family');
  });

  it('counts a missing tag as direct and an unknown one as other', () => {
    expect(normalizeSource(null)).toBe('direct');
    expect(normalizeSource('')).toBe('direct');
    expect(normalizeSource('<script>')).toBe('other');
  });

  it('keeps only a campaign of letters, digits and dashes', () => {
    expect(normalizeCampaign('Dec-Soft')).toBe('dec-soft');
    expect(normalizeCampaign('a b')).toBeNull();
    expect(normalizeCampaign('x'.repeat(25))).toBeNull();
    expect(normalizeCampaign(undefined)).toBeNull();
  });
});

describe('readAttribution', () => {
  it('reads the source and the campaign', () => {
    expect(readAttribution('?src=wa-teachers&c=dec-soft')).toEqual({ src: 'wa-teachers', campaign: 'dec-soft' });
  });

  it('is null for a link with no tag', () => {
    expect(readAttribution('?parent=ABC')).toBeNull();
    expect(readAttribution('')).toBeNull();
  });

  it('ignores a campaign with no source', () => {
    expect(readAttribution('?c=dec-soft')).toBeNull();
  });
});

describe('captureAttribution', () => {
  it('stores the first tag and returns it', () => {
    const storage = memoryStorage();
    expect(captureAttribution('?src=landing', storage)).toEqual({ src: 'landing', campaign: null });
    expect(getStoredAttribution(storage)).toEqual({ src: 'landing', campaign: null });
  });

  it('keeps the first tag when a later link carries another', () => {
    const storage = memoryStorage();
    captureAttribution('?src=wa-family&c=dec-soft', storage);
    expect(captureAttribution('?src=landing', storage)).toEqual({ src: 'wa-family', campaign: 'dec-soft' });
  });

  it('is direct when no link was tagged', () => {
    const storage = memoryStorage();
    expect(captureAttribution('', storage)).toEqual(DIRECT_ATTRIBUTION);
    expect(storage.getItem(ATTRIBUTION_STORAGE_KEY)).toBeNull();
  });

  it('ignores a stored value that is not on the list', () => {
    expect(getStoredAttribution(memoryStorage({ [ATTRIBUTION_STORAGE_KEY]: '{"src":"evil"}' }))).toEqual(DIRECT_ATTRIBUTION);
    expect(getStoredAttribution(memoryStorage({ [ATTRIBUTION_STORAGE_KEY]: 'not json' }))).toEqual(DIRECT_ATTRIBUTION);
  });

  it('still returns the link tag when storage is blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(captureAttribution('?src=qr', blocked)).toEqual({ src: 'qr', campaign: null });
  });
});
