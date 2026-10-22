import { Locator, Page } from '@playwright/test';
import { test } from './support/test';
import { startAsNewLearner } from './support/app';
import {
  answerOptions,
  answerStep,
  expectOnScreen,
  MAX_ROUNDS,
  missionDialog,
  NEXT_STEP,
  skipVoiceButton,
} from './support/mission';

/**
 * A mission fits a small phone: every screen's main control is on screen without scrolling
 * (the intro's Start, the lesson's Next, the answers, the check button, Next, Collect).
 * The phone project only, on a small phone's screen.
 */
test.use({ viewport: { width: 360, height: 640 } });

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'phone screens only');
});

/** Opens the learner's first mission and checks its intro */
async function openFirstMission(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: 'בואי נשחק!' }).click();
  const mission = missionDialog(page);
  const start = mission.getByRole('button', { name: /יאללה, בואי נתחיל/ });
  await expectOnScreen(page, start, 'intro: start');
  await start.click();
  return mission;
}

/** Walks through the mini-lesson's cards, checking each card's Next button */
async function walkMiniLesson(page: Page, mission: Locator): Promise<void> {
  const practice = mission.getByRole('button', { name: /יאללה לתרגול/ });
  const next = mission.getByRole('button', { name: /^הבא/ });
  for (let card = 0; card < MAX_ROUNDS && !(await practice.isVisible()); card++) {
    await expectOnScreen(page, next, `lesson card ${card + 1}: next`);
    await next.click();
  }
  await expectOnScreen(page, practice, 'lesson: to practice');
  await practice.click();
}

/** The step's own controls are on screen before anything is tapped */
async function expectStepFits(page: Page, mission: Locator, round: number): Promise<void> {
  const skipVoice = skipVoiceButton(mission);
  if (await skipVoice.isVisible()) {
    await expectOnScreen(page, mission.getByRole('button', { name: /לחצי ודברי/ }), `step ${round}: record`);
    await expectOnScreen(page, skipVoice, `step ${round}: skip voice`);
    return;
  }
  const options = answerOptions(mission);
  const count = await options.count();
  if (count > 0) await expectOnScreen(page, options.nth(count - 1), `step ${round}: last answer`);
}

test.describe('a mission on a small phone', () => {
  test('grade 1: intro, lesson, steps, feedback and victory fit the screen', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 6 });
    const mission = await openFirstMission(page);
    await walkMiniLesson(page, mission);

    const collect = page.getByRole('button', { name: /איסוף פרסים/ });
    for (let round = 1; round <= MAX_ROUNDS && !(await collect.isVisible()); round++) {
      await expectStepFits(page, mission, round);
      await answerStep(page, mission);
      const next = page.getByRole('button', { name: NEXT_STEP });
      await expectOnScreen(page, next, `step ${round}: next`);
      await next.click();
    }
    await expectOnScreen(page, collect, 'victory: collect');
  });

  test('grade 4: answers and the sentence check button fit the screen', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    const mission = await openFirstMission(page);
    await walkMiniLesson(page, mission);

    // Up to the sentence builder, whose answer the test can't know
    const check = mission.getByRole('button', { name: /בדיקת משפט/ });
    for (let round = 1; round <= MAX_ROUNDS && !(await check.isVisible()); round++) {
      await expectStepFits(page, mission, round);
      await answerStep(page, mission);
      await page.getByRole('button', { name: NEXT_STEP }).click();
    }
    // Every word placed: the tray is at its tallest
    const bank = mission.getByLabel('בנק המילים');
    const words = bank.getByRole('button', { disabled: false });
    for (let left = await words.count(); left > 0; left--) await words.first().click();
    await expectOnScreen(page, check, 'sentence builder: check');
  });
});
