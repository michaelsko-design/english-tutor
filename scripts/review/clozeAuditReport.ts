/**
 * Merges the judge's results (result-NN.json) with the pre-checks into one page for a person to
 * review: only the questions a wrong option may also fit, with the suggested replacement.
 *
 *   npm run review:cloze-report   →   review-out/cloze-audit/report.html + flagged.json
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { AuditItem } from './clozeAudit';

const DIR = 'review-out/cloze-audit';

interface Finding {
  id: string;
  verdict: 'flag' | 'maybe';
  option: string;
  filledSentence: string;
  reason: string;
  replacement: string;
}

const readJson = <T>(file: string): T => JSON.parse(readFileSync(`${DIR}/${file}`, 'utf8')) as T;
const escapeHtml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function main(): void {
  const files = readdirSync(DIR);
  const items = files.filter((f) => f.startsWith('batch-')).flatMap((f) => readJson<AuditItem[]>(f));
  const byId = new Map(items.map((item) => [item.id, item]));
  const resultFiles = files.filter((f) => f.startsWith('result-'));
  const findings = resultFiles.flatMap((f) => readJson<Finding[]>(f));
  const missing = files.filter((f) => f.startsWith('batch-')).map((f) => f.replace('batch-', 'result-')).filter((f) => !resultFiles.includes(f));
  const pre = readJson<{ id: string; problem: string }[]>('prechecks.json').filter((p) => !p.problem.includes('is a wrong option in'));

  const order = (finding: Finding): number => (finding.verdict === 'flag' ? 0 : 1);
  const sorted = [...findings].sort((a, b) => order(a) - order(b));
  writeFileSync(`${DIR}/flagged.json`, JSON.stringify(sorted, null, 1));

  const cards = sorted.map((finding) => {
    const item = byId.get(finding.id);
    return `<section class="${finding.verdict}"><div class="where">${escapeHtml(finding.id)} · ${finding.verdict}</div>
<div>${escapeHtml(item?.sentence ?? '')}  <span class="ok">✓ ${escapeHtml(item?.correct ?? '')}</span></div>
<div class="bad">✗ ${escapeHtml(finding.option)} → ${escapeHtml(finding.filledSentence)}</div>
<div>${escapeHtml(finding.reason)} · <b>replace with: ${escapeHtml(finding.replacement)}</b></div></section>`;
  });
  const preCards = pre.map((p) => `<li>${escapeHtml(p.id)}: ${escapeHtml(p.problem)}</li>`);
  const flags = findings.filter((f) => f.verdict === 'flag').length;
  const html = `<!doctype html><html lang="en" dir="ltr"><meta charset="utf-8"><title>Cloze audit</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:860px;margin:0 auto;padding:16px}
section{border:1px solid #ccc;border-radius:10px;padding:10px 14px;margin:10px 0}section.flag{border-color:#d9482b}
.where{font-size:12px;color:#777}.ok{color:#1f9d55}.bad{color:#b33}</style>
<h1>Cloze audit: ${flags} flagged, ${findings.length - flags} maybe, out of ${items.length} questions</h1>
${missing.length ? `<p><b>No result yet for: ${missing.join(', ')}</b></p>` : ''}
${cards.join('\n')}
<h2>Pre-check notes (${pre.length})</h2><ul>${preCards.join('')}</ul></html>`;
  writeFileSync(`${DIR}/report.html`, html);
  console.log(`${items.length} questions, ${flags} flagged, ${findings.length - flags} maybe, ${pre.length} pre-check notes${missing.length ? `, missing ${missing.join(' ')}` : ''}`);
}

main();
