import type { Page } from '@playwright/test';
import { expect, test } from './support/test';
import { expectDashboard, startAsNewLearner } from './support/app';
import { findUid, readDocument } from './support/emulator';
import { answerStep, buildSentence, MAX_ROUNDS, missionDialog, NEXT_STEP } from './support/mission';

/** Plays the open mission's steps (choice, sentence and voice steps) up to the collect button. */
async function playSteps(page: Page): Promise<void> {
  const mission = missionDialog(page);
  const collect = page.getByRole('button', { name: /איסוף פרסים/ });
  const check = mission.getByRole('button', { name: /בדיקת משפט/ });
  const doneReading = mission.getByRole('button', { name: /קראתי, לשאלה/ });
  for (let round = 0; round < MAX_ROUNDS && !(await collect.isVisible()); round++) {
    if (await check.isVisible()) {
      await buildSentence(mission);
      await check.click();
    } else {
      // Phones read the story passage on its own screen first
      if (await doneReading.isVisible()) await doneReading.click();
      await answerStep(page, mission);
    }
    await page.getByRole('button', { name: NEXT_STEP }).click();
  }
}

test('grade 4 Explorer play, then the ladder after collecting', async ({ page, learner }, testInfo) => {
  await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
  await page.getByRole('button', { name: 'בואי נשחק!' }).click();
  const mission = missionDialog(page);
  await mission.getByText('בסיס וביטחון').filter({ visible: true }).first().click();
  await page.screenshot({ path: testInfo.outputPath('1-intro.png') });
  await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
  const practice = mission.getByRole('button', { name: /יאללה לתרגול/ });
  const lessonNext = mission.getByRole('button', { name: /^הבא/ });
  for (let card = 0; card < MAX_ROUNDS && !(await practice.isVisible()); card++) await lessonNext.click();
  await practice.click();
  await playSteps(page);
  await page.screenshot({ path: testInfo.outputPath('2-victory.png') });
  const ladder = page.getByRole('list', { name: 'התקדמות ברמות המשימה' });
  await expect(ladder.getByRole('listitem', { name: /^בסיס וביטחון: [1-3] מתוך 3 כוכבים$/ })).toBeVisible();
  await page.getByRole('button', { name: /איסוף פרסים/ }).click();
  await expectDashboard(page);

  // The stars are saved on the tier played only
  const uid = await findUid(learner.username);
  await expect
    .poll(async () => {
      const tierStars = (await readDocument(`learners/${uid}`))?.missionTierStars as
        | Record<string, { explorer?: number; challenger?: number; master?: number }>
        | undefined;
      const [first] = Object.values(tierStars ?? {});
      return first ? { explorer: (first.explorer ?? 0) >= 1, challenger: first.challenger ?? 0, master: first.master ?? 0 } : null;
    })
    .toEqual({ explorer: true, challenger: 0, master: 0 });
});
