import type { Browser, BrowserContext, Page } from '@playwright/test';
import {
  createAccount,
  createGoogleAccount,
  createInviteCode,
  deleteDocument,
  findUid,
  listDocumentIds,
  readDocument,
  setAccessOpen,
  writeDocument,
} from './support/emulator';
import { signInPageAsGoogleAccount } from './support/parent';
import { completeOnboarding, expectDashboard, openSettings, register, signIn, skipFirstLaunch } from './support/app';
import { expect, test } from './support/test';

const CLOUD_TIMEOUT_MS = 20_000;
const GATE_HEADING = 'האפליקציה בבדיקות סגורות';

/** The invite screen: shown to a signed-in account that is not allowed */
const gateHeading = (page: Page) => page.getByRole('heading', { name: GATE_HEADING });

async function submitCode(page: Page, code: string): Promise<void> {
  await page.getByLabel('קוד הזמנה').fill(code);
  await page.getByRole('button', { name: 'כניסה', exact: true }).click();
}

/** Registers through an invite link: the code redeems itself and the app reloads into onboarding. */
async function joinWithLink(page: Page, learner: { username: string; pin: string }, code: string): Promise<string> {
  await register(page, learner, `/?access=${code}`);
  await expect(page.getByLabel('איך קוראים לך?')).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
  const uid = await findUid(learner.username);
  expect(uid).not.toBeNull();
  return uid as string;
}

async function finishOnboarding(page: Page): Promise<void> {
  await completeOnboarding(page, { name: 'נועה', age: 9 });
  await skipFirstLaunch(page);
}

async function newParentPage(browser: Browser, baseURL: string): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ baseURL, locale: 'he-IL', timezoneId: 'Asia/Jerusalem', reducedMotion: 'reduce' });
  await context.route((url) => /(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(url.hostname), (route) => route.abort());
  await context.route(/\/api\/tts|\.mp3(\?|$)/, (route) => route.abort());
  return { context, page: await context.newPage() };
}

async function expectNoDashboard(page: Page): Promise<void> {
  await expect(page.getByRole('button', { name: /^פרופיל( והגדרות)?$/ }).filter({ visible: true })).toHaveCount(0);
}

test.describe('early testers (closed access)', () => {
  test.beforeEach(async () => {
    await setAccessOpen(false);
  });
  test.afterEach(async () => {
    // Every other spec runs with access open
    await setAccessOpen(true);
  });

  test('an account that was never invited sees only the invite screen', async ({ page, learner }) => {
    await register(page, learner);
    await expect(gateHeading(page)).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await expect(page.getByLabel('איך קוראים לך?')).toHaveCount(0);
    const uid = await findUid(learner.username);
    expect(await readDocument(`learners/${uid}`)).toBeNull();

    // The button waits for a full code, and an unknown code is refused with a message
    await expect(page.getByRole('button', { name: 'כניסה', exact: true })).toBeDisabled();
    await submitCode(page, 'ZZZZZZZZ22');
    await expect(page.getByRole('alert')).toContainText('לא מצאנו את הקוד');
    expect(await readDocument(`allowed/${uid}`)).toBeNull();
  });

  test('an invite link lets a new child in, allowed with free Pro, and uses the code up', async ({ page, learner }) => {
    const code = await createInviteCode('kid-1');
    const uid = await joinWithLink(page, learner, code);

    expect(await readDocument(`allowed/${uid}`)).toMatchObject({ label: 'kid-1', cohort: 'e2e' });
    expect(await readDocument(`entitlements/${uid}`)).toMatchObject({ plan: 'pro', source: 'comp' });
    expect(await readDocument(`invites/${code}`)).toMatchObject({ usedByUid: uid });

    await finishOnboarding(page);
    await expect.poll(() => readDocument(`learners/${uid}`), { timeout: CLOUD_TIMEOUT_MS }).toMatchObject({ isOnboarded: true });
    // The code is gone from the address bar
    expect(page.url()).not.toContain('access=');
  });

  test('a used link does not work for a second account, and an expired one does not work at all', async ({ page, browser, learner }, testInfo) => {
    const code = await createInviteCode('kid-2');
    await joinWithLink(page, learner, code);

    const second = await browser.newContext({ baseURL: String(testInfo.project.use.baseURL), locale: 'he-IL', reducedMotion: 'reduce' });
    try {
      const otherPage = await second.newPage();
      await register(otherPage, { username: `${learner.username}b`, pin: learner.pin }, `/?access=${code}`);
      await expect(gateHeading(otherPage)).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
      await expect(otherPage.getByRole('alert')).toContainText('כבר נוצל', { timeout: CLOUD_TIMEOUT_MS });
      const otherUid = await findUid(`${learner.username}b`);
      expect(await readDocument(`allowed/${otherUid}`)).toBeNull();

      const expired = await createInviteCode('kid-expired', { expiresInMs: -1000 });
      await submitCode(otherPage, expired);
      await expect(otherPage.getByRole('alert')).toContainText('תוקף הקוד פג');
      expect(await readDocument(`allowed/${otherUid}`)).toBeNull();
    } finally {
      await second.close();
    }
  });

  test('an existing account that was allowed in advance keeps working without a code', async ({ page, learner }) => {
    const uid = await createAccount(learner);
    await writeDocument(`allowed/${uid}`, { cohort: 'family', label: learner.username, invitedAt: Date.now(), grandfathered: true });
    await signIn(page, learner);
    await expect(page.getByLabel('איך קוראים לך?')).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await expect(gateHeading(page)).toHaveCount(0);
  });

  test('locking a tester out closes the app for them, and a new invite brings them back with their data', async ({ page, learner }) => {
    const uid = await joinWithLink(page, learner, await createInviteCode('kid-3'));
    await finishOnboarding(page);
    await expect.poll(() => readDocument(`learners/${uid}`), { timeout: CLOUD_TIMEOUT_MS }).toMatchObject({ isOnboarded: true });

    // What the dashboard's "Lock out" does
    await deleteDocument(`allowed/${uid}`);
    await deleteDocument(`entitlements/${uid}`);

    // On the next open the app must not start from the profile cached on the device
    await page.reload();
    await expect(gateHeading(page)).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await expectNoDashboard(page);

    // A fresh invite redeemed by hand brings them back to the same profile
    await submitCode(page, await createInviteCode('kid-3-again'));
    await expectDashboard(page);
    expect(await readDocument(`allowed/${uid}`)).toMatchObject({ label: 'kid-3-again' });
  });

  test('a tester sends a note to the team; deleting the account erases the tester records but keeps the note', async ({ page, learner }) => {
    const uid = await joinWithLink(page, learner, await createInviteCode('kid-4'));
    await finishOnboarding(page);

    // The note goes to the server-only collection with the tester's uid
    await openSettings(page);
    await page.getByRole('radio', { name: 'רעיון' }).click();
    await page.getByLabel('ההודעה שלכם').fill('אפשר עוד משחקים?');
    await page.getByRole('button', { name: 'שליחה', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'תודה' })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    const noteIds = await listDocumentIds('feedback');
    expect(noteIds).toHaveLength(1);
    expect(await readDocument(`feedback/${noteIds[0]}`)).toMatchObject({ uid, kind: 'idea', text: 'אפשר עוד משחקים?' });

    // A usage counter row for this uid (the app flushes them once a minute; seeded here)
    const today = new Date().toISOString().slice(0, 10);
    await writeDocument(`analyticsDaily/${today}_${uid}`, { uid, day: today, gradeId: 'grade-4' });

    await page.getByRole('button', { name: /מחיקת החשבון/ }).click();
    await page.getByRole('textbox', { name: /כדי לאשר/ }).fill('מחיקה');
    await page.getByLabel(/הקוד הסודי של החשבון/).fill(learner.pin);
    await page.getByRole('button', { name: 'מחיקה לצמיתות' }).click();
    await expect(page.getByRole('dialog', { name: 'התחברות' })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });

    expect(await findUid(learner.username)).toBeNull();
    expect(await readDocument(`learners/${uid}`)).toBeNull();
    expect(await readDocument(`allowed/${uid}`)).toBeNull();
    expect(await readDocument(`entitlements/${uid}`)).toBeNull();
    // The note stays for the owner, cut loose from the deleted account
    expect(await readDocument(`feedback/${noteIds[0]}`)).toMatchObject({ uid: '', testerLabel: 'kid-4', text: 'אפשר עוד משחקים?' });
    expect(await readDocument(`analyticsDaily/${today}_${uid}`)).toBeNull();
  });

  test('a parent links to an invited tester with Google, without being invited themselves', async ({ page, browser, learner }, testInfo) => {
    const childUid = await joinWithLink(page, learner, await createInviteCode('kid-5'));
    await finishOnboarding(page);
    await expect.poll(() => readDocument(`learners/${childUid}`), { timeout: CLOUD_TIMEOUT_MS }).toMatchObject({ isOnboarded: true });

    const card = page.getByRole('region', { name: 'הזמנת הורה' });
    await expect(card).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    await card.getByRole('button', { name: 'להזמין הורה' }).click();
    const dialog = page.getByRole('dialog', { name: 'הזמנת הורה' });
    await dialog.getByRole('button', { name: /יצירת קוד להורה/ }).click();
    const parentCode = (await dialog.getByText(/^[A-HJKMNP-Z2-9]{8}$/).textContent())?.trim() ?? '';
    expect(parentCode).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);

    const parent = await newParentPage(browser, String(testInfo.project.use.baseURL));
    try {
      await parent.page.goto(`/?parent=${parentCode}`);
      await expect(parent.page.getByRole('heading', { name: 'אזור הורים' })).toBeVisible();
      const parentAccount = await createGoogleAccount();
      await signInPageAsGoogleAccount(parent.page, parentAccount);

      await expect(parent.page.getByText(/לחבר את/)).toContainText('נועה', { timeout: CLOUD_TIMEOUT_MS });
      await parent.page.getByRole('checkbox', { name: /ההורה או האפוטרופוס/ }).check();
      await parent.page.getByRole('button', { name: 'אישור החיבור' }).click();
      await expect(parent.page.getByRole('status').filter({ hasText: 'מחובר/ת' })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });

      // The parent account is not on the allowed list, and has no learner profile of its own
      expect(await readDocument(`allowed/${parentAccount.uid}`)).toBeNull();
      expect(await listDocumentIds('learners')).not.toContain(parentAccount.uid);
      expect(await readDocument(`parentLinks/${parentAccount.uid}_${childUid}`)).not.toBeNull();
      expect(await readDocument(`parentInvites/${parentCode}`)).toBeNull();

      // Locking the child out does not break the parent's own screen
      await deleteDocument(`allowed/${childUid}`);
      await parent.page.reload();
      await expect(parent.page.getByRole('heading', { name: 'נועה', level: 3 })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
    } finally {
      await parent.context.close();
    }
  });
});
