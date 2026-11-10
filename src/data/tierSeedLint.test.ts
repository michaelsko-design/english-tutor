import { describe, expect, it } from 'vitest';
import type { MissionNode } from './curriculum';
import { CURRICULUM_WITH_ALL_PACKS } from './curriculum/packs/all';
import { getExercisesForMission, type MissionExerciseStep } from './missionExercises';
import { toClozeSentence } from '../utils/hints';
import type { ProficiencyTier } from '../types/learner';

/** Flip to true once every mission has its tier seeds: a mission without them then fails. */
const REQUIRE_ALL_TIER_SEEDS = true;

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
const CLOZE_BLANK = '____';
const HEBREW_LETTER = /[\u0590-\u05FF]/;

const ALL_MISSIONS: MissionNode[] = Object.values(CURRICULUM_WITH_ALL_PACKS).flatMap((pack) =>
  pack.units.flatMap((u) => u.missions)
);
const SEEDED = ALL_MISSIONS.filter((m) => m.drillSeed);
const AUTHORED = SEEDED.filter((m) => m.drillSeed?.tiers);

function words(text: string): string[] {
  return text.toLowerCase().replace(/[.!?",]/g, '').split(/\s+/).filter(Boolean);
}

function correctAnswer(step: MissionExerciseStep): string {
  return step.options?.find((o) => o.isCorrect)?.textEn ?? step.targetSentenceEn ?? step.speakTargetEn ?? '';
}

function stepKey(step: MissionExerciseStep): string {
  return `${step.questionEn}|${step.cardTextHe ?? ''}|${correctAnswer(step)}`;
}

describe('tier seeds: coverage', () => {
  it('reports how many seeded missions still lack tier seeds', () => {
    const missing = SEEDED.filter((m) => !m.drillSeed?.tiers).map((m) => m.id);
    if (REQUIRE_ALL_TIER_SEEDS) expect(missing).toEqual([]);
    expect(AUTHORED.length + missing.length).toBe(SEEDED.length);
  });
});

describe.each(AUTHORED.map((m) => [m.id, m] as const))('tier seeds: %s', (_id, mission) => {
  const tiers = mission.drillSeed!.tiers!;

  it('has cloze distractors for every vocabulary word, and each word blanks out of its example', () => {
    expect(tiers.challenger.clozeWrong).toHaveLength(mission.vocabulary.length);
    mission.vocabulary.forEach((word, i) => {
      expect(toClozeSentence(word.exampleEn, word.wordEn), `${word.wordEn} example`).not.toBeNull();
      const pair = tiers.challenger.clozeWrong[i];
      expect(pair).toHaveLength(2);
      expect(new Set(pair.map((w) => w.toLowerCase())).size).toBe(2);
      for (const wrong of pair) {
        expect(wrong.toLowerCase(), `${word.wordEn} distractor`).not.toBe(word.wordEn.toLowerCase());
        expect(words(word.exampleEn), `${word.wordEn} distractor in sentence`).not.toContain(wrong.toLowerCase());
      }
    });
  });

  it('Challenger: the fill-in blanks out the offered answer exactly as the sentence has it, for every salt', () => {
    const examples = mission.vocabulary.map((w) => w.exampleEn.toLowerCase());
    for (let salt = 0; salt < mission.vocabulary.length; salt++) {
      const step1 = getExercisesForMission(mission, 'challenger', 'girl', salt)[0];
      const filled = (step1.questionEn ?? '').split(CLOZE_BLANK).join(correctAnswer(step1));
      expect(step1.questionEn, `salt ${salt} blank`).toContain(CLOZE_BLANK);
      expect(examples, `salt ${salt}: "${step1.questionEn}" + "${correctAnswer(step1)}"`).toContain(filled.toLowerCase());
    }
  });

  it('keeps the three tiers apart for every replay salt', () => {
    for (let salt = 0; salt < mission.vocabulary.length; salt++) {
      const keysByTier = TIERS.map((tier) => {
        const steps = getExercisesForMission(mission, tier, 'girl', salt);
        expect(steps.map((s) => s.stepNumber), `${tier} steps`).toEqual([1, 2, 3, 4, 5]);
        for (const step of steps) {
          if (!step.options) continue;
          const where = `${tier} salt ${salt} ${step.type}`;
          expect(step.options.filter((o) => o.isCorrect), where).toHaveLength(1);
          const texts = step.options.map((o) => o.textEn.trim().toLowerCase());
          expect(new Set(texts).size, `${where} duplicate option`).toBe(texts.length);
        }
        expect(steps[3].options, `${tier} step 4`).toHaveLength({ explorer: 2, challenger: 3, master: 4 }[tier]);
        expect(steps[4].options, `${tier} step 5`).toHaveLength({ explorer: 2, challenger: 3, master: 4 }[tier]);
        return new Set(steps.map(stepKey));
      });
      for (const [a, b] of [[0, 1], [1, 2], [0, 2]] as const) {
        expect([...keysByTier[a]].filter((k) => keysByTier[b].has(k)), `salt ${salt} tiers ${a}/${b}`).toEqual([]);
      }
    }
  });

  it('Master: new sentences, decoys outside the answer, no Hebrew story, English-only hints', () => {
    const master = tiers.master;
    const seed = mission.drillSeed!;
    expect(master.sentenceEn).not.toBe(mission.sampleSentenceEn);
    expect(master.sentenceEn).not.toBe(seed.shortSentenceEn);
    expect(master.voiceEn).not.toBe(mission.sampleSentenceEn);
    expect(master.voiceEn).not.toBe(master.sentenceEn);
    const answer = words(master.sentenceEn);
    expect(answer.length).toBeGreaterThanOrEqual(5);
    for (const decoy of master.decoys) expect(answer).not.toContain(decoy.toLowerCase());
    expect(master.story.passageHe).toBe('');
    expect(words(master.story.passageEn).length).toBeGreaterThan(words(tiers.explorer.story.passageEn).length);
    expect(master.story.passageEn).not.toBe(seed.story.passageEn);
    expect(HEBREW_LETTER.test(master.errorFix.hintEn)).toBe(false);
    expect(HEBREW_LETTER.test(master.storyHintEn)).toBe(false);
    expect(words(master.errorFix.hintEn).length).toBeLessThanOrEqual(14);
    expect(words(master.storyHintEn).length).toBeLessThanOrEqual(14);
  });

  it('Explorer stays short and easy', () => {
    const story = tiers.explorer.story;
    expect(words(story.passageEn).length).toBeLessThanOrEqual(45);
    expect(story.passageHe).not.toBe('');
    expect(tiers.explorer.rule.wrong.length).toBeGreaterThanOrEqual(1);
    expect(tiers.explorer.rule.questionEn).not.toBe(mission.drillSeed!.rule.questionEn);
    expect(story.questionEn).not.toBe(mission.drillSeed!.story.questionEn);
  });
});

describe('tier seeds: answer-position tells', () => {
  it('does not make the correct answer the longest option in most Master and Challenger questions', () => {
    let longest = 0;
    let total = 0;
    for (const mission of AUTHORED) {
      for (const tier of ['challenger', 'master'] as const) {
        for (const index of [3, 4]) {
          const options = getExercisesForMission(mission, tier, 'girl', 0)[index].options ?? [];
          const best = Math.max(...options.map((o) => o.textEn.length));
          total += 1;
          if (options.find((o) => o.isCorrect)!.textEn.length === best) longest += 1;
        }
      }
    }
    if (total > 0) expect(longest / total).toBeLessThan(0.5);
  });
});
