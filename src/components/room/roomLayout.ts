import { RoomSlotKind } from '../../data/room';
import { ThemeId } from '../../types/learner';

import type { ScenePoint } from '../../data/roomPlacement';

export type { ScenePoint };

/** Hebrew names of the surfaces, for screen readers and hints. */
export const SURFACE_LABELS_HE: Record<string, string> = {
  'wall-left': 'הקיר משמאל',
  'wall-right': 'הקיר מימין',
  board: 'לוח המדבקות',
  'shelf-high': 'המדף העליון',
  'shelf-low': 'המדף התחתון',
  'window-sill': 'אדן החלון',
  'desk-top': 'השולחן',
  floor: 'הרצפה',
};

/**
 * A drawn piece of furniture (public/art/room). `x`, `y` are the scene point where items stand on
 * it (the middle of its top edge); `anchorY` is how far down the picture that line is (0-1).
 */
export interface FurniturePiece {
  id: string;
  src: string;
  x: number;
  y: number;
  /** Width in container-width units */
  width: number;
  anchorY: number;
}

export const FURNITURE_PIECES: FurniturePiece[] = [
  { id: 'shelf-high', src: '/art/room/shelf-short.webp', x: 17, y: 30, width: 24, anchorY: 0.25 },
  { id: 'shelf-low', src: '/art/room/shelf-long.webp', x: 17, y: 43, width: 24, anchorY: 0.25 },
  { id: 'window-sill', src: '/art/room/sill.webp', x: 45, y: 52, width: 22, anchorY: 0.2 },
  { id: 'board', src: '/art/room/board.webp', x: 80, y: 30, width: 22, anchorY: 0.5 },
];

/** Kinds whose items stand on their surface (anchored at their feet); the others hang. */
export const STANDING_KINDS: RoomSlotKind[] = ['shelf', 'desk', 'floor'];

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
