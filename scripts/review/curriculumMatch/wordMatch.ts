/**
 * Matching official Ministry word-list entries ("airplane/plane", "look after sb", "a/an") against
 * the English the app shows. Approximate on purpose: regular inflections plus a short irregular
 * table, no dictionary. Used only by curriculumCoverage.ts.
 */

/** Placeholders in phrasal entries ("look after sb") that stand for any words */
const PLACEHOLDERS = new Set(['sb', 'sth', 'swh', "sb's", "one's", 'etc']);

const IRREGULAR: Readonly<Record<string, readonly string[]>> = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being', "i'm", "it's", "he's", "she's", "we're", "they're", "you're"],
  have: ['has', 'had', 'having'],
  do: ['does', 'did', 'done', 'doing'],
  go: ['goes', 'went', 'gone', 'going'],
  get: ['gets', 'got', 'gotten', 'getting'],
  make: ['made'], take: ['took', 'taken'], come: ['came'], see: ['saw', 'seen'], know: ['knew', 'known'],
  give: ['gave', 'given'], find: ['found'], think: ['thought'], tell: ['told'], say: ['said'],
  become: ['became'], leave: ['left'], feel: ['felt'], bring: ['brought'], begin: ['began', 'begun'],
  keep: ['kept'], hold: ['held'], write: ['wrote', 'written'], stand: ['stood'], hear: ['heard'],
  let: ['lets'], mean: ['meant'], set: ['sets'], meet: ['met'], run: ['ran'], pay: ['paid'],
  sit: ['sat'], speak: ['spoke', 'spoken'], lie: ['lay', 'lain', 'lying'], lead: ['led'], read: ['reads'],
  grow: ['grew', 'grown'], lose: ['lost'], fall: ['fell', 'fallen'], send: ['sent'], build: ['built'],
  understand: ['understood'], draw: ['drew', 'drawn'], break: ['broke', 'broken'], spend: ['spent'],
  cut: ['cuts'], rise: ['rose', 'risen'], drive: ['drove', 'driven'], buy: ['bought'], wear: ['wore', 'worn'],
  choose: ['chose', 'chosen'], eat: ['ate', 'eaten'], drink: ['drank', 'drunk'], sing: ['sang', 'sung'],
  swim: ['swam', 'swum'], fly: ['flew', 'flown', 'flies'], sleep: ['slept'], teach: ['taught'],
  catch: ['caught'], fight: ['fought'], throw: ['threw', 'thrown'], forget: ['forgot', 'forgotten'],
  win: ['won'], sell: ['sold'], hide: ['hid', 'hidden'], ride: ['rode', 'ridden'], shake: ['shook', 'shaken'],
  steal: ['stole', 'stolen'], wake: ['woke', 'woken'], feed: ['fed'], hang: ['hung'], shoot: ['shot'],
  bite: ['bit', 'bitten'], blow: ['blew', 'blown'], freeze: ['froze', 'frozen'], dig: ['dug'], light: ['lit'],
  can: ['could', "can't", 'cannot'], will: ['would', "won't", "'ll"], shall: ['should'], may: ['might'],
  child: ['children'], man: ['men'], woman: ['women'], person: ['people'], foot: ['feet'],
  tooth: ['teeth'], mouse: ['mice'], fish: ['fish'], sheep: ['sheep'], leaf: ['leaves'], knife: ['knives'],
  life: ['lives'], wife: ['wives'], half: ['halves'], shelf: ['shelves'], wolf: ['wolves'],
  good: ['better', 'best'], bad: ['worse', 'worst'], far: ['farther', 'further', 'farthest', 'furthest'],
  little: ['less', 'least'], many: ['more', 'most'], much: ['more', 'most'],
  i: ['me', 'my', 'mine'], he: ['him', 'his'], she: ['her', 'hers'], we: ['us', 'our', 'ours'],
  they: ['them', 'their', 'theirs'], you: ['your', 'yours'], it: ['its'],
};

const VOWELS = /[aeiou]/;

/** Short forms written out, so "What's this?" and "What is this?" match */
const CONTRACTIONS: readonly [RegExp, string][] = [
  [/\b(i)'m\b/g, '$1 am'],
  [/\b(what|where|who|it|he|she|that|there|how)'s\b/g, '$1 is'],
  [/\b(you|we|they)'re\b/g, '$1 are'],
  [/\b(can)'t\b/g, 'cannot'],
  [/\b(won)'t\b/g, 'will not'],
  [/\b(do|does|did|is|are|was|were|have|has|had|could|would|should|must)n't\b/g, '$1 not'],
];

/** Lower-case, curly quotes to straight, short forms written out, everything else but letters, digits and apostrophes to a space */
export function normalizeText(text: string): string {
  const lower = text.toLowerCase().replace(/[‘’ʼ]/g, "'");
  const expanded = CONTRACTIONS.reduce((acc, [pattern, full]) => acc.replace(pattern, full), lower);
  return ` ${expanded
    .replace(/[^a-z0-9']+/g, ' ')
    .replace(/(^|\s)'+|'+(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

/** Regular and irregular forms of one word, including the word itself */
export function inflect(word: string): string[] {
  const forms = new Set<string>([word, `${word}s`, `${word}es`, `${word}ed`, `${word}ing`, `${word}er`, `${word}est`, `${word}'s`]);
  const last = word.slice(-1);
  const stem = word.slice(0, -1);
  if (last === 'e') ['d', 'r', 'st'].forEach((end) => forms.add(`${word}${end}`));
  if (last === 'e') forms.add(`${stem}ing`);
  if (last === 'y' && !VOWELS.test(word.slice(-2, -1))) ['ies', 'ied', 'ier', 'iest', 'ily'].forEach((end) => forms.add(`${stem}${end}`));
  if (word.endsWith('f')) forms.add(`${stem}ves`);
  if (word.endsWith('fe')) forms.add(`${word.slice(0, -2)}ves`);
  const isShortCvc = word.length >= 3 && word.length <= 4 && /[^aeiou][aeiou][^aeiouwxy]$/.test(word);
  if (isShortCvc) ['ed', 'ing', 'er', 'est'].forEach((end) => forms.add(`${word}${last}${end}`));
  forms.add(`${word}ly`);
  (IRREGULAR[word] ?? []).forEach((form) => forms.add(form));
  return [...forms];
}

/**
 * The searchable variants of an official entry: "airplane/plane" → ["airplane", "plane"],
 * "a quarter to/a quarter past" → both phrases, "look after sb" → ["look after"].
 */
export function entryVariants(entry: string): string[] {
  const withoutNotes = entry.replace(/\([^)]*\)/g, ' ').replace(/\betc\.?/gi, ' ');
  // Alternatives are split by "/", and sentence chunks by "?", "!" or an ellipsis ("Where is the …? Where's the …")
  const variants = withoutNotes
    .split(/\/|[?!]|…|\.\.\./)
    .map((part) => normalizeText(part).trim().split(' ').filter((w) => w && !PLACEHOLDERS.has(w)).join(' '))
    .filter((part) => part.length > 0);
  return [...new Set(variants)];
}

/** Every searchable form of one variant: single words inflected, phrases with the first word inflected */
export function variantForms(variant: string): string[] {
  const [first, ...rest] = variant.split(' ');
  const tail = rest.length > 0 ? ` ${rest.join(' ')}` : '';
  return inflect(first).map((form) => `${form}${tail}`);
}

/** Index of normalized text: single words in a Set, the whole text kept for phrase search */
export interface TextIndex {
  words: Set<string>;
  text: string;
}

export function buildIndex(texts: readonly string[]): TextIndex {
  const text = texts.map(normalizeText).join('|');
  const words = new Set(text.split(/[\s|]+/).filter(Boolean));
  return { words, text };
}

export function indexHas(index: TextIndex, form: string): boolean {
  return form.includes(' ') ? index.text.includes(` ${form} `) : index.words.has(form);
}

/** True when any variant of the entry, in any form, is in the index */
export function entryFoundIn(entry: string, index: TextIndex): boolean {
  return entryVariants(entry).some((variant) => variantForms(variant).some((form) => indexHas(index, form)));
}
