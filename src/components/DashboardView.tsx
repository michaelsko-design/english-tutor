import React, { Suspense, useEffect, useState } from 'react';
import { EmojiIcon } from './art/EmojiIcon';
import {
  AuthUserSummary,
  CloudSyncStatus,
  GradeId,
  LearnerProfile,
  PlacementResult,
  ProficiencyTier,
  SUPPORTED_GRADES,
} from '../types/learner';
import { TIER_CONFIG } from '../themes/themeRegistry';
import { DEFAULT_VOICE_PREFERENCE } from '../utils/ttsVoice';
import { DEFAULT_SPEECH_RATE, getTtsService } from '../services/tts';
import { playsHebrewAloud, type SpokenPart } from '../data/hebrewAudio';
import { toSpeakableText } from '../services/tts/ttsText';
import type { GradeCurriculumPack, MissionNode } from '../data/curriculum';
import { getLoadedGrade, gradesInMissionIds } from '../data/curriculum/loader';
import { useGradeCurricula } from '../hooks/useGradeCurricula';
import { countCompletedMissions, getSuggestedMission } from '../data/milestones';
import { DailyQuestDefinition, RewardShopItem, getDailyQuests } from '../data/rewardShop';
import { getHomeGreetingHe, getMapPeek, getQuestRings } from '../data/homeBase';
import { MissionMap } from './MissionMap';

import { DailyQuestsCard } from './DailyQuestsCard';

import { AuthModal } from './AuthModal';

import { applyPlacementToProfile } from '../data/placementTest';
import { applyVocabPracticeReward, getTodayCounters, levelForXp, recordDailyActivity } from '../data/progressRewards';
import { STREAK_SHIELD_ITEM_ID, addStreakShield, getCurrentStreak, getStreakShieldsLeft } from '../data/streak';
import { toLocalDateStr } from '../utils/dates';

/** Learners who may not read yet: each question is read aloud when it opens */
const EARLY_READER_GRADES: GradeId[] = ['grade-1', 'grade-2', 'grade-3'];
import { countMasteredWords } from '../data/progressReport';
import { ExamPrepHub } from './examPrep/ExamPrepHub';
import { ExamModalShell } from './examPrep/ExamModalShell';
import { WordListsHub } from './wordLists/WordListsHub';
import { RoomHub } from './room/RoomHub';
import { FriendsHub } from './friends/FriendsHub';
import { ProgressReportHub } from './progressReport/ProgressReportHub';
import { StickerBackground } from './room/StickerBackground';
import { getBackgroundSticker } from '../data/stickers';
import { useStickerImages } from '../hooks/useStickerImages';
import { RoomRewardItem, getNextRoomReward, getRoomRewardForMission } from '../data/roomRewards';
import { preloadCompanion } from './companion/Companion';
import { HomeHud } from './home/HomeHud';
import { HomeHero } from './home/HomeHero';
import { QuestRings } from './home/QuestRings';
import { MapPeek } from './home/MapPeek';
import { NewPackCard } from './home/NewPackCard';
import { ParentNoticeCard } from './home/ParentNoticeCard';
import { ParentNudgeCard } from './home/ParentNudgeCard';
import { readSeenPacks, rememberSeenPack } from './home/seenPacks';
import { getNewPackOffer } from '../data/contentPacks';
import { StatsSheet } from './home/StatsSheet';
import { BookOpen, Home, Map as MapIcon, Settings, ShoppingBag } from 'lucide-react';
import { lazyNamed } from '../utils/lazyNamed';
import { useProAccess } from '../hooks/useProAccess';
import { getPackAccess, getPlayableUnits, hasFinishedFreeMissions, hasFullAccess, resolveLearnerTheme } from '../data/proGate';
import { ProUpsellContext, type ProUpsellFocus } from './pro/proUpsellContext';
import { ProUpsellSheet } from './pro/ProUpsellSheet';
import { FreeMissionsDoneCard } from './pro/FreeMissionsDoneCard';
import { ScreenLoading } from './ScreenLoading';

const MissionRunner = lazyNamed(() => import('./MissionRunner'), 'MissionRunner');
const VocabularyVaultModal = lazyNamed(() => import('./VocabularyVaultModal'), 'VocabularyVaultModal');
const RewardShopModal = lazyNamed(() => import('./RewardShopModal'), 'RewardShopModal');
const PlacementTest = lazyNamed(() => import('./PlacementTest'), 'PlacementTest');
const ProfileTour = lazyNamed(() => import('./tutorial/ProfileTour'), 'ProfileTour');

interface DashboardViewProps {
  profile: LearnerProfile;
  authUser: AuthUserSummary | null;
  syncStatus: CloudSyncStatus;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onEditOnboarding: () => void;
  /** Signs out after the waiting cloud save (App) */
  onSignOut: () => Promise<void>;
  /** A friend code from an invite link, waiting for the Friends Hub */
  pendingInviteCode: string | null;
  onInviteHandled: () => void;
}

type HomeSheet = 'stats' | 'quests';

const ROOM_TOAST_MS = 6000;
/** The size the mission runner first shows the companion at (the peek over the question card) */
const COMPANION_PRELOAD_SIZE = 64;

/**
 * Loads the learner's grade (and the grades they have progress in, for the mastered-words count)
 * before the home screen opens; once the learner's own grade is there the screen stays up while
 * other grades load.
 */
export const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const { profile } = props;
  const gradeId = SUPPORTED_GRADES.some((g) => g.id === profile.gradeId) ? profile.gradeId : 'grade-7';
  const gradeIds = [gradeId, ...gradesInMissionIds(Object.keys(profile.missionProgress || {}))];
  const { status, retry } = useGradeCurricula(gradeIds);
  const gradeCurriculum = getLoadedGrade(gradeId);

  if (gradeCurriculum) return <LoadedDashboardView {...props} gradeCurriculum={gradeCurriculum} />;
  if (status === 'error') {
    return (
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-bold">לא הצלחנו לטעון את השיעורים. בדקו את החיבור ונסו שוב.</p>
        <button type="button" className="px-4 py-2 rounded-xl font-bold bg-purple-600 text-white" onClick={retry}>
          נסו שוב
        </button>
      </div>
    );
  }
  return <ScreenLoading />;
};

interface LoadedDashboardViewProps extends DashboardViewProps {
  gradeCurriculum: GradeCurriculumPack;
}

const LoadedDashboardView: React.FC<LoadedDashboardViewProps> = ({
  gradeCurriculum,
  profile,
  authUser,
  syncStatus,
  onUpdateProfile,
  onEditOnboarding,
  onSignOut,
  pendingInviteCode,
  onInviteHandled,
}) => {
  const [activePracticeMission, setActivePracticeMission] =
    useState<MissionNode | null>(null);
  const [isVocabVaultOpen, setIsVocabVaultOpen] = useState(false);
  const [isRewardShopOpen, setIsRewardShopOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [roomRewardToast, setRoomRewardToast] = useState<RoomRewardItem | null>(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState<HomeSheet | null>(null);
  const [seenPackIds, setSeenPackIds] = useState<string[]>(() => readSeenPacks());
  const [mapFocus, setMapFocus] = useState<{ missionId: string; requestId: number } | null>(null);

  useEffect(() => {
    if (!roomRewardToast) return;
    const timer = window.setTimeout(() => setRoomRewardToast(null), ROOM_TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [roomRewardToast]);

  const proAccess = useProAccess();
  const [upsellFocus, setUpsellFocus] = useState<ProUpsellFocus | null>(null);
  const theme = resolveLearnerTheme(profile.themeId, profile.companionId, proAccess);

  // The companion's idle pose is the first one a mission shows (Feature 25).
  useEffect(() => {
    preloadCompanion(theme, ['idle'], COMPANION_PRELOAD_SIZE);
  }, [theme]);
  const activeAvatarEmoji = profile.equippedAvatarEmoji || theme.companion.avatarEmoji;
  useStickerImages();
  const backgroundSticker = getBackgroundSticker(profile);
  const currentGradeMeta =
    SUPPORTED_GRADES.find((g) => g.id === profile.gradeId) || SUPPORTED_GRADES[6];

  const totalGradeStarsPossible =
    gradeCurriculum.units.reduce((acc, u) => acc + u.missions.length * 3, 0) || 36;
  // The Play button never points at a Pro mission
  const { mission: todaysMission, bossGate: todaysBossGate } = getSuggestedMission(
    getPlayableUnits(gradeCurriculum.units, proAccess),
    profile.missionProgress || {}
  );
  const isFreeMissionsDone = hasFinishedFreeMissions(gradeCurriculum.units, profile.missionProgress || {}, proAccess);
  const missionsCompletedCount = countCompletedMissions(profile.missionProgress || {});
  const masteredWordCount = countMasteredWords(profile.missionProgress || {});
  const activeTier = TIER_CONFIG[profile.preferredTier];

  const calculatedXp = Math.round(todaysMission.baseXp * activeTier.xpMultiplier);
  const calculatedDiamonds = todaysMission.baseDiamonds + activeTier.diamondBonus;

  const todayStr = toLocalDateStr(new Date());
  // Counters from an earlier day (a tab left open past midnight) count as zero
  const { counters: dailyCounters, claimedQuestIds } = getTodayCounters(profile, todayStr);
  const currentStreak = getCurrentStreak(profile, todayStr);
  const questRings = getQuestRings(getDailyQuests(profile.gender), dailyCounters, claimedQuestIds);
  const mapPeek = getMapPeek(gradeCurriculum.units, profile.missionProgress || {});
  const newPackOffer = getNewPackOffer(gradeCurriculum.units, todayStr, seenPackIds);
  const isNewPackProLocked = newPackOffer !== null && getPackAccess(newPackOffer.pack.id) === 'pro' && !hasFullAccess(proAccess);
  const greetingHe = getHomeGreetingHe({
    gender: profile.gender,
    name: profile.name,
    bossGate: todaysBossGate,
    missionsToday: dailyCounters.missionsCompletedToday,
    isFirstMission: missionsCompletedCount === 0,
  });

  // Read-aloud: a rendered clip, the online voice or the device voice (services/tts)
  const speakEnglish = (text: string, rate = DEFAULT_SPEECH_RATE) => {
    void getTtsService().speak(text, { rate, voice: DEFAULT_VOICE_PREFERENCE });
  };

  // Grades 1–2: Hebrew and English one after another, e.g. the instruction then the question (Feature 47)
  const speakParts = (parts: SpokenPart[]) => {
    const voice = DEFAULT_VOICE_PREFERENCE;
    void getTtsService().speakSequence(
      parts.map((part) => ({ text: toSpeakableText(part.text), options: { lang: part.lang, rate: part.rate, voice } })),
    );
  };

  // A mission started from the map's sheet already has its tier, so its intro is skipped
  const [isMissionFromMap, setIsMissionFromMap] = useState(false);
  const handleLaunchMission = (mission: MissionNode, isFromMap = false) => {
    setIsMissionFromMap(isFromMap);
    setActivePracticeMission(mission);
  };

  const handleCompleteMission = (result: {
    missionId: string;
    starsEarned: 1 | 2 | 3;
    xpEarned: number;
    diamondsEarned: number;
    wordsLearnedCount: number;
    isFullReward: boolean;
    isVoiceSkipped: boolean;
  }) => {
    const prevStarsForMission = profile.missionProgress?.[result.missionId] || 0;
    const updatedMissionStars = Math.max(prevStarsForMission, result.starsEarned);
    const starDelta = Math.max(0, updatedMissionStars - prevStarsForMission);
    const missionTodayStr = toLocalDateStr(new Date());

    const withActivity = recordDailyActivity(
      profile,
      {
        missions: 1,
        // A skipped voice step earns no voice-word credit
        voiceWords: result.isVoiceSkipped ? 0 : 1,
        threeStarMissions: result.isFullReward && result.starsEarned === 3 ? 1 : 0,
      },
      missionTodayStr
    );
    const newXp = withActivity.stats.xp + result.xpEarned;
    const roomReward = getRoomRewardForMission(profile, result.missionId, result.starsEarned);

    onUpdateProfile({
      ...withActivity,
      unlockedRewardIds: roomReward
        ? [...(profile.unlockedRewardIds || []), roomReward.id]
        : profile.unlockedRewardIds,
      missionProgress: {
        ...(profile.missionProgress || {}),
        [result.missionId]: updatedMissionStars,
      },
      ...(result.isFullReward
        ? { missionRewardDates: { ...(profile.missionRewardDates || {}), [result.missionId]: missionTodayStr } }
        : {}),
      stats: {
        ...withActivity.stats,
        xp: newXp,
        level: levelForXp(newXp, withActivity.stats.level),
        stars: profile.stats.stars + starDelta,
        maxPossibleStars: totalGradeStarsPossible,
        diamonds: withActivity.stats.diamonds + result.diamondsEarned,
        wordsMastered: profile.stats.wordsMastered + result.wordsLearnedCount,
        missionsCompleted: profile.stats.missionsCompleted + 1,
      },
    });

    setActivePracticeMission(null);
    if (roomReward) setRoomRewardToast(roomReward);
  };

  /** Rewards a word said in the Vault, once per word per day; false when it earned nothing. */
  const handleEarnVocabReward = (wordEn: string, xpBonus: number, diamondBonus: number): boolean => {
    const result = applyVocabPracticeReward(profile, wordEn, xpBonus, diamondBonus, toLocalDateStr(new Date()));
    if (result.isRewarded) onUpdateProfile(result.profile);
    return result.isRewarded;
  };

  const handleClaimDailyQuest = (quest: DailyQuestDefinition) => {
    const today = getTodayCounters(profile, toLocalDateStr(new Date()));
    if (today.claimedQuestIds.includes(quest.id)) return;
    if (quest.getCurrentCount(today.counters) < quest.targetCount) return;
    const newXp = profile.stats.xp + quest.rewardXp;

    onUpdateProfile({
      ...profile,
      dailyCounters: today.counters,
      claimedDailyQuestIds: [...today.claimedQuestIds, quest.id],
      stats: {
        ...profile.stats,
        xp: newXp,
        level: levelForXp(newXp, profile.stats.level),
        diamonds: profile.stats.diamonds + quest.rewardDiamonds,
      },
    });
  };

  const handleBuyReward = (item: RewardShopItem) => {
    if (profile.stats.diamonds < item.costDiamonds) return;
    // A streak shield is used up on a missed day, so it can be bought again
    if (item.id === STREAK_SHIELD_ITEM_ID) {
      onUpdateProfile({
        ...profile,
        stats: { ...addStreakShield(profile), diamonds: profile.stats.diamonds - item.costDiamonds },
      });
      return;
    }
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

  const handleChangeGrade = (gradeId: GradeId) => {
    onUpdateProfile({
      ...profile,
      gradeId,
      updatedAt: new Date().toISOString(),
    });
  };

  const dismissPackOffer = (packId: string) => {
    rememberSeenPack(packId);
    setSeenPackIds(readSeenPacks());
  };

  const scrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ProUpsellContext.Provider value={setUpsellFocus}>
    <div className={`relative isolate min-h-screen w-full ${theme.pageBgClass} pb-24 md:pb-14 transition-colors duration-300`}>
      {/* FEATURE 12: STICKER STUDIO BACKGROUND */}
      {backgroundSticker && <StickerBackground sticker={backgroundSticker} />}

      {/* FEATURE 27: COMPACT HUD (avatar in the level ring, streak, gems) */}
      <HomeHud
        profile={profile}
        theme={theme}
        avatarEmoji={activeAvatarEmoji}
        authUser={authUser}
        syncStatus={syncStatus}
        onOpenStats={() => setOpenSheet('stats')}
        onOpenQuests={() => setOpenSheet('quests')}
        onOpenShop={() => setIsRewardShopOpen(true)}
        onOpenVault={() => setIsVocabVaultOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onEditProfile={onEditOnboarding}
      />

      <main id="dashboard-top" className="max-w-6xl mx-auto px-3.5 md:px-8 pt-3 md:pt-5 space-y-3 md:space-y-4">
        {/* FEATURE 27: HOME SCENE WITH THE COMPANION AND ONE PLAY BUTTON */}
        <HomeHero
          theme={theme}
          gender={profile.gender}
          greetingHe={greetingHe}
          mission={todaysMission}
          bossGate={todaysBossGate}
          xpReward={calculatedXp}
          diamondReward={calculatedDiamonds}
          onPlay={() => handleLaunchMission(todaysMission)}
        />

        {/* EVERY FREE MISSION OF THE GRADE IS DONE: ASK A PARENT FOR PRO */}
        {isFreeMissionsDone && (
          <FreeMissionsDoneCard theme={theme} onAsk={() => setUpsellFocus('missions')} />
        )}

        {/* FEATURE 5: DAILY QUESTS AS RINGS (the full card opens in a sheet) */}
        <QuestRings rings={questRings} theme={theme} onOpen={() => setOpenSheet('quests')} />

        {/* FEATURE 27: THE DOCK (exam prep, word lists, room, friends, report) */}
        <nav aria-label="פעילויות נוספות" className="flex gap-2 sm:gap-3">
          <RoomHub
            profile={profile}
            theme={theme}
            avatarEmoji={activeAvatarEmoji}
            isOpen={isRoomOpen}
            onOpen={() => setIsRoomOpen(true)}
            onClose={() => setIsRoomOpen(false)}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={speakEnglish}
            onOpenShop={() => setIsRewardShopOpen(true)}
          />
          <ExamPrepHub profile={profile} theme={theme} onUpdateProfile={onUpdateProfile} onSpeakEnglish={speakEnglish} />
          <WordListsHub profile={profile} theme={theme} onUpdateProfile={onUpdateProfile} onSpeakEnglish={speakEnglish} />
          <FriendsHub
            profile={profile}
            authUser={authUser}
            theme={theme}
            avatarEmoji={activeAvatarEmoji}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={speakEnglish}
            pendingInviteCode={pendingInviteCode}
            onInviteHandled={onInviteHandled}
          />
          <ProgressReportHub profile={profile} theme={theme} onSpeakEnglish={speakEnglish} />
        </nav>

        {/* A NEWLY RELEASED CONTENT PACK, ONCE PER DEVICE */}
        {newPackOffer && (
          <NewPackCard
            offer={newPackOffer}
            gender={profile.gender}
            theme={theme}
            readsHebrewAloud={playsHebrewAloud(profile.gradeId)}
            isProLocked={isNewPackProLocked}
            onOpen={() => {
              if (isNewPackProLocked) {
                setUpsellFocus('missions');
                return;
              }
              dismissPackOffer(newPackOffer.pack.id);
              setMapFocus({ missionId: newPackOffer.firstMissionId, requestId: Date.now() });
              scrollToSection('mission-map');
            }}
            onClose={() => dismissPackOffer(newPackOffer.pack.id)}
          />
        )}

        {/* A PARENT JOINED, OR RESET THE PIN: THE LEARNER IS TOLD */}
        <ParentNoticeCard profile={profile} theme={theme} />

        {/* AN OPTIONAL, CLOSABLE INVITE FOR A PARENT */}
        <ParentNudgeCard profile={profile} theme={theme} />

        {/* FEATURE 27: MAP PEEK, THEN THE FULL MAP */}
        {mapPeek && (
          <MapPeek
            peek={mapPeek}
            gradeLabelHe={currentGradeMeta.labelHe}
            theme={theme}
            onOpenMap={() => scrollToSection('mission-map')}
          />
        )}

        {/* FEATURE 2 & 4: INTERACTIVE STORY WORLD & MISSION MAP */}
        <div id="mission-map" className="scroll-mt-16">
          <MissionMap
            units={gradeCurriculum.units}
            missionProgress={profile.missionProgress || {}}
            selectedTier={profile.preferredTier}
            onSelectTier={handleSelectTier}
            theme={theme}
            gender={profile.gender}
            onStartMission={(mission) => handleLaunchMission(mission, true)}
            onSpeakEnglish={speakEnglish}
            focusRequest={mapFocus}
          />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-Friendly, Hidden on Desktop) */}
      <nav
        aria-label="ניווט ראשי"
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 ${theme.hudBgClass} border-t border-current/10 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-md`}
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => scrollToSection('dashboard-top')}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-xs font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>ראשי</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('mission-map')}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-xs font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <MapIcon className="w-4 h-4 mb-0.5" />
            <span>מפה</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVocabVaultOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-xs font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>מילים 🎙️</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRewardShopOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-xs font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span>חנות</span>
          </button>

          <button
            type="button"
            onClick={onEditOnboarding}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-xs font-extrabold opacity-90 hover:opacity-100 active:scale-95 transition-all"
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span>פרופיל</span>
          </button>
        </div>
      </nav>

      {/* FEATURE 27: STATS SHEET (opened from the avatar in the HUD) */}
      {openSheet === 'stats' && (
        <StatsSheet
          profile={profile}
          theme={theme}
          avatarEmoji={activeAvatarEmoji}
          missionsCompleted={missionsCompletedCount}
          masteredWords={masteredWordCount}
          onChangeGrade={handleChangeGrade}
          onOpenShop={() => setIsRewardShopOpen(true)}
          onOpenVault={() => setIsVocabVaultOpen(true)}
          onOpenPlacement={() => {
            setOpenSheet(null);
            setIsPlacementOpen(true);
          }}
          onOpenTour={() => {
            setOpenSheet(null);
            setIsTourOpen(true);
          }}
          onEditProfile={onEditOnboarding}
          onClose={() => setOpenSheet(null)}
        />
      )}

      {/* FEATURE 5: DAILY QUESTS & SHABBAT-SAFE WEEKLY STREAK (opened from the rings or the flame) */}
      {openSheet === 'quests' && (
        <ExamModalShell
          theme={theme}
          labelHe="אתגרים יומיים ורצף שבועי"
          onClose={() => setOpenSheet(null)}
          maxWidthClass="max-w-3xl"
          header={<h2 className="font-extrabold text-base sm:text-lg">🎯 אתגרים יומיים</h2>}
        >
          <div className="p-3 sm:p-4">
            <DailyQuestsCard
              streakDays={currentStreak}
              activeDates={(profile.activityLog || []).filter((e) => e.sessions > 0).map((e) => e.dateStr)}
              dailyCounters={dailyCounters}
              claimedQuestIds={claimedQuestIds}
              gender={profile.gender}
              theme={theme}
              isShabbatObserver={profile.isShabbatObserver !== false}
              onClaimQuest={handleClaimDailyQuest}
              onOpenShop={() => setIsRewardShopOpen(true)}
            />
          </div>
        </ExamModalShell>
      )}

      {/* FEATURE 3: FULL INTERACTIVE 5-STEP MISSION RUNNER MODAL */}
      {activePracticeMission && (
        <Suspense fallback={<ScreenLoading />}>
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
            roomRewardPreview={
              (profile.missionProgress?.[activePracticeMission.id] || 0) < 3 ? getNextRoomReward(profile) : null
            }
            startXp={profile.stats.xp}
            startLevel={profile.stats.level}
            previousStars={profile.missionProgress?.[activePracticeMission.id] || 0}
          isTierChosen={isMissionFromMap}
          readsQuestionsAloud={EARLY_READER_GRADES.includes(profile.gradeId)}
          readsHebrewAloud={playsHebrewAloud(profile.gradeId)}
          onSpeakParts={speakParts}
            lastRewardDateStr={profile.missionRewardDates?.[activePracticeMission.id]}
          />
        </Suspense>
      )}

      {/* FEATURE 45: THE APP TOUR, AGAIN (the ❓ button in the HUD or the stats sheet) */}
      {isTourOpen && (
        <Suspense fallback={<ScreenLoading />}>
          <ProfileTour
            profile={profile}
            theme={theme}
            authUser={authUser}
            finishLabelHe={profile.gender === 'girl' ? 'סיימתי, בואי נשחק! 🚀' : 'סיימתי, בוא נשחק! 🚀'}
            onDone={() => setIsTourOpen(false)}
          />
        </Suspense>
      )}

      {/* FEATURE 11: DIAGNOSTIC LEVEL PLACEMENT TEST */}
      {isPlacementOpen && (
        <Suspense fallback={<ScreenLoading />}>
          <PlacementTest
            profile={profile}
            theme={theme}
            mode="on-demand"
            onFinish={handleFinishPlacement}
            onClose={() => setIsPlacementOpen(false)}
          />
        </Suspense>
      )}

      {/* FEATURE 4: INTERACTIVE VOCABULARY & SPEAKING STUDIO */}
      {isVocabVaultOpen && (
        <Suspense fallback={<ScreenLoading />}>
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
        </Suspense>
      )}

      {/* FEATURE 5: INTERACTIVE DIAMOND REWARD SHOP & STICKER ALBUM */}
      {isRewardShopOpen && (
        <Suspense fallback={<ScreenLoading />}>
          <RewardShopModal
            diamonds={profile.stats.diamonds}
            unlockedRewardIds={profile.unlockedRewardIds || ['avatar-boba-cat']}
            equippedAvatarEmoji={activeAvatarEmoji}
            streakShieldsLeft={getStreakShieldsLeft(profile)}
            gender={profile.gender}
            learnerName={profile.name}
            theme={theme}
            onBuyReward={handleBuyReward}
            onEquipAvatar={handleEquipAvatar}
            onClose={() => setIsRewardShopOpen(false)}
          />
        </Suspense>
      )}

      {/* FEATURE 12: NEW ROOM ITEM TOAST */}
      {roomRewardToast && (
        <div className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-6 z-40 flex justify-center px-4 pointer-events-none">
          <button
            type="button"
            onClick={() => {
              setRoomRewardToast(null);
              setIsRoomOpen(true);
            }}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl border-2 border-fuchsia-400 flex items-center gap-3 font-extrabold text-sm ${theme.cardBgClass} ${theme.pageBgClass}`}
            role="status"
          >
            <EmojiIcon emoji={roomRewardToast.emoji} size="2rem" />
            <span>
              {roomRewardToast.kind === 'wear' ? '🎁 בגד חדש לארון' : '🎁 פריט חדש לחדר'}: {roomRewardToast.nameHe} — לחדר שלי ←
            </span>
          </button>
        </div>
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
          onSignOut={onSignOut}
        />
      )}

      {upsellFocus && authUser && (
        <ProUpsellSheet
          learner={{
            uid: authUser.uid,
            name: profile.name,
            gender: profile.gender,
            avatarEmoji: activeAvatarEmoji,
            isGuest: authUser.isAnonymous,
          }}
          focus={upsellFocus}
          theme={theme}
          readsHebrewAloud={playsHebrewAloud(profile.gradeId)}
          onClose={() => setUpsellFocus(null)}
        />
      )}
    </div>
    </ProUpsellContext.Provider>
  );
};
