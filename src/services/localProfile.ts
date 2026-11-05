import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { isThemeId } from '../themes/themeRegistry';
import { LearnerProfile, SUPPORTED_GRADES } from '../types/learner';

type Obj = Record<string, unknown>;

const MAX_MISSION_STARS = 3;
const TIERS = ['explorer', 'challenger', 'master'];
const GENDERS = ['girl', 'boy'];
const VOICES = ['female', 'male'];

const isObject = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

/** `value` when it passes `check`, otherwise `fallback` */
function pick<T>(value: unknown, check: (v: unknown) => boolean, fallback: T): T {
  return check(value) ? (value as T) : fallback;
}

/** Merges `value` over `defaults`: a key whose default is a number or string keeps only a value of that type */
function mergeFlat<T extends object>(value: unknown, defaults: T): T {
  const src = isObject(value) ? value : {};
  const out = { ...defaults } as Obj;
  for (const [key, v] of Object.entries(src)) {
    const base = (defaults as Obj)[key];
    if (isNum(v) && (base === undefined || typeof base === 'number')) out[key] = v;
    else if (typeof v === 'string' && (base === undefined || typeof base === 'string')) out[key] = v;
    else if (typeof v === 'boolean' && typeof base === 'boolean') out[key] = v;
  }
  return out as T;
}

function cleanMissionProgress(value: unknown): Record<string, number> {
  if (!isObject(value)) return {};
  const out: Record<string, number> = {};
  for (const [id, stars] of Object.entries(value)) {
    if (isNum(stars) && stars >= 0 && stars <= MAX_MISSION_STARS) out[id] = stars;
  }
  return out;
}

function freshDefault(): LearnerProfile {
  return {
    ...DEFAULT_PROFILE,
    stats: { ...DEFAULT_PROFILE.stats },
    missionProgress: {},
    unlockedRewardIds: [...DEFAULT_PROFILE.unlockedRewardIds],
    claimedDailyQuestIds: [],
    dailyCounters: { ...DEFAULT_PROFILE.dailyCounters },
  };
}

/** True when the saved text is not a JSON object, so loading it gives the default profile */
export function isUnreadableProfile(raw: string): boolean {
  try {
    return !isObject(JSON.parse(raw));
  } catch {
    return true;
  }
}

/**
 * Turns the locally saved profile text into a profile the app can safely render. Unreadable text
 * gives the default profile; a readable one keeps every good field and repairs only the bad ones,
 * so a guest (who has no cloud copy) does not lose progress to one corrupt value.
 */
export function parseStoredProfile(raw: string | null): LearnerProfile {
  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    return freshDefault();
  }
  if (!isObject(parsed)) return freshDefault();

  const base = freshDefault();
  const profile: LearnerProfile = {
    ...base,
    ...(parsed as Partial<LearnerProfile>),
    isOnboarded: pick(parsed.isOnboarded, (v) => typeof v === 'boolean', base.isOnboarded),
    name: pick(parsed.name, (v) => typeof v === 'string', base.name),
    age: pick(parsed.age, isNum, base.age),
    gender: pick(parsed.gender, (v) => GENDERS.includes(v as string), base.gender),
    gradeId: pick(parsed.gradeId, (v) => SUPPORTED_GRADES.some((g) => g.id === v), base.gradeId),
    preferredTier: pick(parsed.preferredTier, (v) => TIERS.includes(v as string), base.preferredTier),
    themeId: pick(parsed.themeId, isThemeId, base.themeId),
    createdAt: pick(parsed.createdAt, (v) => typeof v === 'string', base.createdAt),
    isShabbatObserver: typeof parsed.isShabbatObserver === 'boolean' ? parsed.isShabbatObserver : true,
    stats: mergeFlat(parsed.stats, base.stats),
    missionProgress: cleanMissionProgress(parsed.missionProgress),
    unlockedRewardIds: pick(parsed.unlockedRewardIds, isStringArray, base.unlockedRewardIds),
    claimedDailyQuestIds: pick(parsed.claimedDailyQuestIds, isStringArray, base.claimedDailyQuestIds),
    dailyCounters: mergeFlat(parsed.dailyCounters, base.dailyCounters),
  };

  if (parsed.voicePreference !== undefined && !VOICES.includes(parsed.voicePreference as string)) {
    delete profile.voicePreference;
  }
  if (!isObject(parsed.missionTierStars)) delete profile.missionTierStars;
  if (!Array.isArray(parsed.activityLog)) delete profile.activityLog;
  if (!Array.isArray(parsed.customWordLists)) delete profile.customWordLists;
  return profile;
}
