import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { COMPANION_POSES } from './themeArt';
import {
  COMPANION_IDS,
  COMPANION_REGISTRY,
  LIGHT_COMPANION_RIM,
  getCompanion,
  getCompanionRim,
  getPickableCompanionIds,
  isCompanionId,
} from './companionRegistry';
import { getPickableThemeIds, resolveTheme, THEME_BASES, THEME_IDS } from './themeRegistry';

describe('companion registry', () => {
  it('points every pose at the 512px and 256px WebP files', () => {
    const djBeat = COMPANION_REGISTRY['dj-beat'];
    expect(Object.keys(djBeat.art)).toEqual(COMPANION_POSES);
    expect(djBeat.art.cheer).toEqual({
      full: '/art/neon-pop/companion-cheer.webp',
      small: '/art/neon-pop/companion-cheer@256.webp',
    });
  });

  it('keeps the first three mascots in their old theme folders', () => {
    expect(COMPANION_REGISTRY.mochi.art.idle.full).toBe('/art/cozy-studio/companion-idle.webp');
    expect(COMPANION_REGISTRY.comet.art.idle.full).toBe('/art/starlight-rpg/companion-idle.webp');
  });

  it('falls back for a missing or unknown id', () => {
    expect(getCompanion(undefined).id).toBe('mochi');
    expect(getCompanion('no-such-mascot', 'comet').id).toBe('comet');
    expect(getCompanion('dj-beat', 'comet').id).toBe('dj-beat');
    expect(isCompanionId('toString')).toBe(false);
  });

  it('rims dark mascot art on dark themes only', () => {
    expect(getCompanionRim(COMPANION_REGISTRY.comet, true)).toBe(LIGHT_COMPANION_RIM);
    expect(getCompanionRim(COMPANION_REGISTRY.comet, false)).toBeNull();
    expect(getCompanionRim(COMPANION_REGISTRY.mochi, true)).toBeNull();
  });
});

describe('resolveTheme', () => {
  it('gives each theme its default mascot when none is chosen', () => {
    for (const id of THEME_IDS) {
      expect(resolveTheme(id).companion.id).toBe(THEME_BASES[id].defaultCompanionId);
      expect(COMPANION_IDS).toContain(THEME_BASES[id].defaultCompanionId);
    }
  });

  it('puts the chosen mascot on any theme', () => {
    const theme = resolveTheme('cozy-studio', 'comet');
    expect(theme.pageBgClass).toBe(THEME_BASES['cozy-studio'].pageBgClass);
    expect(theme.companion.id).toBe('comet');
    expect(theme.companionRim).toBeNull();
    expect(resolveTheme('neon-pop', 'comet').companionRim).toBe(LIGHT_COMPANION_RIM);
  });

  it('keeps Comet rimmed on its own dark theme', () => {
    expect(resolveTheme('starlight-rpg').companionRim).toBe(LIGHT_COMPANION_RIM);
    expect(resolveTheme('neon-pop').companionRim).toBeNull();
  });

  it('falls back to the default theme for an unknown theme id', () => {
    expect(resolveTheme('from-a-newer-app').id).toBe('cozy-studio');
    expect(resolveTheme(undefined).id).toBe('cozy-studio');
  });

  it('returns the same object for the same theme and mascot', () => {
    expect(resolveTheme('neon-pop', 'mochi')).toBe(resolveTheme('neon-pop', 'mochi'));
    expect(resolveTheme('neon-pop')).toBe(resolveTheme('neon-pop', 'dj-beat'));
  });
});

describe('pickable themes and mascots', () => {
  it('offers the released ones outside preview (all of them now)', () => {
    expect(getPickableThemeIds(undefined, false)).toEqual(THEME_IDS);
    expect(getPickableCompanionIds(undefined, false)).toEqual(COMPANION_IDS);
  });

  it('has every picture of a released theme and mascot in public/art', () => {
    const toFile = (url: string) => join(process.cwd(), 'public', url);
    for (const id of THEME_IDS.filter((t) => THEME_BASES[t].isReleased)) {
      const { mapBg, homeScene, roomBg } = THEME_BASES[id].art;
      for (const url of [mapBg, homeScene, roomBg]) expect(existsSync(toFile(url)), url).toBe(true);
    }
    for (const id of COMPANION_IDS.filter((c) => COMPANION_REGISTRY[c].isReleased)) {
      for (const art of Object.values(COMPANION_REGISTRY[id].art)) {
        expect(existsSync(toFile(art.full)), art.full).toBe(true);
        expect(existsSync(toFile(art.small)), art.small).toBe(true);
      }
    }
  });

  it('offers everything in preview', () => {
    expect(getPickableThemeIds(undefined, true)).toEqual(THEME_IDS);
    expect(getPickableCompanionIds(undefined, true)).toEqual(COMPANION_IDS);
  });

  it('gives each grown-up theme its own new mascot', () => {
    const teenThemes = THEME_IDS.filter((id) => THEME_BASES[id].audience === 'teen');
    expect(teenThemes.map((id) => THEME_BASES[id].defaultCompanionId)).toEqual(['sage', 'kai', 'atlas']);
    expect(COMPANION_REGISTRY.sage.art.wave.small).toBe('/art/companions/sage/companion-wave@256.webp');
  });
});
