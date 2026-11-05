/**
 * Pilot Hebrew translation & pedagogy audit using Gemini 3.8 Flash.
 * Audits the top 30 highest-risk new tier items.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectReviewItems, type ReviewItem } from './hebrewTierItems';

const ROOT = process.cwd();
const RESULT_PATH = join(ROOT, 'scripts', 'review', 'pilotAuditResult.json');

function readApiKey(): string {
  const envFile = join(ROOT, '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

function calculateRisk(item: ReviewItem): number {
  let score = 0;
  if (item.kind === 'explain') score += 50;
  else if (item.kind === 'story') score += 20;
  else if (item.kind === 'sentence') score += 10;

  const where = item.where[0] || '';
  const gMatch = where.match(/g(\d+)/);
  const grade = gMatch ? parseInt(gMatch[1], 10) : 1;
  score += grade * 3;

  if (item.en.includes('→')) score += 15;
  if (item.en.length > 70) score += 10;
  if (item.he.includes('/')) score += 10;

  // Hints that miss standard conventions
  if (where.includes('hint') && !item.he.startsWith('שימו לב') && !item.he.startsWith('כדאי')) {
    score += 25;
  }

  // Semicolons or punctuation-heavy rules
  if (item.en.includes(';') || item.he.includes(';')) score += 15;

  return score;
}

export interface AuditEvaluation {
  h: string;
  en: string;
  where: string;
  currentHe: string;
  status: 'OK' | 'FLAGGED';
  reason: string;
  suggestedFix: string;
}

async function runPilot(): Promise<void> {
  const apiKey = readApiKey();
  const allNew = collectReviewItems().filter((item) => item.isNew);

  const prioritized = allNew
    .map((item) => ({ item, risk: calculateRisk(item) }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 30)
    .map((x) => x.item);

  console.log(`Selected 30 highest-risk items out of ${allNew.length} new tier items.`);
  console.log(`Sending to Gemini 3.8 Flash for audit...\n`);

  const promptItems = prioritized.map((it, idx) => ({
    index: idx + 1,
    h: it.h,
    where: it.where[0],
    kind: it.kind,
    en: it.en,
    currentHe: it.he,
  }));

  const systemPrompt = `You are a bilingual senior English-Hebrew pedagogic linguist and curriculum auditor for "EnglishVibe", a gamified English learning web app for Israeli school children (grades 1–12).

Your task is to audit newly authored English-to-Hebrew translations, rule explanations, and pedagogical hints.

Auditing Guidelines:
1. Pedagogical Accuracy: For rule explanations (kind: "explain", label: "Master error-fix explanation" or "Explorer rule explanation"), does the Hebrew explanation accurately describe the English grammar rule (e.g. passive voice, subject-verb agreement, connectors, tenses, punctuation)? Is it linguistically correct and easy for students to understand?
2. Hint Conventions: For hints (kind: "explain", label: "Explorer rule hint"), hints should address students in gender-neutral plural (e.g., standard Israeli educational phrasing like "שימו לב: ..." or "כדאי לבדוק ...") and should give a helpful clue without directly giving away the final answer.
3. Natural Israeli Hebrew: Is the Hebrew translation fluent, idiomatic, natural modern Israeli Hebrew, and free of literal translation calques or robotic phrasing?
4. Voice & Pronouns: If there are dual-gender slashes (e.g. "שמח/ה"), are they applied naturally and correctly?

For EACH item, return:
- h: string (the hash id from input)
- status: "OK" (if translation/explanation is natural, pedagogically correct, and follows conventions) or "FLAGGED" (if there is an error, awkward phrasing, incorrect grammar rule, broken hint convention, or better wording needed).
- reason: If FLAGGED, a concise explanation in Hebrew or English explaining the issue. If OK, leave empty string "".
- suggestedFix: If FLAGGED, provide the improved Hebrew text. If OK, leave empty string "".

Return a JSON array of objects matching this exact schema:
[
  {
    "h": "string",
    "status": "OK" | "FLAGGED",
    "reason": "string",
    "suggestedFix": "string"
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nHere are the 30 items to audit:\n${JSON.stringify(promptItems, null, 2)}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const resJson = await response.json();
  const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response content from Gemini 3.8 Flash');

  const evaluationsRaw = JSON.parse(text) as Array<{
    h: string;
    status: 'OK' | 'FLAGGED';
    reason: string;
    suggestedFix: string;
  }>;

  const itemMap = new Map(prioritized.map((it) => [it.h, it]));

  const evaluations: AuditEvaluation[] = evaluationsRaw.map((evalItem) => {
    const original = itemMap.get(evalItem.h);
    return {
      h: evalItem.h,
      where: original?.where[0] ?? '',
      en: original?.en ?? '',
      currentHe: original?.he ?? '',
      status: evalItem.status,
      reason: evalItem.reason,
      suggestedFix: evalItem.suggestedFix,
    };
  });

  writeFileSync(RESULT_PATH, JSON.stringify(evaluations, null, 2), 'utf8');

  const flagged = evaluations.filter((e) => e.status === 'FLAGGED');
  const ok = evaluations.filter((e) => e.status === 'OK');

  console.log(`================ AUDIT RESULTS ================`);
  console.log(`Total audited: ${evaluations.length}`);
  console.log(`OK: ${ok.length}`);
  console.log(`FLAGGED: ${flagged.length} (${Math.round((flagged.length / evaluations.length) * 100)}%)`);
  console.log(`Saved detailed report to: ${RESULT_PATH}\n`);

  if (flagged.length > 0) {
    console.log(`FLAGGED ITEMS:`);
    for (const f of flagged) {
      console.log(`\n--------------------------------------------------`);
      console.log(`ID: ${f.h} | Where: ${f.where}`);
      console.log(`EN: ${f.en}`);
      console.log(`HE (current):   ${f.currentHe}`);
      console.log(`Reason:         ${f.reason}`);
      console.log(`HE (suggested): ${f.suggestedFix}`);
    }
  }
}

runPilot().catch((err) => {
  console.error('Pilot audit failed:', err);
  process.exit(1);
});
