import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  CustomWordList,
  DrawnSticker,
  DreamEntry,
  DressUpDay,
  ExamPlanDay,
  ExamPrepPlan,
  LearnerProfile,
  LearnerRoom,
  PlacementResult,
} from '../types/learner';
import { keepNewestEntries } from '../data/dreamJournal';

const LEARNERS_COLLECTION = 'learners';

/**
 * Intelligently merges a local `localStorage` LearnerProfile with a Firestore cloud LearnerProfile
 * so that first-time login migration or multi-device offline play NEVER loses earned stars,
 * XP, diamonds, streak days, or unlocked rewards.
 */
export function mergeLearnerProfiles(
  local: LearnerProfile,
  cloud: Partial<LearnerProfile> | null | undefined
): LearnerProfile {
  if (!cloud) {
    return {
      ...local,
      updatedAt: local.updatedAt || new Date().toISOString(),
    };
  }

  // Merge missionProgress by taking the highest star count (0-3) per missionId
  const mergedMissionProgress: Record<string, number> = {
    ...(local.missionProgress || {}),
  };
  if (cloud.missionProgress) {
    for (const [missionId, cloudStars] of Object.entries(cloud.missionProgress)) {
      const localStars = mergedMissionProgress[missionId] || 0;
      mergedMissionProgress[missionId] = Math.max(localStars, Number(cloudStars) || 0);
    }
  }

  // Recompute total stars from merged mission progress (or take max)
  const sumMissionStars = Object.values(mergedMissionProgress).reduce(
    (acc, s) => acc + s,
    0
  );
  const maxStars = Math.max(
    sumMissionStars,
    local.stats?.stars || 0,
    cloud.stats?.stars || 0
  );

  // Union unlocked shop rewards
  const mergedUnlockedRewards = Array.from(
    new Set([
      ...(local.unlockedRewardIds || []),
      ...(cloud.unlockedRewardIds || []),
    ])
  );

  // Merge daily counters for today's date
  const todayStr = new Date().toISOString().slice(0, 10);
  const localDaily =
    local.dailyCounters?.dateStr === todayStr
      ? local.dailyCounters
      : {
          dateStr: todayStr,
          missionsCompletedToday: 0,
          voiceWordsPracticedToday: 0,
          threeStarMissionsToday: 0,
        };
  const cloudDaily =
    cloud.dailyCounters?.dateStr === todayStr
      ? cloud.dailyCounters
      : {
          dateStr: todayStr,
          missionsCompletedToday: 0,
          voiceWordsPracticedToday: 0,
          threeStarMissionsToday: 0,
        };

  const mergedDailyCounters = {
    dateStr: todayStr,
    missionsCompletedToday: Math.max(
      localDaily.missionsCompletedToday,
      cloudDaily.missionsCompletedToday
    ),
    voiceWordsPracticedToday: Math.max(
      localDaily.voiceWordsPracticedToday,
      cloudDaily.voiceWordsPracticedToday
    ),
    threeStarMissionsToday: Math.max(
      localDaily.threeStarMissionsToday,
      cloudDaily.threeStarMissionsToday
    ),
  };

  const mergedClaimedQuests = Array.from(
    new Set([
      ...(local.dailyCounters?.dateStr === todayStr
        ? local.claimedDailyQuestIds || []
        : []),
      ...(cloud.dailyCounters?.dateStr === todayStr
        ? cloud.claimedDailyQuestIds || []
        : []),
    ])
  );

  // Determine which profile has more recent preference updates
  // Always prefer an onboarded cloud profile over an unonboarded local default
  const localTime = local.updatedAt ? Date.parse(local.updatedAt) : 0;
  const cloudTime = cloud.updatedAt ? Date.parse(cloud.updatedAt) : 0;
  const preferCloudPrefs =
    (Boolean(cloud.isOnboarded) && !local.isOnboarded) || cloudTime >= localTime;

  const mergedXp = Math.max(local.stats?.xp || 0, cloud.stats?.xp || 0);
  const mergedLevel = Math.max(
    local.stats?.level || 1,
    cloud.stats?.level || 1,
    Math.floor(mergedXp / 150) + 1
  );

  const resolvedPlacement = latestPlacementResult(
    local.placementResult,
    cloud.placementResult
  );

  const resolvedExamPrep = mergeExamPrep(local.examPrep, cloud.examPrep);

  const resolvedWordLists = mergeCustomWordLists(local.customWordLists, cloud.customWordLists);

  const resolvedRoom = mergeRoom(local.room, cloud.room);

  const resolvedAvatar = preferCloudPrefs
    ? cloud.equippedAvatarEmoji || local.equippedAvatarEmoji
    : local.equippedAvatarEmoji || cloud.equippedAvatarEmoji;

  const merged: LearnerProfile = {
    isOnboarded: Boolean(local.isOnboarded || cloud.isOnboarded),
    name:
      (preferCloudPrefs ? cloud.name || local.name : local.name || cloud.name) ||
      '',
    age: (preferCloudPrefs ? cloud.age : local.age) || 12,
    gender: (preferCloudPrefs ? cloud.gender : local.gender) || 'girl',
    gradeId: (preferCloudPrefs ? cloud.gradeId : local.gradeId) || 'grade-7',
    preferredTier:
      (preferCloudPrefs ? cloud.preferredTier : local.preferredTier) ||
      'challenger',
    themeId:
      (preferCloudPrefs ? cloud.themeId : local.themeId) || 'cozy-studio',
    isShabbatObserver:
      preferCloudPrefs
        ? (cloud.isShabbatObserver ?? local.isShabbatObserver ?? true)
        : (local.isShabbatObserver ?? cloud.isShabbatObserver ?? true),
    ...(resolvedAvatar ? { equippedAvatarEmoji: resolvedAvatar } : {}),
    ...(resolvedPlacement ? { placementResult: resolvedPlacement } : {}),
    ...(resolvedExamPrep ? { examPrep: resolvedExamPrep } : {}),
    ...(resolvedWordLists ? { customWordLists: resolvedWordLists } : {}),
    ...(resolvedRoom ? { room: resolvedRoom } : {}),
    stats: {
      xp: mergedXp,
      level: mergedLevel,
      stars: maxStars,
      maxPossibleStars: Math.max(
        local.stats?.maxPossibleStars || 36,
        cloud.stats?.maxPossibleStars || 36
      ),
      diamonds: Math.max(
        local.stats?.diamonds || 0,
        cloud.stats?.diamonds || 0
      ),
      streakDays: Math.max(
        local.stats?.streakDays ?? 0,
        cloud.stats?.streakDays ?? 0
      ),
      shabbatShieldActive: preferCloudPrefs
        ? (cloud.isShabbatObserver ?? local.isShabbatObserver ?? true)
        : (local.isShabbatObserver ?? cloud.isShabbatObserver ?? true),
      wordsMastered: Math.max(
        local.stats?.wordsMastered || 0,
        cloud.stats?.wordsMastered || 0
      ),
      missionsCompleted: Math.max(
        local.stats?.missionsCompleted || 0,
        cloud.stats?.missionsCompleted || 0
      ),
    },
    missionProgress: mergedMissionProgress,
    unlockedRewardIds: mergedUnlockedRewards,
    claimedDailyQuestIds: mergedClaimedQuests,
    dailyCounters: mergedDailyCounters,
    hasSeenWelcomeGiftModal: Boolean(
      local.hasSeenWelcomeGiftModal || cloud.hasSeenWelcomeGiftModal
    ),
    createdAt: cloud.createdAt || local.createdAt || new Date().toISOString(),
    updatedAt: cloud.updatedAt || local.updatedAt || new Date().toISOString(),
  };

  return merged;
}

/** Keeps the most recently completed placement test result from either device. */
function latestPlacementResult(
  local: PlacementResult | undefined,
  cloud: PlacementResult | undefined
): PlacementResult | undefined {
  if (!local || !cloud) return local || cloud;
  return Date.parse(cloud.completedAt) >= Date.parse(local.completedAt) ? cloud : local;
}

/** The earlier of two optional ISO timestamps. */
function earliestIso(a: string | undefined, b: string | undefined): string | undefined {
  if (!a || !b) return a || b;
  return Date.parse(a) <= Date.parse(b) ? a : b;
}

function mergeExamDay(local: ExamPlanDay, cloud: ExamPlanDay | undefined): ExamPlanDay {
  if (!cloud) return local;
  const completedAt = earliestIso(local.completedAt, cloud.completedAt);
  const scorePercent = Math.max(local.scorePercent ?? 0, cloud.scorePercent ?? 0);
  return {
    ...local,
    ...(completedAt ? { completedAt } : {}),
    ...(local.scorePercent !== undefined || cloud.scorePercent !== undefined ? { scorePercent } : {}),
  };
}

/**
 * Different plans: the most recently created one wins. The same plan on two devices: keeps the
 * progress from both (earliest completion and best score per day, best mock score, and the
 * earliest certificate and archive times).
 */
function mergeExamPrep(
  local: ExamPrepPlan | undefined,
  cloud: ExamPrepPlan | undefined
): ExamPrepPlan | undefined {
  if (!local || !cloud) return local || cloud;
  if (local.id !== cloud.id) {
    return Date.parse(cloud.createdAt) >= Date.parse(local.createdAt) ? cloud : local;
  }

  const certificateEarnedAt = earliestIso(local.certificateEarnedAt, cloud.certificateEarnedAt);
  const archivedAt = earliestIso(local.archivedAt, cloud.archivedAt);
  const hasMockScore = local.bestMockScore !== undefined || cloud.bestMockScore !== undefined;
  const cloudDays = cloud.days || [];

  return {
    ...local,
    days: (local.days || []).map((d) =>
      mergeExamDay(d, cloudDays.find((c) => c.dayIndex === d.dayIndex))
    ),
    ...(hasMockScore
      ? { bestMockScore: Math.max(local.bestMockScore ?? 0, cloud.bestMockScore ?? 0) }
      : {}),
    ...(certificateEarnedAt ? { certificateEarnedAt } : {}),
    ...(archivedAt ? { archivedAt } : {}),
  };
}

/** The later of two optional ISO timestamps. */
function latestIso(a: string | undefined, b: string | undefined): string | undefined {
  if (!a || !b) return a || b;
  return Date.parse(a) >= Date.parse(b) ? a : b;
}

function mergeWordList(local: CustomWordList, cloud: CustomWordList): CustomWordList {
  const archivedAt = earliestIso(local.archivedAt, cloud.archivedAt);
  const lastPracticedAt = latestIso(local.lastPracticedAt, cloud.lastPracticedAt);
  const lastRewardedDateStr = [local.lastRewardedDateStr, cloud.lastRewardedDateStr]
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();
  const hasBestScore = local.bestScore !== undefined || cloud.bestScore !== undefined;
  return {
    ...local,
    items: archivedAt ? [] : local.items.length ? local.items : cloud.items || [],
    ...(hasBestScore ? { bestScore: Math.max(local.bestScore ?? 0, cloud.bestScore ?? 0) } : {}),
    ...(lastPracticedAt ? { lastPracticedAt } : {}),
    ...(lastRewardedDateStr ? { lastRewardedDateStr } : {}),
    ...(archivedAt ? { archivedAt } : {}),
  };
}

/**
 * Union of both devices' word lists by id. The same list keeps the best score and latest
 * practice, and stays deleted once either device archived it.
 */
function mergeCustomWordLists(
  local: CustomWordList[] | undefined,
  cloud: CustomWordList[] | undefined
): CustomWordList[] | undefined {
  if (!local || !cloud) return local || cloud;
  const cloudById = new Map(cloud.map((l) => [l.id, l]));
  const localIds = new Set(local.map((l) => l.id));
  return [
    ...local.map((l) => {
      const match = cloudById.get(l.id);
      return match ? mergeWordList(l, match) : l;
    }),
    ...cloud.filter((c) => !localIds.has(c.id)),
  ];
}

/**
 * Drawn stickers from both devices by id. A sticker deleted on either device stays deleted, with
 * its picture emptied.
 */
function mergeDrawnStickers(
  local: DrawnSticker[] | undefined,
  cloud: DrawnSticker[] | undefined
): DrawnSticker[] | undefined {
  if (!local || !cloud) return local || cloud;
  const cloudById = new Map(cloud.map((s) => [s.id, s]));
  const localIds = new Set(local.map((s) => s.id));
  return [
    ...local.map((sticker) => {
      const match = cloudById.get(sticker.id);
      const archivedAt = earliestIso(sticker.archivedAt, match?.archivedAt);
      return archivedAt ? { ...sticker, imageDataUrl: '', archivedAt } : sticker;
    }),
    ...cloud.filter((s) => !localIds.has(s.id)),
  ];
}

/** Per game, the best score from either device. */
function mergeBestScores(
  local: Record<string, number> | undefined,
  cloud: Record<string, number> | undefined
): Record<string, number> | undefined {
  if (!local || !cloud) return local || cloud;
  const keys = Array.from(new Set([...Object.keys(local), ...Object.keys(cloud)]));
  return Object.fromEntries(keys.map((key) => [key, Math.max(local[key] ?? 0, cloud[key] ?? 0)]));
}

/** Dreams from both devices by id, newest first, capped like the journal itself. */
function mergeDreamJournal(
  local: DreamEntry[] | undefined,
  cloud: DreamEntry[] | undefined
): DreamEntry[] | undefined {
  if (!local || !cloud) return local || cloud;
  const byId = new Map([...cloud, ...local].map((entry) => [entry.id, entry]));
  return keepNewestEntries(Array.from(byId.values()));
}

/** Per key, the later YYYY-MM-DD date, so a daily reward given on either device stays given. */
function mergeLatestDates(
  local: Record<string, string> | undefined,
  cloud: Record<string, string> | undefined
): Record<string, string> | undefined {
  if (!local || !cloud) return local || cloud;
  const keys = Array.from(new Set([...Object.keys(local), ...Object.keys(cloud)]));
  return Object.fromEntries(keys.map((key) => [key, [local[key] || '', cloud[key] || ''].sort().pop() as string]));
}

/**
 * The later day wins; the same day unions the items worn on both devices, keeps the most voice
 * namings, and a given reward stays given.
 */
function mergeDressUpDay(
  local: DressUpDay | undefined,
  cloud: DressUpDay | undefined
): DressUpDay | undefined {
  if (!local || !cloud) return local || cloud;
  if (local.dateStr !== cloud.dateStr) return local.dateStr > cloud.dateStr ? local : cloud;
  const hasIds = Boolean(local.wornItemIds || cloud.wornItemIds);
  const wornItemIds = Array.from(new Set([...(local.wornItemIds || []), ...(cloud.wornItemIds || [])]));
  // A day saved before wornItemIds existed only has its count
  const legacyCounts = [local, cloud].filter((day) => !day.wornItemIds).map((day) => day.namedCount);
  return {
    dateStr: local.dateStr,
    namedCount: Math.max(wornItemIds.length, ...legacyCounts),
    voiceCount: Math.max(local.voiceCount, cloud.voiceCount),
    isRewarded: local.isRewarded || cloud.isRewarded,
    ...(hasIds ? { wornItemIds } : {}),
  };
}

/**
 * The newer room layout and outfit win (each is a single arrangement, so slots are not mixed),
 * while the items the learner has already named and today's dress-up progress are kept from both.
 */
function mergeRoom(
  local: LearnerRoom | undefined,
  cloud: LearnerRoom | undefined
): LearnerRoom | undefined {
  if (!local || !cloud) return local || cloud;
  const localTime = Date.parse(local.updatedAt) || 0;
  const cloudTime = Date.parse(cloud.updatedAt) || 0;
  const newer = cloudTime > localTime ? cloud : local;
  const dressUpDay = mergeDressUpDay(local.dressUpDay, cloud.dressUpDay);
  const activityRewardDates = mergeLatestDates(local.activityRewardDates, cloud.activityRewardDates);
  const dreamJournal = mergeDreamJournal(local.dreamJournal, cloud.dreamJournal);
  const gameBestScores = mergeBestScores(local.gameBestScores, cloud.gameBestScores);
  const drawnStickers = mergeDrawnStickers(local.drawnStickers, cloud.drawnStickers);
  return {
    ...newer,
    namedItemIds: Array.from(new Set([...(local.namedItemIds || []), ...(cloud.namedItemIds || [])])),
    ...(dressUpDay ? { dressUpDay } : {}),
    ...(activityRewardDates ? { activityRewardDates } : {}),
    ...(dreamJournal ? { dreamJournal } : {}),
    ...(gameBestScores ? { gameBestScores } : {}),
    ...(drawnStickers ? { drawnStickers } : {}),
  };
}

/**
 * Strips any `undefined` keys recursively before sending to Firestore.
 */
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Loads or initializes the learner profile when signing in:
 * - If a cloud document exists for this user, loads it as the source of truth.
 * - If this is a brand-new user (no cloud document yet), initializes a clean-slate profile.
 */
export async function migrateAndSyncProfileOnLogin(
  uid: string,
  cleanDefaultProfile: LearnerProfile
): Promise<LearnerProfile> {
  if (!db) return cleanDefaultProfile;

  const docRef = doc(db, LEARNERS_COLLECTION, uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const cloudData = snapshot.data() as Partial<LearnerProfile>;
    return mergeLearnerProfiles(cleanDefaultProfile, cloudData);
  }

  const sanitized = sanitizeForFirestore(cleanDefaultProfile);
  await setDoc(docRef, sanitized, { merge: true });
  return sanitized;
}

/**
 * Saves the latest LearnerProfile to Firestore (`learners/{uid}`).
 */
export async function saveProfileToFirestore(
  uid: string,
  profile: LearnerProfile
): Promise<void> {
  if (!db) return;
  const docRef = doc(db, LEARNERS_COLLECTION, uid);
  const sanitized = sanitizeForFirestore({
    ...profile,
    updatedAt: new Date().toISOString(),
  });
  await setDoc(docRef, sanitized, { merge: true });
}
