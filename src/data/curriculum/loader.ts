/**
 * Loading a grade's curriculum on demand: each grade is its own chunk, so a learner downloads only
 * their grade (and the others only when a feature needs them: placement, word games, reports).
 * The app never imports `./base`; tests and scripts use `src/test/curriculum.ts` instead.
 */
import type { GradeId } from '../../types/learner';
import { ALL_PACK_CURRICULA } from './packs';
import { getPackUnits, mergeCurriculum } from './packs/merge';
import { CONTENT_PACK_IDS, IS_PACK_PREVIEW, RELEASED_CONTENT_PACKS } from './packs/registry';
import type { ContentPackId, PackCurriculum } from './packs/types';
import type { GradeCurriculumPack } from './types';

/** Every grade's own units; a grade missing here could not be opened. */
export const GRADE_CURRICULUM_LOADERS: Record<GradeId, () => Promise<GradeCurriculumPack>> = {
  'grade-1': () => import('./elementary/grade1').then((m) => m.grade1Curriculum),
  'grade-2': () => import('./elementary/grade2').then((m) => m.grade2Curriculum),
  'grade-3': () => import('./elementary/grade3').then((m) => m.grade3Curriculum),
  'grade-4': () => import('./elementary/grade4').then((m) => m.grade4Curriculum),
  'grade-5': () => import('./elementary/grade5').then((m) => m.grade5Curriculum),
  'grade-6': () => import('./elementary/grade6').then((m) => m.grade6Curriculum),
  'grade-7': () => import('./middleSchool/grade7').then((m) => m.grade7Curriculum),
  'grade-8': () => import('./middleSchool/grade8').then((m) => m.grade8Curriculum),
  'grade-9': () => import('./middleSchool/grade9').then((m) => m.grade9Curriculum),
  'grade-10': () => import('./highSchool/grade10').then((m) => m.grade10Curriculum),
  'grade-11': () => import('./highSchool/grade11').then((m) => m.grade11Curriculum),
  'grade-12': () => import('./highSchool/grade12').then((m) => m.grade12Curriculum),
};

/**
 * The released content packs' units. When a pack ships, import its curriculum here
 * (`./packs/<id>`) next to its entry in `RELEASED_CONTENT_PACKS`.
 */
const RELEASED_PACK_CURRICULA: Partial<Record<ContentPackId, PackCurriculum>> = {};

const PACK_IDS: readonly ContentPackId[] = IS_PACK_PREVIEW
  ? CONTENT_PACK_IDS
  : RELEASED_CONTENT_PACKS.map((released) => released.id);

const PACK_CURRICULA: Partial<Record<ContentPackId, PackCurriculum>> = IS_PACK_PREVIEW
  ? ALL_PACK_CURRICULA
  : RELEASED_PACK_CURRICULA;

/** Mission ids are `g<grade>-u<unit>-m<mission>`. */
const MISSION_ID_GRADE = /^g(\d+)-u\d+-m\d+$/;

const loads = new Map<GradeId, Promise<GradeCurriculumPack>>();
const loaded = new Map<GradeId, GradeCurriculumPack>();

/** The grade's units with the released packs' units after them. Rejects for an unknown grade. */
export function loadGradeCurriculum(gradeId: GradeId): Promise<GradeCurriculumPack> {
  const cached = loads.get(gradeId);
  if (cached) return cached;
  const loadBase = GRADE_CURRICULUM_LOADERS[gradeId];
  if (!loadBase) return Promise.reject(new Error(`Unknown grade: ${gradeId}`));
  const load = loadBase()
    .then((base) => mergeCurriculum(base, getPackUnits(gradeId, PACK_IDS, PACK_CURRICULA)))
    .then((pack) => {
      loaded.set(gradeId, pack);
      return pack;
    })
    .catch((error: unknown) => {
      // Not kept, so a retry (back online) loads the chunk again.
      loads.delete(gradeId);
      throw error;
    });
  loads.set(gradeId, load);
  return load;
}

/** The given grades, loaded together; the result is keyed by grade. */
export async function loadGrades(
  gradeIds: readonly GradeId[]
): Promise<Partial<Record<GradeId, GradeCurriculumPack>>> {
  const unique = [...new Set(gradeIds)];
  const packs = await Promise.all(unique.map(loadGradeCurriculum));
  return Object.fromEntries(unique.map((gradeId, index) => [gradeId, packs[index]]));
}

export function loadAllGrades(): Promise<Partial<Record<GradeId, GradeCurriculumPack>>> {
  return loadGrades(Object.keys(GRADE_CURRICULUM_LOADERS) as GradeId[]);
}

/** A grade already loaded, for pure code that runs after its caller waited for the load. */
export function getLoadedGrade(gradeId: GradeId): GradeCurriculumPack | undefined {
  return loaded.get(gradeId);
}

/** Every grade loaded so far, in grade order. */
export function getLoadedGrades(): GradeCurriculumPack[] {
  return (Object.keys(GRADE_CURRICULUM_LOADERS) as GradeId[]).flatMap((gradeId) => loaded.get(gradeId) ?? []);
}

export function areAllGradesLoaded(): boolean {
  return loaded.size === Object.keys(GRADE_CURRICULUM_LOADERS).length;
}

/** The grade a mission id belongs to (`g5-u2-m1` → `grade-5`), or null for an id of another shape. */
export function gradeIdFromMissionId(missionId: string): GradeId | null {
  const match = MISSION_ID_GRADE.exec(missionId);
  const gradeId = match ? (`grade-${match[1]}` as GradeId) : null;
  return gradeId && gradeId in GRADE_CURRICULUM_LOADERS ? gradeId : null;
}

/** The distinct grades the mission ids belong to. */
export function gradesInMissionIds(missionIds: Iterable<string>): GradeId[] {
  const gradeIds = new Set<GradeId>();
  for (const missionId of missionIds) {
    const gradeId = gradeIdFromMissionId(missionId);
    if (gradeId) gradeIds.add(gradeId);
  }
  return [...gradeIds];
}

/** Forgets what was loaded; tests only. */
export function resetGradeCurriculumCache(): void {
  loads.clear();
  loaded.clear();
}
