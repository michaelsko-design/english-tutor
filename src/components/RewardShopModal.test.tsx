import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getRewardShopItems, RewardShopItem } from '../data/rewardShop';
import { LearnerGender } from '../types/learner';
import { TEST_THEME } from '../test/fixtures';
import { RewardShopModal } from './RewardShopModal';

function renderShop(props: { diamonds?: number; unlockedRewardIds?: string[]; gender?: LearnerGender } = {}) {
  const handlers = { onBuyReward: vi.fn(), onEquipAvatar: vi.fn(), onClose: vi.fn() };
  render(
    <RewardShopModal
      diamonds={props.diamonds ?? 0}
      unlockedRewardIds={props.unlockedRewardIds ?? []}
      equippedAvatarEmoji=""
      streakShieldsLeft={0}
      gender={props.gender ?? 'girl'}
      learnerName="נועה"
      theme={TEST_THEME}
      {...handlers}
    />
  );
  return handlers;
}

const paidAvatar = (gender: LearnerGender = 'girl'): RewardShopItem => {
  const item = getRewardShopItems(gender).find((i) => i.category === 'avatar' && i.costDiamonds > 0);
  if (!item) throw new Error('the shop has no paid avatar');
  return item;
};

/** The item's card: the closest ancestor of its title that holds a button */
function cardOf(item: RewardShopItem): HTMLElement {
  let node: HTMLElement | null = screen.getByRole('heading', { name: item.titleHe });
  while (node && !within(node).queryByRole('button')) node = node.parentElement;
  if (!node) throw new Error(`no card for ${item.id}`);
  return node;
}

describe('RewardShopModal', () => {
  it('opens as a labelled modal dialog with focus inside it', () => {
    renderShop();

    const dialog = screen.getByRole('dialog', { name: 'חנות הפרסים' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('buys an item the learner can afford', async () => {
    const item = paidAvatar();
    const { onBuyReward } = renderShop({ diamonds: item.costDiamonds });

    await userEvent.click(within(cardOf(item)).getByRole('button'));

    expect(onBuyReward).toHaveBeenCalledWith(item);
    expect(screen.getByText(new RegExp(`תתחדשי נועה! פתחת את "${item.titleHe}"`))).toBeInTheDocument();
  });

  it.each([
    ['girl', 'השלימי משימה'],
    ['boy', 'השלם משימה'],
  ] as const)('tells a %s how many diamonds are missing instead of buying', async (gender, nudge) => {
    const item = paidAvatar(gender);
    const { onBuyReward } = renderShop({ diamonds: item.costDiamonds - 10, gender });

    await userEvent.click(within(cardOf(item)).getByRole('button'));

    expect(onBuyReward).not.toHaveBeenCalled();
    expect(screen.getByText(new RegExp(`חסרים לך עוד 10 .* ${nudge}`))).toBeInTheDocument();
  });

  it('equips an avatar the learner already owns', async () => {
    const item = paidAvatar();
    const { onBuyReward, onEquipAvatar } = renderShop({ unlockedRewardIds: [item.id] });

    await userEvent.click(within(cardOf(item)).getByRole('button', { name: 'בחרי כאווטאר ראשי' }));

    expect(onEquipAvatar).toHaveBeenCalledWith(item.emoji);
    expect(onBuyReward).not.toHaveBeenCalled();
  });

  it('filters the items by category', async () => {
    const items = getRewardShopItems('girl');
    const avatar = items.find((i) => i.category === 'avatar')!;
    const sticker = items.find((i) => i.category === 'sticker')!;
    renderShop();

    await userEvent.click(screen.getByRole('button', { name: /אלבום מדבקות/ }));

    expect(screen.getByRole('heading', { name: sticker.titleHe })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: avatar.titleHe })).not.toBeInTheDocument();
  });

  it('closes on Escape and on the close button', async () => {
    const { onClose } = renderShop();

    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'סגירה' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
