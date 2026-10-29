import type { Browser, BrowserContext, Page } from '@playwright/test';
import { createGoogleAccount, findUid, listDocumentIds, readDocument } from './support/emulator';
import { signInPageAsGoogleAccount } from './support/parent';
import { expect, test } from './support/test';
import { startAsNewLearner } from './support/app';

const CLOUD_TIMEOUT_MS = 20_000;
/** The learner's app waits this long before it publishes the report snapshot (useReportSnapshotPublisher) */
const SNAPSHOT_TIMEOUT_MS = 45_000;

/** A separate browser for the parent, which can never reach a real Firebase host either. */
async function newParentPage(browser: Browser, baseURL: string): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ baseURL, locale: 'he-IL', timezoneId: 'Asia/Jerusalem', reducedMotion: 'reduce' });
  await context.route((url) => /(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(url.hostname), (route) => route.abort());
  await context.route(/\/api\/tts|\.mp3(\?|$)/, (route) => route.abort());
  return { context, page: await context.newPage() };
}

test.describe('parent', () => {
  test('a learner invites a parent, who joins with Google and reads the weekly report', async ({ page, browser, learner }, testInfo) => {
    const baseURL = String(testInfo.project.use.baseURL);
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    const childUid = await findUid(learner.username);
    expect(childUid).not.toBeNull();

    // The optional home card opens the invite
    const card = page.getByRole('region', { name: 'הזמנת הורה' });
    await expect(card).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await card.getByRole('button', { name: 'להזמין הורה' }).click();
    const dialog = page.getByRole('dialog', { name: 'הזמנת הורה' });
    await dialog.getByRole('button', { name: /יצירת קוד להורה/ }).click();
    const code = (await dialog.getByText(/^[A-HJKMNP-Z2-9]{8}$/).textContent())?.trim() ?? '';
    expect(code).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
    expect(await readDocument(`parentInvites/${code}`)).not.toBeNull();

    const parent = await newParentPage(browser, baseURL);
    try {
      // The link opens the parent screen, not the learner app
      await parent.page.goto(`/?parent=${code}`);
      await expect(parent.page.getByRole('heading', { name: 'אזור הורים' })).toBeVisible();
      await expect(parent.page.getByText(code)).toBeVisible();
      await expect(parent.page.getByRole('button', { name: 'כניסה עם Google' })).toBeEnabled();
      const parentAccount = await createGoogleAccount();
      await signInPageAsGoogleAccount(parent.page, parentAccount);

      // The parent sees whose code it is and confirms
      await expect(parent.page.getByText(/לחבר את/)).toContainText('נועה', { timeout: CLOUD_TIMEOUT_MS });
      await expect(parent.page.getByRole('button', { name: 'אישור החיבור' })).toBeDisabled();
      await parent.page.getByRole('checkbox', { name: /ההורה או האפוטרופוס/ }).check();
      await parent.page.getByRole('button', { name: 'אישור החיבור' }).click();
      await expect(parent.page.getByRole('status').filter({ hasText: 'מחובר/ת' })).toBeVisible();
      await expect(parent.page.getByRole('button', { name: 'הדוח השבועי' })).toBeVisible();

      // The code is used up, and the parent has no learner profile of their own
      expect(await readDocument(`parentInvites/${code}`)).toBeNull();
      expect(await listDocumentIds('learners')).not.toContain(parentAccount.uid);
      expect(await readDocument(`parents/${parentAccount.uid}`)).not.toBeNull();

      // No report until the learner's app has seen the new link
      await parent.page.getByRole('button', { name: 'הדוח השבועי' }).click();
      await expect(parent.page.getByRole('status').filter({ hasText: 'עדיין אין דוח' })).toBeVisible();

      // The learner's app finds the link on its next start and publishes the report snapshot
      await expect.poll(() => readDocument(`learners/${childUid}`), { timeout: CLOUD_TIMEOUT_MS }).toMatchObject({ isOnboarded: true });
      await page.reload();
      await expect.poll(() => readDocument(`reportSnapshots/${childUid}`), { timeout: SNAPSHOT_TIMEOUT_MS }).not.toBeNull();

      await parent.page.getByRole('button', { name: 'הדוח השבועי' }).click();
      await expect(parent.page.getByRole('dialog', { name: 'דוח התקדמות שבועי' })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
      await expect(parent.page.getByRole('dialog')).toContainText('נועה');
      await parent.page.getByRole('button', { name: 'סגירה' }).click();

      // The parent can end the link, and then can't read the report any more
      await parent.page.getByRole('button', { name: 'ניתוק' }).click();
      await expect(parent.page.getByText(/עוד לא חובר אף לומד/)).toBeVisible();
    } finally {
      await parent.context.close();
    }
  });

  test('the parent screen refuses a learner account, and the learner app works with no parent', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'דני', age: 9 });

    const uid = await findUid(learner.username);
    await expect.poll(() => readDocument(`learners/${uid}`), { timeout: CLOUD_TIMEOUT_MS }).toMatchObject({ isOnboarded: true });

    // Closing the card leaves the app untouched and the card gone
    const card = page.getByRole('region', { name: 'הזמנת הורה' });
    await expect(card).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await card.getByRole('button', { name: 'סגירה' }).click();
    await expect(card).toBeHidden();
    await page.reload();
    await expect(page.getByRole('button', { name: /^פרופיל( והגדרות)?$/ }).filter({ visible: true }).first()).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await expect(page.getByRole('region', { name: 'הזמנת הורה' })).toBeHidden();

    // A learner signed in on this browser can't use it as a parent
    await page.goto('/?parent');
    await expect(page.getByRole('alert')).toContainText('מחוברים כרגע לחשבון של לומד');
    await expect(page.getByRole('button', { name: 'התנתקות' })).toBeVisible();
  });
});
