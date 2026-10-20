import { describe, expect, it } from 'vitest';
import { hebrewTemplate, inflectHebrew, resolveGenderSlashes } from './hebrewGender';
import { CURRICULUM_BY_GRADE, MissionNode } from '../data/curriculum';
import { getExercisesForMission, getRawExercisesForMission, MissionExerciseStep } from '../data/missionExercises';
import { ProficiencyTier } from '../types/learner';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];

const ALL_MISSIONS: MissionNode[] = Object.values(CURRICULUM_BY_GRADE).flatMap((pack) =>
  pack.units.flatMap((u) => u.missions)
);
/** Missions with a drill seed: all but grade 1's letters and blending missions (Feature 48). */
const SEEDED_MISSIONS = ALL_MISSIONS.filter((m) => m.drillSeed);

/**
 * Nouns, adjectives and third-person forms that must read the same for every learner.
 * ("עצמך קוראת" in the voice instruction is addressed to the learner, so only "היא קוראת" is here.)
 */
const DO_NOT_CHANGE = ['שלבי', 'עברי', 'גלי', 'עני', 'היא יכולה', 'מוכנה', 'היא קוראת', 'יכולה'];

function countOf(text: string, phrase: string): number {
  return text.split(phrase).length - 1;
}

function hebrewTexts(step: MissionExerciseStep): string[] {
  return [
    step.badgeLabelHe,
    step.promptHe,
    step.hintHe,
    step.contextPassageHe ?? '',
    step.cardTextHe ?? '',
    step.targetSentenceHe ?? '',
    step.speakTargetHe ?? '',
    ...(step.options ?? []).flatMap((o) => [o.textEn, o.explanationHe]),
  ];
}

describe('inflectHebrew', () => {
  it('turns feminine imperatives addressed to the learner into masculine ones', () => {
    expect(inflectHebrew('בחרי את התשובה הנכונה:', 'boy')).toBe('בחר את התשובה הנכונה:');
    expect(inflectHebrew('נסי שוב — חפשי את התשובה בסיפור', 'boy')).toBe('נסה שוב — חפש את התשובה בסיפור');
    expect(inflectHebrew('הקליטי את עצמך קוראת אותו בקול', 'boy')).toBe('הקלט את עצמך קורא אותו בקול');
  });

  it('keeps the text unchanged for a girl', () => {
    expect(inflectHebrew('בחרי את התשובה הנכונה:', 'girl')).toBe('בחרי את התשובה הנכונה:');
  });

  it('does not touch nouns and adjectives that look like imperatives', () => {
    expect(inflectHebrew('אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉', 'boy')).toBe(
      'אלוף! סיימת את כל שלבי המשימה בהצלחה! 🎉'
    );
    expect(inflectHebrew('המילון העברי', 'boy')).toBe('המילון העברי');
    expect(inflectHebrew('שם עברי יפה', 'boy')).toBe('שם עברי יפה');
    expect(inflectHebrew('ניתחו את גלי הקול', 'boy')).toBe('ניתחו את גלי הקול');
    expect(inflectHebrew('אוזניות גלי מוח', 'boy')).toBe('אוזניות גלי מוח');
    expect(inflectHebrew('עני ועשיר', 'boy')).toBe('עני ועשיר');
  });
});

describe('hebrewTemplate', () => {
  it('inflects the template text but never the values put into it', () => {
    const he = hebrewTemplate('boy');
    const questionHe = 'מה דנה עדיין לא יכולה לעשות?';
    expect(he`קראי את הסיפור הקצר. ${questionHe}`).toBe(`קרא את הסיפור הקצר. ${questionHe}`);
  });

  it('returns the text as written for a girl', () => {
    const he = hebrewTemplate('girl');
    expect(he`בחרי ${'מוכנה'}:`).toBe('בחרי מוכנה:');
  });
});

describe('mission steps for boys', () => {
  it('keep story text and authored data exactly as for girls before gender pairs are resolved', () => {
    for (const mission of ALL_MISSIONS) {
      for (const tier of TIERS) {
        const girlSteps = getRawExercisesForMission(mission, tier, 'girl');
        const boySteps = getRawExercisesForMission(mission, tier, 'boy');
        boySteps.forEach((boy, i) => {
          const girl = girlSteps[i];
          const where = `${mission.id} ${tier} ${boy.type}`;
          expect(boy.contextPassageHe, where).toBe(girl.contextPassageHe);
          expect(boy.contextPassageEn, where).toBe(girl.contextPassageEn);
          expect(boy.questionEn, where).toBe(girl.questionEn);
          expect(boy.options?.map((o) => o.textEn), where).toEqual(girl.options?.map((o) => o.textEn));
          const boyTexts = hebrewTexts(boy).join('\n');
          const girlTexts = hebrewTexts(girl).join('\n');
          for (const phrase of DO_NOT_CHANGE) {
            expect(countOf(boyTexts, phrase), `${where}: "${phrase}"`).toBe(countOf(girlTexts, phrase));
          }
        });
      }
    }
  });

  it('resolve every authored gender pair to the learner form', () => {
    const slashPair = /[א-ת]\/(ית|ות|ה|ת|י)(?![א-ת])/;
    for (const mission of ALL_MISSIONS) {
      for (const tier of TIERS) {
        for (const gender of ['girl', 'boy'] as const) {
          for (const step of getExercisesForMission(mission, tier, gender)) {
            expect(hebrewTexts(step).join('\n'), `${mission.id} ${tier} ${gender} ${step.type}`).not.toMatch(slashPair);
          }
        }
      }
    }
  });

  it('show the Explorer story question exactly as written', () => {
    for (const mission of SEEDED_MISSIONS) {
      const story = getRawExercisesForMission(mission, 'explorer', 'boy').find((s) => s.type === 'story-unseen');
      expect(story?.promptHe, mission.id).toContain(mission.drillSeed!.story.questionHe);
    }
  });

  it('still address boys with masculine instructions', () => {
    const steps = getExercisesForMission(SEEDED_MISSIONS[0], 'challenger', 'boy');
    const sentence = steps.find((s) => s.type === 'sentence-builder')!;
    const voice = steps.find((s) => s.type === 'voice-speak')!;
    const detective = steps.find((s) => s.type === 'grammar-detective')!;
    expect(sentence.promptHe).toBe('הרכב את המשפט:');
    expect(voice.promptHe).toBe('הקשב וחזור על המשפט:');
    expect(detective.badgeLabelHe).toContain('בלש הדקדוק');
    expect(detective.promptHe).toMatch(/^בחר /);
    for (const step of steps) {
      expect(step.promptHe, step.type).not.toMatch(/(^|[^א-ת])(בחרי|לחצי|קראי|האזיני|הקליטי|הרכיבי|הקשיבי|חזרי)([^א-ת]|$)/);
    }
  });

  it('keep the step-5 success message whole', () => {
    for (const tier of TIERS) {
      const story = getExercisesForMission(SEEDED_MISSIONS[0], tier, 'boy').find((s) => s.type === 'story-unseen')!;
      const correct = story.options!.find((o) => o.isCorrect)!;
      expect(correct.explanationHe).toBe('אלוף! סיימת את כל שלבי המשימה בהצלחה! 🎉');
    }
  });
});

describe('resolveGenderSlashes', () => {
  const cases: [string, string, string][] = [
    ['החבר/ה הכי טוב/ה שלי מעצב/ת מדבקות.', 'החברה הכי טובה שלי מעצבת מדבקות.', 'החבר הכי טוב שלי מעצב מדבקות.'],
    ['אני זוכר/ת את כל המילים.', 'אני זוכרת את כל המילים.', 'אני זוכר את כל המילים.'],
    ['אנחנו עומדים/ות להשיק חנות.', 'אנחנו עומדות להשיק חנות.', 'אנחנו עומדים להשיק חנות.'],
    ['אני יכול/ה לקפוץ.', 'אני יכולה לקפוץ.', 'אני יכול לקפוץ.'],
    ['אני שותה/ת מים ועושה/ה שיעורים.', 'אני שותה מים ועושה שיעורים.', 'אני שותה מים ועושה שיעורים.'],
    ['את/ה תלמיד/ה טוב/ה?', 'את תלמידה טובה?', 'אתה תלמיד טוב?'],
    ['אני מתכוונ/ת לבוא, ושתמשיך/י!', 'אני מתכוונת לבוא, ושתמשיכי!', 'אני מתכוון לבוא, ושתמשיך!'],
    ['הבלש/ית ולשותף/ה', 'הבלשית ולשותפה', 'הבלש ולשותף'],
    ['תוכל/י לבוא/?', 'תוכלי לבוא/?', 'תוכל לבוא/?'],
  ];

  it.each(cases)('resolves "%s"', (text, girl, boy) => {
    expect(resolveGenderSlashes(text, 'girl')).toBe(girl);
    expect(resolveGenderSlashes(text, 'boy')).toBe(boy);
  });

  it('leaves pairs that are not gender suffixes as written', () => {
    expect(resolveGenderSlashes('כן/לא', 'boy')).toBe('כן/לא');
    expect(resolveGenderSlashes('מצב/רגש', 'girl')).toBe('מצב/רגש');
    expect(resolveGenderSlashes('and/or', 'girl')).toBe('and/or');
  });
});
