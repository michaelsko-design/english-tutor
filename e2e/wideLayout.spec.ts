import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/test';
import { startAsNewLearner } from './support/app';

/**
 * The wide landscape layout (`wide:` = 1024px+ and landscape): the home panel beside the map,
 * the room beside its panel, sheets as centered cards. Phones and portrait tablets keep the
 * stacked phone layout. The desktop project (1280x720) is wide; the mobile project is not.
 */

const LANDSCAPE_TABLET = { width: 1366, height: 1024 };
const PORTRAIT_TABLET = { width: 1024, height: 1366 };
/** Pixels of slack for borders, shadows and rounding */
const SLACK_PX = 8;

type Box = { x: number; y: number; width: number; height: number };

async function boxOf(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element has no box');
  return box;
}

/** Side by side: one box ends (horizontally) before the other starts, and they share rows */
function isSideBySide(a: Box, b: Box): boolean {
  const isApart = a.x + a.width <= b.x + SLACK_PX || b.x + b.width <= a.x + SLACK_PX;
  const sharesRows = a.y < b.y + b.height && b.y < a.y + a.height;
  return isApart && sharesRows;
}

/** Stacked: the second box starts below the first */
function isStackedBelow(top: Box, below: Box): boolean {
  return below.y >= top.y + top.height - SLACK_PX;
}

const hero = (page: Page) => page.getByRole('region', { name: 'המשימה של היום' });
const map = (page: Page) => page.getByRole('region', { name: 'מפת העולם והמשימות' });

test.describe('wide layout', () => {
  test('home: the map beside the home panel on wide landscape screens, below it otherwise', async ({ page, learner }, testInfo) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    const isWideProject = testInfo.project.name === 'desktop';

    if (isWideProject) {
      expect(isSideBySide(await boxOf(hero(page)), await boxOf(map(page)))).toBe(true);
      // RTL: the home panel at the start (right), the map at the end (left)
      expect((await boxOf(map(page))).x).toBeLessThan((await boxOf(hero(page))).x);

      await page.setViewportSize(LANDSCAPE_TABLET);
      await expect.poll(async () => isSideBySide(await boxOf(hero(page)), await boxOf(map(page)))).toBe(true);

      await page.setViewportSize(PORTRAIT_TABLET);
      await expect.poll(async () => isStackedBelow(await boxOf(hero(page)), await boxOf(map(page)))).toBe(true);
    } else {
      expect(isStackedBelow(await boxOf(hero(page)), await boxOf(map(page)))).toBe(true);
    }
  });

  test('room: the panel beside the room on wide screens, below it on phones', async ({ page, learner }, testInfo) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    await page.getByRole('button', { name: /^החדר שלי/ }).click();
    const room = page.getByRole('dialog', { name: 'החדר האנגלי שלי' });
    const scene = room.locator('[style*="container-type"]').first();
    const inventory = room.getByRole('heading', { name: /הפריטים שלי/ });
    await expect(inventory).toBeVisible();

    const sceneBox = await boxOf(scene);
    const inventoryBox = await boxOf(inventory);
    if (testInfo.project.name === 'desktop') {
      expect(isSideBySide(sceneBox, inventoryBox)).toBe(true);
      // The whole room fits on screen, no scrolling needed
      expect(sceneBox.y + sceneBox.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    } else {
      expect(isStackedBelow(sceneBox, inventoryBox)).toBe(true);
    }
  });

  test('mission sheet: a centered card on wide screens, a bottom sheet on phones', async ({ page, learner }, testInfo) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    await map(page).getByRole('button', { name: /^משימה 1\.1/ }).click();
    const sheet = page.getByRole('dialog').filter({ has: page.locator('#mission-sheet-title') });
    await expect(sheet).toBeVisible();

    const box = await boxOf(sheet);
    const viewportHeight = page.viewportSize()!.height;
    const gapBelow = viewportHeight - (box.y + box.height);
    if (testInfo.project.name === 'desktop') {
      expect(gapBelow).toBeGreaterThan(SLACK_PX);
      expect(Math.abs(box.y - gapBelow)).toBeLessThanOrEqual(SLACK_PX * 2);
    } else {
      expect(gapBelow).toBeLessThanOrEqual(SLACK_PX);
    }
  });
});
