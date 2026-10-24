import { describe, expect, it } from 'vitest';
import { isPhonicsUnit, MissionNode } from './curriculum';
import { CURRICULUM_BY_GRADE } from '../test/curriculum';
import { ALPHABET } from './alphabet';
import { BLEND_WORDS, getBlendWord } from './blendingWords';
import { getExercisesForMission } from './missionExercises';
import { inflectHebrew } from '../utils/hebrewGender';
import { LearnerGender, ProficiencyTier } from '../types/learner';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
const GENDERS: LearnerGender[] = ['girl', 'boy'];
const GRADE_1 = CURRICULUM_BY_GRADE['grade-1'];
const PHONICS_MISSIONS: MissionNode[] = GRADE_1.units.filter(isPhonicsUnit).flatMap((u) => u.missions);
const LETTER_MISSIONS = PHONICS_MISSIONS.filter((m) => m.phonics?.kind === 'letters');
const BLEND_MISSIONS = PHONICS_MISSIONS.filter((m) => m.phonics?.kind === 'blending');
const FEMININE_IMPERATIVE = /(^|[^א-ת])(בחרי|לחצי|הקשיבי|אמרי|חפשי|שמעי|הסתכלי|מצאי|קראי|הרכיבי|נסי)([^א-ת]|$)/;

describe('grade 1 letters and blending units (Feature 48)', () => {
  it('opens grade 1 with 6 phonics units before the 4 topic units, on ids that never held other missions', () => {
    expect(GRADE_1.units).toHaveLength(10);
    expect(GRADE_1.units.map(isPhonicsUnit)).toEqual([true, true, true, true, true, true, false, false, false, false]);
    expect(GRADE_1.units.map((u) => u.unitNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // The topic units keep the ids learners already have stars on
    expect(GRADE_1.units[6].missions[0].id).toBe('g1-u1-m1');
    expect(GRADE_1.units[0].missions[0].id).toBe('g1-u11-m1');
  });

  it('teaches every letter A–Z exactly once in the regular letters missions', () => {
    const taught = LETTER_MISSIONS.filter((m) => !m.isBoss).flatMap((m) =>
      m.phonics?.kind === 'letters' ? m.phonics.letters : []
    );
    expect(taught).toEqual(ALPHABET.map((letter) => letter.upper));
  });

  it('gives every letter three distinct picture words that start (X: end) with it', () => {
    for (const letter of ALPHABET) {
      const words = letter.words.map((w) => w.en);
      expect(new Set(words).size, letter.upper).toBe(3);
      expect(new Set(letter.words.map((w) => w.emoji)).size, letter.upper).toBe(3);
      for (const word of words) {
        const edge = letter.position === 'end' ? word.slice(-1) : word[0];
        expect(edge, `${letter.upper} ${word}`).toBe(letter.lower);
      }
    }
  });

  it('builds 5 steps with distinct options and exactly one right answer', () => {
    for (const mission of PHONICS_MISSIONS) {
      for (const tier of TIERS) {
        const steps = getExercisesForMission(mission, tier);
        expect(steps, `${mission.id} ${tier}`).toHaveLength(5);
        for (const step of steps) {
          if (!step.options) continue;
          const where = `${mission.id} ${tier} ${step.type}`;
          expect(step.options.length, where).toBe(tier === 'explorer' ? 2 : 3);
          expect(new Set(step.options.map((o) => o.textEn)).size, where).toBe(step.options.length);
          expect(step.options.filter((o) => o.isCorrect), where).toHaveLength(1);
        }
      }
    }
  });

  it('addresses boys with masculine instructions', () => {
    for (const mission of PHONICS_MISSIONS) {
      for (const step of getExercisesForMission(mission, 'challenger', 'boy')) {
        expect(`${step.promptHe} ${step.hintHe} ${step.badgeLabelHe}`, `${mission.id} ${step.type}`).not.toMatch(
          FEMININE_IMPERATIVE
        );
      }
    }
  });

  it('builds blending words only from their tiles, with look-alikes one letter away', () => {
    for (const word of BLEND_WORDS) {
      expect(word.tiles.join(''), word.word).toBe(word.word);
      for (const lookAlike of word.lookAlikes) {
        expect(lookAlike.length, `${word.word}/${lookAlike}`).toBe(word.word.length);
        const differences = [...lookAlike].filter((ch, i) => ch !== word.word[i]).length;
        expect(differences, `${word.word}/${lookAlike}`).toBe(1);
      }
    }
  });

  it('uses every blending word of the missions, and builds each word from its own letters', () => {
    for (const mission of BLEND_MISSIONS) {
      if (mission.phonics?.kind !== 'blending') continue;
      mission.phonics.words.forEach((word) => expect(() => getBlendWord(word)).not.toThrow());
      const build = getExercisesForMission(mission, 'explorer').find((s) => s.type === 'blend-build');
      expect([...(build?.letterTiles ?? [])].sort().join(''), mission.id).toBe(
        [...(build?.targetSentenceEn ?? '')].sort().join('')
      );
    }
  });

  it('never reads a reading check aloud by itself', () => {
    for (const mission of BLEND_MISSIONS) {
      for (const tier of TIERS) {
        for (const step of getExercisesForMission(mission, tier)) {
          if (step.type === 'blend-read' || step.type === 'blend-change') {
            expect(step.questionEn, `${mission.id} ${tier} ${step.type}`).toBe('');
            step.options?.forEach((o) => expect(o.speakEn, `${mission.id} ${o.textEn}`).toBe(''));
          }
        }
      }
    }
  });

  it('hides the slide in Master reading checks only', () => {
    const [mission] = BLEND_MISSIONS;
    const readStep = (tier: ProficiencyTier) =>
      getExercisesForMission(mission, tier).find((s) => s.type === 'blend-read');
    expect(readStep('explorer')?.canSlide).toBe(true);
    expect(readStep('master')?.canSlide).toBe(false);
  });

  it('writes the letter tips gender-neutral', () => {
    for (const gender of GENDERS) {
      for (const letter of ALPHABET) {
        if (letter.tipHe) expect(inflectHebrew(letter.tipHe, gender), letter.upper).toBe(letter.tipHe);
      }
    }
  });
});
