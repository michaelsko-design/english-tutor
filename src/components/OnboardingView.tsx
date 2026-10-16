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
import { Sparkles, UserCheck, GraduationCap, Palette } from 'lucide-react';

interface OnboardingViewProps {
  initialProfile: LearnerProfile;
  onComplete: (updatedProfile: LearnerProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialProfile,
  onComplete,
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

    onComplete({
      ...initialProfile,
      isOnboarded: true,
      name: name.trim(),
      age,
      gender,
      gradeId,
      themeId,
    });
  };

  return (
    <div
      className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-4 md:p-8 transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-xl rounded-3xl p-6 md:p-8 ${activeTheme.cardBgClass} space-y-6`}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl ${activeTheme.primaryBtnClass} animate-float`}
          >
            {activeTheme.avatarEmoji}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to {activeTheme.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" dir="rtl">
            {name.trim()
              ? heb.welcomeTitle
              : gender === 'girl'
              ? 'ברוכה הבאה לסטודיו לאנגלית! ✨'
              : 'ברוך הבא לסטודיו לאנגלית! ✨'}
          </h1>
          <p className={`text-sm ${activeTheme.mutedTextClass}`} dir="rtl">
            {heb.onboardingSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Name Input */}
          <div className="space-y-1.5" dir="rtl">
            <label className="block text-sm font-bold">
              1. איך קוראים לך? (Your First Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder={gender === 'girl' ? 'למשל: נועה / Noa' : 'למשל: עידו / Ido'}
              className={`w-full px-4 py-3.5 rounded-2xl font-bold text-base outline-none transition-all ${activeTheme.inputBgClass}`}
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs font-bold text-rose-500 mt-1">{errorMsg}</p>
            )}
          </div>

          {/* 2. Gender & Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
            {/* Gender Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold">
                2. אני... (לפנייה נכונה בעברית)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setGender('girl')}
                  className={`py-3 px-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    gender === 'girl'
                      ? activeTheme.primaryBtnClass
                      : activeTheme.secondaryBtnClass
                  }`}
                >
                  <span className="text-lg">👧</span>
                  <span>בת (Girl)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('boy')}
                  className={`py-3 px-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    gender === 'boy'
                      ? activeTheme.primaryBtnClass
                      : activeTheme.secondaryBtnClass
                  }`}
                >
                  <span className="text-lg">👦</span>
                  <span>בן (Boy)</span>
                </button>
              </div>
            </div>

            {/* Age Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold">3. בת/בן כמה את/ה? (Age)</label>
              <select
                value={age}
                onChange={(e) => handleAgeChange(Number(e.target.value))}
                className={`w-full px-4 py-3.5 rounded-2xl font-bold text-sm outline-none ${activeTheme.inputBgClass}`}
              >
                {[9, 10, 11, 12, 13, 14, 15].map((a) => (
                  <option key={a} value={a} className="text-slate-900 bg-white">
                    גיל {a} {a === 12 ? '(מומלץ לכיתה ז׳)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Multi-Grade Curriculum Pack Selection */}
          <div className="space-y-1.5" dir="rtl">
            <label className="flex items-center gap-1.5 text-sm font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>שכבת לימוד (מותאם אוטומטית לפי הגיל, ניתן לשינוי בכל עת):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUPPORTED_GRADES.map((g) => {
                const isSelected = g.id === gradeId;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGradeId(g.id)}
                    className={`p-2.5 rounded-xl text-center transition-all ${
                      isSelected
                        ? activeTheme.primaryBtnClass
                        : activeTheme.secondaryBtnClass
                    }`}
                  >
                    <div className="font-extrabold text-xs">{g.labelHe}</div>
                    <div className="text-[12px] opacity-85">{g.labelEn}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Pluggable UI Style Switcher (Option B selected by default) */}
          <div className="space-y-1.5" dir="rtl">
            <label className="flex items-center gap-1.5 text-sm font-bold">
              <Palette className="w-4 h-4" />
              <span>עיצוב האפליקציה (Option B נבחר כברירת מחדל):</span>
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
                    className={`p-2.5 rounded-xl text-right transition-all ${
                      isSelected
                        ? activeTheme.primaryBtnClass
                        : activeTheme.secondaryBtnClass
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{tItem.avatarEmoji}</span>
                      <span className="font-extrabold text-xs">{tItem.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-transform ${activeTheme.primaryBtnClass}`}
          >
            <UserCheck className="w-5 h-5" />
            <span dir="rtl">
              {gender === 'girl'
                ? 'שמירה וכניסה לדשבורד האישי שלי 🚀'
                : 'שמירה וכניסה לדשבורד האישי שלי 🚀'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
