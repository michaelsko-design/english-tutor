import { describe, expect, it } from 'vitest';
import {
  COMPANION_POSES,
  LIGHT_COMPANION_RIM,
  MAP_PATH_BY_THEME,
  buildThemeArt,
  getCommonArt,
  getLandmarkArt,
  getStoryArt,
  getUnitLandmarkArt,
  pickCutoutSrc,
} from './themeArt';
import { THEME_REGISTRY } from './themeRegistry';
import { grade1Curriculum } from '../data/curriculum/elementary/grade1';

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

  it('has a world map path for the theme, light and glowing on the dark themes', () => {
    expect(buildThemeArt('cozy-studio').mapPath).toBe(MAP_PATH_BY_THEME['cozy-studio']);
    expect(MAP_PATH_BY_THEME['cozy-studio'].glowColor).toBeNull();
    expect(MAP_PATH_BY_THEME['neon-pop'].glowColor).not.toBeNull();
    expect(MAP_PATH_BY_THEME['starlight-rpg'].glowColor).not.toBeNull();
  });

  it('has no companion rim unless the theme asks for one', () => {
    expect(buildThemeArt('cozy-studio').companionRim).toBeNull();
    expect(buildThemeArt('starlight-rpg', { companionRim: LIGHT_COMPANION_RIM }).companionRim).toBe(LIGHT_COMPANION_RIM);
  });

  it('gives Comet a light rim on the dark Stars theme only', () => {
    expect(THEME_REGISTRY['starlight-rpg'].art.companionRim).toBe(LIGHT_COMPANION_RIM);
    expect(THEME_REGISTRY['cozy-studio'].art.companionRim).toBeNull();
    expect(THEME_REGISTRY['neon-pop'].art.companionRim).toBeNull();
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

describe('getUnitLandmarkArt', () => {
  it('names the landmark by the unit number in the mission ids, like the story pictures', () => {
    const units = grade1Curriculum.units;
    expect(getUnitLandmarkArt(1, units[0]).full).toBe('/art/landmarks/g1-u11.webp');
    expect(getUnitLandmarkArt(1, units[5]).full).toBe('/art/landmarks/g1-u16.webp');
    expect(getUnitLandmarkArt(1, units[6]).full).toBe('/art/landmarks/g1-u1.webp');
    expect(getUnitLandmarkArt(1, units[9]).full).toBe('/art/landmarks/g1-u4.webp');
  });

  it('falls back to the unit place when the unit has no mission id to read', () => {
    expect(getUnitLandmarkArt(7, { unitNumber: 3, missions: [] }).full).toBe('/art/landmarks/g7-u3.webp');
    expect(getUnitLandmarkArt(7, { unitNumber: 3, missions: [{ id: 'odd-id' }] }).full).toBe(
      '/art/landmarks/g7-u3.webp'
    );
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
