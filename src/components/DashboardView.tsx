import React, { useEffect, useState } from 'react';
import {
  AuthUserSummary,
  CloudSyncStatus,
  DailyActivityCounters,
  GradeId,
  LearnerProfile,
  PlacementResult,
  ProficiencyTier,
  SUPPORTED_GRADES,
} from '../types/learner';
import { THEME_REGISTRY, TIER_CONFIG } from '../themes/themeRegistry';
import { DEFAULT_VOICE_PREFERENCE, speakWithVoice } from '../utils/ttsVoice';
import { CURRICULUM_BY_GRADE, MissionNode } from '../data/curriculum';
import { countCompletedMissions, getSuggestedMission } from '../data/milestones';
import { DailyQuestDefinition, RewardShopItem, getDailyQuests } from '../data/rewardShop';
import { getHomeGreetingHe, getMapPeek, getQuestRings } from '../data/homeBase';
import { MissionMap } from './MissionMap';
import { MissionRunner } from './MissionRunner';
import { VocabularyVaultModal } from './VocabularyVaultModal';
import { DailyQuestsCard } from './DailyQuestsCard';
import { RewardShopModal } from './RewardShopModal';
import { AuthModal } from './AuthModal';
import { PlacementTest } from './PlacementTest';
import { applyPlacementToProfile } from '../data/placementTest';
import { applyVocabPracticeReward, levelForXp, recordDailyActivity } from '../data/progressRewards';
import { countMasteredWords } from '../data/progressReport';
import { ExamPrepHub } from './examPrep/ExamPrepHub';
import { ExamModalShell } from './examPrep/ExamModalShell';
import { WordListsHub } from './wordLists/WordListsHub';
import { RoomHub } from './room/RoomHub';
import { FriendsHub } from './friends/FriendsHub';
import { ProgressReportHub } from './progressReport/ProgressReportHub';
import { StickerBackground } from './room/StickerBackground';
import { getBackgroundSticker } from '../data/stickers';
import { RoomRewardItem, getNextRoomReward, getRoomRewardForMission } from '../data/roomRewards';
import { preloadCompanion } from './companion/Companion';
import { HomeHud } from './home/HomeHud';
import { HomeHero } from './home/HomeHero';
import { QuestRings } from './home/QuestRings';
import { MapPeek } from './home/MapPeek';
import { StatsSheet } from './home/StatsSheet';
import { BookOpen, Home, Map as MapIcon, Settings, ShoppingBag } from 'lucide-react';

interface DashboardViewProps {
  profile: LearnerProfile;
  authUser: AuthUserSummary | null;
  syncStatus: CloudSyncStatus;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onEditOnboarding: () => void;
  /** A friend code from an invite link, waiting for the Friends Hub */
  pendingInviteCode: string | null;
  onInviteHandled: () => void;
}

type HomeSheet = 'stats' | 'quests';

const ROOM_TOAST_MS = 6000;
/** The size the mission runner first shows the companion at (the peek over the question card) */
const COMPANION_PRELOAD_SIZE = 64;

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  authUser,
  syncStatus,
  onUpdateProfile,
  onEditOnboarding,
  pendingInviteCode,
  onInviteHandled,
}) => {
  const [activePracticeMission, setActivePracticeMission] =
    useState<MissionNode | null>(null);
  const [isVocabVaultOpen, setIsVocabVaultOpen] = useState(false);
  const [isRewardShopOpen, setIsRewardShopOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [roomRewardToast, setRoomRewardToast] = useState<RoomRewardItem | null>(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState<HomeSheet | null>(null);

  useEffect(() => {
    if (!roomRewardToast) return;
    const timer = window.setTimeout(() => setRoomRewardToast(null), ROOM_TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [roomRewardToast]);

  const theme = THEME_REGISTRY[profile.themeId] || THEME_REGISTRY['cozy-studio'];

  // The companion's idle pose is the first one a mission shows (Feature 25).
  useEffect(() => {
    preloadCompanion(theme, ['idle'], COMPANION_PRELOAD_SIZE);
  }, [theme]);
  const activeAvatarEmoji = profile.equippedAvatarEmoji || theme.avatarEmoji;
  const backgroundSticker = getBackgroundSticker(profile);
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
  const masteredWordCount = countMasteredWords(profile.missionProgress || {});
  const activeTier = TIER_CONFIG[profile.preferredTier];

  const calculatedXp = Math.round(todaysMission.baseXp * activeTier.xpMultiplier);
  const calculatedDiamonds = todaysMission.baseDiamonds + activeTier.diamondBonus;

  const todayStr = new Date().toISOString().slice(0, 10);
  const dailyCounters: DailyActivityCounters = profile.dailyCounters || {
    dateStr: todayStr,
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  };
  const questRings = getQuestRings(getDailyQuests(profile.gender), dailyCounters, profile.claimedDailyQuestIds || []);
  const mapPeek = getMapPeek(gradeCurriculum.units, profile.missionProgress || {});
  const greetingHe = getHomeGreetingHe({
    gender: profile.gender,
    name: profile.name,
    bossGate: todaysBossGate,
    missionsToday: dailyCounters.dateStr === todayStr ? dailyCounters.missionsCompletedToday : 0,
    isFirstMission: missionsCompletedCount === 0,
  });

  // Built-in Web Speech API Text-to-Speech (TTS)
  const speakEnglish = (text: string, rate = 0.95) => {
    speakWithVoice(text, rate, profile.voicePreference ?? DEFAULT_VOICE_PREFERENCE);
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
    if (roomReward) setRoomRewardToast(roomReward);
  };

  const handleEarnVocabReward = (xpBonus: number, diamondBonus: number) => {
    onUpdateProfile(
      applyVocabPracticeReward(
        profile,
        xpBonus,
        diamondBonus,
        new Date().toISOString().slice(0, 10)
      )
    );
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

  const handleChangeGrade = (gradeId: GradeId) => {
    onUpdateProfile({
      ...profile,
      gradeId,
      updatedAt: new Date().toISOString(),
    });
  };

  const scrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
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
            onStartMission={handleLaunchMission}
            onSpeakEnglish={speakEnglish}
          />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-Friendly, Hidden on Desktop) */}
      <nav
        aria-label="ניווט ראשי"
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 ${theme.hudBgClass} border-t border-current/10 px-2 py-1.5 backdrop-blur-md`}
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
              streakDays={profile.stats.streakDays}
              dailyCounters={dailyCounters}
              claimedQuestIds={profile.claimedDailyQuestIds || []}
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

      {/* FEATURE 12: NEW ROOM ITEM TOAST */}
      {roomRewardToast && (
        <div className="fixed inset-x-0 bottom-20 md:bottom-6 z-40 flex justify-center px-4 pointer-events-none">
          <button
            type="button"
            onClick={() => {
              setRoomRewardToast(null);
              setIsRoomOpen(true);
            }}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl border-2 border-fuchsia-400 flex items-center gap-3 font-extrabold text-sm ${theme.cardBgClass} ${theme.pageBgClass}`}
            role="status"
          >
            <span className="text-2xl leading-none">{roomRewardToast.emoji}</span>
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
        />
      )}
    </div>
  );
};
