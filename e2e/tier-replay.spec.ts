import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/test';
import { expectDashboard, startAsNewLearner } from './support/app';
import { findUid, readDocument } from './support/emulator';
import {
  answerStep,
  buildSentence,
  buildSentenceAmongDecoys,
  MAX_ROUNDS,
  missionDialog,
  NEXT_STEP,
  spellWord,
} from './support/mission';

type Tier = 'explorer' | 'challenger' | 'master';

const TIERS: { id: Tier; label: string }[] = [
  { id: 'explorer', label: 'בסיס וביטחון' },
  { id: 'challenger', label: 'רמת כיתה מלאה' },
  { id: 'master', label: 'מצוינות והעשרה' },
];
const FIRST_MISSION_STOP = /^משימה 1\.1:/;
const SHEET_START = /(התחיל|שחק)(י)? (את המשימה|שוב)/;
const LESSON_OR_PRACTICE = /יאללה, בואי נתחיל|יאללה לתרגול|^הבא/;
const LESSON_WAIT_MS = 4_000;

/** Opens the first map stop, picks the tier in its sheet and starts the mission. */
async function startFromMap(page: Page, label: string): Promise<void> {
  await page.getByRole('button', { name: FIRST_MISSION_STOP }).click();
  await page.getByRole('button', { name: new RegExp(label) }).filter({ visible: true }).first().click();
  await page.getByRole('button', { name: SHEET_START }).filter({ visible: true }).first().click();
}

/** Skips the intro and the mini-lesson when this play shows them (a first play does, a replay does not). */
async function skipIntroAndLesson(mission: Locator): Promise<void> {
  const next = mission.getByRole('button', { name: LESSON_OR_PRACTICE }).first();
  const practice = mission.getByRole('button', { name: /יאללה לתרגול/ });
  for (let card = 0; card < MAX_ROUNDS; card++) {
    const isShown = await next.waitFor({ state: 'visible', timeout: LESSON_WAIT_MS }).then(() => true, () => false);
    if (!isShown) return;
    const isPractice = await practice.isVisible();
    await next.click();
    if (isPractice) return;
  }
}

/** Plays every step of the open mission until the collect button; returns the first step's text. */
async function playMission(page: Page, tier: Tier): Promise<string> {
  const mission = missionDialog(page);
  const collect = page.getByRole('button', { name: /איסוף פרסים/ });
  const check = mission.getByRole('button', { name: /בדיקת משפט/ });
  const doneReading = mission.getByRole('button', { name: /קראתי, לשאלה/ });
  let firstStepText = '';
  for (let round = 0; round < MAX_ROUNDS && !(await collect.isVisible()); round++) {
    if (round === 0) firstStepText = (await mission.innerText()).replace(/\s+/g, ' ');
    if (await mission.getByLabel('האותיות').isVisible()) {
      await spellWord(page, mission);
    } else if (await check.isVisible()) {
      await (tier === 'master' ? buildSentenceAmongDecoys(mission) : buildSentence(mission));
      await check.click();
    } else {
      if (await doneReading.isVisible()) await doneReading.click();
      await answerStep(page, mission);
    }
    await page.getByRole('button', { name: NEXT_STEP }).click();
  }
  return firstStepText;
}

test('the same mission played on all three tiers asks different questions and saves a ladder', async ({ page, learner }, testInfo) => {
  test.setTimeout(240_000);
  await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
  const firstSteps: string[] = [];

  for (const { id, label } of TIERS) {
    await startFromMap(page, label);
    const mission = missionDialog(page);
    await skipIntroAndLesson(mission);
    firstSteps.push(await playMission(page, id));

    // The victory ladder shows this tier with stars
    const ladder = page.getByRole('list', { name: 'התקדמות ברמות המשימה' });
    await expect(ladder.getByRole('listitem', { name: new RegExp(`^${label}: [1-3] מתוך 3 כוכבים$`) })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`victory-${id}.png`) });
    await page.getByRole('button', { name: /איסוף פרסים/ }).click();
    await expectDashboard(page);
  }

  // Each tier opened with a different first question
  expect(new Set(firstSteps).size, 'three different first steps').toBe(3);

  // All three tiers are saved on the one mission, so the ladder is full
  const uid = await findUid(learner.username);
  await expect
    .poll(async () => {
      const tierStars = (await readDocument(`learners/${uid}`))?.missionTierStars as
        | Record<string, { explorer?: number; challenger?: number; master?: number }>
        | undefined;
      const [first] = Object.values(tierStars ?? {});
      return first ? [first.explorer, first.challenger, first.master].map((stars) => (stars ?? 0) >= 1) : null;
    })
    .toEqual([true, true, true]);
});
