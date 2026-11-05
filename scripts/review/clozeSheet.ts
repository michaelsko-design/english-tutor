/**
 * Read-only sheet of every Challenger fill-in-the-blank, with each wrong option put into the
 * sentence, so a teacher can spot wrong options that also make a correct sentence.
 *
 *   npm run review:cloze   →   review-out/cloze-distractors.html
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { CURRICULUM_WITH_ALL_PACKS } from '../../src/data/curriculum/packs/all';
import { toClozeSentence } from '../../src/utils/hints';

/** Words an earlier pass already found to be weak distractors (listed first) */
const KNOWN_WEAK = new Set([
  'avoid', 'mind', 'consider', 'refuse', 'promise', 'accomplish', 'claim', 'broadcast', 'tailor', 'technician', 'anonymous',
]);

interface Row {
  where: string;
  cloze: string;
  correct: string;
  wrong: string[];
  isFlagged: boolean;
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function collectRows(): Row[] {
  const rows: Row[] = [];
  for (const [gradeId, grade] of Object.entries(CURRICULUM_WITH_ALL_PACKS)) {
    grade.units.forEach((unit, unitIndex) => {
      unit.missions.forEach((mission, missionIndex) => {
        const clozeWrong = mission.drillSeed?.tiers?.challenger.clozeWrong;
        if (clozeWrong === undefined) return;
        mission.vocabulary.forEach((word, wordIndex) => {
          const wrong = clozeWrong[wordIndex];
          const cloze = toClozeSentence(word.exampleEn, word.wordEn);
          if (wrong === undefined || cloze === null) return;
          const isFlagged = [word.wordEn, ...wrong].some((option) => KNOWN_WEAK.has(option.toLowerCase()));
          rows.push({
            where: `${gradeId} · u${unitIndex + 1} · m${missionIndex + 1}`,
            cloze,
            correct: word.wordEn,
            wrong: [...wrong],
            isFlagged,
          });
        });
      });
    });
  }
  return rows.sort((a, b) => Number(b.isFlagged) - Number(a.isFlagged));
}

function renderRow(row: Row): string {
  const fill = (option: string, isRight: boolean): string =>
    `<div class="${isRight ? 'right' : 'wrong'}">${isRight ? '✓' : '✗'} ${escapeHtml(row.cloze).replace(
      '___',
      `<b>${escapeHtml(option)}</b>`
    )}</div>`;
  return `<section class="${row.isFlagged ? 'flag' : ''}"><div class="where">${row.where}${
    row.isFlagged ? ' · known weak' : ''
  }</div>${fill(row.correct, true)}${row.wrong.map((option) => fill(option, false)).join('')}</section>`;
}

function main(): void {
  const rows = collectRows();
  const html = `<!doctype html><html lang="en" dir="ltr"><meta charset="utf-8"><title>Cloze distractors</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:860px;margin:0 auto;padding:16px}
section{border:1px solid #ccc;border-radius:10px;padding:10px 14px;margin:10px 0}section.flag{border-color:#d9482b}
.where{font-size:12px;color:#777}.right{color:#1f9d55}.wrong{color:#b33}</style>
<h1>Challenger fill-in-the-blank: ${rows.length} questions</h1>
<p>Each wrong option is shown inside the sentence. A red line that reads as a correct sentence is a bad option.</p>
${rows.map(renderRow).join('\n')}</html>`;
  mkdirSync('review-out', { recursive: true });
  writeFileSync('review-out/cloze-distractors.html', html);
  console.log(`${rows.length} questions, ${rows.filter((row) => row.isFlagged).length} with a known weak option`);
}

main();
