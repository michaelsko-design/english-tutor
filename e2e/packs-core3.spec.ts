import type { Page } from '@playwright/test';
import { expect, test } from './support/test';
import { expectDashboard, startAsNewLearner } from './support/app';
import { findUid, readDocument, setMissionProgress } from './support/emulator';
import { answerStep, buildSentence, MAX_ROUNDS, missionDialog, NEXT_STEP } from './support/mission';
import { CURRICULUM_WITH_ALL_PACKS } from '../src/data/curriculum/packs/all';
import type { GradeId } from '../src/types/learner';

/**
 * The unreleased core-3 pack, played in the packs preview (playwright.packs.config.ts): a learner
 * who finished every mission before core-3 gets its first mission suggested and plays it on Explorer.
 */
const AGE_OF_GRADE_ZERO = 5;
const FULL_STARS = 3;
/** The main path's packs that come before core-3 (`after` chain): Season 2 */
const PACKS_BEFORE_CORE_3 = new Set(['season2-1', 'season2-2']);

function core3Plan(grade: number): { earlierIds: string[]; firstTitleHe: string } {
  const units = CURRICULUM_WITH_ALL_PACKS[`grade-${grade}` as GradeId].units;
  const earlier = units.filter((u) => u.packId === undefined || PACKS_BEFORE_CORE_3.has(u.packId));
  const core3 = units.find((u) => u.packId === 'core-3');
  if (!core3) throw new Error(`grade ${grade} has no core-3 unit`);
  return {
    earlierIds: earlier.flatMap((u) => u.missions.map((m) => m.id)),
    firstTitleHe: core3.missions[0].titleHe,
  };
}

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

for (const grade of [2, 8, 12]) {
  test(`grade ${grade}: the core-3 unit's first mission is suggested and plays on Explorer`, async ({ page, learner }, testInfo) => {
    const plan = core3Plan(grade);
    await startAsNewLearner(page, learner, { name: 'נועה', age: grade + AGE_OF_GRADE_ZERO });
    const uid = await findUid(learner.username);
    if (!uid) throw new Error('the learner was not created');
    // Leave the app first, so its own save can't overwrite the progress; the next load merges it in
    await expect.poll(async () => (await readDocument(`learners/${uid}`))?.isOnboarded).toBe(true);
    await page.goto('about:blank');
    await setMissionProgress(uid, Object.fromEntries(plan.earlierIds.map((id) => [id, FULL_STARS])));
    await page.goto('/');
    await expectDashboard(page);

    await page.getByRole('button', { name: 'בואי נשחק!' }).click();
    const mission = missionDialog(page);
    await expect(mission.getByText(plan.firstTitleHe).first()).toBeVisible();
    await mission.getByText('בסיס וביטחון').filter({ visible: true }).first().click();
    await page.screenshot({ path: testInfo.outputPath(`g${grade}-intro.png`) });
    await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
    const practice = mission.getByRole('button', { name: /יאללה לתרגול/ });
    const lessonNext = mission.getByRole('button', { name: /^הבא/ });
    for (let card = 0; card < MAX_ROUNDS && !(await practice.isVisible()); card++) await lessonNext.click();
    await practice.click();
    await playSteps(page);
    await page.screenshot({ path: testInfo.outputPath(`g${grade}-victory.png`) });
    await page.getByRole('button', { name: /איסוף פרסים/ }).click();
    await expectDashboard(page);
  });
}
