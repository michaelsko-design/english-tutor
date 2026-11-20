import type { Browser, BrowserContext, Page } from '@playwright/test';
import { createGoogleAccount, findUid, listDocumentIds, readDocument } from './support/emulator';
import { signInPageAsGoogleAccount } from './support/parent';
import { expect, test } from './support/test';
import { startAsNewLearner } from './support/app';

const CLOUD_TIMEOUT_MS = 20_000;
/** The localStorage switch that turns the Pro limits on in emulator runs (config/proTier.ts) */
const GATING_KEY = 'english_tutor_pro_gating';
const PRO_STOP = /זמינה ב-Pro/;

/** A separate browser for the parent, which can never reach a real Firebase host either. */
async function newParentPage(browser: Browser, baseURL: string): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ baseURL, locale: 'he-IL', timezoneId: 'Asia/Jerusalem', reducedMotion: 'reduce' });
  await context.route((url) => /(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(url.hostname), (route) => route.abort());
  await context.route(/\/api\/tts|\.mp3(\?|$)/, (route) => route.abort());
  return { context, page: await context.newPage() };
}

/** The pairing code the learner's "ask a parent" made */
async function findInviteCode(childUid: string): Promise<string> {
  for (const code of await listDocumentIds('parentInvites')) {
    if ((await readDocument(`parentInvites/${code}`))?.childUid === childUid) return code;
  }
  return '';
}

test.describe('Pro', () => {
  test('a learner asks a parent, the parent pays on the stand-in gateway, and the map opens', async ({ page, browser, learner }, testInfo) => {
    const baseURL = String(testInfo.project.use.baseURL);
    await page.addInitScript((key) => localStorage.setItem(key, 'on'), GATING_KEY);
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    const childUid = (await findUid(learner.username)) ?? '';
    expect(childUid).not.toBe('');

    // A Pro mission on the map leads to the neutral parents' info, whose shared link makes a pairing code
    const proStops = page.getByRole('button', { name: PRO_STOP });
    await expect(proStops.first()).toBeAttached({ timeout: CLOUD_TIMEOUT_MS });
    await proStops.first().click();
    await page.getByRole('button', { name: 'לאזור ההורים' }).click();
    const parentInfo = page.getByRole('dialog', { name: /מידע להורים/ });
    await expect(parentInfo).not.toContainText(/לבקש|לשדרג/);
    await parentInfo.getByRole('button', { name: 'שיתוף קישור לאזור ההורים' }).click();
    await expect.poll(() => findInviteCode(childUid), { timeout: CLOUD_TIMEOUT_MS }).not.toBe('');
    const code = await findInviteCode(childUid);

    const parent = await newParentPage(browser, baseURL);
    try {
      await parent.page.goto(`/?parent=${code}&pro=1`);
      await expect(parent.page.getByRole('button', { name: 'כניסה עם Google' })).toBeEnabled();
      await signInPageAsGoogleAccount(parent.page, await createGoogleAccount());
      await parent.page.getByRole('checkbox', { name: /ההורה או האפוטרופוס/ }).check();
      await parent.page.getByRole('button', { name: 'אישור החיבור' }).click();
      await expect(parent.page.getByTestId('child-pro-status')).toContainText('חשבון חינמי', { timeout: CLOUD_TIMEOUT_MS });
      // A child who never had Pro is offered the parent-started free week
      await expect(parent.page.getByRole('button', { name: 'שבוע Pro חינם לנועה' })).toBeVisible();

      // One plan-and-pay screen: monthly for the one child, the payer's details, then the stand-in gateway's page
      const checkout = parent.page.getByRole('form', { name: /מנוי/ });
      await expect(checkout.getByRole('checkbox', { name: /נועה/ })).toBeChecked();
      await checkout.getByRole('radio', { name: 'חודשי', exact: true }).click();
      await expect(checkout.getByTestId('pro-checkout-total')).toContainText('39');
      await checkout.getByLabel('שם מלא של המשלם/ת').fill('דנה כהן');
      await checkout.getByLabel('טלפון נייד').fill('050-1234567');
      await checkout.getByLabel(/אימייל לקבלה/).fill('dana@example.com');
      await expect(checkout.getByTestId('cancel-summary')).toContainText('ביטול בתוך 14 יום');
      await checkout.getByRole('checkbox', { name: /תנאי השימוש/ }).check();
      await checkout.getByRole('button', { name: 'המשך לתשלום' }).click();
      await expect(parent.page).toHaveURL(/[?&]mockpay=[a-f0-9]{32}/, { timeout: CLOUD_TIMEOUT_MS });
      await parent.page.getByRole('button', { name: 'תשלום לבדיקה' }).click();

      // Back in the portal: confirmed once the entitlement is written
      await expect(parent.page).toHaveURL(/[?&]paid=[a-f0-9]{32}/);
      await expect(parent.page.getByTestId('pro-payment-return')).toContainText('פעיל עכשיו עבור נועה', { timeout: CLOUD_TIMEOUT_MS });
      await expect(parent.page.getByTestId('transaction-summary')).toContainText('סיכום עסקה ופרטי ביטול');
      await expect(parent.page.getByTestId('child-pro-status')).toContainText('מנוי חודשי, מתחדש');
      expect(await readDocument(`entitlements/${childUid}`)).toMatchObject({ plan: 'pro', status: 'active', billingPeriod: 'monthly' });

      // The learner's map has no Pro stops any more
      await page.reload();
      await expect(page.getByRole('button', { name: /פתיחת החנות/ })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
      await expect(proStops).toHaveCount(0, { timeout: CLOUD_TIMEOUT_MS });

      // The paying parent first stops the renewal only (within 14 days a full refund is offered too)
      await parent.page.getByRole('button', { name: 'ביטול החידוש או המנוי' }).click();
      await expect(parent.page.getByTestId('cancel-plan-panel')).toContainText('יוחזר לכם כל הסכום', { timeout: CLOUD_TIMEOUT_MS });
      await parent.page.getByRole('button', { name: 'רק לבטל את החידוש, בלי החזר' }).click();
      await expect(parent.page.getByTestId('child-pro-status')).toContainText('המנוי בוטל, בתוקף עד', { timeout: CLOUD_TIMEOUT_MS });

      // Then asks for the full refund: Pro closes now, and the owner gets the refund task
      await parent.page.getByRole('button', { name: 'ביטול המנוי' }).click();
      await parent.page.getByRole('button', { name: 'ביטול והחזר מלא' }).click();
      await expect(parent.page.getByTestId('child-pro-status')).toContainText('חשבון חינמי', { timeout: CLOUD_TIMEOUT_MS });
      expect(await readDocument(`entitlements/${childUid}`)).toMatchObject({ status: 'expired' });
    } finally {
      await parent.context.close();
    }
  });
});
