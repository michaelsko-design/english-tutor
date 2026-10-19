import { describe, expect, it } from 'vitest';
import { hebrewTemplate, inflectHebrew } from './hebrewGender';
import { CURRICULUM_BY_GRADE, MissionNode } from '../data/curriculum';
import { getExercisesForMission, MissionExerciseStep } from '../data/missionExercises';
import { ProficiencyTier } from '../types/learner';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];

const ALL_MISSIONS: MissionNode[] = Object.values(CURRICULUM_BY_GRADE).flatMap((pack) =>
  pack.units.flatMap((u) => u.missions)
);

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
  it('keep story text and authored data exactly as for girls', () => {
    for (const mission of ALL_MISSIONS) {
      for (const tier of TIERS) {
        const girlSteps = getExercisesForMission(mission, tier, 'girl');
        const boySteps = getExercisesForMission(mission, tier, 'boy');
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

  it('show the Explorer story question exactly as written', () => {
    for (const mission of ALL_MISSIONS) {
      const story = getExercisesForMission(mission, 'explorer', 'boy').find((s) => s.type === 'story-unseen');
      expect(story?.promptHe, mission.id).toContain(mission.drillSeed!.story.questionHe);
    }
  });

  it('still address boys with masculine instructions', () => {
    const steps = getExercisesForMission(ALL_MISSIONS[0], 'challenger', 'boy');
    const sentence = steps.find((s) => s.type === 'sentence-builder')!;
    const voice = steps.find((s) => s.type === 'voice-speak')!;
    const detective = steps.find((s) => s.type === 'grammar-detective')!;
    expect(sentence.promptHe).toMatch(/^לחץ על המילים/);
    expect(voice.promptHe).toContain('הקלט את עצמך קורא');
    expect(detective.badgeLabelHe).toContain('בלש הדקדוק');
    expect(detective.promptHe).toMatch(/^בחר /);
    for (const step of steps) {
      expect(step.promptHe, step.type).not.toMatch(/(^|[^א-ת])(בחרי|לחצי|קראי|האזיני|הקליטי)([^א-ת]|$)/);
    }
  });

  it('keep the step-5 success message whole', () => {
    for (const tier of TIERS) {
      const story = getExercisesForMission(ALL_MISSIONS[0], tier, 'boy').find((s) => s.type === 'story-unseen')!;
      const correct = story.options!.find((o) => o.isCorrect)!;
      expect(correct.explanationHe).toBe('אלוף! סיימת את כל שלבי המשימה בהצלחה! 🎉');
    }
  });
});
