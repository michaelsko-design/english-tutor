import type { LearnerGender } from '../types/learner';
import type { CurriculumUnit } from './curriculum/types';
import { CONTENT_PACKS, IS_PACK_PREVIEW, RELEASED_CONTENT_PACKS } from './curriculum/packs/registry';
import type { ContentPack, ContentPackId, ReleasedPack } from './curriculum/packs/types';
import { daysBetween } from '../utils/dates';

/** How long a released pack's units show "חדש!" on the map and the home card is offered */
export const NEW_PACK_DAYS = 14;

/** Release state the helpers read; tests pass their own */
export interface PackReleaseState {
  released: readonly ReleasedPack[];
  /** `npm run dev:packs`: every pack counts as just released */
  isPreview: boolean;
}

const APP_RELEASE_STATE: PackReleaseState = { released: RELEASED_CONTENT_PACKS, isPreview: IS_PACK_PREVIEW };

/** True for a unit's pack within `NEW_PACK_DAYS` of the day it shipped. */
export function isPackNew(
  packId: string | undefined,
  todayStr: string,
  state: PackReleaseState = APP_RELEASE_STATE
): boolean {
  if (packId === undefined) return false;
  if (state.isPreview) return packId in CONTENT_PACKS;
  const release = state.released.find((r) => r.id === packId);
  if (!release) return false;
  const age = daysBetween(release.releasedAt, todayStr);
  return age >= 0 && age < NEW_PACK_DAYS;
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

/** The home card's Hebrew; title and body are read aloud in grades 1–2 (in the Hebrew corpus). */
export function getNewPackCopy(pack: ContentPack, unitCount: number, gender: LearnerGender): NewPackCopy {
  const isGirl = gender === 'girl';
  const titleHe = `חדש! ${pack.titleHe}`;
  const bodyHe = `${unitCount} יחידות חדשות נוספו למפה שלך.`;
  return {
    titleHe,
    bodyHe,
    buttonHe: isGirl ? 'בואי לראות' : 'בוא לראות',
    spokenHe: `${titleHe}. ${bodyHe}`,
  };
}
