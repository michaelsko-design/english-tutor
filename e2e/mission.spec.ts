import { findUid, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { expectDashboard, readHudDiamonds, startAsNewLearner } from './support/app';
import { answerStep, MAX_ROUNDS, missionDialog, NEXT_STEP } from './support/mission';

test.describe('a mission', () => {
  test('plays the first mission to the victory screen, and the reward is saved', async ({ page, learner }) => {
    // Age 6: grade 1, whose missions are answer buttons and a voice step
    await startAsNewLearner(page, learner, { name: 'נועה', age: 6 });
    const startDiamonds = await readHudDiamonds(page);

    await page.getByRole('button', { name: 'בואי נשחק!' }).click();
    const mission = missionDialog(page);
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
