import { describe, expect, it } from 'vitest';
import { PRIVACY_VERSION, TERMS_VERSION } from '../config/appInfo';
import { buildTermsConsent, hasCurrentTermsConsent, mergeTermsConsent } from './termsConsent';

const NOW = new Date('2026-11-19T10:00:00.000Z');

describe('termsConsent', () => {
  it('records the time, both versions and whether a parent agreed', () => {
    expect(buildTermsConsent(NOW, 8)).toEqual({
      acceptedAt: NOW.toISOString(),
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
      isParentConsent: true,
    });
    expect(buildTermsConsent(NOW, 15).isParentConsent).toBe(false);
  });

  it('counts only an agreement to the current texts', () => {
    expect(hasCurrentTermsConsent({})).toBe(false);
    expect(hasCurrentTermsConsent({ termsConsent: buildTermsConsent(NOW, 15) })).toBe(true);
    expect(hasCurrentTermsConsent({ termsConsent: { ...buildTermsConsent(NOW, 15), termsVersion: '2020-01-01' } })).toBe(false);
  });

  it('keeps the newer agreement when two devices sync', () => {
    const older = buildTermsConsent(NOW, 15);
    const newer = buildTermsConsent(new Date('2026-12-01T10:00:00.000Z'), 15);
    expect(mergeTermsConsent(older, newer)).toBe(newer);
    expect(mergeTermsConsent(newer, older)).toBe(newer);
    expect(mergeTermsConsent(undefined, older)).toBe(older);
    expect(mergeTermsConsent(older, undefined)).toBe(older);
    expect(mergeTermsConsent(undefined, undefined)).toBeUndefined();
  });
});
