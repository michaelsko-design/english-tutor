import { describe, expect, it } from 'vitest';
import {
  COMPANION_POSES,
  buildThemeArt,
  getCommonArt,
  getLandmarkArt,
  getStoryArt,
  pickCutoutSrc,
} from './themeArt';
import { THEME_REGISTRY } from './themeRegistry';

describe('buildThemeArt', () => {
  it('points every companion pose at the 512px and 256px WebP files of the theme', () => {
    const art = buildThemeArt('neon-pop');
    expect(Object.keys(art.companion)).toEqual(COMPANION_POSES);
    expect(art.companion.cheer).toEqual({
      full: '/art/neon-pop/companion-cheer.webp',
      small: '/art/neon-pop/companion-cheer@256.webp',
    });
  });

  it('has the scene backgrounds for the later phases', () => {
    const art = buildThemeArt('starlight-rpg');
    expect(art.mapBg).toBe('/art/starlight-rpg/map-bg.webp');
    expect(art.homeScene).toBe('/art/starlight-rpg/home-scene.webp');
    expect(art.roomBg).toBe('/art/starlight-rpg/room-bg.webp');
  });

  it('is part of every registered theme', () => {
    Object.values(THEME_REGISTRY).forEach((theme) => {
      expect(theme.art.companion.idle.full).toBe(`/art/${theme.id}/companion-idle.webp`);
    });
  });
});

describe('shared art paths', () => {
  it('names the common pictures, landmarks and story spots', () => {
    expect(getCommonArt('boss-locked')).toEqual({
      full: '/art/common/boss-locked.webp',
      small: '/art/common/boss-locked@256.webp',
    });
    expect(getLandmarkArt(7, 3).full).toBe('/art/landmarks/g7-u3.webp');
    expect(getStoryArt('g7-u3-m2')).toBe('/art/stories/g7-u3-m2.webp');
  });
});

describe('pickCutoutSrc', () => {
  const art = getCommonArt('chest-open');

  it('uses the 256px file when it is sharp enough', () => {
    expect(pickCutoutSrc(art, 64, 3)).toBe(art.small);
    expect(pickCutoutSrc(art, 256, 1)).toBe(art.small);
  });

  it('uses the 512px file for large sizes on dense screens', () => {
    expect(pickCutoutSrc(art, 112, 3)).toBe(art.full);
    expect(pickCutoutSrc(art, 300)).toBe(art.full);
  });

  it('treats a missing or low pixel ratio as 1', () => {
    expect(pickCutoutSrc(art, 200, 0)).toBe(art.small);
  });
});
