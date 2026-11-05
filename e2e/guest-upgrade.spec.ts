import { createGuestAccount, findUid, readDocument } from './support/emulator';
import { signInPageAsGuest } from './support/parent';
import { expect, test } from './support/test';
import { completeOnboarding, expectDashboard, signIn, signOutFromSettings, skipFirstLaunch } from './support/app';

test.describe('guest upgrade', () => {
  test('a guest saves the account with a username and keeps the profile on the next sign-in', async ({ page, learner }) => {
    const guest = await createGuestAccount();
    await page.goto('/');
    await signInPageAsGuest(page, guest);
    await completeOnboarding(page, { name: 'נועה', age: 9 });
    await skipFirstLaunch(page);
    await expect.poll(async () => readDocument(`learners/${guest.uid}`)).not.toBeNull();

    // The guest's cloud button opens the account panel, which warns that a guest loses the progress
    await page.getByRole('button', { name: 'סנכרון ענן וחשבון' }).click();
    const panel = page.getByRole('dialog', { name: 'חשבון וסנכרון' });
    await expect(panel.getByText(/זה חשבון אורח/)).toBeVisible();

    await panel.getByLabel(/או שם משתמש באנגלית/).fill(learner.username);
    await panel.getByLabel(/וקוד סודי \(לפחות 6 תווים\)/).fill(learner.pin);
    await panel.getByRole('button', { name: 'שמירה עם שם משתמש וקוד סודי' }).click();

    await expect(panel.getByText(/החשבון נשמר/)).toBeVisible({ timeout: 20_000 });
    await expect(panel.getByText(/זה חשבון אורח/)).toBeHidden();
    // The username now belongs to the same account the guest was using
    expect(await findUid(learner.username)).toBe(guest.uid);

    await panel.getByRole('button', { name: 'סגירה' }).click();
    await signOutFromSettings(page);
    await signIn(page, learner);

    // The saved profile comes back with the new sign-in: no onboarding form, same name
    await expectDashboard(page);
    await expect(page.getByText(/היי נועה/)).toBeVisible();
  });

  test('a guest who signs out must confirm first, because the progress is lost', async ({ page }) => {
    const guest = await createGuestAccount();
    await page.goto('/');
    await signInPageAsGuest(page, guest);
    await completeOnboarding(page, { name: 'נועה', age: 9 });
    await skipFirstLaunch(page);

    await page.getByRole('button', { name: 'סנכרון ענן וחשבון' }).click();
    const panel = page.getByRole('dialog', { name: 'חשבון וסנכרון' });
    await panel.getByRole('button', { name: 'התנתקות מהחשבון' }).click();

    await expect(panel.getByRole('alert')).toContainText('נמחק בהתנתקות');
    await expect(panel.getByRole('button', { name: 'להתנתק בכל זאת' })).toBeVisible();
    // Still signed in: the guest's profile is still there
    expect(await readDocument(`learners/${guest.uid}`)).not.toBeNull();
  });
});
