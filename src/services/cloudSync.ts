import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { LearnerProfile } from '../types/learner';

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
