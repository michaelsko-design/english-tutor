/**
 * Builds the vocabulary picture list: every grade 1–6 word with an emoji that a picture can show
 * (not `ABSTRACT_WORDS`), the hand-picked concrete words of grades 7–12 and the word decks
 * (`PICKED_WORDS`) and the grade 1 letter words and sentence that need one (`PHONICS_WORDS`),
 * one entry per word and meaning, packed 16 to a sheet.
 *
 * Writes  scripts/art/vocabPictureList.json         (input of renderVocabPictures.mjs and the slicer)
 *         src/components/art/vocabPictureIds.ts     (word → picture id, read by the app)
 * Existing entries keep their id, sheet and cell (hand-edited ones too, e.g. a redraw sheet), so re-running only adds new words on new sheets.
 *
 * Usage:  npx vite-node scripts/art/buildVocabPictureList.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CURRICULUM_BY_GRADE } from '../../src/test/curriculum';
import { ABSTRACT_WORDS } from '../../src/data/pictureCues';
import { ALL_WORD_DECKS } from '../../src/data/wordDecks/all';
import { BASE_CURRICULUM_BY_GRADE } from '../../src/data/curriculum/base';
import { ALL_PACK_CURRICULA } from '../../src/data/curriculum/packs';
import { withPacks } from '../../src/data/curriculum/packs/merge';
import { CONTENT_PACK_IDS } from '../../src/data/curriculum/packs/registry';
// @ts-expect-error plain JS module shared with the render script
import { SUBJECTS, defaultSubject } from './vocabPictureSubjects.mjs';

const ROOT = process.cwd();
const LIST_FILE = join(ROOT, 'scripts', 'art', 'vocabPictureList.json');
const IDS_FILE = join(ROOT, 'src', 'components', 'art', 'vocabPictureIds.ts');
const PER_SHEET = 16;
const MAX_GRADE = 6;
/** The pilot sheet, already drawn, in its cell order. */
const PILOT_KEYS = ['doll', 'desk', 'carpet', 'card', 'kitten', 'puppy', 'jump', 'fly', 'brother', 'sister', 'grandparents', 'bat|מחבט', 'box', 'teddy', 'chair', 'hat'];
/** Grade 7–12 and word-deck words a picture can show (most of the others are abstract), lowercase. */
const PICKED_WORDS: ReadonlySet<string> = new Set([
  // grades 7–12
  'audience', 'luggage', 'attendant', 'clue', 'summit', 'pollution', 'electricity', 'interview', 'listener', 'headline', 'document', 'graduation', 'monument',
  // grade 4 deck
  'road', 'hotel', 'store', 'restaurant', 'bank', 'city', 'walk', 'sign', 'ambulance', 'lie down', 'shoulder', 'arm', 'back', 'body', 'face', 'finger', 'hair', 'head', 'knee', 'neck',
  'hospital', 'fall', 'chicken', 'farm', 'zoo', 'mouse', 'grass', 'sea', 'tooth', 'noise', 'brown', 'black', 'white', 'hold', 'hear',
  // grade 5 deck
  'autumn', 'sky', 'wind', 'cloud', 'snow', 'wet', 'the cold', 'refrigerator', 'stove', 'mug', 'toothbrush', 'wash up', 'tidy', 'dining room', 'living room', 'shower', 'soap',
  'do the cleaning', 'feed', 'empty', 'knife', 'plate', 'fast food', 'order', 'meal', 'salad', 'rice', 'steak', 'sandwich', 'salt', 'fork', 'spoon', 'glass', 'bottle', 'coffee', 'tea',
  'thirsty', 'snack',
  // grade 6 deck
  'countryside', 'field', 'hill', 'island', 'wood', 'hole', 'smoke', 'grow', 'police station', 'police', 'nurse', 'university', 'meeting', 'pay', 'market', 'worker', 'waiter',
  'waitress', 'driver', 'office', 'grill', 'pour', 'fill', 'piece', 'garlic', 'potato', 'meat', 'butter', 'yogurt', 'jam', 'biscuit',
  // phase 5: grades 7–12 pack words
  'check in', 'rescue', 'alarm', 'battery', 'charge', 'cassette', 'spice', 'taste', 'earn', 'heavy', 'sunscreen', 'shelter', 'thunder', 'soaked', 'oil',
  'heater', 'shiver', 'parade', 'barbecue', 'campsite', 'sunburn', 'hike', 'pomegranate', 'storm', 'agriculture', 'heatwave', 'electronic', 'model',
  'calculate', 'nightmare', 'frighten', 'exodus', 'pioneer', 'appliance',
  // phase 5: place and size words of the grade 4–6 decks
  'far', 'behind', 'between', 'turn', 'upstairs', 'downstairs', 'deep', 'wide', 'plastic', 'bright', 'turn off',
]);
/** Lesson example sentences with a picture of their own (MiniLesson looks the sentence up), keyed by the sentence. */
const LESSON_SENTENCES: ReadonlyArray<{ word: string; he: string; emoji: string; id: string }> = [
  { word: "It is seven o'clock.", he: 'השעה שבע.', emoji: '🕖', id: 'vocab-clock-seven' },
  { word: 'It is half past two.', he: 'השעה שתיים וחצי.', emoji: '🕝', id: 'vocab-clock-half-past-two' },
  { word: 'The party is at six o’clock.', he: 'המסיבה בשעה שש.', emoji: '🕕', id: 'vocab-party-at-six' },
  { word: 'a little blue boat', he: 'סירה כחולה קטנה', emoji: '⛵', id: 'vocab-little-blue-boat' },
  { word: 'The snail is slow.', he: 'החילזון איטי.', emoji: '🐌', id: 'vocab-snail-is-slow' },
];
/** Grade 1 letter words and the first-sentence picture that aren't vocabulary words with a picture (or are abstract there). */
const PHONICS_WORDS: ReadonlyArray<{ word: string; he: string; emoji: string; id?: string }> = [
  { word: 'up', he: 'למעלה', emoji: '⬆️' },
  { word: 'zero', he: 'אפס', emoji: '0️⃣' },
  { word: 'net', he: 'רשת', emoji: '🥅' },
  { word: 'shell', he: 'צדף', emoji: '🐚' },
  { word: 'The cat is on the bed.', he: 'החתול על המיטה.', emoji: '🐱', id: 'vocab-cat-on-the-bed' },
];
/** Words whose meanings need pictures of their own, keyed `word|Hebrew`. */
const SPLIT_MEANINGS: Record<string, Record<string, string>> = {
  bat: { 'מחבט': 'vocab-bat', 'עטלף': 'vocab-bat-animal' },
  orange: { 'תפוז': 'vocab-orange', 'כתום': 'vocab-orange-color' },
};

interface Entry {
  key: string;
  id: string;
  word: string;
  he: string;
  emoji: string;
  subject: string;
  sheet: number;
  /** Position on the sheet, 0–15 in reading order */
  cell: number;
}

/** Only pictures whose sheet is drawn reach the app; the rest wait for their sheet (e.g. a redraw sheet held for later). */
const isSheetDrawn = (sheet: number) => existsSync(join(ROOT, 'art-src', 'vocab-sheets', `sheet-${sheet}.png`));

const slug = (word: string) => word.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function collectWords(): Map<string, Omit<Entry, 'sheet' | 'cell'>> {
  const words = new Map<string, Omit<Entry, 'sheet' | 'cell'>>();
  for (const [grade, pack] of Object.entries(CURRICULUM_BY_GRADE)) {
    if (Number(grade.split('-')[1]) > MAX_GRADE) continue;
    for (const unit of pack.units) {
      for (const mission of unit.missions) {
        for (const v of mission.vocabulary) {
          const lower = v.wordEn.trim().toLowerCase();
          if (!v.emoji || ABSTRACT_WORDS.has(lower)) continue;
          const split = SPLIT_MEANINGS[lower];
          const key = split ? `${lower}|${v.translationHe}` : lower;
          if (words.has(key)) continue;
          const id = split?.[v.translationHe] ?? `vocab-${slug(v.wordEn)}`;
          if (split && !split[v.translationHe]) throw new Error(`No picture id for ${key}`);
          words.set(key, { key, id, word: v.wordEn, he: v.translationHe, emoji: v.emoji, subject: SUBJECTS[key] ?? defaultSubject(v.wordEn, v.translationHe) });
        }
      }
    }
  }
  for (const p of [...PHONICS_WORDS, ...LESSON_SENTENCES]) addWord(words, p.word, p.he, p.emoji, p.id);
  // Picked words may come from packs not released yet, so their pictures are ready on release.
  for (const [grade, pack] of Object.entries(withPacks(BASE_CURRICULUM_BY_GRADE, CONTENT_PACK_IDS, ALL_PACK_CURRICULA))) {
    if (Number(grade.split('-')[1]) <= MAX_GRADE) continue;
    for (const v of pack.units.flatMap((u) => u.missions.flatMap((m) => m.vocabulary))) addPicked(words, v.wordEn, v.translationHe, v.emoji);
  }
  for (const v of Object.values(ALL_WORD_DECKS).flatMap((decks) => decks.flatMap((d) => d.items))) addPicked(words, v.wordEn, v.translationHe, v.emoji);
  const missing = [...PICKED_WORDS].filter((w) => !words.has(w));
  if (missing.length) throw new Error(`Picked words not found: ${missing.join(', ')}`);
  return words;
}

type WordMap = Map<string, Omit<Entry, 'sheet' | 'cell'>>;

function addWord(words: WordMap, wordEn: string, he: string, emoji: string, id?: string): void {
  const key = wordEn.trim().toLowerCase();
  if (words.has(key)) return;
  words.set(key, { key, id: id ?? `vocab-${slug(wordEn)}`, word: wordEn, he, emoji, subject: SUBJECTS[key] ?? defaultSubject(wordEn, he) });
}

function addPicked(words: WordMap, wordEn: string, he: string, emoji: string | undefined): void {
  if (PICKED_WORDS.has(wordEn.trim().toLowerCase())) addWord(words, wordEn, he, emoji ?? '');
}

function buildList(): Entry[] {
  const previous: Entry[] = existsSync(LIST_FILE) ? JSON.parse(readFileSync(LIST_FILE, 'utf8')) : [];
  const words = collectWords();
  const kept = previous.filter((e) => words.has(e.key)).map((e) => ({ ...words.get(e.key)!, sheet: e.sheet, cell: e.cell }));
  const taken = new Set(kept.map((e) => e.key));
  const entries = [...kept];
  if (!previous.length) {
    for (const [cell, key] of PILOT_KEYS.entries()) {
      if (!words.has(key)) throw new Error(`Pilot word missing from the curriculum: ${key}`);
      entries.push({ ...words.get(key)!, sheet: 1, cell });
      taken.add(key);
    }
  }
  let sheet = Math.max(0, ...entries.map((e) => e.sheet));
  // A last sheet not drawn yet (e.g. a redraw sheet) takes new words in its free cells first.
  let inSheet = sheet && !isSheetDrawn(sheet) ? Math.max(...entries.filter((e) => e.sheet === sheet).map((e) => e.cell)) + 1 : PER_SHEET;
  for (const [key, word] of words) {
    if (taken.has(key)) continue;
    if (inSheet === PER_SHEET) {
      sheet += 1;
      inSheet = 0;
    }
    entries.push({ ...word, sheet, cell: inSheet });
    inSheet += 1;
  }
  return entries;
}

function writeIds(entries: Entry[]): void {
  const lines = entries.filter((e) => isSheetDrawn(e.sheet)).map((e) => `  ${JSON.stringify(e.key)}: ${JSON.stringify(e.id)},`);
  const source = `/** Generated by scripts/art/buildVocabPictureList.ts: vocabulary word (or "word|Hebrew") → drawn picture id. */
export const VOCAB_PICTURE_IDS: Readonly<Record<string, string>> = {
${lines.join('\n')}
};

/** The drawn picture for a vocabulary word in this meaning, or undefined when none was drawn. */
export function getVocabPictureId(wordEn: string, translationHe?: string): string | undefined {
  const word = wordEn.trim().toLowerCase();
  return (translationHe ? VOCAB_PICTURE_IDS[\`\${word}|\${translationHe}\`] : undefined) ?? VOCAB_PICTURE_IDS[word];
}
`;
  writeFileSync(IDS_FILE, source);
}

const entries = buildList();
writeFileSync(LIST_FILE, JSON.stringify(entries, null, 2) + '\n');
writeIds(entries);
const sheets = new Set(entries.map((e) => e.sheet)).size;
console.log(`${entries.length} pictures on ${sheets} sheets (16 per sheet).`);
