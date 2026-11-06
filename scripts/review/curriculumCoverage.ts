/**
 * How much of the Ministry of Education's official word and grammar lists (Lexical Bands and
 * Grammar Bands, Curriculum 2020) the app teaches, and by which grade.
 *
 *   python -I scripts/review/ministryWordLists.py     (once: official Excel → parsed JSON)
 *   npm run review:coverage                           (released content)
 *   npm run review:coverage -- --with-packs           (as if every content pack had shipped)
 *
 * Writes review-out/curriculum-coverage.html and .json. Matching is approximate (curriculumMatch/wordMatch.ts).
 * "Taught" = a mission vocabulary word. "Seen" = appears in any English the grade shows
 * (missions, mini-lessons, exam bank).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { BASE_CURRICULUM_BY_GRADE } from '../../src/data/curriculum/base';
import { ALL_EXAM_BANKS } from '../../src/data/curriculum/examBank';
import { ALL_LESSON_PACKS } from '../../src/data/curriculum/lessons';
import { ALL_EXAM_BANKS_WITH_PACKS, ALL_LESSON_PACKS_WITH_PACKS, CURRICULUM_WITH_ALL_PACKS } from '../../src/data/curriculum/packs/all';
import { checkHeading, type GrammarHeading, type GrammarResult } from './curriculumMatch/grammarRules';
import { buildIndex, entryFoundIn, entryVariants, normalizeText, variantForms, type TextIndex } from './curriculumMatch/wordMatch';

const WORD_LISTS_PATH = 'docs/ministry-sources/raw/parsed/wordLists.json';
const GRAMMAR_LISTS_PATH = 'docs/ministry-sources/raw/parsed/grammarLists.json';
/** Last grade of each grammar band (Curriculum 2020) */
const GRAMMAR_BAND_LAST_GRADE: Readonly<Record<string, number>> = { 'band-1': 6, 'band-2': 9, 'band-3': 12 };
const GRAMMAR_BAND_LABEL: Readonly<Record<string, string>> = {
  'band-1': 'Grammar Band I (grades 4–6)',
  'band-2': 'Grammar Band II (grades 7–9)',
  'band-3': 'Grammar Band III (grades 10–12)',
};
const OUT_DIR = 'review-out';
const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
/** Keys whose string values are English the learner sees */
const ENGLISH_KEY = /(En|^en)$|^(answer|correct|wrong|pattern|highlight|blendWords|sampleSentenceEn)$/;

interface OfficialEntry {
  list: string;
  entry: string;
  pos: string;
  family: string;
  recProd: 'rec' | 'prod' | '';
}

interface ListSpec {
  id: string;
  label: string;
  firstGrade: number;
  lastGrade: number;
}

/** Curriculum 2020, Table 2 (levels → bands → grades) */
const LISTS: readonly ListSpec[] = [
  { id: 'pre-band-1', label: 'Pre-Band I (Pre-A1)', firstGrade: 3, lastGrade: 3 },
  { id: 'band-1-core-1', label: 'Band I Core I (A1)', firstGrade: 4, lastGrade: 5 },
  { id: 'band-1-core-2', label: 'Band I Core II (A2)', firstGrade: 5, lastGrade: 6 },
  { id: 'band-2-core-1', label: 'Band II Core I (A2+)', firstGrade: 7, lastGrade: 8 },
  { id: 'band-2-core-2', label: 'Band II Core II (B1)', firstGrade: 8, lastGrade: 9 },
  { id: 'band-3-core-1', label: 'Band III Core I (B2, 4-point)', firstGrade: 10, lastGrade: 12 },
  { id: 'band-3-core-2', label: 'Band III Core II (B2, 5-point)', firstGrade: 10, lastGrade: 12 },
];

interface GradeTexts {
  taught: string[];
  seen: string[];
  /** Mission grammar topics and titles, for the grammar check */
  topics: string[];
}

function collectEnglish(value: unknown, key: string, out: string[]): void {
  if (typeof value === 'string') {
    if (ENGLISH_KEY.test(key)) out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectEnglish(item, key, out));
    return;
  }
  if (value !== null && typeof value === 'object') {
    Object.entries(value).forEach(([childKey, child]) => collectEnglish(child, childKey, out));
  }
}

function gradeTexts(withPacks: boolean): Map<number, GradeTexts> {
  const curriculum = withPacks ? CURRICULUM_WITH_ALL_PACKS : BASE_CURRICULUM_BY_GRADE;
  const lessons = withPacks ? ALL_LESSON_PACKS_WITH_PACKS : ALL_LESSON_PACKS;
  const exams = withPacks ? ALL_EXAM_BANKS_WITH_PACKS : ALL_EXAM_BANKS;
  const result = new Map<number, GradeTexts>();
  for (const grade of GRADES) {
    const pack = curriculum[`grade-${grade}` as keyof typeof curriculum];
    if (pack === undefined) throw new Error(`No curriculum for grade ${grade}`);
    const missions = pack.units.flatMap((unit) => unit.missions);
    const taught = missions.flatMap((mission) => mission.vocabulary.map((item) => item.wordEn));
    const seen: string[] = [...taught];
    collectEnglish(missions, '', seen);
    collectEnglish(lessons[grade] ?? {}, '', seen);
    collectEnglish(exams[grade] ?? {}, '', seen);
    const topics = missions.flatMap((mission) => [mission.grammarTopic, mission.titleEn]);
    result.set(grade, { taught, seen, topics });
  }
  return result;
}

function loadJsonList<T>(path: string): T[] {
  if (!existsSync(path)) {
    throw new Error(`${path} is missing: run "python -I scripts/review/ministryWordLists.py" first`);
  }
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf-8'));
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error(`${path} has no entries`);
  return parsed as T[];
}

/** The Ministry's first grade for a heading: "GRADE 5 (A1)" → 5; Bagrut-points levels → 10 */
function officialGrade(firstLevel: string | null): number | undefined {
  const grade = firstLevel?.match(/GRADE (\d+)/i);
  if (grade) return Number(grade[1]);
  return firstLevel !== null && /POINTS/i.test(firstLevel) ? 10 : undefined;
}

function checkGrammar(texts: Map<number, GradeTexts>): GrammarResult[] {
  const headings = loadJsonList<GrammarHeading>(GRAMMAR_LISTS_PATH);
  const grades = GRADES.map((grade) => ({ grade, topics: (texts.get(grade) as GradeTexts).topics }));
  return headings.map((h) => checkHeading(h, grades, GRAMMAR_BAND_LAST_GRADE[h.band] ?? 12));
}

const isLateInBand = (r: GrammarResult): boolean => {
  const ministry = officialGrade(r.firstLevel);
  return r.band !== 'band-3' && ministry !== undefined && r.appGrade !== undefined && r.appGrade > ministry;
};

function grammarSummaryLine(band: string, results: readonly GrammarResult[]): string {
  const inBand = results.filter((r) => r.band === band);
  const onTime = inBand.filter((r) => r.status === 'covered' || r.status === 'implicit').length;
  const late = inBand.filter((r) => r.status === 'covered' && isLateInBand(r)).length;
  const later = inBand.filter((r) => r.status === 'later').length;
  const none = inBand.filter((r) => r.status === 'missing' || r.status === 'no-rule').length;
  return `${(GRAMMAR_BAND_LABEL[band] ?? band).padEnd(32)} ${onTime}/${inBand.length} headings have a mission by the band's end (${late} later than the Ministry's grade), ${later} only after the band, ${none} none`;
}

const GRAMMAR_STATUS_LABEL: Readonly<Record<string, string>> = {
  covered: 'Has a mission',
  implicit: 'In every sentence',
  later: 'Only after the band',
  missing: 'No mission',
  'no-rule': 'Not checked',
};

function grammarRow(r: GrammarResult): string {
  const isLate = isLateInBand(r);
  const ministry = officialGrade(r.firstLevel);
  const when = r.appGrade === undefined ? '' : `grade ${r.appGrade}${isLate ? ` (Ministry: grade ${ministry})` : ''}`;
  const background = r.status === 'missing' ? '#fde2e2' : r.status === 'later' || isLate ? '#fff3cd' : 'transparent';
  return `<tr style="background:${background}"><td>${escapeHtml(r.heading)}</td><td>${escapeHtml(r.firstLevel ?? '')}</td><td>${GRAMMAR_STATUS_LABEL[r.status]}</td><td>${when}</td><td>${escapeHtml(r.appTopic ?? '')}</td></tr>`;
}

function renderGrammarHtml(results: readonly GrammarResult[]): string {
  return Object.keys(GRAMMAR_BAND_LAST_GRADE)
    .map((band) => {
      const rows = results.filter((r) => r.band === band).map(grammarRow).join('\n');
      return `<h3>${GRAMMAR_BAND_LABEL[band]}</h3><table><tr><th>Ministry heading</th><th>Ministry starts</th><th>App</th><th>First app grade</th><th>App topic</th></tr>${rows}</table>`;
    })
    .join('\n');
}

interface Cumulative {
  taught: TextIndex;
  seen: TextIndex;
}

/** Index of everything grades 1..N teach / show, for every N */
function cumulativeIndexes(texts: Map<number, GradeTexts>): Map<number, Cumulative> {
  const out = new Map<number, Cumulative>();
  for (const grade of GRADES) {
    const upTo = GRADES.filter((g) => g <= grade).map((g) => texts.get(g) as GradeTexts);
    out.set(grade, {
      taught: buildIndex(upTo.flatMap((t) => t.taught)),
      seen: buildIndex(upTo.flatMap((t) => t.seen)),
    });
  }
  return out;
}

type Status = 'taught' | 'seen' | 'later' | 'missing';

interface EntryResult {
  entry: string;
  recProd: string;
  status: Status;
  /** First grade that teaches it, when it is only taught after the band */
  laterGrade?: number;
}

interface ListResult {
  spec: ListSpec;
  total: number;
  prodTotal: number;
  counts: Record<Status, number>;
  prodCounts: Record<Status, number>;
  entries: EntryResult[];
}

function firstGradeWith(entry: string, indexes: Map<number, Cumulative>): number | undefined {
  return GRADES.find((grade) => entryFoundIn(entry, (indexes.get(grade) as Cumulative).seen));
}

function checkList(spec: ListSpec, entries: readonly OfficialEntry[], indexes: Map<number, Cumulative>): ListResult {
  const byEnd = indexes.get(spec.lastGrade) as Cumulative;
  const results: EntryResult[] = entries.map((official) => {
    const base = { entry: official.entry, recProd: official.recProd };
    if (entryFoundIn(official.entry, byEnd.taught)) return { ...base, status: 'taught' };
    if (entryFoundIn(official.entry, byEnd.seen)) return { ...base, status: 'seen' };
    const laterGrade = firstGradeWith(official.entry, indexes);
    return laterGrade === undefined ? { ...base, status: 'missing' } : { ...base, status: 'later', laterGrade };
  });
  const count = (items: EntryResult[]): Record<Status, number> => ({
    taught: items.filter((r) => r.status === 'taught').length,
    seen: items.filter((r) => r.status === 'seen').length,
    later: items.filter((r) => r.status === 'later').length,
    missing: items.filter((r) => r.status === 'missing').length,
  });
  const prod = results.filter((r) => r.recProd === 'prod');
  return { spec, total: results.length, prodTotal: prod.length, counts: count(results), prodCounts: count(prod), entries: results };
}

/** App vocabulary words of one grade that are not in the official lists for that grade or earlier */
interface BeyondWords {
  /** In a later band's list: "word (band-2-core-1)" */
  laterBand: string[];
  /** In no official list at all */
  noList: string[];
}

/** Every form of every entry in the given lists ("make" → make, makes, made, making …) */
function listForms(official: readonly OfficialEntry[], listIds: readonly string[]): Set<string> {
  const entries = official.filter((e) => listIds.includes(e.list));
  const texts = entries.flatMap((e) => [e.entry, ...e.family.split(/[,;]/)]).filter((t) => t.trim().length > 0);
  return new Set(texts.flatMap((text) => entryVariants(text).flatMap(variantForms)));
}

const isInForms = (word: string, forms: Set<string>): boolean => forms.has(normalizeText(word).trim());

function wordsBeyondLists(texts: Map<number, GradeTexts>, official: readonly OfficialEntry[]): Map<number, BeyondWords> {
  const perList = LISTS.map((spec) => ({ id: spec.id, forms: listForms(official, [spec.id]) }));
  const out = new Map<number, BeyondWords>();
  for (const grade of GRADES) {
    const allowed = listForms(official, LISTS.filter((spec) => spec.firstGrade <= Math.max(grade, 3)).map((spec) => spec.id));
    const words = [...new Set((texts.get(grade) as GradeTexts).taught.map((w) => w.trim()))].sort();
    const outside = words.filter((word) => !isInForms(word, allowed));
    const withList = outside.map((word) => ({ word, list: perList.find((l) => isInForms(word, l.forms))?.id }));
    out.set(grade, {
      laterBand: withList.filter((w) => w.list !== undefined).map((w) => `${w.word} (${w.list})`),
      noList: withList.filter((w) => w.list === undefined).map((w) => w.word),
    });
  }
  return out;
}

const pct = (n: number, total: number): string => (total === 0 ? '–' : `${Math.round((n / total) * 100)}%`);
const escapeHtml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function summaryLine(result: ListResult): string {
  const { counts, total, prodCounts, prodTotal, spec } = result;
  return `${spec.label.padEnd(32)} by end of grade ${String(spec.lastGrade).padStart(2)}: taught ${pct(counts.taught, total).padStart(4)}, seen ${pct(counts.taught + counts.seen, total).padStart(4)}  | productive words taught ${pct(prodCounts.taught, prodTotal).padStart(4)} | only later ${counts.later}, never ${counts.missing}`;
}

function renderHtml(results: readonly ListResult[], beyond: Map<number, BeyondWords>, grammar: readonly GrammarResult[], withPacks: boolean): string {
  const rows = results
    .map((r) => `<tr><td>${r.spec.label}</td><td>${r.spec.firstGrade}–${r.spec.lastGrade}</td><td>${r.total}</td><td>${pct(r.counts.taught, r.total)}</td><td>${pct(r.counts.taught + r.counts.seen, r.total)}</td><td>${pct(r.prodCounts.taught, r.prodTotal)}</td><td>${r.counts.later}</td><td>${r.counts.missing}</td></tr>`)
    .join('\n');
  const details = results
    .map((r) => {
      const list = (status: Status, title: string): string => {
        const items = r.entries.filter((e) => e.status === status);
        const text = items.map((e) => `${escapeHtml(e.entry)}${e.recProd === 'prod' ? '*' : ''}${e.laterGrade ? ` (g${e.laterGrade})` : ''}`).join(', ');
        return `<h4>${title} (${items.length})</h4><p>${text || '—'}</p>`;
      };
      return `<details><summary><b>${r.spec.label}</b></summary>${list('missing', 'Never in the app')}${list('later', 'Only after the band (first grade shown)')}${list('seen', 'Seen in text but not taught as vocabulary')}</details>`;
    })
    .join('\n');
  const beyondHtml = GRADES.map((g) => {
    const words = beyond.get(g) as BeyondWords;
    return `<details><summary>Grade ${g}: ${words.laterBand.length} from a later band, ${words.noList.length} in no list</summary><h4>From a later band</h4><p>${words.laterBand.map(escapeHtml).join(', ') || '—'}</p><h4>In no official list</h4><p>${words.noList.map(escapeHtml).join(', ') || '—'}</p></details>`;
  }).join('\n');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Curriculum coverage</title>
<style>body{font:14px system-ui;margin:24px;max-width:1100px}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}p{line-height:1.6}</style>
<h1>Ministry word lists vs. EnglishVibe ${withPacks ? '(all content packs)' : '(released content)'}</h1>
<p>Approximate matching (regular inflections + common irregulars). "Taught" = a mission vocabulary word in grades 1 to the band's last grade. "Seen" = taught or appears in any English the app shows in those grades. * = productive word in the official list.</p>
<table><tr><th>Official list</th><th>Grades</th><th>Entries</th><th>Taught</th><th>Taught + seen</th><th>Productive taught</th><th>Only later</th><th>Never</th></tr>${rows}</table>
<h2>Gaps per list</h2>${details}
<h2>App vocabulary outside the official lists for its grade</h2>
<p>"From a later band" = taught earlier than the Ministry plans. "In no list" = topic words the curriculum does not name. Neither is necessarily wrong.</p>${beyondHtml}
<h2>Grammar Bands vs. mission grammar topics</h2>
<p>Hand-written matching (scripts/review/curriculumMatch/grammarRules.ts) of each Ministry grammar heading against mission grammar topics and titles. "Has a mission" means a mission names the structure, not that every descriptor under the heading is practised. Yellow = later than the Ministry, red = no mission.</p>
${renderGrammarHtml(grammar)}
</html>`;
}

function main(): void {
  const withPacks = process.argv.includes('--with-packs');
  const official = loadJsonList<OfficialEntry>(WORD_LISTS_PATH);
  const texts = gradeTexts(withPacks);
  const indexes = cumulativeIndexes(texts);
  const results = LISTS.map((spec) => checkList(spec, official.filter((e) => e.list === spec.id), indexes));
  const beyond = wordsBeyondLists(texts, official);
  const grammar = checkGrammar(texts);

  mkdirSync(OUT_DIR, { recursive: true });
  const suffix = withPacks ? '-with-packs' : '';
  writeFileSync(`${OUT_DIR}/curriculum-coverage${suffix}.html`, renderHtml(results, beyond, grammar, withPacks));
  writeFileSync(
    `${OUT_DIR}/curriculum-coverage${suffix}.json`,
    JSON.stringify({ withPacks, lists: results, beyondLists: Object.fromEntries(beyond), grammar }, null, 1),
  );
  results.forEach((r) => console.log(summaryLine(r)));
  GRADES.forEach((g) => {
    const words = beyond.get(g) as BeyondWords;
    const count = new Set((texts.get(g) as GradeTexts).taught.map((w) => w.trim())).size;
    console.log(`grade ${String(g).padStart(2)}: ${String(count).padStart(3)} vocabulary words, ${words.laterBand.length} from a later band, ${words.noList.length} in no official list`);
  });
  Object.keys(GRAMMAR_BAND_LAST_GRADE).forEach((band) => console.log(grammarSummaryLine(band, grammar)));
  console.log(`\nwrote ${OUT_DIR}/curriculum-coverage${suffix}.html`);
}

main();
