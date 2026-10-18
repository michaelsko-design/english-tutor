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
import { Sparkles, UserCheck, GraduationCap, Palette, ShieldCheck, Users, X } from 'lucide-react';
import { isFriendsHubEnabled, setFriendsHubEnabled } from '../data/friends';
import { APP_NAME } from '../config/appInfo';

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

    const withFriendsHub =
      isFriendsHubOn === isFriendsHubEnabled(initialProfile)
        ? initialProfile
        : setFriendsHubEnabled(initialProfile, isFriendsHubOn, new Date());
    onComplete({
      ...withFriendsHub,
      isOnboarded: true,
      name: name.trim(),
      age,
      gender,
      gradeId,
      themeId,
      isShabbatObserver,
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
        className={`w-full max-w-xl rounded-3xl p-5 sm:p-6 md:p-8 ${activeTheme.cardBgClass} space-y-5 relative`}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`absolute top-4 left-4 p-2 rounded-xl ${activeTheme.secondaryBtnClass}`}
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="space-y-2.5">
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
                      <div className="text-xs opacity-80 truncate" dir="ltr">{g.labelEn}</div>
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
                        <div className="text-xs opacity-80 truncate" dir="ltr">{g.labelEn}</div>
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
                        <div className="text-xs opacity-80 truncate" dir="ltr">{g.labelEn}</div>
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
                    className={`p-2.5 rounded-xl text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      isSelected
                        ? activeTheme.primaryBtnClass
                        : activeTheme.secondaryBtnClass
                    }`}
                  >
                    <span className="text-base">{tItem.avatarEmoji}</span>
                    <span className="font-extrabold text-xs sm:text-xs truncate max-w-full" dir="ltr">
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
                      : 'הכרטיס מוסתר וחברים לא רואים את ההתקדמות 🔒'}
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              className={`flex-1 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform ${activeTheme.primaryBtnClass}`}
            >
              <UserCheck className="w-5 h-5" />
              <span>
                {onCancel ? 'שמירת שינויים' : 'שמירה וכניסה לדשבורד 🚀'}
              </span>
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`py-3.5 px-5 rounded-2xl font-extrabold text-sm ${activeTheme.secondaryBtnClass}`}
              >
                ביטול
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
