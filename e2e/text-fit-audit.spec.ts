import { mkdirSync, writeFileSync } from 'node:fs';
import { Locator, Page } from '@playwright/test';
import { test } from './support/test';
import { startAsNewLearner } from './support/app';
import { answerStep, MAX_ROUNDS, missionDialog, NEXT_STEP } from './support/mission';

/**
 * Discovery audit, not a gate: walks the main phone screens at three widths and reports text that is
 * cut off (ellipsis, line clamp, hidden by an overflow:hidden ancestor) or broken in the middle of a word.
 * Reports land in test-results/text-fit-audit-*.json; run it with
 *   npx playwright test e2e/text-fit-audit.spec.ts --project=mobile
 */
const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
];
const REPORT_DIR = 'test-results';
const MAX_TEXT_CHARS = 60;

interface Finding {
  screen: string;
  viewport: string;
  kind: 'ellipsis' | 'line-clamp' | 'clipped' | 'mid-word-break';
  selector: string;
  text: string;
}

/** Runs in the page: returns the findings for what is on screen right now. */
function scanTextFit(): Omit<Finding, 'screen' | 'viewport'>[] {
  const found: Omit<Finding, 'screen' | 'viewport'>[] = [];
  const styles = new WeakMap<Element, CSSStyleDeclaration>();
  const styleOf = (el: Element): CSSStyleDeclaration => {
    const cached = styles.get(el) ?? getComputedStyle(el);
    styles.set(el, cached);
    return cached;
  };
  const describe = (el: Element): string => {
    const cls = (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean).slice(0, 4).join('.');
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  const isVisible = (el: Element): boolean => {
    const r = el.getBoundingClientRect();
    const s = styleOf(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  // Elements that directly own non-blank text
  const withText = Array.from(document.body.querySelectorAll('*')).filter(
    (el) =>
      isVisible(el) &&
      Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0)
  );
  for (const el of withText) {
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
    const s = styleOf(el);
    const base = { selector: describe(el), text };
    if (s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) {
      found.push({ kind: 'ellipsis', ...base });
    }
    const clamp = parseInt(s.getPropertyValue('-webkit-line-clamp'), 10);
    if (clamp > 0 && el.scrollHeight > el.clientHeight + 1) found.push({ kind: 'line-clamp', ...base });

    // A single unbroken word laid out on more than one line was split mid-word
    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent ?? '')
      .join('')
      .trim();
    if (ownText && !/\s/.test(ownText) && ownText.length > 4 && s.display !== 'inline') {
      const range = document.createRange();
      const lines = new Set<number>();
      for (const n of Array.from(el.childNodes).filter((c) => c.nodeType === Node.TEXT_NODE)) {
        range.selectNodeContents(n);
        for (const r of Array.from(range.getClientRects())) lines.add(Math.round(r.top));
      }
      if (lines.size > 1) found.push({ kind: 'mid-word-break', ...base });
    }
    // Hidden by an overflow:hidden ancestor
    const rect = el.getBoundingClientRect();
    // The nearest ancestor that clips decides whether this element is cut
    let clipper: HTMLElement | null = el.parentElement;
    while (clipper && clipper !== document.body) {
      const ps = styleOf(clipper);
      if (ps.overflowX !== 'visible' || ps.overflowY !== 'visible') {
        const pr = clipper.getBoundingClientRect();
        const isCut = rect.left < pr.left - 1 || rect.right > pr.right + 1;
        if (isCut && ps.overflowX === 'hidden') found.push({ kind: 'clipped', ...base });
        break;
      }
      clipper = clipper.parentElement;
    }
  }
  return found;
}

/** Closes whatever the last bar button opened (a sheet or a full screen) until the home screen shows again */
async function returnHome(page: Page, homeButton: Locator): Promise<void> {
  const play = page.getByRole('button', { name: 'בואי נשחק!' });
  for (let attempt = 0; attempt < 3 && !(await play.isVisible()); attempt++) {
    const close = page.getByRole('button', { name: 'סגירה' }).filter({ visible: true }).first();
    if (await close.isVisible()) await close.dispatchEvent('click');
    else await page.keyboard.press('Escape');
    if (!(await play.isVisible())) await homeButton.dispatchEvent('click', undefined, { timeout: 3_000 }).catch(() => undefined);
  }
}

function saveReport(name: string, findings: Finding[]): void {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(`${REPORT_DIR}/${name}.json`, JSON.stringify(findings, null, 2), 'utf8');
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'phone screens only');
});

/** Scans the current screen at every audit viewport; findings are de-duplicated and saved as they come */
function createAuditor(page: Page, reportName: string): (screen: string) => Promise<void> {
  const findings: Finding[] = [];
  const seen = new Set<string>();
  return async (screen) => {
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      const label = `${viewport.width}x${viewport.height}`;
      for (const f of await page.evaluate(scanTextFit)) {
        const key = `${screen}|${label}|${f.kind}|${f.selector}|${f.text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        findings.push({ screen, viewport: label, ...f, text: f.text.slice(0, MAX_TEXT_CHARS) });
        saveReport(reportName, findings);
      }
    }
  };
}

test('text-fit audit: home and the bottom-bar screens', async ({ page, learner }) => {
  test.setTimeout(240_000);
  const audit = createAuditor(page, 'text-fit-audit-screens');
  await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
  await audit('home');

  // Each bottom-bar destination (and the screen it opens) is audited, then closed again
  const barButtons = () => page.getByRole('navigation', { name: 'ניווט ראשי' }).getByRole('button');
  const names = (await barButtons().allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  const home = barButtons().first();
  for (const name of names) {
    const target = barButtons().filter({ hasText: name }).first();
    if (!(await target.isVisible())) break; // a screen that cannot be closed ends the walk
    await target.dispatchEvent('click');
    await audit(`bar: ${name}`);
    await returnHome(page, home);
  }
});

test('text-fit audit: a mission, intro to victory', async ({ page, learner }) => {
  test.setTimeout(240_000);
  const audit = createAuditor(page, 'text-fit-audit-mission');
  await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
  // A mission: intro, lesson cards and every practice step
  await page.getByRole('button', { name: 'בואי נשחק!' }).click();
  const mission = missionDialog(page);
  await audit('mission: intro');
  await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
  const practice = mission.getByRole('button', { name: /יאללה לתרגול/ });
  const nextCard = mission.getByRole('button', { name: /^הבא/ });
  for (let card = 0; card < MAX_ROUNDS && !(await practice.isVisible()); card++) {
    await audit(`mission: lesson card ${card + 1}`);
    await nextCard.click();
  }
  await practice.click();
  const collect = page.getByRole('button', { name: /איסוף פרסים/ });
  for (let round = 1; round <= MAX_ROUNDS && !(await collect.isVisible()); round++) {
    await audit(`mission: step ${round}`);
    try {
      await answerStep(page, mission);
    } catch {
      break; // a step type the helper cannot answer ends the walk; what was seen is still reported
    }
    await audit(`mission: step ${round} feedback`);
    const next = page.getByRole('button', { name: NEXT_STEP });
    if (!(await next.isVisible())) break;
    await next.click();
  }
});
