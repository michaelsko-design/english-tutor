/**
 * Captures the real app screens shown on the landing page (public/site/screens/*.webp), on a phone,
 * against the Firebase emulators: `npm run site:screens`. A new grade-4 learner plays the first
 * mission, then opens the map, the word bank, the room, the parent report, a word list and an exam plan.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expectDashboard, startAsNewLearner } from '../../e2e/support/app';
import { answerStep, buildSentence, MAX_ROUNDS, missionDialog, NEXT_STEP } from '../../e2e/support/mission';
import { test } from '../../e2e/support/test';

const OUT_DIR = join('public', 'site', 'screens');
const WEBP_QUALITY = 0.86;
/** Twice the largest phone frame on the page */
const OUT_WIDTH_PX = 600;
/** Lets entrance animations and images settle before a screenshot */
const SETTLE_MS = 900;
const DAY_MS = 24 * 3600 * 1000;
const EXAM_IN_DAYS = 6;
const WORD_LIST = ['window - חלון', 'blanket - שמיכה', 'pillow - כרית', 'kitchen - מטבח', 'garden - גינה', 'stairs - מדרגות'];

/** Screenshots the page and saves it as WebP (encoded by the browser: no image library needed). */
async function capture(page: Page, name: string): Promise<void> {
  await page.waitForTimeout(SETTLE_MS);
  const png = (await page.screenshot()).toString('base64');
  const encoder = await page.context().newPage();
  const dataUrl = await encoder.evaluate(
    async ({ base64, quality, width }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round((image.naturalHeight * width) / image.naturalWidth);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('no canvas');
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', quality);
    },
    { base64: png, quality: WEBP_QUALITY, width: OUT_WIDTH_PX }
  );
  await encoder.close();
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, `${name}.webp`), Buffer.from(dataUrl.split(',')[1], 'base64'));
}

/** Back to a clean home screen (the progress is in the cloud, so a reload keeps it) */
async function backHome(page: Page): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    await page.reload({ waitUntil: 'load' });
    try {
      await expectDashboard(page);
      return;
    } catch (error) {
      // A reload now and then stalls on the cloud profile under load: one more try
      if (attempt >= 2) throw error;
    }
  }
}

const homeTile = (page: Page, label: RegExp) => page.getByRole('button', { name: label }).filter({ visible: true }).first();

async function playFirstMission(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'בואי נשחק!' }).click();
  const mission = missionDialog(page);
  await capture(page, 'mission-tiers');
  await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
  await capture(page, 'mini-lesson');
  await mission.getByRole('button', { name: /דילוג/ }).click();

  const collect = page.getByRole('button', { name: /איסוף פרסים/ });
  const check = mission.getByRole('button', { name: /בדיקת משפט/ });
  const doneReading = mission.getByRole('button', { name: /קראתי, לשאלה/ });
  const microphone = mission.getByRole('button', { name: /אני במקום שקט/ });
  for (let round = 0; round < MAX_ROUNDS && !(await collect.isVisible()); round++) {
    if (await check.isVisible()) {
      await buildSentence(mission);
      await capture(page, 'sentence-builder');
      await check.click();
    } else {
      if (await microphone.isVisible()) await capture(page, 'speak');
      if (await doneReading.isVisible()) {
        await capture(page, 'story');
        await doneReading.click();
      }
      await answerStep(page, mission);
    }
    await page.getByRole('button', { name: NEXT_STEP }).click();
  }
  await capture(page, 'victory');
  await collect.click();
  await expectDashboard(page);
}

async function importWordList(page: Page): Promise<void> {
  await homeTile(page, /רשימות מילים/).click();
  await page.getByRole('button', { name: /ייבוא רשימה/ }).click();
  const importer = page.getByRole('dialog', { name: 'ייבוא רשימת מילים' });
  await importer.getByPlaceholder(/./).first().fill('הכתבה ביום חמישי');
  await importer.locator('textarea').fill(WORD_LIST.map((line, idx) => `${idx + 1}. ${line}`).join('\n'));
  await capture(page, 'wordlist-import');
  await importer.getByRole('button', { name: /שמירת הרשימה/ }).click();
  await capture(page, 'wordlist-practice');
}

async function planExam(page: Page): Promise<void> {
  await homeTile(page, /הכנה למבחן/).click();
  await page.getByRole('dialog').getByRole('button', { name: /הכנה למבחן/ }).last().click();
  const examDate = new Date(Date.now() + EXAM_IN_DAYS * DAY_MS).toISOString().slice(0, 10);
  await page.locator('#exam-date').fill(examDate);
  await page.getByRole('dialog').getByRole('button', { name: /יחידה|פרק/ }).first().click();
  await page.getByRole('button', { name: /בניית התוכנית שלי/ }).click();
  await capture(page, 'exam-plan');
}

test('landing page screens', async ({ page, learner }) => {
  // The dev server compiles the app on the first browser load: give it time once
  await page.goto('/', { waitUntil: 'load', timeout: 240_000 });
  await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
  await capture(page, 'home');

  await playFirstMission(page);

  for (const [name, label] of [
    ['map', /^מפה$/],
    ['word-bank', /^מילים$/],
    ['room', /החדר שלי/],
    ['parent-report', /דוח להורים/],
  ] as const) {
    await homeTile(page, label).click();
    await capture(page, name);
    await backHome(page);
  }

  await importWordList(page);
  await backHome(page);
  await planExam(page);
});
