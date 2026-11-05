import { expect, test } from './support/test';
import { expectDashboard, startAsNewLearner } from './support/app';
import { findUid, readDocument } from './support/emulator';
import {
  answerStep,
  buildSentenceAmongDecoys,
  MAX_ROUNDS,
  missionDialog,
  NEXT_STEP,
  skipVoiceButton,
  spellWord,
} from './support/mission';

/**
 * Master 👑 plays different steps from the other tiers: it spells a word from its Hebrew, builds a
 * longer sentence among two extra words, says a sentence with the text hidden, and reads a story
 * with no Hebrew. Played end to end on desktop and on the small phone.
 */
test('grade 4 on Master: spell, decoy sentence, hidden voice text, story without Hebrew, victory', async ({ page, learner }, testInfo) => {
  await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
  await page.getByRole('button', { name: 'בואי נשחק!' }).click();
  const mission = missionDialog(page);
  await mission.getByText('מצוינות והעשרה').filter({ visible: true }).first().click();
  await mission.getByRole('button', { name: /יאללה, בואי נתחיל/ }).click();

  const practice = mission.getByRole('button', { name: /יאללה לתרגול/ });
  const lessonNext = mission.getByRole('button', { name: /^הבא/ });
  for (let card = 0; card < MAX_ROUNDS && !(await practice.isVisible()); card++) await lessonNext.click();
  await practice.click();

  const collect = page.getByRole('button', { name: /איסוף פרסים/ });
  const check = mission.getByRole('button', { name: /בדיקת משפט/ });
  const doneReading = mission.getByRole('button', { name: /קראתי, לשאלה/ });
  const seen = { spelled: false, decoys: false, hiddenVoice: false, noHebrewStory: false };

  for (let round = 1; round <= MAX_ROUNDS && !(await collect.isVisible()); round++) {
    if (await mission.getByLabel('האותיות').isVisible()) {
      await spellWord(page, mission);
      seen.spelled = true;
    } else if (await check.isVisible()) {
      await buildSentenceAmongDecoys(mission);
      await check.click();
      seen.decoys = true;
    } else if (await skipVoiceButton(mission).isVisible()) {
      await expect(mission.getByTestId('hidden-sentence')).toBeVisible();
      seen.hiddenVoice = true;
      await answerStep(page, mission);
    } else {
      // Master reads without the Hebrew translation (phones read the passage on its own screen first)
      if (await doneReading.isVisible()) {
        await expect(mission.getByRole('button', { name: /הצגת תרגום/ })).toHaveCount(0);
        await doneReading.click();
      }
      await expect(mission.getByRole('button', { name: /הצגת תרגום/ })).toHaveCount(0);
      // The story is the last of the five steps
      if (round === 5) seen.noHebrewStory = true;
      await answerStep(page, mission);
    }
    await page.getByRole('button', { name: NEXT_STEP }).click();
  }

  expect(seen, 'the Master steps all appeared').toEqual({ spelled: true, decoys: true, hiddenVoice: true, noHebrewStory: true });
  await expect(collect).toBeVisible();

  // The victory screen shows the tier ladder with Master played
  const ladder = page.getByRole('list', { name: 'התקדמות ברמות המשימה' });
  await expect(ladder).toBeVisible();
  await expect(ladder.getByRole('listitem', { name: /^מצוינות והעשרה: [1-3] מתוך 3 כוכבים$/ })).toBeVisible();
  await expect(ladder.getByRole('listitem', { name: /^בסיס וביטחון: 0 מתוך 3 כוכבים$/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('master-victory.png') });

  // Collecting saves the stars on the Master tier
  await collect.click();
  await expectDashboard(page);
  const uid = await findUid(learner.username);
  await expect
    .poll(async () => {
      const tierStars = (await readDocument(`learners/${uid}`))?.missionTierStars as
        | Record<string, { master?: number }>
        | undefined;
      return Object.values(tierStars ?? {}).some((tiers) => (tiers.master ?? 0) >= 1);
    })
    .toBe(true);
});
