import { describe, expect, it } from 'vitest';
import { CURRICULUM_WITH_ALL_PACKS } from './curriculum/packs/all';
import { getExercisesForMission } from './missionExercises';
import { lookupWordGlossHe } from './wordGlosses';
import { getWordGlossKey } from '../utils/hints';

/** People's names in the sentences: nothing to translate */
const NAMES = new Set([
  'dana', "dana's", 'dan', 'hana', 'shani', "ben's", 'noa', 'graham', 'alexander', 'bell', 'george', 'levi', 'maya', 'adi', 'gal',
]);
const TIERS = ['explorer', 'challenger', 'master'] as const;

describe('sentence-builder word translations', () => {
  it('translates every word in the word banks (the mission vocabulary or the local lists), so the hint icon can sit on any of them', () => {
    const missions = Object.values(CURRICULUM_WITH_ALL_PACKS).flatMap((pack) => pack.units.flatMap((u) => u.missions));
    const missing = new Set<string>();
    for (const mission of missions) {
      for (const tier of TIERS) {
        for (const step of getExercisesForMission(mission, tier)) {
          if (step.type !== 'sentence-builder') continue;
          const translated = new Set((step.hintWords ?? []).map((gloss) => getWordGlossKey(gloss.wordEn)));
          for (const word of step.scrambledWords ?? []) {
            const key = getWordGlossKey(word);
            if (key && !NAMES.has(key) && !translated.has(key)) missing.add(key);
          }
        }
      }
    }
    expect([...missing]).toEqual([]);
  });

  it('treats a curly apostrophe like a straight one', () => {
    expect(lookupWordGlossHe('isn’t')).toBe(lookupWordGlossHe("isn't"));
  });
});
