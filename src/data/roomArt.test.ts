import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LEGACY_DESK_SHAPE, getArtId, getDeskShape, getRoomSprite } from './roomArt';
import { ROOM_ART } from './roomArtManifest';

const THEMES = Object.keys(ROOM_ART);
const PICTURES_PER_THEME = 38;

describe('the themed room pictures', () => {
  it('has the same 38 pictures for each of the six themes', () => {
    expect(THEMES).toHaveLength(6);
    const first = Object.keys(ROOM_ART[THEMES[0]]).sort();
    expect(first).toHaveLength(PICTURES_PER_THEME);
    THEMES.forEach((theme) => expect(Object.keys(ROOM_ART[theme]).sort(), theme).toEqual(first));
  });

  it('draws the bed and the desk the right way for each wall: against the right wall, the left one, never both alike', () => {
    THEMES.forEach((theme) =>
      ['object-bed', 'object-desk'].forEach((id) => {
        expect(ROOM_ART[theme][id].slope, `${theme}/${id}`).toBeLessThan(-0.1);
        expect(ROOM_ART[theme][`${id}-b`].slope, `${theme}/${id}-b`).toBeGreaterThan(0.1);
      })
    );
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

  it('returns null for a missing theme or item, so the emoji icon shows', () => {
    expect(getRoomSprite(undefined, 'room-sofa')).toBeNull();
    expect(getRoomSprite('neon-pop', 'room-not-drawn')).toBeNull();
  });

  it('shows the left-wall view of a big item on the left wall, not a mirror of the right-wall one', () => {
    const left = getRoomSprite('cozy-studio', 'room-sofa', { isOnLeftWall: true });
    expect(left?.url).toBe('/art/room/cozy-studio/room-sofa-b.webp');
    expect(left?.isMirrored).toBe(false);
    expect(getRoomSprite('cozy-studio', 'room-sofa')?.url).toBe('/art/room/cozy-studio/room-sofa.webp');
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
      ['furniture-shelf-high', 'furniture-shelf-low', 'furniture-board', 'room-picture'].forEach((id) => {
        const { slope } = ROOM_ART[theme][id];
        const onRight = getRoomSprite(theme as never, id, flat)!;
        const onLeft = getRoomSprite(theme as never, id, { ...flat, isOnLeftWall: true })!;
        if (Math.abs(slope) < 0.04) return;
        expect(onRight.isMirrored, `${theme}/${id} right wall`).toBe(slope < 0);
        expect(onLeft.isMirrored, `${theme}/${id} left wall`).toBe(slope > 0);
      })
    );
  });

  it('does not mirror what may not be mirrored: a baked shadow would fall the wrong way', () => {
    expect(getRoomSprite('cozy-studio', 'room-teddy', { isOnLeftWall: true })?.isMirrored).toBe(false);
    expect(getRoomSprite('cozy-studio', 'room-teddy', { isOnLeftWall: true, canMirror: true })?.isMirrored).toBe(true);
  });

  it('names mission objects by their key', () => {
    expect(getArtId('object:bed', 'bed')).toBe('object-bed');
    expect(getArtId('room-sofa', 'room-sofa')).toBe('room-sofa');
  });
});

describe('getDeskShape', () => {
  it('is the first desk picture without art', () => {
    expect(getDeskShape(undefined)).toBe(LEGACY_DESK_SHAPE);
  });

  it('puts the desk top between the feet and the top of the picture, for every theme', () => {
    THEMES.forEach((theme) => {
      const shape = getDeskShape(theme as Parameters<typeof getDeskShape>[0]);
      expect(shape.topAboveFeet, theme).toBeGreaterThan(0.4);
      expect(shape.topAboveFeet, theme).toBeLessThan(1);
      expect(shape.heightOverWidth, theme).toBeGreaterThan(0.3);
    });
  });

  it('keeps things on the slanted desk top away from its corners, where a level line runs off it', () => {
    THEMES.forEach((theme) => {
      const shape = getDeskShape(theme as Parameters<typeof getDeskShape>[0]);
      expect(shape.topHalfWidthShare, theme).toBeLessThan(0.25);
      expect(shape.topHalfWidthShare, theme).toBeGreaterThan(0.1);
    });
  });
});
