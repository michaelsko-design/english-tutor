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

  test('the victory screen goes straight on to the next mission, and the first one is saved', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 6 });

    await page.getByRole('button', { name: 'בואי נשחק!' }).click();
    const mission = missionDialog(page);
    await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
    await mission.getByRole('button', { name: /דילוג/ }).click();

    const collect = page.getByRole('button', { name: /איסוף פרסים/ });
    for (let round = 0; round < MAX_ROUNDS && !(await collect.isVisible()); round++) {
      await answerStep(page, mission);
      await page.getByRole('button', { name: NEXT_STEP }).click();
    }
    // The victory offers the next mission beside going home (the world map has its own "next" button)
    const victory = page.getByRole('dialog').filter({ has: collect });
    await victory.getByRole('button', { name: /למשימה הבאה/ }).click();

    // The next mission opens on its intro, a fresh run
    await expect(missionDialog(page).getByText(/משימה 2/)).toBeVisible();
    await expect(missionDialog(page).getByRole('button', { name: /יאללה, בואי נתחיל/ })).toBeVisible();
    const uid = await findUid(learner.username);
    await expect
      .poll(async () => {
        const progress = (await readDocument(`learners/${uid}`))?.missionProgress as Record<string, number> | undefined;
        return Object.values(progress ?? {}).filter((stars) => stars >= 1).length;
      })
      .toBe(1);
  });
});
