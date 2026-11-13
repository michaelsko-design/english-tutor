import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getMissionPictureId, getUnitPicture } from './mapPictures';
import { MAP_PICTURE_IDS, SCREEN_PICTURE_IDS } from './mapPictureIds';
import { CURRICULUM_BY_GRADE } from '../../test/curriculum';

const hasFile = (id: string) => existsSync(join(process.cwd(), 'public', 'art', 'icons', `${id}.webp`));

describe('map pictures', () => {
  it('has a drawn file for every unit, mission and screen picture', () => {
    const ids = new Set([...Object.values(MAP_PICTURE_IDS), ...Object.values(SCREEN_PICTURE_IDS)]);
    expect([...ids].filter((id) => !hasFile(id))).toEqual([]);
  });

  it('gives every unit badge and mission of every grade a picture', () => {
    const missing = Object.values(CURRICULUM_BY_GRADE).flatMap((pack) =>
      pack.units.flatMap((unit) => [
        ...(getUnitPicture(unit) ? [] : [`unit ${unit.unitNumber} of ${unit.missions[0]?.id}`]),
        ...unit.missions.filter((m) => !getMissionPictureId(m.id)).map((m) => m.id),
      ])
    );
    expect(missing).toEqual([]);
  });

  it('shares one picture for a holiday across grades', () => {
    expect(getMissionPictureId('g1-u31-m3')).toBe('map-hanukkah');
    expect(getMissionPictureId('g9-u31-m3')).toBe('map-hanukkah');
  });

  it('finds the unit picture from its missions’ grade', () => {
    expect(getUnitPicture({ unitNumber: 13, missions: [{ id: 'g1-u31-m1' }] })).toBe('map-autumn-winter-holidays');
    expect(getUnitPicture({ unitNumber: 1, missions: [] })).toBeUndefined();
  });
});
