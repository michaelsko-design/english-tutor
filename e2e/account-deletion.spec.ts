import { findUid, listDocumentIds, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { openSettings, signIn, startAsNewLearner } from './support/app';

test.describe('account deletion', () => {
  test('deleting the account removes the sign-in and every saved document', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    const uid = await findUid(learner.username);
    await expect.poll(async () => readDocument(`learners/${uid}`)).not.toBeNull();

    await openSettings(page);
    await page.getByRole('button', { name: /מחיקת החשבון/ }).click();
    const confirm = page.getByRole('button', { name: 'מחיקה לצמיתות' });
    await expect(confirm).toBeDisabled();
    await page.getByRole('textbox', { name: /כדי לאשר/ }).fill('מחיקה');
    await page.getByLabel(/הקוד הסודי של החשבון/).fill(learner.pin);
    await confirm.click();

    // Back at the sign-in gate, with nothing left behind
    await expect(page.getByRole('dialog', { name: 'התחברות' })).toBeVisible({ timeout: 20_000 });
    expect(await findUid(learner.username)).toBeNull();
    expect(await readDocument(`learners/${uid}`)).toBeNull();
    expect(await listDocumentIds(`learners/${uid}/stickers`)).toEqual([]);

    await signIn(page, learner);
    await expect(page.getByText(/שם המשתמש או הקוד הסודי אינם נכונים/)).toBeVisible();
  });

  test('a wrong PIN keeps the account', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });

    await openSettings(page);
    await page.getByRole('button', { name: /מחיקת החשבון/ }).click();
    await page.getByRole('textbox', { name: /כדי לאשר/ }).fill('מחיקה');
    await page.getByLabel(/הקוד הסודי של החשבון/).fill('000000');
    await page.getByRole('button', { name: 'מחיקה לצמיתות' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    expect(await findUid(learner.username)).not.toBeNull();
  });
});
