import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getArtId, getRoomSprite } from './roomArt';
import { ROOM_ART } from './roomArtManifest';

const THEMES = Object.keys(ROOM_ART);
const PICTURES_PER_THEME = 26;

describe('the themed room pictures', () => {
  it('has the same 26 pictures for each of the six themes', () => {
    expect(THEMES).toHaveLength(6);
    const first = Object.keys(ROOM_ART[THEMES[0]]).sort();
    expect(first).toHaveLength(PICTURES_PER_THEME);
    THEMES.forEach((theme) => expect(Object.keys(ROOM_ART[theme]).sort(), theme).toEqual(first));
  });

  it('draws the sofa and armchair facing the viewer, level, and has no pictures of the bed, wardrobe, desk or shelves (they are in the room picture)', () => {
    THEMES.forEach((theme) => {
      ['room-sofa', 'room-chair'].forEach((id) => expect(ROOM_ART[theme][id].slope, `${theme}/${id}`).toBe(0));
      Object.keys(ROOM_ART[theme]).forEach((id) => {
        expect(id, theme).not.toMatch(/^(object-(bed|wardrobe|desk)|furniture-)/);
        expect(id, theme).not.toMatch(/-b$/);
      });
    });
  });

  it('shows the sofa as drawn, without slanting it, against either wall', () => {
    expect(getRoomSprite('travel-journal', 'room-sofa', { wallSlope: 0.2 })!.shear).toBe(0);
    expect(getRoomSprite('travel-journal', 'room-sofa', { isOnLeftWall: true, wallSlope: -0.2 })!.isMirrored).toBe(false);
  });

  it('has a file for every picture, with sane body bounds', () => {
    THEMES.forEach((theme) =>
      Object.entries(ROOM_ART[theme]).forEach(([id, sprite]) => {
        expect(existsSync(join(process.cwd(), 'public', 'art', 'room', theme, `${id}.webp`)), `${theme}/${id}`).toBe(true);
        expect(sprite.aspect, `${theme}/${id}`).toBeGreaterThan(0.2);
        expect(sprite.aspect, `${theme}/${id}`).toBeLessThan(5);
        expect(sprite.right - sprite.left, `${theme}/${id}`).toBeGreaterThan(0.25);
        expect(sprite.bottom - sprite.top, `${theme}/${id}`).toBeGreaterThan(0.25);
        [sprite.left, sprite.right, sprite.top, sprite.bottom].forEach((share) => {
          expect(share).toBeGreaterThanOrEqual(0);
          expect(share).toBeLessThanOrEqual(1);
        });
      })
    );
  });
});

describe('getRoomSprite', () => {
  it('gives the theme its own picture', () => {
    const sprite = getRoomSprite('neon-pop', 'room-sofa');
    expect(sprite?.url).toBe('/art/room/neon-pop/room-sofa.webp');
    expect(sprite?.isMirrored).toBe(false);
  });

  it('returns null for an item without a picture, so the emoji icon shows', () => {
    expect(getRoomSprite('neon-pop', 'room-not-drawn')).toBeNull();
  });

  it("shows Cozy Studio's pictures for a missing or unknown theme, like its room", () => {
    expect(getRoomSprite(undefined, 'room-sofa')?.url).toBe('/art/room/cozy-studio/room-sofa.webp');
    expect(getRoomSprite('old-theme' as never, 'room-sofa')?.url).toBe('/art/room/cozy-studio/room-sofa.webp');
  });

  it('mirrors a wall picture on the left wall, with its body bounds mirrored too', () => {
    const right = getRoomSprite('cozy-studio', 'room-clock')!;
    const left = getRoomSprite('cozy-studio', 'room-clock', { isOnLeftWall: true, canMirror: true })!;
    expect(left.isMirrored).toBe(true);
    expect(left.bounds.left).toBeCloseTo(1 - right.bounds.right);
    expect(left.bounds.right).toBeCloseTo(1 - right.bounds.left);
    expect(left.bounds.bottom).toBe(right.bounds.bottom);
  });

  it('turns a flat wall picture so its top edge runs lower to the right on the right wall and lower to the left on the left wall', () => {
    const flat = { isFlatOnWall: true, canMirror: true };
    THEMES.forEach((theme) =>
      ['room-picture'].forEach((id) => {
        const { slope } = ROOM_ART[theme][id];
        const onRight = getRoomSprite(theme as never, id, flat)!;
        const onLeft = getRoomSprite(theme as never, id, { ...flat, isOnLeftWall: true })!;
        if (Math.abs(slope) < 0.04) return;
        expect(onRight.isMirrored, `${theme}/${id} right wall`).toBe(slope < 0);
        expect(onLeft.isMirrored, `${theme}/${id} left wall`).toBe(slope > 0);
      })
    );
  });

  it('shears a flat wall picture so its top edge runs exactly along the wall, and leaves other pictures alone', () => {
    const wallSlope = 0.17;
    THEMES.forEach((theme) => {
      const picture = getRoomSprite(theme as never, 'room-picture', { isFlatOnWall: true, canMirror: true, wallSlope })!;
      const shownSlope = (picture.isMirrored ? -1 : 1) * ROOM_ART[theme]['room-picture'].slope;
      expect(shownSlope + picture.shear, theme).toBeCloseTo(wallSlope);
    });
    expect(getRoomSprite('cozy-studio', 'room-teddy', { wallSlope })!.shear).toBe(0);
  });

  it('does not mirror what may not be mirrored: a baked shadow would fall the wrong way', () => {
    expect(getRoomSprite('cozy-studio', 'room-teddy', { isOnLeftWall: true })?.isMirrored).toBe(false);
    expect(getRoomSprite('cozy-studio', 'room-teddy', { isOnLeftWall: true, canMirror: true })?.isMirrored).toBe(true);
  });

  it('names mission objects by their key', () => {
    expect(getArtId('object:phone', 'phone')).toBe('object-phone');
    expect(getArtId('room-sofa', 'room-sofa')).toBe('room-sofa');
  });
});
