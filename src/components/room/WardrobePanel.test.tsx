import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { LearnerProfile } from '../../types/learner';
import { WardrobePanel } from './WardrobePanel';

vi.mock('./DressedAvatar', () => ({ DressedAvatar: () => <span>avatar</span> }));
vi.mock('./NameItemPanel', () => ({
  NameItemPanel: (p: { item: { nameEn: string }; modes: string[]; onNamed: (m: string) => void; onCancel: () => void }) => (
    <div>
      <span>{`naming:${p.item.nameEn}:${p.modes.join(',')}`}</span>
      <button type="button" onClick={() => p.onNamed('say')}>named</button>
      <button type="button" onClick={p.onCancel}>cancel-naming</button>
    </div>
  ),
}));

const onUpdateProfile = vi.fn();
const onClose = vi.fn();

function setup(profile: LearnerProfile = makeProfile({ gender: 'girl' }), avatarEmoji = '👧') {
  render(
    <WardrobePanel
      profile={profile}
      avatarEmoji={avatarEmoji}
      theme={TEST_THEME}
      onUpdateProfile={onUpdateProfile}
      onSpeakEnglish={vi.fn()}
      onClose={onClose}
    />
  );
  return userEvent.setup();
}

const item = (name: RegExp) => screen.getByRole('button', { name });
const lastUpdate = (): LearnerProfile => onUpdateProfile.mock.calls[onUpdateProfile.mock.calls.length - 1][0];

beforeEach(() => {
  onUpdateProfile.mockClear();
  onClose.mockClear();
});

describe('WardrobePanel', () => {
  it('lists the starter items and today’s dress-up progress', () => {
    setup();
    expect(item(/כובע מצחייה/)).toBeInTheDocument();
    expect(item(/משקפיים/)).toBeInTheDocument();
    expect(screen.getByText(/היום: 0\/3 פריטים/)).toBeInTheDocument();
  });

  it('asks for the item’s name first, offering all three ways for an explorer', async () => {
    const user = setup(makeProfile({ preferredTier: 'explorer' }));
    await user.click(item(/כובע מצחייה/));
    expect(screen.getByText('naming:cap:say,choose,spell')).toBeInTheDocument();
  });

  it('offers saying or spelling for a challenger', async () => {
    const user = setup(makeProfile({ preferredTier: 'challenger' }));
    await user.click(item(/כובע מצחייה/));
    expect(screen.getByText('naming:cap:say,spell')).toBeInTheDocument();
  });

  it('offers fewer ways for a master and goes back on cancel', async () => {
    const user = setup(makeProfile({ preferredTier: 'master' }));
    await user.click(item(/משקפיים/));
    expect(screen.getByText('naming:glasses:spell')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'cancel-naming' }));
    expect(item(/משקפיים/)).toBeInTheDocument();
  });

  it('puts the item on once it is named and says so', async () => {
    const user = setup();
    await user.click(item(/כובע מצחייה/));
    await user.click(screen.getByRole('button', { name: 'named' }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('לבשת cap');
    expect(lastUpdate().room?.outfit).toBeDefined();
  });

  it('takes a worn item off with a tap', async () => {
    const user = setup();
    await user.click(item(/כובע מצחייה/));
    await user.click(screen.getByRole('button', { name: 'named' }));
    const worn = lastUpdate();
    onUpdateProfile.mockClear();
    const view = render(
      <WardrobePanel profile={worn} avatarEmoji="👧" theme={TEST_THEME} onUpdateProfile={onUpdateProfile} onSpeakEnglish={vi.fn()} onClose={onClose} />
    );
    const wornButtons = view.getAllByRole('button', { name: /כובע מצחייה/ }).filter((b) => b.getAttribute('aria-pressed') === 'true');
    expect(wornButtons.length).toBeGreaterThan(0);
    await user.click(wornButtons[0]);
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('status').some((s) => /הורדת/.test(s.textContent ?? ''))).toBe(true);
  });

  it('keeps clothes off an animal avatar and explains why', async () => {
    const user = setup(makeProfile({}), '🦊');
    expect(screen.getByText(/אווטאר של חיה לובש אקססוריז/)).toBeInTheDocument();
    await user.click(item(/חולצה/));
    expect(screen.getByRole('status')).toHaveTextContent('רק אווטארים של ילדה או ילד');
    expect(screen.queryByText(/^naming:/)).not.toBeInTheDocument();
  });

  it('celebrates the daily reward after the third item', async () => {
    const profile = makeProfile({ gender: 'girl' });
    const user = setup(profile);
    for (const name of [/כובע מצחייה/, /משקפיים/, /צעיף/]) {
      await user.click(item(name));
      await user.click(screen.getByRole('button', { name: 'named' }));
    }
    expect(onUpdateProfile).toHaveBeenCalledTimes(3);
  });

  it('closes through the panel frame', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'חזרה לחדר' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
