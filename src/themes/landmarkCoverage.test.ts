/**
 * Every unit on every learner's map has its landmark picture in every released theme, so no stop
 * falls back to the badge emoji and no map asks for a file that isn't there (a 404 on every visit).
 * A new unit, or a content pack added to RELEASED_CONTENT_PACKS, fails here until its landmarks are
 * drawn: see "Landmarks for a new unit" in docs/architecture.md §4.17.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadAllGrades } from '../data/curriculum/loader';
import { getUnitLandmarkArt } from './themeArt';
import { THEME_BASES, THEME_IDS } from './themeRegistry';

const toFile = (url: string) => join(process.cwd(), 'public', url);
const MISSION_ID_GRADE = /^g(\d+)-u\d+-m\d+$/;

describe('landmark coverage', () => {
  it('has a landmark for every unit of every grade, in every released theme', async () => {
    const grades = Object.values(await loadAllGrades());
    const releasedThemes = THEME_IDS.filter((id) => THEME_BASES[id].isReleased).map((id) => THEME_BASES[id]);
    const missing = new Set<string>();
    for (const grade of grades) {
      for (const unit of grade?.units ?? []) {
        const gradeNumber = Number(MISSION_ID_GRADE.exec(unit.missions[0]?.id ?? '')?.[1]);
        expect(gradeNumber, `unit ${unit.unitNumber} has no readable mission id`).toBeGreaterThan(0);
        for (const theme of releasedThemes) {
          const art = getUnitLandmarkArt(theme, gradeNumber, unit);
          for (const url of [art.full, art.small]) if (!existsSync(toFile(url))) missing.add(url);
        }
      }
    }
    expect([...missing].sort()).toEqual([]);
  });
});
