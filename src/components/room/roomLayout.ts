import { RoomSlotKind } from '../../data/room';
import { RoomSprite, getRoomSprite } from '../../data/roomArt';
import { LEGACY_GEOMETRY, RoomGeometry, ShelfLine, floorEdgeY } from '../../data/roomGeometry';
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
  /** How far along the picture's width the point is (0-1); the middle unless the body is drawn off-centre */
  anchorX?: number;
  /** The picture is drawn flipped left to right, so its edges run along the wall it hangs on */
  isMirrored?: boolean;
}

/** The furniture hangs on the right wall: a slab drawn for the other wall is flipped. */
const WALL_FURNITURE_OPTIONS = { isOnLeftWall: false, canMirror: true, isFlatOnWall: true };

export const FURNITURE_PIECES: FurniturePiece[] = [
  { id: 'shelf-high', src: '/art/room/shelf-short.webp', x: 17, y: 30, width: 24, anchorY: 0.25 },
  { id: 'shelf-low', src: '/art/room/shelf-long.webp', x: 17, y: 43, width: 24, anchorY: 0.25 },
  { id: 'window-sill', src: '/art/room/sill.webp', x: 45, y: 52, width: 22, anchorY: 0.2 },
  { id: 'board', src: '/art/room/board.webp', x: 80, y: 30, width: 22, anchorY: 0.5 },
];

/** The furniture a theme's room shows: its own pictures on the shelf lines, the sill and the board of its geometry. */
export function getFurniturePieces(geometry: RoomGeometry, themeId?: ThemeId): FurniturePiece[] {
  if (geometry.isLegacy) return FURNITURE_PIECES;
  // The room pictures already draw the window ledge items stand on, so no extra sill is drawn over them
  const shelves = geometry.shelves.filter((shelf) => shelf.id !== 'window-sill').map((shelf) => {
    const art = ART_IDS[shelf.id];
    const sprite = getRoomSprite(themeId, art, WALL_FURNITURE_OPTIONS);
    const span = (shelf.xMax - shelf.xMin) * SPRITE_WIDTH_OF_SHELF;
    const piece = { id: shelf.id, x: (shelf.xMin + shelf.xMax) / 2, y: shelf.y };
    if (sprite) return { ...piece, ...fitSprite(sprite, span, SURFACE_FROM_BODY_TOP) };
    return { ...piece, src: LEGACY_SHELF_SRC[shelf.id], width: span * LEGACY_SPRITE_EXTRA, anchorY: LEGACY_SHELF_ANCHOR[shelf.id] };
  });
  const { board } = geometry;
  const boardSprite = getRoomSprite(themeId, ART_IDS.board, WALL_FURNITURE_OPTIONS);
  const boardSpan = (board.xMax - board.xMin) * SPRITE_WIDTH_OF_BOARD;
  const boardPiece = { id: 'board', x: (board.xMin + board.xMax) / 2, y: (board.yMin + board.yMax) / 2 };
  return [
    ...shelves,
    boardSprite
      ? { ...boardPiece, ...fitSprite(boardSprite, boardSpan, 0.5) }
      : { ...boardPiece, src: '/art/room/board.webp', width: boardSpan, anchorY: 0.5 },
  ];
}

/** The picture ids of the furniture, in public/art/room/<theme>/. */
const ART_IDS = {
  'shelf-high': 'furniture-shelf-high',
  'shelf-low': 'furniture-shelf-low',
  'window-sill': 'furniture-sill',
  board: 'furniture-board',
} as const;
const LEGACY_SHELF_SRC: Record<ShelfLine['id'], string> = {
  'shelf-high': '/art/room/shelf-short.webp',
  'shelf-low': '/art/room/shelf-long.webp',
  'window-sill': '/art/room/sill.webp',
};
const LEGACY_SHELF_ANCHOR: Record<ShelfLine['id'], number> = { 'shelf-high': 0.25, 'shelf-low': 0.25, 'window-sill': 0.2 };
/** The old pictures were drawn wider than the stretch they cover (a fallback only). */
const LEGACY_SPRITE_EXTRA = 1.13;
/** The line items stand on is this share of the body's height below its top edge (the middle of a plank's top face). */
const SURFACE_FROM_BODY_TOP = 0.22;

/** The picture's width so that its body is `bodyWidth` wide, and where the anchor point sits in it. */
function fitSprite(sprite: RoomSprite, bodyWidth: number, anchorFromBodyTop: number) {
  const { bounds } = sprite;
  return {
    src: sprite.url,
    isMirrored: sprite.isMirrored,
    width: bodyWidth / (bounds.right - bounds.left),
    anchorX: (bounds.left + bounds.right) / 2,
    anchorY: bounds.top + anchorFromBodyTop * (bounds.bottom - bounds.top),
  };
}

/** A sprite is drawn a bit wider than the stretch of surface items can stand on. */
const SPRITE_WIDTH_OF_SHELF = 1.15;
const SPRITE_WIDTH_OF_BOARD = 1.15;

/** Kinds whose items stand on their surface (anchored at their feet); the others hang. */
export const STANDING_KINDS: RoomSlotKind[] = ['shelf', 'desk', 'floor'];

export const AVATAR_HOME: ScenePoint = LEGACY_GEOMETRY.avatarHome;

const AVATAR_BESIDE_ITEM = 9;
const AVATAR_BELOW_WALL_ITEM = 10;
const AVATAR_FROM_BASEBOARD = 4;

/** The avatar stands on the floor next to whatever it walks to. */
export function getStandingPoint(target: ScenePoint, geometry: RoomGeometry = LEGACY_GEOMETRY): ScenePoint {
  if (geometry.isLegacy) {
    const isOnFloor = target.y >= 62;
    const x = isOnFloor ? target.x + (target.x > 50 ? -9 : 9) : target.x;
    return { x: Math.min(92, Math.max(8, x)), y: Math.min(80, Math.max(66, target.y)) };
  }
  const isOnFloor = target.y >= floorEdgeY(geometry, target.x);
  const beside = target.x + (target.x > geometry.cornerX ? -AVATAR_BESIDE_ITEM : AVATAR_BESIDE_ITEM);
  const x = Math.min(92, Math.max(8, isOnFloor ? beside : target.x));
  const baseboard = floorEdgeY(geometry, x);
  const wanted = isOnFloor ? target.y : baseboard + AVATAR_BELOW_WALL_ITEM;
  return { x, y: Math.min(geometry.floorMaxY - 2, Math.max(baseboard + AVATAR_FROM_BASEBOARD, wanted)) };
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
  /** The same colours for a drawn (SVG) zone outline, like the floor's */
  outlineClass: string;
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
    outlineClass: 'stroke-fuchsia-500 fill-fuchsia-400/25',
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
    outlineClass: 'stroke-cyan-300 fill-cyan-400/25',
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
    outlineClass: 'stroke-amber-300 fill-amber-300/25',
  },
  'focus-desk': {
    wallClass: 'bg-gradient-to-b from-stone-100 to-[#f6f4ef]',
    floorClass: 'bg-gradient-to-b from-stone-300 to-stone-400',
    baseboardClass: 'bg-slate-700/30',
    furnitureClass: 'bg-slate-600/45 border-slate-800/30',
    windowClass: 'bg-gradient-to-b from-sky-200 to-sky-50 border-white',
    windowView: '🏙️',
    boardClass: 'bg-white/90 border-slate-400/50',
    highlightClass: 'border-teal-600 bg-teal-400/20',
    outlineClass: 'stroke-teal-600 fill-teal-400/20',
  },
  'urban-night': {
    wallClass: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-800',
    floorClass: 'bg-gradient-to-b from-zinc-700 to-zinc-900',
    baseboardClass: 'bg-lime-400/35',
    furnitureClass: 'bg-zinc-600/50 border-zinc-400/40',
    windowClass: 'bg-gradient-to-b from-indigo-950 to-zinc-900 border-lime-400/60',
    windowView: '🌆',
    boardClass: 'bg-zinc-700/70 border-lime-400/50',
    highlightClass: 'border-lime-300 bg-lime-400/20',
    outlineClass: 'stroke-lime-300 fill-lime-400/20',
  },
  'travel-journal': {
    wallClass: 'bg-gradient-to-b from-[#f3ead8] to-[#e8dcc2]',
    floorClass: 'bg-gradient-to-b from-amber-700/40 to-amber-800/50',
    baseboardClass: 'bg-[#1e3a5f]/30',
    furnitureClass: 'bg-amber-900/45 border-amber-950/30',
    windowClass: 'bg-gradient-to-b from-sky-300 to-amber-50 border-[#fffaf0]',
    windowView: '⛰️',
    boardClass: 'bg-[#fffaf0]/90 border-[#5b6b3a]/50',
    highlightClass: 'border-[#1e3a5f] bg-[#1e3a5f]/15',
    outlineClass: 'stroke-[#1e3a5f] fill-[#1e3a5f]/15',
  },
};
