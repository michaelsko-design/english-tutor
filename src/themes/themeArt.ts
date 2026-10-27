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

/** A point on the map background: x and y as shares (0–1) of its width and height. */
export interface MapPoint {
  x: number;
  y: number;
}

/** How the world map path is drawn on a theme's map background (Feature 26). */
export interface MapPathStyle {
  /**
   * The middle of the background's empty winding band, top to bottom. The path follows it
   * through every unit's copy of the background, so it must start and end near x = 0.5.
   */
  centerline: MapPoint[];
  /** The wide outer stroke (the road's edge) */
  edgeColor: string;
  /** The road itself, drawn on the edge */
  fillColor: string;
  /** Dashes along the middle of the road */
  dashColor: string;
  /** The finished part of the path, up to the current mission */
  trailColor: string;
  /** Glow colour around the path, for a light path on a dark band; null for none */
  glowColor: string | null;
}

export interface ThemeArt {
  companion: Record<CompanionPose, CutoutArt>;
  /**
   * CSS filter drawn around the companion art, or null. A dark companion on a dark theme
   * (Comet on Stars) gets a soft light rim so it doesn't vanish into the background.
   */
  companionRim: string | null;
  /** World map background (Feature 26), 1080px wide, one copy per unit */
  mapBg: string;
  /** How the world map path runs and looks on this theme's map background */
  mapPath: MapPathStyle;
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

/** Height / width of every map background (process_art.py writes them 1080 × 1935). */
export const MAP_BG_ASPECT = 1935 / 1080;

const toPoints = (pairs: Array<[number, number]>): MapPoint[] => pairs.map(([x, y]) => ({ x, y }));

/**
 * The world map path of each theme (Feature 26). The centerlines were traced on the map
 * backgrounds; trace again when a background is replaced. Cozy's path is a sandy road on
 * the grass; the dark themes get a light, glowing path so it shows on the near-black band.
 */
export const MAP_PATH_BY_THEME: Record<ThemeId, MapPathStyle> = {
  'cozy-studio': {
    centerline: toPoints([
      [0.5, 0], [0.42, 0.08], [0.38, 0.15], [0.42, 0.22], [0.52, 0.28], [0.55, 0.33], [0.47, 0.39],
      [0.38, 0.46], [0.4, 0.53], [0.5, 0.58], [0.57, 0.63], [0.54, 0.68], [0.44, 0.73], [0.36, 0.8],
      [0.4, 0.87], [0.48, 0.93], [0.5, 1],
    ]),
    edgeColor: '#c9975f',
    fillColor: '#f8e6c4',
    dashColor: '#ffffff',
    trailColor: '#f6b93b',
    glowColor: null,
  },
  'neon-pop': {
    centerline: toPoints([
      [0.48, 0], [0.5, 0.05], [0.51, 0.1], [0.47, 0.15], [0.45, 0.2], [0.44, 0.25], [0.48, 0.3],
      [0.54, 0.35], [0.54, 0.4], [0.47, 0.45], [0.44, 0.5], [0.47, 0.55], [0.55, 0.6], [0.58, 0.65],
      [0.55, 0.7], [0.47, 0.75], [0.44, 0.8], [0.46, 0.85], [0.49, 0.9], [0.5, 0.95], [0.5, 1],
    ]),
    edgeColor: '#22d3ee',
    fillColor: '#ecfeff',
    dashColor: '#f472b6',
    trailColor: '#f472b6',
    glowColor: '#22d3ee',
  },
  'starlight-rpg': {
    centerline: toPoints([
      [0.5, 0], [0.57, 0.1], [0.47, 0.2], [0.45, 0.3], [0.47, 0.4], [0.58, 0.5], [0.53, 0.6],
      [0.41, 0.7], [0.42, 0.8], [0.45, 0.9], [0.5, 1],
    ]),
    edgeColor: '#a5b4fc',
    fillColor: '#eef2ff',
    dashColor: '#fcd34d',
    trailColor: '#fcd34d',
    glowColor: '#7dd3fc',
  },
};

/** A soft white edge plus a faint cyan glow, for dark art on a dark background. */
export const LIGHT_COMPANION_RIM =
  'drop-shadow(0 0 2px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(127, 214, 255, 0.35))';

export function buildThemeArt(themeId: ThemeId, options: { companionRim?: string } = {}): ThemeArt {
  const companion = Object.fromEntries(
    COMPANION_POSES.map((pose) => [pose, getCutoutArt(themeId, `companion-${pose}`)])
  ) as Record<CompanionPose, CutoutArt>;
  return {
    companion,
    companionRim: options.companionRim ?? null,
    mapBg: `${ART_ROOT}/${themeId}/map-bg.webp`,
    mapPath: MAP_PATH_BY_THEME[themeId],
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

/** What a unit's landmark is named by: its place on the map and its missions' ids. */
export interface LandmarkUnit {
  unitNumber: number;
  missions: ReadonlyArray<{ id: string }>;
}

const MISSION_ID_UNIT = /^g\d+-u(\d+)-m\d+$/;

/**
 * The landmark of a unit, named by the unit number in its mission ids like the story pictures.
 * That differs from the unit's place in grade 1, where the letters units (ids g1-u11…) came
 * first later; a unit with no readable mission id falls back to its place.
 */
export function getUnitLandmarkArt(gradeNumber: number, unit: LandmarkUnit): CutoutArt {
  const match = unit.missions[0] && MISSION_ID_UNIT.exec(unit.missions[0].id);
  const idUnitNumber = match ? Number(match[1]) : unit.unitNumber;
  return getLandmarkArt(gradeNumber, idUnitNumber);
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
