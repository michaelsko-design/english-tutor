import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BASE_CURRICULUM_BY_GRADE } from './base';
import {
  GRADE_CURRICULUM_LOADERS,
  areAllGradesLoaded,
  getLoadedGrade,
  getLoadedGrades,
  gradeIdFromMissionId,
  gradesInMissionIds,
  loadAllGrades,
  loadGradeCurriculum,
  loadGrades,
  resetGradeCurriculumCache,
} from './loader';

afterEach(() => {
  resetGradeCurriculumCache();
});

describe('loadGradeCurriculum', () => {
  it('loads a grade once and keeps it for sync reads', async () => {
    expect(getLoadedGrade('grade-3')).toBeUndefined();

    const pack = await loadGradeCurriculum('grade-3');

    expect(pack.units).toEqual(BASE_CURRICULUM_BY_GRADE['grade-3'].units);
    expect(getLoadedGrade('grade-3')).toBe(pack);
    expect(await loadGradeCurriculum('grade-3')).toBe(pack);
  });

  it('shares one load between concurrent callers', async () => {
    const original = GRADE_CURRICULUM_LOADERS['grade-4'];
    const loader = vi.fn(original);
    GRADE_CURRICULUM_LOADERS['grade-4'] = loader;
    try {
      await Promise.all([loadGradeCurriculum('grade-4'), loadGradeCurriculum('grade-4')]);
      expect(loader).toHaveBeenCalledTimes(1);
    } finally {
      GRADE_CURRICULUM_LOADERS['grade-4'] = original;
    }
  });

  it('forgets a failed load, so a retry loads the grade', async () => {
    const original = GRADE_CURRICULUM_LOADERS['grade-5'];
    GRADE_CURRICULUM_LOADERS['grade-5'] = vi.fn().mockRejectedValue(new Error('offline'));
    try {
      await expect(loadGradeCurriculum('grade-5')).rejects.toThrow('offline');
      expect(getLoadedGrade('grade-5')).toBeUndefined();
    } finally {
      GRADE_CURRICULUM_LOADERS['grade-5'] = original;
    }

    expect((await loadGradeCurriculum('grade-5')).units.length).toBeGreaterThan(0);
  });

  it('rejects an unknown grade', async () => {
    await expect(loadGradeCurriculum('grade-13' as never)).rejects.toThrow('Unknown grade');
  });
});

describe('loadGrades and loadAllGrades', () => {
  it('returns the requested grades once each', async () => {
    const packs = await loadGrades(['grade-1', 'grade-2', 'grade-1']);

    expect(Object.keys(packs).sort()).toEqual(['grade-1', 'grade-2']);
    expect(areAllGradesLoaded()).toBe(false);
  });

  it('loads all twelve grades in grade order', async () => {
    await loadAllGrades();

    expect(areAllGradesLoaded()).toBe(true);
    expect(getLoadedGrades()).toHaveLength(12);
  });
});

describe('mission ids', () => {
  it('names the grade of a mission id', () => {
    expect(gradeIdFromMissionId('g5-u2-m1')).toBe('grade-5');
    expect(gradeIdFromMissionId('g12-u21-m3')).toBe('grade-12');
  });

  it('ignores ids of another shape or an unknown grade', () => {
    expect(gradeIdFromMissionId('not-a-mission')).toBeNull();
    expect(gradeIdFromMissionId('g99-u1-m1')).toBeNull();
  });

  it('lists the distinct grades of a set of mission ids', () => {
    expect(gradesInMissionIds(['g1-u1-m1', 'g1-u2-m1', 'g7-u3-m2', 'junk']).sort()).toEqual(['grade-1', 'grade-7']);
  });
});

describe('first download', () => {
  const SRC = join(__dirname, '..', '..');
  const EAGER_CURRICULUM_IMPORT = /from ['"][^'"]*curriculum\/(base|elementary|middleSchool|highSchool)[^'"]*['"]|from ['"][^'"]*test\/curriculum['"]/;

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return name === 'test' ? [] : sourceFiles(path);
      return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
    });
  }

  it('is not pulled in by app code importing every grade eagerly', () => {
    const offenders = sourceFiles(SRC)
      .filter((path) => !path.endsWith(join('curriculum', 'loader.ts')) && !path.includes(join('curriculum', 'base.ts')))
      .filter((path) => !path.includes(join('data', 'curriculum', 'packs')) && !path.includes(join('data', 'curriculum', 'elementary')))
      .filter((path) => !path.includes(join('data', 'curriculum', 'middleSchool')) && !path.includes(join('data', 'curriculum', 'highSchool')))
      .filter((path) => EAGER_CURRICULUM_IMPORT.test(readFileSync(path, 'utf8')));

    expect(offenders).toEqual([]);
  });
});
