import React, { useEffect, useState } from 'react';
import { GradeId, LearnerGender, LearnerProfile, getRecommendedGradeForAge } from '../types/learner';
import { resolveTheme, THEME_IDS } from '../themes/themeRegistry';
import { getHebrewCopy } from '../utils/hebrewGender';
import { applyBasicsToProfile } from '../utils/applyBasicsToProfile';
import { APP_NAME } from '../config/appInfo';
import { AppLogo } from './AppLogo';
import { preloadCompanion } from './companion/Companion';
import { COMPANION_POSES } from '../themes/themeArt';
import { TOUR_COMPANION_PX } from '../data/appTutorial';
import { trackEvent } from '../services/analytics';
import type { SignupDraft } from '../data/signupDraft';
import { LearnerBasicsForm } from './LearnerBasicsForm';

interface OnboardingViewProps {
  initialProfile: LearnerProfile;
  onComplete: (updatedProfile: LearnerProfile) => void;
}

/** The first-run screen. Later changes are made in the settings (`SettingsView`). */
export const OnboardingView: React.FC<OnboardingViewProps> = ({ initialProfile, onComplete }) => {
  const [preview, setPreview] = useState<{ name: string; gender: LearnerGender }>({
    name: initialProfile.name || '',
    gender: initialProfile.gender || 'girl',
  });
  const initialBasics: SignupDraft = {
    name: initialProfile.name || '',
    gender: initialProfile.gender || 'girl',
    gradeId: (initialProfile.gradeId || getRecommendedGradeForAge(12)) as GradeId,
    hasParentConsent: Boolean(initialProfile.parentalConsentAt),
  };

  useEffect(() => {
    trackEvent('onboarding_view');
  }, []);

  // Warm every pose of each theme's mascot now, so the tour (which follows) never waits on art
  useEffect(() => {
    THEME_IDS.forEach((id) =>
      preloadCompanion(resolveTheme(id, initialProfile.companionId), COMPANION_POSES, TOUR_COMPANION_PX)
    );
  }, [initialProfile.companionId]);

  const activeTheme = resolveTheme(initialProfile.themeId || 'cozy-studio', initialProfile.companionId);
  const heb = getHebrewCopy(preview.gender, preview.name || (preview.gender === 'girl' ? 'נועה' : 'עידו'));

  return (
    <div
      className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-3 sm:p-6 md:p-8 transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-xl lg:max-w-5xl rounded-3xl p-5 sm:p-6 md:p-8 ${activeTheme.cardBgClass} space-y-5 relative`}
      >
        <div className="text-center space-y-1.5">
          <AppLogo size={64} className="mx-auto shadow-lg animate-float" />
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <span>{APP_NAME}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {preview.name.trim()
              ? heb.welcomeTitle
              : preview.gender === 'girl'
              ? <>ברוכה הבאה ל־<bdi>{APP_NAME}</bdi>! ✨</>
              : <>ברוך הבא ל־<bdi>{APP_NAME}</bdi>! ✨</>}
          </h1>
          <p className={`text-xs sm:text-sm ${activeTheme.mutedTextClass}`}>{heb.onboardingSubtitle}</p>
        </div>

        <LearnerBasicsForm
          theme={activeTheme}
          initial={initialBasics}
          submitLabel="יאללה 🚀"
          layoutClassName="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:items-start"
          onPreviewChange={setPreview}
          onSubmit={(basics) => onComplete(applyBasicsToProfile(initialProfile, basics, new Date()))}
        />
      </div>
    </div>
  );
};
