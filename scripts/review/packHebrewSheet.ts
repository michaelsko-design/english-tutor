/**
 * Hebrew review sheet for one content pack's lessons, exam bank and word decks
 * (npm run review:pack-he -- <pack id>). The mission text (stories, rules, tiers) is reviewed in
 * `npm run review:he-tiers`; this sheet covers the rest of the pack, numbered so fixes can be
 * referred to by row.
 *
 *   npm run review:pack-he -- core-4   write review-out/core-4-hebrew.html (open it in a browser)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_PACK_CONTENT } from '../../src/data/curriculum/packs/all';
import { packGrades } from '../../src/data/curriculum/packs/registry';
import type { ContentPackId } from '../../src/data/curriculum/packs/types';
import { getPackDecks } from '../../src/data/wordDecks/all';

interface Row {
  where: string;
  en: string;
  he: string;
}

const packId = process.argv[2] as ContentPackId | undefined;
const content = ALL_PACK_CONTENT.find((c) => c.pack.id === packId);
if (content === undefined) throw new Error(`usage: review:pack-he -- <pack id>; unknown pack "${packId ?? ''}"`);

const escape = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function lessonRows(grade: number): Row[] {
  const unitTag = `-u${content!.pack.idUnitNumber}-`;
  const lessons = Object.entries(content!.lessons[grade] ?? {}).filter(([id]) => id.includes(unitTag));
  return lessons.flatMap(([id, lesson]) => [
    { where: `${id} · title`, en: lesson.pattern ?? '', he: lesson.titleHe },
    { where: `${id} · idea`, en: '', he: lesson.ideaHe },
    ...lesson.examples.map((e, i) => ({ where: `${id} · example ${i + 1}`, en: e.en, he: e.he })),
    ...(lesson.tipHe ? [{ where: `${id} · tip`, en: '', he: lesson.tipHe }] : []),
    ...(lesson.quickTry
      ? [
          { where: `${id} · quick try`, en: lesson.quickTry.questionEn ?? lesson.quickTry.correct, he: lesson.quickTry.promptHe },
          { where: `${id} · quick try explanation`, en: lesson.quickTry.correct, he: lesson.quickTry.explainHe },
        ]
      : []),
  ]);
}

function bankRows(grade: number): Row[] {
  const bank = content!.examBanks[grade]?.[content!.pack.idUnitNumber];
  if (bank === undefined) return [];
  return [
    ...bank.vocabulary.map((v, i) => ({ where: `bank · vocabulary ${i + 1}`, en: `${v.clozeEn}  →  ${v.answer}`, he: v.clozeHe })),
    ...bank.grammar.flatMap((g, i) => [
      { where: `bank · grammar ${i + 1} · explanation`, en: `${g.questionEn}  →  ${g.correct}`, he: g.explainHe },
      { where: `bank · grammar ${i + 1} · hint`, en: '', he: g.hintHe },
    ]),
    ...bank.sentences.map((s, i) => ({ where: `bank · sentence ${i + 1}`, en: s.en, he: s.he })),
    ...bank.passages.flatMap((p, i) => [
      { where: `bank · passage ${i + 1}`, en: p.passageEn, he: p.passageHe },
      ...p.questions.map((q, j) => ({ where: `bank · passage ${i + 1} · question ${j + 1}`, en: `${q.questionEn}  →  ${q.correct}`, he: q.questionHe })),
    ]),
  ];
}

function deckRows(grade: number): Row[] {
  return getPackDecks(grade, [content!.pack.id])
    .filter((deck) => deck.packId === content!.pack.id)
    .flatMap((deck) => [
      { where: `deck · ${deck.topicEn}`, en: deck.topicEn, he: deck.topicHe },
      ...deck.items.flatMap((item) => [
        { where: `deck · ${item.wordEn} · gloss`, en: item.wordEn, he: item.translationHe },
        { where: `deck · ${item.wordEn} · example`, en: item.exampleEn, he: item.exampleHe },
      ]),
    ]);
}

/** English runs inside Hebrew text, isolated left-to-right as the app shows them (`utils/bidi.ts`) */
const LATIN_RUN = /[A-Za-z][A-Za-z0-9 '’,.?!…+/()-]*[A-Za-z0-9?!…)']|[A-Za-z]/g;
const hebrewCell = (text: string): string => escape(text).replace(LATIN_RUN, (run) => `<bdi dir="ltr">${run}</bdi>`);

let rowNumber = 0;
const sections = packGrades(content.pack).map((grade) => {
  const rows = [...lessonRows(grade), ...bankRows(grade), ...deckRows(grade)];
  const body = rows
    .map((row) => {
      rowNumber += 1;
      return `<tr><td class="n">${rowNumber}</td><td class="w">${escape(row.where)}</td><td class="en" dir="ltr" lang="en">${escape(row.en)}</td><td class="he" dir="rtl" lang="he">${hebrewCell(row.he)}</td></tr>`;
    })
    .join('\n');
  return `<h2>Grade ${grade}</h2>\n<table>${body}</table>`;
});

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${content.pack.id} Hebrew review</title>
<style>
:root { color-scheme: light dark; }
body { font: 15px/1.5 system-ui, sans-serif; margin: 16px; background: Canvas; color: CanvasText; }
table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
td { border-bottom: 1px solid color-mix(in srgb, CanvasText 15%, transparent); padding: 6px 8px; vertical-align: top; }
td.n { width: 3em; opacity: .6; } td.w { width: 16em; font-size: 13px; opacity: .75; }
td.he { font-size: 16px; }
</style></head><body>
<h1>${escape(content.pack.titleEn)} (${content.pack.id}): Hebrew in lessons, exam bank and decks</h1>
<p>${rowNumber} rows. Mission text is reviewed in <code>npm run review:he-tiers</code>. Refer to fixes by row number.</p>
${sections.join('\n')}
</body></html>`;

const outDir = join(process.cwd(), 'review-out');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${content.pack.id}-hebrew.html`);
writeFileSync(outPath, page);
console.log(`${rowNumber} rows. Open ${outPath}`);
