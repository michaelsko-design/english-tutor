import { Locator, Page } from '@playwright/test';
import { findUid, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { expectDashboard, readHudDiamonds, startAsNewLearner } from './support/app';

const NEXT_STEP = /לשלב הבא|סיום משימה/;
/** A mission has 5 steps; more rounds than this means the loop is stuck */
const MAX_ROUNDS = 12;

/**
 * Answers the step on screen without knowing the answer (the options are shuffled in the
 * browser): the voice step is skipped, and the options are tried in turn until one is right.
 */
async function answerStep(page: Page, mission: Locator): Promise<void> {
  const skipVoice = mission.getByRole('button', { name: /אני במקום שקט/ });
  if (await skipVoice.isVisible()) {
    await skipVoice.click();
    return;
  }
  // The answer buttons (each beside its own 🔊 button)
  const options = mission.locator('button[dir="auto"]');
  const count = await options.count();
  for (let idx = 0; idx < count; idx++) {
    await options.nth(idx).click();
    const nextButton = page.getByRole('button', { name: NEXT_STEP });
    const tryAgain = page.getByRole('button', { name: 'נסי שוב' });
    await expect(nextButton.or(tryAgain)).toBeVisible();
    if (await nextButton.isVisible()) return;
    await tryAgain.click();
  }
  throw new Error('no option was right');
}

test.describe('a mission', () => {
  test('plays the first mission to the victory screen, and the reward is saved', async ({ page, learner }) => {
    // Age 6: grade 1, whose missions are answer buttons and a voice step
    await startAsNewLearner(page, learner, { name: 'נועה', age: 6 });
    const startDiamonds = await readHudDiamonds(page);

    await page.getByRole('button', { name: 'בואי נשחק!' }).click();
    const mission = page.getByRole('dialog', { name: /^משימה:/ });
    await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
    // A first play opens the mini-lesson
    await mission.getByRole('button', { name: /דילוג/ }).click();

    const collect = page.getByRole('button', { name: /איסוף פרסים/ });
    for (let round = 0; round < MAX_ROUNDS && !(await collect.isVisible()); round++) {
      await answerStep(page, mission);
      await page.getByRole('button', { name: NEXT_STEP }).click();
    }
    await collect.click();

    await expectDashboard(page);
    await expect.poll(() => readHudDiamonds(page)).toBeGreaterThan(startDiamonds);
    const uid = await findUid(learner.username);
    await expect
      .poll(async () => {
        const progress = (await readDocument(`learners/${uid}`))?.missionProgress as Record<string, number> | undefined;
        return Object.values(progress ?? {}).some((stars) => stars >= 1);
      })
      .toBe(true);
  });
});
