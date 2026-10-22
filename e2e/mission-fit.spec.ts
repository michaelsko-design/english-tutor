import { Locator, Page } from '@playwright/test';
import { expect, test } from './support/test';
import { startAsNewLearner } from './support/app';
import {
  answerOptions,
  answerStep,
  buildSentence,
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

  test('grade 4 on the easiest tier: sentence check, story screens and victory fit the screen', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    await page.getByRole('button', { name: 'בואי נשחק!' }).click();
    const mission = missionDialog(page);
    // The easiest tier offers the passage's Hebrew translation
    await mission.getByText('בסיס וביטחון').filter({ visible: true }).first().click();
    await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();
    await walkMiniLesson(page, mission);

    const check = mission.getByRole('button', { name: /בדיקת משפט/ });
    const doneReading = mission.getByRole('button', { name: /קראתי, לשאלה/ });
    const collect = page.getByRole('button', { name: /איסוף פרסים/ });
    let hasReadStory = false;
    for (let round = 1; round <= MAX_ROUNDS && !(await collect.isVisible()); round++) {
      if (await check.isVisible()) {
        await buildSentence(mission);
        await expectOnScreen(page, check, `step ${round}: sentence check`);
        await check.click();
      } else {
        if (await doneReading.isVisible()) {
          hasReadStory = true;
          // The translation is a clue: hidden until asked for
          const translate = mission.getByRole('button', { name: /הצגת תרגום/ });
          await expect(translate).toHaveAttribute('aria-expanded', 'false');
          await translate.click();
          await expect(mission.getByRole('button', { name: 'הסתרת התרגום' })).toHaveAttribute('aria-expanded', 'true');
          await expectOnScreen(page, doneReading, `step ${round}: done reading`);
          await doneReading.click();
          await expectOnScreen(page, mission.getByRole('button', { name: 'חזרה לקטע' }), `step ${round}: back to passage`);
        }
        await expectStepFits(page, mission, round);
        await answerStep(page, mission);
      }
      const next = page.getByRole('button', { name: NEXT_STEP });
      await expectOnScreen(page, next, `step ${round}: next`);
      await next.click();
    }
    expect(hasReadStory, 'the mission had a story step').toBe(true);
    await expectOnScreen(page, collect, 'victory: collect');
  });
});
