import { describe, expect, it } from 'vitest';
import { MissionNode } from './curriculum';
import { CURRICULUM_WITH_ALL_PACKS } from './curriculum/packs/all';

const ALL_MISSIONS: MissionNode[] = Object.values(CURRICULUM_WITH_ALL_PACKS).flatMap((pack) =>
  pack.units.flatMap((u) => u.missions)
);
/** Missions with a drill seed: all but grade 1's letters and blending missions (Feature 48). */
const SEEDED_MISSIONS = ALL_MISSIONS.filter((m) => m.drillSeed);

function sameText(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

describe('curriculum data (every grade with every content pack)', () => {
  it('gives every mission a unique id', () => {
    const ids = ALL_MISSIONS.map((m) => m.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it('files every pack under its own grade', () => {
    for (const [gradeId, pack] of Object.entries(CURRICULUM_WITH_ALL_PACKS)) {
      expect(pack.gradeId).toBe(gradeId);
    }
  });

  it('has a drill seed (or phonics) and vocabulary for every mission', () => {
    for (const m of ALL_MISSIONS) {
      expect(m.drillSeed ?? m.phonics, m.id).toBeDefined();
      expect(m.vocabulary.length, m.id).toBeGreaterThan(0);
    }
  });

  it('has at least two distractor words, none equal to the answer word', () => {
    for (const m of SEEDED_MISSIONS) {
      const seed = m.drillSeed!;
      const v0 = m.vocabulary[0];
      expect(seed.wrongWords.length, m.id).toBeGreaterThanOrEqual(2);
      for (const w of seed.wrongWords) {
        expect(w.wordEn.trim(), m.id).not.toBe('');
        expect(w.translationHe.trim(), m.id).not.toBe('');
        expect(sameText(w.wordEn, v0.wordEn), `${m.id}: "${w.wordEn}"`).toBe(false);
        expect(sameText(w.translationHe, v0.translationHe), `${m.id}: "${w.translationHe}"`).toBe(false);
      }
      expect(sameText(seed.wrongWords[0].wordEn, seed.wrongWords[1].wordEn), m.id).toBe(false);
    }
  });

  it('never lists the correct rule answer among the wrong ones', () => {
    for (const m of SEEDED_MISSIONS) {
      const { rule } = m.drillSeed!;
      expect(rule.wrong.length, m.id).toBeGreaterThanOrEqual(2);
      for (const wrong of rule.wrong) {
        expect(sameText(wrong, rule.correct), `${m.id}: "${wrong}"`).toBe(false);
      }
      expect(sameText(rule.wrong[0], rule.wrong[1]), m.id).toBe(false);
    }
  });

  it('never lists the correct story answer among the wrong ones', () => {
    for (const m of SEEDED_MISSIONS) {
      const { story } = m.drillSeed!;
      expect(story.wrong.length, m.id).toBeGreaterThanOrEqual(2);
      for (const wrong of story.wrong) {
        expect(sameText(wrong, story.correct), `${m.id}: "${wrong}"`).toBe(false);
      }
      expect(sameText(story.wrong[0], story.wrong[1]), m.id).toBe(false);
    }
  });

  it('has no empty sentences, questions or answers', () => {
    for (const m of SEEDED_MISSIONS) {
      const seed = m.drillSeed!;
      const texts: Record<string, string> = {
        sampleSentenceEn: m.sampleSentenceEn,
        sampleSentenceHe: m.sampleSentenceHe,
        shortSentenceEn: seed.shortSentenceEn,
        shortSentenceHe: seed.shortSentenceHe,
        'rule.questionEn': seed.rule.questionEn,
        'rule.correct': seed.rule.correct,
        'rule.explainHe': seed.rule.explainHe,
        'rule.hintHe': seed.rule.hintHe,
        'story.passageEn': seed.story.passageEn,
        'story.passageHe': seed.story.passageHe,
        'story.questionEn': seed.story.questionEn,
        'story.questionHe': seed.story.questionHe,
        'story.correct': seed.story.correct,
        ...Object.fromEntries(seed.rule.wrong.map((w, i) => [`rule.wrong[${i}]`, w])),
        ...Object.fromEntries(seed.story.wrong.map((w, i) => [`story.wrong[${i}]`, w])),
      };
      for (const [field, text] of Object.entries(texts)) {
        expect(text?.trim(), `${m.id} ${field}`).toBeTruthy();
      }
      for (const v of m.vocabulary) {
        expect(v.wordEn.trim(), m.id).not.toBe('');
        expect(v.translationHe.trim(), `${m.id} ${v.wordEn}`).not.toBe('');
        expect(v.exampleEn.trim(), `${m.id} ${v.wordEn}`).not.toBe('');
      }
    }
  });
});
