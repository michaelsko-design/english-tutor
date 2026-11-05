/**
 * Full Hebrew curriculum translation & pedagogy audit using Gemini 3.8 Flash.
 * Audits all 5,782 items across curriculum and packs with checkpointing.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectReviewItems, type ReviewItem } from './hebrewTierItems';

const ROOT = process.cwd();
const PROGRESS_PATH = join(ROOT, 'scripts', 'review', 'allHebrewAuditProgress.json');
const RESULT_PATH = join(ROOT, 'scripts', 'review', 'allHebrewAuditResult.json');
const FIXES_EXPORT_PATH = join(ROOT, 'review-out', 'he-tier-fixes.json');
const HTML_OUT_PATH = join(ROOT, 'review-out', 'he-tiers.html');

const CHUNK_SIZE = 45;
const CONCURRENCY = 3;

function readApiKey(): string {
  const envFile = join(ROOT, '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

export interface AuditEvaluation {
  h: string;
  kind: string;
  where: string;
  en: string;
  currentHe: string;
  status: 'OK' | 'FLAGGED';
  reason: string;
  suggestedFix: string;
}

function loadProgress(): Map<string, AuditEvaluation> {
  const map = new Map<string, AuditEvaluation>();
  if (existsSync(PROGRESS_PATH)) {
    try {
      const items = JSON.parse(readFileSync(PROGRESS_PATH, 'utf8')) as AuditEvaluation[];
      for (const it of items) map.set(it.h, it);
    } catch (e) {
      console.warn('Could not read existing progress file, starting fresh.');
    }
  }
  return map;
}

function saveProgress(evaluations: Map<string, AuditEvaluation>): void {
  writeFileSync(PROGRESS_PATH, JSON.stringify([...evaluations.values()], null, 2), 'utf8');
}

const systemPrompt = `You are a bilingual senior English-Hebrew pedagogic linguist and curriculum auditor for "EnglishVibe", a gamified English learning web app for Israeli school children (grades 1–12).

Audit the English-to-Hebrew items for accuracy, pedagogical suitability, and natural modern Israeli Hebrew.

Rubric:
1. Explanations (kind: "explain"):
   - Rule explanations: Does the Hebrew accurately explain the English grammar rule (e.g. passive voice, tenses, subject-verb agreement, connectors, punctuation)?
   - Hints: Do hints address the learner in gender-neutral plural (e.g. standard school phrasing "שימו לב: ...", "כדאי לבדוק ...") and avoid prematurely spoiling the direct answer?
2. Sentences & Stories (kind: "sentence", "story"):
   - Must be natural, fluent Israeli Hebrew without awkward machine-translation artifacts or literal idiom mistakes.
   - For voice tasks with dual-gender slashes (e.g. "שמח/ה"), ensure proper formatting.
3. Vocabulary (kind: "vocab"):
   - Must be accurate, clear, and appropriate for Israeli school curriculum levels.

Return a JSON array of objects for EVERY item provided:
[
  {
    "h": "string (the matching h from input)",
    "status": "OK" | "FLAGGED",
    "reason": "Clear explanation of the error/issue if FLAGGED, else \"\"",
    "suggestedFix": "Corrected Hebrew text if FLAGGED, else \"\""
  }
]`;

async function auditChunkWithRetry(
  apiKey: string,
  items: ReviewItem[],
  attempt = 1,
): Promise<Array<{ h: string; status: 'OK' | 'FLAGGED'; reason: string; suggestedFix: string }>> {
  const promptItems = items.map((it, idx) => ({
    index: idx + 1,
    h: it.h,
    kind: it.kind,
    where: it.where[0],
    en: it.en,
    currentHe: it.he,
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nHere are the items to audit:\n${JSON.stringify(promptItems, null, 2)}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      if ((res.status === 429 || res.status >= 500) && attempt <= 5) {
        const delay = attempt * 2000;
        console.warn(`[Batch Warning] Status ${res.status}, retrying after ${delay}ms... (attempt ${attempt})`);
        await new Promise((r) => setTimeout(r, delay));
        return auditChunkWithRetry(apiKey, items, attempt + 1);
      }
      throw new Error(`Gemini error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No candidate text received from Gemini');

    return JSON.parse(text);
  } catch (err: any) {
    if (attempt <= 4) {
      const delay = attempt * 2000;
      console.warn(`[Network Retry] ${err.message}, retrying after ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      return auditChunkWithRetry(apiKey, items, attempt + 1);
    }
    throw err;
  }
}

async function updateHeTiersHtml(evaluations: AuditEvaluation[]): Promise<void> {
  if (!existsSync(HTML_OUT_PATH)) return;
  let html = readFileSync(HTML_OUT_PATH, 'utf8');

  const fixes = evaluations.filter((e) => e.status === 'FLAGGED');
  const ok = evaluations.filter((e) => e.status === 'OK');

  const fixMap: Record<string, string> = {};
  for (const f of fixes) fixMap[f.h] = f.suggestedFix || f.currentHe;

  const okMap: Record<string, number> = {};
  for (const o of ok) okMap[o.h] = 1;

  const scriptAnchor = "const STORE = 'he-tier-review-v1';";
  const replacement = `const STORE = 'he-tier-review-v1';
const SEED_STATE = {
  ok: ${JSON.stringify(okMap)},
  fix: ${JSON.stringify(fixMap)}
};
let state = { ok: {}, fix: {} };
try {
  const local = JSON.parse(localStorage.getItem(STORE));
  state = local ? { ok: { ...SEED_STATE.ok, ...local.ok }, fix: { ...SEED_STATE.fix, ...local.fix } } : SEED_STATE;
} catch (e) { state = SEED_STATE; }
// Ensure seeded fixes are preserved
Object.assign(state.fix, SEED_STATE.fix);
save();`;

  if (html.includes(scriptAnchor)) {
    // Replace up to save(); or try block
    const endIdx = html.indexOf('const approvedBefore =', html.indexOf(scriptAnchor));
    if (endIdx !== -1) {
      const startIdx = html.indexOf(scriptAnchor);
      html = html.slice(0, startIdx) + replacement + '\n' + html.slice(endIdx);
      writeFileSync(HTML_OUT_PATH, html, 'utf8');
      console.log(`Updated ${HTML_OUT_PATH} with all audit states.`);
    }
  }
}

async function main(): Promise<void> {
  const apiKey = readApiKey();
  const allItems = collectReviewItems();
  console.log(`Total curriculum items collected: ${allItems.length}`);

  const progress = loadProgress();
  console.log(`Previously evaluated items in checkpoint: ${progress.size}`);

  const todo = allItems.filter((it) => !progress.has(it.h));
  console.log(`Items remaining to audit: ${todo.length}`);

  const chunks: ReviewItem[][] = [];
  for (let i = 0; i < todo.length; i += CHUNK_SIZE) {
    chunks.push(todo.slice(i, i + CHUNK_SIZE));
  }
  console.log(`Total chunks to process: ${chunks.length} (concurrency: ${CONCURRENCY})\n`);

  let completedChunks = 0;
  let activeIndex = 0;

  async function worker(): Promise<void> {
    while (activeIndex < chunks.length) {
      const idx = activeIndex++;
      const chunk = chunks[idx];
      const start = Date.now();
      try {
        const results = await auditChunkWithRetry(apiKey, chunk);
        const chunkMap = new Map(chunk.map((it) => [it.h, it]));

        for (const res of results) {
          const original = chunkMap.get(res.h);
          if (original) {
            progress.set(res.h, {
              h: res.h,
              kind: original.kind,
              where: original.where[0] ?? '',
              en: original.en,
              currentHe: original.he,
              status: res.status === 'FLAGGED' ? 'FLAGGED' : 'OK',
              reason: res.reason ?? '',
              suggestedFix: res.suggestedFix ?? '',
            });
          }
        }

        saveProgress(progress);
        completedChunks++;
        const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
        const pct = Math.round((progress.size / allItems.length) * 100);
        console.log(
          `[${completedChunks}/${chunks.length}] Chunk ${idx + 1} done (${chunk.length} items, ${elapsedSec}s) — Total evaluated: ${progress.size}/${allItems.length} (${pct}%)`,
        );

        // Small delay to be polite to rate limits
        await new Promise((r) => setTimeout(r, 600));
      } catch (err: any) {
        console.error(`Chunk ${idx + 1} failed permanently: ${err.message}`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, () => worker());
  await Promise.all(workers);

  const evaluations = [...progress.values()];
  writeFileSync(RESULT_PATH, JSON.stringify(evaluations, null, 2), 'utf8');

  const flagged = evaluations.filter((e) => e.status === 'FLAGGED');
  const ok = evaluations.filter((e) => e.status === 'OK');

  console.log(`\n================ AUDIT COMPLETED ================`);
  console.log(`Total items audited: ${evaluations.length}`);
  console.log(`Approved (OK): ${ok.length} (${Math.round((ok.length / evaluations.length) * 100)}%)`);
  console.log(`Flagged (FLAGGED): ${flagged.length} (${Math.round((flagged.length / evaluations.length) * 100)}%)`);
  console.log(`Results saved to: ${RESULT_PATH}`);

  // Create clean export file for the other agent
  const exportPayload = {
    approved: ok.map((o) => o.h),
    fixes: flagged.map((f) => ({
      h: f.h,
      en: f.en,
      oldHe: f.currentHe,
      newHe: f.suggestedFix || f.currentHe,
      reason: f.reason,
      where: f.where,
    })),
  };
  writeFileSync(FIXES_EXPORT_PATH, JSON.stringify(exportPayload, null, 2), 'utf8');
  console.log(`Updated handoff export file: ${FIXES_EXPORT_PATH}`);

  // Update HTML file
  await updateHeTiersHtml(evaluations);
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
