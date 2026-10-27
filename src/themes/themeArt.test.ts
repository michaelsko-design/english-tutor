import { describe, expect, it } from 'vitest';
import {
  MAP_PATH_BY_THEME,
  buildThemeArt,
  getCommonArt,
  getLandmarkArt,
  getLevelBadgeCentre,
  getStoryArt,
  getUnitLandmarkArt,
  pickCutoutSrc,
} from './themeArt';
import { grade1Curriculum } from '../data/curriculum/elementary/grade1';

const SHARED = { missionArtFolder: null };
const FOCUS = { missionArtFolder: 'focus-desk' };

describe('buildThemeArt', () => {
  it('has the scene backgrounds of the theme', () => {
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
});

describe('mission art paths', () => {
  it('names the shared common pictures, landmarks and story spots', () => {
    expect(getCommonArt(SHARED, 'boss-locked')).toEqual({
      full: '/art/common/boss-locked.webp',
      small: '/art/common/boss-locked@256.webp',
    });
    expect(getLandmarkArt(SHARED, 7, 3).full).toBe('/art/landmarks/g7-u3.webp');
    expect(getStoryArt('g7-u3-m2')).toBe('/art/stories/g7-u3-m2.webp');
  });

  it("puts a theme's own set in its folder", () => {
    expect(getCommonArt(FOCUS, 'chest-open')).toEqual({
      full: '/art/common/focus-desk/chest-open.webp',
      small: '/art/common/focus-desk/chest-open@256.webp',
    });
    expect(getLandmarkArt(FOCUS, 7, 3).small).toBe('/art/landmarks/focus-desk/g7-u3@256.webp');
    expect(getUnitLandmarkArt(FOCUS, 1, grade1Curriculum.units[0]).full).toBe('/art/landmarks/focus-desk/g1-u11.webp');
  });

  it("draws the level number on each set's own badge centre", () => {
    expect(getLevelBadgeCentre(SHARED)).toEqual({ x: 0.495, y: 0.48 });
    expect(getLevelBadgeCentre(FOCUS)).toEqual({ x: 0.5, y: 0.438 });
    expect(getLevelBadgeCentre({ missionArtFolder: 'urban-night' })).toEqual({ x: 0.5, y: 0.5 });
    expect(getLevelBadgeCentre({ missionArtFolder: 'travel-journal' })).toEqual({ x: 0.5, y: 0.5 });
    expect(getLevelBadgeCentre({ missionArtFolder: 'not-measured-yet' })).toEqual(getLevelBadgeCentre(SHARED));
  });
});

describe('getUnitLandmarkArt', () => {
  it('names the landmark by the unit number in the mission ids, like the story pictures', () => {
    const units = grade1Curriculum.units;
    expect(getUnitLandmarkArt(SHARED, 1, units[0]).full).toBe('/art/landmarks/g1-u11.webp');
    expect(getUnitLandmarkArt(SHARED, 1, units[5]).full).toBe('/art/landmarks/g1-u16.webp');
    expect(getUnitLandmarkArt(SHARED, 1, units[6]).full).toBe('/art/landmarks/g1-u1.webp');
    expect(getUnitLandmarkArt(SHARED, 1, units[9]).full).toBe('/art/landmarks/g1-u4.webp');
  });

  it('falls back to the unit place when the unit has no mission id to read', () => {
    expect(getUnitLandmarkArt(SHARED, 7, { unitNumber: 3, missions: [] }).full).toBe('/art/landmarks/g7-u3.webp');
    expect(getUnitLandmarkArt(SHARED, 7, { unitNumber: 3, missions: [{ id: 'odd-id' }] }).full).toBe(
      '/art/landmarks/g7-u3.webp'
    );
  });
});

describe('pickCutoutSrc', () => {
  const art = getCommonArt(SHARED, 'chest-open');

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
