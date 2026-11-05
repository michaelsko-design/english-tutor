import { describe, expect, it } from 'vitest';
import type { MissionNode } from './curriculum';
import { getExercisesForMission, type MissionExerciseStep } from './missionExercises';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { TIER_FIXTURE_MISSION } from './testing/tierFixture';

const GENDERS: LearnerGender[] = ['girl', 'boy'];

function stepsFor(tier: ProficiencyTier, mission: MissionNode = TIER_FIXTURE_MISSION, salt = 0) {
  return getExercisesForMission(mission, tier, 'girl', salt);
}

function correctAnswer(step: MissionExerciseStep): string {
  return (
    step.options?.find((o) => o.isCorrect)?.textEn ??
    step.targetSentenceEn ??
    step.speakTargetEn ??
    ''
  );
}

/** A step's identity for "is this the same question": what is asked plus the right answer. */
function stepKey(step: MissionExerciseStep): string {
  return `${step.questionEn}|${step.cardTextHe ?? ''}|${correctAnswer(step)}`;
}

describe('tier steps: three genuinely different missions', () => {
  it('keeps five steps per tier in the same drill order', () => {
    for (const tier of ['explorer', 'challenger', 'master'] as const) {
      const steps = stepsFor(tier);
      expect(steps.map((s) => s.stepNumber)).toEqual([1, 2, 3, 4, 5]);
      expect(steps.map((s) => s.type).filter((t) => t === 'voice-speak')).toHaveLength(1);
    }
  });

  it('shares no question and answer between any two tiers', () => {
    const keys = (tier: ProficiencyTier) => new Set(stepsFor(tier).map(stepKey));
    const [explorer, challenger, master] = [keys('explorer'), keys('challenger'), keys('master')];
    for (const [a, b] of [
      [explorer, challenger],
      [challenger, master],
      [explorer, master],
    ] as const) {
      expect([...a].filter((k) => b.has(k))).toEqual([]);
    }
  });

  it('drills a different vocabulary word in each tier', () => {
    const word = (tier: ProficiencyTier) => {
      const step = stepsFor(tier)[0];
      return step.type === 'word-spell' ? step.targetSentenceEn : correctAnswer(step);
    };
    const words = ['explorer', 'challenger', 'master'].map((t) => word(t as ProficiencyTier));
    expect(new Set(words).size).toBe(3);
  });

  it('gives 2 / 3 / 4 answer options on the multiple-choice steps 4 and 5', () => {
    const counts = (tier: ProficiencyTier) => [3, 4].map((i) => stepsFor(tier)[i].options?.length);
    expect(counts('explorer')).toEqual([2, 2]);
    expect(counts('challenger')).toEqual([3, 3]);
    expect(counts('master')).toEqual([4, 4]);
  });

  it('gives each option list exactly one correct answer, and distinct answers', () => {
    for (const tier of ['explorer', 'challenger', 'master'] as const) {
      for (const step of stepsFor(tier)) {
        if (!step.options) continue;
        const where = `${tier} ${step.type}`;
        expect(step.options.filter((o) => o.isCorrect), where).toHaveLength(1);
        const texts = step.options.map((o) => o.textEn.toLowerCase());
        expect(new Set(texts).size, where).toBe(texts.length);
      }
    }
  });

  it('Explorer: picture or word cue, short sentence, Hebrew help in the story', () => {
    const [s1, s2, s3, , s5] = stepsFor('explorer');
    expect(s1.options).toHaveLength(2);
    expect(s2.targetSentenceEn).toBe(TIER_FIXTURE_MISSION.drillSeed!.shortSentenceEn);
    expect(s3.speakTargetEn).toBe(TIER_FIXTURE_MISSION.drillSeed!.shortSentenceEn);
    expect(s5.contextPassageHe).toBeTruthy();
    expect(s5.contextPassageEn).toBe(TIER_FIXTURE_MISSION.drillSeed!.tiers!.explorer.story.passageEn);
  });

  it('Challenger: the cloze word is vocabulary[1] and the full key sentence is built and spoken', () => {
    const [s1, s2, s3, s4, s5] = stepsFor('challenger');
    expect(s1.questionEn).toContain('___');
    expect(correctAnswer(s1)).toBe(TIER_FIXTURE_MISSION.vocabulary[1].wordEn);
    expect(s2.targetSentenceEn).toBe(TIER_FIXTURE_MISSION.sampleSentenceEn);
    expect(s3.speakTargetEn).toBe(TIER_FIXTURE_MISSION.sampleSentenceEn);
    expect(s4.questionEn).toBe(TIER_FIXTURE_MISSION.drillSeed!.rule.questionEn);
    expect(s5.contextPassageEn).toBe(TIER_FIXTURE_MISSION.drillSeed!.story.passageEn);
    expect(s5.contextPassageHe).toBeTruthy();
  });

  it('Challenger: the Hebrew sentence is held back as a hint until the first wrong answer', () => {
    const [s1] = stepsFor('challenger');
    const word = TIER_FIXTURE_MISSION.vocabulary[1];
    expect(s1.hintHe).not.toContain(word.exampleHe);
    expect(s1.hintAfterWrongHe).toContain(word.exampleHe);
    for (const tier of ['explorer', 'master'] as const) {
      expect(stepsFor(tier).every((step) => step.hintAfterWrongHe === undefined)).toBe(true);
    }
  });

  it('Master: spell a word from its Hebrew, a new sentence with decoys, say it from memory', () => {
    const master = TIER_FIXTURE_MISSION.drillSeed!.tiers!.master;
    const [s1, s2, s3, s4, s5] = stepsFor('master');
    expect(s1.type).toBe('word-spell');
    expect(s1.targetSentenceEn).toBe(TIER_FIXTURE_MISSION.vocabulary[2].wordEn);
    expect(s1.cardTextHe).toBe(TIER_FIXTURE_MISSION.vocabulary[2].translationHe);
    expect([...(s1.letterTiles ?? [])].sort()).toEqual(s1.targetSentenceEn!.split('').sort());
    expect(s2.targetSentenceEn).toBe(master.sentenceEn);
    expect(s2.targetSentenceEn).not.toBe(TIER_FIXTURE_MISSION.sampleSentenceEn);
    expect(s2.scrambledWords).toHaveLength(master.sentenceEn.replace(/[.!?",]/g, '').split(/\s+/).length + 2);
    expect(s2.hintWords).toBeUndefined();
    expect(s3.speakTargetEn).toBe(master.voiceEn);
    expect(s3.hideText).toBe(true);
    expect(s4.questionEn).toBe(master.errorFix.questionEn);
    expect(s5.contextPassageEn).toBe(master.story.passageEn);
    expect(s5.contextPassageHe).toBeUndefined();
  });

  it('Master hints are English only: no Hebrew letters', () => {
    const [, , , s4, s5] = stepsFor('master');
    expect(s4.hintHe).not.toMatch(/[֐-׿]/);
    expect(s5.hintHe).not.toMatch(/[֐-׿]/);
  });

  it('never leaves a decoy word in the answer', () => {
    const master = TIER_FIXTURE_MISSION.drillSeed!.tiers!.master;
    const step = stepsFor('master')[1];
    const answerWords = master.sentenceEn.replace(/[.!?",]/g, '').split(/\s+/).map((w) => w.toLowerCase());
    for (const decoy of master.decoys) expect(answerWords).not.toContain(decoy.toLowerCase());
    expect(step.scrambledWords).toEqual(expect.arrayContaining(master.decoys));
  });

  it('is gender-neutral in the data and gendered only in the instructions', () => {
    for (const tier of ['explorer', 'challenger', 'master'] as const) {
      const girl = getExercisesForMission(TIER_FIXTURE_MISSION, tier, GENDERS[0], 0);
      const boy = getExercisesForMission(TIER_FIXTURE_MISSION, tier, GENDERS[1], 0);
      girl.forEach((step, i) => {
        expect(step.questionEn).toBe(boy[i].questionEn);
        expect(step.contextPassageEn).toBe(boy[i].contextPassageEn);
        expect(step.targetSentenceEn).toBe(boy[i].targetSentenceEn);
      });
    }
  });

  it('rotates the focus word with the replay salt so a replay is not identical', () => {
    const first = stepsFor('challenger', TIER_FIXTURE_MISSION, 0)[0];
    const second = stepsFor('challenger', TIER_FIXTURE_MISSION, 1)[0];
    expect(stepKey(first)).not.toBe(stepKey(second));
  });
});
