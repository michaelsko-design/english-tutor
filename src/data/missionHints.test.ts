import { describe, expect, it } from 'vitest';
import { CURRICULUM_BY_GRADE, MissionNode } from './curriculum';
import { getExercisesForMission } from './missionExercises';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { decidingWords, toTokens } from './testing/answerWords';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
const GENDERS: LearnerGender[] = ['girl', 'boy'];

const ALL_MISSIONS: MissionNode[] = Object.values(CURRICULUM_BY_GRADE).flatMap((pack) =>
  pack.units.flatMap((u) => u.missions)
);
/** Missions with a drill seed: all but grade 1's letters and blending missions (Feature 48). */
const SEEDED_MISSIONS = ALL_MISSIONS.filter((m) => m.drillSeed);

function hasWholeWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z])${escaped}([^A-Za-z]|$)`, 'i').test(text);
}

describe('mission hints (Feature 20)', () => {
  it('covers every mission of grades 1–12', () => {
    // 12 grades × 12 missions, plus grade 1's 18 letters and blending missions
    expect(ALL_MISSIONS).toHaveLength(162);
    expect(ALL_MISSIONS.every((m) => m.drillSeed || m.phonics)).toBe(true);
  });

  it('gives every step a hint that is not the prompt and does not repeat on-screen text', () => {
    for (const mission of ALL_MISSIONS) {
      for (const tier of TIERS) {
        for (const gender of GENDERS) {
          for (const step of getExercisesForMission(mission, tier, gender)) {
            const where = `${mission.id} ${tier} ${step.type}`;
            expect(step.hintHe.replace('💡', '').trim(), where).not.toBe('');
            expect(step.promptHe, where).not.toContain(step.hintHe);
            if (step.targetSentenceHe) expect(step.hintHe, where).not.toContain(step.targetSentenceHe);
            if (step.speakTargetHe) expect(step.hintHe, where).not.toContain(step.speakTargetHe);
          }
        }
      }
    }
  });

  it('never names the vocabulary answer in step 1', () => {
    for (const mission of ALL_MISSIONS) {
      const v0 = mission.vocabulary[0];
      for (const tier of TIERS) {
        const [step1] = getExercisesForMission(mission, tier);
        const where = `${mission.id} ${tier}`;
        if (tier === 'challenger') {
          // The options are Hebrew meanings, so the hint must not carry the Hebrew translation.
          expect(step1.hintHe, where).not.toContain(v0.translationHe);
        } else {
          // The options are English words.
          expect(hasWholeWord(step1.hintHe, v0.wordEn), where).toBe(false);
        }
      }
    }
  });

  it('points to the story without giving the answer in step 5', () => {
    for (const mission of SEEDED_MISSIONS) {
      for (const tier of TIERS) {
        const step5 = getExercisesForMission(mission, tier)[4];
        expect(step5.hintHe.toLowerCase(), `${mission.id} ${tier}`).not.toContain(
          mission.drillSeed!.story.correct.toLowerCase()
        );
      }
    }
  });

  it('has a hand-written grammar hint that does not reveal the answer', () => {
    for (const mission of SEEDED_MISSIONS) {
      const rule = mission.drillSeed!.rule;
      const where = `${mission.id}: ${rule.hintHe}`;
      expect(rule.hintHe.trim(), where).not.toBe('');
      expect(rule.hintHe, where).not.toBe(rule.explainHe);
      expect(rule.hintHe, where).not.toContain(mission.grammarTopic);
      const hintTokens = toTokens(rule.hintHe);
      const leaked = decidingWords(rule.correct, rule.wrong).filter((t) => hintTokens.has(t));
      expect(leaked, where).toEqual([]);
      const step4 = getExercisesForMission(mission, 'challenger')[3];
      expect(step4.hintHe, where).toContain(rule.hintHe);
    }
  });
});
