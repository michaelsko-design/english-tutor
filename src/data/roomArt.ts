import { ThemeId } from '../types/learner';
import { ROOM_ART, RoomArtSprite } from './roomArtManifest';

/**
 * The themed room pictures (public/art/room/<theme>/<id>.webp, listed in roomArtManifest.ts): which
 * picture an item shows in a theme's room, mirrored or not, and where its body sits inside the picture. A theme or item without a picture returns null, and the scene falls back
 * to the item's emoji icon.
 */

const ART_ROOT = '/art/room';

/** Where the visible object (without its baked shadow) is inside its picture, as shares of it. */
export interface BodyBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface RoomSprite {
  url: string;
  /** Picture width / height */
  aspect: number;
  /** Body bounds as shown: already mirrored when the picture is */
  bounds: BodyBounds;
  /** The picture is shown flipped left to right */
  isMirrored: boolean;
  /**
   * Vertical shear to show it with (pixels down per pixel to the right): a flat wall picture is drawn
   * at a steeper angle than the room's walls, and is sheared so its edges run along the wall. 0 for the rest.
   */
  shear: number;
}

export interface RoomSpriteOptions {
  /** The item stands or hangs against the left wall: pictures are drawn for the right wall, so a wall
   *  picture is mirrored */
  isOnLeftWall?: boolean;
  /** A picture with no second view may be mirrored for the left wall (wall pictures, things on the sill);
   *  a floor item with a baked shadow may not, because its shadow would fall the wrong way */
  canMirror?: boolean;
  /** The picture hangs flat on a wall (a frame, a shelf, the board): its top edge must run along the wall it
   *  hangs on, which is lower to the right on the right wall and lower to the left on the left wall */
  isFlatOnWall?: boolean;
  /** How the wall it hangs on runs, in the scene (pixels down per pixel to the right; see getWallSlope) */
  wallSlope?: number;
}

/** Pictures drawn as a flat slab, whose slope the room mirrors to fit the wall (see isFlatOnWall). */
const SLOPED_WALL_IDS = new Set(['room-picture']);
/** A top edge flatter than this (pixels down per pixel across) fits either wall. */
const FLAT_SLOPE = 0.04;

/** Whether a flat wall picture's slope disagrees with the wall (it was drawn for the other one). */
function slopeFitsWall(slope: number, isOnLeftWall: boolean): boolean {
  if (Math.abs(slope) < FLAT_SLOPE) return true;
  // right wall: lower to the right (positive); left wall: lower to the left (negative)
  return isOnLeftWall ? slope < 0 : slope > 0;
}

/** The picture id of a placed entry: items keep their id, mission objects `object:bed` become `object-bed`. */
export function getArtId(key: string, itemId: string): string {
  return key.startsWith('object:') ? key.replace(':', '-') : itemId;
}

function mirrorBounds(bounds: BodyBounds): BodyBounds {
  return { ...bounds, left: 1 - bounds.right, right: 1 - bounds.left };
}

function boundsOf(sprite: RoomArtSprite): BodyBounds {
  return { left: sprite.left, right: sprite.right, top: sprite.top, bottom: sprite.bottom };
}

export function getRoomSprite(
  themeId: ThemeId | undefined,
  artId: string,
  { isOnLeftWall = false, canMirror = false, isFlatOnWall = false, wallSlope }: RoomSpriteOptions = {}
): RoomSprite | null {
  const pictures = themeId ? ROOM_ART[themeId] : undefined;
  const base = pictures?.[artId];
  if (!themeId || !pictures || !base) return null;
  const followsSlope = isFlatOnWall && SLOPED_WALL_IDS.has(artId);
  const isMirrored = followsSlope ? !slopeFitsWall(base.slope, isOnLeftWall) : isOnLeftWall && canMirror;
  const bounds = boundsOf(base);
  const shownSlope = isMirrored ? -base.slope : base.slope;
  return {
    url: `${ART_ROOT}/${themeId}/${artId}.webp`,
    aspect: base.aspect,
    bounds: isMirrored ? mirrorBounds(bounds) : bounds,
    isMirrored,
    shear: wallSlope !== undefined && followsSlope ? wallSlope - shownSlope : 0,
  };
}
