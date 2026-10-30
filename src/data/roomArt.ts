import { ThemeId } from '../types/learner';
import { ROOM_ART, RoomArtSprite } from './roomArtManifest';

/**
 * The themed room pictures (public/art/room/<theme>/<id>.webp, listed in roomArtManifest.ts): which
 * picture an item or piece of furniture shows in a theme's room, mirrored or not, and where its body
 * sits inside the picture. A theme or item without a picture returns null, and the scene falls back
 * to the item's emoji icon.
 */

const ART_ROOT = '/art/room';
/** The second view of a big item, drawn the other way round (with its shadow on the right side). */
const OTHER_VIEW_SUFFIX = '-b';

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
}

export interface RoomSpriteOptions {
  /** The item stands or hangs against the left wall: pictures are drawn for the right wall, so a big item
   *  shows its second view and a wall picture is mirrored */
  isOnLeftWall?: boolean;
  /** A picture with no second view may be mirrored for the left wall (wall pictures, things on the sill);
   *  a floor item with a baked shadow may not, because its shadow would fall the wrong way */
  canMirror?: boolean;
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
  { isOnLeftWall = false, canMirror = false }: RoomSpriteOptions = {}
): RoomSprite | null {
  const pictures = themeId ? ROOM_ART[themeId] : undefined;
  const base = pictures?.[artId];
  if (!themeId || !pictures || !base) return null;
  const otherView = isOnLeftWall ? pictures[`${artId}${OTHER_VIEW_SUFFIX}`] : undefined;
  const chosen = otherView ?? base;
  const chosenId = otherView ? `${artId}${OTHER_VIEW_SUFFIX}` : artId;
  const isMirrored = isOnLeftWall && !otherView && canMirror;
  const bounds = boundsOf(chosen);
  return {
    url: `${ART_ROOT}/${themeId}/${chosenId}.webp`,
    aspect: chosen.aspect,
    bounds: isMirrored ? mirrorBounds(bounds) : bounds,
    isMirrored,
  };
}

/** What the desk top needs to know about the desk picture (see getDeskTopPoint). */
export interface DeskShape {
  /** Picture height / width of the desk's body */
  heightOverWidth: number;
  /** How far up the picture, from the feet, the middle of the desk top is, as a share of the picture's height */
  topAboveFeet: number;
}

/** The first desk picture (and its default): 264 x 153, the top line 30% from the top. */
export const LEGACY_DESK_SHAPE: DeskShape = { heightOverWidth: 153 / 264, topAboveFeet: 0.7 };

/** The middle of a desk top is this share of the body's height below the body's top edge. */
const DESK_TOP_FROM_BODY_TOP = 0.22;

export function getDeskShape(themeId: ThemeId | undefined): DeskShape {
  const desk = themeId ? ROOM_ART[themeId]?.['object-desk'] : undefined;
  if (!desk) return LEGACY_DESK_SHAPE;
  const bodyWidth = desk.right - desk.left;
  const bodyHeight = desk.bottom - desk.top;
  return {
    heightOverWidth: 1 / (bodyWidth * desk.aspect),
    topAboveFeet: desk.bottom - (desk.top + DESK_TOP_FROM_BODY_TOP * bodyHeight),
  };
}
