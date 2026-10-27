import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import { isFriendsHubEnabled } from '../data/friends';
import { buildSavedProfile, type ProfileDraft } from './buildSavedProfile';

const NOW = new Date('2026-03-04T10:00:00.000Z');

function draftOf(overrides: Partial<ProfileDraft> = {}): ProfileDraft {
  return {
    name: '  נועה ',
    age: 14,
    gender: 'girl',
    gradeId: 'grade-8',
    themeId: 'cozy-studio',
    isShabbatObserver: true,
    isFriendsHubOn: false,
    isUsernameSearchOn: false,
    voicePreference: 'female',
    hasParentConsent: false,
    ...overrides,
  };
}

describe('buildSavedProfile', () => {
  it('saves a chosen mascot and keeps the field out until one is chosen', () => {
    expect(buildSavedProfile(makeProfile(), draftOf({ companionId: 'dj-beat' }), NOW).companionId).toBe('dj-beat');
    expect('companionId' in buildSavedProfile(makeProfile(), draftOf(), NOW)).toBe(false);
  });

  it('applies the draft, trims the name and marks the profile onboarded', () => {
    const saved = buildSavedProfile(makeProfile(), draftOf(), NOW);

    expect(saved).toMatchObject({
      name: 'נועה',
      age: 14,
      gradeId: 'grade-8',
      schoolGradeId: 'grade-8',
      isOnboarded: true,
      voicePreference: 'female',
    });
    expect(saved.stats.shabbatShieldActive).toBe(true);
  });

  it('records a parent\'s consent once for a learner under 13', () => {
    const saved = buildSavedProfile(makeProfile(), draftOf({ age: 9, hasParentConsent: true }), NOW);
    expect(saved.parentalConsentAt).toBe(NOW.toISOString());

    const again = buildSavedProfile(saved, draftOf({ age: 9, hasParentConsent: true }), new Date('2026-04-01'));
    expect(again.parentalConsentAt).toBe(NOW.toISOString());
  });

  it('turns the friends hub on when the draft asks for it', () => {
    const saved = buildSavedProfile(makeProfile(), draftOf({ isFriendsHubOn: true }), NOW);
    expect(isFriendsHubEnabled(saved)).toBe(true);
  });

  it('does not mutate the profile it was given', () => {
    const profile = makeProfile();
    const before = JSON.stringify(profile);
    buildSavedProfile(profile, draftOf({ themeId: 'cozy-studio', isFriendsHubOn: true }), NOW);
    expect(JSON.stringify(profile)).toBe(before);
  });
});
