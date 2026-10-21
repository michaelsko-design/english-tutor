import React from 'react';
import { BookOpen, Cloud, CloudOff, RefreshCw, Settings, ShoppingBag } from 'lucide-react';
import { AuthUserSummary, CloudSyncStatus, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { getLevelProgress } from '../../utils/rewardFeedback';
import { getCurrentStreak } from '../../data/streak';
import { toLocalDateStr } from '../../utils/dates';
import { usernameFromEmail } from '../../utils/username';
import { useCountUp } from '../../hooks/useCountUp';
import { EmojiIcon } from '../art/EmojiIcon';
import { FluentIcon } from '../hud/FluentIcon';
import { SoundToggle } from '../hud/SoundToggle';
import { ProgressRing } from './ProgressRing';
import { APP_NAME } from '../../config/appInfo';

interface HomeHudProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  avatarEmoji: string;
  authUser: AuthUserSummary | null;
  syncStatus: CloudSyncStatus;
  onOpenStats: () => void;
  onOpenQuests: () => void;
  onOpenShop: () => void;
  onOpenVault: () => void;
  onOpenAuth: () => void;
  onOpenTour: () => void;
  onEditProfile: () => void;
}

const LEVEL_RING_PX = 44;
const LEVEL_RING_STROKE = 4;

const SYNC_CLASS: Record<CloudSyncStatus, string> = {
  synced: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  syncing: 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-300',
  'local-only': 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300',
  'offline-error': 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300',
};

export function shouldShowSyncButton(syncStatus: CloudSyncStatus, authUser: AuthUserSummary | null): boolean {
  return syncStatus === 'offline-error' || syncStatus === 'local-only' || Boolean(authUser?.isAnonymous);
}

function formatShortAccountLabel(user: AuthUserSummary, fallbackName: string): string {
  if (user.isAnonymous) return 'ענן אורח';
  return (
    usernameFromEmail(user.email) ||
    user.displayName?.split(' ')[0] ||
    user.email?.split('@')[0] ||
    fallbackName
  );
}

/**
 * Feature 27: the compact one-row HUD. The avatar sits in a ring of the XP toward the next
 * level (opens the stats sheet), then the streak flame (daily quests) and the gems (shop).
 */
export const HomeHud: React.FC<HomeHudProps> = ({
  profile,
  theme,
  avatarEmoji,
  authUser,
  syncStatus,
  onOpenStats,
  onOpenQuests,
  onOpenShop,
  onOpenVault,
  onOpenAuth,
  onOpenTour,
  onEditProfile,
}) => {
  const diamondsShown = useCountUp(profile.stats.diamonds);
  const streakDays = getCurrentStreak(profile, toLocalDateStr(new Date()));
  const level = getLevelProgress(profile.stats.xp, profile.stats.level);
  const levelLabel = `רמה ${level.level}: עוד ${level.xpToNextLevel} XP לרמה ${level.level + 1}. פתיחת הנתונים שלי`;
  // The cloud button shows only when something needs the learner: a sync problem, or a guest
  // account that isn't saved yet. Logout lives in the profile settings.
  const needsSyncAttention = shouldShowSyncButton(syncStatus, authUser);
  const pillClass =`h-9 px-2.5 rounded-xl text-sm font-extrabold flex items-center gap-1 ${theme.secondaryBtnClass}`;

  return (
    <header className={`sticky top-0 z-30 ${theme.hudBgClass} px-3 md:px-8 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))]`}>
      <div className="max-w-6xl mx-auto flex items-center gap-2">
        {/* Avatar in the level ring */}
        <button
          type="button"
          onClick={onOpenStats}
          aria-label={levelLabel}
          title={levelLabel}
          className="relative shrink-0 rounded-full active:scale-95 transition-transform"
        >
          <ProgressRing
            ratio={level.ratio}
            size={LEVEL_RING_PX}
            strokeWidth={LEVEL_RING_STROKE}
            arcClassName="text-amber-400"
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.primaryBtnClass}`}>
              <EmojiIcon emoji={avatarEmoji} size="1.4rem" />
            </span>
          </ProgressRing>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 min-w-[1.5rem] px-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black leading-4 text-center tabular-nums shadow">
            {level.level}
          </span>
        </button>

        <div className="hidden sm:block min-w-0">
          <p className="font-extrabold text-sm truncate">{profile.name || APP_NAME}</p>
          <p className={`text-xs truncate ${theme.mutedTextClass}`}>
            עוד <bdi>{level.xpToNextLevel} XP</bdi> לרמה {level.level + 1}
          </p>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onOpenQuests}
          className={pillClass}
          aria-label={`${streakDays} ימי רצף. פתיחת האתגרים היומיים`}
          title="ימי רצף ואתגרים יומיים"
        >
          <FluentIcon name="flame" className="w-5 h-5" />
          <span className="tabular-nums">{streakDays}</span>
        </button>

        <button
          type="button"
          onClick={onOpenShop}
          className={pillClass}
          aria-label={`${profile.stats.diamonds} ${theme.currencyNameHe}. פתיחת החנות`}
          title="חנות הפרסים"
        >
          <FluentIcon name="gem" className="w-5 h-5" />
          <span className="tabular-nums">{diamondsShown}</span>
        </button>

        <button
          type="button"
          onClick={onOpenTour}
          className={`h-9 w-9 rounded-xl flex items-center justify-center text-base font-black ${theme.secondaryBtnClass}`}
          aria-label="סיור באפליקציה: איפה הכול נמצא"
          title="סיור באפליקציה"
        >
          <span aria-hidden="true">❓</span>
        </button>

        <SoundToggle className={`h-9 w-9 flex items-center justify-center ${theme.secondaryBtnClass}`} />

        {needsSyncAttention && (
          <button
            type="button"
            onClick={onOpenAuth}
            title={authUser ? `מחובר/ת: ${authUser.email || authUser.displayName || authUser.uid}` : 'סנכרון ענן'}
            aria-label="סנכרון ענן וחשבון"
            className={`h-9 px-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${SYNC_CLASS[syncStatus]}`}
          >
            {syncStatus === 'synced' ? (
              <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
            ) : (
              <CloudOff className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className="hidden lg:inline max-w-[8rem] truncate">
              <bdi>{authUser ? formatShortAccountLabel(authUser, profile.name) : 'סנכרון'}</bdi>
            </span>
          </button>
        )}

        {/* Desktop shortcuts (the bottom nav has them on phones) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenVault}
            className={`h-9 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.primaryBtnClass}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>מאגר מילים 🎙️</span>
          </button>
          <button
            type="button"
            onClick={onOpenShop}
            className={`h-9 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>חנות</span>
          </button>
          <button
            type="button"
            onClick={onEditProfile}
            className={`h-9 w-9 rounded-xl flex items-center justify-center ${theme.secondaryBtnClass}`}
            title="פרופיל והגדרות"
            aria-label="פרופיל והגדרות"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
