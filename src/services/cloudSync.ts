import { doc, getDocFromCache, getDocFromServer, runTransaction, setDoc, type DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import {
  ContestRecord,
  CustomWordList,
  DrawnSticker,
  DreamEntry,
  DressUpDay,
  ExamPlanDay,
  ExamPrepPlan,
  FriendsHubState,
  LearnerProfile,
  LearnerRoom,
  PlacementResult,
  VaultPracticeDay,
} from '../types/learner';
import { keepNewestEntries } from '../data/dreamJournal';
import { MAX_DRAWN_STICKERS } from '../data/stickers';
import { MAX_CONTEST_HISTORY } from '../data/contests';
import { mergeActivityLog } from '../data/activityLog';
import { toLocalDateStr } from '../utils/dates';
import { getLedgerBalance, mergeDiamondLedgers } from '../data/diamondLedger';
import { mergeStreakStats } from '../data/streak';

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

  // Merge daily counters for today's (local) date
  const todayStr = toLocalDateStr(new Date());
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

  const resolvedFriendsHub = mergeFriendsHub(local.friendsHub, cloud.friendsHub);

  const resolvedActivityLog = mergeActivityLog(
    local.activityLog,
    cloud.activityLog,
    toLocalDateStr(new Date())
  );

  // Diamonds: per-device totals once either side has them (data/diamondLedger.ts)
  const resolvedLedger = mergeDiamondLedgers(local.diamondLedger, cloud.diamondLedger);
  const mergedDiamonds = resolvedLedger
    ? getLedgerBalance(resolvedLedger)
    : Math.max(local.stats?.diamonds || 0, cloud.stats?.diamonds || 0);

  const resolvedRewardDates = mergeLatestDates(local.missionRewardDates, cloud.missionRewardDates);
  const resolvedVaultPractice = mergeVaultPractice(local.vaultPractice, cloud.vaultPractice);

  const resolvedAvatar = preferCloudPrefs
    ? cloud.equippedAvatarEmoji || local.equippedAvatarEmoji
    : local.equippedAvatarEmoji || cloud.equippedAvatarEmoji;

  const resolvedSchoolGrade = preferCloudPrefs
    ? cloud.schoolGradeId ?? local.schoolGradeId
    : local.schoolGradeId ?? cloud.schoolGradeId;
  // The first consent stays (an earlier ISO time sorts first)
  const resolvedConsent = [local.parentalConsentAt, cloud.parentalConsentAt].filter(Boolean).sort()[0];

  const resolvedVoice = preferCloudPrefs
    ? cloud.voicePreference ?? local.voicePreference
    : local.voicePreference ?? cloud.voicePreference;

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
    ...(resolvedVoice ? { voicePreference: resolvedVoice } : {}),
    ...(resolvedSchoolGrade ? { schoolGradeId: resolvedSchoolGrade } : {}),
    ...(resolvedConsent ? { parentalConsentAt: resolvedConsent } : {}),
    ...(resolvedAvatar ? { equippedAvatarEmoji: resolvedAvatar } : {}),
    ...(resolvedPlacement ? { placementResult: resolvedPlacement } : {}),
    ...(resolvedExamPrep ? { examPrep: resolvedExamPrep } : {}),
    ...(resolvedWordLists ? { customWordLists: resolvedWordLists } : {}),
    ...(resolvedRoom ? { room: resolvedRoom } : {}),
    ...(resolvedFriendsHub ? { friendsHub: resolvedFriendsHub } : {}),
    ...(resolvedActivityLog ? { activityLog: resolvedActivityLog } : {}),
    ...(resolvedLedger ? { diamondLedger: resolvedLedger } : {}),
    ...(resolvedRewardDates ? { missionRewardDates: resolvedRewardDates } : {}),
    ...(resolvedVaultPractice ? { vaultPractice: resolvedVaultPractice } : {}),
    stats: {
      xp: mergedXp,
      level: mergedLevel,
      stars: maxStars,
      maxPossibleStars: Math.max(
        local.stats?.maxPossibleStars || 36,
        cloud.stats?.maxPossibleStars || 36
      ),
      diamonds: mergedDiamonds,
      ...mergeStreakStats(local.stats, cloud.stats),
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

/** The later day's rewarded Vault words; the same day unions both devices' words. */
function mergeVaultPractice(
  local: VaultPracticeDay | undefined,
  cloud: VaultPracticeDay | undefined
): VaultPracticeDay | undefined {
  if (!local || !cloud) return local || cloud;
  if (local.dateStr !== cloud.dateStr) return local.dateStr > cloud.dateStr ? local : cloud;
  return { dateStr: local.dateStr, words: Array.from(new Set([...local.words, ...cloud.words])) };
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
  return archiveOverflowStickers([
    ...local.map((sticker) => {
      const match = cloudById.get(sticker.id);
      const archivedAt = earliestIso(sticker.archivedAt, match?.archivedAt);
      return archivedAt ? { ...sticker, imageDataUrl: '', archivedAt } : sticker;
    }),
    ...cloud.filter((s) => !localIds.has(s.id)),
  ]);
}

/**
 * Two offline devices can each draw MAX_DRAWN_STICKERS, so the merge keeps only the newest ones
 * active and archives the rest. archivedAt is the newest createdAt among the active stickers, so
 * every device computes the same result and the profile stays within Firestore's size limit.
 */
function archiveOverflowStickers(stickers: DrawnSticker[]): DrawnSticker[] {
  const active = stickers.filter((s) => !s.archivedAt);
  if (active.length <= MAX_DRAWN_STICKERS) return stickers;
  const newestFirst = [...active].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)
  );
  const keptIds = new Set(newestFirst.slice(0, MAX_DRAWN_STICKERS).map((s) => s.id));
  const archivedAt = newestFirst[0].createdAt;
  return stickers.map((s) =>
    s.archivedAt || keptIds.has(s.id) ? s : { ...s, imageDataUrl: '', archivedAt }
  );
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
 * The newer toggle wins. The earlier-claimed friend code is kept, so both devices end up with the
 * same code; a code claimed by the other device still points to this learner, so it stays valid.
 */
function mergeFriendsHub(
  local: FriendsHubState | undefined,
  cloud: FriendsHubState | undefined
): FriendsHubState | undefined {
  if (!local || !cloud) return local || cloud;
  const newer = (Date.parse(cloud.updatedAt) || 0) > (Date.parse(local.updatedAt) || 0) ? cloud : local;
  const codeOwner = [local, cloud]
    .filter((hub) => hub.friendCode)
    .sort((a, b) => (a.friendCodeCreatedAt || '').localeCompare(b.friendCodeCreatedAt || ''))[0];
  const contestFinishDay = mergeContestFinishDay(local.contestFinishDay, cloud.contestFinishDay);
  const contestHistory = mergeContestHistory(local.contestHistory, cloud.contestHistory);
  return {
    ...newer,
    ...(codeOwner
      ? { friendCode: codeOwner.friendCode, friendCodeCreatedAt: codeOwner.friendCodeCreatedAt }
      : {}),
    ...(contestFinishDay ? { contestFinishDay } : {}),
    ...(contestHistory ? { contestHistory } : {}),
  };
}

/** The later day wins; the same day keeps the higher count, so a given reward stays given. */
function mergeContestFinishDay(
  local: FriendsHubState['contestFinishDay'],
  cloud: FriendsHubState['contestFinishDay']
): FriendsHubState['contestFinishDay'] {
  if (!local || !cloud) return local || cloud;
  if (local.dateStr !== cloud.dateStr) return local.dateStr > cloud.dateStr ? local : cloud;
  return { dateStr: local.dateStr, count: Math.max(local.count, cloud.count) };
}

/** Contest records from both devices by contest, newest first; a contest is recorded only once. */
function mergeContestHistory(
  local: ContestRecord[] | undefined,
  cloud: ContestRecord[] | undefined
): ContestRecord[] | undefined {
  if (!local || !cloud) return local || cloud;
  const byId = new Map<string, ContestRecord>();
  // The earlier record of a contest wins, so its diamonds are counted once
  for (const record of [...local, ...cloud].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))) {
    if (!byId.has(record.contestId)) byId.set(record.contestId, record);
  }
  return Array.from(byId.values())
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt) || a.contestId.localeCompare(b.contestId))
    .slice(0, MAX_CONTEST_HISTORY);
}

/**
 * Strips any `undefined` keys recursively before sending to Firestore.
 */
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * The profile after sign-in when the cloud already has one. The fresh default only fills gaps:
 * its welcome diamonds must not count, or every sign-in would top a spent-down balance up to
 * the welcome gift (the merge keeps the larger plain balance while there is no ledger).
 */
export function buildLoginProfile(
  cleanDefaultProfile: LearnerProfile,
  cloudData: Partial<LearnerProfile>
): LearnerProfile {
  const base: LearnerProfile = {
    ...cleanDefaultProfile,
    stats: { ...cleanDefaultProfile.stats, diamonds: 0 },
  };
  return mergeLearnerProfiles(base, cloudData);
}

/**
 * The learner's document for sign-in. It comes from the server: a cache cleared (or filled by an
 * older session) must never answer "no profile". Offline, a cached copy that exists still opens
 * the app; with nothing cached the error reaches the retry screen.
 */
async function readLoginSnapshot(docRef: DocumentReference) {
  try {
    return await getDocFromServer(docRef);
  } catch (error) {
    const cached = await getDocFromCache(docRef).catch(() => null);
    if (cached?.exists()) return cached;
    throw error;
  }
}

/**
 * Loads or initializes the learner profile when signing in:
 * - If a cloud document exists for this user, loads it as the source of truth.
 * - If this is a brand-new user (no cloud document yet), initializes a clean-slate profile. The
 *   document is created in a transaction that re-checks it, so a default never lands on a profile
 *   that exists (an earlier sign-in bug reset a learner's progress that way).
 */
export async function migrateAndSyncProfileOnLogin(
  uid: string,
  cleanDefaultProfile: LearnerProfile
): Promise<LearnerProfile> {
  if (!db) return cleanDefaultProfile;

  const docRef = doc(db, LEARNERS_COLLECTION, uid);
  const snapshot = await readLoginSnapshot(docRef);
  if (snapshot.exists()) {
    return buildLoginProfile(cleanDefaultProfile, snapshot.data() as Partial<LearnerProfile>);
  }

  const sanitized = sanitizeForFirestore(cleanDefaultProfile);
  return runTransaction(db, async (transaction) => {
    const latest = await transaction.get(docRef);
    if (latest.exists()) return buildLoginProfile(cleanDefaultProfile, latest.data() as Partial<LearnerProfile>);
    transaction.set(docRef, sanitized);
    return sanitized;
  });
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
