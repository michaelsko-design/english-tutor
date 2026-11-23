import type { Page } from '@playwright/test';
import { findUid, readDocument, setLearnerStat } from './support/emulator';
import { expect, test } from './support/test';
import { expectDashboard, startAsNewLearner } from './support/app';
import { answerStep, MAX_ROUNDS, missionDialog, NEXT_STEP } from './support/mission';

/** Plays the first grade-1 mission to the end and collects the reward (as in mission.spec.ts). */
async function playFirstMission(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'בואי נשחק!' }).click();
  const mission = missionDialog(page);
  await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
  await mission.getByRole('button', { name: /דילוג/ }).click();
  const collect = page.getByRole('button', { name: /איסוף פרסים/ });
  for (let round = 0; round < MAX_ROUNDS && !(await collect.isVisible()); round++) {
    await answerStep(page, mission);
    await page.getByRole('button', { name: NEXT_STEP }).click();
  }
  await collect.click();
  await expectDashboard(page);
}

test.describe('the daily-reminder ask', () => {
  // Headless Chromium reports notifications as blocked (even when granted), and a blocked browser is
  // never asked: the page sees a browser that hasn't been asked yet. The test never accepts the prompt.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Notification, 'permission', { get: () => 'default' });
    });
  });

  test('comes up over the home screen after a mission on the second practice day, and "not now" closes it', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 6 });
    const uid = await findUid(learner.username);
    expect(uid).not.toBeNull();
    // Two practice days (today's first steps and an earlier day): the ask waits for the second one
    // Wait for the onboarded profile in the cloud, so the reload doesn't land back on onboarding
    await expect.poll(async () => (await readDocument(`learners/${uid}`))?.isOnboarded, { timeout: 20_000 }).toBe(true);
    // Leave the app first, so its next save can't write over the seeded day
    await page.goto('about:blank');
    await setLearnerStat(uid as string, 'totalActiveDays', 2);
    await page.goto('/');
    await expectDashboard(page);

    await playFirstMission(page);

    const ask = page.getByRole('dialog', { name: /רוצה שאזכיר לך מחר/ });
    await expect(ask).toBeVisible({ timeout: 15_000 });
    await expect(ask).toContainText('עוזרת ללמוד טוב יותר ולשמור על הרצף');
    await expect(ask).not.toContainText('להורים:');
    await page.screenshot({ path: test.info().outputPath('reminder-ask.png') });

    await ask.getByRole('button', { name: 'לא עכשיו' }).click();
    await expect(ask).toBeHidden();
    await expect
      .poll(async () => (await readDocument(`learners/${uid}`))?.reminderAskCount)
      .toBe(1);
  });
});
