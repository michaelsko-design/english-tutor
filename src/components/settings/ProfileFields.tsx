import React, { useId } from 'react';
import { Palette, ShieldCheck, Users } from 'lucide-react';
import type { CompanionId, LearnerGender, ThemeId } from '../../types/learner';
import {
  getPickableThemeIds,
  resolveTheme,
  THEME_BASES,
  type ThemeAudience,
  type ThemeDefinition,
} from '../../themes/themeRegistry';
import { Companion } from '../companion/Companion';

interface ThemedProps {
  theme: ThemeDefinition;
}

const AGE_OPTIONS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

interface NameFieldProps extends ThemedProps {
  value: string;
  gender: LearnerGender;
  errorMsg: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const NameField: React.FC<NameFieldProps> = ({
  value,
  gender,
  errorMsg,
  autoFocus,
  theme,
  onChange,
  onBlur,
}) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs sm:text-sm font-bold">
        איך קוראים לך?
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={gender === 'girl' ? 'למשל: נועה' : 'למשל: עידו'}
        className={`w-full px-4 py-3 rounded-2xl font-bold text-sm sm:text-base outline-none transition-all ${theme.inputBgClass}`}
        autoFocus={autoFocus}
      />
      {errorMsg && <p className="text-xs font-bold text-rose-500 mt-1">{errorMsg}</p>}
    </div>
  );
};

interface GenderAgeFieldsProps extends ThemedProps {
  gender: LearnerGender;
  age: number;
  onGenderChange: (gender: LearnerGender) => void;
  onAgeChange: (age: number) => void;
}

export const GenderAgeFields: React.FC<GenderAgeFieldsProps> = ({
  gender,
  age,
  theme,
  onGenderChange,
  onAgeChange,
}) => {
  const ageId = useId();
  const options: { id: LearnerGender; emoji: string; labelHe: string }[] = [
    { id: 'girl', emoji: '👧', labelHe: 'בת' },
    { id: 'boy', emoji: '👦', labelHe: 'בן' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <span className="block text-xs sm:text-sm font-bold">מגדר</span>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onGenderChange(option.id)}
              aria-pressed={gender === option.id}
              className={`min-h-11 py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                gender === option.id ? theme.primaryBtnClass : theme.secondaryBtnClass
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.labelHe}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor={ageId} className="block text-xs sm:text-sm font-bold">גיל</label>
        <select
          id={ageId}
          value={age}
          onChange={(e) => onAgeChange(Number(e.target.value))}
          className={`w-full min-h-11 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm outline-none ${theme.inputBgClass}`}
        >
          {AGE_OPTIONS.map((a) => (
            <option key={a} value={a} className="text-slate-900 bg-white">
              גיל {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

interface ThemePickerProps {
  /** The theme shown as chosen (a Pro theme being previewed, or the saved one) */
  themeId: ThemeId;
  /** The learner's chosen mascot, shown on every theme; unset shows each theme's own mascot */
  companionId?: CompanionId;
  onChange: (themeId: ThemeId) => void;
  /** Themes that need Pro get a crown badge (docs/feature-pro-tier.md) */
  isProOnly?: (themeId: ThemeId) => boolean;
  /** Onboarding offers only the themes the learner can keep */
  isProOnlyHidden?: boolean;
  /** The saved theme: a Pro one the learner no longer has is marked as theirs */
  savedThemeId?: ThemeId;
}

/** The crown on a theme or mascot that needs Pro, or "yours with Pro" on a saved one */
export const ProChoiceBadge: React.FC<{ isSaved?: boolean }> = ({ isSaved = false }) => (
  <span className="absolute -top-2 start-1 px-1.5 py-0.5 rounded-full text-xs font-extrabold bg-violet-500 text-white shadow whitespace-nowrap">
    👑 {isSaved ? 'שלך עם ' : ''}
    <span dir="ltr" lang="en">
      Pro
    </span>
  </span>
);

const AUDIENCE_GROUPS: ReadonlyArray<{ audience: ThemeAudience; labelHe: string }> = [
  { audience: 'young', labelHe: 'כיפי וצבעוני' },
  { audience: 'teen', labelHe: 'בוגר ונקי' },
];

export const ThemePicker: React.FC<ThemePickerProps> = ({
  themeId,
  companionId,
  onChange,
  isProOnly = () => false,
  isProOnlyHidden = false,
  savedThemeId,
}) => {
  const pickableIds = getPickableThemeIds(themeId).filter((id) => !isProOnlyHidden || !isProOnly(id));
  const groups = AUDIENCE_GROUPS.map((group) => ({
    ...group,
    ids: pickableIds.filter((id) => THEME_BASES[id].audience === group.audience),
  })).filter((group) => group.ids.length > 0);
  const isGrouped = groups.length > 1;

  return (
    <div className="space-y-1.5">
      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
        <Palette className="w-4 h-4" />
        <span>ערכת עיצוב:</span>
      </span>
      {groups.map((group) => (
        <div key={group.audience} role="group" aria-label={isGrouped ? group.labelHe : undefined} className="space-y-1">
          {isGrouped && <span className="block text-xs font-bold opacity-75">{group.labelHe}</span>}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {group.ids.map((tKey) => {
              const tItem = resolveTheme(tKey, companionId);
              const isSelected = tKey === themeId;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => onChange(tKey)}
                  aria-pressed={isSelected}
                  aria-label={isProOnly(tKey) ? `${tItem.name}, זמין ב-Pro` : tItem.name}
                  className={`relative px-1 py-2.5 sm:p-2.5 rounded-xl text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 border border-current/20 ${
                    tItem.pageBgClass
                  } ${isSelected ? 'ring-2 ring-offset-2 ring-fuchsia-500' : 'opacity-75 hover:opacity-100'}`}
                >
                  {isProOnly(tKey) && <ProChoiceBadge isSaved={tKey === savedThemeId} />}
                  <Companion theme={tItem} pose="idle" size={40} hasShadow={false} />
                  <span className="font-extrabold text-xs leading-tight break-words max-w-full" dir="ltr" lang="en">
                    {tItem.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ShabbatToggleProps extends ThemedProps {
  gender: LearnerGender;
  isOn: boolean;
  onToggle: () => void;
}

export const ShabbatToggle: React.FC<ShabbatToggleProps> = ({ gender, isOn, theme, onToggle }) => (
  <div className="space-y-1.5">
    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
      <ShieldCheck className="w-4 h-4 text-emerald-500" />
      <span>מגן שבת וחג:</span>
    </span>
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isOn}
      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
        isOn ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-current/10 bg-black/5 dark:bg-white/5 opacity-80'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
          isOn ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-400 bg-transparent'
        }`}
      >
        {isOn && <span className="text-xs font-black">✓</span>}
      </div>
      <div className="space-y-0.5 flex-1">
        <div className="font-extrabold text-xs sm:text-sm flex items-center gap-2">
          <span>{gender === 'girl' ? 'שומרת שבת' : 'שומר שבת'}</span>
          {isOn && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              פעיל
            </span>
          )}
        </div>
        <p className={`text-xs ${theme.mutedTextClass}`}>
          {isOn ? 'הרצף מוגן אוטומטית בימי שישי ושבת 🛡️' : 'רצף הלמידה נספר בכל ימות השבוע 🔥'}
        </p>
      </div>
    </button>
  </div>
);

interface FriendsHubFieldsProps extends ThemedProps {
  isOn: boolean;
  isChild: boolean;
  isTurningOnForChild: boolean;
  isParentApproving: boolean;
  hasUsername: boolean;
  isUsernameSearchOn: boolean;
  onToggle: () => void;
  onParentApprovalChange: (isApproving: boolean) => void;
  onUsernameSearchChange: (isOn: boolean) => void;
}

export const FriendsHubFields: React.FC<FriendsHubFieldsProps> = ({
  isOn,
  isChild,
  isTurningOnForChild,
  isParentApproving,
  hasUsername,
  isUsernameSearchOn,
  theme,
  onToggle,
  onParentApprovalChange,
  onUsernameSearchChange,
}) => (
  <div className="space-y-1.5">
    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
      <Users className="w-4 h-4 text-sky-500" />
      <span>מרכז החברים:</span>
    </span>
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isOn}
      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
        isOn ? 'border-sky-500/50 bg-sky-500/10' : 'border-current/10 bg-black/5 dark:bg-white/5 opacity-80'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
          isOn ? 'border-sky-500 bg-sky-500 text-white' : 'border-gray-400 bg-transparent'
        }`}
      >
        {isOn && <span className="text-xs font-black">✓</span>}
      </div>
      <div className="space-y-0.5 flex-1">
        <div className="font-extrabold text-xs sm:text-sm">{isOn ? 'מרכז החברים פעיל' : 'מרכז החברים כבוי'}</div>
        <p className={`text-xs ${theme.mutedTextClass}`}>
          {isOn
            ? 'חברים רואים את השם, הדמות וההתקדמות. אין צ׳אט 👫'
            : isChild
              ? 'מתחת לגיל 13 הורה מפעיל את מרכז החברים 🔒'
              : 'הכרטיס מוסתר וחברים לא רואים את ההתקדמות 🔒'}
        </p>
      </div>
    </button>
    {isTurningOnForChild && (
      <label className="flex items-start gap-2 p-3 rounded-2xl border border-amber-500/50 bg-amber-500/10 text-xs sm:text-sm font-bold">
        <input
          type="checkbox"
          checked={isParentApproving}
          onChange={(e) => onParentApprovalChange(e.target.checked)}
          className="mt-0.5 w-5 h-5 shrink-0"
        />
        <span>אני הורה ומאשר/ת שהילד/ה יוסיפו חברים. חברים יראו שם פרטי, דמות והתקדמות, בלי צ׳אט.</span>
      </label>
    )}
    {isOn && hasUsername && (
      <label className="flex items-start gap-2 p-3 rounded-2xl border border-current/10 text-xs sm:text-sm font-bold">
        <input
          type="checkbox"
          checked={isUsernameSearchOn}
          onChange={(e) => onUsernameSearchChange(e.target.checked)}
          className="mt-0.5 w-5 h-5 shrink-0"
        />
        <span>
          אפשר למצוא אותי לפי שם המשתמש
          <span className={`block font-normal ${theme.mutedTextClass}`}>
            כשזה כבוי, חברים מוסיפים רק עם קוד החבר שלך.
          </span>
        </span>
      </label>
    )}
  </div>
);
