import { describe, expect, it, vi } from 'vitest';
import { MissionNode } from './curriculum';
import { ALL_LESSON_PACKS_WITH_PACKS, CURRICULUM_WITH_ALL_PACKS } from './curriculum/packs/all';
import { ALL_LESSON_PACKS } from './curriculum/lessons';
import { getExercisesForMission } from './missionExercises';
import {
  buildBossRecap,
  getGradeNumberFromMissionId,
  getLessonCards,
  LESSON_PACK_LOADERS,
  loadMiniLesson,
  MiniLesson,
  resolveMiniLesson,
  shouldAutoShowLesson,
  splitHighlight,
} from './miniLessons';
import { inflectHebrew } from '../utils/hebrewGender';
import { GradeId, LearnerGender, ProficiencyTier } from '../types/learner';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
const GENDERS: LearnerGender[] = ['girl', 'boy'];

const MAX_TITLE_CHARS = 40;
const MAX_IDEA_CHARS = 170;
const MAX_TIP_CHARS = 110;
const MAX_EXAMPLE_CHARS = 70;

function missionsOfGrade(grade: number): MissionNode[] {
  return CURRICULUM_WITH_ALL_PACKS[`grade-${grade}` as GradeId].units.flatMap((u) => u.missions);
}

/** Lower case, letters, digits and spaces only, so "Don't." and "dont" compare equal. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every answer the learner gives in the mission, in any tier: none may appear in its lesson. */
function getStepAnswers(mission: MissionNode): string[] {
  const answers = new Set<string>();
  for (const tier of TIERS) {
    for (const gender of GENDERS) {
      for (const step of getExercisesForMission(mission, tier, gender)) {
        step.options?.filter((o) => o.isCorrect).forEach((o) => answers.add(normalize(o.textEn)));
        if (step.targetSentenceEn) answers.add(normalize(step.targetSentenceEn));
        if (step.speakTargetEn) answers.add(normalize(step.speakTargetEn));
      }
    }
  }
  return [...answers].filter(Boolean);
}

function hebrewTextsOf(lesson: MiniLesson): string[] {
  return [
    lesson.titleHe,
    lesson.ideaHe,
    lesson.tipHe ?? '',
    ...lesson.examples.map((e) => e.he),
    lesson.quickTry?.promptHe ?? '',
    lesson.quickTry?.explainHe ?? '',
  ].filter(Boolean);
}

const LESSON_GRADES = Object.keys(ALL_LESSON_PACKS).map(Number);

describe('mini-lessons (Feature 42)', () => {
  it('has lessons for all 12 grades', () => {
    expect([...LESSON_GRADES].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('lists the same grades for the app loader and the tests', () => {
    expect(Object.keys(LESSON_PACK_LOADERS).map(Number).sort()).toEqual(LESSON_GRADES.sort());
  });

  it('loads the same pack the tests read', async () => {
    for (const grade of LESSON_GRADES) {
      expect(await LESSON_PACK_LOADERS[grade]!()).toBe(ALL_LESSON_PACKS[grade]);
    }
  });

  it('has a lesson for every regular mission of a grade with lessons, and nothing else', () => {
    for (const grade of LESSON_GRADES) {
      const pack = ALL_LESSON_PACKS_WITH_PACKS[grade];
      const missions = missionsOfGrade(grade);
      for (const mission of missions.filter((m) => !m.isBoss)) {
        expect(pack[mission.id], mission.id).toBeDefined();
      }
      const missionIds = new Set(missions.map((m) => m.id));
      for (const id of Object.keys(pack)) expect(missionIds.has(id), `orphan lesson ${id}`).toBe(true);
    }
  });

  it('gives every Boss of a grade with lessons a recap or its own lesson', () => {
    for (const grade of LESSON_GRADES) {
      for (const boss of missionsOfGrade(grade).filter((m) => m.isBoss)) {
        const lesson = resolveMiniLesson(boss, ALL_LESSON_PACKS_WITH_PACKS[grade]);
        expect(lesson, boss.id).not.toBeNull();
        expect(lesson!.examples.length, boss.id).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('keeps every lesson short and well formed', () => {
    for (const pack of Object.values(ALL_LESSON_PACKS_WITH_PACKS)) {
      for (const [id, lesson] of Object.entries(pack)) {
        expect(lesson.titleHe.length, id).toBeLessThanOrEqual(MAX_TITLE_CHARS);
        expect(lesson.ideaHe.length, id).toBeLessThanOrEqual(MAX_IDEA_CHARS);
        expect((lesson.tipHe ?? '').length, id).toBeLessThanOrEqual(MAX_TIP_CHARS);
        expect(lesson.examples.length, id).toBeGreaterThanOrEqual(2);
        expect(lesson.examples.length, id).toBeLessThanOrEqual(3);
        for (const example of lesson.examples) {
          expect(example.en.length, `${id} ${example.en}`).toBeLessThanOrEqual(MAX_EXAMPLE_CHARS);
          expect(example.en, id).toContain(example.highlight);
          expect(example.he.trim(), id).not.toBe('');
        }
        expect(lesson.quickTry, id).toBeDefined();
        // Plain comparison: options can be Hebrew meanings, which `normalize` would empty
        expect(lesson.quickTry!.correct.trim().toLowerCase(), id).not.toBe(lesson.quickTry!.wrong.trim().toLowerCase());
        expect(lesson.recapParts, id).toBeUndefined();
      }
    }
  });

  it('never shows a mission answer in its lesson', () => {
    for (const grade of LESSON_GRADES) {
      const pack = ALL_LESSON_PACKS_WITH_PACKS[grade];
      for (const mission of missionsOfGrade(grade)) {
        const lesson = resolveMiniLesson(mission, pack);
        if (!lesson) continue;
        const answers = getStepAnswers(mission);
        const shown = [
          ...lesson.examples.map((e) => normalize(e.en)),
          normalize(lesson.quickTry?.questionEn ?? ''),
          normalize(lesson.quickTry?.correct ?? ''),
        ].filter(Boolean);
        for (const text of shown) {
          for (const answer of answers) {
            const where = `${mission.id}: "${text}" vs "${answer}"`;
            expect(text, where).not.toBe(answer);
            // A sentence answer (3+ words) must not sit inside an example either.
            if (answer.split(' ').length >= 3) expect(text.includes(answer), where).toBe(false);
          }
        }
      }
    }
  });

  it('writes the Hebrew gender-neutral, so it reads the same for every learner', () => {
    for (const pack of Object.values(ALL_LESSON_PACKS_WITH_PACKS)) {
      for (const [id, lesson] of Object.entries(pack)) {
        for (const text of hebrewTextsOf(lesson)) {
          expect(inflectHebrew(text, 'boy'), id).toBe(text);
        }
      }
    }
  });
});

describe('buildBossRecap', () => {
  const lessonA: MiniLesson = {
    titleHe: 'א',
    ideaHe: 'רעיון א',
    pattern: 'A + B',
    examples: [
      { en: 'One.', he: 'אחת.', highlight: 'One' },
      { en: 'Two.', he: 'שתיים.', highlight: 'Two' },
    ],
    quickTry: { promptHe: '?', correct: 'a', wrong: 'b', explainHe: '!' },
  };
  const lessonB: MiniLesson = { ...lessonA, titleHe: 'ב', pattern: undefined, examples: [{ en: 'Three.', he: 'שלוש.', highlight: 'Three' }] };

  it('lists each topic and takes the first example of each lesson, without a quick try', () => {
    const recap = buildBossRecap([lessonA, lessonB])!;
    expect(recap.recapParts).toEqual([
      { titleHe: 'א', pattern: 'A + B' },
      { titleHe: 'ב', pattern: undefined },
    ]);
    expect(recap.examples.map((e) => e.en)).toEqual(['One.', 'Three.']);
    expect(recap.quickTry).toBeUndefined();
  });

  it('is null without lessons', () => {
    expect(buildBossRecap([])).toBeNull();
  });
});

describe('resolveMiniLesson', () => {
  const lesson = (titleHe: string): MiniLesson => ({
    titleHe,
    ideaHe: '',
    examples: [{ en: `${titleHe}.`, he: titleHe, highlight: titleHe }],
  });
  const pack = {
    'g7-u1-m2': lesson('m2'),
    'g7-u1-m1': lesson('m1'),
    'g7-u2-m1': lesson('other unit'),
    'g7-u2-m3': lesson('authored boss'),
  };

  it("returns the mission's own lesson", () => {
    expect(resolveMiniLesson({ id: 'g7-u1-m1' }, pack)?.titleHe).toBe('m1');
  });

  it("recaps the Boss's unit in mission order", () => {
    const recap = resolveMiniLesson({ id: 'g7-u1-m3', isBoss: true }, pack);
    expect(recap?.recapParts?.map((p) => p.titleHe)).toEqual(['m1', 'm2']);
  });

  it('prefers an authored Boss lesson', () => {
    expect(resolveMiniLesson({ id: 'g7-u2-m3', isBoss: true }, pack)?.titleHe).toBe('authored boss');
  });

  it('is null for a regular mission without a lesson', () => {
    expect(resolveMiniLesson({ id: 'g7-u3-m1' }, pack)).toBeNull();
  });
});

describe('loadMiniLesson', () => {
  it('loads a grade 7 lesson', async () => {
    expect((await loadMiniLesson({ id: 'g7-u1-m1' }))?.titleHe).toBe(ALL_LESSON_PACKS[7]['g7-u1-m1'].titleHe);
  });

  it('is null for a grade without lessons and for an unknown id', async () => {
    expect(await loadMiniLesson({ id: 'g99-u1-m1' })).toBeNull();
    expect(await loadMiniLesson({ id: 'not-a-mission' })).toBeNull();
  });

  it('is null when the lessons fail to load', async () => {
    const original = LESSON_PACK_LOADERS[7];
    LESSON_PACK_LOADERS[7] = vi.fn().mockRejectedValue(new Error('offline'));
    try {
      expect(await loadMiniLesson({ id: 'g7-u1-m1' })).toBeNull();
    } finally {
      LESSON_PACK_LOADERS[7] = original;
    }
  });
});

describe('getGradeNumberFromMissionId', () => {
  it('reads the grade from a mission id', () => {
    expect(getGradeNumberFromMissionId('g12-u4-m3')).toBe(12);
    expect(getGradeNumberFromMissionId('word-list-1')).toBeNull();
  });
});

describe('getLessonCards', () => {
  it('ends with the quick try when the lesson has one', () => {
    expect(getLessonCards(ALL_LESSON_PACKS[7]['g7-u1-m1'])).toEqual(['idea', 'examples', 'try']);
    const recap = buildBossRecap([ALL_LESSON_PACKS[7]['g7-u1-m1']])!;
    expect(getLessonCards(recap)).toEqual(['idea', 'examples']);
  });
});

describe('splitHighlight', () => {
  it('splits an example around its highlighted part', () => {
    expect(splitHighlight('Does Tom play chess?', 'Does Tom play')).toEqual({
      before: '',
      match: 'Does Tom play',
      after: ' chess?',
    });
    expect(splitHighlight('We play football.', 'play')).toEqual({ before: 'We ', match: 'play', after: ' football.' });
  });

  it('leaves the example whole when the part is missing', () => {
    expect(splitHighlight('We play.', 'run')).toEqual({ before: 'We play.', match: '', after: '' });
  });
});

describe('shouldAutoShowLesson', () => {
  it('opens the lesson by itself only before the first star', () => {
    expect(shouldAutoShowLesson(0)).toBe(true);
    expect(shouldAutoShowLesson(1)).toBe(false);
    expect(shouldAutoShowLesson(3)).toBe(false);
  });
});
