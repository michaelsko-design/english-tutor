import React, { useState } from 'react';
import {
  AuthUserSummary,
  CloudSyncStatus,
  GradeId,
  LearnerProfile,
  PlacementResult,
  ProficiencyTier,
  SUPPORTED_GRADES,
  ThemeId,
} from '../types/learner';
import {
  THEME_REGISTRY,
  TIER_CONFIG,
} from '../themes/themeRegistry';
import { CURRICULUM_BY_GRADE, MissionNode } from '../data/curriculum';
import { countCompletedMissions, getSuggestedMission } from '../data/milestones';
import { DailyQuestDefinition, RewardShopItem } from '../data/rewardShop';
import { MissionMap } from './MissionMap';
import { MissionRunner } from './MissionRunner';
import { VocabularyVaultModal } from './VocabularyVaultModal';
import { DailyQuestsCard } from './DailyQuestsCard';
import { RewardShopModal } from './RewardShopModal';
import { AuthModal } from './AuthModal';
import { PlacementTest } from './PlacementTest';
import { applyPlacementToProfile } from '../data/placementTest';
import { levelForXp, recordDailyActivity } from '../data/progressRewards';
import { ExamPrepHub } from './examPrep/ExamPrepHub';
import { getHebrewCopy, inflectHebrew } from '../utils/hebrewGender';
import {
  Flame,
  Star,
  Gem,
  Zap,
  Play,
  Settings,
  ShieldCheck,
  BookOpen,
  ShoppingBag,
  Cloud,
  CloudOff,
  RefreshCw,
  Home,
  Map as MapIcon,
  GraduationCap,
  Palette,
  Sparkles,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  profile: LearnerProfile;
  authUser: AuthUserSummary | null;
  syncStatus: CloudSyncStatus;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onEditOnboarding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  authUser,
  syncStatus,
  onUpdateProfile,
  onEditOnboarding,
}) => {
  const [activePracticeMission, setActivePracticeMission] =
    useState<MissionNode | null>(null);
  const [isVocabVaultOpen, setIsVocabVaultOpen] = useState(false);
  const [isRewardShopOpen, setIsRewardShopOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);

  const theme = THEME_REGISTRY[profile.themeId] || THEME_REGISTRY['cozy-studio'];
  const activeAvatarEmoji = profile.equippedAvatarEmoji || theme.avatarEmoji;
  const heb = getHebrewCopy(profile.gender, profile.name);
  const currentGradeMeta =
    SUPPORTED_GRADES.find((g) => g.id === profile.gradeId) || SUPPORTED_GRADES[6];

  const gradeCurriculum =
    CURRICULUM_BY_GRADE[profile.gradeId] || CURRICULUM_BY_GRADE['grade-7'];
  const totalGradeStarsPossible =
    gradeCurriculum.units.reduce((acc, u) => acc + u.missions.length * 3, 0) || 36;
  const { mission: todaysMission, bossGate: todaysBossGate } = getSuggestedMission(
    gradeCurriculum.units,
    profile.missionProgress || {}
  );
  const missionsCompletedCount = countCompletedMissions(profile.missionProgress || {});
  const activeTier = TIER_CONFIG[profile.preferredTier];

  const calculatedXp = Math.round(todaysMission.baseXp * activeTier.xpMultiplier);
  const calculatedDiamonds = todaysMission.baseDiamonds + activeTier.diamondBonus;

  // Built-in Web Speech API Text-to-Speech (TTS)
  const speakEnglish = (text: string, rate = 0.95) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const handleLaunchMission = (mission: MissionNode) => {
    setActivePracticeMission(mission);
  };

  const handleCompleteMission = (result: {
    missionId: string;
    starsEarned: 1 | 2 | 3;
    xpEarned: number;
    diamondsEarned: number;
    wordsLearnedCount: number;
  }) => {
    const prevStarsForMission = profile.missionProgress?.[result.missionId] || 0;
    const updatedMissionStars = Math.max(prevStarsForMission, result.starsEarned);
    const starDelta = Math.max(0, updatedMissionStars - prevStarsForMission);

    const withActivity = recordDailyActivity(
      profile,
      { missions: 1, voiceWords: 1, threeStarMissions: result.starsEarned === 3 ? 1 : 0 },
      new Date().toISOString().slice(0, 10)
    );
    const newXp = withActivity.stats.xp + result.xpEarned;

    onUpdateProfile({
      ...withActivity,
      missionProgress: {
        ...(profile.missionProgress || {}),
        [result.missionId]: updatedMissionStars,
      },
      stats: {
        ...withActivity.stats,
        xp: newXp,
        level: levelForXp(newXp, withActivity.stats.level),
        stars: profile.stats.stars + starDelta,
        maxPossibleStars: totalGradeStarsPossible,
        diamonds: profile.stats.diamonds + result.diamondsEarned,
        wordsMastered: profile.stats.wordsMastered + result.wordsLearnedCount,
        missionsCompleted: profile.stats.missionsCompleted + 1,
      },
    });

    setActivePracticeMission(null);
  };

  const handleEarnVocabReward = (xpBonus: number, diamondBonus: number) => {
    const newXp = profile.stats.xp + xpBonus;
    const newLevel = Math.max(profile.stats.level, Math.floor(newXp / 150) + 1);
    onUpdateProfile({
      ...profile,
      dailyCounters: {
        ...profile.dailyCounters,
        voiceWordsPracticedToday:
          (profile.dailyCounters?.voiceWordsPracticedToday || 0) + 1,
      },
      stats: {
        ...profile.stats,
        xp: newXp,
        level: newLevel,
        diamonds: profile.stats.diamonds + diamondBonus,
        wordsMastered: profile.stats.wordsMastered + 1,
      },
    });
  };

  const handleClaimDailyQuest = (quest: DailyQuestDefinition) => {
    if (profile.claimedDailyQuestIds?.includes(quest.id)) return;
    const newXp = profile.stats.xp + quest.rewardXp;
    const newLevel = Math.max(profile.stats.level, Math.floor(newXp / 150) + 1);

    onUpdateProfile({
      ...profile,
      claimedDailyQuestIds: [...(profile.claimedDailyQuestIds || []), quest.id],
      stats: {
        ...profile.stats,
        xp: newXp,
        level: newLevel,
        diamonds: profile.stats.diamonds + quest.rewardDiamonds,
      },
    });
  };

  const handleBuyReward = (item: RewardShopItem) => {
    if (profile.stats.diamonds < item.costDiamonds) return;
    const nextUnlocked = Array.from(
      new Set([...(profile.unlockedRewardIds || []), item.id])
    );

    onUpdateProfile({
      ...profile,
      unlockedRewardIds: nextUnlocked,
      equippedAvatarEmoji:
        item.category === 'avatar' ? item.emoji : profile.equippedAvatarEmoji,
      stats: {
        ...profile.stats,
        diamonds: profile.stats.diamonds - item.costDiamonds,
        streakDays:
          item.id === 'boost-streak-shield'
            ? profile.stats.streakDays + 1
            : profile.stats.streakDays,
      },
    });
  };

  const handleEquipAvatar = (emoji: string) => {
    onUpdateProfile({
      ...profile,
      equippedAvatarEmoji: emoji,
    });
  };

  const handleSelectTier = (tier: ProficiencyTier) => {
    onUpdateProfile({
      ...profile,
      preferredTier: tier,
    });
  };

  const handleFinishPlacement = (result: PlacementResult, applyRecommendation: boolean) => {
    onUpdateProfile(applyPlacementToProfile(profile, result, applyRecommendation));
    setIsPlacementOpen(false);
  };

  const formatShortAccountLabel = (u: AuthUserSummary) => {
    if (u.isAnonymous) return 'ענן אורח';
    if (u.email?.endsWith('@peachnote.tutor.local')) {
      return u.email.replace('@peachnote.tutor.local', '');
    }
    return u.displayName?.split(' ')[0] || u.email?.split('@')[0] || profile.name;
  };

  const scrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} pb-24 md:pb-14 transition-colors duration-300`}>
      {/* Compact Single-Row Top Sticky Navigation / HUD */}
      <header className={`sticky top-0 z-30 ${theme.hudBgClass} px-3.5 md:px-8 py-2.5 md:py-3`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Learner Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsRewardShopOpen(true)}
              title="Click to customize Avatar in Reward Shop"
              className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${theme.primaryBtnClass}`}
            >
              {activeAvatarEmoji}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm md:text-base tracking-tight truncate">
                  {theme.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <select
                    aria-label="בחר שכבת לימוד"
                    value={profile.gradeId}
                    onChange={(e) => {
                      const newGrade = e.target.value as GradeId;
                      onUpdateProfile({
                        ...profile,
                        gradeId: newGrade,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold cursor-pointer outline-none border transition-all ${theme.badgeClass}`}
                    title="לחץ להחלפת שכבת לימוד (כיתות א׳–י״ב)"
                  >
                    <optgroup label="🏫 יסודי (כיתות א׳–ו׳)">
                      {SUPPORTED_GRADES.slice(0, 6).map((g) => (
                        <option key={g.id} value={g.id} className="text-slate-900 bg-white">
                          {g.labelHe} · {g.labelEn}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🎒 חטיבת ביניים (כיתות ז׳–ט׳)">
                      {SUPPORTED_GRADES.slice(6, 9).map((g) => (
                        <option key={g.id} value={g.id} className="text-slate-900 bg-white">
                          {g.labelHe} · {g.labelEn}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🎓 תיכון ובגרות (כיתות י׳–י״ב)">
                      {SUPPORTED_GRADES.slice(9, 12).map((g) => (
                        <option key={g.id} value={g.id} className="text-slate-900 bg-white">
                          {g.labelHe} · {g.labelEn}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${theme.badgeClass}`}>
                    Lv.{profile.stats.level}
                  </span>
                </div>
              </div>
              <p className={`text-[11px] hidden sm:block truncate ${theme.mutedTextClass}`} dir="rtl">
                {heb.championBadge} · {theme.companionName}
              </p>
            </div>
          </div>

          {/* Right Controls: Compact Cloud Sync + Quick Diamond Pill (Mobile) + Desktop Actions */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* Compact Mobile Diamond Counter */}
            <button
              type="button"
              onClick={() => setIsRewardShopOpen(true)}
              className={`md:hidden px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 ${theme.secondaryBtnClass}`}
              title="Open Reward Shop"
            >
              <span>💎</span>
              <span>{profile.stats.diamonds}</span>
            </button>

            {/* CLOUD SYNC STATUS BADGE (Icon-only on mobile, short label on sm+) */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              title={
                authUser
                  ? `Logged in as ${authUser.email || authUser.displayName || authUser.uid}`
                  : 'Guest / Local Only (Tap to Sync)'
              }
              className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : syncStatus === 'syncing'
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-300'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              {syncStatus === 'synced' ? (
                <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
              ) : (
                <CloudOff className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="hidden sm:inline" dir="rtl">
                {authUser ? formatShortAccountLabel(authUser) : 'סנכרון'}
              </span>
            </button>

            {/* Desktop Navigation Controls (hidden on mobile where bottom nav is used) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVocabVaultOpen(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.primaryBtnClass}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span dir="rtl">מאגר מילים 🎙️</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRewardShopOpen(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span dir="rtl">חנות ({profile.stats.diamonds} 💎)</span>
              </button>

              <button
                type="button"
                onClick={onEditOnboarding}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                title="הגדרות פרופיל, כיתה ועיצוב"
              >
                <Settings className="w-3.5 h-3.5" />
                <span dir="rtl">פרופיל והגדרות</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="dashboard-top" className="max-w-6xl mx-auto px-3.5 md:px-8 pt-4 md:pt-6 space-y-5 md:space-y-7">
        {/* Compact Greeting & 4-Stat Strip */}
        <section aria-label="Learner Greeting and Statistics" className="space-y-3" dir="rtl">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight">
                {heb.welcomeTitle}
              </h1>
              <p className={`text-xs ${theme.mutedTextClass}`}>
                תוכנית משרד החינוך · {currentGradeMeta.labelHe}
              </p>
            </div>

            {profile.isShabbatObserver !== false && (
              <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${theme.badgeClass}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>מגן שבת פעיל</span>
              </div>
            )}
          </div>

          {/* 5-Pill Achievement Strip: progress row (3) + currency row (2) on mobile, one row on md+ */}
          <div className="grid grid-cols-6 md:grid-cols-5 gap-2 md:gap-3.5">
            {/* Stat 1: Streak */}
            <div className={`col-span-2 md:col-span-1 rounded-2xl p-2.5 md:p-4 ${theme.cardBgClass} flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-right`}>
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-500 shrink-0">
                <Flame className="w-4 h-4 md:w-5 md:h-5 fill-orange-500" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base md:text-xl font-extrabold leading-tight">
                  {profile.stats.streakDays}
                </div>
                <div className={`text-[11px] md:text-xs font-semibold truncate ${theme.mutedTextClass}`}>
                  ימי רצף
                </div>
              </div>
            </div>

            {/* Stat 2: Stars (mastery depth: 1–3 per mission, all grades) */}
            <div
              className={`col-span-2 md:col-span-1 rounded-2xl p-2.5 md:p-4 ${theme.cardBgClass} flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-right`}
              title="כוכבים מודדים עומק שליטה: 1–3 כוכבים לכל משימה"
            >
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-500 shrink-0">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base md:text-xl font-extrabold leading-tight">
                  {profile.stats.stars}
                </div>
                <div className={`text-[11px] md:text-xs font-semibold truncate ${theme.mutedTextClass}`}>
                  כוכבים
                </div>
              </div>
            </div>

            {/* Stat 3: Missions Completed (volume: distinct missions finished at least once) */}
            <div
              className={`col-span-2 md:col-span-1 rounded-2xl p-2.5 md:p-4 ${theme.cardBgClass} flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-right`}
              title="מספר המשימות השונות שהושלמו לפחות פעם אחת"
            >
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-500 shrink-0">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base md:text-xl font-extrabold leading-tight">
                  {missionsCompletedCount}
                </div>
                <div className={`text-[11px] md:text-xs font-semibold truncate ${theme.mutedTextClass}`}>
                  משימות הושלמו
                </div>
              </div>
            </div>

            {/* Stat 4: Diamonds / Gems (Clickable to open Reward Shop) */}
            <button
              type="button"
              onClick={() => setIsRewardShopOpen(true)}
              className={`col-span-3 md:col-span-1 rounded-2xl p-2.5 md:p-4 ${theme.cardBgClass} flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-right hover:ring-2 hover:ring-fuchsia-400 transition-all`}
            >
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-fuchsia-500/15 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-500 shrink-0">
                <Gem className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base md:text-xl font-extrabold leading-tight">
                  {profile.stats.diamonds}
                </div>
                <div className={`text-[11px] md:text-xs font-semibold truncate underline ${theme.mutedTextClass}`}>
                  {theme.currencyNameHe}
                </div>
              </div>
            </button>

            {/* Stat 5: XP & Words Mastered (Clickable to open Vocab Vault) */}
            <button
              type="button"
              onClick={() => setIsVocabVaultOpen(true)}
              className={`col-span-3 md:col-span-1 rounded-2xl p-2.5 md:p-4 ${theme.cardBgClass} flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-right hover:ring-2 hover:ring-purple-400 transition-all`}
            >
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-500 shrink-0">
                <Zap className="w-4 h-4 md:w-5 md:h-5 fill-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base md:text-xl font-extrabold leading-tight" dir="ltr">
                  {profile.stats.xp} XP
                </div>
                <div className={`text-[11px] md:text-xs font-semibold truncate underline ${theme.mutedTextClass}`}>
                  {profile.stats.wordsMastered} מילים
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* HERO CARD: TODAY'S SUGGESTED MISSION WITH 1-TAP START */}
        <section
          aria-label="Today's Suggested Mission"
          className={`rounded-3xl p-4 sm:p-6 md:p-7 ${theme.heroCardClass} transition-all`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
            <div className="space-y-2.5 flex-1">
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2" dir="rtl">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold">
                  ⭐ המשימה היומית
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${theme.badgeClass}`}>
                  ⏱️ {todaysMission.estimatedMinutes} דק׳
                </span>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40" dir="ltr">
                  +{calculatedXp} XP · +{calculatedDiamonds} 💎
                </span>
              </div>

              <div className="space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${theme.accentTextClass}`}>
                  {todaysMission.grammarTopic}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                  Mission {todaysMission.unitNumber}.{todaysMission.missionNumber}:{' '}
                  {todaysMission.titleEn}
                </h2>
                <p className="text-sm sm:text-base font-bold" dir="rtl">
                  {inflectHebrew(todaysMission.titleHe, profile.gender)}
                </p>
                <p className={`text-xs sm:text-sm line-clamp-2 md:line-clamp-none ${theme.mutedTextClass}`} dir="rtl">
                  {inflectHebrew(todaysMission.storyHookHe, profile.gender)}
                </p>
                {todaysBossGate && (
                  <p
                    className="inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-400/20 border border-amber-400/50"
                    dir="rtl"
                  >
                    🔁 {profile.gender === 'girl' ? 'שפרי' : 'שפר'} את המשימה הזו · עוד{' '}
                    {todaysBossGate.missing} ⭐ לפתיחת משימת הבוס
                  </p>
                )}
              </div>
            </div>

            {/* Right Side: Proficiency Tier Selector + Giant 1-Tap Start CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-1 lg:pt-0">
              {/* 3 Proficiency Levels Selector */}
              <div className="space-y-1 w-full lg:w-72" dir="rtl">
                <span className="text-[11px] font-bold block opacity-80">
                  {heb.chooseTierPrompt}
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['explorer', 'challenger', 'master'] as ProficiencyTier[]).map((tKey) => {
                    const tInfo = TIER_CONFIG[tKey];
                    const isSelected = profile.preferredTier === tKey;
                    return (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => handleSelectTier(tKey)}
                        className={`py-2 px-1.5 rounded-xl text-center transition-all ${
                          isSelected
                            ? theme.primaryBtnClass
                            : theme.secondaryBtnClass
                        }`}
                      >
                        <div className="text-xs font-extrabold">
                          {tInfo.badgeEmoji} {tInfo.labelHe}
                        </div>
                        <div className="text-[10px] opacity-80">{tInfo.labelEn}</div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlacementOpen(true)}
                  className={`text-[11px] font-bold flex items-center gap-1 pt-0.5 underline underline-offset-2 hover:opacity-100 opacity-85 ${theme.accentTextClass}`}
                >
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {profile.placementResult
                      ? 'מבחן רמה חוזר 🎯'
                      : profile.gender === 'girl'
                      ? 'לא בטוחה באיזו רמה? מבחן רמה קצר 🎯'
                      : 'לא בטוח באיזו רמה? מבחן רמה קצר 🎯'}
                  </span>
                </button>
              </div>

              {/* 1-TAP START MISSION CTA BUTTON */}
              <button
                type="button"
                onClick={() => handleLaunchMission(todaysMission)}
                className={`w-full lg:w-72 py-3.5 md:py-4 px-6 rounded-2xl font-extrabold text-base md:text-lg flex items-center justify-center gap-2.5 transition-all ${theme.primaryBtnClass}`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span dir="rtl">{heb.startMissionCta}</span>
              </button>
            </div>
          </div>
        </section>

        {/* FEATURE 18: GET READY FOR AN EXAM */}
        <ExamPrepHub
          profile={profile}
          theme={theme}
          onUpdateProfile={onUpdateProfile}
          onSpeakEnglish={speakEnglish}
        />

        {/* FEATURE 5: DAILY QUESTS & SHABBAT-SAFE WEEKLY STREAK TRACKER */}
        <DailyQuestsCard
          streakDays={profile.stats.streakDays}
          dailyCounters={
            profile.dailyCounters || {
              dateStr: new Date().toISOString().slice(0, 10),
              missionsCompletedToday: 0,
              voiceWordsPracticedToday: 0,
              threeStarMissionsToday: 0,
            }
          }
          claimedQuestIds={profile.claimedDailyQuestIds || []}
          gender={profile.gender}
          theme={theme}
          isShabbatObserver={profile.isShabbatObserver !== false}
          onClaimQuest={handleClaimDailyQuest}
          onOpenShop={() => setIsRewardShopOpen(true)}
        />

        {/* FEATURE 2 & 4: INTERACTIVE STORY WORLD & MISSION MAP */}
        <div id="mission-map">
          <MissionMap
            units={gradeCurriculum.units}
            missionProgress={profile.missionProgress || {}}
            selectedTier={profile.preferredTier}
            onSelectTier={handleSelectTier}
            theme={theme}
            gender={profile.gender}
            onStartMission={handleLaunchMission}
            onSpeakEnglish={speakEnglish}
          />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-Friendly, Hidden on Desktop) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        dir="rtl"
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 ${theme.hudBgClass} border-t border-current/10 px-2 py-1.5 backdrop-blur-md`}
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => scrollToSection('dashboard-top')}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>ראשי</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('mission-map')}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <MapIcon className="w-4 h-4 mb-0.5" />
            <span>מפה</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVocabVaultOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>מילים 🎙️</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRewardShopOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span>חנות</span>
          </button>

          <button
            type="button"
            onClick={onEditOnboarding}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span>פרופיל</span>
          </button>
        </div>
      </nav>

      {/* WELCOME COMPLIMENTARY DIAMONDS POPUP FOR NEW LEARNERS */}
      {!profile.hasSeenWelcomeGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`w-full max-w-md rounded-3xl p-6 md:p-8 ${theme.cardBgClass} ${theme.pageBgClass} text-center space-y-5 shadow-2xl border-2 border-fuchsia-400`}
            dir="rtl"
          >
            <div className="w-20 h-20 rounded-3xl mx-auto bg-fuchsia-500/20 border-2 border-fuchsia-400 flex items-center justify-center text-4xl animate-bounce">
              💎
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-extrabold">
                מתנת הצטרפות · WELCOME GIFT!
              </span>
              <h2 className="text-2xl font-extrabold">
                {profile.gender === 'girl'
                  ? `תתחדשי, ${profile.name}! קיבלת 50 יהלומים במתנה! 🎉`
                  : `תתחדש, ${profile.name}! קיבלת 50 יהלומים במתנה! 🎉`}
              </h2>
              <p className={`text-xs md:text-sm ${theme.mutedTextClass} leading-relaxed`}>
                {profile.gender === 'girl'
                  ? 'שמחים שהצטרפת לסטודיו לאנגלית! הענקנו לך 50 יהלומי פתיחה כדי שתוכלי להתחיל בסטייל.'
                  : 'שמחים שהצטרפת לסטודיו לאנגלית! הענקנו לך 50 יהלומי פתיחה כדי שתוכל להתחיל בסטייל.'}
              </p>
            </div>

            <div className="text-right space-y-2.5 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-xs md:text-sm">
              <div className="font-extrabold flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-300">
                <span>🛍️</span>
                <span>מה עושים עם יהלומים?</span>
              </div>
              <p className="opacity-90 leading-relaxed">
                בחנות הפרסים תוכלו לפתוח אווטארים מיוחדים לפרופיל, מדבקות לאלבום הסטודיו, קישוטים לחדר ומגיני רצף!
              </p>

              <div className="font-extrabold flex items-center gap-2 text-amber-600 dark:text-amber-300 pt-1">
                <span>⭐</span>
                <span>איך מרוויחים עוד יהלומים?</span>
              </div>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>השלמת משימות יומיות וקבלת עד 3 כוכבים</li>
                <li>תרגול הגייה במיקרופון במאגר המילים</li>
                <li>השלמת האתגרים היומיים (Daily Quests)</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({
                    ...profile,
                    hasSeenWelcomeGiftModal: true,
                  })
                }
                className={`flex-1 py-3.5 px-5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass}`}
              >
                {profile.gender === 'girl'
                  ? 'איזה כיף, בואי נתחיל! 🚀'
                  : 'איזה כיף, בוא נתחיל! 🚀'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateProfile({
                    ...profile,
                    hasSeenWelcomeGiftModal: true,
                  });
                  setIsRewardShopOpen(true);
                }}
                className={`py-3.5 px-4 rounded-2xl font-extrabold text-xs ${theme.secondaryBtnClass}`}
              >
                הצצה לחנות 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: FULL INTERACTIVE 5-STEP MISSION RUNNER MODAL */}
      {activePracticeMission && (
        <MissionRunner
          mission={activePracticeMission}
          tier={profile.preferredTier}
          onChangeTier={handleSelectTier}
          gender={profile.gender}
          learnerName={profile.name}
          theme={theme}
          onSpeakEnglish={speakEnglish}
          onCompleteMission={handleCompleteMission}
          onClose={() => setActivePracticeMission(null)}
        />
      )}

      {/* FEATURE 11: DIAGNOSTIC LEVEL PLACEMENT TEST */}
      {isPlacementOpen && (
        <PlacementTest
          profile={profile}
          theme={theme}
          mode="on-demand"
          onFinish={handleFinishPlacement}
          onClose={() => setIsPlacementOpen(false)}
        />
      )}

      {/* FEATURE 4: INTERACTIVE VOCABULARY & SPEAKING STUDIO */}
      {isVocabVaultOpen && (
        <VocabularyVaultModal
          units={gradeCurriculum.units}
          gender={profile.gender}
          learnerName={profile.name}
          theme={theme}
          gradeLabel={currentGradeMeta.labelHe}
          ministryBand={currentGradeMeta.ministryBand}
          onSpeakEnglish={speakEnglish}
          onEarnPracticeReward={handleEarnVocabReward}
          onClose={() => setIsVocabVaultOpen(false)}
        />
      )}

      {/* FEATURE 5: INTERACTIVE DIAMOND REWARD SHOP & STICKER ALBUM */}
      {isRewardShopOpen && (
        <RewardShopModal
          diamonds={profile.stats.diamonds}
          unlockedRewardIds={profile.unlockedRewardIds || ['avatar-boba-cat']}
          equippedAvatarEmoji={activeAvatarEmoji}
          gender={profile.gender}
          learnerName={profile.name}
          theme={theme}
          onBuyReward={handleBuyReward}
          onEquipAvatar={handleEquipAvatar}
          onClose={() => setIsRewardShopOpen(false)}
        />
      )}

      {/* FEATURE 6: KID-FRIENDLY CLOUD AUTHENTICATION & CROSS-DEVICE SYNC MODAL */}
      {isAuthModalOpen && (
        <AuthModal
          authUser={authUser}
          syncStatus={syncStatus}
          gender={profile.gender}
          learnerName={profile.name}
          theme={theme}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};
