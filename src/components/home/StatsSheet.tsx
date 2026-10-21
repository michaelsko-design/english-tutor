import React from 'react';
import { CheckCircle2, Compass, Settings, ShieldCheck, Target, Zap } from 'lucide-react';
import { GradeId, LearnerProfile, SUPPORTED_GRADES } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { getLevelProgress } from '../../utils/rewardFeedback';
import { getCurrentStreak } from '../../data/streak';
import { toLocalDateStr } from '../../utils/dates';
import { useCountUp } from '../../hooks/useCountUp';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { EmojiIcon } from '../art/EmojiIcon';
import { HudIcon } from '../hud/HudIcon';
import { LevelBadge } from '../hud/LevelBadge';
import { ProgressRing } from './ProgressRing';
import { Button } from '../ui/Button';
import { VibeAmount } from '../ui/VibeAmount';

const STATS_LEVEL_BADGE_SIZE = 52;

interface StatsSheetProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  avatarEmoji: string;
  missionsCompleted: number;
  masteredWords: number;
  onChangeGrade: (gradeId: GradeId) => void;
  onOpenShop: () => void;
  onOpenVault: () => void;
  onOpenPlacement: () => void;
  onOpenTour: () => void;
  onEditProfile: () => void;
  onClose: () => void;
}

const GRADE_GROUPS: { labelHe: string; from: number; to: number }[] = [
  { labelHe: '🏫 יסודי (כיתות א׳–ו׳)', from: 0, to: 6 },
  { labelHe: '🎒 חטיבת ביניים (כיתות ז׳–ט׳)', from: 6, to: 9 },
  { labelHe: '🎓 תיכון ובגרות (כיתות י׳–י״ב)', from: 9, to: 12 },
];

interface StatTileProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  labelHe: string;
  theme: ThemeDefinition;
  titleHe?: string;
  className?: string;
  onClick?: () => void;
}

const StatTile: React.FC<StatTileProps> = ({ icon, value, labelHe, theme, titleHe, className: extraClass = '', onClick }) => {
  const content = (
    <>
      <span className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">{icon}</span>
      <span className="min-w-0 text-right">
        <span className="block text-lg font-extrabold leading-tight tabular-nums">{value}</span>
        <span className={`block text-xs font-semibold ${onClick ? 'underline' : ''} ${theme.mutedTextClass}`}>{labelHe}</span>
      </span>
    </>
  );
  const className = `rounded-2xl p-3 flex items-center gap-2.5 ${theme.cardBgClass} ${extraClass}`;
  if (!onClick) {
    return (
      <div className={className} title={titleHe}>
        {content}
      </div>
    );
  }
  return (
    <button type="button" onClick={onClick} title={titleHe} className={`${className} hover:ring-2 hover:ring-purple-400 transition-all`}>
      {content}
    </button>
  );
};

/**
 * Feature 27: the learner's numbers, moved off the home screen. Opened from the avatar in the
 * HUD: level, the five stat tiles (the words tile opens the Vocabulary Vault), the grade, the
 * Shabbat shield, the placement test and the app tour (Feature 45).
 */
export const StatsSheet: React.FC<StatsSheetProps> = ({
  profile,
  theme,
  avatarEmoji,
  missionsCompleted,
  masteredWords,
  onChangeGrade,
  onOpenShop,
  onOpenVault,
  onOpenPlacement,
  onOpenTour,
  onEditProfile,
  onClose,
}) => {
  const diamondsShown = useCountUp(profile.stats.diamonds);
  const level = getLevelProgress(profile.stats.xp, profile.stats.level);
  const isGirl = profile.gender === 'girl';

  return (
    <ExamModalShell
      theme={theme}
      labelHe="הנתונים שלי"
      onClose={onClose}
      maxWidthClass="max-w-lg"
      header={<h2 className="font-extrabold text-base sm:text-lg">📈 הנתונים שלי</h2>}
    >
      <div className="p-3.5 sm:p-5 space-y-4">
        {/* Level */}
        <div className="flex items-center gap-3">
          <ProgressRing ratio={level.ratio} size={64} strokeWidth={6} arcClassName="text-amber-400">
            <EmojiIcon emoji={avatarEmoji} size="2.25rem" />
          </ProgressRing>
          <div className="min-w-0">
            <p className="font-extrabold text-lg truncate">{profile.name}</p>
            <p className="text-sm font-bold">
              רמה {level.level} · עוד <VibeAmount amount={level.xpToNextLevel} /> לרמה {level.level + 1}
            </p>
          </div>
          <LevelBadge level={level.level} size={STATS_LEVEL_BADGE_SIZE} className="ms-auto" />
        </div>

        {/* The five stat tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <StatTile
            theme={theme}
            icon={<HudIcon name="flame" className="w-7 h-7" />}
            value={getCurrentStreak(profile, toLocalDateStr(new Date()))}
            labelHe="ימי רצף"
          />
          <StatTile
            theme={theme}
            icon={<HudIcon name="star" className="w-7 h-7" />}
            value={profile.stats.stars}
            labelHe="כוכבים"
            titleHe="כוכבים מודדים עומק שליטה: 1–3 כוכבים לכל משימה"
          />
          <StatTile
            theme={theme}
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
            value={missionsCompleted}
            labelHe="משימות הושלמו"
            titleHe="מספר המשימות השונות שהושלמו לפחות פעם אחת"
          />
          <StatTile
            theme={theme}
            icon={<HudIcon name="gem" className="w-7 h-7" />}
            value={diamondsShown}
            labelHe={theme.currencyNameHe}
            onClick={onOpenShop}
          />
          <StatTile
            theme={theme}
            icon={<Zap className="w-6 h-6 text-indigo-500 fill-indigo-400" />}
            value={<VibeAmount amount={profile.stats.xp} />}
            labelHe={`${masteredWords} מילים · מאגר המילים 🎙️`}
            titleHe="מילים של משימות עם 3 כוכבים · פתיחת מאגר המילים"
            className="col-span-2"
            onClick={onOpenVault}
          />
        </div>

        {/* Grade */}
        <label className="block space-y-1">
          <span className="text-sm font-extrabold">שכבת לימוד</span>
          <select
            value={profile.gradeId}
            onChange={(e) => onChangeGrade(e.target.value as GradeId)}
            className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer outline-none ${theme.inputBgClass}`}
          >
            {GRADE_GROUPS.map((group) => (
              <optgroup key={group.labelHe} label={group.labelHe}>
                {SUPPORTED_GRADES.slice(group.from, group.to).map((g) => (
                  <option key={g.id} value={g.id} className="text-slate-900 bg-white">
                    {g.labelHe} · {g.labelEn}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {profile.isShabbatObserver !== false && (
          <p className={`inline-flex px-3 py-1 rounded-full text-xs font-bold items-center gap-1 ${theme.badgeClass}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            מגן שבת פעיל: שישי ושבת לא שוברים את הרצף
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button theme={theme} variant="secondary" onClick={onOpenPlacement}>
            <Target className="w-4 h-4 shrink-0" />
            {profile.placementResult ? 'מבחן רמה חוזר 🎯' : isGirl ? 'לא בטוחה באיזו רמה? מבחן רמה' : 'לא בטוח באיזו רמה? מבחן רמה'}
          </Button>
          <Button theme={theme} variant="secondary" onClick={onOpenTour}>
            <Compass className="w-4 h-4 shrink-0" />
            סיור באפליקציה 🧭
          </Button>
          <Button theme={theme} variant="secondary" className="sm:col-span-2" onClick={onEditProfile}>
            <Settings className="w-4 h-4 shrink-0" />
            פרופיל, עיצוב והגדרות
          </Button>
        </div>
      </div>
    </ExamModalShell>
  );
};
