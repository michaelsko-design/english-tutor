import { createAccount, findUid } from './support/emulator';
import { expect, test } from './support/test';
import { completeOnboarding, expectDashboard, register, signIn, signOutFromSettings, skipFirstLaunch } from './support/app';

test.describe('sign-in', () => {
  test('a new learner registers, signs out and signs back in to the same profile', async ({ page, learner }) => {
    await register(page, learner);
    await completeOnboarding(page, { name: 'נועה', age: 9 });
    await skipFirstLaunch(page);
    expect(await findUid(learner.username)).not.toBeNull();

    await signOutFromSettings(page);
    await signIn(page, learner);

    // The saved profile comes back: no onboarding form, straight to the home screen
    await expectDashboard(page);
    await expect(page.getByText(/היי נועה/)).toBeVisible();
  });

  test('a wrong PIN is refused with a message', async ({ page, learner }) => {
    await createAccount(learner);

    await signIn(page, { ...learner, pin: `${learner.pin}9` });

    await expect(page.getByText(/שם המשתמש או הקוד הסודי אינם נכונים/)).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'התחברות' })).toBeVisible();
  });
});
