import React, { useState } from 'react';
import {
  GradeId,
  LearnerGender,
  LearnerProfile,
  SUPPORTED_GRADES,
  ThemeId,
  getRecommendedGradeForAge,
} from '../types/learner';
import { THEME_REGISTRY } from '../themes/themeRegistry';
import { getHebrewCopy } from '../utils/hebrewGender';
import { Sparkles, UserCheck, GraduationCap, Palette, ShieldCheck, Users, Volume2, X } from 'lucide-react';
import { DEFAULT_VOICE_PREFERENCE, type VoicePreference } from '../utils/ttsVoice';
import { VoiceLabCard } from './settings/VoiceLabCard';

const VOICE_OPTIONS: { id: VoicePreference; labelHe: string }[] = [
  { id: 'female', labelHe: '👩 קול נשי' },
  { id: 'male', labelHe: '👨 קול גברי' },
];
import {
  PARENT_APPROVAL_AGE,
  isFriendsHubEnabled,
  isUsernameSearchable,
  setFriendsHubEnabled,
  setUsernameSearchable,
} from '../data/friends';
import { AccountPrivacyCard } from './settings/AccountPrivacyCard';
import { PrivacyNoticeDialog } from './privacy/PrivacyNoticeDialog';
import { auth } from '../services/firebase';
import { usernameFromEmail } from '../utils/username';
import { APP_NAME } from '../config/appInfo';
import { Button } from './ui/Button';
import { Companion } from './companion/Companion';

interface OnboardingViewProps {
  initialProfile: LearnerProfile;
  onComplete: (updatedProfile: LearnerProfile) => void;
  onCancel?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [age, setAge] = useState<number>(initialProfile.age || 12);
  const [gender, setGender] = useState<LearnerGender>(initialProfile.gender || 'girl');
  const [gradeId, setGradeId] = useState<GradeId>(
    initialProfile.gradeId || getRecommendedGradeForAge(12)
  );
  const [themeId, setThemeId] = useState<ThemeId>(
    initialProfile.themeId || 'cozy-studio'
  );
  const [isShabbatObserver, setIsShabbatObserver] = useState<boolean>(
    initialProfile.isShabbatObserver !== undefined
      ? initialProfile.isShabbatObserver
      : true
  );
  const [isFriendsHubOn, setIsFriendsHubOn] = useState<boolean>(isFriendsHubEnabled(initialProfile));
  const [isUsernameSearchOn, setIsUsernameSearchOn] = useState<boolean>(isUsernameSearchable(initialProfile));
  // A parent approves turning the Friends Hub on for a learner under 13
  const [isParentApprovingFriends, setIsParentApprovingFriends] = useState(false);
  // A parent agrees to the privacy notice when a learner under 13 starts
  const [hasParentConsent, setHasParentConsent] = useState(Boolean(initialProfile.parentalConsentAt));
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const isChild = age < PARENT_APPROVAL_AGE;
  const isTurningFriendsOnForChild = isChild && isFriendsHubOn && !isFriendsHubEnabled(initialProfile);
  const hasUsername = Boolean(usernameFromEmail(auth?.currentUser?.email ?? null));
  const [voicePreference, setVoicePreference] = useState<VoicePreference>(
    initialProfile.voicePreference ?? DEFAULT_VOICE_PREFERENCE
  );
  const [errorMsg, setErrorMsg] = useState('');

  const activeTheme = THEME_REGISTRY[themeId];
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

    if (!onCancel && isChild && !hasParentConsent) {
      setErrorMsg('מתחת לגיל 13 צריך שהורה יאשר את מדיניות הפרטיות (סמנו את התיבה למטה).');
      return;
    }
    if (isTurningFriendsOnForChild && !isParentApprovingFriends) {
      setErrorMsg('כדי להפעיל את מרכז החברים מתחת לגיל 13 צריך אישור של הורה (סמנו את התיבה).');
      return;
    }

    const now = new Date();
    const withFriendsHub =
      isFriendsHubOn === isFriendsHubEnabled(initialProfile)
        ? initialProfile
        : setFriendsHubEnabled({ ...initialProfile, age }, isFriendsHubOn, now);
    const withUsernameSearch =
      isUsernameSearchOn === isUsernameSearchable(withFriendsHub)
        ? withFriendsHub
        : setUsernameSearchable(withFriendsHub, isUsernameSearchOn, now);
    onComplete({
      ...withUsernameSearch,
      ...(isChild && hasParentConsent && !initialProfile.parentalConsentAt
        ? { parentalConsentAt: now.toISOString() }
        : {}),
      isOnboarded: true,
      name: name.trim(),
      age,
      gender,
      gradeId,
      // The grade picked here is the school grade (placement tests may move the practice grade)
      schoolGradeId: gradeId,
      themeId,
      isShabbatObserver,
      voicePreference,
      stats: {
        ...initialProfile.stats,
        shabbatShieldActive: isShabbatObserver,
      },
    });
  };

  return (
    <div
      className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-3 sm:p-6 md:p-8 transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-xl lg:max-w-5xl rounded-3xl p-5 sm:p-6 md:p-8 ${activeTheme.cardBgClass} space-y-5 relative`}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`absolute top-4 left-4 min-w-11 min-h-11 flex items-center justify-center rounded-xl ${activeTheme.secondaryBtnClass}`}
            aria-label="חזרה לדשבורד"
            title="חזרה לדשבורד"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl ${activeTheme.primaryBtnClass} animate-float`}
          >
            {activeTheme.avatarEmoji}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{APP_NAME}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {onCancel
              ? 'הגדרות פרופיל, כיתה ועיצוב ⚙️'
              : name.trim()
              ? heb.welcomeTitle
              : gender === 'girl'
              ? <>ברוכה הבאה ל־<bdi>{APP_NAME}</bdi>! ✨</>
              : <>ברוך הבא ל־<bdi>{APP_NAME}</bdi>! ✨</>}
          </h1>
          <p className={`text-xs sm:text-sm ${activeTheme.mutedTextClass}`}>
            {heb.onboardingSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:items-start">
          {/* 1. Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold">
              איך קוראים לך?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder={gender === 'girl' ? 'למשל: נועה' : 'למשל: עידו'}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-sm sm:text-base outline-none transition-all ${activeTheme.inputBgClass}`}
              autoFocus={!onCancel}
            />
            {errorMsg && (
              <p className="text-xs font-bold text-rose-500 mt-1">{errorMsg}</p>
            )}
          </div>

          {/* 2. Gender & Age Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Gender Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold">
                מגדר
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('girl')}
                  className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                    gender === 'girl'
                      ? activeTheme.primaryBtnClass
                      : activeTheme.secondaryBtnClass
                  }`}
                >
                  <span>👧</span>
                  <span>בת</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('boy')}
                  className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                    gender === 'boy'
                      ? activeTheme.primaryBtnClass
                      : activeTheme.secondaryBtnClass
                  }`}
                >
                  <span>👦</span>
                  <span>בן</span>
                </button>
              </div>
            </div>

            {/* Age Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold">גיל</label>
              <select
                value={age}
                onChange={(e) => handleAgeChange(Number(e.target.value))}
                className={`w-full px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm outline-none ${activeTheme.inputBgClass}`}
              >
                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((a) => (
                  <option key={a} value={a} className="text-slate-900 bg-white">
                    גיל {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Multi-Grade Curriculum Pack Selection (All 12 Grades grouped) */}
          <div className="space-y-2.5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>שכבת לימוד (מותאם אוטומטית לפי הגיל):</span>
              </label>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {SUPPORTED_GRADES.find((g) => g.id === gradeId)?.labelHe} · <bdi>{SUPPORTED_GRADES.find((g) => g.id === gradeId)?.ministryBand}</bdi>
              </span>
            </div>

            {/* Elementary School: Grades 1-6 */}
            <div className="space-y-1">
              <div className="text-xs font-extrabold opacity-75">🏫 יסודי (כיתות א׳–ו׳)</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {SUPPORTED_GRADES.slice(0, 6).map((g) => {
                  const isSelected = g.id === gradeId;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGradeId(g.id)}
                      className={`p-2 rounded-xl text-center transition-all ${
                        isSelected
                          ? activeTheme.primaryBtnClass
                          : activeTheme.secondaryBtnClass
                      }`}
                    >
                      <div className="font-extrabold text-xs">{g.labelHe}</div>
                      <div className="text-xs opacity-80 truncate" dir="ltr" lang="en">{g.labelEn}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle School & High School */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Middle School: Grades 7-9 */}
              <div className="space-y-1">
                <div className="text-xs font-extrabold opacity-75">🎒 חטיבת ביניים (כיתות ז׳–ט׳)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {SUPPORTED_GRADES.slice(6, 9).map((g) => {
                    const isSelected = g.id === gradeId;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGradeId(g.id)}
                        className={`p-2 rounded-xl text-center transition-all ${
                          isSelected
                            ? activeTheme.primaryBtnClass
                            : activeTheme.secondaryBtnClass
                        }`}
                      >
                        <div className="font-extrabold text-xs">{g.labelHe}</div>
                        <div className="text-xs opacity-80 truncate" dir="ltr" lang="en">{g.labelEn}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* High School: Grades 10-12 */}
              <div className="space-y-1">
                <div className="text-xs font-extrabold opacity-75">🎓 תיכון ובגרות (כיתות י׳–י״ב)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {SUPPORTED_GRADES.slice(9, 12).map((g) => {
                    const isSelected = g.id === gradeId;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGradeId(g.id)}
                        className={`p-2 rounded-xl text-center transition-all ${
                          isSelected
                            ? activeTheme.primaryBtnClass
                            : activeTheme.secondaryBtnClass
                        }`}
                      >
                        <div className="font-extrabold text-xs">{g.labelHe}</div>
                        <div className="text-xs opacity-80 truncate" dir="ltr" lang="en">{g.labelEn}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Pluggable UI Style Switcher */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
              <Palette className="w-4 h-4" />
              <span>ערכת עיצוב:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEME_REGISTRY) as ThemeId[]).map((tKey) => {
                const tItem = THEME_REGISTRY[tKey];
                const isSelected = tKey === themeId;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setThemeId(tKey)}
                    aria-pressed={isSelected}
                    aria-label={tItem.name}
                    className={`p-2.5 rounded-xl text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 border border-current/20 ${
                      tItem.pageBgClass
                    } ${isSelected ? 'ring-2 ring-offset-2 ring-fuchsia-500' : 'opacity-75 hover:opacity-100'}`}
                  >
                    <Companion theme={tItem} pose="idle" size={40} hasShadow={false} />
                    <span className="font-extrabold text-xs sm:text-xs truncate max-w-full" dir="ltr" lang="en">
                      {tItem.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Shabbat Observance Setting */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>מגן שבת וחג:</span>
            </label>
            <button
              type="button"
              onClick={() => setIsShabbatObserver(!isShabbatObserver)}
              className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                isShabbatObserver
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-current/10 bg-black/5 dark:bg-white/5 opacity-80'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  isShabbatObserver
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-400 bg-transparent'
                }`}
              >
                {isShabbatObserver && <span className="text-xs font-black">✓</span>}
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="font-extrabold text-xs sm:text-sm flex items-center gap-2">
                  <span>{gender === 'girl' ? 'שומרת שבת' : 'שומר שבת'}</span>
                  {isShabbatObserver && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                      פעיל
                    </span>
                  )}
                </div>
                <p className={`text-xs ${activeTheme.mutedTextClass}`}>
                  {isShabbatObserver
                    ? 'הרצף מוגן אוטומטית בימי שישי ושבת 🛡️'
                    : 'רצף הלמידה נספר בכל ימות השבוע 🔥'}
                </p>
              </div>
            </button>
          </div>

          {/* 6. Friends Hub (Feature 19), in the settings only */}
          {onCancel && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                <Users className="w-4 h-4 text-sky-500" />
                <span>מרכז החברים:</span>
              </label>
              <button
                type="button"
                onClick={() => setIsFriendsHubOn(!isFriendsHubOn)}
                aria-pressed={isFriendsHubOn}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                  isFriendsHubOn
                    ? 'border-sky-500/50 bg-sky-500/10'
                    : 'border-current/10 bg-black/5 dark:bg-white/5 opacity-80'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isFriendsHubOn ? 'border-sky-500 bg-sky-500 text-white' : 'border-gray-400 bg-transparent'
                  }`}
                >
                  {isFriendsHubOn && <span className="text-xs font-black">✓</span>}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="font-extrabold text-xs sm:text-sm">
                    {isFriendsHubOn ? 'מרכז החברים פעיל' : 'מרכז החברים כבוי'}
                  </div>
                  <p className={`text-xs ${activeTheme.mutedTextClass}`}>
                    {isFriendsHubOn
                      ? 'חברים רואים את השם, הדמות וההתקדמות. אין צ׳אט 👫'
                      : isChild
                        ? 'מתחת לגיל 13 הורה מפעיל את מרכז החברים 🔒'
                        : 'הכרטיס מוסתר וחברים לא רואים את ההתקדמות 🔒'}
                  </p>
                </div>
              </button>
              {isTurningFriendsOnForChild && (
                <label className="flex items-start gap-2 p-3 rounded-2xl border border-amber-500/50 bg-amber-500/10 text-xs sm:text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={isParentApprovingFriends}
                    onChange={(e) => setIsParentApprovingFriends(e.target.checked)}
                    className="mt-0.5 w-5 h-5 shrink-0"
                  />
                  <span>אני הורה ומאשר/ת שהילד/ה יוסיפו חברים. חברים יראו שם פרטי, דמות והתקדמות, בלי צ׳אט.</span>
                </label>
              )}
              {isFriendsHubOn && hasUsername && (
                <label className="flex items-start gap-2 p-3 rounded-2xl border border-current/10 text-xs sm:text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={isUsernameSearchOn}
                    onChange={(e) => setIsUsernameSearchOn(e.target.checked)}
                    className="mt-0.5 w-5 h-5 shrink-0"
                  />
                  <span>
                    אפשר למצוא אותי לפי שם המשתמש
                    <span className={`block font-normal ${activeTheme.mutedTextClass}`}>
                      כשזה כבוי, חברים מוסיפים רק עם קוד החבר שלך.
                    </span>
                  </span>
                </label>
              )}
            </div>
          )}

          {/* 7. Read-aloud voice (Feature 23), in the settings only */}
          {onCancel && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                <Volume2 className="w-4 h-4 text-pink-500" />
                <span>קול ההקראה:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VOICE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setVoicePreference(option.id)}
                    aria-pressed={voicePreference === option.id}
                    className={`p-3 rounded-2xl border font-extrabold text-xs sm:text-sm transition-all ${
                      voicePreference === option.id
                        ? 'border-pink-500/60 bg-pink-500/10'
                        : 'border-current/10 bg-black/5 dark:bg-white/5 opacity-80'
                    }`}
                  >
                    {option.labelHe}
                  </button>
                ))}
              </div>
              <VoiceLabCard voicePreference={voicePreference} theme={activeTheme} />
            </div>
          )}

          {/* 8. Privacy, data download and account deletion, in the settings only */}
          {onCancel && (
            <div className="space-y-1.5 lg:col-span-2">
              <span className="block text-xs sm:text-sm font-bold">פרטיות וחשבון:</span>
              <AccountPrivacyCard profile={initialProfile} theme={activeTheme} />
            </div>
          )}

          {/* A parent's consent when a learner under 13 starts */}
          {!onCancel && isChild && (
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

          {/* Submit CTA */}
          <div className="lg:col-span-2 flex items-center gap-2.5 pt-1">
            <Button theme={activeTheme} size="lg" className="flex-1" type="submit">
              <UserCheck className="w-5 h-5" />
              <span>
                {onCancel ? 'שמירת שינויים' : 'שמירה וכניסה לדשבורד 🚀'}
              </span>
            </Button>
            {onCancel && (
              <Button theme={activeTheme} variant="secondary" size="lg" onClick={onCancel}>
                ביטול
              </Button>
            )}
          </div>
        </form>
      </div>
      {isPrivacyOpen && <PrivacyNoticeDialog theme={activeTheme} onClose={() => setIsPrivacyOpen(false)} />}
    </div>
  );
};
