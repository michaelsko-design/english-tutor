/**
 * Art manifest (Feature 25): where every generated picture lives under public/art/.
 * Files are made by scripts/process_art.py from art-src/. Any file may be missing; the
 * components that show them (ArtImage, Companion, StoryArt) fall back without a broken image.
 */

import { ThemeId } from '../types/learner';

export type CompanionPose = 'idle' | 'cheer' | 'think' | 'oops' | 'wave';

export const COMPANION_POSES: CompanionPose[] = ['idle', 'cheer', 'think', 'oops', 'wave'];

/** A cut-out picture in two sizes: 512px and 256px squares. */
export interface CutoutArt {
  full: string;
  small: string;
}

export interface ThemeArt {
  companion: Record<CompanionPose, CutoutArt>;
  /** World map background (Feature 26), 1080px wide */
  mapBg: string;
  /** Home base hero scene (Feature 27), 1200px wide */
  homeScene: string;
  /** English Room background, 1600px wide */
  roomBg: string;
}

export type CommonArtName = 'chest-closed' | 'chest-open' | 'boss-locked' | 'boss-open' | 'level-badge';

const ART_ROOT = '/art';
/** Rendered at this many device pixels or fewer, the 256px file is sharp enough. */
const SMALL_VARIANT_MAX_DEVICE_PX = 256;

export function getCutoutArt(folder: string, name: string): CutoutArt {
  return {
    full: `${ART_ROOT}/${folder}/${name}.webp`,
    small: `${ART_ROOT}/${folder}/${name}@256.webp`,
  };
}

export function buildThemeArt(themeId: ThemeId): ThemeArt {
  const companion = Object.fromEntries(
    COMPANION_POSES.map((pose) => [pose, getCutoutArt(themeId, `companion-${pose}`)])
  ) as Record<CompanionPose, CutoutArt>;
  return {
    companion,
    mapBg: `${ART_ROOT}/${themeId}/map-bg.webp`,
    homeScene: `${ART_ROOT}/${themeId}/home-scene.webp`,
    roomBg: `${ART_ROOT}/${themeId}/room-bg.webp`,
  };
}

/** Shared pictures for every theme: chests, Boss castles and the level badge. */
export function getCommonArt(name: CommonArtName): CutoutArt {
  return getCutoutArt('common', name);
}

/** The landmark of a unit on the world map, e.g. /art/landmarks/g7-u3.webp */
export function getLandmarkArt(gradeNumber: number, unitNumber: number): CutoutArt {
  return getCutoutArt('landmarks', `g${gradeNumber}-u${unitNumber}`);
}

/** The spot illustration of a mission's story step, e.g. /art/stories/g7-u3-m2.webp */
export function getStoryArt(missionId: string): string {
  return `${ART_ROOT}/stories/${missionId}.webp`;
}

/** The 256px file when it is sharp enough for the size shown, otherwise the 512px one. */
export function pickCutoutSrc(art: CutoutArt, displaySizePx: number, devicePixelRatio = 1): string {
  const devicePx = displaySizePx * Math.max(1, devicePixelRatio);
  return devicePx <= SMALL_VARIANT_MAX_DEVICE_PX ? art.small : art.full;
}
