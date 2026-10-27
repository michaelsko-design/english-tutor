/**
 * The mascots (companions). Each theme has a default one, and a learner may pick any mascot on
 * any theme (`LearnerProfile.companionId`); `resolveTheme` in themeRegistry.ts joins the two.
 */

import { CompanionId } from '../types/learner';
import { COMPANION_POSES, CompanionPose, CutoutArt, getCutoutArt } from './themeArt';

export interface CompanionDefinition {
  id: CompanionId;
  /** Shown as is (English), e.g. in "אני Mochi the Cat" */
  name: string;
  /** Shown while the art loads or is missing, and as the learner's avatar when none is equipped */
  avatarEmoji: string;
  art: Record<CompanionPose, CutoutArt>;
  /** Dark art that needs a light rim on a dark theme (Comet, dark navy) */
  isDarkArt: boolean;
  /** Offered in the picker; a mascot stays hidden (except on the dev server) until its art is in */
  isReleased: boolean;
}

/** A soft white edge plus a faint cyan glow, for dark art on a dark background. */
export const LIGHT_COMPANION_RIM =
  'drop-shadow(0 0 2px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(127, 214, 255, 0.35))';

export const DEFAULT_COMPANION_ID: CompanionId = 'mochi';

/** The first three were drawn per theme and keep their files there; newer ones have their own folder. */
function buildCompanionArt(folder: string): Record<CompanionPose, CutoutArt> {
  return Object.fromEntries(
    COMPANION_POSES.map((pose) => [pose, getCutoutArt(folder, `companion-${pose}`)])
  ) as Record<CompanionPose, CutoutArt>;
}

export const COMPANION_REGISTRY: Record<CompanionId, CompanionDefinition> = {
  mochi: {
    id: 'mochi',
    name: 'Mochi the Cat',
    avatarEmoji: '🧋',
    art: buildCompanionArt('cozy-studio'),
    isDarkArt: false,
    isReleased: true,
  },
  'dj-beat': {
    id: 'dj-beat',
    name: 'DJ Beat',
    avatarEmoji: '🎧',
    art: buildCompanionArt('neon-pop'),
    isDarkArt: false,
    isReleased: true,
  },
  comet: {
    id: 'comet',
    name: 'Comet (Star Fox)',
    avatarEmoji: '🦊',
    art: buildCompanionArt('starlight-rpg'),
    isDarkArt: true,
    isReleased: true,
  },
  // The grown-up themes' mascots (calmer, flatter art), in /art/companions/<id>/
  sage: {
    id: 'sage',
    name: 'Sage the Owl',
    avatarEmoji: '🦉',
    art: buildCompanionArt('companions/sage'),
    isDarkArt: false,
    isReleased: true,
  },
  kai: {
    id: 'kai',
    name: 'Kai the Raccoon',
    avatarEmoji: '🦝',
    art: buildCompanionArt('companions/kai'),
    // Grey fur on the charcoal Street theme needs the rim
    isDarkArt: true,
    isReleased: true,
  },
  atlas: {
    id: 'atlas',
    name: 'Atlas the Otter',
    avatarEmoji: '🦦',
    art: buildCompanionArt('companions/atlas'),
    isDarkArt: false,
    isReleased: true,
  },
};

export const COMPANION_IDS = Object.keys(COMPANION_REGISTRY) as CompanionId[];

/** Unreleased mascots and themes show on the dev server only, to check them before their art ships. */
export const IS_ART_PREVIEW = import.meta.env?.DEV === true;

/** The mascots the picker offers: the released ones, plus a chosen one so it never disappears. */
export function getPickableCompanionIds(chosenId?: CompanionId, isPreview = IS_ART_PREVIEW): CompanionId[] {
  return COMPANION_IDS.filter((id) => isPreview || COMPANION_REGISTRY[id].isReleased || id === chosenId);
}

export function isCompanionId(value: unknown): value is CompanionId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(COMPANION_REGISTRY, value);
}

/** The mascot of this id, or the fallback for a missing or unknown id (e.g. saved by a newer app). */
export function getCompanion(id: string | undefined, fallbackId: CompanionId = DEFAULT_COMPANION_ID): CompanionDefinition {
  return COMPANION_REGISTRY[isCompanionId(id) ? id : fallbackId];
}

/** Dark mascot art gets a light rim on a dark theme, so it doesn't vanish into the background. */
export function getCompanionRim(companion: CompanionDefinition, isDarkTheme: boolean): string | null {
  return companion.isDarkArt && isDarkTheme ? LIGHT_COMPANION_RIM : null;
}
