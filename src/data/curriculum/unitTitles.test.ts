import { describe, expect, it } from 'vitest';
import { CURRICULUM_WITH_ALL_PACKS } from './packs/all';

/**
 * The map's unit banner is a fixed-size sign: each title gets two lines. A longer title is cut
 * on a small phone, so it must be shortened here instead.
 */
const MAX_TITLE_HE_CHARS = 48;
const MAX_TITLE_EN_CHARS = 60;

const units = Object.values(CURRICULUM_WITH_ALL_PACKS).flatMap((pack) =>
  pack.units.map((unit) => ({ grade: pack.gradeId, unit }))
);

describe('unit titles fit the map banner', () => {
  it.each([
    ['titleHe', MAX_TITLE_HE_CHARS],
    ['titleEn', MAX_TITLE_EN_CHARS],
  ] as const)('%s stays within %i characters', (field, max) => {
    const tooLong = units
      .filter(({ unit }) => unit[field].length > max)
      .map(({ grade, unit }) => `${grade} unit ${unit.unitNumber}: ${unit[field]} (${unit[field].length})`);
    expect(tooLong).toEqual([]);
  });
});
