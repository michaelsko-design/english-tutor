/**
 * Applies the audit's replacements for flagged Challenger fill-in-the-blank options to the
 * curriculum source. Dry run by default; `-- write` edits the files.
 *
 *   npm run review:cloze-apply            (lists what would change)
 *   npm run review:cloze-apply -- write
 *
 * Only `verdict: "flag"` findings are applied. Each edit swaps one quoted option inside the
 * mission's `clozeWrong` row for that vocabulary word, and refuses a replacement that equals the
 * right word, the other wrong option or a word of the example sentence.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CURRICULUM_WITH_ALL_PACKS } from '../../src/data/curriculum/packs/all';

const CURRICULUM_DIR = 'src/data/curriculum';
const fileFlag = process.argv.indexOf('--file');
const FLAGGED = fileFlag >= 0 ? process.argv[fileFlag + 1] : 'review-out/cloze-audit/flagged.json';
const IS_WRITE = process.argv.includes('write');

interface Finding {
  id: string;
  verdict: 'flag' | 'maybe';
  option: string;
  replacement: string;
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listSourceFiles(path);
    return /\.ts$/.test(name) && !/\.test\.ts$/.test(name) ? [path] : [];
  });
}

function findMission(id: string) {
  const [gradeId, unitPart, missionPart, wordPart] = id.split('.');
  const unit = CURRICULUM_WITH_ALL_PACKS[gradeId as keyof typeof CURRICULUM_WITH_ALL_PACKS].units[Number(unitPart.slice(1)) - 1];
  const mission = unit.missions[Number(missionPart.slice(1)) - 1];
  return { mission, wordIndex: Number(wordPart.slice(1)) };
}

const files = new Map(listSourceFiles(CURRICULUM_DIR).map((path) => [path, readFileSync(path, 'utf8')]));
const edits = new Map<string, string>();
let applied = 0;
const problems: string[] = [];

/**
 * Replacements chosen by hand where the judge picked the same word for both options of one row
 * (key: `${id}|${option}`). Each is a word that does not make a natural sentence in that blank.
 */
const OVERRIDES: Record<string, string> = {
  'grade-2.u6.m3.w2|shoes': 'snow',
  'grade-2.u6.m3.w3|moons': 'ice',
  'grade-2.u7.m3.w1|cakes': 'door',
  'grade-2.u7.m3.w2|candles': 'game',
  'grade-2.u8.m1.w1|crowns': 'milk',
  'grade-2.u8.m3.w1|pools': 'snow',
  'grade-5.u6.m3.w3|sofa': 'spelling',
};

for (const finding of (JSON.parse(readFileSync(FLAGGED, 'utf8')) as Finding[]).filter((f) => f.verdict === 'flag')) {
  const { mission, wordIndex } = findMission(finding.id);
  const word = mission.vocabulary[wordIndex];
  const row = mission.drillSeed?.tiers?.challenger.clozeWrong[wordIndex];
  const replacement = (OVERRIDES[`${finding.id}|${finding.option}`] ?? finding.replacement).trim();
  const reject = (why: string) => problems.push(`${finding.id}: ${why}`);
  if (!row || !row.includes(finding.option)) { reject(`option "${finding.option}" is not in the data`); continue; }
  const taken = [word.wordEn, ...row, ...(word.exampleEn.toLowerCase().match(/[a-z']+/g) ?? [])].map((w) => w.toLowerCase());
  if (taken.includes(replacement.toLowerCase())) { reject(`replacement "${replacement}" is already used`); continue; }

  // Missions have no id in the source: the sample sentence marks where a mission starts
  const anchors = [
    `sentenceEn: '${mission.sampleSentenceEn.replace(/'/g, "\\'")}'`,
    `sentenceEn: "${mission.sampleSentenceEn}"`,
  ];
  const owners = [...files].filter(([, text]) => anchors.some((anchor) => text.includes(anchor)));
  if (owners.length !== 1) { reject(`mission ${mission.id} is in ${owners.length} files`); continue; }
  const [path] = owners[0];
  const text = edits.get(path) ?? files.get(path)!;
  const hits = anchors.map((anchor) => text.indexOf(anchor)).filter((at) => at >= 0);
  if (hits.length !== 1 || anchors.some((anchor) => text.indexOf(anchor) !== text.lastIndexOf(anchor))) {
    reject('the sample sentence is not unique in its file');
    continue;
  }
  const start = hits[0];
  const block = text.indexOf('clozeWrong: [', start);
  if (block < 0) { reject('no clozeWrong after the mission'); continue; }
  // Rows may sit on separate lines or all on one line: read them as pairs in order
  const rowsFrom = block + 'clozeWrong: ['.length;
  const rowLines = [...text.slice(rowsFrom).matchAll(/\[\s*('[^']*'|"[^"]*")\s*,\s*('[^']*'|"[^"]*")\s*\]/g)];
  const line = rowLines[wordIndex];
  if (!line) { reject('row not found'); continue; }
  // An earlier edit may have changed this row already: compare with what is there now
  const current = [line[1], line[2]].map((quoted) => quoted.slice(1, -1).toLowerCase());
  if (current.includes(replacement.toLowerCase())) { reject(`replacement "${replacement}" is already in the row ${line[0].trim()}`); continue; }
  const newLine = line[0].replace(new RegExp(`(['"])${finding.option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`), `'${replacement}'`);
  if (newLine === line[0]) { reject(`could not edit ${line[0].trim()}`); continue; }
  const at = rowsFrom + (line.index ?? 0);
  edits.set(path, text.slice(0, at) + newLine + text.slice(at + line[0].length));
  applied += 1;
  console.log(`${finding.id}  ${finding.option} -> ${replacement}   (${line[0].trim()})`);
}

if (IS_WRITE) edits.forEach((text, path) => writeFileSync(path, text));
console.log(`${applied} edits ${IS_WRITE ? 'written' : '(dry run)'}; ${problems.length} problems`);
problems.forEach((problem) => console.log(`  ! ${problem}`));
