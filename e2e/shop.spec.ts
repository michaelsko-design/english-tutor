import { getRewardShopItems } from '../src/data/rewardShop';
import { findUid, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import { expectDashboard, readHudDiamonds, startAsNewLearner } from './support/app';

test.describe('reward shop', () => {
  test('buys an avatar with the welcome diamonds, and the purchase is kept', async ({ page, learner }) => {
    await startAsNewLearner(page, learner, { name: 'נועה', age: 9 });
    const startDiamonds = await readHudDiamonds(page);
    const avatar = getRewardShopItems('girl').find(
      (item) => item.category === 'avatar' && item.costDiamonds > 0 && item.costDiamonds <= startDiamonds
    );
    if (!avatar) throw new Error(`no avatar costs ${startDiamonds} diamonds or less`);

    await page.getByRole('button', { name: /פתיחת החנות/ }).click();
    const shop = page.getByRole('dialog', { name: 'חנות הפרסים' });
    // The item's card: the nearest box around its title that holds a button
    const card = shop.getByRole('heading', { name: avatar.titleHe }).locator('xpath=ancestor::div[.//button][1]');
    await card.getByRole('button').click();
    await expect(shop.getByText(new RegExp(`פתחת את "${avatar.titleHe}"`))).toBeVisible();
    // A bought avatar is put on at once
    await expect(card.getByRole('button', { name: /האווטאר הפעיל שלך/ })).toBeVisible();
    await shop.getByRole('button', { name: 'סגירה' }).click();

    const expectedDiamonds = startDiamonds - avatar.costDiamonds;
    await expect.poll(() => readHudDiamonds(page)).toBe(expectedDiamonds);

    // Saved to the cloud, and still there after a reload
    const uid = await findUid(learner.username);
    await expect
      .poll(async () => (await readDocument(`learners/${uid}`))?.unlockedRewardIds)
      .toContain(avatar.id);
    await page.reload();
    await expectDashboard(page);
    await expect.poll(() => readHudDiamonds(page)).toBe(expectedDiamonds);
  });
});
