import { CurriculumUnit, MissionNode } from './curriculum/types';
import { BossGate, getBossGate, getSuggestedMission, isMissionUnlocked } from './milestones';
import { canPlayMission, getPlayableUnits, getProAccess, type ProAccess } from './proGate';
import { MapPoint } from '../themes/themeArt';

/**
 * World map layout (Feature 26), pure maths for the illustrated map of a grade.
 *
 * The map is one column of regions, one per unit, each drawn on one copy of the theme's map
 * background. All lengths are in map widths (the map is 1 wide), so the layout scales with
 * the screen. Each unit's banner sits on the join above its region and hides the seam between
 * two copies of the background (they don't tile). The path follows the background's winding
 * band through every region; the stops sit on it at equal distances.
 */

/** Height of a unit banner, in map widths. Banners are centred on the top edge of their region. */
export const MAP_BANNER_HEIGHT = 0.27;
/** Free space between a banner's edge and the nearest stop, in map widths */
export const MAP_STOP_CLEARANCE = 0.1;
/** Points drawn between two centerline points, so the path bends smoothly */
const SAMPLES_PER_SEGMENT = 12;
/** Centre of a landmark beside the path, as a share of the map width */
export const LANDMARK_CENTER_X = { left: 0.21, right: 0.79 } as const;

export type MapStopStatus = 'done' | 'open' | 'locked' | 'pro';
export type LandmarkSide = keyof typeof LANDMARK_CENTER_X;

export interface MapStopState {
  mission: MissionNode;
  /** done: has stars; open: can be played; locked: by the sequential rule or the Boss gate; pro: needs Pro */
  status: MapStopStatus;
  stars: number;
  /** The suggested mission (as on the dashboard): the companion stands on it */
  isCurrent: boolean;
  /** The unit's Boss star gate, set on the Boss stop only */
  bossGate: BossGate | null;
}

export interface MapStop {
  state: MapStopState;
  position: MapPoint;
}

export interface MapRegion {
  unit: CurriculumUnit;
  index: number;
  /** Top of the region's background, in map widths from the top of the map */
  top: number;
  /** Height of the region's background, in map widths */
  height: number;
  /** Top of the unit banner; the banner covers the join with the previous region */
  bannerTop: number;
  stops: MapStop[];
  landmark: { position: MapPoint; side: LandmarkSide };
}

export interface WorldMapLayout {
  /** Height of the whole map, in map widths */
  height: number;
  regions: MapRegion[];
  /** The whole path, top to bottom */
  path: MapPoint[];
  /** The path from the top to the current stop: the part already walked */
  trail: MapPoint[];
  currentStop: MapStop | null;
}

interface RegionFrame {
  top: number;
  height: number;
  bannerTop: number;
}

/** A smooth curve (Catmull-Rom) through the centerline points, as many short straight pieces. */
export function sampleCenterline(points: MapPoint[], samplesPerSegment = SAMPLES_PER_SEGMENT): MapPoint[] {
  if (points.length < 2) return points.map((p) => ({ ...p }));

  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  const samples: MapPoint[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let s = 0; s < samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const blend = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      samples.push({ x: blend(p0.x, p1.x, p2.x, p3.x), y: blend(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  samples.push({ ...points[points.length - 1] });
  return samples;
}

/** Where each region and banner sits. Half a banner of space above the first region holds its banner. */
export function getRegionFrames(regionCount: number, backgroundAspect: number): { frames: RegionFrame[]; height: number } {
  const topPadding = MAP_BANNER_HEIGHT / 2;
  const frames = Array.from({ length: regionCount }, (_, index) => {
    const top = topPadding + index * backgroundAspect;
    return { top, height: backgroundAspect, bannerTop: top - MAP_BANNER_HEIGHT / 2 };
  });
  return { frames, height: topPadding + regionCount * backgroundAspect };
}

/** The sampled centerline placed on one region, in map widths. */
export function placeOnRegion(samples: MapPoint[], frame: RegionFrame): MapPoint[] {
  return samples.map((p) => ({ x: p.x, y: frame.top + p.y * frame.height }));
}

const distance = (a: MapPoint, b: MapPoint) => Math.hypot(b.x - a.x, b.y - a.y);

const lerp = (a: MapPoint, b: MapPoint, t: number): MapPoint => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/** The part of a top-to-bottom path between two heights. */
export function clipPathByY(path: MapPoint[], fromY: number, toY: number): MapPoint[] {
  const clipped: MapPoint[] = [];
  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    const prev = path[i - 1];
    const isInside = point.y >= fromY && point.y <= toY;
    if (prev) {
      // Add the crossing of each edge the segment passes
      [fromY, toY].forEach((edge) => {
        const crosses = (prev.y < edge && point.y > edge) || (prev.y > edge && point.y < edge);
        if (crosses) clipped.push(lerp(prev, point, (edge - prev.y) / (point.y - prev.y)));
      });
    }
    if (isInside) clipped.push({ ...point });
  }
  return clipped;
}

/** The point a share (0–1) of the way along a path, measured by length. */
export function getPointAlongPath(path: MapPoint[], share: number): MapPoint {
  if (path.length === 0) return { x: 0.5, y: 0 };
  const lengths = path.slice(1).map((p, i) => distance(path[i], p));
  const total = lengths.reduce((acc, l) => acc + l, 0);
  let remaining = Math.max(0, Math.min(1, share)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] && lengths[i] > 0) return lerp(path[i], path[i + 1], remaining / lengths[i]);
    remaining -= lengths[i];
  }
  return { ...path[path.length - 1] };
}

/** The x of a top-to-bottom path at a height. */
export function getPathXAtY(path: MapPoint[], y: number): number {
  for (let i = 1; i < path.length; i++) {
    const [a, b] = [path[i - 1], path[i]];
    if ((a.y <= y && b.y >= y) || (a.y >= y && b.y <= y)) {
      return a.y === b.y ? a.x : lerp(a, b, (y - a.y) / (b.y - a.y)).x;
    }
  }
  return path.length > 0 ? path[path.length - 1].x : 0.5;
}

/**
 * Stops of one region at equal distances along its path, between the banner above and the
 * banner below (each stop gets an equal share, and sits in the middle of it).
 */
export function getStopPositions(regionPath: MapPoint[], frame: RegionFrame, stopCount: number): MapPoint[] {
  const margin = MAP_BANNER_HEIGHT / 2 + MAP_STOP_CLEARANCE;
  const playable = clipPathByY(regionPath, frame.top + margin, frame.top + frame.height - margin);
  return Array.from({ length: stopCount }, (_, i) => getPointAlongPath(playable, (i + 0.5) / stopCount));
}

/** The landmark sits between the first two stops, on the side of the map with more room. */
export function getLandmarkPlacement(
  regionPath: MapPoint[],
  frame: RegionFrame,
  stops: MapPoint[]
): { position: MapPoint; side: LandmarkSide } {
  const y = stops.length >= 2 ? (stops[0].y + stops[1].y) / 2 : frame.top + frame.height / 2;
  const side: LandmarkSide = getPathXAtY(regionPath, y) < 0.5 ? 'right' : 'left';
  return { position: { x: LANDMARK_CENTER_X[side], y }, side };
}

/** Pro access that holds nothing back (the default where a caller doesn't pass one) */
const FULL_ACCESS = getProAccess(true);

/**
 * State of every mission stop: stars, unlocks and the Boss gate exactly as in milestones.ts, and
 * Pro stops (docs/feature-pro-tier.md) for a free learner. The companion stands on the next mission
 * the learner can play.
 */
export function getMapStopStates(
  units: CurriculumUnit[],
  progress: Record<string, number>,
  access: ProAccess = FULL_ACCESS
): MapStopState[][] {
  const playable = getPlayableUnits(units, access);
  const currentId = playable.some((u) => u.missions.length > 0)
    ? getSuggestedMission(playable, progress).mission.id
    : null;
  return units.map((unit) => {
    const gate = getBossGate(unit, progress);
    return unit.missions.map((mission) => {
      const stars = progress[mission.id] || 0;
      const isUnlocked = isMissionUnlocked(units, progress, mission.id);
      const isProOnly = !canPlayMission(unit, mission.id, progress, access);
      const status: MapStopStatus = stars > 0 ? 'done' : isProOnly ? 'pro' : isUnlocked ? 'open' : 'locked';
      return {
        mission,
        status,
        stars,
        isCurrent: mission.id === currentId,
        bossGate: mission.isBoss ? gate : null,
      };
    });
  });
}

/** Everything the world map draws for a grade: regions, stops, landmarks and the path. */
export function buildWorldMap(
  units: CurriculumUnit[],
  progress: Record<string, number>,
  centerline: MapPoint[],
  backgroundAspect: number,
  access: ProAccess = FULL_ACCESS
): WorldMapLayout {
  const samples = sampleCenterline(centerline);
  const { frames, height } = getRegionFrames(units.length, backgroundAspect);
  const states = getMapStopStates(units, progress, access);

  const regions: MapRegion[] = units.map((unit, index) => {
    const frame = frames[index];
    const regionPath = placeOnRegion(samples, frame);
    const positions = getStopPositions(regionPath, frame, unit.missions.length);
    return {
      unit,
      index,
      ...frame,
      stops: states[index].map((state, i) => ({ state, position: positions[i] })),
      landmark: getLandmarkPlacement(regionPath, frame, positions),
    };
  });

  const path = frames.flatMap((frame) => placeOnRegion(samples, frame));
  const currentStop = regions.flatMap((r) => r.stops).find((s) => s.state.isCurrent) ?? null;
  const trail = currentStop
    ? [...path.filter((p) => p.y < currentStop.position.y), currentStop.position]
    : [];
  return { height, regions, path, trail, currentStop };
}

/** The grade of a unit, from its mission ids (g7-u3-m2 → 7), or null when they don't say. */
export function getUnitGradeNumber(unit: CurriculumUnit): number | null {
  const match = unit.missions[0]?.id.match(/^g(\d+)-u\d+/);
  return match ? Number(match[1]) : null;
}
