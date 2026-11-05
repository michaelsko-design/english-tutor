/**
 * Audit input for every Challenger fill-in-the-blank, so a judge (a model, then a person for the
 * flagged ones) can find wrong options that also make a correct sentence.
 *
 *   npm run review:cloze-audit   →   review-out/cloze-audit/batch-NN.json (+ prechecks.json)
 *
 * The blank hides the whole inflected word of the example sentence, and the options are base
 * words, so a wrong option is bad when ANY form of it would make a natural sentence.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { CURRICULUM_WITH_ALL_PACKS } from '../../src/data/curriculum/packs/all';
import { toClozeSentence } from '../../src/utils/hints';

const OUT_DIR = 'review-out/cloze-audit';
const BATCH_SIZE = 50;
/** A distractor used in more questions than this is probably a lazy pick */
const OVERUSED_DISTRACTOR = 6;
const STEM_LENGTH = 4;

export interface AuditItem {
  id: string;
  grade: string;
  /** The sentence as the learner sees it, with ___ */
  sentence: string;
  /** The example sentence with the right word in it */
  original: string;
  correct: string;
  wrong: string[];
}

function collectItems(): AuditItem[] {
  const items: AuditItem[] = [];
  for (const [gradeId, grade] of Object.entries(CURRICULUM_WITH_ALL_PACKS)) {
    grade.units.forEach((unit, unitIndex) => {
      unit.missions.forEach((mission, missionIndex) => {
        const clozeWrong = mission.drillSeed?.tiers?.challenger.clozeWrong;
        if (clozeWrong === undefined) return;
        mission.vocabulary.forEach((word, wordIndex) => {
          const wrong = clozeWrong[wordIndex];
          const sentence = toClozeSentence(word.exampleEn, word.wordEn);
          if (wrong === undefined || sentence === null) return;
          items.push({
            id: `${gradeId}.u${unitIndex + 1}.m${missionIndex + 1}.w${wordIndex}`,
            grade: gradeId,
            sentence,
            original: word.exampleEn,
            correct: word.wordEn,
            wrong: [...wrong],
          });
        });
      });
    });
  }
  return items;
}

const stemOf = (word: string): string => word.toLowerCase().slice(0, STEM_LENGTH);

/** Cheap checks that need no judgement: duplicates, look-alikes, overused distractors. */
function precheck(items: AuditItem[]): { id: string; problem: string }[] {
  const uses = new Map<string, number>();
  items.forEach((item) => item.wrong.forEach((word) => uses.set(word.toLowerCase(), (uses.get(word.toLowerCase()) ?? 0) + 1)));
  const problems: { id: string; problem: string }[] = [];
  for (const item of items) {
    const sentenceWords = item.original.toLowerCase().match(/[a-z']+/g) ?? [];
    if (item.wrong[0].toLowerCase() === item.wrong[1].toLowerCase()) problems.push({ id: item.id, problem: 'the two wrong options are the same' });
    for (const word of item.wrong) {
      const lower = word.toLowerCase();
      if (lower === item.correct.toLowerCase()) problems.push({ id: item.id, problem: `"${word}" is the right answer` });
      else if (stemOf(word) === stemOf(item.correct)) problems.push({ id: item.id, problem: `"${word}" looks like the right answer "${item.correct}"` });
      if (sentenceWords.includes(lower) && lower !== item.correct.toLowerCase()) problems.push({ id: item.id, problem: `"${word}" is already in the sentence` });
      if (/\s/.test(item.correct) !== /\s/.test(word)) problems.push({ id: item.id, problem: `"${word}" and "${item.correct}" differ in being one word or a phrase` });
      const count = uses.get(lower) ?? 0;
      if (count > OVERUSED_DISTRACTOR) problems.push({ id: item.id, problem: `"${word}" is a wrong option in ${count} questions` });
    }
  }
  return problems;
}

function main(): void {
  const items = collectItems();
  mkdirSync(OUT_DIR, { recursive: true });
  for (let start = 0; start < items.length; start += BATCH_SIZE) {
    const number = String(start / BATCH_SIZE + 1).padStart(2, '0');
    writeFileSync(`${OUT_DIR}/batch-${number}.json`, JSON.stringify(items.slice(start, start + BATCH_SIZE), null, 1));
  }
  const problems = precheck(items);
  writeFileSync(`${OUT_DIR}/prechecks.json`, JSON.stringify(problems, null, 1));
  console.log(`${items.length} questions in ${Math.ceil(items.length / BATCH_SIZE)} batches; ${problems.length} pre-check problems in ${new Set(problems.map((p) => p.id)).size} questions`);
}

main();
