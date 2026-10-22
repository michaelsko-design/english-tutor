import { Locator, Page } from '@playwright/test';
import { expect } from './test';

/** The step's done button, or the last step's finish button */
export const NEXT_STEP = /לשלב הבא|סיום משימה/;
/** A mission has 5 steps; more rounds than this means the loop is stuck */
export const MAX_ROUNDS = 12;

/** The open mission */
export function missionDialog(page: Page): Locator {
  return page.getByRole('dialog', { name: /^משימה:/ });
}

/** The answer buttons of a multiple-choice step (each beside its own 🔊 button) */
export function answerOptions(mission: Locator): Locator {
  return mission.locator('button[dir="auto"]');
}

/** The voice step's "I can't talk now" link */
export function skipVoiceButton(mission: Locator): Locator {
  return mission.getByRole('button', { name: /אני במקום שקט/ });
}

/**
 * Answers the step on screen without knowing the answer (the options are shuffled in the
 * browser): the voice step is skipped, and the options are tried in turn until one is right.
 */
export async function answerStep(page: Page, mission: Locator): Promise<void> {
  const skipVoice = skipVoiceButton(mission);
  if (await skipVoice.isVisible()) {
    await skipVoice.click();
    return;
  }
  const options = answerOptions(mission);
  const count = await options.count();
  for (let idx = 0; idx < count; idx++) {
    await options.nth(idx).click();
    const nextButton = page.getByRole('button', { name: NEXT_STEP });
    const tryAgain = page.getByRole('button', { name: /נס(י|ה) שוב/ });
    await expect(nextButton.or(tryAgain)).toBeVisible();
    if (await nextButton.isVisible()) return;
    await tryAgain.click();
  }
  throw new Error('no option was right');
}

/** The control is fully inside the viewport now, without scrolling to it. */
export async function expectOnScreen(page: Page, control: Locator, what: string): Promise<void> {
  await expect(control, what).toBeVisible();
  const box = await control.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) throw new Error(`no layout for ${what}`);
  expect(box.y, `${what}: top edge`).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height, `${what}: bottom edge (screen height ${viewport.height})`).toBeLessThanOrEqual(
    viewport.height
  );
}
