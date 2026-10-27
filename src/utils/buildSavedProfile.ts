import type { CompanionId, GradeId, LearnerGender, LearnerProfile, ThemeId } from '../types/learner';
import {
  PARENT_APPROVAL_AGE,
  isFriendsHubEnabled,
  isUsernameSearchable,
  setFriendsHubEnabled,
  setUsernameSearchable,
} from '../data/friends';
import type { VoicePreference } from './ttsVoice';

/** The fields the settings and the first-run screen let the learner edit */
export interface ProfileDraft {
  name: string;
  age: number;
  gender: LearnerGender;
  gradeId: GradeId;
  themeId: ThemeId;
  /** Unset until the learner picks a mascot (then the theme's default one is shown) */
  companionId?: CompanionId;
  isShabbatObserver: boolean;
  isFriendsHubOn: boolean;
  isUsernameSearchOn: boolean;
  voicePreference: VoicePreference;
  hasParentConsent: boolean;
}

/** Applies a draft onto the profile; the one place the settings/onboarding save logic lives. */
export function buildSavedProfile(
  initialProfile: LearnerProfile,
  draft: ProfileDraft,
  now: Date
): LearnerProfile {
  const isChild = draft.age < PARENT_APPROVAL_AGE;
  const withFriendsHub =
    draft.isFriendsHubOn === isFriendsHubEnabled(initialProfile)
      ? initialProfile
      : setFriendsHubEnabled({ ...initialProfile, age: draft.age }, draft.isFriendsHubOn, now);
  const withUsernameSearch =
    draft.isUsernameSearchOn === isUsernameSearchable(withFriendsHub)
      ? withFriendsHub
      : setUsernameSearchable(withFriendsHub, draft.isUsernameSearchOn, now);
  return {
    ...withUsernameSearch,
    ...(isChild && draft.hasParentConsent && !initialProfile.parentalConsentAt
      ? { parentalConsentAt: now.toISOString() }
      : {}),
    isOnboarded: true,
    name: draft.name.trim(),
    age: draft.age,
    gender: draft.gender,
    gradeId: draft.gradeId,
    // The grade picked here is the school grade (placement tests may move the practice grade),
    // so an unchanged pick keeps the school grade it already has
    schoolGradeId:
      draft.gradeId === initialProfile.gradeId
        ? (initialProfile.schoolGradeId ?? draft.gradeId)
        : draft.gradeId,
    themeId: draft.themeId,
    ...(draft.companionId ? { companionId: draft.companionId } : {}),
    isShabbatObserver: draft.isShabbatObserver,
    voicePreference: draft.voicePreference,
    stats: {
      ...initialProfile.stats,
      shabbatShieldActive: draft.isShabbatObserver,
    },
  };
}
