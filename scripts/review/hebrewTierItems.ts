/**
 * Collects every English → Hebrew pair a learner sees in the curriculum (base grades and both
 * content packs) so a native speaker can check each translation next to its English sentence.
 * Identical pairs that appear in several missions are merged into one item.
 */
import { createHash } from 'node:crypto';
import { CURRICULUM_WITH_ALL_PACKS } from '../../src/data/curriculum/packs/all';
import type { MissionNode } from '../../src/data/curriculum/types';

export type ItemKind = 'explain' | 'story' | 'sentence' | 'vocab';

export interface ReviewItem {
  /** Short hash of the English + Hebrew text: changes whenever either side is edited */
  h: string;
  kind: ItemKind;
  /** True for the Explorer / Master content added by the tier work (reviewed first) */
  isNew: boolean;
  en: string;
  he: string;
  /** Where it shows, e.g. "g8 · u2 · m1 · Master · voice" (first few places) */
  where: string[];
  /** Total places that use exactly this pair */
  count: number;
}

interface RawPair {
  kind: ItemKind;
  isNew: boolean;
  en: string;
  he: string;
  label: string;
}

export function pairHash(en: string, he: string): string {
  return createHash('sha1').update(`${en}\u0000${he}`).digest('hex').slice(0, 12);
}

function missionPairs(mission: MissionNode): RawPair[] {
  const out: RawPair[] = [];
  const add = (kind: ItemKind, isNew: boolean, label: string, en: string, he: string): void => {
    if (en.trim() === '' || he.trim() === '') return;
    out.push({ kind, isNew, en, he, label });
  };
  add('sentence', false, 'key sentence', mission.sampleSentenceEn, mission.sampleSentenceHe);
  for (const word of mission.vocabulary) {
    add('vocab', false, `word ${word.wordEn}`, word.wordEn, word.translationHe);
    add('sentence', false, `example of ${word.wordEn}`, word.exampleEn, word.exampleHe);
  }
  const seed = mission.drillSeed;
  if (seed === undefined) return out;
  add('sentence', false, 'Explorer short sentence', seed.shortSentenceEn, seed.shortSentenceHe);
  const ruleEn = (q: string, answer: string): string => `${q}  →  ${answer}`;
  add('explain', false, 'Challenger rule explanation', ruleEn(seed.rule.questionEn, seed.rule.correct), seed.rule.explainHe);
  add('explain', false, 'Challenger rule hint', ruleEn(seed.rule.questionEn, seed.rule.correct), seed.rule.hintHe);
  add('story', false, 'Challenger story', seed.story.passageEn, seed.story.passageHe);
  add('story', false, 'Challenger story question', `${seed.story.questionEn}  →  ${seed.story.correct}`, seed.story.questionHe);
  const tiers = seed.tiers;
  if (tiers === undefined) return out;
  const { explorer, master } = tiers;
  add('explain', true, 'Explorer rule explanation', ruleEn(explorer.rule.questionEn, explorer.rule.correct), explorer.rule.explainHe);
  add('explain', true, 'Explorer rule hint', ruleEn(explorer.rule.questionEn, explorer.rule.correct), explorer.rule.hintHe);
  add('story', true, 'Explorer story', explorer.story.passageEn, explorer.story.passageHe);
  add('story', true, 'Explorer story question', `${explorer.story.questionEn}  →  ${explorer.story.correct}`, explorer.story.questionHe);
  add('sentence', true, 'Master sentence', master.sentenceEn, master.sentenceHe);
  add('sentence', true, 'Master voice', master.voiceEn, master.voiceHe);
  add('explain', true, 'Master error-fix explanation', ruleEn(master.errorFix.questionEn, master.errorFix.correct), master.errorFix.explainHe);
  return out;
}

const KIND_ORDER: Record<ItemKind, number> = { explain: 0, story: 1, sentence: 2, vocab: 3 };

export function collectReviewItems(): ReviewItem[] {
  const byHash = new Map<string, ReviewItem>();
  for (const [gradeId, grade] of Object.entries(CURRICULUM_WITH_ALL_PACKS)) {
    const gradeNumber = gradeId.replace('grade-', '');
    for (const unit of grade.units) {
      for (const mission of unit.missions) {
        for (const pair of missionPairs(mission)) {
          const h = pairHash(pair.en, pair.he);
          const where = `g${gradeNumber} · u${unit.unitNumber} · m${mission.missionNumber} · ${pair.label}`;
          const known = byHash.get(h);
          if (known !== undefined) {
            known.count += 1;
            if (known.where.length < 4) known.where.push(where);
            known.isNew = known.isNew || pair.isNew;
            continue;
          }
          byHash.set(h, { h, kind: pair.kind, isNew: pair.isNew, en: pair.en, he: pair.he, where: [where], count: 1 });
        }
      }
    }
  }
  return [...byHash.values()].sort(
    (a, b) => Number(b.isNew) - Number(a.isNew) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
  );
}
