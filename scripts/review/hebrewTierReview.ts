/**
 * Hebrew review of the curriculum (npm run review:he-tiers).
 *
 *   npm run review:he-tiers                  write review-out/he-tiers.html (open it in a browser)
 *   npm run review:he-tiers -- import <json> apply the file the page exported
 *
 * The page shows each English text next to its Hebrew; you mark it OK or type a better Hebrew.
 * "Export" downloads a JSON file. `import` writes the corrections into src/data/curriculum and
 * records every approved pair in scripts/review/hebrewTierReview.json. The ledger stores a hash of
 * English + Hebrew, so a pair edited later goes back into the unreviewed queue.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { collectReviewItems, pairHash } from './hebrewTierItems';

const ROOT = process.cwd();
const LEDGER_PATH = join(ROOT, 'scripts', 'review', 'hebrewTierReview.json');
const TEMPLATE_PATH = join(ROOT, 'scripts', 'review', 'hebrewTierPage.html');
const OUT_PATH = join(ROOT, 'review-out', 'he-tiers.html');
const CURRICULUM_DIR = join(ROOT, 'src', 'data', 'curriculum');
const DATA_MARKER = '/*__REVIEW_DATA__*/null';
/** Characters that would need escaping inside a quoted source string: such fixes stay manual. */
const UNSAFE_REPLACEMENT = /['"`\\\n]|\$\{/;

interface Ledger {
  approved: Record<string, 1>;
}

interface Fix {
  h: string;
  en: string;
  oldHe: string;
  newHe: string;
}

interface ExportFile {
  approved: string[];
  fixes: Fix[];
}

function loadLedger(): Ledger {
  if (!existsSync(LEDGER_PATH)) return { approved: {} };
  return JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) as Ledger;
}

function saveLedger(ledger: Ledger): void {
  const sorted = Object.fromEntries(Object.keys(ledger.approved).sort().map((key) => [key, 1 as const]));
  writeFileSync(LEDGER_PATH, `${JSON.stringify({ approved: sorted }, null, 1)}\n`, 'utf8');
}

function buildPage(): void {
  const ledger = loadLedger();
  const items = collectReviewItems();
  const data = { items, approved: Object.keys(ledger.approved) };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const html = readFileSync(TEMPLATE_PATH, 'utf8').replace(DATA_MARKER, () => json);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, html, 'utf8');
  const open = items.filter((item) => ledger.approved[item.h] === undefined).length;
  console.log(`${items.length} items, ${open} still to review.`);
  console.log(`Open ${OUT_PATH}`);
}

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listSourceFiles(path);
    return path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : [];
  });
}

function countOccurrences(text: string, part: string): number {
  return text.split(part).length - 1;
}

/** The source spellings of a whole string literal holding `text` (never a part of a longer string). */
function quotedForms(text: string): string[] {
  return ["'", '"', '`'].map((quote) => `${quote}${text}${quote}`);
}

/** Replaces `oldHe` by `newHe` when it is a whole string literal that occurs exactly once in the curriculum sources. */
function applyFix(fix: Fix, files: Map<string, string>): string {
  if (fix.newHe.trim() === '' || fix.newHe === fix.oldHe) return 'skipped (no change)';
  if (UNSAFE_REPLACEMENT.test(fix.newHe)) return 'MANUAL (contains a quote, backslash or newline)';
  const forms = quotedForms(fix.oldHe);
  const countIn = (text: string): number => forms.reduce((sum, form) => sum + countOccurrences(text, form), 0);
  const hits = [...files].filter(([, text]) => countIn(text) > 0);
  const total = hits.reduce((sum, [, text]) => sum + countIn(text), 0);
  if (total === 0) return 'MANUAL (old Hebrew not found as a whole string in the sources)';
  if (total > 1) return `MANUAL (the old Hebrew occurs ${total} times; change them by hand)`;
  const [path, text] = hits[0];
  const form = forms.find((candidate) => text.includes(candidate)) as string;
  files.set(path, text.replace(form, () => `${form[0]}${fix.newHe}${form[0]}`));
  return `applied in ${path.replace(`${ROOT}\\`, '').replace(`${ROOT}/`, '')}`;
}

function importFile(path: string): void {
  const exported = JSON.parse(readFileSync(path, 'utf8')) as ExportFile;
  const ledger = loadLedger();
  const files = new Map(listSourceFiles(CURRICULUM_DIR).map((file) => [file, readFileSync(file, 'utf8')]));
  const original = new Map(files);
  for (const h of exported.approved) ledger.approved[h] = 1;
  let manual = 0;
  for (const fix of exported.fixes) {
    const result = applyFix(fix, files);
    console.log(`- ${fix.en.slice(0, 60)}: ${result}`);
    if (result.startsWith('applied')) ledger.approved[pairHash(fix.en, fix.newHe)] = 1;
    else if (result.startsWith('MANUAL')) manual += 1;
  }
  for (const [file, text] of files) {
    if (text !== original.get(file)) writeFileSync(file, text, 'utf8');
  }
  saveLedger(ledger);
  console.log(`Ledger: ${Object.keys(ledger.approved).length} approved pairs. ${manual} fix(es) need a manual edit.`);
  console.log('Now run: npx vitest run src/data   (and re-run the TTS check for grades 1-2 Hebrew)');
}

const [command, argument] = process.argv.slice(2);
if (command === 'import') {
  if (argument === undefined) throw new Error('usage: review:he-tiers -- import <exported.json>');
  importFile(argument);
} else {
  buildPage();
}
