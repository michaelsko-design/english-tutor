import { LearnerProfile, ThemeId, getAgeForGrade } from '../types/learner';
import type { SignupDraft } from '../data/signupDraft';
import { buildSavedProfile } from './buildSavedProfile';
import { DEFAULT_VOICE_PREFERENCE } from './ttsVoice';

/**
 * The onboarded profile a learner gets from the basics they gave (name, gender, grade, consent).
 * The age follows from the grade; theme and Shabbat are not asked, so the saved or default choice
 * stays and the settings change it later.
 */
export function applyBasicsToProfile(initialProfile: LearnerProfile, basics: SignupDraft, now: Date): LearnerProfile {
  const themeId: ThemeId = initialProfile.themeId || 'cozy-studio';
  return buildSavedProfile(
    initialProfile,
    {
      name: basics.name,
      age: getAgeForGrade(basics.gradeId),
      gender: basics.gender,
      gradeId: basics.gradeId,
      themeId,
      isShabbatObserver: initialProfile.isShabbatObserver ?? false,
      isFriendsHubOn: false,
      isUsernameSearchOn: false,
      voicePreference: initialProfile.voicePreference ?? DEFAULT_VOICE_PREFERENCE,
      hasParentConsent: basics.hasParentConsent,
    },
    now
  );
}
