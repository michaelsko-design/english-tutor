import { GradeId, LearnerProfile, ProficiencyTier, ThemeId, getAgeForGrade } from '../types/learner';
import type { SignupDraft } from '../data/signupDraft';
import { buildSavedProfile } from './buildSavedProfile';
import { DEFAULT_VOICE_PREFERENCE } from './ttsVoice';

/**
 * English starts in 3rd grade in Israel, so a new learner in grades 1–3 practises grade 1 until a
 * placement test moves them (the grade they picked stays their school grade).
 */
const EARLY_GRADES: readonly GradeId[] = ['grade-1', 'grade-2', 'grade-3'];
const EARLY_START_GRADE: GradeId = 'grade-1';

/** Every new learner starts on the easiest tier, so the first missions are winnable */
export const STARTING_TIER: ProficiencyTier = 'explorer';

/** The grade a new learner practises first, given the grade they are in at school. */
export function getStartingGradeId(schoolGradeId: GradeId): GradeId {
  return EARLY_GRADES.includes(schoolGradeId) ? EARLY_START_GRADE : schoolGradeId;
}

/**
 * The onboarded profile a learner gets from the basics they gave (name, gender, grade, consent).
 * The age follows from the grade; theme and Shabbat are not asked, so the saved or default choice
 * stays and the settings change it later. A learner onboarding for the first time starts on the
 * starting grade and the easiest tier.
 */
export function applyBasicsToProfile(initialProfile: LearnerProfile, basics: SignupDraft, now: Date): LearnerProfile {
  const themeId: ThemeId = initialProfile.themeId || 'cozy-studio';
  const saved = buildSavedProfile(
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
  if (initialProfile.isOnboarded) return saved;
  return {
    ...saved,
    schoolGradeId: basics.gradeId,
    gradeId: getStartingGradeId(basics.gradeId),
    preferredTier: STARTING_TIER,
  };
}
