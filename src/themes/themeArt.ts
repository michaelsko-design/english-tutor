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

/** A theme's scene art; the mascot's art is in companionRegistry.ts. */
export interface ThemeArt {
  /** World map background (Feature 26), 1080px wide, one copy per unit */
  mapBg: string;
  /** How the world map path runs and looks on this theme's map background */
  mapPath: MapPathStyle;
  /** Home base hero scene (Feature 27), 1200px wide */
  homeScene: string;
  /** English Room background, 1600px wide */
  roomBg: string;
}

export const COMMON_ART_NAMES = ['chest-closed', 'chest-open', 'boss-locked', 'boss-open', 'level-badge'] as const;

export type CommonArtName = (typeof COMMON_ART_NAMES)[number];

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
  'focus-desk': {
    centerline: toPoints([
      [0.5, 0], [0.5, 0.05], [0.5, 0.1], [0.5, 0.15], [0.483, 0.2], [0.416, 0.25], [0.334, 0.3], [0.294, 0.35],
      [0.3, 0.4], [0.36, 0.45], [0.498, 0.5], [0.631, 0.55], [0.696, 0.6], [0.705, 0.625], [0.696, 0.675],
      [0.649, 0.725], [0.581, 0.775], [0.525, 0.825], [0.502, 0.875], [0.5, 0.925], [0.5, 1],
    ]),
    edgeColor: '#0f766e',
    fillColor: '#ffffff',
    dashColor: '#99f6e4',
    trailColor: '#f97316',
    glowColor: null,
  },
  'urban-night': {
    centerline: toPoints([
      [0.5, 0], [0.5, 0.05], [0.5, 0.1], [0.511, 0.15], [0.557, 0.2], [0.649, 0.25], [0.725, 0.3],
      [0.743, 0.35], [0.717, 0.4], [0.628, 0.45], [0.495, 0.5], [0.354, 0.55], [0.27, 0.6], [0.255, 0.65],
      [0.265, 0.7], [0.326, 0.75], [0.454, 0.8], [0.506, 0.85], [0.506, 0.9], [0.5, 0.95], [0.5, 1],
    ]),
    edgeColor: '#a3e635',
    fillColor: '#27272a',
    dashColor: '#fafafa',
    trailColor: '#a3e635',
    glowColor: '#65a30d',
  },
  'travel-journal': {
    // Crosses between the continents at about 0.78, where the drawn band fades into the sea
    centerline: toPoints([
      [0.509, 0], [0.508, 0.05], [0.509, 0.1], [0.51, 0.15], [0.54, 0.2], [0.68, 0.25], [0.675, 0.3],
      [0.502, 0.35], [0.377, 0.4], [0.388, 0.45], [0.484, 0.5], [0.626, 0.55], [0.655, 0.6], [0.527, 0.65],
      [0.419, 0.7], [0.425, 0.73], [0.435, 0.755], [0.47, 0.778], [0.525, 0.8], [0.535, 0.82], [0.52, 0.845],
      [0.478, 0.875], [0.465, 0.925], [0.463, 1],
    ]),
    edgeColor: '#c9b48a',
    fillColor: '#fffaf0',
    dashColor: '#1e3a5f',
    trailColor: '#b45309',
    glowColor: null,
  },
};

export function buildThemeArt(themeId: ThemeId): ThemeArt {
  return {
    mapBg: `${ART_ROOT}/${themeId}/map-bg.webp`,
    mapPath: MAP_PATH_BY_THEME[themeId],
    homeScene: `${ART_ROOT}/${themeId}/home-scene.webp`,
    roomBg: `${ART_ROOT}/${themeId}/room-bg.webp`,
  };
}

/**
 * What picks a theme's mission art (landmarks, chests, Boss and level badge): its own folder
 * under /art/landmarks and /art/common, or null for the shared set first drawn for Cozy.
 */
export interface MissionArtTheme {
  missionArtFolder: string | null;
}

function missionArtFolder(group: 'common' | 'landmarks', theme: MissionArtTheme): string {
  return theme.missionArtFolder === null ? group : `${group}/${theme.missionArtFolder}`;
}

/** The chests, Boss stop and level badge of a theme, e.g. /art/common/focus-desk/boss-open.webp */
export function getCommonArt(theme: MissionArtTheme, name: CommonArtName): CutoutArt {
  return getCutoutArt(missionArtFolder('common', theme), name);
}

/**
 * Where the blank centre of each set's level badge sits, as shares of the image (measured on the
 * 512px file), so the level number is drawn on it. Keyed by missionArtFolder; SHARED is the null set.
 */
const SHARED_LEVEL_BADGE_CENTRE: MapPoint = { x: 0.495, y: 0.48 };
const LEVEL_BADGE_CENTRE_BY_FOLDER: Record<string, MapPoint> = {
  'focus-desk': { x: 0.5, y: 0.414 },
  'urban-night': { x: 0.5, y: 0.5 },
  'travel-journal': { x: 0.5, y: 0.5 },
  'neon-pop': { x: 0.5, y: 0.5 },
  'starlight-rpg': { x: 0.5, y: 0.5 },
};

export function getLevelBadgeCentre(theme: MissionArtTheme): MapPoint {
  const folder = theme.missionArtFolder;
  return (folder !== null && LEVEL_BADGE_CENTRE_BY_FOLDER[folder]) || SHARED_LEVEL_BADGE_CENTRE;
}

/** The landmark of a unit on the world map, e.g. /art/landmarks/g7-u3.webp */
export function getLandmarkArt(theme: MissionArtTheme, gradeNumber: number, unitNumber: number): CutoutArt {
  return getCutoutArt(missionArtFolder('landmarks', theme), `g${gradeNumber}-u${unitNumber}`);
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
export function getUnitLandmarkArt(theme: MissionArtTheme, gradeNumber: number, unit: LandmarkUnit): CutoutArt {
  const match = unit.missions[0] && MISSION_ID_UNIT.exec(unit.missions[0].id);
  const idUnitNumber = match ? Number(match[1]) : unit.unitNumber;
  return getLandmarkArt(theme, gradeNumber, idUnitNumber);
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
