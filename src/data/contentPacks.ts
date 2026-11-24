import type { LearnerGender } from '../types/learner';
import type { CurriculumUnit } from './curriculum/types';
import { CONTENT_PACKS, IS_PACK_PREVIEW, RELEASED_CONTENT_PACKS } from './curriculum/packs/registry';
import type { ContentPack, ContentPackId, ReleasedPack } from './curriculum/packs/types';
import { isReleaseNew } from './curriculum/packs/newWindow';
import { isolateLtr } from '../utils/bidi';
import { PARENTS_AREA_LABEL_HE, PRO_SPOKEN_HE } from './proAsk';

export { NEW_PACK_DAYS } from './curriculum/packs/newWindow';

/** Release state the helpers read; tests pass their own */
export interface PackReleaseState {
  released: readonly ReleasedPack[];
  /** `npm run dev:packs`: every pack counts as just released */
  isPreview: boolean;
}

const APP_RELEASE_STATE: PackReleaseState = { released: RELEASED_CONTENT_PACKS, isPreview: IS_PACK_PREVIEW };

/**
 * True for a unit's pack from the day it shipped: through its `newUntil` day when it has one, else
 * for `NEW_PACK_DAYS` days.
 */
export function isPackNew(
  packId: string | undefined,
  todayStr: string,
  state: PackReleaseState = APP_RELEASE_STATE
): boolean {
  if (packId === undefined) return false;
  if (state.isPreview) return packId in CONTENT_PACKS;
  const release = state.released.find((r) => r.id === packId);
  return release !== undefined && isReleaseNew(release, todayStr);
}

/**
 * The new pack the reminder names (`new-pack` hint): the first unit of the grade whose pack is new,
 * whose first mission the learner can play, and that has no stars yet. Null when there is none.
 */
export function getWaitingNewPackId(
  units: readonly CurriculumUnit[],
  progress: Readonly<Record<string, number>>,
  todayStr: string,
  canPlay: (unit: CurriculumUnit, missionId: string) => boolean,
  state: PackReleaseState = APP_RELEASE_STATE
): ContentPackId | null {
  const waiting = units.find(
    (unit) =>
      unit.packId !== undefined &&
      unit.missions.length > 0 &&
      isPackNew(unit.packId, todayStr, state) &&
      canPlay(unit, unit.missions[0].id) &&
      unit.missions.every((mission) => !((progress[mission.id] || 0) > 0))
  );
  return waiting?.packId && waiting.packId in CONTENT_PACKS ? (waiting.packId as ContentPackId) : null;
}

/** What the home card offers: a new pack's first unit on the learner's map */
export interface NewPackOffer {
  pack: ContentPack;
  unitCount: number;
  firstMissionId: string;
  badgeEmoji: string;
}

/** The first new pack with units in this grade that the device hasn't dismissed, if any. */
export function getNewPackOffer(
  units: readonly CurriculumUnit[],
  todayStr: string,
  seenPackIds: readonly string[],
  state: PackReleaseState = APP_RELEASE_STATE
): NewPackOffer | null {
  const packUnits = units.filter(
    (unit) => unit.packId && !seenPackIds.includes(unit.packId) && isPackNew(unit.packId, todayStr, state)
  );
  const first = packUnits[0];
  if (!first?.packId || first.missions.length === 0) return null;
  const pack = CONTENT_PACKS[first.packId as ContentPackId];
  return {
    pack,
    unitCount: packUnits.filter((unit) => unit.packId === pack.id).length,
    firstMissionId: first.missions[0].id,
    badgeEmoji: first.badgeEmoji,
  };
}

export interface NewPackCopy {
  titleHe: string;
  bodyHe: string;
  buttonHe: string;
  /** What the 🔊 reads: one clip, so the Hebrew corpus adds exactly this text */
  spokenHe: string;
}

/**
 * The home card's Hebrew; title and body are read aloud in grades 1–2 (in the Hebrew corpus). A pack
 * with its own `announceBodyHe` (a seasonal one) says that instead of the generic line. A Pro pack the
 * learner can't play yet asks a parent instead of leading to the map.
 */
export function getNewPackCopy(pack: ContentPack, unitCount: number, gender: LearnerGender, isProLocked = false): NewPackCopy {
  const isGirl = gender === 'girl';
  const titleHe = `חדש! ${pack.titleHe}`;
  const isOne = unitCount === 1;
  if (isProLocked) {
    const addedHe = isOne ? 'יחידה חדשה נוספה למפה' : `${unitCount} יחידות חדשות נוספו למפה`;
    const inProHe = (pro: string) => `${isOne ? 'היא כלולה' : 'הן כלולות'} במסלול ${pro}. מידע להורים באזור ההורים.`;
    return {
      titleHe,
      bodyHe: `${addedHe}. ${inProHe(isolateLtr('Pro'))}`,
      buttonHe: PARENTS_AREA_LABEL_HE,
      spokenHe: `${titleHe}. ${addedHe}. ${inProHe(PRO_SPOKEN_HE)}`,
    };
  }
  const genericBodyHe = isOne ? 'יחידה חדשה נוספה למפה שלך.' : `${unitCount} יחידות חדשות נוספו למפה שלך.`;
  const bodyHe = pack.announceBodyHe ?? genericBodyHe;
  return {
    titleHe,
    bodyHe,
    buttonHe: isGirl ? 'בואי לראות' : 'בוא לראות',
    spokenHe: `${titleHe}. ${bodyHe}`,
  };
}
