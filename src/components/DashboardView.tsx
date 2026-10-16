import React, { useState } from 'react';
import {
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
import { MissionMap } from './MissionMap';
import { MissionRunner } from './MissionRunner';
import { VocabularyVaultModal } from './VocabularyVaultModal';
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
} from 'lucide-react';

interface DashboardViewProps {
  profile: LearnerProfile;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onEditOnboarding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  onUpdateProfile,
  onEditOnboarding,
}) => {
  const [activePracticeMission, setActivePracticeMission] =
    useState<MissionNode | null>(null);
  const [isVocabVaultOpen, setIsVocabVaultOpen] = useState(false);

  const theme = THEME_REGISTRY[profile.themeId] || THEME_REGISTRY['cozy-studio'];
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

    onUpdateProfile({
      ...profile,
      missionProgress: {
        ...(profile.missionProgress || {}),
        [result.missionId]: updatedMissionStars,
      },
      stats: {
        ...profile.stats,
        xp: newXp,
        level: newLevel,
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
      stats: {
        ...profile.stats,
        xp: newXp,
        level: newLevel,
        diamonds: profile.stats.diamonds + diamondBonus,
        wordsMastered: profile.stats.wordsMastered + 1,
      },
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

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} pb-14 transition-colors duration-300`}>
      {/* Top Sticky Navigation / HUD */}
      <header className={`sticky top-0 z-30 ${theme.hudBgClass} px-4 md:px-8 py-3.5`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Learner Identity */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl ${theme.primaryBtnClass}`}
            >
              {theme.avatarEmoji}
            </div>
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

          {/* Right Controls: Vocab Vault, Grade Switcher, Theme Switcher, Profile Edit */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsVocabVaultOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.primaryBtnClass}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span dir="rtl">מאגר מילים + הגייה 🎙️</span>
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

          {/* Stat 3: Diamonds / Gems */}
          <div className={`rounded-2xl p-4 md:p-5 ${theme.cardBgClass} flex items-center gap-3.5`}>
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-500 shrink-0">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold">
                {profile.stats.diamonds}
              </div>
              <div className={`text-xs font-semibold ${theme.mutedTextClass}`} dir="rtl">
                {theme.currencyNameHe} ({theme.currencyNameEn})
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
                {heb.youLearnedWords(profile.stats.wordsMastered)} (לחצי לתרגול)
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
    </div>
  );
};
