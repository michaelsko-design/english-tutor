/**
 * Mini-lessons before a mission (Feature 42): loading a grade's lessons on demand, the Boss
 * recap built from the unit's lessons, and when the lesson opens by itself.
 *
 * The lessons live in `curriculum/lessons/grade<N>.ts` and are loaded only when a mission
 * opens, so they never add to the first download.
 */
import type { MissionNode } from './curriculum';
import type { LessonPack, MiniLesson } from './curriculum/lessons/types';

export type { LessonExample, LessonPack, LessonQuickTry, MiniLesson } from './curriculum/lessons/types';

/** Every grade's lessons; a grade missing here would start its missions without one. */
export const LESSON_PACK_LOADERS: Partial<Record<number, () => Promise<LessonPack>>> = {
  1: () => import('./curriculum/lessons/grade1').then((m) => m.GRADE_1_LESSONS),
  2: () => import('./curriculum/lessons/grade2').then((m) => m.GRADE_2_LESSONS),
  3: () => import('./curriculum/lessons/grade3').then((m) => m.GRADE_3_LESSONS),
  4: () => import('./curriculum/lessons/grade4').then((m) => m.GRADE_4_LESSONS),
  5: () => import('./curriculum/lessons/grade5').then((m) => m.GRADE_5_LESSONS),
  6: () => import('./curriculum/lessons/grade6').then((m) => m.GRADE_6_LESSONS),
  7: () => import('./curriculum/lessons/grade7').then((m) => m.GRADE_7_LESSONS),
  8: () => import('./curriculum/lessons/grade8').then((m) => m.GRADE_8_LESSONS),
  9: () => import('./curriculum/lessons/grade9').then((m) => m.GRADE_9_LESSONS),
  10: () => import('./curriculum/lessons/grade10').then((m) => m.GRADE_10_LESSONS),
  11: () => import('./curriculum/lessons/grade11').then((m) => m.GRADE_11_LESSONS),
  12: () => import('./curriculum/lessons/grade12').then((m) => m.GRADE_12_LESSONS),
};

/** Mission ids are `g<grade>-u<unit>-m<mission>`. */
const MISSION_ID_PATTERN = /^g(\d+)-u(\d+)-m(\d+)$/;

export function getGradeNumberFromMissionId(missionId: string): number | null {
  const match = MISSION_ID_PATTERN.exec(missionId);
  return match ? Number(match[1]) : null;
}

function getUnitPrefix(missionId: string): string | null {
  const match = MISSION_ID_PATTERN.exec(missionId);
  return match ? `g${match[1]}-u${match[2]}-` : null;
}

function getMissionNumber(missionId: string): number {
  return Number(MISSION_ID_PATTERN.exec(missionId)?.[3] ?? 0);
}

/**
 * A Boss review recaps its unit's lessons: each topic with its pattern, and one example from
 * each. There is no quick try, because the Boss itself is the test.
 */
export function buildBossRecap(lessons: MiniLesson[]): MiniLesson | null {
  if (lessons.length === 0) return null;
  // Grade 1 letters and blending recaps keep their letter cards and word tiles (Feature 48)
  const letters = lessons.flatMap((lesson) => lesson.letters ?? []);
  const blendWords = lessons.flatMap((lesson) => lesson.blendWords?.slice(0, 2) ?? []);
  return {
    titleHe: 'חזרה מהירה לפני הבוס 👑',
    ideaHe: 'בבוס נפגשים כל הנושאים של היחידה. רגע לפני הקרב, נזכרים בהם:',
    recapParts: lessons.map((lesson) => ({ titleHe: lesson.titleHe, pattern: lesson.pattern })),
    examples: lessons.map((lesson) => lesson.examples[0]),
    ...(letters.length > 0 ? { letters } : {}),
    ...(blendWords.length > 0 ? { blendWords } : {}),
  };
}

/**
 * The mission's lesson from its grade's pack: its own lesson, or for a Boss without one, the
 * recap of the unit's other lessons.
 */
export function resolveMiniLesson(mission: Pick<MissionNode, 'id' | 'isBoss'>, pack: LessonPack): MiniLesson | null {
  const own = pack[mission.id];
  if (own) return own;
  if (!mission.isBoss) return null;
  const prefix = getUnitPrefix(mission.id);
  if (!prefix) return null;
  const unitLessons = Object.keys(pack)
    .filter((id) => id.startsWith(prefix) && id !== mission.id)
    .sort((a, b) => getMissionNumber(a) - getMissionNumber(b))
    .map((id) => pack[id]);
  return buildBossRecap(unitLessons);
}

/** Loads the mission's lesson. Null when its grade has none yet, or when loading fails (offline). */
export async function loadMiniLesson(mission: Pick<MissionNode, 'id' | 'isBoss'>): Promise<MiniLesson | null> {
  const grade = getGradeNumberFromMissionId(mission.id);
  const loadPack = grade === null ? undefined : LESSON_PACK_LOADERS[grade];
  if (!loadPack) return null;
  try {
    return resolveMiniLesson(mission, await loadPack());
  } catch {
    // A missing chunk (offline, or a new release) only means the mission starts without the lesson.
    return null;
  }
}

export type LessonCardKind = 'idea' | 'examples' | 'try';

/** The idea, the examples and, when the lesson has one, the quick try. */
export function getLessonCards(lesson: MiniLesson): LessonCardKind[] {
  return lesson.quickTry ? ['idea', 'examples', 'try'] : ['idea', 'examples'];
}

/** An example split around its highlighted part, for drawing that part in the theme colour. */
export function splitHighlight(en: string, highlight: string): { before: string; match: string; after: string } {
  const at = highlight ? en.indexOf(highlight) : -1;
  if (at < 0) return { before: en, match: '', after: '' };
  return { before: en.slice(0, at), match: highlight, after: en.slice(at + highlight.length) };
}

/** The lesson opens by itself on a mission's first play; replays offer it from the intro. */
export function shouldAutoShowLesson(previousStars: number): boolean {
  return previousStars <= 0;
}
