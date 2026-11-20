/**
 * The record of a learner's agreement to the terms and the privacy notice, made at signup (legal
 * audit TOS-04, Q-06): under 13 a parent agrees; from 13 the learner agrees with the parents'
 * knowledge. It keeps which versions were agreed to, so a later change of the texts can be told apart.
 */
import { PRIVACY_VERSION, TERMS_VERSION } from '../config/appInfo';
import { PARENT_APPROVAL_AGE } from '../data/friends';
import type { LearnerProfile, TermsConsent } from '../types/learner';

/** A new record for agreeing now, at the given age */
export function buildTermsConsent(now: Date, age: number): TermsConsent {
  return {
    acceptedAt: now.toISOString(),
    termsVersion: TERMS_VERSION,
    privacyVersion: PRIVACY_VERSION,
    isParentConsent: age < PARENT_APPROVAL_AGE,
  };
}

/** Whether the profile agreed to the texts the app shows now */
export function hasCurrentTermsConsent(profile: Pick<LearnerProfile, 'termsConsent'>): boolean {
  const consent = profile.termsConsent;
  return Boolean(consent && consent.termsVersion === TERMS_VERSION && consent.privacyVersion === PRIVACY_VERSION);
}

/** Sync: the newer agreement wins (an ISO time that sorts later), so a re-agreement to new texts is kept */
export function mergeTermsConsent(local?: TermsConsent, cloud?: TermsConsent): TermsConsent | undefined {
  if (!local) return cloud;
  if (!cloud) return local;
  return cloud.acceptedAt > local.acceptedAt ? cloud : local;
}
