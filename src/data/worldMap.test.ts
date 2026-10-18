import { describe, expect, it } from 'vitest';
import {
  MAP_BANNER_HEIGHT,
  MAP_STOP_CLEARANCE,
  buildWorldMap,
  clipPathByY,
  getLandmarkPlacement,
  getMapStopStates,
  getPathXAtY,
  getPointAlongPath,
  getRegionFrames,
  getStopPositions,
  getUnitGradeNumber,
  placeOnRegion,
  sampleCenterline,
} from './worldMap';
import { CURRICULUM_BY_GRADE, CurriculumUnit, MissionNode } from './curriculum';
import { MAP_BG_ASPECT, MAP_PATH_BY_THEME, MapPoint } from '../themes/themeArt';

const makeMission = (unitNumber: number, missionNumber: number, isBoss = false): MissionNode =>
  ({
    id: `g4-u${unitNumber}-m${missionNumber}`,
    unitNumber,
    missionNumber,
    ...(isBoss ? { isBoss: true } : {}),
  }) as MissionNode;

const makeUnit = (unitNumber: number): CurriculumUnit =>
  ({
    unitNumber,
    missions: [makeMission(unitNumber, 1), makeMission(unitNumber, 2), makeMission(unitNumber, 3, true)],
  }) as CurriculumUnit;

const UNITS = [makeUnit(1), makeUnit(2)];
const STRAIGHT: MapPoint[] = [
  { x: 0.5, y: 0 },
  { x: 0.5, y: 1 },
];
const ZIGZAG: MapPoint[] = [
  { x: 0.5, y: 0 },
  { x: 0.3, y: 0.25 },
  { x: 0.7, y: 0.75 },
  { x: 0.5, y: 1 },
];

describe('sampleCenterline', () => {
  it('passes through every centerline point and ends on the last one', () => {
    const samples = sampleCenterline(ZIGZAG, 4);

    expect(samples).toHaveLength((ZIGZAG.length - 1) * 4 + 1);
    ZIGZAG.forEach((point, i) => {
      expect(samples[i * 4].x).toBeCloseTo(point.x);
      expect(samples[i * 4].y).toBeCloseTo(point.y);
    });
  });

  it('stays a straight line for a straight centerline', () => {
    sampleCenterline(STRAIGHT, 6).forEach((p) => expect(p.x).toBeCloseTo(0.5));
  });

  it('keeps every theme path inside the map and running downwards', () => {
    Object.values(MAP_PATH_BY_THEME).forEach(({ centerline }) => {
      const samples = sampleCenterline(centerline);
      samples.forEach((p) => {
        expect(p.x).toBeGreaterThan(0.25);
        expect(p.x).toBeLessThan(0.75);
      });
      samples.slice(1).forEach((p, i) => expect(p.y).toBeGreaterThanOrEqual(samples[i].y - 1e-9));
    });
  });
});

describe('getRegionFrames', () => {
  it('stacks one background per unit under half a banner of space', () => {
    const { frames, height } = getRegionFrames(3, 2);

    expect(frames.map((f) => f.top)).toEqual([MAP_BANNER_HEIGHT / 2, MAP_BANNER_HEIGHT / 2 + 2, MAP_BANNER_HEIGHT / 2 + 4]);
    expect(frames.every((f) => f.height === 2)).toBe(true);
    expect(height).toBeCloseTo(MAP_BANNER_HEIGHT / 2 + 6);
  });

  it('centres each banner on the top edge of its region, covering the join', () => {
    const { frames } = getRegionFrames(2, 2);

    expect(frames[0].bannerTop).toBe(0);
    expect(frames[1].bannerTop + MAP_BANNER_HEIGHT / 2).toBeCloseTo(frames[0].top + frames[0].height);
  });
});

describe('path helpers', () => {
  const path: MapPoint[] = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  it('finds the point a share of the way along by length', () => {
    expect(getPointAlongPath(path, 0)).toEqual({ x: 0, y: 0 });
    expect(getPointAlongPath(path, 0.25)).toEqual({ x: 0, y: 0.5 });
    expect(getPointAlongPath(path, 0.75)).toEqual({ x: 0.5, y: 1 });
    expect(getPointAlongPath(path, 1)).toEqual({ x: 1, y: 1 });
  });

  it('cuts a path to a band of heights, adding the crossing points', () => {
    const clipped = clipPathByY(
      [
        { x: 0, y: 0 },
        { x: 0, y: 2 },
        { x: 1, y: 4 },
      ],
      1,
      3
    );

    expect(clipped).toEqual([
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0.5, y: 3 },
    ]);
  });

  it('reads the x of the path at a height', () => {
    const zig = [
      { x: 0.2, y: 0 },
      { x: 0.6, y: 1 },
    ];
    expect(getPathXAtY(zig, 0.5)).toBeCloseTo(0.4);
    expect(getPathXAtY(zig, 5)).toBe(0.6);
  });
});

describe('getStopPositions', () => {
  const frame = { top: 1, height: 2, bannerTop: 1 - MAP_BANNER_HEIGHT / 2 };
  const regionPath = placeOnRegion(sampleCenterline(STRAIGHT), frame);

  it('spaces the stops evenly on the path, clear of both banners', () => {
    const stops = getStopPositions(regionPath, frame, 3);
    const first = frame.top + MAP_BANNER_HEIGHT / 2 + MAP_STOP_CLEARANCE;
    const last = frame.top + frame.height - MAP_BANNER_HEIGHT / 2 - MAP_STOP_CLEARANCE;
    const share = (last - first) / 3;

    expect(stops.map((s) => s.x)).toEqual([0.5, 0.5, 0.5]);
    stops.forEach((s, i) => expect(s.y).toBeCloseTo(first + share * (i + 0.5)));
  });

  it('puts every stop on the winding path of a real theme', () => {
    const samples = sampleCenterline(MAP_PATH_BY_THEME['neon-pop'].centerline);
    const placed = placeOnRegion(samples, frame);

    getStopPositions(placed, frame, 3).forEach((stop) => {
      expect(stop.x).toBeCloseTo(getPathXAtY(placed, stop.y), 2);
    });
  });
});

describe('getLandmarkPlacement', () => {
  const frame = { top: 0, height: 1, bannerTop: 0 };

  it('goes between the first two stops, on the side away from the path', () => {
    const leftPath = [
      { x: 0.35, y: 0 },
      { x: 0.35, y: 1 },
    ];
    const stops = [
      { x: 0.35, y: 0.2 },
      { x: 0.35, y: 0.6 },
    ];

    const landmark = getLandmarkPlacement(leftPath, frame, stops);

    expect(landmark.side).toBe('right');
    expect(landmark.position.y).toBeCloseTo(0.4);
    expect(landmark.position.x).toBeGreaterThan(0.5);
  });

  it('goes left when the path bends right', () => {
    const rightPath = [
      { x: 0.6, y: 0 },
      { x: 0.6, y: 1 },
    ];

    expect(getLandmarkPlacement(rightPath, frame, []).side).toBe('left');
  });
});

describe('getMapStopStates', () => {
  it('opens only the first mission at the start, with the companion on it', () => {
    const [unit1, unit2] = getMapStopStates(UNITS, {});

    expect(unit1.map((s) => s.status)).toEqual(['open', 'locked', 'locked']);
    expect(unit1.map((s) => s.isCurrent)).toEqual([true, false, false]);
    expect(unit2.every((s) => s.status === 'locked')).toBe(true);
  });

  it('marks stars and moves the companion to the next mission', () => {
    const [unit1] = getMapStopStates(UNITS, { 'g4-u1-m1': 2 });

    expect(unit1[0]).toMatchObject({ status: 'done', stars: 2, isCurrent: false });
    expect(unit1[1]).toMatchObject({ status: 'open', isCurrent: true });
  });

  it('keeps the Boss locked behind its star gate and sends the companion to the weakest mission', () => {
    const [unit1] = getMapStopStates(UNITS, { 'g4-u1-m1': 2, 'g4-u1-m2': 1 });
    const boss = unit1[2];

    expect(boss.status).toBe('locked');
    expect(boss.bossGate).toEqual({ required: 4, earned: 3, missing: 1, isMet: false });
    expect(unit1[1].isCurrent).toBe(true);
    expect(unit1[0].bossGate).toBeNull();
  });

  it('opens the Boss once the gate is met', () => {
    const [unit1] = getMapStopStates(UNITS, { 'g4-u1-m1': 3, 'g4-u1-m2': 1 });

    expect(unit1[2]).toMatchObject({ status: 'open', isCurrent: true });
    expect(unit1[2].bossGate?.isMet).toBe(true);
  });

  it('handles a grade with no units', () => {
    expect(getMapStopStates([], {})).toEqual([]);
  });
});

describe('buildWorldMap', () => {
  it('lays out every unit of a real grade with its stops, landmark and path', () => {
    const units = CURRICULUM_BY_GRADE['grade-7'].units;
    const map = buildWorldMap(units, {}, MAP_PATH_BY_THEME['cozy-studio'].centerline, MAP_BG_ASPECT);

    expect(map.regions).toHaveLength(units.length);
    map.regions.forEach((region, i) => {
      expect(region.stops).toHaveLength(units[i].missions.length);
      region.stops.forEach((stop) => {
        expect(stop.position.y).toBeGreaterThan(region.top + MAP_BANNER_HEIGHT / 2);
        expect(stop.position.y).toBeLessThan(region.top + region.height - MAP_BANNER_HEIGHT / 2);
      });
    });
    expect(map.height).toBeCloseTo(MAP_BANNER_HEIGHT / 2 + units.length * MAP_BG_ASPECT);
    expect(map.path[0].y).toBeCloseTo(MAP_BANNER_HEIGHT / 2);
    expect(map.path[map.path.length - 1].y).toBeCloseTo(map.height);
  });

  it('draws the walked trail from the top to the current stop', () => {
    const map = buildWorldMap(UNITS, { 'g4-u1-m1': 3, 'g4-u1-m2': 3 }, STRAIGHT, 2);
    const current = map.currentStop;

    expect(current?.state.mission.id).toBe('g4-u1-m3');
    expect(map.trail[map.trail.length - 1]).toEqual(current?.position);
    expect(map.trail.every((p) => p.y <= (current?.position.y ?? 0))).toBe(true);
  });
});

describe('getUnitGradeNumber', () => {
  it('reads the grade from the mission ids', () => {
    expect(getUnitGradeNumber(CURRICULUM_BY_GRADE['grade-11'].units[0])).toBe(11);
    expect(getUnitGradeNumber({ missions: [] } as unknown as CurriculumUnit)).toBeNull();
  });
});
