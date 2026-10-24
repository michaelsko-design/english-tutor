import { Page } from '@playwright/test';
import { expect, test } from './support/test';
import { completeOnboarding, register, startAsNewLearner } from './support/app';

/** Dev-server module URLs of the grade curriculum files (not the lessons or exam banks) */
const CURRICULUM_MODULE = /\/data\/curriculum\/(?:elementary|middleSchool|highSchool)\/grade(\d+)\.ts/;

/** Records which grades' curriculum files the page asks for. */
function trackCurriculumGrades(page: Page): () => number[] {
  const grades = new Set<number>();
  page.on('request', (request) => {
    const match = CURRICULUM_MODULE.exec(request.url());
    if (match) grades.add(Number(match[1]));
  });
  return () => [...grades].sort((a, b) => a - b);
}

/** The loading and error texts the screens show while a grade's curriculum is on its way */
const LOAD_FAILED = /לא הצלחנו לטעון/;

test.describe('curriculum loading', () => {
  test('a grade 1 learner downloads only the grade 1 curriculum on the way to the home screen', async ({
    page,
    learner,
  }) => {
    const gradesLoaded = trackCurriculumGrades(page);

    // Age 6: grade 1. The first launch (welcome chest, tour, placement offer) is skipped.
    await startAsNewLearner(page, learner, { name: 'נועה', age: 6 });

    expect(gradesLoaded()).toEqual([1]);
    await expect(page.getByText(LOAD_FAILED)).toHaveCount(0);
  });

  test('the placement test loads every grade only once the learner says they can read', async ({ page, learner }) => {
    const gradesLoaded = trackCurriculumGrades(page);
    await register(page, learner);
    await completeOnboarding(page, { name: 'נועה', age: 9 });
    await page.getByRole('button', { name: 'פתיחת תיבת המתנה' }).click();
    await page.getByRole('button', { name: /סיור קצר/ }).click();
    await page.getByRole('dialog', { name: 'סיור באפליקציה' }).getByRole('button', { name: 'דילוג' }).click();

    const test = page.getByRole('dialog', { name: 'מבחן רמה' });
    await expect(test).toBeVisible();
    // Still on "can you read English?": no grade has been fetched for the test yet
    expect(gradesLoaded()).toEqual([]);

    await test.getByRole('button').filter({ hasText: 'כן, אני יודעת לקרוא' }).click();
    const start = test.getByRole('button', { name: /בואי נתחיל/ });
    await expect(start).toBeEnabled();
    expect(gradesLoaded()).toHaveLength(12);

    await start.click();
    await expect(test.getByRole('progressbar', { name: 'התקדמות במבחן' })).toBeVisible();
    // A real question with answer options, not the loading placeholder
    await expect(test.locator('button[dir="auto"]').first()).toBeVisible();
  });

  test('the weekly report, word-list importer and exam prep open on the loaded curriculum', async ({
    page,
    learner,
  }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });

    // Weekly report
    await page.getByRole('button', { name: 'דוח להורים' }).click();
    const report = page.getByRole('dialog', { name: 'דוח התקדמות שבועי' });
    await expect(report.getByText('התקדמות כללית')).toBeVisible();
    await expect(report.getByText(LOAD_FAILED)).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(report).toBeHidden();

    // Word-list importer: a word of the curriculum gets its Hebrew translation from the word bank
    await page.getByRole('button', { name: 'רשימות מילים' }).click();
    await page.getByRole('button', { name: /ייבוא רשימה/ }).first().click();
    const importer = page.getByRole('dialog', { name: 'ייבוא רשימת מילים' });
    await importer.getByLabel('המילים מהדף').fill('apple\nbanana\nI like my school.');
    await expect(importer.getByText(/נמצאו 3 פריטים/)).toBeVisible();
    await expect(importer.getByRole('list', { name: 'תצוגה מקדימה' }).getByText('apple', { exact: true })).toBeVisible();
    // Escape closes the importer, then the word-list card behind it
    await page.keyboard.press('Escape');
    await expect(importer).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'רשימות המילים שלי' })).toBeHidden();

    // Exam prep: the grade's units are listed to choose from
    await page.getByRole('button', { name: 'הכנה למבחן' }).click();
    const setup = page.getByRole('dialog', { name: 'הכנה למבחן' });
    await setup.getByRole('region', { name: 'הכנה למבחן' }).getByRole('button').click();
    await expect(setup.getByRole('button', { name: /יחידה 1:/ })).toBeVisible();
    await expect(setup.getByText('טוענים את היחידות')).toHaveCount(0);
  });

  test('the games book builds a Word Scramble from the grade vocabulary', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });

    await page.getByRole('button', { name: 'החדר שלי' }).click();
    await page.getByRole('button', { name: /games book/ }).click();
    await page.getByRole('button', { name: /מילים מבולבלות/ }).click();

    // The first word of a puzzle built from the grade's vocabulary
    await expect(page.getByText(/מילה 1 מתוך \d+/)).toBeVisible();
    await expect(page.getByText(LOAD_FAILED)).toHaveCount(0);
  });
});

