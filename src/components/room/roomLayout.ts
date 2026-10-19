import { RoomObjectId, RoomSlotKind } from '../../data/room';
import { ThemeId } from '../../types/learner';

/** A point in the room scene, as a percentage of its width (x) and height (y). */
export interface ScenePoint {
  x: number;
  y: number;
}

/** Where each slot's item sits in the scene. The wall ends at about 60% height (the room pictures put the floor line at about 72%); the window is at 35-65% across, 14-52% down, the sticker board on the right wall. */
export const SLOT_POSITIONS: Record<string, ScenePoint> = {
  'wall-left': { x: 13, y: 15 },
  'wall-right': { x: 80, y: 13 },
  'board-1': { x: 72.5, y: 30 },
  'board-2': { x: 80, y: 30 },
  'board-3': { x: 87.5, y: 30 },
  shelf: { x: 17, y: 37 },
  'window-sill': { x: 50, y: 49 },
  'desk-top': { x: 62, y: 51 },
  'floor-left': { x: 37, y: 70 },
  'floor-center': { x: 57, y: 79 },
  'floor-right': { x: 80, y: 84 },
};

/** Item emoji size per slot kind (in container-width units): furniture on the floor is bigger. */
export const SLOT_KIND_SIZES: Record<RoomSlotKind, number> = {
  wall: 7,
  board: 6,
  shelf: 6.5,
  desk: 6,
  floor: 9.5,
};

export const OBJECT_POSITIONS: Record<RoomObjectId, ScenePoint> = {
  bed: { x: 14, y: 73 },
  phone: { x: 73, y: 50 },
  wardrobe: { x: 92, y: 45 },
  'games-book': { x: 38, y: 90 },
};

/** Larger emoji for the big mission objects (in container-width units). */
export const OBJECT_SIZES: Record<RoomObjectId, number> = {
  bed: 15,
  phone: 6,
  wardrobe: 14,
  'games-book': 7,
};

export const AVATAR_HOME: ScenePoint = { x: 50, y: 68 };

/** The avatar stands on the floor next to whatever it walks to. */
export function getStandingPoint(target: ScenePoint): ScenePoint {
  const isOnFloor = target.y >= 62;
  const x = isOnFloor ? target.x + (target.x > 50 ? -9 : 9) : target.x;
  return {
    x: Math.min(92, Math.max(8, x)),
    y: Math.min(80, Math.max(66, target.y)),
  };
}

/** Scene colours per theme, so the room matches the rest of the app. */
export interface ScenePalette {
  wallClass: string;
  floorClass: string;
  baseboardClass: string;
  furnitureClass: string;
  windowClass: string;
  windowView: string;
  boardClass: string;
  highlightClass: string;
}

export const SCENE_PALETTES: Record<ThemeId, ScenePalette> = {
  'cozy-studio': {
    wallClass: 'bg-gradient-to-b from-rose-100 via-pink-50 to-amber-50',
    floorClass: 'bg-gradient-to-b from-amber-200 to-orange-200',
    baseboardClass: 'bg-amber-700/35',
    furnitureClass: 'bg-amber-800/55 border-amber-900/30',
    windowClass: 'bg-gradient-to-b from-sky-300 to-sky-100 border-white',
    windowView: '☁️',
    boardClass: 'bg-amber-300/80 border-amber-700/40',
    highlightClass: 'border-fuchsia-500 bg-fuchsia-400/25',
  },
  'neon-pop': {
    wallClass: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900',
    floorClass: 'bg-gradient-to-b from-fuchsia-950 to-slate-950',
    baseboardClass: 'bg-cyan-400/40',
    furnitureClass: 'bg-cyan-500/25 border-cyan-300/60',
    windowClass: 'bg-gradient-to-b from-indigo-950 to-fuchsia-900 border-cyan-400/70',
    windowView: '🌃',
    boardClass: 'bg-fuchsia-900/60 border-fuchsia-400/60',
    highlightClass: 'border-cyan-300 bg-cyan-400/25',
  },
  'starlight-rpg': {
    wallClass: 'bg-gradient-to-b from-indigo-950 via-violet-900 to-indigo-900',
    floorClass: 'bg-gradient-to-b from-indigo-950 to-slate-950',
    baseboardClass: 'bg-amber-300/40',
    furnitureClass: 'bg-amber-300/25 border-amber-200/50',
    windowClass: 'bg-gradient-to-b from-slate-950 to-indigo-900 border-amber-300/70',
    windowView: '🌙',
    boardClass: 'bg-violet-800/70 border-amber-300/50',
    highlightClass: 'border-amber-300 bg-amber-300/25',
  },
};
