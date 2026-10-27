import React, { useEffect, useState } from 'react';
import {
  GradeId,
  LearnerGender,
  LearnerProfile,
  ThemeId,
  getRecommendedGradeForAge,
} from '../types/learner';
import { resolveTheme, THEME_IDS } from '../themes/themeRegistry';
import { getHebrewCopy } from '../utils/hebrewGender';
import { UserCheck } from 'lucide-react';
import { PARENT_APPROVAL_AGE } from '../data/friends';
import { buildSavedProfile } from '../utils/buildSavedProfile';
import { DEFAULT_VOICE_PREFERENCE } from '../utils/ttsVoice';
import { PrivacyNoticeDialog } from './privacy/PrivacyNoticeDialog';
import { APP_NAME } from '../config/appInfo';
import { AppLogo } from './AppLogo';
import { Button } from './ui/Button';
import { preloadCompanion } from './companion/Companion';
import { COMPANION_POSES } from '../themes/themeArt';
import { TOUR_COMPANION_PX } from '../data/appTutorial';
import { GradeSelect } from './settings/GradeSelect';
import { GenderAgeFields, NameField, ShabbatToggle, ThemePicker } from './settings/ProfileFields';

interface OnboardingViewProps {
  initialProfile: LearnerProfile;
  onComplete: (updatedProfile: LearnerProfile) => void;
}

/** The first-run screen. Later changes are made in the settings (`SettingsView`). */
export const OnboardingView: React.FC<OnboardingViewProps> = ({ initialProfile, onComplete }) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [age, setAge] = useState<number>(initialProfile.age || 12);
  const [gender, setGender] = useState<LearnerGender>(initialProfile.gender || 'girl');
  const [gradeId, setGradeId] = useState<GradeId>(
    initialProfile.gradeId || getRecommendedGradeForAge(12)
  );
  const [themeId, setThemeId] = useState<ThemeId>(initialProfile.themeId || 'cozy-studio');
  const [isShabbatObserver, setIsShabbatObserver] = useState<boolean>(
    initialProfile.isShabbatObserver !== undefined ? initialProfile.isShabbatObserver : true
  );
  // A parent agrees to the privacy notice when a learner under 13 starts
  const [hasParentConsent, setHasParentConsent] = useState(Boolean(initialProfile.parentalConsentAt));
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isChild = age < PARENT_APPROVAL_AGE;

  // Warm every pose of each theme's mascot now, so the tour (which follows) never waits on art
  useEffect(() => {
    THEME_IDS.forEach((id) =>
      preloadCompanion(resolveTheme(id, initialProfile.companionId), COMPANION_POSES, TOUR_COMPANION_PX)
    );
  }, [initialProfile.companionId]);

  const activeTheme = resolveTheme(themeId, initialProfile.companionId);
  const heb = getHebrewCopy(gender, name || (gender === 'girl' ? 'נועה' : 'עידו'));

  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    setGradeId(getRecommendedGradeForAge(newAge));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(
        gender === 'girl'
          ? 'כתבי את השם שלך כדי שנוכל להתחיל 😊'
          : 'כתוב את השם שלך כדי שנוכל להתחיל 😊'
      );
      return;
    }
    if (isChild && !hasParentConsent) {
      setErrorMsg('מתחת לגיל 13 צריך שהורה יאשר את מדיניות הפרטיות (סמנו את התיבה למטה).');
      return;
    }
    onComplete(
      buildSavedProfile(
        initialProfile,
        {
          name,
          age,
          gender,
          gradeId,
          themeId,
          isShabbatObserver,
          isFriendsHubOn: false,
          isUsernameSearchOn: false,
          voicePreference: initialProfile.voicePreference ?? DEFAULT_VOICE_PREFERENCE,
          hasParentConsent,
        },
        new Date()
      )
    );
  };

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
            {name.trim()
              ? heb.welcomeTitle
              : gender === 'girl'
              ? <>ברוכה הבאה ל־<bdi>{APP_NAME}</bdi>! ✨</>
              : <>ברוך הבא ל־<bdi>{APP_NAME}</bdi>! ✨</>}
          </h1>
          <p className={`text-xs sm:text-sm ${activeTheme.mutedTextClass}`}>{heb.onboardingSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:items-start">
          <NameField
            value={name}
            gender={gender}
            errorMsg={errorMsg}
            theme={activeTheme}
            autoFocus
            onChange={(value) => {
              setName(value);
              setErrorMsg('');
            }}
          />
          <GenderAgeFields
            gender={gender}
            age={age}
            theme={activeTheme}
            onGenderChange={setGender}
            onAgeChange={handleAgeChange}
          />
          <GradeSelect gradeId={gradeId} theme={activeTheme} onChange={setGradeId} />
          <ThemePicker themeId={themeId} onChange={setThemeId} />
          <ShabbatToggle
            gender={gender}
            isOn={isShabbatObserver}
            theme={activeTheme}
            onToggle={() => setIsShabbatObserver(!isShabbatObserver)}
          />

          {/* A parent's consent when a learner under 13 starts */}
          {isChild && (
            <label className="lg:col-span-2 flex items-start gap-2 p-3 rounded-2xl border border-current/15 text-xs sm:text-sm font-bold">
              <input
                type="checkbox"
                checked={hasParentConsent}
                onChange={(e) => setHasParentConsent(e.target.checked)}
                className="mt-0.5 w-5 h-5 shrink-0"
              />
              <span>
                אני הורה וקראתי את{' '}
                <button type="button" onClick={() => setIsPrivacyOpen(true)} className="underline font-extrabold">
                  מדיניות הפרטיות
                </button>
                . אני מסכים/ה שההתקדמות תישמר בענן.
              </span>
            </label>
          )}

          <div className="lg:col-span-2 flex items-center gap-2.5 pt-1">
            <Button theme={activeTheme} size="lg" className="flex-1" type="submit">
              <UserCheck className="w-5 h-5" />
              <span>שמירה וכניסה לדשבורד 🚀</span>
            </Button>
          </div>
        </form>
      </div>
      {isPrivacyOpen && <PrivacyNoticeDialog theme={activeTheme} onClose={() => setIsPrivacyOpen(false)} />}
    </div>
  );
};
