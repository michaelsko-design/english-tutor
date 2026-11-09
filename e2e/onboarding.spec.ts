import { findUid, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { expectDashboard, GRADE_LABELS, ONBOARDING_SUBMIT, register, skipFirstLaunch } from './support/app';

test.describe('onboarding', () => {
  test('a new learner sets up the profile, and it is saved to the cloud', async ({ page, learner }) => {
    await register(page, learner);
    const nameInput = page.getByLabel('איך קוראים לך?');
    await expect(nameInput).toBeVisible({ timeout: 20_000 });

    // Under 13: the form waits for the name, then for a parent's consent
    await page.getByRole('button', { name: ONBOARDING_SUBMIT }).click();
    await expect(page.getByText(/כתבי את השם שלך/)).toBeVisible();
    await nameInput.fill('עידו');
    await page.getByRole('button', { name: /בן/ }).click();
    await page.getByRole('button', { name: GRADE_LABELS[0] }).click();
    await page.getByRole('button', { name: ONBOARDING_SUBMIT }).click();
    await expect(page.getByText(/צריך שהורה יאשר/)).toBeVisible();
    await page.getByRole('checkbox', { name: /אני הורה וקראתי/ }).check();
    await page.getByRole('button', { name: ONBOARDING_SUBMIT }).click();

    // The first launch speaks to a boy, then the home screen shows his grade
    await expect(page.getByText(/ברוך הבא/)).toBeVisible({ timeout: 20_000 });
    await skipFirstLaunch(page);
    await expectDashboard(page);
    // The grade label sits in the map peek, which wide screens hide; the map itself is always there
    await expect(page.locator('#mission-map')).toBeVisible();

    const uid = await findUid(learner.username);
    await expect
      .poll(async () => readDocument(`learners/${uid}`))
      .toMatchObject({
        isOnboarded: true,
        name: 'עידו',
        gender: 'boy',
        age: 6,
        gradeId: 'grade-1',
        themeId: 'cozy-studio',
        isShabbatObserver: false,
        hasSeenWelcomeGiftModal: true,
      });
  });
});
