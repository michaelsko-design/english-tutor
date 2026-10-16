import React, { useState } from 'react';
import {
  AuthUserSummary,
  CloudSyncStatus,
  GradeId,
  LearnerProfile,
  ProficiencyTier,
  SUPPORTED_GRADES,
  ThemeId,
} from '../types/learner';
import {
  THEME_REGISTRY,
  TIER_CONFIG,
} from '../themes/themeRegistry';
import {
  CURRICULUM_BY_GRADE,
  getSuggestedMissionForGrade,
  MissionNode,
} from '../data/curriculum';
import { DailyQuestDefinition, RewardShopItem } from '../data/rewardShop';
import { MissionMap } from './MissionMap';
import { MissionRunner } from './MissionRunner';
import { VocabularyVaultModal } from './VocabularyVaultModal';
import { DailyQuestsCard } from './DailyQuestsCard';
import { RewardShopModal } from './RewardShopModal';
import { AuthModal } from './AuthModal';
import { getHebrewCopy } from '../utils/hebrewGender';
import {
  Flame,
  Star,
  Gem,
  Zap,
  Play,
  Settings,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Palette,
  BookOpen,
  ShoppingBag,
  Cloud,
  CloudOff,
  RefreshCw,
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

  const theme = THEME_REGISTRY[profile.themeId] || THEME_REGISTRY['cozy-studio'];
  const activeAvatarEmoji = profile.equippedAvatarEmoji || theme.avatarEmoji;
  const heb = getHebrewCopy(profile.gender, profile.name);
  const currentGradeMeta =
    SUPPORTED_GRADES.find((g) => g.id === profile.gradeId) || SUPPORTED_GRADES[2];

  const gradeCurriculum =
    CURRICULUM_BY_GRADE[profile.gradeId] || CURRICULUM_BY_GRADE['grade-7'];
  const totalGradeStarsPossible =
    gradeCurriculum.units.reduce((acc, u) => acc + u.missions.length * 3, 0) || 36;
  const todaysMission = getSuggestedMissionForGrade(
    profile.gradeId,
    profile.missionProgress || {}
  );
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

    const newXp = profile.stats.xp + result.xpEarned;
    const newLevel = Math.max(profile.stats.level, Math.floor(newXp / 150) + 1);
    const isFirstMissionToday =
      (profile.dailyCounters?.missionsCompletedToday || 0) === 0;

    onUpdateProfile({
      ...profile,
      missionProgress: {
        ...(profile.missionProgress || {}),
        [result.missionId]: updatedMissionStars,
      },
      dailyCounters: {
        dateStr: new Date().toISOString().slice(0, 10),
        missionsCompletedToday:
          (profile.dailyCounters?.missionsCompletedToday || 0) + 1,
        voiceWordsPracticedToday:
          (profile.dailyCounters?.voiceWordsPracticedToday || 0) + 1,
        threeStarMissionsToday:
          (profile.dailyCounters?.threeStarMissionsToday || 0) +
          (result.starsEarned === 3 ? 1 : 0),
      },
      stats: {
        ...profile.stats,
        xp: newXp,
        level: newLevel,
        stars: profile.stats.stars + starDelta,
        maxPossibleStars: totalGradeStarsPossible,
        diamonds: profile.stats.diamonds + result.diamondsEarned,
        streakDays: isFirstMissionToday
          ? profile.stats.streakDays + 1
          : profile.stats.streakDays,
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

  const handleSelectGrade = (gradeId: GradeId) => {
    setActivePracticeMission(null);
    onUpdateProfile({
      ...profile,
      gradeId,
    });
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    onUpdateProfile({
      ...profile,
      themeId,
    });
  };

  const formatShortAccountLabel = (u: AuthUserSummary) => {
    if (u.isAnonymous) return 'ענן אורח';
    if (u.email?.endsWith('@peachnote.tutor.local')) {
      return u.email.replace('@peachnote.tutor.local', '');
    }
    return u.displayName || u.email?.split('@')[0] || profile.name;
  };

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} pb-14 transition-colors duration-300`}>
      {/* Top Sticky Navigation / HUD */}
      <header className={`sticky top-0 z-30 ${theme.hudBgClass} px-4 md:px-8 py-3.5`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Learner Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRewardShopOpen(true)}
              title="Click to customize Avatar in Reward Shop"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl ${theme.primaryBtnClass}`}
            >
              {activeAvatarEmoji}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base md:text-lg tracking-tight">
                  {theme.name}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${theme.badgeClass}`}>
                  {currentGradeMeta.labelHe} · Lv. {profile.stats.level}
                </span>
              </div>
              <p className={`text-xs ${theme.mutedTextClass}`} dir="rtl">
                {heb.championBadge} · {theme.companionName}
              </p>
            </div>
          </div>

          {/* Right Controls: Cloud Sync Status Badge, Vocab Vault, Shop, Grade, Theme, Profile */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* CLOUD SYNC STATUS BADGE */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              title={
                authUser
                  ? `Logged in as ${authUser.email || authUser.displayName || authUser.uid}`
                  : 'Guest / Local Only (Tap to Sync)'
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : syncStatus === 'syncing'
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-300'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              {syncStatus === 'synced' ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : syncStatus === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin shrink-0" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span dir="rtl">
                {authUser
                  ? `מסונכרן (${formatShortAccountLabel(authUser)})`
                  : heb.localGuestTapToSync}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsVocabVaultOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.primaryBtnClass}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span dir="rtl">מאגר מילים + הגייה 🎙️</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRewardShopOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span dir="rtl">חנות ({profile.stats.diamonds} 💎)</span>
            </button>

            {/* Multi-Grade Architecture Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <GraduationCap className="w-4 h-4 opacity-75 hidden sm:inline" />
              <select
                aria-label="Select Grade Level"
                value={profile.gradeId}
                onChange={(e) => handleSelectGrade(e.target.value as GradeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold outline-none ${theme.secondaryBtnClass}`}
              >
                {SUPPORTED_GRADES.map((g) => (
                  <option key={g.id} value={g.id} className="text-slate-900 bg-white">
                    {g.labelHe} ({g.labelEn})
                  </option>
                ))}
              </select>
            </div>

            {/* Pluggable UI Theme Switcher */}
            <div className="flex items-center gap-1.5 text-xs">
              <Palette className="w-4 h-4 opacity-75 hidden sm:inline" />
              <select
                aria-label="Select Visual Theme"
                value={profile.themeId}
                onChange={(e) => handleSelectTheme(e.target.value as ThemeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold outline-none ${theme.secondaryBtnClass}`}
              >
                {(Object.keys(THEME_REGISTRY) as ThemeId[]).map((tk) => (
                  <option key={tk} value={tk} className="text-slate-900 bg-white">
                    {THEME_REGISTRY[tk].avatarEmoji} {THEME_REGISTRY[tk].name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onEditOnboarding}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
              title="Edit Name, Age or Gender"
            >
              <Settings className="w-3.5 h-3.5" />
              <span dir="rtl">פרופיל</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (Mobile-First + Laptop Grid) */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 space-y-8">
        {/* Personalized Welcome Banner */}
        <section
          className={`rounded-3xl p-5 md:p-6 ${theme.cardBgClass} flex flex-col md:flex-row md:items-center justify-between gap-4`}
          dir="rtl"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                מותאם לתוכנית משרד החינוך · {currentGradeMeta.labelHe} ({currentGradeMeta.ministryBand})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {heb.welcomeTitle}
            </h1>
            <p className={`text-sm ${theme.mutedTextClass}`}>
              {currentGradeMeta.descriptionHe}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <div className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${theme.badgeClass}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>מגן שבת וחג פעיל (Shabbat Streak Safe)</span>
            </div>
          </div>
        </section>

        {/* Clear 4-Card Achievement Stats Grid */}
        <section aria-label="Achievement Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Stat 1: Streak */}
          <div className={`rounded-2xl p-4 md:p-5 ${theme.cardBgClass} flex items-center gap-3.5`}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-500 shrink-0">
              <Flame className="w-6 h-6 fill-orange-500" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold">
                {profile.stats.streakDays} ימים
              </div>
              <div className={`text-xs font-semibold ${theme.mutedTextClass}`} dir="rtl">
                רצף למידה (Daily Streak)
              </div>
            </div>
          </div>

          {/* Stat 2: Stars */}
          <div className={`rounded-2xl p-4 md:p-5 ${theme.cardBgClass} flex items-center gap-3.5`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-500 shrink-0">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold">
                {profile.stats.stars} / {totalGradeStarsPossible}
              </div>
              <div className={`text-xs font-semibold ${theme.mutedTextClass}`} dir="rtl">
                כוכבי משימות (Stars)
              </div>
            </div>
          </div>

          {/* Stat 3: Diamonds / Gems (Clickable to open Reward Shop!) */}
          <div
            onClick={() => setIsRewardShopOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsRewardShopOpen(true);
            }}
            className={`rounded-2xl p-4 md:p-5 ${theme.cardBgClass} flex items-center gap-3.5 cursor-pointer hover:ring-2 hover:ring-fuchsia-400 transition-all`}
          >
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-500 shrink-0">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold">
                {profile.stats.diamonds}
              </div>
              <div className={`text-xs font-semibold underline ${theme.mutedTextClass}`} dir="rtl">
                {theme.currencyNameHe} (לחנות 🛍️)
              </div>
            </div>
          </div>

          {/* Stat 4: XP & Words Mastered (Clickable to open Vocab Vault!) */}
          <div
            onClick={() => setIsVocabVaultOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsVocabVaultOpen(true);
            }}
            className={`rounded-2xl p-4 md:p-5 ${theme.cardBgClass} flex items-center gap-3.5 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-500 shrink-0">
              <Zap className="w-6 h-6 fill-indigo-400" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold">
                {profile.stats.xp.toLocaleString()} XP
              </div>
              <div className={`text-xs font-semibold underline ${theme.mutedTextClass}`} dir="rtl">
                {heb.youLearnedWords(profile.stats.wordsMastered)} (לתרגול)
              </div>
            </div>
          </div>
        </section>

        {/* HERO CARD: TODAY'S SUGGESTED MISSION WITH 1-TAP START */}
        <section
          aria-label="Today's Suggested Mission"
          className={`rounded-3xl p-6 md:p-8 ${theme.heroCardClass} transition-all`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wide">
                  ⭐ Today&apos;s Suggested Mission · המשימה היומית
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeClass}`}>
                  ⏱️ {todaysMission.estimatedMinutes} דקות · 🔊 קריאה, האזנה ודיבור
                </span>
              </div>

              <div className="space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${theme.accentTextClass}`}>
                  {todaysMission.grammarTopic}
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Mission {todaysMission.unitNumber}.{todaysMission.missionNumber}:{' '}
                  {todaysMission.titleEn}
                </h2>
                <p className="text-base font-bold" dir="rtl">
                  {todaysMission.titleHe} — {heb.readyForMission}
                </p>
                <p className={`text-sm ${theme.mutedTextClass}`} dir="rtl">
                  {todaysMission.storyHookHe}
                </p>
              </div>

              {/* Skill Pills & Reward Preview */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {todaysMission.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`text-xs font-bold px-3 py-1 rounded-xl ${theme.secondaryBtnClass}`}
                  >
                    ✓ {skill}
                  </span>
                ))}
                <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
                  🎁 +{calculatedXp} XP · +{calculatedDiamonds} 💎 · Up to 3 ⭐
                </span>
              </div>
            </div>

            {/* Right Side: Proficiency Tier Selector + Giant 1-Tap Start CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 shrink-0">
              {/* 3 Proficiency Levels Selector */}
              <div className="space-y-1.5 w-full lg:w-72" dir="rtl">
                <span className="text-xs font-bold block opacity-85">
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
                        className={`p-2 rounded-xl text-center transition-all ${
                          isSelected
                            ? theme.primaryBtnClass
                            : theme.secondaryBtnClass
                        }`}
                      >
                        <div className="text-sm">{tInfo.badgeEmoji}</div>
                        <div className="text-xs font-extrabold">{tInfo.labelEn}</div>
                        <div className="text-[12px] opacity-85">{tInfo.labelHe}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-TAP START MISSION CTA BUTTON */}
              <button
                type="button"
                onClick={() => handleLaunchMission(todaysMission)}
                className={`w-full lg:w-72 py-4 px-6 rounded-2xl font-extrabold text-base md:text-lg flex items-center justify-center gap-2.5 transition-all ${theme.primaryBtnClass}`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span dir="rtl">{heb.startMissionCta}</span>
              </button>
            </div>
          </div>
        </section>

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
          onClaimQuest={handleClaimDailyQuest}
          onOpenShop={() => setIsRewardShopOpen(true)}
        />

        {/* FEATURE 2 & 4: INTERACTIVE STORY WORLD & MISSION MAP */}
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
      </main>

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
                  ? 'איזה כיף, בואו נתחיל! 🚀'
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

      {/* FEATURE 4: INTERACTIVE BAND II VOCABULARY & SPEAKING STUDIO */}
      {isVocabVaultOpen && (
        <VocabularyVaultModal
          units={gradeCurriculum.units}
          gender={profile.gender}
          learnerName={profile.name}
          theme={theme}
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
