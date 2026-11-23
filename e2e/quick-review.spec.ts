import type { Locator, Page } from '@playwright/test';
import { EMULATOR_PROJECT_ID, findUid, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { expectDashboard, startAsNewLearner } from './support/app';

const WORDS: Record<string, string> = { apple: 'תפוח', bread: 'לחם', milk: 'חלב', tiger: 'נמר' };
const YESTERDAY = '2026-01-01';
const DOCUMENTS = `http://127.0.0.1:8080/v1/projects/${EMULATOR_PROJECT_ID}/databases/(default)/documents`;

/** Gives the learner missed words waiting for review, past the security rules (like the server). */
async function seedMissedWords(uid: string): Promise<void> {
  const fields = Object.fromEntries(
    Object.entries(WORDS).map(([wordEn, translationHe]) => [
      wordEn,
      {
        mapValue: {
          fields: {
            wordEn: { stringValue: wordEn },
            translationHe: { stringValue: translationHe },
            missedOn: { stringValue: YESTERDAY },
          },
        },
      },
    ])
  );
  const response = await fetch(`${DOCUMENTS}/learners/${uid}?updateMask.fieldPaths=missedWords`, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { missedWords: { mapValue: { fields } } } }),
  });
  expect(response.ok, await response.text()).toBe(true);
}

/** Answers the review step on screen the right way: a meaning match or letter magnets. */
async function answerReviewStep(page: Page, session: Locator): Promise<void> {
  const meaning = session.getByText(/איזו מילה באנגלית פירושה/);
  const bank = session.getByLabel('האותיות');
  await expect(meaning.or(bank)).toBeVisible();
  if (await meaning.isVisible()) {
    const prompt = (await meaning.textContent()) ?? '';
    const translation = prompt.match(/"(.+)"/)?.[1];
    const wordEn = Object.keys(WORDS).find((word) => WORDS[word] === translation);
    if (!wordEn) throw new Error(`unknown meaning prompt: ${prompt}`);
    await session.getByRole('button', { name: wordEn, exact: true }).click();
    return;
  }
  const tiles = bank.getByRole('button');
  const letters = (await tiles.allTextContents()).map((text) => text.trim().toLowerCase());
  const wordEn = Object.keys(WORDS).find((word) => [...word].sort().join('') === [...letters].sort().join(''));
  if (!wordEn) throw new Error(`no word for the letters ${letters.join('')}`);
  const used = new Set<number>();
  for (const letter of wordEn) {
    const idx = letters.findIndex((tile, i) => !used.has(i) && tile === letter);
    used.add(idx);
    await tiles.nth(idx).click();
  }
  await session.getByRole('button', { name: /בדיקת איות/ }).click();
}

test.describe('the 1-minute review', () => {
  test('offers missed words on the home screen, reviews them, and rests until tomorrow', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 10 });
    const uid = await findUid(learner.username);
    if (!uid) throw new Error('no uid');
    // The profile is saved after a short delay: seed only once it is in the cloud
    await expect.poll(async () => (await readDocument(`learners/${uid}`))?.isOnboarded, { timeout: 20_000 }).toBe(true);
    await seedMissedWords(uid);
    await page.reload();
    await expectDashboard(page);

    const card = page.getByRole('region', { name: 'חזרה של דקה' });
    await expect(card).toContainText('4 מילים');
    await card.getByRole('button', { name: 'מתחילים' }).click();

    const session = page.getByRole('dialog', { name: 'תרגול רשימת מילים' });
    const next = page.getByRole('button', { name: /לשלב הבא|לתוצאות/ });
    // 4 words: a meaning match and letter magnets each, no voice round
    for (let step = 0; step < 8; step++) {
      await expect(session.getByText(`${step + 1}/8`)).toBeVisible();
      await answerReviewStep(page, session);
      await expect(page.getByRole('alert')).toContainText('נכון');
      await next.click();
    }
    await expect(page.getByRole('heading', { name: /המילים האלה כבר יושבות טוב יותר/ })).toBeVisible();
    await page.getByRole('button', { name: 'שמירה וחזרה לדשבורד' }).click();

    await expectDashboard(page);
    await expect(card).toBeHidden();
    await expect
      .poll(async () => {
        const doc = await readDocument(`learners/${uid}`);
        const missed = (doc?.missedWords ?? {}) as Record<string, { clearedOn?: string }>;
        return {
          isDoneToday: typeof doc?.quickReviewDoneOn === 'string' && doc.quickReviewDoneOn > YESTERDAY,
          clearedCount: Object.values(missed).filter((word) => word.clearedOn && word.clearedOn > YESTERDAY).length,
        };
      })
      .toEqual({ isDoneToday: true, clearedCount: 4 });
  });
});
