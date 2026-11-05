import type { Browser, Page } from '@playwright/test';
import { findUid, listDocumentIds, newTestLearner, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { startAsNewLearner } from './support/app';

/** A second learner needs a second browser context: its own storage and sign-in. */
async function openSecondLearner(browser: Browser, baseURL: string | undefined, viewport: Page['viewportSize']): Promise<Page> {
  const context = await browser.newContext({
    baseURL,
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    reducedMotion: 'reduce',
    viewport: viewport() ?? undefined,
  });
  const page = await context.newPage();
  await page.route(/\/api\/tts|\.mp3(\?|$)/, (route) => route.abort());
  return page;
}

/** Opens the Friends Hub from the dock (dock tiles can sit under the sticky header, so click by label). */
async function openFriendsHub(page: Page) {
  await page.locator('button[aria-label^="חברים"]').first().click();
  const hub = page.getByRole('dialog', { name: 'מרכז החברים' });
  await expect(hub).toBeVisible();
  return hub;
}

/** The friendship document id: both uids, sorted (getPairId in src/data/friends.ts) */
async function pairIdOf(a: { username: string }, b: { username: string }): Promise<string> {
  const uids = [await findUid(a.username), await findUid(b.username)];
  return uids.sort().join('_');
}

test.describe('friends', () => {
  test('a learner invites a friend by code, the friend accepts, and they start a daily contest', async ({ page, browser, baseURL, learner }) => {
    const friend = newTestLearner();
    const friendPage = await openSecondLearner(browser, baseURL, () => page.viewportSize());

    // Two learners aged 13+, so the Friends Hub is on without a parent's approval
    await startAsNewLearner(page, learner, { name: 'נועה', age: 14 });
    await startAsNewLearner(friendPage, friend, { name: 'דני', age: 14 });

    // The first learner's friend code is claimed in the cloud once the hub is on
    const uid = await findUid(learner.username);
    await expect.poll(async () => (await readDocument(`friendCodeOwners/${uid}`))?.code ?? null, { timeout: 30_000 }).not.toBeNull();
    const code = String((await readDocument(`friendCodeOwners/${uid}`))?.code);

    // The friend looks the code up and sends a request
    const friendHub = await openFriendsHub(friendPage);
    await friendHub.getByLabel('קוד חבר או שם משתמש').fill(code);
    await friendHub.getByRole('button', { name: 'חיפוש' }).click();
    await expect(friendHub.getByText('נועה')).toBeVisible();
    await friendHub.getByRole('button', { name: 'שליחת בקשת חברות' }).click();
    await expect(friendHub.getByText(/הבקשה נשלחה ל/)).toBeVisible();
    await expect(friendHub.getByRole('region', { name: 'ממתינים לאישור' })).toBeVisible();

    // The first learner sees the request live and accepts it
    const hub = await openFriendsHub(page);
    const requests = hub.getByRole('region', { name: 'בקשות חברות' });
    await expect(requests.getByText('דני')).toBeVisible({ timeout: 20_000 });
    await requests.getByRole('button', { name: /^אשרי?$/ }).click();
    const myFriends = hub.getByRole('region', { name: 'החברים שלי' });
    await expect(myFriends.getByText('דני')).toBeVisible();
    await expect(myFriends.getByText(/\(1\/\d+\)/)).toBeVisible();

    // The friend's list updates without a reload
    await expect(friendHub.getByRole('region', { name: 'החברים שלי' }).getByText('נועה')).toBeVisible({ timeout: 20_000 });

    // The first learner invites the friend to today's contest, and the friend accepts
    await myFriends.getByRole('button', { name: /הזמ(יני|ן) לאתגר יומי/ }).click();
    await expect(myFriends.getByText(/ההזמנה נשלחה ל/)).toBeVisible({ timeout: 20_000 });
    const pairId = await pairIdOf(learner, friend);
    const pairContests = async () => (await listDocumentIds('contests')).filter((id) => id.startsWith(`${pairId}_`));
    await expect.poll(async () => (await pairContests()).length).toBe(1);

    await expect(friendHub.getByText(/קיבלת הזמנה לאתגר/)).toBeVisible({ timeout: 20_000 });
    await friendHub.getByRole('button', { name: /קב(לי|ל) ושח(קי|ק)/ }).click();
    await expect(friendHub.getByRole('button', { name: /שח(קי|ק) עכשיו/ })).toBeVisible({ timeout: 20_000 });

    const [contestId] = await pairContests();
    await expect.poll(async () => (await readDocument(`contests/${contestId}`))?.status).toBe('accepted');

    await friendPage.context().close();
  });

  test('cancelling a sent request removes it for both learners', async ({ page, browser, baseURL, learner }) => {
    const friend = newTestLearner();
    const friendPage = await openSecondLearner(browser, baseURL, () => page.viewportSize());
    await startAsNewLearner(page, learner, { name: 'נועה', age: 14 });
    await startAsNewLearner(friendPage, friend, { name: 'דני', age: 14 });
    const uid = await findUid(learner.username);
    await expect.poll(async () => (await readDocument(`friendCodeOwners/${uid}`))?.code ?? null, { timeout: 30_000 }).not.toBeNull();
    const code = String((await readDocument(`friendCodeOwners/${uid}`))?.code);

    const friendHub = await openFriendsHub(friendPage);
    await friendHub.getByLabel('קוד חבר או שם משתמש').fill(code);
    await friendHub.getByRole('button', { name: 'חיפוש' }).click();
    await friendHub.getByRole('button', { name: 'שליחת בקשת חברות' }).click();
    await expect(friendHub.getByText(/הבקשה נשלחה ל/)).toBeVisible();

    // Cancelling a sent request removes it on both sides
    const pairId = await pairIdOf(learner, friend);
    expect(await listDocumentIds('friendships')).toContain(pairId);
    await friendHub.getByRole('button', { name: /ביטול הבקשה ל/ }).click();
    await expect.poll(async () => listDocumentIds('friendships')).not.toContain(pairId);
    const hub = await openFriendsHub(page);
    await expect(hub.getByRole('region', { name: 'בקשות חברות' })).toBeHidden();

    await friendPage.context().close();
  });
});
